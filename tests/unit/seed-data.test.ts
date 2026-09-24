import { describe, expect, it } from 'vitest'

import { seedData } from '../../prisma/seed-data'
import { SeedValidationError, validateSeedData } from '../../prisma/seed-data/validate'

const data = validateSeedData(seedData)
const bySlug = new Map(data.temples.map((t) => [t.slug, t]))
const collection = (slug: string) => data.collections.find((c) => c.slug === slug)!

/** Launch slugs and ordering from docs/SEED-DATA.md §1. */
const JYOTIRLINGAS = [
  'somnath',
  'mallikarjuna-srisailam',
  'mahakaleshwar-ujjain',
  'omkareshwar',
  'kedarnath',
  'bhimashankar',
  'kashi-vishwanath',
  'trimbakeshwar',
  'baidyanath-deoghar',
  'nageshwar-dwarka',
  'rameshwaram',
  'grishneshwar',
]
const CHAR_DHAM = ['badrinath', 'dwarkadhish-dwarka', 'jagannath-puri', 'rameshwaram']

describe('seed data (SEED-DATA.md §8.9)', () => {
  it('passes schema and cross-reference validation', () => {
    expect(() => validateSeedData(seedData)).not.toThrow()
  })

  it('has exactly 15 unique temple records (D-001)', () => {
    expect(data.temples).toHaveLength(15)
    expect(new Set(data.temples.map((t) => t.slug)).size).toBe(15)
  })

  it('has exactly one Rameshwaram record, in both collections', () => {
    const matches = data.temples.filter((t) => /rame(s|sh)waram/i.test(`${t.slug} ${t.name}`))
    expect(matches.map((t) => t.slug)).toEqual(['rameshwaram'])
    expect(collection('jyotirlingas').temples).toContain('rameshwaram')
    expect(collection('char-dham').temples).toContain('rameshwaram')
  })

  it('lists the 12 Jyotirlingas and 4 Char Dham in the documented order', () => {
    expect(collection('jyotirlingas').temples).toEqual(JYOTIRLINGAS)
    expect(collection('char-dham').temples).toEqual(CHAR_DHAM)
  })

  it('has 16 collection memberships across 15 temples', () => {
    const memberships = data.collections.flatMap((c) => c.temples)
    expect(memberships).toHaveLength(16)
    expect(new Set(memberships).size).toBe(15)
  })

  it('puts every temple in at least one collection', () => {
    const members = new Set(data.collections.flatMap((c) => c.temples))
    for (const temple of data.temples) expect(members, temple.slug).toContain(temple.slug)
  })

  it('has the required fields for every temple (CONTENT-MODEL.md §2)', () => {
    for (const t of data.temples) {
      for (const field of [
        'name',
        'slug',
        'shortDescription',
        'overview',
        'significance',
        'city',
      ] as const) {
        expect(t[field].trim(), `${t.slug}.${field}`).not.toBe('')
      }
      expect(t.shortDescription.length, `${t.slug}.shortDescription`).toBeLessThanOrEqual(200)
    }
  })

  it('gives disputed sites a location note (D-019)', () => {
    expect(bySlug.get('nageshwar-dwarka')?.locationNote).toMatch(/Aundha Nagnath/)
    expect(bySlug.get('baidyanath-deoghar')?.locationNote).toMatch(/Parli Vaijnath/)
  })

  it('distinguishes the Char Dham from the Chota Char Dham (D-018)', () => {
    expect(collection('char-dham').introduction).toMatch(/Chota Char Dham/)
    expect(collection('char-dham').subtitle).toBe(
      'The four dhams: Badrinath, Dwarka, Puri and Rameshwaram',
    )
  })

  it('assigns the documented deity to each temple', () => {
    const deityOf = Object.fromEntries(data.temples.map((t) => [t.slug, t.deity]))
    for (const slug of JYOTIRLINGAS) expect(deityOf[slug], slug).toBe('shiva')
    expect(deityOf).toMatchObject({
      badrinath: 'vishnu',
      'dwarkadhish-dwarka': 'krishna',
      'jagannath-puri': 'jagannath',
    })
  })

  it('features the first seven deities in the documented order', () => {
    const featured = data.deities
      .filter((d) => d.isFeatured)
      .sort((a, b) => a.displayOrder - b.displayOrder)
      .map((d) => d.slug)
    expect(featured).toEqual(['shiva', 'vishnu', 'devi', 'krishna', 'rama', 'hanuman', 'ganesha'])
  })

  it('does not publish unverified native names', () => {
    for (const t of data.temples) {
      if (!t.review.reviewed) expect(t.nameNative, t.slug).toBeNull()
    }
  })
})

describe('validateSeedData rejects bad content', () => {
  const clone = () => structuredClone(seedData)

  it('reports an unknown state and a duplicate slug together', () => {
    const bad = clone()
    bad.temples[0] = { ...bad.temples[0]!, state: 'atlantis' }
    bad.temples.push({ ...bad.temples[1]! })
    try {
      validateSeedData(bad)
      expect.unreachable()
    } catch (error) {
      expect(error).toBeInstanceOf(SeedValidationError)
      const problems = (error as SeedValidationError).problems.join('\n')
      expect(problems).toMatch(/unknown state "atlantis"/)
      expect(problems).toMatch(/duplicate temple slug "mallikarjuna-srisailam"/)
    }
  })

  it('rejects raw HTML in Markdown fields (D-003)', () => {
    const bad = clone()
    bad.temples[0] = { ...bad.temples[0]!, overview: 'Hello <script>alert(1)</script>' }
    expect(() => validateSeedData(bad)).toThrow(/raw HTML is not allowed/)
  })

  it('rejects a collection member that is not a temple', () => {
    const bad = clone()
    bad.collections[0] = { ...bad.collections[0]!, temples: ['not-a-temple'] }
    expect(() => validateSeedData(bad)).toThrow(/unknown temple "not-a-temple"/)
  })
})
