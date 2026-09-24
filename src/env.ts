import { z } from 'zod'

/**
 * Environment validation (ARCHITECTURE.md §2). Parsed once at module load, so a
 * misconfigured deployment fails at startup rather than rendering wrong URLs.
 *
 * Only variables the app currently reads are validated. The full list lives in
 * .env.example; server-only variables (DATABASE_URL, DIRECT_URL, REVALIDATE_SECRET,
 * Cloudinary, Mapbox) are added here in the phase that first uses them.
 *
 * NEXT_PUBLIC_* values must be referenced literally so Next.js can inline them.
 */
const isProductionDeploy = process.env.VERCEL_ENV === 'production'

const schema = z.object({
  NEXT_PUBLIC_SITE_URL: isProductionDeploy ? z.url() : z.url().default('http://localhost:3000'),
  NEXT_PUBLIC_CONTACT_EMAIL: z.preprocess((v) => (v === '' ? undefined : v), z.email().optional()),
  /** Public, URL-restricted Mapbox token for static maps (D-013). Optional: open item 6. */
  NEXT_PUBLIC_MAPBOX_TOKEN: z.preprocess(
    (v) => (v === '' ? undefined : v),
    z.string().min(1).optional(),
  ),
})

const parsed = schema.safeParse({
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  NEXT_PUBLIC_CONTACT_EMAIL: process.env.NEXT_PUBLIC_CONTACT_EMAIL,
  NEXT_PUBLIC_MAPBOX_TOKEN: process.env.NEXT_PUBLIC_MAPBOX_TOKEN,
})

if (!parsed.success) {
  throw new Error(`Invalid environment variables:\n${z.prettifyError(parsed.error)}`)
}

export const env = parsed.data
