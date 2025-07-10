import { PrismaClient } from '@prisma/client'
import { firebaseDbClient, FirebaseDbClient } from './firebase-db'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Keep Prisma for backward compatibility during migration
const prismaClient = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prismaClient

// Use Firebase by default, fallback to Prisma if Firebase is not configured
const useFirebase = process.env.USE_FIREBASE === 'true' || process.env.FIREBASE_PROJECT_ID

export const prisma = useFirebase ? firebaseDbClient as any : prismaClient

// Export both clients for explicit usage
export { firebaseDbClient }
export { prismaClient }
