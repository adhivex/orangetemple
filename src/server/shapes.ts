import type { Prisma } from '@/generated/prisma/client'

/*
 * Query shapes shared by the data layer and the components that render them.
 * Components take the *payload types* below as props, so they are always
 * "database-shaped" and a change to a query surfaces as a type error.
 */

export const imageSelect = {
  url: true,
  altText: true,
  caption: true,
  width: true,
  height: true,
  blurDataUrl: true,
  credit: true,
  licenseType: true,
  sourceUrl: true,
  isPlaceholder: true,
} satisfies Prisma.TempleImageSelect

export type ImageData = Prisma.TempleImageGetPayload<{ select: typeof imageSelect }>

export const templeCardSelect = {
  slug: true,
  name: true,
  nameNative: true,
  city: true,
  shortDescription: true,
  state: { select: { slug: true, name: true } },
  deity: { select: { slug: true, name: true } },
  images: {
    where: { imageType: 'HERO' },
    orderBy: { displayOrder: 'asc' },
    take: 1,
    select: imageSelect,
  },
  collections: {
    orderBy: { collection: { displayOrder: 'asc' } },
    select: { collection: { select: { slug: true, name: true } } },
  },
} satisfies Prisma.TempleSelect

export type TempleCardData = Prisma.TempleGetPayload<{ select: typeof templeCardSelect }>

export const collectionCardSelect = {
  slug: true,
  name: true,
  subtitle: true,
  description: true,
  imageUrl: true,
  imageAlt: true,
  // Count only published temples: that is what a visitor can open.
  _count: { select: { temples: { where: { temple: { status: 'PUBLISHED' } } } } },
} satisfies Prisma.CollectionSelect

export type CollectionCardData = Prisma.CollectionGetPayload<{
  select: typeof collectionCardSelect
}>

/** Everything the temple page renders (CONTENT-MODEL.md §4). Only published relations. */
export const templeDetailSelect = {
  id: true,
  slug: true,
  name: true,
  nameNative: true,
  alternateNames: true,
  shortDescription: true,
  overview: true,
  city: true,
  district: true,
  country: true,
  address: true,
  latitude: true,
  longitude: true,
  coordinatesSource: true,
  locationNote: true,
  estimatedPeriod: true,
  architectureStyle: true,
  significance: true,
  history: true,
  legend: true,
  architecture: true,
  officialWebsite: true,
  metaTitle: true,
  metaDescription: true,
  updatedAt: true,
  state: { select: { slug: true, name: true, region: true } },
  deity: { select: { slug: true, name: true } },
  collections: {
    where: { collection: { status: 'PUBLISHED' } },
    orderBy: { collection: { displayOrder: 'asc' } },
    select: { displayOrder: true, collection: { select: { slug: true, name: true } } },
  },
  images: {
    where: { imageType: { in: ['HERO', 'GALLERY'] } },
    orderBy: [{ imageType: 'asc' }, { displayOrder: 'asc' }],
    select: { ...imageSelect, imageType: true, publicId: true },
  },
  visitInfo: {
    select: {
      timings: true,
      entryRules: true,
      dressCode: true,
      photographyRules: true,
      bestTimeToVisit: true,
      seasonalAccess: true,
      howToReach: true,
      nearestAirport: true,
      nearestRailway: true,
      lastVerifiedAt: true,
      verificationSourceUrl: true,
      notes: true,
    },
  },
  rituals: { orderBy: { displayOrder: 'asc' }, select: { name: true, description: true } },
  festivals: {
    orderBy: { displayOrder: 'asc' },
    select: {
      description: true,
      festival: { select: { slug: true, name: true, recurrenceNote: true } },
    },
  },
  references: {
    orderBy: { displayOrder: 'asc' },
    select: { title: true, url: true, citation: true, sourceType: true, accessedAt: true },
  },
  nearbyPlaces: {
    orderBy: { displayOrder: 'asc' },
    select: {
      name: true,
      type: true,
      description: true,
      url: true,
      relatedTemple: { select: { slug: true, name: true, status: true } },
    },
  },
} satisfies Prisma.TempleSelect

export type TempleDetail = Prisma.TempleGetPayload<{ select: typeof templeDetailSelect }>
export type VisitInfoData = NonNullable<TempleDetail['visitInfo']>
