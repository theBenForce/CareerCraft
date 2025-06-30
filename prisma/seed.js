const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  // Check if database has already been seeded
  const existingUser = await prisma.user.findUnique({
    where: { email: 'demo@example.com' },
  })

  if (existingUser) {
    console.log('Database has already been seeded. Skipping...')
    return
  }

  console.log('Starting database seeding...')

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

  console.log('Created demo user')

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
        logo: '/uploads/logos/techcorp-logo.svg',
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
        logo: '/uploads/logos/startupxyz-logo.svg',
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

  console.log('Created demo companies')

  // Create demo contacts
  const contacts = await Promise.all([
    prisma.contact.create({
      data: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@techcorp.com',
        phone: '+1-555-0123',
        position: 'Engineering Manager',
        department: 'Engineering',
        linkedinUrl: 'https://linkedin.com/in/johndoe',
        image: '/uploads/contacts/john-smith.svg',
        summary: '**Key Contact** at TechCorp\n\n- 8+ years of engineering experience\n- Decision maker for technical hiring\n- Very responsive to emails\n- Interested in *full-stack developers* with React expertise\n\n> "Always looking for talented engineers who can scale our platform"',
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
        image: '/uploads/contacts/sarah-johnson.svg',
        summary: '**Product Strategy Leader**\n\n- Former Google PM with 6 years experience\n- Leading StartupXYZ\'s product roadmap\n- **Hot connection** - referred by mutual friend Sarah\n- Scheduled follow-up for *next quarter*\n\n*Next steps:* Send quarterly product updates',
        userId: user.id,
        companyId: companies[1].id,
      },
    }),
    prisma.contact.create({
      data: {
        firstName: 'Mike',
        lastName: 'Johnson',
        email: 'mike.johnson@digitalagency.com',
        phone: '+1-555-0789',
        position: 'Creative Director',
        department: 'Creative',
        linkedinUrl: 'https://linkedin.com/in/mikejohnson',
        image: '/uploads/contacts/mike-wilson.svg',
        summary: '**Creative Visionary** at Digital Agency\n\n- Award-winning designer (Webby Awards 2023)\n- Looking for **freelance developers** for client projects\n- Prefers weekend communication\n- Interested in:\n  - Modern web technologies\n  - UX/UI collaboration\n  - Long-term partnerships\n\n📅 *Next meeting: July 15th*',
        userId: user.id,
        companyId: companies[2].id,
      },
    }),
  ])

  console.log('Created demo contacts')

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

  console.log('Created demo job applications')

  // Create demo activities with multiple contacts
  const activity1 = await prisma.activity.create({
    data: {
      type: 'meeting',
      subject: 'Product Strategy Webinar',
      description: 'Webinar discussing product strategy and roadmap for Q4',
      date: new Date('2024-07-02T14:00:00Z'),
      duration: 90,
      userId: user.id,
      companyId: companies[1].id,
    },
  })

  const activity2 = await prisma.activity.create({
    data: {
      type: 'interview',
      subject: 'Technical Interview Panel',
      description: 'Technical interview with multiple team members',
      date: new Date('2024-07-05T10:00:00Z'),
      duration: 60,
      userId: user.id,
      companyId: companies[0].id,
    },
  })

  const activity3 = await prisma.activity.create({
    data: {
      type: 'call',
      subject: 'Creative Review Meeting',
      description: 'Review of creative concepts with the team',
      date: new Date('2024-07-08T15:30:00Z'),
      duration: 45,
      userId: user.id,
      companyId: companies[2].id,
    },
  })

  // Connect activities to multiple contacts
  await Promise.all([
    // Activity 1 (Product Strategy Webinar) with Jane and John
    prisma.activityContact.create({
      data: {
        activityId: activity1.id,
        contactId: contacts[1].id, // Jane Smith
      },
    }),
    prisma.activityContact.create({
      data: {
        activityId: activity1.id,
        contactId: contacts[0].id, // John Doe
      },
    }),
    // Activity 2 (Technical Interview) with John only
    prisma.activityContact.create({
      data: {
        activityId: activity2.id,
        contactId: contacts[0].id, // John Doe
      },
    }),
    // Activity 3 (Creative Review) with Mike and Jane
    prisma.activityContact.create({
      data: {
        activityId: activity3.id,
        contactId: contacts[2].id, // Mike Johnson
      },
    }),
    prisma.activityContact.create({
      data: {
        activityId: activity3.id,
        contactId: contacts[1].id, // Jane Smith
      },
    }),
  ])

  console.log('Created demo activities')

  // Create demo notes
  await prisma.note.create({
    data: {
      title: 'Interview Preparation Notes',
      content: 'Key points to remember for upcoming interviews:\n- Review React hooks\n- Prepare system design examples\n- Research company background',
      tags: JSON.stringify(['interview', 'preparation']),
      userId: user.id,
    },
  })

  console.log('Created demo notes')
  console.log('Database seeded successfully!')
}

main()
  .then(() => {
    console.log('Seed process completed successfully')
    process.exit(0)
  })
  .catch((e) => {
    console.error('Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
