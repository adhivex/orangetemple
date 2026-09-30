import AxeBuilder from '@axe-core/playwright'

import { expect, isMobile, test } from './fixtures'

/** Temple search overlay (HOMEPAGE_SPEC.md "Search overlay", D-048). */
test.use({ reducedMotion: 'reduce' })

const TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']

test('filters as you type and opens a temple with Enter', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('banner').getByRole('button', { name: 'Search temples' }).click()
  const dialog = page.getByRole('dialog', { name: 'Search temples' })
  // The overlay's code loads on first open.
  await expect(dialog).toBeVisible({ timeout: 15_000 })
  const input = dialog.getByRole('combobox')
  await expect(input).toBeFocused()

  await input.fill('guj')
  const options = dialog.getByRole('option')
  await expect(options).toHaveText([
    /^Somnath/,
    /^Nageshwar/,
    /^Dwarkadhish/,
    'See all results in the temple directory',
  ])
  await expect(page.getByRole('main')).toBeVisible()
  const { violations } = await new AxeBuilder({ page }).withTags(TAGS).analyze()
  expect(violations.map((v) => v.id)).toEqual([])

  await input.fill('kedar')
  await input.press('Enter')
  await expect(page).toHaveURL(/\/temples\/kedarnath$/)
  await expect(dialog).toBeHidden()
})

test('shows the empty state and links to the full directory search', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('banner').getByRole('button', { name: 'Search temples' }).click()
  const dialog = page.getByRole('dialog', { name: 'Search temples' })
  await expect(dialog).toBeVisible({ timeout: 15_000 })
  await dialog.getByRole('combobox').fill('Kedarnth')
  await expect(dialog.getByText(/No temples match that yet/)).toBeVisible()
  await dialog.getByRole('option', { name: /See all results/ }).click()
  await expect(page).toHaveURL(/\/temples\?q=Kedarnth$/)
  // The directory's fuzzy search tolerates the misspelling (D-037).
  await expect(page.getByRole('link', { name: /Kedarnath Temple/ }).first()).toBeVisible()
})

test('Back closes the overlay without leaving the page', async ({ page }) => {
  await page.goto('/')
  const trigger = page.getByRole('banner').getByRole('button', { name: 'Search temples' })
  await trigger.click()
  const dialog = page.getByRole('dialog', { name: 'Search temples' })
  await expect(dialog).toBeVisible({ timeout: 15_000 })
  await page.goBack()
  await expect(dialog).toBeHidden()
  await expect(page).toHaveURL(/\/$/)
  await expect(trigger).toBeFocused()
})

test('phones: full screen with Cancel; the Search tab and "All" tile open it', async ({ page }) => {
  test.skip(!isMobile(page), 'phone layout')
  await page.goto('/')
  await page
    .getByRole('navigation', { name: 'Main' })
    .getByRole('button', { name: 'Search' })
    .click()
  const dialog = page.getByRole('dialog', { name: 'Search temples' })
  await expect(dialog).toBeVisible({ timeout: 15_000 })
  const box = await dialog.boundingBox()
  expect(box?.width).toBe(page.viewportSize()?.width)
  await dialog.getByRole('button', { name: 'Cancel' }).click()
  await expect(dialog).toBeHidden()

  await page.getByRole('button', { name: 'All', exact: true }).click()
  await expect(dialog).toBeVisible()
})
