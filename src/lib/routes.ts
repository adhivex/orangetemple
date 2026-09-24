/**
 * Canonical URLs (docs/ROUTES.md). Build every internal link through these helpers so
 * canonical rules live in one place.
 */

/** Collections with a vanity URL (D-008). All others use /collections/[slug]. */
const VANITY_COLLECTIONS = new Set(['jyotirlingas', 'char-dham'])

export function templeHref(slug: string) {
  return `/temples/${slug}`
}

export function collectionHref(slug: string) {
  return VANITY_COLLECTIONS.has(slug) ? `/${slug}` : `/collections/${slug}`
}

export function isVanityCollection(slug: string) {
  return VANITY_COLLECTIONS.has(slug)
}

export type DirectoryParams = {
  q?: string
  deity?: string
  state?: string
  region?: string
  collection?: string
  page?: number
}

/** /temples with query parameters in the documented order; empty values are omitted. */
export function directoryHref(params: DirectoryParams = {}) {
  const search = new URLSearchParams()
  const { q, deity, state, region, collection, page } = params
  if (q?.trim()) search.set('q', q.trim())
  if (deity) search.set('deity', deity)
  if (state) search.set('state', state)
  if (region) search.set('region', region)
  if (collection) search.set('collection', collection)
  if (page && page > 1) search.set('page', String(page))
  const query = search.toString()
  return query ? `/temples?${query}` : '/temples'
}
