const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')
const fs = require('fs')
const path = require('path')
const https = require('https')
const fileSeedData = require('./fileSeedData')

const prisma = new PrismaClient()

const DEMO_USER_ID = '01HZYX6JQK7ZQK7ZQK7ZQK7ZQK'

const companiesData = [
  {
    id: '01HZYX6JQK7ZQK7ZQK7ZQK7ZQJ',
    name: 'Dunder Mifflin',
    industry: 'Paper Sales',
    description: 'Regional paper and office supply distributor',
    location: 'Scranton, PA',
    size: '50-200',
    logo: '/uploads/logos/dunder-mifflin-logo.svg',
  },
  {
    id: '01HZYX6JQK7ZQK7ZQK7ZQK7ZQH',
    name: 'Initech',
    industry: 'Software Development',
    description: 'Software company specializing in enterprise solutions',
    location: 'Austin, TX',
    size: '200-500',
    logo: '/uploads/logos/initech-logo.png',
  },
  {
    id: '01HZYX6JQK7ZQK7ZQK7ZQK7ZQL',
    name: 'Sabre',
    industry: 'Technology',
    description: 'Parent company of Dunder Mifflin',
    location: 'Tallahassee, FL',
    size: '500-1000',
    logo: '/uploads/logos/sabre-logo.png',
  },
  {
    id: '01HZYX6JQK7ZQK7ZQK7ZQK7ZQM',
    name: 'Initrode',
    industry: 'Software Development',
    description: 'Competitor to Initech',
    location: 'Austin, TX',
    size: '200-500',
  },
]

