import { expect, test } from './fixtures'

/** Footer newsletter (D-052): validation, then a stored sign-up without a page reload. */
test('rejects an invalid address, then subscribes', async ({ page }) => {
  test.skip(test.info().project.name !== 'desktop', 'the form is the same at every width')
  await page.goto('/about')
  const email = page.getByRole('textbox', { name: 'Email address' })
  const note = page.locator('#newsletter-note')

  await email.fill('not-an-email')
  await email.press('Enter')
  await expect(note).toHaveText('Enter a valid email address, like name@example.com.')
  await expect(email).toHaveAttribute('aria-invalid', 'true')

  const url = page.url()
  await email.fill(`e2e-${Date.now()}@example.com`)
  await page.getByRole('button', { name: 'Subscribe' }).click()
  // A server action and a database write: allow for a loaded CI machine.
  await expect(note).toHaveText(
    "You're on the list. We'll write when new temples and stories arrive.",
    { timeout: 15_000 },
  )
  await expect(email).toHaveValue('')
  expect(page.url()).toBe(url)
})
