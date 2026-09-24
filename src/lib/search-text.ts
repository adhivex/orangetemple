/**
 * Search normalisation (D-014). Used by the seed to build Temple.searchText and, in
 * Phase 5, to normalise the query the same way on the application side.
 *
 * - Lowercases.
 * - Removes Latin combining diacritics only (U+0300–U+036F), so "Rāmeśvaram" matches
 *   "rameswaram"-style queries. Devanagari marks (virama, nukta, matras) are
 *   deliberately kept: stripping them would corrupt native-script names.
 * - Collapses whitespace.
 */
export function normalizeForSearch(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .normalize('NFC')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim()
}

/** Joins the searchable fields of a temple into one normalised, de-duplicated string. */
export function buildSearchText(parts: (string | null | undefined)[]): string {
  const seen = new Set<string>()
  for (const part of parts) {
    if (!part) continue
    const normalized = normalizeForSearch(part)
    if (normalized) seen.add(normalized)
  }
  return [...seen].join(' ')
}
