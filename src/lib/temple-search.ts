import { normalizeForSearch } from './search-text'

/**
 * One published temple in the search overlay (HOMEPAGE_SPEC.md "Search overlay", D-048).
 * Built on the server from the database; the overlay filters it in the browser.
 */
export type SearchEntry = {
  slug: string
  /** Short name shown in results (D-054). */
  name: string
  state: string
  region: string
  /** Collection names, e.g. ["12 Jyotirlingas", "Char Dham"]. */
  groups: string[]
  /** Normalised text matched against the query: names, alternates, state, region, groups. */
  haystack: string
}

/**
 * Temples whose searchable text contains every word of the query, names that start with
 * the query first. An empty query returns everything, in the given order.
 */
export function filterTemples(entries: SearchEntry[], query: string): SearchEntry[] {
  const q = normalizeForSearch(query)
  if (!q) return entries
  const words = q.split(' ')
  const matches = entries.filter((entry) => words.every((word) => entry.haystack.includes(word)))
  const startsWith = (entry: SearchEntry) => (normalizeForSearch(entry.name).startsWith(q) ? 0 : 1)
  return matches
    .map((entry, index) => ({ entry, index }))
    .sort((a, b) => startsWith(a.entry) - startsWith(b.entry) || a.index - b.index)
    .map(({ entry }) => entry)
}
