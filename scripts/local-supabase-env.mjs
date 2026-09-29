/**
 * Prints the local Supabase stack's settings as KEY=value lines, under the variable names
 * the app, the seed and the migration script read (D-043). These are the CLI's standard
 * local-development values, not secrets.
 *
 * CI appends them to $GITHUB_ENV. Locally, run it after `supabase start` and copy the
 * lines into .env.local.
 */
import { execFileSync } from 'node:child_process'
import { resolve } from 'node:path'

const cli = resolve('node_modules/supabase/dist/supabase.js')
const status = JSON.parse(
  execFileSync(process.execPath, [cli, 'status', '-o', 'json'], { encoding: 'utf8' }),
)

const values = {
  SUPABASE_URL: status.API_URL,
  SUPABASE_PUBLISHABLE_KEY: status.PUBLISHABLE_KEY,
  SUPABASE_SECRET_KEY: status.SECRET_KEY,
  POSTGRES_URL_NON_POOLING: status.DB_URL,
}
for (const [name, value] of Object.entries(values)) {
  if (!value) throw new Error(`supabase status did not report a value for ${name}`)
  console.log(`${name}=${value}`)
}
