const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  console.log('Starting database seeding...')

  // Create a demo user
  const hashedPassword = await bcrypt.hash('demo123', 10)

  const user = await prisma.user.upsert({
    where: { email: 'demo@example.com' },
    update: {},
    create: {
      email: 'demo@example.com',
      password: hashedPassword,
      firstName: 'Demo',
      lastName: 'User',
    },
  })

  console.log('Created/found demo user:', user.email)

  // Create a demo company
  const existingCompany = await prisma.company.findFirst({
    where: {
      name: 'TechCorp Inc.',
      userId: user.id
    }
  })

  let company = existingCompany
  if (!existingCompany) {
    company = await prisma.company.create({
      data: {
        name: 'TechCorp Inc.',
        industry: 'Technology',
        description: 'Leading software development company',
        location: 'San Francisco, CA',
        size: '1000-5000',
        userId: user.id,
      },
    })
  }

  console.log('Created/found demo company:', company.name)

  // Create a demo contact
  const existingContact = await prisma.contact.findFirst({
    where: {
      firstName: 'John',
      lastName: 'Doe',
      userId: user.id
    }
  })

  let contact = existingContact
  if (!existingContact) {
    contact = await prisma.contact.create({
      data: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@techcorp.com',
        phone: '+1-555-0123',
        position: 'Engineering Manager',
        department: 'Engineering',
        summary: 'Key contact at TechCorp with 8+ years of engineering experience.',
        userId: user.id,
        companyId: company.id,
      },
    })
  }

  console.log('Created/found demo contact:', contact.firstName, contact.lastName)

  console.log('Seeding completed successfully!')
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
