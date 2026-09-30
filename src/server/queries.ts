import { cacheLife, cacheTag } from 'next/cache'

import { regionLabel, REGIONS } from '@/lib/regions'
import { buildSearchText } from '@/lib/search-text'
import { getSupabase, unwrap } from '@/lib/supabase'
import type { SearchEntry } from '@/lib/temple-search'

import {
  COLLECTION_CARD_SELECT,
  TEMPLE_CARD_SELECT,
  toCollectionCard,
  toDate,
  imageTypeRank,
  toTempleCard,
  type CollectionCardData,
  type LicenseType,
  type Region,
  type TempleCardData,
} from './shapes'

/*
 * Server-side data layer (ARCHITECTURE.md §2, AI-CODING-RULES.md §10, D-043). Every public
 * read filters to PUBLISHED; Row Level Security enforces the same in the database. Reads
 * are cached ('use cache') for the life of the content and tagged CONTENT_TAG, so pages
 * prerender at build and refresh on demand when /api/revalidate is called after seeding
 * (D-015).
 */
export const CONTENT_TAG = 'content'

function cacheContent() {
  cacheLife('max')
  cacheTag(CONTENT_TAG)
}

const byDisplayOrder = <T extends { display_order: number }>(a: T, b: T) =>
  a.display_order - b.display_order

export type CollectionWithTemples = CollectionCardData & {
  introduction: string | null
  temples: { temple: TempleCardData }[]
}

/** Collection memberships as cards: published temples only, in membership order. */
function toMemberCards(
  rows: { display_order: number; temple: Parameters<typeof toTempleCard>[0] | null }[],
) {
  return [...rows]
    .sort(byDisplayOrder)
    .flatMap((row) => (row.temple ? [{ temple: toTempleCard(row.temple) }] : []))
}

/** A published collection and its published temples, in display order. */
export async function getCollectionWithTemples(
  slug: string,
): Promise<CollectionWithTemples | null> {
  'use cache'
  cacheContent()
  const row = unwrap(
    await getSupabase()
      .from('collections')
      .select(
        `${COLLECTION_CARD_SELECT}, introduction, members:collection_temples(display_order, temple:temples(${TEMPLE_CARD_SELECT}))`,
      )
      .eq('slug', slug)
      .eq('status', 'PUBLISHED')
      .maybeSingle(),
  )
  if (!row) return null
  return {
    ...toCollectionCard(row),
    introduction: row.introduction,
    temples: toMemberCards(row.members),
  }
}

export type Tile = { slug: string; name: string; count: number }

/**
 * "Explore by deity" tiles (D-049): the featured deities in display order, each with its
 * published-temple count. A tile with no temples yet shows a "coming soon" toast.
 */
export async function getDeityTiles(): Promise<Tile[]> {
  'use cache'
  cacheContent()
  const deities = unwrap(
    await getSupabase()
      .from('deities')
      .select('slug, name, published_temples:temples(count)')
      .eq('is_featured', true)
      .order('display_order'),
  )
  return deities.map((d) => ({
    slug: d.slug,
    name: d.name,
    count: d.published_temples[0]?.count ?? 0,
  }))
}

/** "Explore by region" tiles (D-049): every region, with its published-temple count. */
export async function getRegionTiles(): Promise<Tile[]> {
  'use cache'
  cacheContent()
  const states = unwrap(
    await getSupabase().from('states').select('region, published_temples:temples(count)'),
  )
  const totals = new Map<Region, number>()
  for (const state of states) {
    const count = state.published_temples[0]?.count ?? 0
    totals.set(state.region, (totals.get(state.region) ?? 0) + count)
  }
  return REGIONS.map((r) => ({ slug: r.param, name: r.label, count: totals.get(r.value) ?? 0 }))
}

export type CollectionPageData = CollectionWithTemples & {
  updatedAt: Date
  related: { relatedCollection: CollectionCardData }[]
}

/** A collection page (PRD §8): the collection, its ordered temples and related collections. */
export async function getCollectionPage(slug: string): Promise<CollectionPageData | null> {
  'use cache'
  cacheContent()
  const row = unwrap(
    await getSupabase()
      .from('collections')
      .select(
        `${COLLECTION_CARD_SELECT}, introduction, updated_at, members:collection_temples(display_order, temple:temples(${TEMPLE_CARD_SELECT})), related:related_collections!related_collections_collection_id_fkey(display_order, collection:collections!related_collections_related_collection_id_fkey(${COLLECTION_CARD_SELECT}))`,
      )
      .eq('slug', slug)
      .eq('status', 'PUBLISHED')
      .maybeSingle(),
  )
  if (!row) return null
  return {
    ...toCollectionCard(row),
    introduction: row.introduction,
    updatedAt: toDate(row.updated_at),
    temples: toMemberCards(row.members),
    related: [...row.related]
      .sort(byDisplayOrder)
      .flatMap((r) =>
        r.collection ? [{ relatedCollection: toCollectionCard(r.collection) }] : [],
      ),
  }
}

