import type { Metadata } from 'next'
import type {
  BreadcrumbList,
  HinduTemple,
  ItemList,
  Organization,
  WebSite,
  WithContext,
} from 'schema-dts'

import { env } from '@/env'
import { siteConfig } from '@/lib/site-config'

/*
 * SEO helpers (ARCHITECTURE.md §9, ROUTES.md §4). Metadata and JSON-LD are always built
 * from content records; nothing here states a fact that is not in the database.
 */

const SITE_URL = env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, '')

export function absoluteUrl(path: string) {
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`
}

const DEFAULT_SOCIAL_IMAGE = {
  url: '/opengraph-image',
  width: 1200,
  height: 630,
  alt: `${siteConfig.name}: ${siteConfig.tagline}`,
}

/**
 * Complete page metadata: title, description, canonical, Open Graph and Twitter.
 * Next.js replaces (not merges) a parent's openGraph object, so every page sets it fully
 * here. Social images come from the route's opengraph-image file.
 */
export function pageMetadata({
  title,
  description,
  path,
  absoluteTitle = false,
  ownImage = false,
}: {
  title: string
  description: string
  path: string
  /** Use the title as-is instead of the "%s · OrangeTemple" template. */
  absoluteTitle?: boolean
  /**
   * True when the route has its own opengraph-image file. Page-level images override
   * file-based ones, so the default must then be omitted.
   */
  ownImage?: boolean
}): Metadata {
  const images = ownImage ? undefined : [DEFAULT_SOCIAL_IMAGE]
  const fullTitle = absoluteTitle ? title : `${title} · ${siteConfig.name}`
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: fullTitle,
      description,
      url: path,
      siteName: siteConfig.name,
      locale: 'en_IN',
      type: 'website',
      ...(images ? { images } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      ...(images ? { images } : {}),
    },
  }
}

// ─── JSON-LD ────────────────────────────────────────────────────────────────

/** Serialises JSON-LD safely for an inline script: "<" cannot close the tag. */
export function serializeJsonLd(data: object) {
  return JSON.stringify(data).replace(/</g, '\\u003c')
}

export type Crumb = { name: string; path?: string }

export function breadcrumbJsonLd(crumbs: Crumb[]): WithContext<BreadcrumbList> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      ...(crumb.path ? { item: absoluteUrl(crumb.path) } : {}),
    })),
  }
}

export function templeJsonLd(temple: {
  name: string
  slug: string
  alternateNames: string[]
  shortDescription: string
  city: string
  address: string | null
  state: { name: string }
  latitude: number | null
  longitude: number | null
  officialWebsite: string | null
  heroImageUrl: string | null
}): WithContext<HinduTemple> {
  const hasGeo = temple.latitude !== null && temple.longitude !== null
  return {
    '@context': 'https://schema.org',
    '@type': 'HinduTemple',
    name: temple.name,
    ...(temple.alternateNames.length > 0 ? { alternateName: temple.alternateNames } : {}),
    description: temple.shortDescription,
    url: absoluteUrl(`/temples/${temple.slug}`),
    ...(temple.heroImageUrl ? { image: temple.heroImageUrl } : {}),
    address: {
      '@type': 'PostalAddress',
      addressLocality: temple.city,
      addressRegion: temple.state.name,
      addressCountry: 'IN',
      ...(temple.address ? { streetAddress: temple.address } : {}),
    },
    // Only verified coordinates exist in the database (CHECK constraint + seed rules).
    ...(hasGeo
      ? {
          geo: {
            '@type': 'GeoCoordinates',
            latitude: temple.latitude!,
            longitude: temple.longitude!,
          },
        }
      : {}),
    ...(temple.officialWebsite ? { sameAs: temple.officialWebsite } : {}),
  }
}

export function collectionJsonLd(collection: {
  name: string
  description: string
  path: string
  temples: { name: string; slug: string }[]
}): WithContext<ItemList> {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: collection.name,
    description: collection.description,
    url: absoluteUrl(collection.path),
    numberOfItems: collection.temples.length,
    itemListOrder: 'https://schema.org/ItemListOrderAscending',
    itemListElement: collection.temples.map((temple, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: temple.name,
      url: absoluteUrl(`/temples/${temple.slug}`),
    })),
  }
}

export function organizationJsonLd(): WithContext<Organization> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteConfig.name,
    url: SITE_URL,
    logo: absoluteUrl('/icons/icon-512.png'),
  }
}

export function websiteJsonLd(): WithContext<WebSite> {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteConfig.name,
    url: SITE_URL,
    description: siteConfig.description,
    inLanguage: 'en-IN',
    potentialAction: {
      '@type': 'SearchAction',
      target: { '@type': 'EntryPoint', urlTemplate: `${SITE_URL}/temples?q={search_term_string}` },
      // schema-dts does not model the Google-specific `query-input` property.
      ...({ 'query-input': 'required name=search_term_string' } as object),
    },
  }
}
