import { describe, expect, it } from 'vitest'

import { buildSearchText, normalizeForSearch } from '@/lib/search-text'

describe('normalizeForSearch (D-014)', () => {
  it('lowercases and removes Latin diacritics', () => {
    expect(normalizeForSearch('Rāmeśvaram')).toBe('ramesvaram')
    expect(normalizeForSearch('  Kashi   Vishwanath ')).toBe('kashi vishwanath')
  })

  it('keeps Devanagari marks intact', () => {
    // Virama (्) and matras are combining marks outside the Latin range; they must survive.
    expect(normalizeForSearch('त्र्यम्बकेश्वर')).toBe('त्र्यम्बकेश्वर')
    expect(normalizeForSearch('केदारनाथ')).toBe('केदारनाथ')
  })
})

describe('buildSearchText', () => {
  it('joins parts, skipping empty values and duplicates', () => {
    expect(buildSearchText(['Kedarnath Temple', null, 'Kedarnath Temple', '', 'Uttarakhand'])).toBe(
      'kedarnath temple uttarakhand',
    )
  })
})
