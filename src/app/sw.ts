/// <reference lib="esnext" />
/// <reference lib="webworker" />
import type { PrecacheEntry, SerwistGlobalConfig } from 'serwist'
import { CacheFirst, ExpirationPlugin, NetworkFirst, NetworkOnly, Serwist } from 'serwist'

/*
 * Service worker (MOBILE_WEBAPP.md §2, D-050), bundled by the /serwist/[path] route.
 * - Precaches the build's static files and the /offline page.
 * - Pages: network first with a 3s timeout, then the cache, then /offline.
 * - Images and fonts: cache first, 60 days, at most 200 entries each.
 * - Never caches POST requests or /api/* responses.
 */

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined
  }
}

declare const self: ServiceWorkerGlobalScope

const SIXTY_DAYS = 60 * 24 * 60 * 60

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: [
    // API routes and anything that is not a GET go straight to the network, uncached.
    {
      matcher: ({ url, request, sameOrigin }) =>
        request.method !== 'GET' || (sameOrigin && url.pathname.startsWith('/api/')),
      handler: new NetworkOnly(),
    },
    // Never serve an old service worker from the cache.
    {
      matcher: ({ url, sameOrigin }) => sameOrigin && url.pathname.startsWith('/serwist/'),
      handler: new NetworkOnly(),
    },
    {
      matcher: ({ request }) => request.mode === 'navigate',
      handler: new NetworkFirst({
        cacheName: 'pages',
        networkTimeoutSeconds: 3,
        plugins: [new ExpirationPlugin({ maxEntries: 50, maxAgeSeconds: SIXTY_DAYS })],
      }),
    },
    // Hashed build assets never change, so the cached copy is always right.
    {
      matcher: ({ url, sameOrigin }) => sameOrigin && url.pathname.startsWith('/_next/static/'),
      handler: new CacheFirst({
        cacheName: 'static',
        plugins: [new ExpirationPlugin({ maxEntries: 200, maxAgeSeconds: SIXTY_DAYS })],
      }),
    },
    {
      matcher: ({ request }) => request.destination === 'image',
      handler: new CacheFirst({
        cacheName: 'images',
        plugins: [new ExpirationPlugin({ maxEntries: 200, maxAgeSeconds: SIXTY_DAYS })],
      }),
    },
    {
      matcher: ({ request }) => request.destination === 'font',
      handler: new CacheFirst({
        cacheName: 'fonts',
        plugins: [new ExpirationPlugin({ maxEntries: 200, maxAgeSeconds: SIXTY_DAYS })],
      }),
    },
  ],
  fallbacks: {
    entries: [{ url: '/offline', matcher: ({ request }) => request.destination === 'document' }],
  },
})

serwist.addEventListeners()
