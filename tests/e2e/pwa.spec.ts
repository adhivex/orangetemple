import { expect, test } from './fixtures'

/**
 * Installable web app and offline fallback (MOBILE_WEBAPP.md §1–2, D-050). Needs a
 * production build: the service worker is not registered in development.
 */
test.describe('PWA', () => {
  test.skip(() => test.info().project.name !== 'mobile', 'the same at every width')

  test('the manifest is installable and lets tablets rotate', async ({ request }) => {
    const manifest = await (await request.get('/manifest.webmanifest')).json()
    expect(manifest).toMatchObject({ display: 'standalone', start_url: '/?source=pwa', scope: '/' })
    expect(manifest.orientation).toBeUndefined()
    const sizes = manifest.icons.map((icon: { sizes: string; purpose: string }) => icon.sizes)
    expect(sizes).toEqual(expect.arrayContaining(['192x192', '512x512']))
    expect(manifest.icons.some((icon: { purpose: string }) => icon.purpose === 'maskable')).toBe(
      true,
    )
  })

  test('the service worker controls the site with a root scope', async ({ page, request }) => {
    const sw = await request.get('/serwist/sw.js')
    expect(sw.headers()['service-worker-allowed']).toBe('/')
    await page.goto('/')
    const scope = await page.evaluate(async () => (await navigator.serviceWorker.ready).scope)
    expect(new URL(scope).pathname).toBe('/')
  })

  test('offline: saved pages still open, others show the offline page', async ({
    page,
    context,
  }) => {
    test.setTimeout(60_000)
    test.info().annotations.push({ type: 'offline', description: 'network cut on purpose' })
    await page.goto('/')
    await page.evaluate(async () => {
      await navigator.serviceWorker.ready
    })
    // Load once under the service worker's control so the page is saved.
    await page.reload()
    await expect.poll(() => page.evaluate(() => !!navigator.serviceWorker.controller)).toBe(true)
    await page.reload()

    await context.setOffline(true)
    await page.reload()
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(
      'Discover the Sacred Temples of Bharat',
    )

    await page.goto('/credits')
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('You’re offline')
    await expect(page.getByRole('button', { name: 'Try again' })).toBeVisible()
    await context.setOffline(false)
  })
})
