import type { Page } from '@playwright/test'

import { expect, isMobile, test } from './fixtures'

/**
 * Describes the focused element: whether it (or its card, which draws the ring for
 * card links) shows a focus indicator, and whether it is on screen and not covered by
 * the sticky header or bottom navigation (WCAG 2.4.11).
 */
function focused(page: Page) {
  return page.evaluate(() => {
    const el = document.activeElement as HTMLElement | null
    if (!el || el === document.body) return null
    const ringed = (node: Element) => {
      const style = getComputedStyle(node)
      return (
        (style.outlineStyle !== 'none' && parseFloat(style.outlineWidth) > 0) ||
        style.boxShadow !== 'none'
      )
    }
    const card = el.closest('article')
    const rect = el.getBoundingClientRect()
    const hit = document.elementFromPoint(rect.left + rect.width / 2, rect.top + rect.height / 2)
    return {
      label: `${el.tagName.toLowerCase()} "${(el.getAttribute('aria-label') ?? el.textContent ?? '').trim().slice(0, 40)}"`,
      indicator: ringed(el) || (card !== null && ringed(card)),
      onScreen: hit !== null && (hit === el || el.contains(hit) || hit.contains(el)),
    }
  })
}

// Scrolling to the focused element is instant, so it can be measured straight away.
test.use({ reducedMotion: 'reduce' })

test('the skip link is the first stop and moves focus to the content', async ({ page }) => {
  await page.goto('/')
  await page.keyboard.press('Tab')
  const skip = page.getByRole('link', { name: 'Skip to content' })
  await expect(skip).toBeFocused()
  await expect(skip).toBeInViewport()
  await page.keyboard.press('Enter')
  await expect(page.locator('main#main')).toBeFocused()
})

for (const path of ['/', '/temples', '/temples/rameshwaram']) {
  test(`every Tab stop on ${path} is visible and shows focus`, async ({ page }) => {
    await page.goto(path)
    const problems: string[] = []
    for (let i = 0; i < 40; i++) {
      await page.keyboard.press('Tab')
      const el = await focused(page)
      if (!el) break
      if (!el.indicator) problems.push(`no focus indicator: ${el.label}`)
      if (!el.onScreen) problems.push(`hidden or covered: ${el.label}`)
    }
    expect(problems).toEqual([])
  })
}

test('the menu sheet opens and closes from the keyboard', async ({ page }) => {
  test.skip(!isMobile(page), 'the menu sheet is the mobile navigation')
  await page.goto('/')
  const trigger = page.getByRole('button', { name: 'Open menu' })
  await trigger.focus()
  await page.keyboard.press('Enter')
  const dialog = page.getByRole('dialog', { name: 'Menu' })
  await expect(dialog).toBeVisible()
  // Focus is trapped inside the open sheet.
  for (let i = 0; i < 15; i++) {
    await page.keyboard.press('Tab')
    expect(await dialog.evaluate((d) => d.contains(document.activeElement))).toBe(true)
  }
  await page.keyboard.press('Escape')
  await expect(dialog).toBeHidden()
  await expect(trigger).toBeFocused()
})

test('filters can be applied from the keyboard', async ({ page }) => {
  await page.goto('/temples')
  if (isMobile(page)) {
    const trigger = page.getByRole('button', { name: /^Filters/ })
    await trigger.focus()
    await page.keyboard.press('Enter')
    await expect(page.getByRole('dialog', { name: 'Filter temples' })).toBeVisible()
    await page.locator('#sheet-deity').focus()
  } else {
    await page.locator('#panel-deity').focus()
  }
  await page.keyboard.press('ArrowDown')
  // Tab to "Show results" through the remaining fields and "Clear filters".
  for (let i = 0; i < 5; i++) await page.keyboard.press('Tab')
  await expect(page.getByRole('button', { name: 'Show results' }).first()).toBeFocused()
  await page.keyboard.press('Enter')
  await expect(page).toHaveURL(/[?&]deity=/)
})
