import { PrismaPg } from '@prisma/adapter-pg'

import { PrismaClient } from '@/generated/prisma/client'

/*
 * Server-only Prisma client (ARCHITECTURE.md §5). Prisma 7 connects through a driver
 * adapter; at runtime we use the pooled DATABASE_URL. Never import this from a Client
 * Component.
 */

export function createPrismaClient(connectionString = process.env.DATABASE_URL) {
  if (!connectionString) {
    throw new Error('DATABASE_URL is not set. See .env.example and README.md.')
  }
  return new PrismaClient({ adapter: new PrismaPg({ connectionString }) })
}

// Reuse one client across hot reloads in development instead of opening new pools.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient }

export function getDb(): PrismaClient {
  globalForPrisma.prisma ??= createPrismaClient()
  return globalForPrisma.prisma
}
