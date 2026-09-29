import type { z } from 'zod'

import { collectionSeedSchema, deitySeedSchema, stateSeedSchema, templeSeedSchema } from './schema'
import type { SeedData } from './index'

export type ValidatedSeedData = {
  states: z.output<typeof stateSeedSchema>[]
  deities: z.output<typeof deitySeedSchema>[]
  temples: z.output<typeof templeSeedSchema>[]
  collections: z.output<typeof collectionSeedSchema>[]
}

export class SeedValidationError extends Error {
  constructor(readonly problems: string[]) {
    super(`Seed data is invalid:\n${problems.map((p) => `  - ${p}`).join('\n')}`)
    this.name = 'SeedValidationError'
  }
}

function duplicates(values: string[]): string[] {
  const seen = new Set<string>()
  const dupes = new Set<string>()
  for (const value of values) (seen.has(value) ? dupes : seen).add(value)
  return [...dupes]
}

/**
 * Parses every seed record and checks cross-references. Collects all problems before
 * failing, so one run reports everything that needs fixing.
 */
export function validateSeedData(data: SeedData): ValidatedSeedData {
  const problems: string[] = []

  function parseAll<S extends z.ZodType>(kind: string, schema: S, items: unknown[]) {
    const parsed: z.output<S>[] = []
    items.forEach((item, index) => {
      const result = schema.safeParse(item)
      if (result.success) {
        parsed.push(result.data)
      } else {
        const label = (item as { slug?: string }).slug ?? `#${index}`
        for (const issue of result.error.issues) {
          problems.push(
            `${kind} "${label}": ${issue.path.join('.') || '(root)'} — ${issue.message}`,
          )
        }
      }
    })
    return parsed
  }

  const states = parseAll('state', stateSeedSchema, data.states)
  const deities = parseAll('deity', deitySeedSchema, data.deities)
  const temples = parseAll('temple', templeSeedSchema, data.temples)
  const collections = parseAll('collection', collectionSeedSchema, data.collections)

  for (const [kind, items] of [
    ['state', states],
    ['deity', deities],
    ['temple', temples],
    ['collection', collections],
  ] as const) {
    for (const slug of duplicates(items.map((i) => i.slug))) {
      problems.push(`duplicate ${kind} slug "${slug}"`)
    }
  }

  const stateSlugs = new Set(states.map((s) => s.slug))
  const deitySlugs = new Set(deities.map((d) => d.slug))
  const templeSlugs = new Set(temples.map((t) => t.slug))
  const collectionSlugs = new Set(collections.map((c) => c.slug))

  for (const temple of temples) {
    if (!stateSlugs.has(temple.state)) {
      problems.push(`temple "${temple.slug}": unknown state "${temple.state}"`)
    }
    if (!deitySlugs.has(temple.deity)) {
      problems.push(`temple "${temple.slug}": unknown deity "${temple.deity}"`)
    }
  }

  for (const collection of collections) {
    for (const slug of collection.temples) {
      if (!templeSlugs.has(slug)) {
        problems.push(`collection "${collection.slug}": unknown temple "${slug}"`)
      }
    }
    for (const slug of duplicates(collection.temples)) {
      problems.push(`collection "${collection.slug}": temple "${slug}" listed twice`)
    }
    for (const slug of collection.related) {
      if (slug === collection.slug) {
        problems.push(`collection "${collection.slug}": cannot relate to itself`)
      } else if (!collectionSlugs.has(slug)) {
        problems.push(`collection "${collection.slug}": unknown related collection "${slug}"`)
      }
    }
  }

  if (problems.length > 0) throw new SeedValidationError(problems)
  return { states, deities, temples, collections }
}
