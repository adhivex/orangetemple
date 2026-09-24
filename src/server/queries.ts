import { cacheLife, cacheTag } from 'next/cache'

import { getDb } from '@/lib/db'
import { REGIONS } from '@/lib/regions'

import { collectionCardSelect, templeCardSelect } from './shapes'

/*
 * Server-side data layer (ARCHITECTURE.md §2, AI-CODING-RULES.md §10). Every public read
 * filters to PUBLISHED. Reads are cached ('use cache') for the life of the content and
 * tagged CONTENT_TAG, so pages prerender at build and refresh on demand when
 * /api/revalidate is called after seeding (D-015).
 */
export const CONTENT_TAG = 'content'

function cacheContent() {
  cacheLife('max')
  cacheTag(CONTENT_TAG)
}

/** A published collection and its published temples, in display order. */
export async function getCollectionWithTemples(slug: string) {
  'use cache'
  cacheContent()
  return getDb().collection.findFirst({
    where: { slug, status: 'PUBLISHED' },
    select: {
      ...collectionCardSelect,
      introduction: true,
      temples: {
        where: { temple: { status: 'PUBLISHED' } },
        orderBy: { displayOrder: 'asc' },
        select: { temple: { select: templeCardSelect } },
      },
    },
  })
}

export type Tile = { slug: string; name: string; count: number }

/**
 * "Explore by deity" tiles (D-007): deities with at least one published temple, featured
 * first, then by display order.
 */
export async function getDeityTiles(): Promise<Tile[]> {
  'use cache'
  cacheContent()
  const deities = await getDb().deity.findMany({
    orderBy: [{ isFeatured: 'desc' }, { displayOrder: 'asc' }],
    select: {
      slug: true,
      name: true,
      _count: { select: { temples: { where: { status: 'PUBLISHED' } } } },
    },
  })
  return deities
    .map((d) => ({ slug: d.slug, name: d.name, count: d._count.temples }))
    .filter((tile) => tile.count > 0)
}

/** "Explore by region" tiles (D-007): regions with at least one published temple. */
export async function getRegionTiles(): Promise<Tile[]> {
  'use cache'
  cacheContent()
  const counts = await getDb().temple.groupBy({
    by: ['stateId'],
    where: { status: 'PUBLISHED' },
    _count: { _all: true },
  })
  const states = await getDb().state.findMany({
    where: { id: { in: counts.map((c) => c.stateId) } },
    select: { id: true, region: true },
  })
  const regionOf = new Map(states.map((s) => [s.id, s.region]))
  const totals = new Map<string, number>()
  for (const c of counts) {
    const region = regionOf.get(c.stateId)
    if (region) totals.set(region, (totals.get(region) ?? 0) + c._count._all)
  }
  return REGIONS.filter((r) => (totals.get(r.value) ?? 0) > 0).map((r) => ({
    slug: r.param,
    name: r.label,
    count: totals.get(r.value)!,
  }))
}

/** Totals for the homepage hero, derived from published content only. */
export async function getCatalogueStats() {
  'use cache'
  cacheContent()
  const [temples, states] = await Promise.all([
    getDb().temple.count({ where: { status: 'PUBLISHED' } }),
    getDb().state.count({ where: { temples: { some: { status: 'PUBLISHED' } } } }),
  ])
  return { temples, states }
}

/** A collection page (PRD §8): the collection, its ordered temples and related collections. */
export async function getCollectionPage(slug: string) {
  'use cache'
  cacheContent()
  return getDb().collection.findFirst({
    where: { slug, status: 'PUBLISHED' },
    select: {
      ...collectionCardSelect,
      introduction: true,
      updatedAt: true,
      temples: {
        where: { temple: { status: 'PUBLISHED' } },
        orderBy: { displayOrder: 'asc' },
        select: { temple: { select: templeCardSelect } },
      },
      related: {
        where: { relatedCollection: { status: 'PUBLISHED' } },
        orderBy: { displayOrder: 'asc' },
        select: { relatedCollection: { select: collectionCardSelect } },
      },
    },
  })
}

export type StateEntry = { slug: string; name: string; count: number }
export type RegionGroup = { param: string; label: string; count: number; states: StateEntry[] }

/** Explore Bharat (D-006): regions, then states with at least one published temple. */
export async function getStatesByRegion(): Promise<RegionGroup[]> {
  'use cache'
  cacheContent()
  const states = await getDb().state.findMany({
    where: { temples: { some: { status: 'PUBLISHED' } } },
    orderBy: { name: 'asc' },
    select: {
      slug: true,
      name: true,
      region: true,
      _count: { select: { temples: { where: { status: 'PUBLISHED' } } } },
    },
  })
  return REGIONS.map((region) => {
    const inRegion = states
      .filter((s) => s.region === region.value)
      .map((s) => ({ slug: s.slug, name: s.name, count: s._count.temples }))
    return {
      param: region.param,
      label: region.label,
      count: inRegion.reduce((n, s) => n + s.count, 0),
      states: inRegion,
    }
  }).filter((group) => group.states.length > 0)
}

/** Credits (CONTENT-MODEL.md §7): licensed images and references of published temples. */
export async function getCredits() {
  'use cache'
  cacheContent()
  return getDb().temple.findMany({
    where: {
      status: 'PUBLISHED',
      OR: [{ images: { some: { isPlaceholder: false } } }, { references: { some: {} } }],
    },
    orderBy: { name: 'asc' },
    select: {
      slug: true,
      name: true,
      images: {
        where: { isPlaceholder: false },
        orderBy: [{ imageType: 'asc' }, { displayOrder: 'asc' }],
        select: { publicId: true, altText: true, credit: true, licenseType: true, sourceUrl: true },
      },
      references: {
        orderBy: { displayOrder: 'asc' },
        select: { title: true, url: true, citation: true },
      },
    },
  })
}

/** Sitemap data (ROUTES.md §4.6): published records only, with their last update. */
export async function getSitemapData() {
  'use cache'
  cacheContent()
  const [temples, collections] = await Promise.all([
    getDb().temple.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { name: 'asc' },
      select: { slug: true, updatedAt: true },
    }),
    getDb().collection.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { displayOrder: 'asc' },
      select: { slug: true, updatedAt: true },
    }),
  ])
  return { temples, collections }
}
