import { test as base, expect, type Page } from '@playwright/test'

/** A stored "essential only" choice, so the first-visit cookie banner stays out of the way. */
const storedConsent = encodeURIComponent(
  JSON.stringify({
    v: 1,
    essential: true,
    analytics: false,
    marketing: false,
    ts: '2026-09-30T00:00:00.000Z',
  }),
)

/**
 * Every test fails if the page logs a console error or throws: that catches hydration
 * mismatches, CSP violations and broken client code on the pages the smoke tests visit.
 * Tests start with a cookie choice already made; set `consent: 'none'` to see the banner.
 */
export const test = base.extend<{ consent: 'stored' | 'none'; consoleErrors: string[] }>({
  consent: ['stored', { option: true }],
  // `provide` is Playwright's fixture callback (usually named `use`, which the React hooks
  // lint rule mistakes for React's `use` in a property named like a function).
  context: async ({ context, consent, baseURL }, provide) => {
    if (consent === 'stored') {
      await context.addCookies([{ name: 'ot_consent', value: storedConsent, url: baseURL! }])
    }
    await provide(context)
  },
  consoleErrors: [
    async ({ page }, use, testInfo) => {
      const errors: string[] = []
      // A 404 page is served with a 404 status on purpose; Chrome logs that as a failed load.
      const notFoundPages = new Set<string>()
      page.on('response', (response) => {
        if (response.status() === 404 && response.request().isNavigationRequest()) {
          notFoundPages.add(response.url())
        }
      })
      page.on('console', (message) => {
        if (message.type() !== 'error') return
        if (notFoundPages.size > 0 && message.text().includes('status of 404')) return
        // Tests annotated "offline" cut the network on purpose, so failed loads are expected
        // (Chromium reports them as ERR_INTERNET_DISCONNECTED or, through the service worker,
        // ERR_FAILED).
        const offline = testInfo.annotations.some((a) => a.type === 'offline')
        if (offline && /Failed to load resource: net::ERR_/.test(message.text())) return
        errors.push(message.text())
      })
      page.on('pageerror', (error) => errors.push(error.message))
      await use(errors)
      expect(errors, 'console errors').toEqual([])
    },
    { auto: true },
  ],
})

export { expect }

export const isMobile = (page: Page) => (page.viewportSize()?.width ?? 0) < 768

/** Distinct temple page links inside a locator, e.g. a collection section. */
export async function templeLinks(page: Page, selector: string) {
  const hrefs = await page
    .locator(`${selector} a[href^="/temples/"]`)
    .evaluateAll((links) => links.map((link) => link.getAttribute('href')))
  return [...new Set(hrefs)]
}
