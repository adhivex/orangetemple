import { describe, expect, it } from 'vitest'

import cloudinaryLoader from '@/lib/cloudinary-loader'
import { hasSearchOrFilter, parseDirectoryParams } from '@/lib/directory'
import { renderMarkdown } from '@/lib/markdown'
import { selectRelatedTemples } from '@/lib/related-temples'
import { collectionHref, directoryHref, templeHref } from '@/lib/routes'
import { formatMonthYear, isRecentlyVerified, shouldShowVisitDetails } from '@/lib/visit-info'

describe('routes (ROUTES.md, D-008)', () => {
  it('uses vanity URLs for the two launch collections only', () => {
    expect(collectionHref('jyotirlingas')).toBe('/jyotirlingas')
    expect(collectionHref('char-dham')).toBe('/char-dham')
    expect(collectionHref('shakti-peethas')).toBe('/collections/shakti-peethas')
    expect(templeHref('kedarnath')).toBe('/temples/kedarnath')
  })

  it('builds directory URLs in documented order, omitting empties and page 1', () => {
    expect(directoryHref()).toBe('/temples')
    expect(directoryHref({ q: '  kashi ', page: 1 })).toBe('/temples?q=kashi')
    expect(directoryHref({ region: 'north', deity: 'shiva', page: 3 })).toBe(
      '/temples?deity=shiva&region=north&page=3',
    )
  })
})

describe('parseDirectoryParams (ROUTES.md §3)', () => {
  it('ignores invalid values instead of failing', () => {
    expect(
      parseDirectoryParams({
        deity: 'Shiva!',
        region: 'atlantis',
        page: '-2',
        state: 'uttar-pradesh',
      }),
    ).toEqual({
      q: undefined,
      deity: undefined,
      state: 'uttar-pradesh',
      region: undefined,
      collection: undefined,
      page: 1,
    })
  })

  it('takes the first of repeated params and trims the query', () => {
    const f = parseDirectoryParams({ q: ['  Rameswaram ', 'x'], page: '2', region: 'south' })
    expect(f).toMatchObject({ q: 'Rameswaram', page: 2, region: 'south' })
    expect(hasSearchOrFilter(f)).toBe(true)
    expect(hasSearchOrFilter(parseDirectoryParams({ page: '3' }))).toBe(false)
  })
})

describe('selectRelatedTemples (DATABASE-SCHEMA.md §5)', () => {
  const current = {
    slug: 'kedarnath',
    deitySlug: 'shiva',
    stateSlug: 'uttarakhand',
    collectionSlugs: ['jyotirlingas'],
  }
  const t = (
    slug: string,
    deitySlug: string,
    stateSlug: string,
    collectionSlugs: string[] = [],
  ) => ({
    slug,
    deitySlug,
    stateSlug,
    collectionSlugs,
  })

  it('ranks shared collection, then deity, then state, and excludes the current temple', () => {
    const result = selectRelatedTemples(current, [
      t('badrinath', 'vishnu', 'uttarakhand', ['char-dham']),
      t('some-shiva-temple', 'shiva', 'goa'),
      t('kedarnath', 'shiva', 'uttarakhand', ['jyotirlingas']),
      t('somnath', 'shiva', 'gujarat', ['jyotirlingas']),
      t('unrelated', 'devi', 'kerala'),
    ])
    expect(result.map((r) => r.slug)).toEqual(['somnath', 'some-shiva-temple', 'badrinath'])
  })

  it('returns at most the limit', () => {
    const many = Array.from({ length: 10 }, (_, i) => t(`j${i}`, 'shiva', 'x', ['jyotirlingas']))
    expect(selectRelatedTemples(current, many)).toHaveLength(4)
  })
})

describe('visit information freshness (CONTENT-MODEL.md §3)', () => {
  const now = new Date('2026-09-24T00:00:00Z')
  const base = {
    timings: 'Open daily',
    entryRules: null,
    dressCode: null,
    photographyRules: null,
    bestTimeToVisit: null,
    seasonalAccess: null,
    howToReach: null,
    verificationSourceUrl: 'https://example.org/source',
  }

  it('treats verification within twelve months as current', () => {
    expect(isRecentlyVerified(new Date('2025-10-01Z'), now)).toBe(true)
    expect(isRecentlyVerified(new Date('2025-09-01Z'), now)).toBe(false)
    expect(isRecentlyVerified(null, now)).toBe(false)
  })

  it('shows details only when present, sourced and current', () => {
    expect(shouldShowVisitDetails({ ...base, lastVerifiedAt: new Date('2026-03-01Z') }, now)).toBe(
      true,
    )
    expect(shouldShowVisitDetails({ ...base, lastVerifiedAt: new Date('2024-01-01Z') }, now)).toBe(
      false,
    )
    expect(
      shouldShowVisitDetails(
        { ...base, verificationSourceUrl: null, lastVerifiedAt: new Date('2026-03-01Z') },
        now,
      ),
    ).toBe(false)
    expect(shouldShowVisitDetails(null, now)).toBe(false)
  })

  it('formats the verification month in UTC', () => {
    expect(formatMonthYear(new Date('2026-03-31T23:30:00Z'))).toBe('March 2026')
  })
})

describe('renderMarkdown (D-003)', () => {
  it('escapes raw HTML', () => {
    const html = renderMarkdown('Hello <script>alert(1)</script> **world**')
    expect(html).not.toContain('<script>')
    expect(html).toContain('&lt;script&gt;')
    expect(html).toContain('<strong>world</strong>')
  })

  it('drops javascript: links and marks external links', () => {
    expect(renderMarkdown('[x](javascript:alert(1))')).not.toContain('href="javascript:')
    expect(renderMarkdown('[src](https://example.org)')).toContain('rel="noopener noreferrer"')
  })

  it('never emits h1 or h2', () => {
    const html = renderMarkdown('# One\n\n## Two\n\n#### Four')
    expect(html).toContain('<h3>One</h3>')
    expect(html).toContain('<h4>Two</h4>')
    expect(html).toContain('<h6>Four</h6>')
    expect(html).not.toMatch(/<h[12]>/)
  })
})

describe('cloudinaryLoader (D-012)', () => {
  it('inserts format, quality and width after /upload/', () => {
    expect(
      cloudinaryLoader({
        src: 'https://res.cloudinary.com/demo/image/upload/v1/temples/somnath.jpg',
        width: 640,
      }),
    ).toBe(
      'https://res.cloudinary.com/demo/image/upload/f_auto,c_limit,w_640,q_auto/v1/temples/somnath.jpg',
    )
  })

  it('passes local files through with a width query', () => {
    expect(cloudinaryLoader({ src: '/placeholders/temple-hero.svg', width: 384 })).toBe(
      '/placeholders/temple-hero.svg?w=384',
    )
  })
})
