import { expect, isMobile, templeLinks, test } from './fixtures'

test.describe('homepage', () => {
  test('renders the hero and both launch collections', async ({ page }) => {
    const response = await page.goto('/')
    expect(response?.status()).toBe(200)
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(
      'Discover the sacred temples of Bharat',
    )
    expect(
      await templeLinks(page, 'section[aria-labelledby="collection-jyotirlingas-title"]'),
    ).toHaveLength(12)
    expect(
      await templeLinks(page, 'section[aria-labelledby="collection-char-dham-title"]'),
    ).toHaveLength(4)
  })

  test('primary call to action leads to the directory', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('link', { name: 'Explore the temples' }).click()
    await expect(page).toHaveURL(/\/temples$/)
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Temples')
  })
})

test.describe('temple directory', () => {
  test('lists all 15 temples', async ({ page }) => {
    await page.goto('/temples')
    await expect(page.locator('#results-title')).toHaveText('15 temples')
  })

  test('search finds a temple by name', async ({ page }) => {
    await page.goto('/temples')
    await page.getByRole('searchbox', { name: /search temples/i }).fill('Kedarnath')
    await page.getByRole('searchbox', { name: /search temples/i }).press('Enter')
    await expect(page).toHaveURL(/[?&]q=Kedarnath/)
    await expect(page.locator('#results-title')).toHaveText('1 temple')
    await expect(page.getByRole('link', { name: /Kedarnath Temple/ }).first()).toBeVisible()
  })

  test('search tolerates a misspelling', async ({ page }) => {
    await page.goto('/temples?q=Kedarnth')
    await expect(page.getByRole('link', { name: /Kedarnath Temple/ }).first()).toBeVisible()
  })

  test('search matches transliteration variants (D-037, D-041)', async ({ page }) => {
    // "Ramesvaram" only matches Rameshwaram at the 0.5 threshold, not pg_trgm's 0.6 default.
    await page.goto('/temples?q=Ramesvaram')
    await expect(page.getByRole('link', { name: /Rameshwaram/ }).first()).toBeVisible()
  })

  test('a search with no matches shows the empty state', async ({ page }) => {
    await page.goto('/temples?q=qqqzzzxxx')
    await expect(page.locator('#results-title')).toHaveText('No results')
    await expect(page.getByRole('heading', { name: 'No temples match' })).toBeVisible()
  })

  test('filters narrow the list and keep the URL shareable', async ({ page }) => {
    await page.goto('/temples')
    if (isMobile(page)) {
      await page.getByRole('button', { name: /^Filters/ }).click()
      const sheet = page.getByRole('dialog', { name: 'Filter temples' })
      await sheet.getByLabel('Collection').selectOption('char-dham')
      await sheet.getByRole('button', { name: 'Show results' }).click()
    } else {
      const panel = page.getByRole('complementary', { name: 'Filters' })
      await panel.getByLabel('Collection').selectOption('char-dham')
      await panel.getByRole('button', { name: 'Show results' }).click()
    }
    await expect(page).toHaveURL(/[?&]collection=char-dham/)
    await expect(page.locator('#results-title')).toHaveText('4 temples')
  })

  test('filtered results are noindex with a canonical to the directory (D-038)', async ({
    request,
  }) => {
    const response = await request.get('/temples?deity=shiva')
    expect(response.headers()['x-robots-tag']).toBe('noindex, follow')
    expect(response.headers()['link']).toMatch(/\/temples>; rel="canonical"/)
    const plain = await request.get('/temples')
    expect(plain.headers()['x-robots-tag']).toBeUndefined()
  })
})

test.describe('temple page', () => {
  test('renders one temple from the shared template', async ({ page }) => {
    const response = await page.goto('/temples/rameshwaram')
    expect(response?.status()).toBe(200)
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Rameshwaram')
    await expect(page.getByRole('navigation', { name: 'Breadcrumb' })).toBeVisible()
    // Rameshwaram is one record in both collections.
    const main = page.locator('main')
    await expect(main.locator('a[href="/jyotirlingas"]').first()).toBeAttached()
    await expect(main.locator('a[href="/char-dham"]').first()).toBeAttached()
    await expect(page.locator('script[type="application/ld+json"]').first()).toBeAttached()
  })

  test('an unknown temple is a 404', async ({ page }) => {
    const response = await page.goto('/temples/not-a-real-temple')
    expect(response?.status()).toBe(404)
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('This path leads nowhere')
  })
})

test.describe('collections', () => {
  for (const [path, count] of [
    ['/jyotirlingas', 12],
    ['/char-dham', 4],
  ] as const) {
    test(`${path} lists its ${count} temples in order`, async ({ page }) => {
      const response = await page.goto(path)
      expect(response?.status()).toBe(200)
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
      expect(await templeLinks(page, 'section[aria-labelledby="temples-title"] ol')).toHaveLength(
        count,
      )
    })
  }

  test('/collections/{slug} redirects to the collection page (D-039)', async ({ request }) => {
    const response = await request.get('/collections/char-dham', { maxRedirects: 0 })
    expect(response.status()).toBe(308)
    expect(response.headers()['location']).toBe('/char-dham')
  })
})

test('Explore Bharat links each state to the filtered directory', async ({ page }) => {
  const response = await page.goto('/explore-bharat')
  expect(response?.status()).toBe(200)
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  const stateLink = page.locator('main a[href^="/temples?state="]').first()
  const href = await stateLink.getAttribute('href')
  await stateLink.click()
  await expect(page).toHaveURL(new RegExp(`${href?.replace('?', '\\?')}$`))
  await expect(page.locator('#results-title')).not.toHaveText('No results')
})

test('an unknown path shows the branded 404 with ways back', async ({ page }) => {
  const response = await page.goto('/this-page-does-not-exist')
  expect(response?.status()).toBe(404)
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('This path leads nowhere')
  await page.getByRole('link', { name: 'Browse all temples' }).click()
  await expect(page).toHaveURL(/\/temples$/)
})
