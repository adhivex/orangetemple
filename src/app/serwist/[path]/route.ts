import { spawnSync } from 'node:child_process'

import { createSerwistRoute } from '@serwist/turbopack'
import { cacheLife } from 'next/cache'

/*
 * Serves the bundled service worker at /serwist/sw.js (D-050), with the
 * `Service-Worker-Allowed: /` header so it can control the whole site.
 *
 * Precache: the stylesheet, the self-hosted fonts, the small icons and the /offline page,
 * so the offline page always renders styled. JavaScript is cached as pages are visited
 * instead of all at once, which would cost a phone over a megabyte on its first visit
 * (MOBILE_WEBAPP.md §2). /offline is precached under the commit it was built from, so
 * deploys refresh it.
 */
const revision =
  process.env.VERCEL_GIT_COMMIT_SHA ||
  spawnSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf-8' }).stdout?.trim() ||
  crypto.randomUUID()

const serwistRoute = createSerwistRoute({
  swSrc: 'src/app/sw.ts',
  // Relative to the project root. The small icons only: the 512px ones are 130 KB each.
  globPatterns: [
    '.next/static/**/*.css',
    // Preloaded fonts only (`.p.`): every page has already downloaded them, so the
    // precache is served from the browser's HTTP cache. Other faces cache on first use.
    '.next/static/media/*.p.*.woff2',
    'public/icons/{icon.svg,favicon-32.png,icon-192.png,apple-touch-icon.png}',
  ],
  additionalPrecacheEntries: [{ url: '/offline', revision }],
  useNativeEsbuild: true,
})

export const { generateStaticParams } = serwistRoute

/**
 * Built once per deploy. The helper's `dynamic = 'force-static'` export is not allowed
 * with Cache Components (D-036), so the bundle is cached here instead; without it, the
 * route would run esbuild on the server at request time.
 */
async function serwistFile(path: string) {
  'use cache'
  cacheLife('max')
  const response = await serwistRoute.GET(new Request('http://localhost/'), {
    params: Promise.resolve({ path }),
  })
  return { body: await response.text(), headers: Object.fromEntries(response.headers) }
}

export async function GET(_request: Request, { params }: { params: Promise<{ path: string }> }) {
  const { body, headers } = await serwistFile((await params).path)
  return new Response(body, { headers })
}
