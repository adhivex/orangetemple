import { cacheLife, cacheTag } from 'next/cache'

import { PAGE_SIZE, type DirectoryFilters, type FilterOptions } from '@/lib/directory'
import { REGIONS, regionFromParam } from '@/lib/regions'
import { normalizeForSearch } from '@/lib/search-text'
import { getSupabase, unwrap } from '@/lib/supabase'

import { CONTENT_TAG } from './queries'
import { TEMPLE_CARD_SELECT, toTempleCard, type TempleCardData } from './shapes'

/*
 * Directory reads (PRD §6, D-014). Results are cached per filter combination and share
 * the content tag, so revalidation after seeding refreshes every cached search.
 */

export type DirectoryResult = {
  temples: TempleCardData[]
  total: number
  page: number
  pageCount: number
}

/** What `search_temples` returns (supabase/migrations/*_search.sql). */
type SearchPage = { total: number; page: number; ids: string[] }

/**
 * Searches and filters published temples. With a query, results are ranked: names that
 * start with the query first, then by trigram word similarity (tolerates typos and
 * transliteration variants). Without one, alphabetical.
 *
 * Matching, ranking, the total and page clamping run in the database function
 * `search_temples`, with its 0.5 word-similarity threshold (D-037, D-043); only
 * published temples and collections can match.
 */
export async function searchTemples(filters: DirectoryFilters): Promise<DirectoryResult> {
  'use cache'
  cacheLife('max')
  cacheTag(CONTENT_TAG)

  const db = getSupabase()
  const query = filters.q ? normalizeForSearch(filters.q) : ''
  const result = unwrap(
    await db.rpc('search_temples', {
      search_query: query || undefined,
      deity_slug: filters.deity || undefined,
      state_slug: filters.state || undefined,
      region_code: regionFromParam(filters.region) ?? undefined,
      collection_slug: filters.collection || undefined,
      page_number: filters.page,
      page_size: PAGE_SIZE,
    }),
  ) as SearchPage

  const cards =
    result.ids.length === 0
      ? []
      : unwrap(await db.from('temples').select(`id, ${TEMPLE_CARD_SELECT}`).in('id', result.ids))
  const byId = new Map(cards.map((row) => [row.id, toTempleCard(row)]))

  return {
    temples: result.ids.map((id) => byId.get(id)).filter((c): c is TempleCardData => Boolean(c)),
    total: result.total,
    page: result.page,
    pageCount: Math.max(1, Math.ceil(result.total / PAGE_SIZE)),
  }
}

/** Filter choices: only values that have at least one published temple. */
export async function getFilterOptions(): Promise<FilterOptions> {
  'use cache'
  cacheLife('max')
  cacheTag(CONTENT_TAG)

  const db = getSupabase()
  // Embedded counts see published temples only (RLS), so a zero count means "unused".
  const [deities, states, collections] = await Promise.all([
    db
      .from('deities')
      .select('slug, name, published_temples:temples(count)')
      .order('is_featured', { ascending: false })
      .order('display_order'),
    db.from('states').select('slug, name, region, published_temples:temples(count)').order('name'),
    db
      .from('collections')
      .select('slug, name, published_temples:collection_temples(count)')
      .eq('status', 'PUBLISHED')
      .order('display_order'),
  ])
  const used = <T extends { published_temples: { count: number }[] }>(rows: T[]) =>
    rows.filter((row) => (row.published_temples[0]?.count ?? 0) > 0)

  const statesInUse = used(unwrap(states))
  const regionsInUse = new Set(statesInUse.map((s) => s.region))

  return {
    deities: used(unwrap(deities)).map((d) => ({ value: d.slug, label: d.name })),
    states: statesInUse.map((s) => ({ value: s.slug, label: s.name })),
    regions: REGIONS.filter((r) => regionsInUse.has(r.value)).map((r) => ({
      value: r.param,
      label: r.label,
    })),
    collections: used(unwrap(collections)).map((c) => ({ value: c.slug, label: c.name })),
  }
}
