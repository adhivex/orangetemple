/*
 * Seeds the database from the Git seed files (D-002). Run with `pnpm db:seed`.
 *
 * - Idempotent: every record is upserted by slug inside one transaction; collection
 *   memberships and related collections are synced, so running twice changes nothing.
 * - Publishing gate (D-020): SEED_TARGET=production publishes only records marked
 *   `reviewed: true`, and only if they meet the publish requirements in
 *   CONTENT-MODEL.md §2. development and preview publish everything.
 * - Placeholder HERO images (flagged isPlaceholder) are created outside production only.
 */
import { createPrismaClient } from '../src/lib/db'
import { buildSearchText } from '../src/lib/search-text'

import { seedData } from './seed-data'
import { validateSeedData } from './seed-data/validate'

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

async function main() {
  const target = readTarget()
  const data = validateSeedData(seedData)
  const shouldPublish = (reviewed: boolean) => target !== 'production' || reviewed
  const now = new Date()

  // Seeding is a CLI task: prefer the direct (non-pooled) connection.
  const db = createPrismaClient(process.env.DIRECT_URL ?? process.env.DATABASE_URL)

  try {
    await db.$transaction(
      async (tx) => {
        // ── States and deities ────────────────────────────────────────────
        const stateIds = new Map<string, string>()
        const stateNames = new Map<string, string>()
        for (const state of data.states) {
          const fields = {
            name: state.name,
            region: state.region,
            isUnionTerritory: state.isUnionTerritory,
          }
          const row = await tx.state.upsert({
            where: { slug: state.slug },
            create: { slug: state.slug, ...fields },
            update: fields,
          })
          stateIds.set(state.slug, row.id)
          stateNames.set(state.slug, state.name)
        }

        const deityIds = new Map<string, string>()
        for (const deity of data.deities) {
          const fields = {
            name: deity.name,
            nameNative: deity.nameNative,
            description: deity.description,
            tradition: deity.tradition,
            isFeatured: deity.isFeatured,
            displayOrder: deity.displayOrder,
          }
          const row = await tx.deity.upsert({
            where: { slug: deity.slug },
            create: { slug: deity.slug, ...fields },
            update: fields,
          })
          deityIds.set(deity.slug, row.id)
        }

        // ── Temples ───────────────────────────────────────────────────────
        const templeIds = new Map<string, string>()
        const blocked: string[] = []
        for (const temple of data.temples) {
          const existing = await tx.temple.findUnique({
            where: { slug: temple.slug },
            select: {
              publishedAt: true,
              _count: { select: { references: true } },
              images: { where: { imageType: 'HERO', isPlaceholder: false }, select: { id: true } },
            },
          })

          const publish = shouldPublish(temple.review.reviewed)
          if (target === 'production' && publish) {
            const missing = [
              existing?.images.length === 1 ? null : 'exactly one licensed HERO image',
              (existing?._count.references ?? 0) > 0 ? null : 'at least one reference',
            ].filter(Boolean)
            if (missing.length > 0) {
              blocked.push(`${temple.slug}: missing ${missing.join(' and ')}`)
              continue
            }
          }

          const fields = {
            name: temple.name,
            nameNative: temple.nameNative,
            alternateNames: temple.alternateNames,
            shortDescription: temple.shortDescription,
            overview: temple.overview,
            significance: temple.significance,
            locationNote: temple.locationNote,
            city: temple.city,
            district: temple.district,
            deityId: deityIds.get(temple.deity)!,
            stateId: stateIds.get(temple.state)!,
            searchText: buildSearchText([
              temple.name,
              temple.nameNative,
              ...temple.alternateNames,
              temple.city,
              temple.district,
              stateNames.get(temple.state),
            ]),
            status: publish ? ('PUBLISHED' as const) : ('DRAFT' as const),
            publishedAt: publish ? (existing?.publishedAt ?? now) : null,
          }
          const row = await tx.temple.upsert({
            where: { slug: temple.slug },
            create: { slug: temple.slug, ...fields },
            update: fields,
          })
          templeIds.set(temple.slug, row.id)

          if (target !== 'production') {
            const publicId = `placeholder/temple-hero/${temple.slug}`
            const image = {
              templeId: row.id,
              url: PLACEHOLDER_HERO.url,
              imageType: 'HERO' as const,
              altText: `Placeholder image for ${temple.name}`,
              width: PLACEHOLDER_HERO.width,
              height: PLACEHOLDER_HERO.height,
              credit: 'OrangeTemple (development placeholder)',
              licenseType: 'OWNED' as const,
              isPlaceholder: true,
            }
            await tx.templeImage.upsert({
              where: { publicId },
              create: { publicId, ...image },
              update: image,
            })
          }
        }

        if (blocked.length > 0) {
          throw new Error(
            `These reviewed temples cannot be published in production yet:\n${blocked.map((b) => `  - ${b}`).join('\n')}`,
          )
        }

        if (target === 'production') {
          const placeholders = await tx.templeImage.count({ where: { isPlaceholder: true } })
          if (placeholders > 0) {
            throw new Error(
              `Production must have no placeholder images, but ${placeholders} exist (PRD §11).`,
            )
          }
        }

        // ── Collections, memberships, related collections ─────────────────
        const collectionIds = new Map<string, string>()
        for (const collection of data.collections) {
          const existing = await tx.collection.findUnique({
            where: { slug: collection.slug },
            select: { publishedAt: true },
          })
          const publish = shouldPublish(collection.review.reviewed)
          const fields = {
            name: collection.name,
            subtitle: collection.subtitle,
            description: collection.description,
            introduction: collection.introduction,
            displayOrder: collection.displayOrder,
            status: publish ? ('PUBLISHED' as const) : ('DRAFT' as const),
            publishedAt: publish ? (existing?.publishedAt ?? now) : null,
          }
          const row = await tx.collection.upsert({
            where: { slug: collection.slug },
            create: { slug: collection.slug, ...fields },
            update: fields,
          })
          collectionIds.set(collection.slug, row.id)

          // Only temples seeded in this run (a blocked production temple is skipped).
          const members = collection.temples
            .map((slug, index) => ({ templeId: templeIds.get(slug), displayOrder: index + 1 }))
            .filter((m): m is { templeId: string; displayOrder: number } => Boolean(m.templeId))

          await tx.collectionTemple.deleteMany({
            where: { collectionId: row.id, templeId: { notIn: members.map((m) => m.templeId) } },
          })
          for (const member of members) {
            await tx.collectionTemple.upsert({
              where: {
                collectionId_templeId: { collectionId: row.id, templeId: member.templeId },
              },
              create: { collectionId: row.id, ...member },
              update: { displayOrder: member.displayOrder },
            })
          }
        }

        for (const collection of data.collections) {
          const collectionId = collectionIds.get(collection.slug)!
          const related = collection.related.map((slug, index) => ({
            relatedCollectionId: collectionIds.get(slug)!,
            displayOrder: index + 1,
          }))
          await tx.relatedCollection.deleteMany({
            where: {
              collectionId,
              relatedCollectionId: { notIn: related.map((r) => r.relatedCollectionId) },
            },
          })
          for (const item of related) {
            await tx.relatedCollection.upsert({
              where: {
                collectionId_relatedCollectionId: {
                  collectionId,
                  relatedCollectionId: item.relatedCollectionId,
                },
              },
              create: { collectionId, ...item },
              update: { displayOrder: item.displayOrder },
            })
          }
        }
      },
      { timeout: 60_000 },
    )

    const [states, deities, temples, published, collections, memberships, images] =
      await Promise.all([
        db.state.count(),
        db.deity.count(),
        db.temple.count(),
        db.temple.count({ where: { status: 'PUBLISHED' } }),
        db.collection.count(),
        db.collectionTemple.count(),
        db.templeImage.count(),
      ])
    console.log(
      `Seeded (${target}): ${states} states, ${deities} deities, ${temples} temples ` +
        `(${published} published), ${collections} collections, ${memberships} memberships, ` +
        `${images} images.`,
    )
  } finally {
    await db.$disconnect()
  }
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error)
  process.exitCode = 1
})
