import type { MetadataRoute } from 'next'

import { siteConfig } from '@/lib/site-config'

/**
 * Web app manifest (ARCHITECTURE.md §11, D-011): installable, no service worker in V1.
 * Colours mirror --saffron-700 (theme) and --ivory-50 (background); the manifest
 * format needs literal values.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.name,
    short_name: siteConfig.name,
    description: siteConfig.description,
    start_url: '/',
    scope: '/',
    display: 'standalone',
    orientation: 'portrait',
    theme_color: '#BF510C',
    background_color: '#FBF6EC',
    lang: 'en-IN',
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
  }
}
