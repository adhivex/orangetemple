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

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // Cloudinary does the resizing (D-012); see src/lib/cloudinary-loader.ts.
  images: {
    loader: 'custom',
    loaderFile: './src/lib/cloudinary-loader.ts',
  },
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }]
  },
}

export default nextConfig
