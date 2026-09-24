-- Search (D-014): trigram similarity and accent-insensitive matching.
-- Must exist before the GIN trigram index on "Temple"."searchText" below.
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE EXTENSION IF NOT EXISTS unaccent;

-- CreateEnum
CREATE TYPE "ContentStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "Region" AS ENUM ('NORTH', 'SOUTH', 'EAST', 'WEST', 'CENTRAL', 'NORTHEAST');

-- CreateEnum
CREATE TYPE "Tradition" AS ENUM ('SHAIVA', 'VAISHNAVA', 'SHAKTA', 'OTHER');

-- CreateEnum
CREATE TYPE "ImageType" AS ENUM ('HERO', 'GALLERY', 'THUMBNAIL', 'OG');

-- CreateEnum
CREATE TYPE "LicenseType" AS ENUM ('OWNED', 'CC0', 'CC_BY', 'CC_BY_SA', 'PUBLIC_DOMAIN', 'LICENSED', 'OTHER');

-- CreateEnum
CREATE TYPE "ReferenceSourceType" AS ENUM ('OFFICIAL_TEMPLE', 'GOVERNMENT', 'ACADEMIC', 'TRADITIONAL_TEXT', 'NEWS', 'OTHER');

-- CreateEnum
CREATE TYPE "NearbyPlaceType" AS ENUM ('TEMPLE', 'SHRINE', 'GHAT', 'NATURAL', 'HERITAGE', 'OTHER');

-- CreateTable
CREATE TABLE "State" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "region" "Region" NOT NULL,
    "code" TEXT,
    "isUnionTerritory" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "State_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Deity" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "nameNative" TEXT,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "tradition" "Tradition",
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Deity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Temple" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "nameNative" TEXT,
    "slug" TEXT NOT NULL,
    "alternateNames" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "shortDescription" TEXT NOT NULL,
    "overview" TEXT NOT NULL,
    "deityId" TEXT NOT NULL,
    "stateId" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "district" TEXT,
    "country" TEXT NOT NULL DEFAULT 'India',
    "address" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "coordinatesSource" TEXT,
    "locationNote" TEXT,
    "estimatedPeriod" TEXT,
    "architectureStyle" TEXT,
    "significance" TEXT NOT NULL,
    "history" TEXT,
    "legend" TEXT,
    "architecture" TEXT,
    "officialWebsite" TEXT,
    "metaTitle" TEXT,
    "metaDescription" TEXT,
    "searchText" TEXT NOT NULL,
    "status" "ContentStatus" NOT NULL DEFAULT 'DRAFT',
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Temple_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TempleVisitInfo" (
    "id" TEXT NOT NULL,
    "templeId" TEXT NOT NULL,
    "timings" TEXT,
    "entryRules" TEXT,
    "dressCode" TEXT,
    "photographyRules" TEXT,
    "bestTimeToVisit" TEXT,
    "seasonalAccess" TEXT,
    "howToReach" TEXT,
    "nearestAirport" TEXT,
    "nearestRailway" TEXT,
    "lastVerifiedAt" TIMESTAMP(3),
    "verificationSourceUrl" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TempleVisitInfo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Collection" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "subtitle" TEXT,
    "description" TEXT NOT NULL,
    "introduction" TEXT,
    "imagePublicId" TEXT,
    "imageUrl" TEXT,
    "imageAlt" TEXT,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "status" "ContentStatus" NOT NULL DEFAULT 'DRAFT',
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Collection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CollectionTemple" (
    "collectionId" TEXT NOT NULL,
    "templeId" TEXT NOT NULL,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "CollectionTemple_pkey" PRIMARY KEY ("collectionId","templeId")
);

-- CreateTable
CREATE TABLE "RelatedCollection" (
    "collectionId" TEXT NOT NULL,
    "relatedCollectionId" TEXT NOT NULL,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "RelatedCollection_pkey" PRIMARY KEY ("collectionId","relatedCollectionId")
);

