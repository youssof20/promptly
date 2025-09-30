import { PrismaClient } from '@prisma/client'

export const prisma = new PrismaClient()

export * from '@prisma/client'

// Database connection helper
export async function connectDatabase() {
  try {
    await prisma.$connect()
    console.log('✅ Database connected successfully')
  } catch (error) {
    console.error('❌ Database connection failed:', error)
    throw error
  }
}

// Graceful shutdown
export async function disconnectDatabase() {
  await prisma.$disconnect()
  console.log('🔌 Database disconnected')
}
