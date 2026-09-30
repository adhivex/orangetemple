import { Constants, type Enums, type Tables } from '@/lib/database.types'

/*
 * Query shapes shared by the data layer and the components that render them (D-043).
 * Components take the types below as props. They keep the camelCase, nested shapes the
 * app has always used (including `Date` objects and `_count`); the select strings fetch
 * snake_case rows from Supabase and the mappers below convert them. A change to a select
 * that breaks a mapper surfaces as a type error.
 */

export type ContentStatus = Enums<'content_status'>
export type Region = Enums<'region'>
export type ImageType = Enums<'image_type'>
export type LicenseType = Enums<'license_type'>
export type ReferenceSourceType = Enums<'reference_source_type'>
export type NearbyPlaceType = Enums<'nearby_place_type'>

// ─── Shapes ──────────────────────────────────────────────────────────────────

export type ImageData = {
  url: string
  altText: string
  caption: string | null
  width: number
  height: number
  blurDataUrl: string | null
  credit: string
  licenseType: LicenseType
  sourceUrl: string | null
  isPlaceholder: boolean
}

export type TempleCardData = {
  slug: string
  name: string
  /** Short card label (D-054); falls back to `name`. */
  shortName: string
  nameNative: string | null
  city: string
  shortDescription: string
  state: { slug: string; name: string; region: Region }
  deity: { slug: string; name: string }
  /** The first HERO image, if any. */
  images: ImageData[]
  collections: { collection: { slug: string; name: string } }[]
}

export type CollectionCardData = {
  slug: string
  name: string
  subtitle: string | null
  description: string
  imageUrl: string | null
  imageAlt: string | null
  /** Published temples only: what a visitor can open. */
  _count: { temples: number }
}

/** Everything the temple page renders (CONTENT-MODEL.md §4). Only published relations. */
export type TempleDetail = {
  id: string
  slug: string
  name: string
  nameNative: string | null
  alternateNames: string[]
  shortDescription: string
  overview: string
  city: string
  district: string | null
  country: string
  address: string | null
  latitude: number | null
  longitude: number | null
  coordinatesSource: string | null
  locationNote: string | null
  estimatedPeriod: string | null
  architectureStyle: string | null
  significance: string
  history: string | null
  legend: string | null
  architecture: string | null
  officialWebsite: string | null
  metaTitle: string | null
  metaDescription: string | null
  updatedAt: Date
  state: { slug: string; name: string; region: Region }
  deity: { slug: string; name: string }
  collections: { displayOrder: number; collection: { slug: string; name: string } }[]
  images: (ImageData & { imageType: ImageType; publicId: string })[]
  visitInfo: {
    timings: string | null
    entryRules: string | null
    dressCode: string | null
    photographyRules: string | null
    bestTimeToVisit: string | null
    seasonalAccess: string | null
    howToReach: string | null
    nearestAirport: string | null
    nearestRailway: string | null
    lastVerifiedAt: Date | null
    verificationSourceUrl: string | null
    notes: string | null
  } | null
  rituals: { name: string; description: string | null }[]
  festivals: {
    description: string | null
    festival: { slug: string; name: string; recurrenceNote: string | null }
  }[]
  references: {
    title: string
    url: string | null
    citation: string | null
    sourceType: ReferenceSourceType
    accessedAt: Date | null
  }[]
  nearbyPlaces: {
    name: string
    type: NearbyPlaceType
    description: string | null
    url: string | null
    /** Null when unset or when the related temple is not published (RLS hides it). */
    relatedTemple: { slug: string; name: string; status: ContentStatus } | null
  }[]
}

export type VisitInfoData = NonNullable<TempleDetail['visitInfo']>

// ─── Select strings (PostgREST) ──────────────────────────────────────────────

const IMAGE_COLUMNS =
  'url, alt_text, caption, width, height, blur_data_url, credit, license_type, source_url, is_placeholder, image_type, display_order' as const

export const TEMPLE_CARD_SELECT =
  `slug, name, short_name, name_native, city, short_description, state:states(slug, name, region), deity:deities(slug, name), images:temple_images(${IMAGE_COLUMNS}), collections:collection_temples(collection:collections(slug, name, display_order))` as const

export const COLLECTION_CARD_SELECT =
  'slug, name, subtitle, description, image_url, image_alt, published_temples:collection_temples(count)' as const