-- CreateTable
CREATE TABLE "TempleImage" (
    "id" TEXT NOT NULL,
    "templeId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    "imageType" "ImageType" NOT NULL,
    "altText" TEXT NOT NULL,
    "caption" TEXT,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "width" INTEGER NOT NULL,
    "height" INTEGER NOT NULL,
    "blurDataUrl" TEXT,
    "credit" TEXT NOT NULL,
    "licenseType" "LicenseType" NOT NULL,
    "sourceUrl" TEXT,
    "isPlaceholder" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TempleImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Festival" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "recurrenceNote" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Festival_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TempleFestival" (
    "templeId" TEXT NOT NULL,
    "festivalId" TEXT NOT NULL,
    "description" TEXT,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "TempleFestival_pkey" PRIMARY KEY ("templeId","festivalId")
);

-- CreateTable
CREATE TABLE "Ritual" (
    "id" TEXT NOT NULL,
    "templeId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Ritual_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TempleReference" (
    "id" TEXT NOT NULL,
    "templeId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "url" TEXT,
    "citation" TEXT,
    "sourceType" "ReferenceSourceType" NOT NULL,
    "accessedAt" TIMESTAMP(3),
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TempleReference_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NearbyPlace" (
    "id" TEXT NOT NULL,
    "templeId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "NearbyPlaceType" NOT NULL,
    "description" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "url" TEXT,
    "relatedTempleId" TEXT,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NearbyPlace_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SlugRedirect" (
    "id" TEXT NOT NULL,
    "oldSlug" TEXT NOT NULL,
    "templeId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SlugRedirect_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "State_slug_key" ON "State"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Deity_slug_key" ON "Deity"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Temple_slug_key" ON "Temple"("slug");

-- CreateIndex
CREATE INDEX "Temple_status_stateId_idx" ON "Temple"("status", "stateId");

-- CreateIndex
CREATE INDEX "Temple_status_deityId_idx" ON "Temple"("status", "deityId");

-- CreateIndex
CREATE INDEX "Temple_searchText_idx" ON "Temple" USING GIN ("searchText" gin_trgm_ops);

-- CreateIndex
CREATE UNIQUE INDEX "TempleVisitInfo_templeId_key" ON "TempleVisitInfo"("templeId");

-- CreateIndex
CREATE UNIQUE INDEX "Collection_slug_key" ON "Collection"("slug");

-- CreateIndex
CREATE INDEX "CollectionTemple_templeId_idx" ON "CollectionTemple"("templeId");

-- CreateIndex
CREATE UNIQUE INDEX "TempleImage_publicId_key" ON "TempleImage"("publicId");

-- CreateIndex
CREATE INDEX "TempleImage_templeId_imageType_displayOrder_idx" ON "TempleImage"("templeId", "imageType", "displayOrder");

-- CreateIndex
CREATE UNIQUE INDEX "Festival_slug_key" ON "Festival"("slug");

-- CreateIndex
CREATE INDEX "Ritual_templeId_idx" ON "Ritual"("templeId");

-- CreateIndex
CREATE INDEX "TempleReference_templeId_idx" ON "TempleReference"("templeId");

-- CreateIndex
CREATE INDEX "NearbyPlace_templeId_idx" ON "NearbyPlace"("templeId");

-- CreateIndex
CREATE UNIQUE INDEX "SlugRedirect_oldSlug_key" ON "SlugRedirect"("oldSlug");

-- AddForeignKey
ALTER TABLE "Temple" ADD CONSTRAINT "Temple_deityId_fkey" FOREIGN KEY ("deityId") REFERENCES "Deity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Temple" ADD CONSTRAINT "Temple_stateId_fkey" FOREIGN KEY ("stateId") REFERENCES "State"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TempleVisitInfo" ADD CONSTRAINT "TempleVisitInfo_templeId_fkey" FOREIGN KEY ("templeId") REFERENCES "Temple"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CollectionTemple" ADD CONSTRAINT "CollectionTemple_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "Collection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CollectionTemple" ADD CONSTRAINT "CollectionTemple_templeId_fkey" FOREIGN KEY ("templeId") REFERENCES "Temple"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RelatedCollection" ADD CONSTRAINT "RelatedCollection_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "Collection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RelatedCollection" ADD CONSTRAINT "RelatedCollection_relatedCollectionId_fkey" FOREIGN KEY ("relatedCollectionId") REFERENCES "Collection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TempleImage" ADD CONSTRAINT "TempleImage_templeId_fkey" FOREIGN KEY ("templeId") REFERENCES "Temple"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TempleFestival" ADD CONSTRAINT "TempleFestival_templeId_fkey" FOREIGN KEY ("templeId") REFERENCES "Temple"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TempleFestival" ADD CONSTRAINT "TempleFestival_festivalId_fkey" FOREIGN KEY ("festivalId") REFERENCES "Festival"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ritual" ADD CONSTRAINT "Ritual_templeId_fkey" FOREIGN KEY ("templeId") REFERENCES "Temple"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TempleReference" ADD CONSTRAINT "TempleReference_templeId_fkey" FOREIGN KEY ("templeId") REFERENCES "Temple"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NearbyPlace" ADD CONSTRAINT "NearbyPlace_templeId_fkey" FOREIGN KEY ("templeId") REFERENCES "Temple"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NearbyPlace" ADD CONSTRAINT "NearbyPlace_relatedTempleId_fkey" FOREIGN KEY ("relatedTempleId") REFERENCES "Temple"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SlugRedirect" ADD CONSTRAINT "SlugRedirect_templeId_fkey" FOREIGN KEY ("templeId") REFERENCES "Temple"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Data-integrity rules from docs/DATABASE-SCHEMA.md that Prisma cannot express.
-- Coordinates are both set or both empty, and set only with a cited source.
ALTER TABLE "Temple" ADD CONSTRAINT "Temple_coordinates_pair_check"
  CHECK ((latitude IS NULL) = (longitude IS NULL));
ALTER TABLE "Temple" ADD CONSTRAINT "Temple_coordinates_source_check"
  CHECK (latitude IS NULL OR length(trim("coordinatesSource")) > 0);

-- A reference needs at least one of url or citation.
ALTER TABLE "TempleReference" ADD CONSTRAINT "TempleReference_url_or_citation_check"
  CHECK (url IS NOT NULL OR citation IS NOT NULL);
