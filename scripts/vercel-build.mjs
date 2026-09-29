/**
 * Vercel build command (vercel.json, D-042, D-043). Pages prerender from the database, so
 * the database must be migrated, and on preview deploys seeded, before `next build`.
 *
 * - Every deploy: apply pending Supabase migrations (scripts/db-push.mjs).
 * - Preview deploys: upsert the seed files with SEED_TARGET=preview, which publishes
 *   every record, so each preview matches the branch's content.
 * - Production deploys: never seeded here. Publishing to production stays a deliberate
 *   step: `SEED_TARGET=production pnpm db:seed`, which publishes only reviewed
 *   records (D-020), then `pnpm revalidate`.
 */
import { execSync } from 'node:child_process'
import { delimiter, resolve } from 'node:path'

// The project's own binaries (tsx, next), whichever package manager is on the PATH.
const PATH = `${resolve('node_modules/.bin')}${delimiter}${process.env.PATH}`

function run(command, env = {}) {
  console.log(`\n> ${command}`)
  execSync(command, { stdio: 'inherit', env: { ...process.env, PATH, ...env } })
}

run('node scripts/db-push.mjs')
if (process.env.VERCEL_ENV !== 'production') {
  run('tsx scripts/seed.ts', { SEED_TARGET: 'preview' })
}
run('next build')
