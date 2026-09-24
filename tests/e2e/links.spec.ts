import { expect, test } from './fixtures'

/**
 * Broken-link check: every page in the sitemap, and every internal link and in-page
 * anchor on those pages, must resolve. External links are left to manual review, since
 * CI should not depend on third-party sites.
 */
test('every sitemap page and internal link resolves', async ({ page, request, baseURL }) => {
  test.skip(test.info().project.name !== 'desktop', 'links are the same at every width')
  test.setTimeout(180_000)

  const sitemap = await (await request.get('/sitemap.xml')).text()
  const pages = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
    (match) => new URL(match[1]!).pathname,
  )
  expect(pages.length).toBeGreaterThanOrEqual(15 + 5)

  const origin = new URL(baseURL!).origin
  const links = new Set<string>()
  const problems: string[] = []

  for (const path of pages) {
    const response = await page.goto(path)
    if (response?.status() !== 200) problems.push(`${path} returned ${response?.status()}`)
    const found = await page.locator('a[href]').evaluateAll((anchors) =>
      anchors.map((a) => ({
        href: (a as HTMLAnchorElement).href,
        hash: (a as HTMLAnchorElement).hash,
        samePage:
          (a as HTMLAnchorElement).pathname === location.pathname &&
          (a as HTMLAnchorElement).search === location.search,
      })),
    )
    for (const link of found) {
      const url = new URL(link.href)
      if (url.origin !== origin) continue
      if (link.samePage && link.hash) {
        const id = decodeURIComponent(link.hash.slice(1))
        if ((await page.locator(`[id="${id}"]`).count()) === 0) {
          problems.push(`${path}: anchor ${link.hash} has no target`)
        }
      }
      url.hash = ''
      links.add(url.pathname + url.search)
    }
  }

  for (const link of links) {
    const response = await request.get(link)
    if (response.status() >= 400) problems.push(`${link} returned ${response.status()}`)
  }
  expect(problems).toEqual([])
})
