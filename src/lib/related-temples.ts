/**
 * Related temples (DATABASE-SCHEMA.md §5): not stored. Up to `limit` published temples,
 * excluding the current one, ranked: shares a collection, then same deity, then same
 * state. Ties keep the candidates' incoming order, so callers control the tie-break.
 */

export type RelatedCandidate = {
  slug: string
  deitySlug: string
  stateSlug: string
  collectionSlugs: string[]
}

export function selectRelatedTemples<T extends RelatedCandidate>(
  current: RelatedCandidate,
  candidates: T[],
  limit = 4,
): T[] {
  const collections = new Set(current.collectionSlugs)
  const rank = (c: RelatedCandidate) => {
    if (c.collectionSlugs.some((slug) => collections.has(slug))) return 0
    if (c.deitySlug === current.deitySlug) return 1
    if (c.stateSlug === current.stateSlug) return 2
    return 3
  }

  return candidates
    .filter((c) => c.slug !== current.slug)
    .map((candidate, index) => ({ candidate, index, rank: rank(candidate) }))
    .filter((entry) => entry.rank < 3)
    .sort((a, b) => a.rank - b.rank || a.index - b.index)
    .slice(0, limit)
    .map((entry) => entry.candidate)
}
