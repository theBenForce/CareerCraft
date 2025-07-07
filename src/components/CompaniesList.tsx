'use client'

import { useRouter } from 'next/navigation'
import { BuildingOfficeIcon, GlobeAltIcon, MapPinIcon } from '@heroicons/react/24/outline'
import { EntityCard } from '@/components/EntityCard'
import { JobApplication, Contact, Tag } from '@prisma/client'

interface CompaniesListProps {
  companies: Array<{
    id: string
    name: string
    logo?: string | null
    description?: string | null
    industry?: string | null
    website?: string | null
    location?: string | null
    jobApplications: JobApplication[]
    contacts: Contact[]
    tags: Tag[]
  }>
}

export function CompaniesList({ companies }: CompaniesListProps) {
  const router = useRouter()

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {companies.map((company) => {
        // Calculate stats
        const stats = {
          totalApplications: company.jobApplications.length,
          activeApplications: company.jobApplications.filter(app =>
            ['applied', 'interview_scheduled', 'interviewed'].includes(app.status)
          ).length,
          totalContacts: company.contacts.length
        }

        // Build properties array
        const properties = [
          ...(company.industry ? [{
            icon: <BuildingOfficeIcon className="h-4 w-4" />,
            text: company.industry
          }] : []),
          ...(company.website ? [{
            icon: <GlobeAltIcon className="h-4 w-4" />,
            text: company.website,
            href: company.website.startsWith('http') ? company.website : `https://${company.website}`
          }] : []),
          ...(company.location ? [{
            icon: <MapPinIcon className="h-4 w-4" />,
            text: company.location
          }] : []),
          {
            text: `${stats.totalApplications} applications • ${stats.activeApplications} active • ${stats.totalContacts} contacts`
          }
        ].filter(prop => prop.text)

        return (
          <EntityCard
            key={company.id}
            id={company.id}
            name={company.name}
            subtitle={company.description || undefined}
            image={company.logo || undefined}
            imageType="logo"
            fallbackIcon={<BuildingOfficeIcon className="w-6 h-6 text-muted-foreground" />}
            properties={properties}
            tags={company.tags || []}
            onView={() => router.push(`/companies/${company.id}`)}
            onEdit={() => router.push(`/companies/${company.id}/edit`)}
          />
        )
      })}
    </div>
  )
}
