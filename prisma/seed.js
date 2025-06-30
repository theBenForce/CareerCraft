const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  // Create a demo user
  const user = await prisma.user.upsert({
    where: { email: 'demo@example.com' },
    update: {},
    create: {
      email: 'demo@example.com',
      password: 'demo123', // In a real app, this should be hashed
      firstName: 'Demo',
      lastName: 'User',
    },
  })

  // Create demo companies
  const companies = await Promise.all([
    prisma.company.create({
      data: {
        name: 'TechCorp Inc.',
        industry: 'Technology',
        website: 'https://techcorp.com',
        description: 'Leading software development company',
        location: 'San Francisco, CA',
        size: '1000-5000',
        userId: user.id,
      },
    }),
    prisma.company.create({
      data: {
        name: 'StartupXYZ',
        industry: 'SaaS',
        website: 'https://startupxyz.com',
        description: 'Innovative SaaS platform for businesses',
        location: 'Austin, TX',
        size: '50-200',
        userId: user.id,
      },
    }),
    prisma.company.create({
      data: {
        name: 'Digital Agency',
        industry: 'Marketing',
        website: 'https://digitalagency.com',
        description: 'Full-service digital marketing agency',
        location: 'New York, NY',
        size: '200-500',
        userId: user.id,
      },
    }),
  ])

  // Create demo contacts
  await Promise.all([
    prisma.contact.create({
      data: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@techcorp.com',
        phone: '+1-555-0123',
        position: 'Engineering Manager',
        department: 'Engineering',
        linkedinUrl: 'https://linkedin.com/in/johndoe',
        userId: user.id,
        companyId: companies[0].id,
      },
    }),
    prisma.contact.create({
      data: {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@startupxyz.com',
        phone: '+1-555-0456',
        position: 'Product Manager',
        department: 'Product',
        linkedinUrl: 'https://linkedin.com/in/janesmith',
        userId: user.id,
        companyId: companies[1].id,
      },
    }),
  ])

  // Create demo job applications
  await Promise.all([
    prisma.jobApplication.create({
      data: {
        position: 'Senior Developer',
        status: 'interview_scheduled',
        priority: 'high',
        jobDescription: 'Senior full-stack developer position with React and Node.js',
        salary: '$120,000 - $150,000',
        appliedDate: new Date('2024-06-25'),
        interviewDate: new Date('2024-07-02'),
        jobUrl: 'https://techcorp.com/jobs/senior-developer',
        source: 'LinkedIn',
        userId: user.id,
        companyId: companies[0].id,
      },
    }),
    prisma.jobApplication.create({
      data: {
        position: 'Product Manager',
        status: 'applied',
        priority: 'medium',
        jobDescription: 'Product Manager role focusing on SaaS platform development',
        salary: '$100,000 - $130,000',
        appliedDate: new Date('2024-06-20'),
        jobUrl: 'https://startupxyz.com/careers/product-manager',
        source: 'Company Website',
        userId: user.id,
        companyId: companies[1].id,
      },
    }),
    prisma.jobApplication.create({
      data: {
        position: 'Full Stack Engineer',
        status: 'rejected',
        priority: 'low',
        jobDescription: 'Full stack developer for client projects',
        salary: '$90,000 - $110,000',
        appliedDate: new Date('2024-06-15'),
        responseDate: new Date('2024-06-22'),
        jobUrl: 'https://digitalagency.com/jobs/fullstack',
        source: 'Referral',
        userId: user.id,
        companyId: companies[2].id,
      },
    }),
  ])

  // Create demo activities
  await prisma.activity.create({
    data: {
      type: 'interview',
      subject: 'Technical Interview - TechCorp',
      description: 'Technical interview with the engineering team',
      date: new Date('2024-07-02T14:00:00Z'),
      duration: 60,
      userId: user.id,
      companyId: companies[0].id,
    },
  })

  // Create demo notes
  await prisma.note.create({
    data: {
      title: 'Interview Preparation Notes',
      content: 'Key points to remember for upcoming interviews:\n- Review React hooks\n- Prepare system design examples\n- Research company background',
      tags: JSON.stringify(['interview', 'preparation']),
      userId: user.id,
    },
  })

  console.log('Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
