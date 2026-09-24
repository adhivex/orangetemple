import { expect, test } from './fixtures'

/**
 * The two projects run every test at 390 and 1280 px. This adds the other reference
 * widths (CLAUDE.md, DESIGN-SYSTEM.md) and checks nothing overflows sideways.
 */
const WIDTHS = [360, 430, 768, 1440]
const PAGES = ['/', '/temples', '/temples/rameshwaram', '/jyotirlingas', '/explore-bharat']

test('no page scrolls sideways at any reference width', async ({ page }) => {
  test.skip(test.info().project.name !== 'desktop', 'widths are set explicitly here')
  const problems: string[] = []
  for (const width of WIDTHS) {
    await page.setViewportSize({ width, height: 900 })
    for (const path of PAGES) {
      await page.goto(path)
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      )
      if (overflow > 0) problems.push(`${path} at ${width}px overflows by ${overflow}px`)
    }
  }
  expect(problems).toEqual([])
})