const contactsData = [
  {
    id: '01HZYX6JQK7ZQK7ZQK7ZQK7ZQI',
    firstName: 'Dwight',
    lastName: 'Schrute',
    email: 'dwight.schrute@dundermifflin.com',
    phone: '+1-555-0123',
    position: 'Assistant to the Regional Manager',
    department: 'Sales',
    summary: '**Key Salesperson** at Dunder Mifflin\n\n- Expert in paper products\n- Competitive and ambitious\n- Interested in *expanding client base*\n\n> "I am ready to sell more paper than anyone else."',
    companyId: companiesData[0].id,
  },
  {
    id: '01HZYX6JQK7ZQK7ZQK7ZQK7ZQF',
    firstName: 'Peter',
    lastName: 'Gibbons',
    email: 'peter.gibbons@initech.com',
    phone: '+1-555-0456',
    position: 'Software Engineer',
    department: 'Engineering',
    summary: '**Disillusioned Engineer**\n\n- Skilled in enterprise software\n- Prefers minimal supervision\n- Interested in *streamlining processes*\n\n> "I just want to do my job and go home."',
    companyId: companiesData[1].id,
  },
  {
    id: '01HZYX6JQK7ZQK7ZQK7ZQK7ZQL',
    firstName: 'Jim',
    lastName: 'Halpert',
    email: 'jim.halpert@dundermifflin.com',
    phone: '+1-555-0789',
    position: 'Sales Representative',
    department: 'Sales',
    summary: '**Friendly Salesperson**\n\n- Skilled in client relations\n- Known for pranks and humor\n- Interested in *building long-term relationships*\n\n> "I love working with people and making deals."',
    companyId: companiesData[0].id,
  },
  {
    id: '01HZYX6JQK7ZQK7ZQK7ZQK7ZQP',
    firstName: 'Milton',
    lastName: 'Waddams',
    email: 'milton.waddams@initech.com',
    phone: '+1-555-0457',
    position: 'Office Worker',
    department: 'Administration',
    summary: '**Quiet Worker**\n\n- Known for his red stapler\n- Prefers a quiet workspace\n- Interested in *job stability*\n\n> "I just want my stapler back."',
    companyId: companiesData[1].id,
  },
  {
    id: '01HZYX6JQK7ZQK7ZQK7ZQK7zqs',
    firstName: 'Stanley',
    lastName: 'Hudson',
    email: 'stanley.hudson@dundermifflin.com',
    phone: '+1-555-0125',
    position: 'Sales Representative',
    department: 'Sales',
    summary: '**Experienced Salesperson**\n\n- Focused on retirement\n- Prefers minimal drama\n- Interested in *steady sales performance*\n\n> "I do my job and go home."',
    companyId: companiesData[0].id,
  },
  {
    id: '01HZYX6JQK7ZQK7ZQK7ZQK7zqt',
    firstName: 'Ryan',
    lastName: 'Howard',
    email: 'ryan.howard@dundermifflin.com',
    phone: '+1-555-0126',
    position: 'Temp',
    department: 'Sales',
    summary: '**Ambitious Temp**\n\n- Interested in climbing the corporate ladder\n- Prefers innovative ideas\n- Interested in *modernizing sales techniques*\n\n> "I have big plans for my career."',
    companyId: companiesData[0].id,
  },
  {
    id: '01HZYX6JQK7ZQK7ZQK7ZQK7zqu',
    firstName: 'Kelly',
    lastName: 'Kapoor',
    email: 'kelly.kapoor@dundermifflin.com',
    phone: '+1-555-0127',
    position: 'Customer Service Representative',
    department: 'Customer Service',
    summary: '**Fashionable and Talkative**\n\n- Skilled in customer relations\n- Loves pop culture\n- Interested in *building client relationships*\n\n> "I know how to make people happy."',
    companyId: companiesData[0].id,
  },
  {
    id: '01HZYX6JQK7ZQK7ZQK7ZQK7zqv',
    firstName: 'Toby',
    lastName: 'Flenderson',
    email: 'toby.flenderson@dundermifflin.com',
    phone: '+1-555-0128',
    position: 'HR Representative',
    department: 'Human Resources',
    summary: '**Calm and Reserved**\n\n- Skilled in conflict resolution\n- Prefers peaceful environments\n- Interested in *maintaining workplace harmony*\n\n> "I just want everyone to get along."',
    companyId: companiesData[0].id,
  },
  {
    id: '01HZYX6JQK7ZQK7ZQK7ZQK7zqw',
    firstName: 'Angela',
    lastName: 'Martin',
    email: 'angela.martin@dundermifflin.com',
    phone: '+1-555-0129',
    position: 'Accountant',
    department: 'Accounting',
    summary: '**Strict and Organized**\n\n- Skilled in financial management\n- Prefers order and structure\n- Interested in *ensuring financial accuracy*\n\n> "I keep the office running smoothly."',
    companyId: companiesData[0].id,
  },
  {
    id: '01HZYX6JQK7ZQK7ZQK7ZQK7zqx',
    firstName: 'Oscar',
    lastName: 'Martinez',
    email: 'oscar.martinez@dundermifflin.com',
    phone: '+1-555-0130',
    position: 'Accountant',
    department: 'Accounting',
    summary: '**Smart and Analytical**\n\n- Skilled in financial analysis\n- Prefers logical solutions\n- Interested in *improving efficiency*\n\n> "I like solving problems."',
    companyId: companiesData[0].id,
  },
  {
    id: '01HZYX6JQK7ZQK7ZQK7ZQK7zqy',
    firstName: 'Creed',
    lastName: 'Bratton',
    email: 'creed.bratton@dundermifflin.com',
    phone: '+1-555-0131',
    position: 'Quality Assurance',
    department: 'Quality Assurance',
    summary: '**Mysterious and Quirky**\n\n- Skilled in improvisation\n- Prefers unconventional methods\n- Interested in *keeping things interesting*\n\n> "I do what needs to be done."',
    companyId: companiesData[0].id,
  },
  {
    id: '01HZYX6JQK7ZQK7ZQK7ZQK7zqz',
    firstName: 'Kevin',
    lastName: 'Malone',
    email: 'kevin.malone@dundermifflin.com',
    phone: '+1-555-0132',
    position: 'Accountant',
    department: 'Accounting',
    summary: '**Funny and Easygoing**\n\n- Skilled in basic accounting\n- Prefers a relaxed atmosphere\n- Interested in *making work fun*\n\n> "I like to keep things simple."',
    companyId: companiesData[0].id,
  },
  {
    id: '01HZYX6JQK7ZQK7ZQK7ZQK7zqa',
    firstName: 'Phyllis',
    lastName: 'Vance',
    email: 'phyllis.vance@dundermifflin.com',
    phone: '+1-555-0133',
    position: 'Sales Representative',
    department: 'Sales',
    summary: '**Kind and Experienced**\n\n- Skilled in client relations\n- Prefers a supportive environment\n- Interested in *helping others succeed*\n\n> "I like to make people feel valued."',
    companyId: companiesData[0].id,
  },
  {
    id: '01HZYX6JQK7ZQK7ZQK7ZQK7zqb',
    firstName: 'Jan',
    lastName: 'Levinson',
    email: 'jan.levinson@sabre.com',
    phone: '+1-555-0134',
    position: 'Executive',
    department: 'Management',
    summary: '**Ambitious and Driven**\n\n- Skilled in corporate strategy\n- Prefers high-level decision making\n- Interested in *expanding market share*\n\n> "I know how to get results."',
    companyId: companiesData[2].id,
  },
  {
    id: '01HZYX6JQK7ZQK7ZQK7ZQK7zqc',
    firstName: 'Bob',
    lastName: 'Vance',
    email: 'bob.vance@vance-refrigeration.com',
    phone: '+1-555-0135',
    position: 'Owner',
    department: 'Management',
    summary: '**Entrepreneurial and Hardworking**\n\n- Skilled in refrigeration systems\n- Prefers hands-on management\n- Interested in *growing his business*\n\n> "I take pride in my work."',
    companyId: companiesData[0].id,
  },
  {
    id: '11HZYX6JQK7ZQK7ZQK7ZQK7zqc',
    firstName: 'Bill',
    lastName: 'Lumberg',
    email: 'bill.lumberg@initech.com',
    position: 'Vice President',
    department: 'Management',
    summary: 'Office manager and notorious for TPS reports.',
    companyId: companiesData[1].id,
  }
]

