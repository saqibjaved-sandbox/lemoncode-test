import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../prisma/generated/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Reuse a single client across dev hot reloads: creating a new pg pool on
// every module evaluation leaks connections until Postgres refuses them.
const prisma = globalForPrisma.prisma ?? createPrismaClient()

function createPrismaClient() {
  const pool = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
  return new PrismaClient({ adapter: pool })
}

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export default prisma
