import { expect, isMobile, test } from './fixtures'

/**
 * The two projects run every test at 390 and 1280 px. This adds the sizes in
 * docs/design/MOBILE_WEBAPP.md §7 (phones, landscape phones, tablets in both
 * orientations, desktop) and the §8 acceptance checks that can be measured.
 */
const SIZES = [
  { width: 320, height: 568 },
  { width: 360, height: 800 },
  { width: 430, height: 932 },
  { width: 844, height: 390 }, // landscape phone
  { width: 768, height: 1024 },
  { width: 820, height: 1180 },
  { width: 1024, height: 768 },
  { width: 1180, height: 820 },
  { width: 1440, height: 900 },
]
const PAGES = ['/', '/temples', '/temples/rameshwaram', '/jyotirlingas', '/explore-bharat']

test('no page scrolls sideways at any reference size', async ({ page }) => {
  test.skip(test.info().project.name !== 'desktop', 'sizes are set explicitly here')
  // Forty-five page loads in one test.
  test.setTimeout(240_000)
  const problems: string[] = []
  for (const size of SIZES) {
    await page.setViewportSize(size)
    for (const path of PAGES) {
      await page.goto(path)
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      )
      if (overflow > 0)
        problems.push(`${path} at ${size.width}×${size.height} overflows by ${overflow}px`)
    }
  }
  expect(problems).toEqual([])
})

test('the header stays on one line on tablets and desktops', async ({ page }) => {
  test.skip(test.info().project.name !== 'desktop', 'sizes are set explicitly here')
  for (const width of [981, 1024, 1180, 1200, 1280]) {
    await page.setViewportSize({ width, height: 800 })
    await page.goto('/about')
    const bar = await page.getByRole('banner').locator('> div').boundingBox()
    const nav = await page.getByRole('navigation', { name: 'Primary' }).boundingBox()
    expect(bar!.height, `header at ${width}px`).toBeLessThanOrEqual(78)
    expect(nav!.height, `nav at ${width}px`).toBeLessThanOrEqual(44)
  }
})

test('phones: every tap target is at least 44px', async ({ page }) => {
  test.skip(!isMobile(page), 'touch sizes are for phones')
  const problems: string[] = []
  for (const path of ['/', '/temples', '/temples/rameshwaram']) {
    await page.goto(path)
    await page.addStyleTag({ content: '.render-lazily{content-visibility:visible!important}' })
    const small = await page.evaluate(() =>
      [...document.querySelectorAll<HTMLElement>('a[href], button, [role="switch"], select')]
        .filter((el) => {
          const style = getComputedStyle(el)
          if (style.display === 'none' || style.visibility === 'hidden') return false
          if (el.closest('.sr-only, [hidden], [aria-hidden="true"]')) return false
          // Links inside running text are exempt (WCAG 2.5.8 "inline" exception).
          if (el.tagName === 'A' && el.closest('p, li p, dd')) return false
          // Card title links stretch over the whole card with ::after (EditorialCard).
          const after = getComputedStyle(el, '::after')
          if (after.position === 'absolute' && after.content !== 'none') return false
          const box = el.getBoundingClientRect()
          if (box.width === 0 || box.height === 0) return false
          return box.height < 43.5 || box.width < 43.5
        })
        .map((el) => {
          const box = el.getBoundingClientRect()
          const label = (el.getAttribute('aria-label') ?? el.textContent ?? '').trim().slice(0, 30)
          return `${el.tagName.toLowerCase()} "${label}" ${Math.round(box.width)}×${Math.round(box.height)}`
        }),
    )
    problems.push(...small.map((s) => `${path}: ${s}`))
  }
  expect(problems).toEqual([])
})

test('inputs use 16px text or larger, so iOS does not zoom', async ({ page }) => {
  test.skip(!isMobile(page), 'iOS zoom is a phone concern')
  const problems: string[] = []
  for (const path of ['/', '/temples']) {
    await page.goto(path)
    const small = await page.evaluate(() =>
      [...document.querySelectorAll<HTMLElement>('input:not([type="hidden"]), select, textarea')]
        .filter((el) => parseFloat(getComputedStyle(el).fontSize) < 16)
        .map((el) => `${el.tagName.toLowerCase()}#${el.id} ${getComputedStyle(el).fontSize}`),
    )
    problems.push(...small.map((s) => `${path}: ${s}`))
  }
  expect(problems).toEqual([])
})

test('the page stays cream when the device is in dark mode', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark' })
  await page.goto('/')
  const colors = await page.evaluate(() => ({
    background: getComputedStyle(document.body).backgroundColor,
    scheme: getComputedStyle(document.documentElement).colorScheme,
    meta: document.querySelector('meta[name="color-scheme"]')?.getAttribute('content'),
  }))
  expect(colors).toEqual({ background: 'rgb(251, 241, 229)', scheme: 'light', meta: 'only light' })
})

test('pinch-zoom is never disabled', async ({ page }) => {
  await page.goto('/')
  const viewport = await page.locator('meta[name="viewport"]').getAttribute('content')
  expect(viewport).not.toMatch(/maximum-scale|user-scalable/)
})
