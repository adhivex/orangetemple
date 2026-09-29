/*
 * Seeds Supabase from the Git seed files (D-002, D-043). Run with `pnpm db:seed`.
 *
 * - Idempotent: records are upserted by slug (placeholder images by storage path), and
 *   collection memberships and related collections are synced, so running twice changes
 *   nothing.
 * - Publishing gate (D-020): SEED_TARGET=production publishes only records marked
 *   `reviewed: true`, and only if they meet the publish requirements in
 *   CONTENT-MODEL.md §2. development and preview publish everything.
 * - Placeholder HERO images (flagged is_placeholder) are created outside production only.
 * - Writes use the secret key, which bypasses Row Level Security. The Supabase API has no
 *   multi-statement transactions, so every production check runs before the first write:
 *   a refused run changes nothing. If a run fails part-way for another reason (a network
 *   error, say), run it again; every step converges on the seed files.
 */
import { createClient, type PostgrestSingleResponse } from '@supabase/supabase-js'

import { seedData } from '../content'
import { validateSeedData } from '../content/validate'
import type { Database } from '../src/lib/database.types'
import { buildSearchText } from '../src/lib/search-text'

// Local development reads .env.local; CI and Vercel set real environment variables,
// which take precedence.
for (const file of ['.env.local', '.env']) {
  try {
    process.loadEnvFile(file)
  } catch {
    // file absent — fine
  }
}

const TARGETS = ['development', 'preview', 'production'] as const
type SeedTarget = (typeof TARGETS)[number]

function readTarget(): SeedTarget {
  const value = process.env.SEED_TARGET ?? 'development'
  if (!(TARGETS as readonly string[]).includes(value)) {
    throw new Error(`SEED_TARGET must be one of ${TARGETS.join(', ')}; got "${value}"`)
  }
  return value as SeedTarget
}

/** Neutral development placeholder (public/placeholders/temple-hero.svg), 4:5. */
const PLACEHOLDER_HERO = { url: '/placeholders/temple-hero.svg', width: 1600, height: 2000 }

/** The data of a Supabase response, or an error naming the step that failed. */
function must<T>(result: PostgrestSingleResponse<T>, step: string): T {
  if (result.error) throw new Error(`${step} failed: ${result.error.message}`)
  return result.data
}

/** PostgREST `in` list for ids (UUIDs need no escaping). */
const inList = (ids: string[]) => `(${ids.join(',')})`

