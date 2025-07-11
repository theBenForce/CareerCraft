// Test script to verify Prisma client with new Tag models
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function testTagModels() {
  try {
    console.log('Testing Tag models...')

    // Test fetching tags
    const tags = await prisma.tag.findMany({
      include: {
        _count: {
          select: {
            contacts: true,
            company: true,
            activity: true,
          },
        },
      },
    })

    console.log('Tags found:', tags.length)
    console.log('First tag:', tags[0])

    // Test fetching contact with tags
    const contactWithTags = await prisma.contact.findFirst({
      include: {
        tags: true,
      },
    })

    console.log('Contact with tags:', contactWithTags?.firstName, 'has', contactWithTags?.tags.length, 'tags')

    console.log('✅ All tag models working correctly!')
  } catch (error) {
    console.error('❌ Error testing tag models:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testTagModels()
