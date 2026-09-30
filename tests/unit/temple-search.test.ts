import { describe, expect, it } from 'vitest'

import { buildSearchText } from '@/lib/search-text'
import { filterTemples, type SearchEntry } from '@/lib/temple-search'

function entry(
  name: string,
  state: string,
  region: string,
  groups: string[],
  alternates: string[] = [],
): SearchEntry {
  return {
    slug: name.toLowerCase().replace(/\s+/g, '-'),
    name,
    state,
    region,
    groups,
    haystack: buildSearchText([name, ...alternates, state, region, ...groups]),
  }
}

const entries = [
  entry('Somnath', 'Gujarat', 'West', ['12 Jyotirlingas'], ['Somanatha']),
  entry('Nageshwar', 'Gujarat', 'West', ['12 Jyotirlingas']),
  entry('Rameshwaram', 'Tamil Nadu', 'South', ['12 Jyotirlingas', 'Char Dham'], ['Rāmeśvaram']),
  entry('Dwarkadhish', 'Gujarat', 'West', ['Char Dham']),
  entry('Badrinath', 'Uttarakhand', 'North', ['Char Dham']),
]

const names = (query: string) => filterTemples(entries, query).map((e) => e.name)

describe('filterTemples (D-048)', () => {
  it('returns every temple for an empty query, in order', () => {
    expect(names('  ')).toEqual(entries.map((e) => e.name))
  })

  it('matches name, state, region and collection', () => {
    expect(names('guj')).toEqual(['Somnath', 'Nageshwar', 'Dwarkadhish'])
    expect(names('South')).toEqual(['Rameshwaram'])
    expect(names('char dham')).toEqual(['Rameshwaram', 'Dwarkadhish', 'Badrinath'])
  })

  it('needs every word to match, in any order', () => {
    expect(names('dham gujarat')).toEqual(['Dwarkadhish'])
  })

  it('puts names that start with the query first', () => {
    const results = filterTemples(
      [
        entry('Kedarnath', 'Uttarakhand', 'North', []),
        entry('Badrinath', 'Uttarakhand', 'North', []),
      ],
      'badri',
    )
    expect(results.map((e) => e.name)).toEqual(['Badrinath'])
    expect(names('n')[0]).toBe('Nageshwar')
  })

  it('ignores case and Latin diacritics', () => {
    expect(names('RĀMEŚVARAM')).toEqual(['Rameshwaram'])
    expect(names('somanatha')).toEqual(['Somnath'])
  })

  it('returns nothing when nothing matches', () => {
    expect(names('qqqzzz')).toEqual([])
  })
})
