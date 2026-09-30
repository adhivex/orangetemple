import AxeBuilder from '@axe-core/playwright'
import type { Page } from '@playwright/test'

import { expect, isMobile, test } from './fixtures'

/** Cookie consent (HOMEPAGE_SPEC.md "Cookie consent", D-051) on a first visit. */
test.use({ consent: 'none', reducedMotion: 'reduce' })

const TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']

async function consentCookie(page: Page) {
  const cookie = (await page.context().cookies()).find((c) => c.name === 'ot_consent')
  return cookie ? JSON.parse(decodeURIComponent(cookie.value)) : null
}

test('the banner asks first, and rejecting is one tap', async ({ page }) => {
  await page.goto('/')
  const banner = page.getByRole('region', { name: 'We value your privacy' })
  await expect(banner).toBeVisible()
  // No analytics before a choice (D-051).
  await expect(page.locator('script[src*="insights"]')).toHaveCount(0)

  await banner.getByRole('button', { name: 'Reject optional' }).click()
  await expect(banner).toBeHidden()
  await expect(page.getByText('Only essential cookies will be used.')).toBeVisible()
  expect(await consentCookie(page)).toMatchObject({
    v: 1,
    essential: true,
    analytics: false,
    marketing: false,
  })

  // The choice is remembered.
  await page.reload()
  await page.waitForTimeout(1500)
  await expect(banner).toBeHidden()
})

test('preferences can be customised, and reopened from the footer', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'Customise preferences' }).click()
  const dialog = page.getByRole('dialog', { name: 'Cookie preferences' })
  // The dialog's code loads on first open.
  await expect(dialog).toBeVisible({ timeout: 15_000 })
  const { violations } = await new AxeBuilder({ page }).withTags(TAGS).analyze()
  expect(violations.map((v) => v.id)).toEqual([])

  await dialog.getByRole('switch', { name: 'Analytics' }).click()
  await dialog.getByRole('button', { name: 'Save choices' }).click()
  await expect(dialog).toBeHidden()
  expect(await consentCookie(page)).toMatchObject({ analytics: true, marketing: false })

  await page.getByRole('contentinfo').getByRole('button', { name: 'Cookie Settings' }).click()
  await expect(dialog.getByRole('switch', { name: 'Analytics' })).toBeChecked()
  await expect(dialog.getByRole('switch', { name: 'Marketing' })).not.toBeChecked()
  await page.keyboard.press('Escape')
  await expect(dialog).toBeHidden()
})

test('the open banner has no accessibility violations', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('region', { name: 'We value your privacy' })).toBeVisible()
  const { violations } = await new AxeBuilder({ page })
    .include('section[aria-labelledby="cookie-banner-title"]')
    .withTags(TAGS)
    .analyze()
  expect(violations.map((v) => v.id)).toEqual([])
})

test('on phones the banner sits above the tab bar without covering it', async ({ page }) => {
  test.skip(!isMobile(page), 'the tab bar is phone-only')
  await page.goto('/')
  const banner = await page.getByRole('region', { name: 'We value your privacy' }).boundingBox()
  const tabBar = await page.getByRole('navigation', { name: 'Main' }).boundingBox()
  expect(banner!.y + banner!.height).toBeLessThanOrEqual(tabBar!.y)
})
