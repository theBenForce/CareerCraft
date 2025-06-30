const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
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

  console.log('Created/found demo user')

  // Create demo companies
  const companies = []

  // TechCorp Inc.
  let techCorp = await prisma.company.findFirst({
    where: {
      name: 'TechCorp Inc.',
      userId: user.id
    }
  })

  if (!techCorp) {
    techCorp = await prisma.company.create({
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
    })
  }
  companies.push(techCorp)

  // StartupXYZ
  let startupXyz = await prisma.company.findFirst({
    where: {
      name: 'StartupXYZ',
      userId: user.id
    }
  })

  if (!startupXyz) {
    startupXyz = await prisma.company.create({
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
    })
  }
  companies.push(startupXyz)

  // Digital Agency
  let digitalAgency = await prisma.company.findFirst({
    where: {
      name: 'Digital Agency',
      userId: user.id
    }
  })

  if (!digitalAgency) {
    digitalAgency = await prisma.company.create({
      data: {
        name: 'Digital Agency',
        industry: 'Marketing',
        website: 'https://digitalagency.com',
        description: 'Full-service digital marketing agency',
        location: 'New York, NY',
        size: '200-500',
        userId: user.id,
      },
    })
  }
  companies.push(digitalAgency)

  console.log('Created/found demo companies')

  // Create demo contacts
  const contacts = []

  // John Doe
  let johnDoe = await prisma.contact.findFirst({
    where: {
      email: 'john.doe@techcorp.com',
      userId: user.id
    }
  })

  if (!johnDoe) {
    johnDoe = await prisma.contact.create({
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
    })
  }
  contacts.push(johnDoe)

  // Jane Smith
  let janeSmith = await prisma.contact.findFirst({
    where: {
      email: 'jane.smith@startupxyz.com',
      userId: user.id
    }
  })

  if (!janeSmith) {
    janeSmith = await prisma.contact.create({
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
    })
  }
  contacts.push(janeSmith)

  // Mike Johnson
  let mikeJohnson = await prisma.contact.findFirst({
    where: {
      email: 'mike.johnson@digitalagency.com',
      userId: user.id
    }
  })

  if (!mikeJohnson) {
    mikeJohnson = await prisma.contact.create({
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
    })
  }
  contacts.push(mikeJohnson)

  console.log('Created/found demo contacts')

  // Create demo job applications
  const jobApplications = []

  // Check and create each job application individually
  const seniorDevApp = await prisma.jobApplication.findFirst({
    where: {
      position: 'Senior Developer',
      userId: user.id,
      companyId: companies[0].id
    }
  })

  if (!seniorDevApp) {
    const app = await prisma.jobApplication.create({
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
    })
    jobApplications.push(app)
  } else {
    jobApplications.push(seniorDevApp)
  }

  const productManagerApp = await prisma.jobApplication.findFirst({
    where: {
      position: 'Product Manager',
      userId: user.id,
      companyId: companies[1].id
    }
  })

  if (!productManagerApp) {
    const app = await prisma.jobApplication.create({
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
    })
    jobApplications.push(app)
  } else {
    jobApplications.push(productManagerApp)
  }

  const fullStackApp = await prisma.jobApplication.findFirst({
    where: {
      position: 'Full Stack Engineer',
      userId: user.id,
      companyId: companies[2].id
    }
  })

  if (!fullStackApp) {
    const app = await prisma.jobApplication.create({
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
    })
    jobApplications.push(app)
  } else {
    jobApplications.push(fullStackApp)
  }

  console.log('Created/found demo job applications')

  // Create demo activities with multiple contacts
  const activities = []

  // Activity 1: Product Strategy Webinar
  let activity1 = await prisma.activity.findFirst({
    where: {
      subject: 'Product Strategy Webinar',
      userId: user.id
    }
  })

  if (!activity1) {
    activity1 = await prisma.activity.create({
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
  }
  activities.push(activity1)

  // Activity 2: Technical Interview Panel
  let activity2 = await prisma.activity.findFirst({
    where: {
      subject: 'Technical Interview Panel',
      userId: user.id
    }
  })

  if (!activity2) {
    activity2 = await prisma.activity.create({
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
  }
  activities.push(activity2)

  // Activity 3: Creative Review Meeting
  let activity3 = await prisma.activity.findFirst({
    where: {
      subject: 'Creative Review Meeting',
      userId: user.id
    }
  })

  if (!activity3) {
    activity3 = await prisma.activity.create({
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
  }
  activities.push(activity3)

  // Activity 4: Follow-up Email
  let activity4 = await prisma.activity.findFirst({
    where: {
      subject: 'Follow-up on Partnership Discussion',
      userId: user.id
    }
  })

  if (!activity4) {
    activity4 = await prisma.activity.create({
      data: {
        type: 'email',
        subject: 'Follow-up on Partnership Discussion',
        description: 'Email follow-up after yesterday\'s partnership meeting to clarify next steps',
        date: new Date('2024-07-02T09:30:00Z'),
        duration: 15,
        outcome: 'Sent proposal document and timeline',
        followUpDate: new Date('2024-07-09'),
        userId: user.id,
        companyId: companies[1].id,
      },
    })
  }
  activities.push(activity4)

  console.log('Created/found demo activities')

  // Connect activities to multiple contacts (using upsert to avoid duplicates)
  const activityContactConnections = [
    // Activity 1 (Product Strategy Webinar) with Jane and John
    { activityId: activity1.id, contactId: contacts[1].id }, // Jane Smith
    { activityId: activity1.id, contactId: contacts[0].id }, // John Doe
    // Activity 2 (Technical Interview) with John only
    { activityId: activity2.id, contactId: contacts[0].id }, // John Doe
    // Activity 3 (Creative Review) with Mike and Jane
    { activityId: activity3.id, contactId: contacts[2].id }, // Mike Johnson
    { activityId: activity3.id, contactId: contacts[1].id }, // Jane Smith
    // Activity 4 (Follow-up Email) with Jane only
    { activityId: activity4.id, contactId: contacts[1].id }, // Jane Smith
  ]

  for (const connection of activityContactConnections) {
    try {
      await prisma.activityContact.upsert({
        where: {
          activityId_contactId: {
            activityId: connection.activityId,
            contactId: connection.contactId
          }
        },
        update: {},
        create: connection
      })
    } catch (error) {
      // Connection might already exist, continue
      console.log(`Activity-Contact connection already exists: Activity ${connection.activityId} - Contact ${connection.contactId}`)
    }
  }

  console.log('Created/found activity-contact connections')

  // Create demo notes
  const existingNote = await prisma.note.findFirst({
    where: {
      title: 'Interview Preparation Notes',
      userId: user.id
    }
  })

  if (!existingNote) {
    await prisma.note.create({
      data: {
        title: 'Interview Preparation Notes',
        content: 'Key points to remember for upcoming interviews:\n- Review React hooks\n- Prepare system design examples\n- Research company background',
        tags: JSON.stringify(['interview', 'preparation']),
        userId: user.id,
      },
    })
  }

  console.log('Created/found demo notes')

  // Create demo tags
  const tags = await Promise.all([
    prisma.tag.upsert({
      where: { name: 'Hot Lead' },
      update: {},
      create: {
        name: 'Hot Lead',
        color: '#ef4444', // red
        description: 'High priority contact or company',
        userId: user.id,
      },
    }),
    prisma.tag.upsert({
      where: { name: 'Technical' },
      update: {},
      create: {
        name: 'Technical',
        color: '#3b82f6', // blue
        description: 'Technical roles and contacts',
        userId: user.id,
      },
    }),
    prisma.tag.upsert({
      where: { name: 'Decision Maker' },
      update: {},
      create: {
        name: 'Decision Maker',
        color: '#8b5cf6', // purple
        description: 'Key decision makers',
        userId: user.id,
      },
    }),
    prisma.tag.upsert({
      where: { name: 'Follow Up' },
      update: {},
      create: {
        name: 'Follow Up',
        color: '#f59e0b', // amber
        description: 'Requires follow up',
        userId: user.id,
      },
    }),
    prisma.tag.upsert({
      where: { name: 'Startup' },
      update: {},
      create: {
        name: 'Startup',
        color: '#10b981', // green
        description: 'Startup companies',
        userId: user.id,
      },
    }),
    prisma.tag.upsert({
      where: { name: 'Interview' },
      update: {},
      create: {
        name: 'Interview',
        color: '#ec4899', // pink
        description: 'Interview related activities',
        userId: user.id,
      },
    }),
  ])

  console.log('Created/found demo tags')

  // Create tag relationships (handle duplicates)
  const tagRelationships = [
    // Contact tags
    { type: 'contact', entityId: contacts[0].id, tagId: tags[1].id }, // John Doe - Technical
    { type: 'contact', entityId: contacts[0].id, tagId: tags[2].id }, // John Doe - Decision Maker
    { type: 'contact', entityId: contacts[1].id, tagId: tags[0].id }, // Jane Smith - Hot Lead
    { type: 'contact', entityId: contacts[2].id, tagId: tags[3].id }, // Mike Johnson - Follow Up
    // Company tags
    { type: 'company', entityId: companies[1].id, tagId: tags[4].id }, // StartupXYZ - Startup
    { type: 'company', entityId: companies[1].id, tagId: tags[0].id }, // StartupXYZ - Hot Lead
    { type: 'company', entityId: companies[0].id, tagId: tags[1].id }, // TechCorp - Technical
    // Activity tags
    { type: 'activity', entityId: activity2.id, tagId: tags[5].id }, // Technical Interview - Interview
    { type: 'activity', entityId: activity2.id, tagId: tags[1].id }, // Technical Interview - Technical
    { type: 'activity', entityId: activity1.id, tagId: tags[3].id }, // Product Strategy Webinar - Follow Up
    { type: 'activity', entityId: activity4.id, tagId: tags[3].id }, // Follow-up Email - Follow Up
  ]

  for (const relation of tagRelationships) {
    try {
      if (relation.type === 'contact') {
        await prisma.contactTag.upsert({
          where: {
            contactId_tagId: {
              contactId: relation.entityId,
              tagId: relation.tagId
            }
          },
          update: {},
          create: {
            contactId: relation.entityId,
            tagId: relation.tagId
          }
        })
      } else if (relation.type === 'company') {
        await prisma.companyTag.upsert({
          where: {
            companyId_tagId: {
              companyId: relation.entityId,
              tagId: relation.tagId
            }
          },
          update: {},
          create: {
            companyId: relation.entityId,
            tagId: relation.tagId
          }
        })
      } else if (relation.type === 'activity') {
        await prisma.activityTag.upsert({
          where: {
            activityId_tagId: {
              activityId: relation.entityId,
              tagId: relation.tagId
            }
          },
          update: {},
          create: {
            activityId: relation.entityId,
            tagId: relation.tagId
          }
        })
      }
    } catch (error) {
      console.log(`Tag relationship already exists: ${relation.type} ${relation.entityId} - Tag ${relation.tagId}`)
    }
  }

  console.log('Created/found demo tag relationships')
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
