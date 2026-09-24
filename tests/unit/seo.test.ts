import { describe, expect, it } from 'vitest'

import {
  breadcrumbJsonLd,
  collectionJsonLd,
  pageMetadata,
  serializeJsonLd,
  templeJsonLd,
} from '@/lib/seo'

const temple = {
  name: 'Kedarnath Temple',
  slug: 'kedarnath',
  alternateNames: ['Kedarnatha'],
  shortDescription: 'One of the twelve Jyotirlingas.',
  city: 'Kedarnath',
  address: null,
  state: { name: 'Uttarakhand' },
  latitude: null,
  longitude: null,
  officialWebsite: null,
  heroImageUrl: null,
}

describe('JSON-LD (ARCHITECTURE.md §9)', () => {
  it('escapes "<" so data cannot close the script tag', () => {
    expect(serializeJsonLd({ name: '</script><script>x' })).not.toContain('</script>')
  })

  it('builds HinduTemple with address, and no geo, image or sameAs when unknown', () => {
    const ld = templeJsonLd(temple) as unknown as Record<string, unknown>
    expect(ld['@type']).toBe('HinduTemple')
    expect(ld.address).toMatchObject({
      addressLocality: 'Kedarnath',
      addressRegion: 'Uttarakhand',
      addressCountry: 'IN',
    })
    expect(ld).not.toHaveProperty('geo')
    expect(ld).not.toHaveProperty('image')
    expect(ld).not.toHaveProperty('sameAs')
    expect(String(ld.url)).toMatch(/\/temples\/kedarnath$/)
  })

  it('adds geo only when both coordinates are known', () => {
    const withGeo = { ...temple, latitude: 30.1, longitude: 79.1 }
    const ld = templeJsonLd(withGeo) as unknown as Record<string, unknown>
    expect(ld.geo).toEqual({ '@type': 'GeoCoordinates', latitude: 30.1, longitude: 79.1 })
    expect(templeJsonLd({ ...temple, latitude: 30.1 })).not.toHaveProperty('geo')
  })

  it('numbers breadcrumb and collection items from 1, linking canonical temple URLs', () => {
    const crumbs = breadcrumbJsonLd([{ name: 'Home', path: '/' }, { name: 'Kedarnath Temple' }])
    expect(crumbs.itemListElement).toEqual([
      expect.objectContaining({ position: 1, name: 'Home', item: expect.stringMatching(/\/$/) }),
      expect.not.objectContaining({ item: expect.anything() }),
    ])
    const list = collectionJsonLd({
      name: 'Char Dham',
      description: 'The four dhams.',
      path: '/char-dham',
      temples: [
        { name: 'Badrinath Temple', slug: 'badrinath' },
        { name: 'Rameshwaram', slug: 'rameshwaram' },
      ],
    }) as unknown as Record<string, unknown>
    expect(list.numberOfItems).toBe(2)
    expect(list.itemListElement).toEqual([
      expect.objectContaining({ position: 1, url: expect.stringMatching(/\/temples\/badrinath$/) }),
      expect.objectContaining({
        position: 2,
        url: expect.stringMatching(/\/temples\/rameshwaram$/),
      }),
    ])
  })
})

describe('pageMetadata', () => {
  it('sets canonical, Open Graph and Twitter together', () => {
    const meta = pageMetadata({
      title: 'Char Dham',
      description: 'The four dhams.',
      path: '/char-dham',
    })
    expect(meta.alternates?.canonical).toBe('/char-dham')
    expect(meta.openGraph).toMatchObject({
      title: 'Char Dham · OrangeTemple',
      url: '/char-dham',
      locale: 'en_IN',
    })
    expect(meta.twitter).toMatchObject({ card: 'summary_large_image' })
  })
})
