/**
 * Applies pending Supabase migrations (supabase/migrations) to a hosted database (D-043).
 * Run with `pnpm db:deploy`; the Vercel build runs it before every build.
 *
 * The connection string comes from SUPABASE_DB_URL if set, otherwise from
 * POSTGRES_URL_NON_POOLING, which the Supabase integration for Vercel provides.
 * Migrations need a session connection, not the transaction pooler. If the build cannot
 * reach the database (Supabase's direct connection is IPv6-only unless the IPv4 add-on
 * is enabled), set SUPABASE_DB_URL to the "Session pooler" connection string from the
 * Supabase dashboard. The URL is never printed.
 */
import { execFileSync } from 'node:child_process'
import { resolve } from 'node:path'

// Manual runs read .env.local; CI and Vercel set real environment variables, which take
// precedence.
for (const file of ['.env.local', '.env']) {
  try {
    process.loadEnvFile(file)
  } catch {
    // file absent — fine
  }
}

const dbUrl = process.env.SUPABASE_DB_URL || process.env.POSTGRES_URL_NON_POOLING
if (!dbUrl) {
  console.error(
    'SUPABASE_DB_URL or POSTGRES_URL_NON_POOLING must be set to apply migrations. See README.md.',
  )
  process.exit(1)
}

const cli = resolve('node_modules/supabase/dist/supabase.js')
console.log('> supabase db push --db-url <database> --yes')
execFileSync(process.execPath, [cli, 'db', 'push', '--db-url', dbUrl, '--yes'], {
  stdio: 'inherit',
})
