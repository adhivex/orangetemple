import { cacheLife, cacheTag } from 'next/cache'

import { selectRelatedTemples } from '@/lib/related-temples'
import { getSupabase, unwrap } from '@/lib/supabase'

import { CONTENT_TAG } from './queries'
import {
  TEMPLE_CARD_SELECT,
  TEMPLE_DETAIL_SELECT,
  toTempleCard,
  toTempleDetail,
  type TempleCardData,
  type TempleDetail,
} from './shapes'

/* Temple page reads (PRD §7). Published only; cached and tagged like all content. */

function cacheContent() {
  cacheLife('max')
  cacheTag(CONTENT_TAG)
}

export async function getPublishedTempleSlugs(): Promise<string[]> {
  'use cache'
  cacheContent()
  const rows = unwrap(
    await getSupabase().from('temples').select('slug').eq('status', 'PUBLISHED').order('name'),
  )
  return rows.map((r) => r.slug)
}

export async function getTempleBySlug(slug: string): Promise<TempleDetail | null> {
  'use cache'
  cacheContent()
  const row = unwrap(
    await getSupabase()
      .from('temples')
      .select(TEMPLE_DETAIL_SELECT)
      .eq('slug', slug)
      .eq('status', 'PUBLISHED')
      .maybeSingle(),
  )
  return row && toTempleDetail(row)
}

/** Current slug for a retired one, if the temple is still published (ROUTES.md §4.5). */
export async function getRedirectSlug(oldSlug: string): Promise<string | null> {
  'use cache'
  cacheContent()
  const redirect = unwrap(
    await getSupabase()
      .from('slug_redirects')
      .select('temple:temples(slug, status)')
      .eq('old_slug', oldSlug)
      .maybeSingle(),
  )
  return redirect?.temple?.status === 'PUBLISHED' ? redirect.temple.slug : null
}

/** Up to four related temples (DATABASE-SCHEMA.md §5), as cards. */
export async function getRelatedTemples(slug: string): Promise<TempleCardData[]> {
  'use cache'
  cacheContent()
  const rows = unwrap(
    await getSupabase()
      .from('temples')
      .select(TEMPLE_CARD_SELECT)
      .eq('status', 'PUBLISHED')
      .order('name'),
  )
  const temples = rows.map(toTempleCard)
  const asCandidate = (t: TempleCardData) => ({
    slug: t.slug,
    deitySlug: t.deity.slug,
    stateSlug: t.state.slug,
    collectionSlugs: t.collections.map((c) => c.collection.slug),
    card: t,
  })
  const current = temples.find((t) => t.slug === slug)
  if (!current) return []
  return selectRelatedTemples(asCandidate(current), temples.map(asCandidate)).map((c) => c.card)
}

/**
 * Today's date, refreshed daily. Cache Components forbids a bare `new Date()` during
 * prerendering; visit-information freshness only needs day precision.
 */
export async function getToday(): Promise<Date> {
  'use cache'
  cacheLife('days')
  const now = new Date()
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()))
}
