'use client'

import { useState, useEffect } from 'react'
import { notFound, useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faLinkedin,
  faTwitter,
  faFacebook,
  faInstagram,
  faGithub,
  faXTwitter
} from '@fortawesome/free-brands-svg-icons'
import {
  BuildingOfficeIcon,
  GlobeAltIcon,
  MapPinIcon,
  UserGroupIcon,
  DocumentTextIcon,
  BriefcaseIcon,
  PencilIcon,
  PlusIcon,
  EnvelopeIcon,
  PhoneIcon,
  CalendarIcon,
  ClockIcon,
  LinkIcon
} from '@heroicons/react/24/outline'
import DetailsLayout from '@/components/layout/DetailsLayout'
import { EntityCard } from '@/components/EntityCard'
import { ActivityTimeline } from '@/components/ActivityTimeline'
import { Company } from '@prisma/client'

export default function CompanyPage() {
  const { id } = useParams()
  const router = useRouter()
  const [company, setCompany] = useState<Company | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'applications' | 'contacts' | 'timeline'>('applications')

  // Function to get brand icon for a URL
  const getBrandIcon = (url: string) => {
    const domain = url.toLowerCase()

    if (domain.includes('linkedin.com')) {
      return <FontAwesomeIcon icon={faLinkedin} className="w-4 h-4 text-muted-foreground" />
    }
    if (domain.includes('twitter.com') || domain.includes('x.com')) {
      return <FontAwesomeIcon icon={faXTwitter} className="w-4 h-4 text-muted-foreground" />
    }
    if (domain.includes('facebook.com')) {
      return <FontAwesomeIcon icon={faFacebook} className="w-4 h-4 text-muted-foreground" />
    }
    if (domain.includes('instagram.com')) {
      return <FontAwesomeIcon icon={faInstagram} className="w-4 h-4 text-muted-foreground" />
    }
    if (domain.includes('github.com')) {
      return <FontAwesomeIcon icon={faGithub} className="w-4 h-4 text-muted-foreground" />
    }
    if (domain.includes('glassdoor.com')) {
      return <LinkIcon className="w-4 h-4 text-muted-foreground" />
    }
    if (domain.includes('crunchbase.com')) {
      return <LinkIcon className="w-4 h-4 text-muted-foreground" />
    }
    if (domain.includes('portfolio') || domain.includes('personal') || domain.includes('.dev') || domain.includes('.me')) {
      return <LinkIcon className="w-4 h-4 text-muted-foreground" />
    }

    // Default to LinkIcon for other URLs
    return <LinkIcon className="w-4 h-4 text-muted-foreground" />
  }

  const handleLinksChange = (updatedLinks: any[]) => {
    if (company) {
      setCompany({
        ...company,
        links: updatedLinks
      })
    }
  }

  useEffect(() => {
    async function fetchCompany() {
      try {
        const response = await fetch(`/api/companies/${id}`)
        if (!response.ok) {
          if (response.status === 404) {
            notFound()
          }
          throw new Error('Failed to fetch company')
        }
        const data = await response.json()
        setCompany(data)
      } catch (error) {
        console.error('Failed to fetch company:', error)
        throw new Error('Failed to load company details.')
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchCompany()
    }
  }, [id])

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, string> = {
      applied: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      interview_scheduled: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      interviewed: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
      offer: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      rejected: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
      accepted: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
    }

    const statusLabels: Record<string, string> = {
      applied: 'Applied',
      interview_scheduled: 'Interview Scheduled',
      interviewed: 'Interviewed',
      offer: 'Offer',
      rejected: 'Rejected',
      accepted: 'Accepted'
    }

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig[status] || 'bg-muted text-muted-foreground'}`}>
        {statusLabels[status] || status}
      </span>
    )
  }

  if (loading) {
    return (
      <DetailsLayout
        headerSection={null}
        leftColumn={
          <div className="animate-pulse">
            <div className="w-32 h-32 bg-muted rounded-lg mx-auto mb-4"></div>
            <div className="space-y-2">
              <div className="h-6 bg-muted rounded w-3/4 mx-auto"></div>
              <div className="h-4 bg-muted rounded w-1/2 mx-auto"></div>
              <div className="h-4 bg-muted rounded w-1/3 mx-auto"></div>
            </div>
          </div>
        }
        rightColumn={
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-1/3 mb-4"></div>
            <div className="space-y-4">
              <div className="h-20 bg-muted rounded"></div>
              <div className="h-20 bg-muted rounded"></div>
              <div className="h-20 bg-muted rounded"></div>
            </div>
          </div>
        }
      />
    )
  }

  if (!company) {
    return (
      <DetailsLayout
        headerSection={null}
        leftColumn={
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Company Not Found</h1>
            <Link
              href="/companies"
              className="text-primary hover:text-primary/80"
            >
              Back to Companies
            </Link>
          </div>
        }
        rightColumn={<div></div>}
      />
    )
  }

  const activeApplications = company.jobApplications.filter(app =>
    ['applied', 'interview_scheduled', 'interviewed'].includes(app.status)
  )

  // Header Section Component
  const headerSection = (
    <div className="flex justify-between items-center">
      <Link
        href="/companies"
        className="text-primary hover:text-primary/80 text-sm font-medium flex items-center gap-1"
      >
        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
        Back to Companies
      </Link>
      <div className="flex gap-2">
        <Link
          href={`/companies/${company.id}/edit`}
          className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 flex items-center text-sm font-medium"
        >
          <PencilIcon className="w-4 h-4 mr-2" />
          Edit
        </Link>
        <Link
          href={`/applications/new?companyId=${company.id}`}
          className="bg-secondary text-secondary-foreground px-4 py-2 rounded-lg hover:bg-secondary/80 flex items-center text-sm font-medium"
        >
          <PlusIcon className="w-4 h-4 mr-2" />
          Add Application
        </Link>
      </div>
    </div>
  )

  // Left Column Component
  const leftColumn = (
    <>
      <EntityCard
        id={company.id}
        name={company.name}
        subtitle={company.industry}
        image={(company as any).logo}
        imageAlt={`${company.name} logo`}
        fallbackIcon={<BuildingOfficeIcon className="w-16 h-16 text-muted-foreground" />}
        fallbackText={company.name.charAt(0).toUpperCase()}
        imageType="logo"
        imageSize="large"
        createdAt={company.createdAt}
        updatedAt={company.updatedAt}
        properties={[
          ...(company.website ? [{
            icon: <GlobeAltIcon className="w-5 h-5" />,
            text: company.website,
            href: company.website
          }] : []),
          ...(company.location ? [{
            icon: <MapPinIcon className="w-5 h-5" />,
            text: company.location
          }] : []),
          ...(company.size ? [{
            icon: <UserGroupIcon className="w-5 h-5" />,
            text: company.size
          }] : []),
          ...(company.links || []).map(link => ({
            icon: getBrandIcon(link.url),
            text: link.label || 'Link',
            href: link.url
          }))
        ]}
      >
        {/* Description and Notes Section */}
        {(company.description || company.notes) && (
          <div className="w-full space-y-4">
            {company.description && (
              <div>
                <h3 className="text-sm font-medium text-foreground mb-2 text-center">Description</h3>
                <p className="text-sm text-muted-foreground text-center">{company.description}</p>
              </div>
            )}
            {company.notes && (
              <div>
                <div className="flex items-center justify-center mb-2">
                  <DocumentTextIcon className="w-4 h-4 mr-2 text-muted-foreground" />
                  <h3 className="text-sm font-medium text-foreground">Notes</h3>
                </div>
                <p className="text-sm text-muted-foreground text-center">{company.notes}</p>
              </div>
            )}
          </div>
        )}
      </EntityCard>

      {/* Stats Card */}
      <div className="bg-card shadow rounded-lg mt-6">
        <div className="px-6 py-4 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">Statistics</h2>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Total Applications</span>
            <span className="text-sm font-medium text-foreground">
              {company.jobApplications.length}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Active Applications</span>
            <span className="text-sm font-medium text-primary">
              {activeApplications.length}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Total Contacts</span>
            <span className="text-sm font-medium text-primary">
              {company.contacts.length}
            </span>
          </div>
        </div>
      </div>
    </>
  )

  // Right Column Component  
  const rightColumn = (
    <div className="bg-card shadow rounded-lg">
      <div className="border-b border-border">
        <nav className="flex space-x-8 px-6" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('applications')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'applications'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
              }`}
          >
            <BriefcaseIcon className="w-5 h-5 inline mr-2" />
            Applications ({company.jobApplications.length})
          </button>
          <button
            onClick={() => setActiveTab('contacts')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'contacts'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
              }`}
          >
            <UserGroupIcon className="w-5 h-5 inline mr-2" />
            Contacts ({company.contacts.length})
          </button>
          <button
            onClick={() => setActiveTab('timeline')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'timeline'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
              }`}
          >
            <ClockIcon className="w-5 h-5 inline mr-2" />
            Timeline
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {/* Applications Tab */}
        {activeTab === 'applications' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-foreground">Job Applications</h3>
              <Link
                href={`/applications/new?companyId=${company.id}`}
                className="bg-primary text-primary-foreground px-3 py-2 rounded-lg hover:bg-primary/90 flex items-center text-sm font-medium"
              >
                <PlusIcon className="w-4 h-4 mr-2" />
                Add Application
              </Link>
            </div>
            {company.jobApplications.length === 0 ? (
              <div className="text-center py-8">
                <BriefcaseIcon className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-2 text-sm font-medium text-foreground">No applications yet</h3>
                <p className="mt-1 text-sm text-muted-foreground">Applications will appear here.</p>
                <div className="mt-6">
                  <Link
                    href={`/applications/new?companyId=${company.id}`}
                    className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 flex items-center text-sm font-medium mx-auto"
                  >
                    <PlusIcon className="w-4 h-4 mr-2" />
                    Add Application
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {company.jobApplications.map((application) => (
                  <EntityCard
                    key={application.id}
                    id={application.id}
                    name={application.position}
                    subtitle={application.jobDescription}
                    fallbackIcon={<BriefcaseIcon className="w-6 h-6 text-muted-foreground" />}
                    properties={[
                      {
                        icon: <CalendarIcon className="w-4 h-4" />,
                        text: `Applied ${new Date(application.createdAt).toLocaleDateString()}`
                      }
                    ]}
                    onView={() => router.push(`/applications/${application.id}`)}
                    onEdit={() => router.push(`/applications/${application.id}/edit`)}
                    imageType="logo"
                  >
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center space-x-2">
                        {getStatusBadge(application.status)}
                      </div>
                    </div>
                  </EntityCard>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Contacts Tab */}
        {activeTab === 'contacts' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-foreground">Contacts</h3>
              <Link
                href={`/contacts/new?companyId=${company.id}`}
                className="bg-primary text-primary-foreground px-3 py-2 rounded-lg hover:bg-primary/90 flex items-center text-sm font-medium"
              >
                <PlusIcon className="w-4 h-4 mr-2" />
                Add Contact
              </Link>
            </div>
            {company.contacts.length === 0 ? (
              <div className="text-center py-8">
                <UserGroupIcon className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-2 text-sm font-medium text-foreground">No contacts yet</h3>
                <p className="mt-1 text-sm text-muted-foreground">Contacts will appear here.</p>
                <div className="mt-6">
                  <Link
                    href={`/contacts/new?companyId=${company.id}`}
                    className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 flex items-center text-sm font-medium mx-auto"
                  >
                    <PlusIcon className="w-4 h-4 mr-2" />
                    Add Contact
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {company.contacts.map((contact) => {
                  const contactProperties = []

                  if (contact.position) {
                    contactProperties.push({
                      icon: <BriefcaseIcon className="w-4 h-4" />,
                      text: contact.position
                    })
                  }

                  if (contact.email) {
                    contactProperties.push({
                      icon: <EnvelopeIcon className="w-4 h-4" />,
                      text: contact.email,
                      href: `mailto:${contact.email}`
                    })
                  }

                  if ((contact as any).phone) {
                    contactProperties.push({
                      icon: <PhoneIcon className="w-4 h-4" />,
                      text: (contact as any).phone,
                      href: `tel:${(contact as any).phone}`
                    })
                  }

                  return (
                    <EntityCard
                      key={contact.id}
                      id={contact.id}
                      name={`${contact.firstName} ${contact.lastName}`}
                      image={(contact as any).image}
                      imageAlt={`${contact.firstName} ${contact.lastName}`}
                      fallbackText={contact.firstName.charAt(0) + contact.lastName.charAt(0)}
                      properties={contactProperties}
                      onView={() => router.push(`/contacts/${contact.id}`)}
                      onEdit={() => router.push(`/contacts/${contact.id}/edit`)}
                      imageType="avatar"
                    />
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* Timeline Tab */}
        {activeTab === 'timeline' && (
          <ActivityTimeline
            entityType="company"
            entityId={company.id}
            title="Company Timeline"
            addActivityHref={`/activities/new?companyId=${company.id}`}
            standalone={false}
          />
        )}
      </div>
    </div>
  );

  return (
    <DetailsLayout
      headerSection={headerSection}
      leftColumn={leftColumn}
      rightColumn={rightColumn}
    />
  )
}
