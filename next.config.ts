import type { NextConfig } from 'next'

const isDev = process.env.NODE_ENV === 'development'

/*
 * Content Security Policy without nonces.
 *
 * A nonce-based CSP forces every page into dynamic rendering, which would disable
 * the static generation that D-015 requires (see Next.js "Content Security Policy"
 * guide). So we use the documented static policy with 'unsafe-inline' for the
 * framework's inline bootstrap scripts, and keep every other directive strict.
 * Recorded as D-023.
 */
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ''}`,
  "style-src 'self' 'unsafe-inline'",
  // Cloudinary for temple images (D-012); Mapbox Static Images for the location card (D-013).
  "img-src 'self' data: blob: https://res.cloudinary.com https://api.mapbox.com",
  "font-src 'self'",
  `connect-src 'self'${isDev ? ' ws: wss:' : ''}`,
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "manifest-src 'self'",
].join('; ')

const securityHeaders = [
  { key: 'Content-Security-Policy', value: csp },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'X-Frame-Options', value: 'DENY' },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
  },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
]

/*
 * Directory robots and canonical rules (ROUTES.md §4.3) as HTTP headers. /temples reads
 * its query parameters at request time, so Next.js streams its <meta>/<link> tags into
 * the body, where crawlers may ignore them. X-Robots-Tag and a Link canonical header are
 * honoured by Google regardless of HTML placement. One entry per parameter: conditions
 * inside a single `has` must all match. Recorded as D-038.
 */
const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000').replace(/\/$/, '')
const DIRECTORY_FILTER_PARAMS = ['q', 'deity', 'state', 'region', 'collection']
const filteredDirectoryHeaders = DIRECTORY_FILTER_PARAMS.map((key) => ({
  source: '/temples',
  has: [{ type: 'query' as const, key }],
  headers: [
    { key: 'X-Robots-Tag', value: 'noindex, follow' },
    { key: 'Link', value: `<${siteUrl}/temples>; rel="canonical"` },
  ],
}))

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // Cache Components (D-015): pages prerender from cached, tagged reads and refresh on
  // demand via /api/revalidate. See src/server/queries.ts.
  cacheComponents: true,
  // Cloudinary does the resizing (D-012); see src/lib/cloudinary-loader.ts.
  images: {
    loader: 'custom',
    loaderFile: './src/lib/cloudinary-loader.ts',
  },
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }, ...filteredDirectoryHeaders]
  },
}

export default nextConfig