export type StateEntry = { slug: string; name: string; count: number }
export type RegionGroup = { param: string; label: string; count: number; states: StateEntry[] }

/** Explore Bharat (D-006): regions, then states with at least one published temple. */
export async function getStatesByRegion(): Promise<RegionGroup[]> {
  'use cache'
  cacheContent()
  const rows = unwrap(
    await getSupabase()
      .from('states')
      .select('slug, name, region, published_temples:temples(count)')
      .order('name'),
  )
  const states = rows
    .map((s) => ({ ...s, count: s.published_temples[0]?.count ?? 0 }))
    .filter((s) => s.count > 0)
  return REGIONS.map((region) => {
    const inRegion = states
      .filter((s) => s.region === region.value)
      .map((s) => ({ slug: s.slug, name: s.name, count: s.count }))
    return {
      param: region.param,
      label: region.label,
      count: inRegion.reduce((n, s) => n + s.count, 0),
      states: inRegion,
    }
  }).filter((group) => group.states.length > 0)
}

export type CreditsEntry = {
  slug: string
  name: string
  images: {
    publicId: string
    altText: string
    credit: string
    licenseType: LicenseType
    sourceUrl: string | null
  }[]
  references: { title: string; url: string | null; citation: string | null }[]
}

/** Credits (CONTENT-MODEL.md §7): licensed images and references of published temples. */
export async function getCredits(): Promise<CreditsEntry[]> {
  'use cache'
  cacheContent()
  const temples = unwrap(
    await getSupabase()
      .from('temples')
      .select(
        'slug, name, images:temple_images(public_id, alt_text, credit, license_type, source_url, image_type, display_order), references:temple_references(title, url, citation, display_order)',
      )
      .eq('status', 'PUBLISHED')
      .eq('images.is_placeholder', false)
      .order('name'),
  )
  return temples
    .filter((t) => t.images.length > 0 || t.references.length > 0)
    .map((t) => ({
      slug: t.slug,
      name: t.name,
      images: [...t.images]
        .sort(
          (a, b) =>
            imageTypeRank(a.image_type) - imageTypeRank(b.image_type) ||
            a.display_order - b.display_order,
        )
        .map((i) => ({
          publicId: i.public_id,
          altText: i.alt_text,
          credit: i.credit,
          licenseType: i.license_type,
          sourceUrl: i.source_url,
        })),
      references: [...t.references]
        .sort(byDisplayOrder)
        .map(({ title, url, citation }) => ({ title, url, citation })),
    }))
}

export type SitemapData = {
  temples: { slug: string; updatedAt: Date }[]
  collections: { slug: string; updatedAt: Date }[]
}

/** Sitemap data (ROUTES.md §4.6): published records only, with their last update. */
export async function getSitemapData(): Promise<SitemapData> {
  'use cache'
  cacheContent()
  const db = getSupabase()
  const [temples, collections] = await Promise.all([
    db.from('temples').select('slug, updated_at').eq('status', 'PUBLISHED').order('name'),
    db
      .from('collections')
      .select('slug, updated_at')
      .eq('status', 'PUBLISHED')
      .order('display_order'),
  ])
  const toEntry = (r: { slug: string; updated_at: string }) => ({
    slug: r.slug,
    updatedAt: toDate(r.updated_at),
  })
  return {
    temples: unwrap(temples).map(toEntry),
    collections: unwrap(collections).map(toEntry),
  }
}

/**
 * The search overlay's index (D-048): every published temple with its short name, state,
 * region and collections, in collection order (Jyotirlingas, then Char Dham). Small
 * enough to send to the browser, which filters it as the visitor types.
 */
export async function getSearchEntries(): Promise<SearchEntry[]> {
  'use cache'
  cacheContent()
  const temples = unwrap(
    await getSupabase()
      .from('temples')
      .select(
        'slug, name, short_name, alternate_names, state:states(name, region), collections:collection_temples(display_order, collection:collections(name, display_order))',
      )
      .eq('status', 'PUBLISHED'),
  )
  const order = (t: (typeof temples)[number]) => {
    const first = [...t.collections]
      .filter((c) => c.collection)
      .sort((a, b) => a.collection!.display_order - b.collection!.display_order)[0]
    return first ? first.collection!.display_order * 1000 + first.display_order : Infinity
  }
  return [...temples]
    .sort((a, b) => order(a) - order(b) || a.name.localeCompare(b.name))
    .map((t) => {
      const state = t.state?.name ?? ''
      const region = t.state ? regionLabel(t.state.region) : ''
      const groups = [...t.collections]
        .filter((c) => c.collection)
        .sort((a, b) => a.collection!.display_order - b.collection!.display_order)
        .map((c) => c.collection!.name)
      const name = t.short_name ?? t.name
      return {
        slug: t.slug,
        name,
        state,
        region,
        groups,
        haystack: buildSearchText([name, t.name, ...t.alternate_names, state, region, ...groups]),
      }
    })
}
