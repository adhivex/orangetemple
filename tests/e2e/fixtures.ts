import { test as base, expect, type Page } from '@playwright/test'

/**
 * Every test fails if the page logs a console error or throws: that catches hydration
 * mismatches, CSP violations and broken client code on the pages the smoke tests visit.
 */
export const test = base.extend<{ consoleErrors: string[] }>({
  consoleErrors: [
    async ({ page }, use) => {
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
