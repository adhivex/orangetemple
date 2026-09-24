import type { MetadataRoute } from 'next'

import { PAGE_SIZE } from '@/lib/directory'
import { collectionHref, directoryHref, templeHref } from '@/lib/routes'
import { absoluteUrl } from '@/lib/seo'
import { getSitemapData } from '@/server/queries'

/**
 * Sitemap (ROUTES.md §4.6): published content only; lastModified from updatedAt.
 * Filtered directory URLs are never listed (they are noindex); ?page=N pages are.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { temples, collections } = await getSitemapData()
  const latest = (dates: Date[]) =>
    dates.length > 0 ? new Date(Math.max(...dates.map((d) => d.getTime()))) : undefined
  const contentUpdated = latest([...temples, ...collections].map((r) => r.updatedAt))
  const directoryPages = Math.max(1, Math.ceil(temples.length / PAGE_SIZE))

  return [
    { url: absoluteUrl('/'), lastModified: contentUpdated },
    ...Array.from({ length: directoryPages }, (_, i) => ({
      url: absoluteUrl(directoryHref({ page: i + 1 })),
      lastModified: contentUpdated,
    })),
    ...collections.map((c) => ({
      url: absoluteUrl(collectionHref(c.slug)),
      lastModified: c.updatedAt,
    })),
    ...temples.map((t) => ({ url: absoluteUrl(templeHref(t.slug)), lastModified: t.updatedAt })),
    ...['/explore-bharat', '/about', '/contact', '/credits', '/privacy'].map((path) => ({
      url: absoluteUrl(path),
    })),
  ]
}