// Update jobApplicationsData to use tag names instead of IDs
const jobApplicationsData = [
  {
    id: '01HZYX6JQK7ZQK7ZQK7ZQK7ZQK',
    position: 'Software Engineer',
    status: 'applied',
    priority: 'high',
    companyId: '01HZYX6JQK7ZQK7ZQK7ZQK7ZQH',
    tagNames: ['Engineering', 'TPS Report Expert'],
  },
  {
    id: '01HZYX6JQK7ZQK7ZQK7ZQK7ZQL',
    position: 'Product Manager',
    status: 'interview_scheduled',
    priority: 'medium',
    companyId: '01HZYX6JQK7ZQK7ZQK7ZQK7ZQL',
    tagNames: ['Sales'],
  },
]

const tagsData = [
  { name: 'Sales', color: '#3b82f6', description: 'Sales-related activities and contacts' },
  { name: 'Engineering', color: '#10b981', description: 'Engineering roles and contacts' },
  { name: "World's Best Boss", color: '#f59e0b', description: 'For exceptional leadership qualities' },
  { name: 'Printer Expert', color: '#8b5cf6', description: 'Knows everything about printers' },
  { name: 'Bears, Beets, Battlestar Galactica', color: '#ef4444', description: 'For fans of Dwight Schrute' },
  { name: 'Flair Enthusiast', color: '#f59e0b', description: 'For those who love wearing flair' },
  { name: 'Stapler in Jello', color: '#3b82f6', description: 'For pranksters like Jim Halpert' },
  { name: 'TPS Report Expert', color: '#8b5cf6', description: 'Knows everything about TPS reports' },
  { name: 'Assistant to the Regional Manager', color: '#10b981', description: 'For those who aspire to be Dwight Schrute' },
  { name: 'Likes Stapler', color: '#f59e0b', description: 'For those who have a special fondness for staplers' },
]

const tagAssignments = [
  // contact assignments
  { type: 'contact', contactName: 'Dwight', tag: 'Printer Expert' },
  { type: 'contact', contactName: 'Pam', tag: "World's Best Boss" },
  { type: 'contact', contactName: 'Dwight', tag: 'Bears, Beets, Battlestar Galactica' },
  { type: 'contact', contactName: 'Ryan', tag: 'Stapler in Jello' },
  { type: 'contact', contactName: 'Milton', tag: 'TPS Report Expert' },
  { type: 'contact', contactName: 'Dwight', tag: 'Assistant to the Regional Manager' },
  { type: 'contact', contactName: 'Dwight', tag: 'Likes Stapler' },
  { type: 'contact', contactName: 'Milton', tag: 'Likes Stapler' },
  // company assignments
  { type: 'company', companyName: 'Dunder Mifflin', tag: 'Printer Expert' },
  { type: 'company', companyName: 'Initech', tag: 'TPS Report Expert' },
]

async function downloadLogoIfMissing(company) {
  if (!company.logo) return;
  const logoPath = path.join(__dirname, '../public', company.logo)
  if (!fs.existsSync(logoPath)) {
    const url = logoSources[company.name]
    if (!url) return
    await new Promise((resolve, reject) => {
      const file = fs.createWriteStream(logoPath)
      https.get(url, (response) => {
        if (response.statusCode !== 200) {
          file.close()
          fs.unlinkSync(logoPath)
          return reject(new Error(`Failed to download ${url}`))
        }
        response.pipe(file)
        file.on('finish', () => file.close(resolve))
      }).on('error', (err) => {
        fs.unlinkSync(logoPath)
        reject(err)
      })
    })
    console.log(`Downloaded logo for ${company.name}`)
  }
}

