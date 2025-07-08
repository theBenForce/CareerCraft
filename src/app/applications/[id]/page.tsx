'use client'

import { notFound } from 'next/navigation'
import { prisma } from '@/lib/db'
import { ActivityTimeline } from '@/components/ActivityTimeline'
import DetailsLayout from '@/components/layout/DetailsLayout'
import { BriefcaseIcon, MapPinIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline'
import { JobApplication, Company, Tag } from '@prisma/client'
import { Separator } from '@/components/ui/separator'
import { useState, useEffect } from 'react'
import { EntityCard } from '@/components/EntityCard'

interface ApplicationDetailsPageProps {
  params: { id: string }
}

export default function ApplicationDetailsPage({ params }: ApplicationDetailsPageProps) {
  const [applicationData, setApplicationData] = useState<JobApplication | null>(null)
  const [companyData, setCompanyData] = useState<Company | null>(null)
  const [currentStatus, setCurrentStatus] = useState('')

  const statusOptions = [
    { value: 'saved', label: 'Saved' },
    { value: 'researching', label: 'Researching' },
    { value: 'applied', label: 'Applied' },
    { value: 'interviewing', label: 'Interviewing' },
    { value: 'negotiating', label: 'Negotiating' },
    { value: 'accepted', label: 'Accepted' },
  ]

  useEffect(() => {
    async function fetchApplication() {
      const response = await fetch(`/api/applications/${params.id}`)
      const data = await response.json()
      setApplicationData(data)
      setCurrentStatus(data.status)
      // Fetch company details if companyId exists
      if (data.companyId) {
        const companyRes = await fetch(`/api/companies/${data.companyId}`)
        if (companyRes.ok) {
          const company = await companyRes.json()
          setCompanyData(company)
        }
      }
    }
    fetchApplication()
  }, [params.id])

  const handleStatusClick = async (status: string) => {
    setCurrentStatus(status)
    await fetch(`/api/applications/${applicationData?.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
  }

  if (!applicationData) return <div>Loading...</div>

  const leftColumn = (
    <EntityCard
      id={applicationData?.id}
      name={applicationData?.position || 'Role Title Not Available'}
      subtitle={companyData?.name || 'Company Not Available'}
      image={companyData?.logo || undefined}
      imageAlt={companyData?.name || 'Company Logo'}
      properties={[
        { icon: <MapPinIcon className="w-4 h-4 text-primary" />, text: companyData?.location || '-' },
        { icon: <BuildingOfficeIcon className="w-4 h-4 text-primary" />, text: companyData?.name || '-', href: companyData?.id ? `/companies/${companyData.id}` : undefined },
      ]}
      tags={applicationData && Array.isArray((applicationData as any).tags) ? (applicationData as any).tags.map((tag: { id: string; name: string }) => ({ id: tag.id, name: tag.name })) : []}
      onEdit={() => handleStatusClick(currentStatus)}
    />
  )

  const rightColumn = (
    <section>
      {applicationData && (
        <ActivityTimeline entityType="application" entityId={applicationData.id} title="Activity Timeline" />
      )}
    </section>
  )

  const headerSection = (
    <div className="mb-6">
      <h1 className="text-2xl font-bold tracking-tight text-primary flex items-center gap-2">
        <BriefcaseIcon className="w-6 h-6 text-primary" />
        {applicationData?.position || 'Role Title Not Available'}
      </h1>
      <div className="text-sm text-muted-foreground mt-1">
        at <span className="font-semibold text-foreground">{companyData?.name || 'Company Not Available'}</span>
      </div>
      {/* Status tracker */}
      <div className="mt-4">
        <div
          className="flex flex-wrap items-center gap-4 py-2 px-1"
          role="list"
          aria-label="Application status steps"
        >
          {statusOptions.map((status, idx) => (
            <div key={status.value} className="flex items-center" role="listitem">
              <button
                onClick={() => handleStatusClick(status.value)}
                className={`rounded-full w-8 h-8 flex items-center justify-center border-2 cursor-pointer transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-primary/50 text-xs sm:text-base ${currentStatus === status.value
                  ? 'border-primary bg-primary text-primary-foreground shadow'
                  : 'border-border bg-background text-primary hover:bg-primary/10'
                  }`}
                aria-current={currentStatus === status.value ? 'step' : undefined}
                aria-label={status.label}
              >
                {idx + 1}
              </button>
              <span className="ml-2 text-foreground text-xs sm:text-sm font-medium whitespace-nowrap">{status.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <DetailsLayout
      leftColumn={leftColumn}
      rightColumn={rightColumn}
      headerSection={headerSection}
    />
  )
}
