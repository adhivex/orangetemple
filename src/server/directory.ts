import { cacheLife, cacheTag } from 'next/cache'

import { Prisma } from '@/generated/prisma/client'
import { getDb } from '@/lib/db'
import { PAGE_SIZE, type DirectoryFilters, type FilterOptions } from '@/lib/directory'
import { REGIONS, regionFromParam } from '@/lib/regions'
import { normalizeForSearch } from '@/lib/search-text'

import { CONTENT_TAG } from './queries'
import { templeCardSelect, type TempleCardData } from './shapes'

/*
 * Directory reads (PRD §6, D-014). Results are cached per filter combination and share
 * the content tag, so revalidation after seeding refreshes every cached search.
 */

export type DirectoryResult = {
  temples: TempleCardData[]
  total: number
  page: number
  pageCount: number
}

/** SQL WHERE fragments for the non-text filters. Only published temples, always. */
function filterConditions(filters: DirectoryFilters): Prisma.Sql[] {
  const conditions: Prisma.Sql[] = [Prisma.sql`t."status" = 'PUBLISHED'`]
  if (filters.deity) conditions.push(Prisma.sql`d."slug" = ${filters.deity}`)
  if (filters.state) conditions.push(Prisma.sql`s."slug" = ${filters.state}`)
  const region = regionFromParam(filters.region)
  if (region) conditions.push(Prisma.sql`s."region" = ${region}::"Region"`)
  if (filters.collection) {
    conditions.push(Prisma.sql`EXISTS (
      SELECT 1 FROM "CollectionTemple" ct JOIN "Collection" c ON c."id" = ct."collectionId"
      WHERE ct."templeId" = t."id" AND c."slug" = ${filters.collection} AND c."status" = 'PUBLISHED'
    )`)
  }
  return conditions
}

/**
 * Searches and filters published temples. With a query, results are ranked: names that
 * start with the query first, then by trigram word similarity (tolerates typos and
 * transliteration variants). Without one, alphabetical.
 */
export async function searchTemples(filters: DirectoryFilters): Promise<DirectoryResult> {
  'use cache'
  cacheLife('max')
  cacheTag(CONTENT_TAG)

  const db = getDb()
  const conditions = filterConditions(filters)
  const query = filters.q ? normalizeForSearch(filters.q) : ''
  if (query) {
    // Substring match catches short queries; `<%` (word similarity) catches typos.
    conditions.push(
      Prisma.sql`(t."searchText" LIKE ${'%' + query + '%'} OR lower(unaccent(${query})) <% t."searchText")`,
    )
  }
  const where = Prisma.join(conditions, ' AND ')
  const from = Prisma.sql`"Temple" t JOIN "State" s ON s."id" = t."stateId" JOIN "Deity" d ON d."id" = t."deityId"`
  const order = query
    ? Prisma.sql`(lower(unaccent(t."name")) LIKE ${query + '%'}) DESC,
                 word_similarity(lower(unaccent(${query})), t."searchText") DESC,
                 t."name" ASC`
    : Prisma.sql`t."name" ASC`

  // `<%` uses the database's word-similarity threshold, 0.5 rather than pg_trgm's 0.6
  // default, set by migration (D-037, D-041): v/w transliteration variants such as
  // "Rameswaram" and "Ramesvaram" score 0.54–0.57 against the right temple, while the
  // best wrong match scored 0.20. The GIN trigram index serves `<%`.
  const countRows = await db.$queryRaw<{ count: bigint }[]>`
    SELECT count(*) AS count FROM ${from} WHERE ${where}`
  const total = Number(countRows[0]?.count ?? 0)
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const page = Math.min(filters.page, pageCount)

  const rows = await db.$queryRaw<{ id: string }[]>`
    SELECT t."id" FROM ${from} WHERE ${where}
    ORDER BY ${order}
    LIMIT ${PAGE_SIZE} OFFSET ${(page - 1) * PAGE_SIZE}`
  const ids = rows.map((r) => r.id)
  const cards = await db.temple.findMany({
    where: { id: { in: ids } },
    select: { id: true, ...templeCardSelect },
  })
  const byId = new Map(cards.map(({ id, ...card }) => [id, card]))

  return {
    temples: ids.map((id) => byId.get(id)).filter((c): c is TempleCardData => Boolean(c)),
    total,
    page,
    pageCount,
  }
}

/** Filter choices: only values that have at least one published temple. */
export async function getFilterOptions(): Promise<FilterOptions> {
  'use cache'
  cacheLife('max')
  cacheTag(CONTENT_TAG)

  const db = getDb()
  const published = { some: { status: 'PUBLISHED' as const } }
  const [deities, states, collections] = await Promise.all([
    db.deity.findMany({
      where: { temples: published },
      orderBy: [{ isFeatured: 'desc' }, { displayOrder: 'asc' }],
      select: { slug: true, name: true },
    }),
    db.state.findMany({
      where: { temples: published },
      orderBy: { name: 'asc' },
      select: { slug: true, name: true, region: true },
    }),
    db.collection.findMany({
      where: { status: 'PUBLISHED', temples: { some: { temple: { status: 'PUBLISHED' } } } },
      orderBy: { displayOrder: 'asc' },
      select: { slug: true, name: true },
    }),
  ])
  const regionsInUse = new Set(states.map((s) => s.region))

  return {
    deities: deities.map((d) => ({ value: d.slug, label: d.name })),
    states: states.map((s) => ({ value: s.slug, label: s.name })),
    regions: REGIONS.filter((r) => regionsInUse.has(r.value)).map((r) => ({
      value: r.param,
      label: r.label,
    })),
    collections: collections.map((c) => ({ value: c.slug, label: c.name })),
  }
}
