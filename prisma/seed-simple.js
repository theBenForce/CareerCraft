const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

// Hardcoded ULIDs for demo data
const DEMO_USER_ID = '01HZYX6JQK7ZQK7ZQK7ZQK7ZQK';
const DEMO_COMPANY_ID = '01HZYX6JQK7ZQK7ZQK7ZQK7ZQJ';
const DEMO_CONTACT_ID = '01HZYX6JQK7ZQK7ZQK7ZQK7ZQI';

async function main() {
  console.log('Starting database seeding...')

  // Create a demo user
  const hashedPassword = await bcrypt.hash('demo123', 10)

  const user = await prisma.user.upsert({
    where: { id: DEMO_USER_ID },
    update: {},
    create: {
      id: DEMO_USER_ID,
      email: 'demo@example.com',
      password: hashedPassword,
      firstName: 'Demo',
      lastName: 'User',
    },
  })

  console.log('Created/found demo user:', user.email)

  // Create a demo company
  const company = await prisma.company.upsert({
    where: { id: DEMO_COMPANY_ID },
    update: {},
    create: {
      id: DEMO_COMPANY_ID,
      name: 'TechCorp Inc.',
      industry: 'Technology',
      description: 'Leading software development company',
      location: 'San Francisco, CA',
      size: '1000-5000',
      userId: DEMO_USER_ID,
    },
  })

  console.log('Created/found demo company:', company.name)

  // Create a demo contact
  const contact = await prisma.contact.upsert({
    where: { id: DEMO_CONTACT_ID },
    update: {},
    create: {
      id: DEMO_CONTACT_ID,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@techcorp.com',
      phone: '+1-555-0123',
      position: 'Engineering Manager',
      department: 'Engineering',
      summary: 'Key contact at TechCorp with 8+ years of engineering experience.',
      userId: DEMO_USER_ID,
      companyId: DEMO_COMPANY_ID,
    },
  })

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
