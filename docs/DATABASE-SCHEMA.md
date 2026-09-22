# OrangeTemple — Database Schema

PostgreSQL via Prisma. This is a specification; Claude writes the Prisma schema and migrations in Phase 2 and keeps this document in sync.

## 1. Principles
- Relational model. One record per temple; collections reference temples.
- IDs: `cuid` strings. Timestamps `createdAt` and `updatedAt` on every main table.
- Long-form text fields are Markdown (raw HTML disabled).
- Use Prisma enums for closed value sets.
- Only `PUBLISHED` content is public.

## 2. Enums
- `ContentStatus`: DRAFT, PUBLISHED, ARCHIVED
- `Region`: NORTH, SOUTH, EAST, WEST, CENTRAL, NORTHEAST
- `Tradition`: SHAIVA, VAISHNAVA, SHAKTA, OTHER
- `ImageType`: HERO, GALLERY, THUMBNAIL, OG
- `LicenseType`: OWNED, CC0, CC_BY, CC_BY_SA, PUBLIC_DOMAIN, LICENSED, OTHER
- `ReferenceSourceType`: OFFICIAL_TEMPLE, GOVERNMENT, ACADEMIC, TRADITIONAL_TEXT, NEWS, OTHER
- `NearbyPlaceType`: TEMPLE, SHRINE, GHAT, NATURAL, HERITAGE, OTHER

## 3. Entities

### State
`id`, `name`, `slug` (unique), `region` (Region), `code` (optional ISO 3166-2:IN), `isUnionTerritory`.
Seed only the states and union territories used by published temples, and add others as needed.

### Deity
`id`, `name`, `nameNative` (optional), `slug` (unique), `description`, `tradition` (optional, set only where widely uncontroversial), `isFeatured`, `displayOrder`.
Deity is the presiding deity used for filtering and grouping. It does not assert theology, and there is no parent/child hierarchy in V1.

### Temple
- Identity: `id`, `name`, `nameNative` (optional, Devanagari in V1), `slug` (unique), `alternateNames` (string array: transliterations, older or local names)
- Summary: `shortDescription` (max about 200 characters, used on cards and as the meta fallback), `overview` (Markdown, the "About" text)
- Relations: `deityId`, `stateId`
- Location: `city`, `district` (optional), `country` (default "India"), `address` (optional), `latitude`, `longitude` (both optional), `coordinatesSource` (required when coordinates are set), `locationNote` (optional Markdown for disputed or alternate site claims)
- Quick facts: `estimatedPeriod` (optional text, hedged, e.g. "Traditional dating varies"), `architectureStyle` (optional)
- Content: `significance`, `history` (documented history only), `legend` (traditional beliefs only), `architecture` (all Markdown, optional except `significance`)
- `officialWebsite` (optional, verified URL only)
- SEO overrides: `metaTitle`, `metaDescription` (optional)
- Publishing: `status`, `publishedAt`

### TempleVisitInfo (one-to-one with Temple)
`templeId` (unique), `timings`, `entryRules`, `dressCode`, `photographyRules`, `bestTimeToVisit`, `seasonalAccess`, `howToReach` (Markdown), `nearestAirport`, `nearestRailway`, `lastVerifiedAt`, `verificationSourceUrl`, `notes`. All optional.

`seasonalAccess` matters: Badrinath and Kedarnath close for winter. `entryRules` covers restrictions such as those at Jagannath Temple, Puri, which restricts non-Hindu entry.

### Collection
`id`, `name`, `slug` (unique), `subtitle`, `description` (short), `introduction` (Markdown), cover image fields (`imagePublicId`, `imageUrl`, `imageAlt`), `displayOrder`, `status`, `publishedAt`.

### CollectionTemple (many-to-many)
`collectionId`, `templeId`, `displayOrder`. Composite primary key (`collectionId`, `templeId`).

### RelatedCollection (self-relation)
`collectionId`, `relatedCollectionId`, `displayOrder`.

### TempleImage
`id`, `templeId`, `url`, `publicId`, `imageType`, `altText` (required), `caption`, `displayOrder`, `width`, `height`, `blurDataUrl`, `credit`, `licenseType`, `sourceUrl`, `isPlaceholder` (default false).
Rule: a published temple has exactly one HERO image.

### Festival
`id`, `name`, `slug` (unique), `description`, `recurrenceNote` (text description of when it occurs; store no fixed Gregorian dates, since dates follow the lunar calendar).

### TempleFestival
`templeId`, `festivalId`, `description` (how it is observed at this temple), `displayOrder`. Composite primary key.

### Ritual
`id`, `templeId`, `name`, `description`, `displayOrder`.

### TempleReference
`id`, `templeId`, `title`, `url` (optional), `citation` (optional; for books), `sourceType`, `accessedAt`, `displayOrder`. At least one of `url` or `citation` is required.

### NearbyPlace
`id`, `templeId`, `name`, `type`, `description`, `latitude`, `longitude` (optional), `url` (optional), `relatedTempleId` (optional; links to another Temple record for internal linking), `displayOrder`.

### SlugRedirect
`id`, `oldSlug` (unique), `templeId`, `createdAt`.

## 4. Relationships
- Temple → one Deity, one State
- Temple ↔ many Collections (via CollectionTemple)
- Temple → one TempleVisitInfo; many images, rituals, references, nearby places
- Temple ↔ many Festivals (via TempleFestival)
- State → Region (enum)

## 5. Derived data
**Related temples** are not stored. Select up to 4 published temples excluding the current one, in this order: same collection, then same deity, then same state.

## 6. Indexes and constraints
- Unique: `Temple.slug`, `Collection.slug`, `Deity.slug`, `State.slug`, `Festival.slug`, `SlugRedirect.oldSlug`
- Composite keys on `CollectionTemple` and `TempleFestival`
- Index: `Temple(status, stateId)`, `Temple(status, deityId)`, `CollectionTemple(templeId)`, `TempleImage(templeId, imageType, displayOrder)`
- GIN trigram indexes supporting search on `Temple.name`, `Temple.nameNative`, `Temple.city` and `alternateNames` (via a search column or expression index)
- Slugs are lowercase, URL-safe, stable and unique. See D-009 for the naming convention.

## 7. Important data rules
- Rameshwaram is one Temple record, a member of both `jyotirlingas` and `char-dham`.
- Only `PUBLISHED` records appear publicly; `DRAFT` and `ARCHIVED` never do.
- Never write guessed coordinates, timings or URLs into any field.

## 8. Future extensions
Story, Yatra, YatraStop, FestivalCalendar (with lunar-calendar recurrence), User, SavedTemple, VisitedTemple, additional Region/State data.
