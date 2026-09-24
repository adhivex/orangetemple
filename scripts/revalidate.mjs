/*
 * Refreshes cached pages after content changes (D-015). Run after `pnpm db:seed`:
 *   pnpm revalidate
 * Reads NEXT_PUBLIC_SITE_URL and REVALIDATE_SECRET from the environment or .env.local.
 */
for (const file of ['.env.local', '.env']) {
  try {
    process.loadEnvFile(file)
  } catch {
    // absent — fine
  }
}

const site = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
const secret = process.env.REVALIDATE_SECRET
if (!secret) {
  console.error('REVALIDATE_SECRET is not set.')
  process.exit(1)
}

const response = await fetch(new URL('/api/revalidate', site), {
  method: 'POST',
  headers: { authorization: `Bearer ${secret}` },
})
const body = await response.text()
console.log(`${response.status} ${body}`)
if (!response.ok) process.exit(1)
