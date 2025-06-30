import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import {
  BuildingOfficeIcon,
  ArrowLeftIcon,
  GlobeAltIcon,
  MapPinIcon,
  UserGroupIcon,
  DocumentTextIcon,
  BriefcaseIcon,
  PencilIcon,
  PlusIcon
} from '@heroicons/react/24/outline'
import { prisma } from '@/lib/db'

interface CompanyPageProps {
  params: {
    id: string
  }
}

export default async function CompanyPage({ params }: CompanyPageProps) {
  const companyId = parseInt(params.id)

  if (isNaN(companyId)) {
    notFound()
  }

  let company
  try {
    company = await prisma.company.findUnique({
      where: { id: companyId },
      include: {
        jobApplications: {
          include: {
            company: {
              select: {
                name: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        },
        contacts: {
          orderBy: {
            createdAt: 'desc'
          }
        },
        activities: {
          orderBy: {
            createdAt: 'desc'
          },
          take: 5
        }
      }
    })
  } catch (error) {
    console.error('Failed to fetch company:', error)
    throw new Error('Failed to load company details.')
  }

  if (!company) {
    notFound()
  }

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, string> = {
      applied: 'bg-blue-100 text-blue-800',
      interview_scheduled: 'bg-yellow-100 text-yellow-800',
      interviewed: 'bg-purple-100 text-purple-800',
      offer: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      accepted: 'bg-green-100 text-green-800'
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
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig[status] || 'bg-gray-100 text-gray-800'}`}>
        {statusLabels[status] || status}
      </span>
    )
  }

  const activeApplications = company.jobApplications.filter(app =>
    ['applied', 'interview_scheduled', 'interviewed'].includes(app.status)
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link
                href="/companies"
                className="mr-4 p-2 text-gray-400 hover:text-gray-600"
              >
                <ArrowLeftIcon className="h-5 w-5" />
              </Link>

              {/* Company Logo and Info */}
              <div className="flex items-center space-x-4">
                {(company as any).logo ? (
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                    <Image
                      src={(company as any).logo}
                      alt={`${company.name} logo`}
                      width={64}
                      height={64}
                      className="object-contain"
                    />
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center">
                    <BuildingOfficeIcon className="w-8 h-8 text-gray-400" />
                  </div>
                )}

                <div>
                  <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                    {company.name}
                  </h1>
                  {company.industry && (
                    <p className="mt-1 text-sm text-gray-500">
                      {company.industry}
                    </p>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Link
                href={`/companies/${company.id}/edit`}
                className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <PencilIcon className="-ml-1 mr-2 h-4 w-4" />
                Edit
              </Link>
              <Link
                href={`/applications/new?companyId=${company.id}`}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
                Add Application
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Company Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Company Information</h2>
              </div>
              <div className="px-6 py-4 space-y-4">
                {company.website && (
                  <div className="flex items-center">
                    <GlobeAltIcon className="flex-shrink-0 mr-3 h-5 w-5 text-gray-400" />
                    <a
                      href={company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-500"
                    >
                      {company.website}
                    </a>
                  </div>
                )}

                {company.location && (
                  <div className="flex items-center">
                    <MapPinIcon className="flex-shrink-0 mr-3 h-5 w-5 text-gray-400" />
                    <span className="text-gray-900">{company.location}</span>
                  </div>
                )}

                {company.size && (
                  <div className="flex items-center">
                    <UserGroupIcon className="flex-shrink-0 mr-3 h-5 w-5 text-gray-400" />
                    <span className="text-gray-900">{company.size}</span>
                  </div>
                )}

                {company.description && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-2">Description</h3>
                    <p className="text-gray-700">{company.description}</p>
                  </div>
                )}

                {company.notes && (
                  <div>
                    <div className="flex items-center mb-2">
                      <DocumentTextIcon className="flex-shrink-0 mr-2 h-4 w-4 text-gray-400" />
                      <h3 className="text-sm font-medium text-gray-900">Notes</h3>
                    </div>
                    <p className="text-gray-700 ml-6">{company.notes}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Job Applications */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-lg font-medium text-gray-900">Job Applications</h2>
                <Link
                  href={`/applications/new?companyId=${company.id}`}
                  className="text-sm text-blue-600 hover:text-blue-500 font-medium"
                >
                  Add Application
                </Link>
              </div>
              <div className="px-6 py-4">
                {company.jobApplications.length === 0 ? (
                  <div className="text-center py-8">
                    <BriefcaseIcon className="mx-auto h-8 w-8 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-500">No applications yet</p>
                    <Link
                      href={`/applications/new?companyId=${company.id}`}
                      className="mt-2 text-sm text-blue-600 hover:text-blue-500"
                    >
                      Create your first application
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {company.jobApplications.map((application) => (
                      <div
                        key={application.id}
                        className="border rounded-lg p-4 hover:shadow-sm transition-shadow"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-medium text-gray-900">
                              {application.position}
                            </h3>
                            <p className="text-sm text-gray-500 mt-1">
                              Applied {new Date(application.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            {getStatusBadge(application.status)}
                            <Link
                              href={`/applications/${application.id}`}
                              className="text-sm text-blue-600 hover:text-blue-500"
                            >
                              View
                            </Link>
                          </div>
                        </div>
                        {application.jobDescription && (
                          <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                            {application.jobDescription}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Contacts */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-lg font-medium text-gray-900">Contacts</h2>
                <Link
                  href={`/contacts/new?companyId=${company.id}`}
                  className="text-sm text-blue-600 hover:text-blue-500 font-medium"
                >
                  Add Contact
                </Link>
              </div>
              <div className="px-6 py-4">
                {company.contacts.length === 0 ? (
                  <div className="text-center py-8">
                    <UserGroupIcon className="mx-auto h-8 w-8 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-500">No contacts yet</p>
                    <Link
                      href={`/contacts/new?companyId=${company.id}`}
                      className="mt-2 text-sm text-blue-600 hover:text-blue-500"
                    >
                      Add your first contact
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {company.contacts.map((contact) => (
                      <div
                        key={contact.id}
                        className="flex items-center justify-between p-3 border rounded-lg hover:shadow-sm transition-shadow"
                      >
                        <div>
                          <h3 className="font-medium text-gray-900">
                            {contact.firstName} {contact.lastName}
                          </h3>
                          {contact.position && (
                            <p className="text-sm text-gray-500">{contact.position}</p>
                          )}
                          {contact.email && (
                            <p className="text-sm text-gray-600">{contact.email}</p>
                          )}
                        </div>
                        <Link
                          href={`/contacts/${contact.id}`}
                          className="text-sm text-blue-600 hover:text-blue-500"
                        >
                          View
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Stats */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Statistics</h2>
              </div>
              <div className="px-6 py-4 space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Total Applications</span>
                  <span className="text-sm font-medium text-gray-900">
                    {company.jobApplications.length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Active Applications</span>
                  <span className="text-sm font-medium text-green-600">
                    {activeApplications.length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Total Contacts</span>
                  <span className="text-sm font-medium text-blue-600">
                    {company.contacts.length}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Quick Actions</h2>
              </div>
              <div className="px-6 py-4 space-y-3">
                <Link
                  href={`/applications/new?companyId=${company.id}`}
                  className="block w-full text-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                  Add Job Application
                </Link>
                <Link
                  href={`/contacts/new?companyId=${company.id}`}
                  className="block w-full text-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Add Contact
                </Link>
                <Link
                  href={`/companies/${company.id}/edit`}
                  className="block w-full text-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Edit Company
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
