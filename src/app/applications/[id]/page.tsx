import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { prisma } from '@/lib/db'
import { ActivityTimeline } from '@/components/ActivityTimeline'
import DetailsLayout from '@/components/layout/DetailsLayout'
import { BriefcaseIcon } from '@heroicons/react/24/outline'
import { JobApplication, Company, Tag } from '@prisma/client'

interface ApplicationDetailsPageProps {
  params: { id: string }
}

export const metadata: Metadata = {
  title: 'Application Details',
}

async function getApplication(id: string) {
  // Get tags via company and activities, not directly on jobApplication
  const application = await prisma.jobApplication.findUnique({
    where: { id },
    include: {
      company: true,
      activities: true,
      links: true,
    },
  })
  return application
}

export default async function ApplicationDetailsPage({ params }: ApplicationDetailsPageProps) {
  const application = await getApplication(params.id)
  if (!application) return notFound()

  // Timeline steps for status (now based on activities, not date fields)
  // Find the latest activity of each type relevant to the application process
  const processTypes = [
    { name: 'Applied', type: 'APPLICATION' },
    { name: 'Interview', type: 'INTERVIEW' },
    { name: 'Offer', type: 'OFFER' },
    { name: 'Accepted', type: 'ACCEPTED' },
    { name: 'Rejected', type: 'REJECTED' },
  ]

  const statusSteps = processTypes
    .map(({ name, type }) => {
      const act = application.activities?.find((a: any) => a.type === type)
      return act ? { name, date: act.date } : null
    })
    .filter(Boolean)

  // Header section
  const headerSection = (
    <div className="mb-6">
      <h1 className="text-2xl font-bold tracking-tight text-gray-900 flex items-center gap-2">
        <BriefcaseIcon className="w-6 h-6 text-primary" />
        {application.position}
      </h1>
      <div className="text-sm text-muted-foreground mt-1">
        at <span className="font-semibold text-foreground">{application.company?.name}</span>
      </div>
      {/* Timeline status */}
      <div className="mt-4">
        <ol className="flex items-center w-full text-sm font-medium text-muted-foreground space-x-4 overflow-x-auto">
          {statusSteps.map((step: any, idx: number) => (
            <li key={step.name} className="flex items-center">
              <span className={`rounded-full w-8 h-8 flex items-center justify-center border-2 ${idx === statusSteps.length - 1 ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-background text-primary'}`}>{idx + 1}</span>
              <span className="ml-2 text-foreground">{step.name}</span>
              {idx < statusSteps.length - 1 && <span className="mx-4 h-1 w-8 bg-border rounded" />}
            </li>
          ))}
        </ol>
      </div>
    </div>
  )

  // Left column: Application details
  const leftColumn = (
    <div className="bg-card shadow rounded-lg p-6">
      <h2 className="text-lg font-semibold text-foreground mb-4">Application Details</h2>
      <dl className="divide-y divide-border text-sm text-muted-foreground">
        <div className="py-2 flex justify-between">
          <dt>Status</dt>
          <dd className="font-semibold text-foreground">{application.status}</dd>
        </div>
        <div className="py-2 flex justify-between">
          <dt>Location</dt>
          <dd>{application.company?.location || '-'}</dd>
        </div>
        <div className="py-2 flex justify-between">
          <dt>Company</dt>
          <dd>{application.company?.name || '-'}</dd>
        </div>
        {/* Tags are not directly on jobApplication, so skip for now */}
      </dl>
    </div>
  )

  // Right column: Activity timeline
  const rightColumn = (
    <section>
      <ActivityTimeline entityType="application" entityId={application.id} title="Activity Timeline" />
    </section>
  )

  return (
    <DetailsLayout
      leftColumn={leftColumn}
      rightColumn={rightColumn}
      headerSection={headerSection}
    />
  )
}
