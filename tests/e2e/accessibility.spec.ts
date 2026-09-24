import AxeBuilder from '@axe-core/playwright'
import type { Page } from '@playwright/test'

import { expect, isMobile, test } from './fixtures'

/** WCAG 2.2 AA (DESIGN-SYSTEM.md accessibility). */
const TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']

async function expectNoViolations(page: Page) {
  // Render every section so axe sees the whole page, not only what is near the viewport.
  await page.addStyleTag({ content: '.render-lazily{content-visibility:visible!important}' })
  const { violations } = await new AxeBuilder({ page }).withTags(TAGS).analyze()
  expect(
    violations.map((v) => ({
      id: v.id,
      impact: v.impact,
      nodes: v.nodes.map((node) => node.target.join(' ')).slice(0, 5),
    })),
  ).toEqual([])
}

// Entrance animations would leave text mid-fade while axe measures contrast.
test.use({ reducedMotion: 'reduce' })

const PAGES = [
  '/',
  '/temples',
  '/temples?q=qqqzzzxxx',
  '/temples/rameshwaram',
  '/temples/kedarnath',
  '/jyotirlingas',
  '/char-dham',
  '/explore-bharat',
  '/about',
  '/contact',
  '/credits',
  '/privacy',
  '/this-page-does-not-exist',
]

for (const path of PAGES) {
  test(`${path} has no WCAG A/AA violations`, async ({ page }) => {
    await page.goto(path)
    await expectNoViolations(page)
  })
}

test('the open menu sheet has no violations', async ({ page }) => {
  test.skip(!isMobile(page), 'the menu sheet is the mobile navigation')
  await page.goto('/')
  await page.getByRole('button', { name: 'Open menu' }).click()
  await expect(page.getByRole('dialog', { name: 'Menu' })).toBeVisible()
  await expectNoViolations(page)
})

test('the open filter sheet has no violations', async ({ page }) => {
  test.skip(!isMobile(page), 'filters use a bottom sheet below the lg breakpoint')
  await page.goto('/temples')
  await page.getByRole('button', { name: /^Filters/ }).click()
  await expect(page.getByRole('dialog', { name: 'Filter temples' })).toBeVisible()
  await expectNoViolations(page)
})