export const TEMPLE_DETAIL_SELECT =
  `id, slug, name, name_native, alternate_names, short_description, overview, city, district, country, address, latitude, longitude, coordinates_source, location_note, estimated_period, architecture_style, significance, history, legend, architecture, official_website, meta_title, meta_description, updated_at, state:states(slug, name, region), deity:deities(slug, name), collections:collection_temples(display_order, collection:collections(slug, name, display_order)), images:temple_images(${IMAGE_COLUMNS}, public_id), visit_info:temple_visit_info(timings, entry_rules, dress_code, photography_rules, best_time_to_visit, seasonal_access, how_to_reach, nearest_airport, nearest_railway, last_verified_at, verification_source_url, notes), rituals(name, description, display_order), festivals:temple_festivals(description, display_order, festival:festivals(slug, name, recurrence_note)), references:temple_references(title, url, citation, source_type, accessed_at, display_order), nearby_places:nearby_places!nearby_places_temple_id_fkey(name, type, description, url, display_order, related_temple:temples!nearby_places_related_temple_id_fkey(slug, name, status))` as const

// ─── Row types (what the selects above return) ───────────────────────────────

type ImageRow = Pick<
  Tables<'temple_images'>,
  | 'url'
  | 'alt_text'
  | 'caption'
  | 'width'
  | 'height'
  | 'blur_data_url'
  | 'credit'
  | 'license_type'
  | 'source_url'
  | 'is_placeholder'
  | 'image_type'
  | 'display_order'
>

type NamedRef = { slug: string; name: string }
type OrderedCollectionRef = NamedRef & { display_order: number }

export type TempleCardRow = Pick<
  Tables<'temples'>,
  'slug' | 'name' | 'short_name' | 'name_native' | 'city' | 'short_description'
> & {
  state: (NamedRef & { region: Region }) | null
  deity: NamedRef | null
  images: ImageRow[]
  collections: { collection: OrderedCollectionRef | null }[]
}

export type CollectionCardRow = Pick<
  Tables<'collections'>,
  'slug' | 'name' | 'subtitle' | 'description' | 'image_url' | 'image_alt'
> & { published_temples: { count: number }[] }

type TempleDetailRow = Pick<
  Tables<'temples'>,
  | 'id'
  | 'slug'
  | 'name'
  | 'name_native'
  | 'alternate_names'
  | 'short_description'
  | 'overview'
  | 'city'
  | 'district'
  | 'country'
  | 'address'
  | 'latitude'
  | 'longitude'
  | 'coordinates_source'
  | 'location_note'
  | 'estimated_period'
  | 'architecture_style'
  | 'significance'
  | 'history'
  | 'legend'
  | 'architecture'
  | 'official_website'
  | 'meta_title'
  | 'meta_description'
  | 'updated_at'
> & {
  state: (NamedRef & { region: Region }) | null
  deity: NamedRef | null
  collections: { display_order: number; collection: OrderedCollectionRef | null }[]
  images: (ImageRow & { public_id: string })[]
  visit_info: Omit<
    Tables<'temple_visit_info'>,
    'id' | 'temple_id' | 'created_at' | 'updated_at'
  > | null
  rituals: { name: string; description: string | null; display_order: number }[]
  festivals: {
    description: string | null
    display_order: number
    festival: { slug: string; name: string; recurrence_note: string | null } | null
  }[]
  references: {
    title: string
    url: string | null
    citation: string | null
    source_type: ReferenceSourceType
    accessed_at: string | null
    display_order: number
  }[]
  nearby_places: {
    name: string
    type: NearbyPlaceType
    description: string | null
    url: string | null
    display_order: number
    related_temple: { slug: string; name: string; status: ContentStatus } | null
  }[]
}

// ─── Mappers ─────────────────────────────────────────────────────────────────

const IMAGE_TYPE_ORDER: readonly ImageType[] = Constants.public.Enums.image_type

/** Position of an image type in the Postgres enum, the order Prisma sorted by. */
export const imageTypeRank = (type: ImageType) => IMAGE_TYPE_ORDER.indexOf(type)

const byDisplayOrder = <T extends { display_order: number }>(a: T, b: T) =>
  a.display_order - b.display_order

/** Postgres enum order, then display order: the order Prisma's `orderBy` produced. */
const byImageTypeThenOrder = (a: ImageRow, b: ImageRow) =>
  imageTypeRank(a.image_type) - imageTypeRank(b.image_type) || a.display_order - b.display_order

export const toDate = (value: string) => new Date(value)
export const toDateOrNull = (value: string | null) => (value === null ? null : new Date(value))

/** A required to-one relation. RLS or a broken reference would make it null. */
function required<T>(value: T | null, what: string): T {
  if (value === null) throw new Error(`Missing ${what} in database response`)
  return value
}

