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
