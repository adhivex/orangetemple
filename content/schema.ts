import { z } from 'zod'

/*
 * Shape of the Git seed files (D-002). The seed and its Vitest suite both validate
 * against these schemas, so malformed content fails before it reaches the database.
 */

/** Lowercase, URL-safe, hyphen-separated (D-009). */
export const slug = z
  .string()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'slug must be lowercase letters, digits and hyphens')

const text = z.string().trim().min(1)
/** Markdown with raw HTML disabled (D-003): reject anything that looks like an HTML tag. */
const markdown = text.refine((value) => !/<[a-z/!][^>]*>/i.test(value), {
  message: 'raw HTML is not allowed in Markdown fields',
})

export const regionSchema = z.enum(['NORTH', 'SOUTH', 'EAST', 'WEST', 'CENTRAL', 'NORTHEAST'])
export const traditionSchema = z.enum(['SHAIVA', 'VAISHNAVA', 'SHAKTA', 'OTHER'])

/**
 * Review gate (D-020). `reviewed: true` only after a human has checked the record
 * against reliable sources. SEED_TARGET=production publishes reviewed records only.
 */
export const reviewSchema = z.object({
  reviewed: z.boolean(),
  /** Unverified Devanagari name candidate (SEED-DATA.md §2). Not written to the database. */
  nameNativeCandidate: z.string().optional(),
  /** Open questions for the reviewer. */
  notes: z.array(text).default([]),
})

export const stateSeedSchema = z.object({
  slug,
  name: text,
  region: regionSchema,
  isUnionTerritory: z.boolean().default(false),
})

export const deitySeedSchema = z.object({
  slug,
  name: text,
  nameNative: text.nullable().default(null),
  description: text,
  tradition: traditionSchema.nullable(),
  isFeatured: z.boolean(),
  displayOrder: z.int().positive(),
})

export const templeSeedSchema = z.object({
  slug,
  name: text,
  /** Verified Devanagari name only (SEED-DATA.md §8.1); otherwise null. */
  nameNative: text.nullable(),
  alternateNames: z.array(text),
  deity: slug,
  state: slug,
  city: text,
  district: text.nullable(),
  /** Cards and meta description fallback. */
  shortDescription: text.min(40).max(200),
  overview: markdown,
  significance: markdown,
  /** Required for traditionally disputed sites (D-019). */
  locationNote: markdown.nullable(),
  review: reviewSchema,
})

export const collectionSeedSchema = z.object({
  slug,
  name: text,
  subtitle: text.nullable(),
  description: text.max(200),
  introduction: markdown,
  displayOrder: z.int().positive(),
  /** Temple slugs in display order. The single source of collection membership. */
  temples: z.array(slug).min(1),
  related: z.array(slug).default([]),
  review: reviewSchema,
})

export type StateSeed = z.input<typeof stateSeedSchema>
export type DeitySeed = z.input<typeof deitySeedSchema>
export type TempleSeed = z.input<typeof templeSeedSchema>
export type CollectionSeed = z.input<typeof collectionSeedSchema>

/** Identity helpers that give each seed file type-checking and editor completion. */
export const defineTemple = (temple: TempleSeed) => temple
export const defineCollection = (collection: CollectionSeed) => collection