async function seedJobApplications(userId, tagsByName) {
  for (const application of jobApplicationsData) {
    await prisma.jobApplication.upsert({
      where: { id: application.id },
      update: {},
      create: {
        id: application.id,
        position: application.position,
        status: application.status,
        priority: application.priority,
        userId,
        companyId: application.companyId,
        tags: {
          connect: (application.tagNames || []).map((name) => ({ id: tagsByName[name].id })),
        },
      },
    })
  }
}

async function main() {
  console.log('Starting database seeding...')
  const hashedPassword = await bcrypt.hash('demo123', 10)
  const user = await prisma.user.upsert({
    where: { id: DEMO_USER_ID },
    update: {},
    create: {
      id: DEMO_USER_ID,
      email: 'michael.scott@dundermifflin.com',
      password: hashedPassword,
      firstName: 'Michael',
      lastName: 'Scott',
    },
  })

  // Companies
  const companies = {}
  for (const c of companiesData) {
    companies[c.name] = await prisma.company.upsert({
      where: { id: c.id },
      update: {},
      create: { ...c, userId: user.id },
    })
  }

  // Contacts
  const contacts = {}
  for (const c of contactsData) {
    contacts[c.firstName] = await prisma.contact.upsert({
      where: { id: c.id },
      update: {},
      create: { ...c, userId: user.id },
    })
  }

  // Job Applications (same as before)
  const jobApplications = []
  const regionalManagerApp = await prisma.jobApplication.findFirst({
    where: { position: 'Regional Manager', userId: user.id, companyId: companies['Dunder Mifflin'].id }
  })
  let regionalManagerAppRecord
  if (!regionalManagerApp) {
    regionalManagerAppRecord = await prisma.jobApplication.create({
      data: {
        position: 'Regional Manager',
        status: 'interview_scheduled',
        priority: 'high',
        jobDescription: 'Leadership role overseeing sales and operations',
        salary: '$80,000 - $100,000',
        source: 'LinkedIn',
        userId: user.id,
        companyId: companies['Dunder Mifflin'].id,
      },
    })
    jobApplications.push(regionalManagerAppRecord)
  } else {
    regionalManagerAppRecord = regionalManagerApp
    jobApplications.push(regionalManagerApp)
  }
  // Add activities for application process
  await prisma.activity.create({
    data: {
      type: 'APPLICATION',
      subject: 'Applied for Regional Manager',
      date: new Date('2025-06-25'),
      userId: user.id,
      companyId: companies['Dunder Mifflin'].id,
      jobApplicationId: regionalManagerAppRecord.id,
    },
  })
  await prisma.activity.create({
    data: {
      type: 'INTERVIEW',
      subject: 'Interview for Regional Manager',
      date: new Date('2025-07-02'),
      userId: user.id,
      companyId: companies['Dunder Mifflin'].id,
      jobApplicationId: regionalManagerAppRecord.id,
    },
  })

  const softwareEngineerApp = await prisma.jobApplication.findFirst({
    where: { position: 'Software Engineer', userId: user.id, companyId: companies['Initech'].id }
  })
  let softwareEngineerAppRecord
  if (!softwareEngineerApp) {
    softwareEngineerAppRecord = await prisma.jobApplication.create({
      data: {
        position: 'Software Engineer',
        status: 'applied',
        priority: 'medium',
        jobDescription: 'Develop and maintain enterprise software solutions',
        salary: '$90,000 - $120,000',
        source: 'Company Website',
        userId: user.id,
        companyId: companies['Initech'].id,
      },
    })
    jobApplications.push(softwareEngineerAppRecord)
  } else {
    softwareEngineerAppRecord = softwareEngineerApp
    jobApplications.push(softwareEngineerApp)
  }
  await prisma.activity.create({
    data: {
      type: 'APPLICATION',
      subject: 'Applied for Software Engineer',
      date: new Date('2025-06-20'),
      userId: user.id,
      companyId: companies['Initech'].id,
      jobApplicationId: softwareEngineerAppRecord.id,
    },
  })

  // Activities (same as before)
  const activities = []
  let activity1 = await prisma.activity.findFirst({ where: { subject: 'Sales Strategy Meeting', userId: user.id } })
  if (!activity1) {
    activity1 = await prisma.activity.create({
      data: {
        type: 'MEETING',
        subject: 'Sales Strategy Meeting',
        description: 'Discussing sales goals and strategies for Q3',
        date: new Date('2025-07-02T14:00:00Z'),
        duration: 90,
        userId: user.id,
        companyId: companies['Dunder Mifflin'].id,
      },
    })
  }
  activities.push(activity1)
  let activity2 = await prisma.activity.findFirst({ where: { subject: 'Code Review Session', userId: user.id } })
  if (!activity2) {
    activity2 = await prisma.activity.create({
      data: {
        type: 'MEETING',
        subject: 'Code Review Session',
        description: 'Reviewing code quality and best practices',
        date: new Date('2025-07-05T10:00:00Z'),
        duration: 60,
        userId: user.id,
        companyId: companies['Initech'].id,
      },
    })
  }
  activities.push(activity2)

  // Tags
  const tags = {}
  for (const t of tagsData) {
    tags[t.name] = await prisma.tag.upsert({
      where: { name: t.name },
      update: {},
      create: { ...t, userId: user.id },
    })
  }

  // Tag assignments
  for (const rel of tagAssignments) {
    try {
      if (rel.type === 'contact') {
        await prisma.contactTag.upsert({
          where: {
            contactId_tagId: {
              contactId: contacts[rel.contactName].id,
              tagId: tags[rel.tag].id,
            },
          },
          update: {},
          create: {
            contactId: contacts[rel.contactName].id,
            tagId: tags[rel.tag].id,
          },
        })
      } else if (rel.type === 'company') {
        await prisma.companyTag.upsert({
          where: {
            companyId_tagId: {
              companyId: companies[rel.companyName].id,
              tagId: tags[rel.tag].id,
            },
          },
          update: {},
          create: {
            companyId: companies[rel.companyName].id,
            tagId: tags[rel.tag].id,
          },
        })
      }
    } catch (error) {
      console.log(`Tag relationship already exists: ${rel.type} ${rel.contactName || rel.companyName} - Tag ${rel.tag}`)
    }
  }

  // File seeding: create File records for every file in fileSeedData
  for (const file of fileSeedData) {
    // Rename the file to use the static ID as filename
    const absPath = path.join(__dirname, '../public', file.relPath)
    const newFileName = `${file.id}${path.extname(file.fileName)}`
    const newAbsPath = path.join(path.dirname(absPath), newFileName)
    if (fs.existsSync(absPath) && absPath !== newAbsPath) {
      fs.renameSync(absPath, newAbsPath)
    }
    await prisma.file.upsert({
      where: { id: file.id },
      update: {},
      create: {
        id: file.id,
        fileName: newFileName,
        mimeType: file.mimeType,
        userId: user.id,
      },
    })
  }

  // Seed job applications (moved after tags and tag assignments)
  await seedJobApplications(user.id, tags)

  // Add a "Don't Jump to Conclusions" activity (note) to the Initech Software Engineer application
  if (typeof softwareEngineerAppRecord !== 'undefined') {
    await prisma.activity.upsert({
      where: { id: 'NOTE_DONT_JUMP_TO_CONCLUSIONS' },
      update: {},
      create: {
        id: 'NOTE_DONT_JUMP_TO_CONCLUSIONS',
        type: 'RESEARCH', // Use enum or string as defined in your schema
        subject: "Don't Jump to Conclusions",
        description: null,
        date: new Date('2025-06-19'), // before application date (2025-06-20)
        userId: user.id,
        jobApplicationId: softwareEngineerAppRecord.id,
        companyId: companies['Initech'].id,
      },
    });
    await prisma.activity.upsert({
      where: { id: 'LUMBERG_INTERVIEW' },
      update: {},
      create: {
        id: 'LUMBERG_INTERVIEW',
        type: 'INTERVIEW', // Use enum or string as defined in your schema
        subject: "Culture Fit",
        description: null,
        date: new Date('2025-06-22'), // before application date (2025-06-20)
        userId: user.id,
        jobApplicationId: softwareEngineerAppRecord.id,
        companyId: companies['Initech'].id,
        contacts: {
          connect: [{ id: '11HZYX6JQK7ZQK7ZQK7ZQK7zqc' }],
        },
      },
    });
  }

  console.log('Database seeding completed.')
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
