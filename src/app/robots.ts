import type { MetadataRoute } from 'next'

import { absoluteUrl } from '@/lib/seo'

/**
 * robots.txt. Production: everything except the API and the internal design-system
 * preview. Preview deploys: nothing, so they are never indexed.
 */
export default function robots(): MetadataRoute.Robots {
  const vercelEnv = process.env.VERCEL_ENV
  if (vercelEnv && vercelEnv !== 'production') {
    return { rules: { userAgent: '*', disallow: '/' } }
  }
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/api/', '/design-system'] },
    sitemap: absoluteUrl('/sitemap.xml'),
  }
}
