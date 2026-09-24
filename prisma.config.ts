import { defineConfig } from 'prisma/config'

// Load .env.local, then .env, if present. Node 24 has this built in, so no dotenv
// dependency; variables already set in the environment (CI, Vercel) take precedence.
for (const file of ['.env.local', '.env']) {
  try {
    process.loadEnvFile(file)
  } catch {
    // file absent — fine
  }
}

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'tsx prisma/seed.ts',
  },
  // The CLI (migrate, db seed, studio) uses the direct connection; on Neon the pooled
  // DATABASE_URL does not support migrations. The app itself connects through the
  // pg driver adapter with DATABASE_URL (src/lib/db.ts).
  datasource: {
    url: process.env.DIRECT_URL ?? process.env.DATABASE_URL,
  },
})