async function main() {
  const target = readTarget()
  const data = validateSeedData(seedData)
  const shouldPublish = (reviewed: boolean) => target !== 'production' || reviewed
  const now = new Date().toISOString()

  const url = process.env.SUPABASE_URL
  const secretKey = process.env.SUPABASE_SECRET_KEY
  if (!url || !secretKey) {
    throw new Error(
      'SUPABASE_URL and SUPABASE_SECRET_KEY must be set to seed. See .env.example and README.md.',
    )
  }
  const db = createClient<Database>(url, secretKey, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  })

  // ── What exists already: first publish dates, and the production requirements ──
  const existingTemples = must(
    await db
      .from('temples')
      .select(
        'slug, published_at, reference_count:temple_references(count), licensed_heroes:temple_images(id)',
      )
      .eq('licensed_heroes.image_type', 'HERO')
      .eq('licensed_heroes.is_placeholder', false),
    'Reading existing temples',
  )
  const existingTemple = new Map(existingTemples.map((t) => [t.slug, t]))
  const existingCollections = must(
    await db.from('collections').select('slug, published_at'),
    'Reading existing collections',
  )
  const firstPublished = new Map(existingCollections.map((c) => [c.slug, c.published_at]))

  // ── Production gate: refuse before writing anything ───────────────────────
  if (target === 'production') {
    const blocked = data.temples
      .filter((temple) => shouldPublish(temple.review.reviewed))
      .flatMap((temple) => {
        const existing = existingTemple.get(temple.slug)
        const missing = [
          existing?.licensed_heroes.length === 1 ? null : 'exactly one licensed HERO image',
          (existing?.reference_count[0]?.count ?? 0) > 0 ? null : 'at least one reference',
        ].filter(Boolean)
        return missing.length > 0 ? [`${temple.slug}: missing ${missing.join(' and ')}`] : []
      })
    if (blocked.length > 0) {
      throw new Error(
        `These reviewed temples cannot be published in production yet:\n${blocked.map((b) => `  - ${b}`).join('\n')}`,
      )
    }
    const placeholders = await db
      .from('temple_images')
      .select('id', { count: 'exact', head: true })
      .eq('is_placeholder', true)
    must(placeholders, 'Counting placeholder images')
    if (placeholders.count) {
      throw new Error(
        `Production must have no placeholder images, but ${placeholders.count} exist (PRD §11).`,
      )
    }
  }

  // ── States and deities ────────────────────────────────────────────────────
  const states = must(
    await db
      .from('states')
      .upsert(
        data.states.map((s) => ({
          slug: s.slug,
          name: s.name,
          region: s.region,
          is_union_territory: s.isUnionTerritory,
        })),
        { onConflict: 'slug' },
      )
      .select('id, slug'),
    'Upserting states',
  )
  const stateIds = new Map(states.map((s) => [s.slug, s.id]))
  const stateNames = new Map(data.states.map((s) => [s.slug, s.name]))

  const deities = must(
    await db
      .from('deities')
      .upsert(
        data.deities.map((d) => ({
          slug: d.slug,
          name: d.name,
          name_native: d.nameNative,
          description: d.description,
          tradition: d.tradition,
          is_featured: d.isFeatured,
          display_order: d.displayOrder,
        })),
        { onConflict: 'slug' },
      )
      .select('id, slug'),
    'Upserting deities',
  )
  const deityIds = new Map(deities.map((d) => [d.slug, d.id]))

  // ── Temples ───────────────────────────────────────────────────────────────
  const temples = must(
    await db
      .from('temples')
      .upsert(
        data.temples.map((temple) => {
          const publish = shouldPublish(temple.review.reviewed)
          return {
            slug: temple.slug,
            name: temple.name,
            name_native: temple.nameNative,
            alternate_names: temple.alternateNames,
            short_description: temple.shortDescription,
            overview: temple.overview,
            significance: temple.significance,
            location_note: temple.locationNote,
            city: temple.city,
            district: temple.district,
            deity_id: deityIds.get(temple.deity)!,
            state_id: stateIds.get(temple.state)!,
            search_text: buildSearchText([
              temple.name,
              temple.nameNative,
              ...temple.alternateNames,
              temple.city,
              temple.district,
              stateNames.get(temple.state),
            ]),
            status: publish ? ('PUBLISHED' as const) : ('DRAFT' as const),
            published_at: publish ? (existingTemple.get(temple.slug)?.published_at ?? now) : null,
          }
        }),
        { onConflict: 'slug' },
      )
      .select('id, slug, name'),
    'Upserting temples',
  )
  const templeIds = new Map(temples.map((t) => [t.slug, t.id]))

  if (target !== 'production') {
    must(
      await db.from('temple_images').upsert(
        temples.map((temple) => ({
          public_id: `placeholder/temple-hero/${temple.slug}`,
          temple_id: temple.id,
          url: PLACEHOLDER_HERO.url,
          image_type: 'HERO' as const,
          alt_text: `Placeholder image for ${temple.name}`,
          width: PLACEHOLDER_HERO.width,
          height: PLACEHOLDER_HERO.height,
          credit: 'OrangeTemple (development placeholder)',
          license_type: 'OWNED' as const,
          is_placeholder: true,
        })),
        { onConflict: 'public_id' },
      ),
      'Upserting placeholder images',
    )
  }

  // ── Collections, memberships, related collections ─────────────────────────
  const collections = must(
    await db
      .from('collections')
      .upsert(
        data.collections.map((collection) => {
          const publish = shouldPublish(collection.review.reviewed)
          return {
            slug: collection.slug,
            name: collection.name,
            subtitle: collection.subtitle,
            description: collection.description,
            introduction: collection.introduction,
            display_order: collection.displayOrder,
            status: publish ? ('PUBLISHED' as const) : ('DRAFT' as const),
            published_at: publish ? (firstPublished.get(collection.slug) ?? now) : null,
          }
        }),
        { onConflict: 'slug' },
      )
      .select('id, slug'),
    'Upserting collections',
  )
  const collectionIds = new Map(collections.map((c) => [c.slug, c.id]))

  for (const collection of data.collections) {
    const collectionId = collectionIds.get(collection.slug)!
    const members = collection.temples.map((slug, index) => ({
      collection_id: collectionId,
      temple_id: templeIds.get(slug)!,
      display_order: index + 1,
    }))
    // Remove memberships no longer in the seed file, then upsert the current ones.
    must(
      await db
        .from('collection_temples')
        .delete()
        .eq('collection_id', collectionId)
        .not('temple_id', 'in', inList(members.map((m) => m.temple_id))),
      `Syncing memberships of ${collection.slug}`,
    )
    must(
      await db
        .from('collection_temples')
        .upsert(members, { onConflict: 'collection_id,temple_id' }),
      `Upserting memberships of ${collection.slug}`,
    )
  }

  for (const collection of data.collections) {
    const collectionId = collectionIds.get(collection.slug)!
    const related = collection.related.map((slug, index) => ({
      collection_id: collectionId,
      related_collection_id: collectionIds.get(slug)!,
      display_order: index + 1,
    }))
    const stale = db.from('related_collections').delete().eq('collection_id', collectionId)
    must(
      await (related.length > 0
        ? stale.not(
            'related_collection_id',
            'in',
            inList(related.map((r) => r.related_collection_id)),
          )
        : stale),
      `Syncing related collections of ${collection.slug}`,
    )
    if (related.length > 0) {
      must(
        await db
          .from('related_collections')
          .upsert(related, { onConflict: 'collection_id,related_collection_id' }),
        `Upserting related collections of ${collection.slug}`,
      )
    }
  }

  // ── Summary ───────────────────────────────────────────────────────────────
  const head = { count: 'exact', head: true } as const
  const results = await Promise.all([
    db.from('states').select('*', head),
    db.from('deities').select('*', head),
    db.from('temples').select('*', head),
    db.from('temples').select('*', head).eq('status', 'PUBLISHED'),
    db.from('collections').select('*', head),
    db.from('collection_temples').select('*', head),
    db.from('temple_images').select('*', head),
  ])
  const [
    stateCount,
    deityCount,
    templeCount,
    publishedCount,
    collectionCount,
    memberCount,
    imageCount,
  ] = results.map((result: { count: number | null; error: { message: string } | null }) => {
    if (result.error) throw new Error(`Counting seeded records failed: ${result.error.message}`)
    return result.count ?? 0
  })
  console.log(
    `Seeded (${target}): ${stateCount} states, ${deityCount} deities, ${templeCount} temples ` +
      `(${publishedCount} published), ${collectionCount} collections, ${memberCount} memberships, ` +
      `${imageCount} images.`,
  )
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error)
  process.exitCode = 1
})
