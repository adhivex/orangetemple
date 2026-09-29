import type { MetadataRoute } from 'next'

import { siteConfig } from '@/lib/site-config'

/**
 * Web app manifest (docs/design/code/manifest.ts, MOBILE_WEBAPP.md §1). No orientation
 * lock, so installed tablets rotate (D-053). Colours mirror --ot-saffron (theme) and
 * --ot-bg (background); the manifest format needs literal values.
 */
export default function manifest(): MetadataRoute.Manifest {
  const icon = [{ src: '/icons/icon-192.png', sizes: '192x192' }]
  return {
    id: '/',
    name: `${siteConfig.name} — Sacred Temples of Bharat`,
    short_name: siteConfig.name,
    description:
      "Discover India's sacred temples, Jyotirlingas, Char Dham, stories and yatra guides.",
    start_url: '/?source=pwa',
    scope: '/',
    display: 'standalone',
    background_color: '#FBF1E5',
    theme_color: '#D96B22',
    lang: 'en-IN',
    dir: 'ltr',
    categories: ['travel', 'lifestyle', 'education'],
    icons: [
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      {
        src: '/icons/icon-maskable-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
    shortcuts: [
      { name: '12 Jyotirlingas', url: '/jyotirlingas', icons: icon },
      { name: 'Char Dham', url: '/char-dham', icons: icon },
      { name: 'Search temples', url: '/?search=1', icons: icon },
    ],
  }
}