export function toImage(row: ImageRow): ImageData {
  return {
    url: row.url,
    altText: row.alt_text,
    caption: row.caption,
    width: row.width,
    height: row.height,
    blurDataUrl: row.blur_data_url,
    credit: row.credit,
    licenseType: row.license_type,
    sourceUrl: row.source_url,
    isPlaceholder: row.is_placeholder,
  }
}

/** Collection memberships, published only (RLS), ordered by collection display order. */
function toCollectionRefs(rows: { collection: OrderedCollectionRef | null }[]) {
  return rows
    .flatMap((row) => (row.collection ? [row.collection] : []))
    .sort(byDisplayOrder)
    .map(({ slug, name }) => ({ collection: { slug, name } }))
}

export function toTempleCard(row: TempleCardRow): TempleCardData {
  return {
    slug: row.slug,
    name: row.name,
    shortName: row.short_name ?? row.name,
    nameNative: row.name_native,
    city: row.city,
    shortDescription: row.short_description,
    state: required(row.state, `state of temple ${row.slug}`),
    deity: required(row.deity, `deity of temple ${row.slug}`),
    images: row.images
      .filter((image) => image.image_type === 'HERO')
      .sort(byDisplayOrder)
      .slice(0, 1)
      .map(toImage),
    collections: toCollectionRefs(row.collections),
  }
}

export function toCollectionCard(row: CollectionCardRow): CollectionCardData {
  return {
    slug: row.slug,
    name: row.name,
    subtitle: row.subtitle,
    description: row.description,
    imageUrl: row.image_url,
    imageAlt: row.image_alt,
    _count: { temples: row.published_temples[0]?.count ?? 0 },
  }
}

export function toTempleDetail(row: TempleDetailRow): TempleDetail {
  const visit = row.visit_info
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    nameNative: row.name_native,
    alternateNames: row.alternate_names,
    shortDescription: row.short_description,
    overview: row.overview,
    city: row.city,
    district: row.district,
    country: row.country,
    address: row.address,
    latitude: row.latitude,
    longitude: row.longitude,
    coordinatesSource: row.coordinates_source,
    locationNote: row.location_note,
    estimatedPeriod: row.estimated_period,
    architectureStyle: row.architecture_style,
    significance: row.significance,
    history: row.history,
    legend: row.legend,
    architecture: row.architecture,
    officialWebsite: row.official_website,
    metaTitle: row.meta_title,
    metaDescription: row.meta_description,
    updatedAt: toDate(row.updated_at),
    state: required(row.state, `state of temple ${row.slug}`),
    deity: required(row.deity, `deity of temple ${row.slug}`),
    collections: row.collections
      .flatMap((m) => (m.collection ? [{ displayOrder: m.display_order, ...m.collection }] : []))
      .sort((a, b) => a.display_order - b.display_order)
      .map(({ displayOrder, slug, name }) => ({ displayOrder, collection: { slug, name } })),
    images: row.images
      .filter((image) => image.image_type === 'HERO' || image.image_type === 'GALLERY')
      .sort(byImageTypeThenOrder)
      .map((image) => ({
        ...toImage(image),
        imageType: image.image_type,
        publicId: image.public_id,
      })),
    visitInfo: visit && {
      timings: visit.timings,
      entryRules: visit.entry_rules,
      dressCode: visit.dress_code,
      photographyRules: visit.photography_rules,
      bestTimeToVisit: visit.best_time_to_visit,
      seasonalAccess: visit.seasonal_access,
      howToReach: visit.how_to_reach,
      nearestAirport: visit.nearest_airport,
      nearestRailway: visit.nearest_railway,
      lastVerifiedAt: toDateOrNull(visit.last_verified_at),
      verificationSourceUrl: visit.verification_source_url,
      notes: visit.notes,
    },
    rituals: [...row.rituals]
      .sort(byDisplayOrder)
      .map(({ name, description }) => ({ name, description })),
    festivals: [...row.festivals].sort(byDisplayOrder).flatMap((f) =>
      f.festival
        ? [
            {
              description: f.description,
              festival: {
                slug: f.festival.slug,
                name: f.festival.name,
                recurrenceNote: f.festival.recurrence_note,
              },
            },
          ]
        : [],
    ),
    references: [...row.references].sort(byDisplayOrder).map((r) => ({
      title: r.title,
      url: r.url,
      citation: r.citation,
      sourceType: r.source_type,
      accessedAt: toDateOrNull(r.accessed_at),
    })),
    nearbyPlaces: [...row.nearby_places].sort(byDisplayOrder).map((p) => ({
      name: p.name,
      type: p.type,
      description: p.description,
      url: p.url,
      relatedTemple: p.related_temple,
    })),
  }
}
