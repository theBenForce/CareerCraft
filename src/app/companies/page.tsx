import Link from 'next/link'
import Image from 'next/image'
import { PlusIcon, BuildingOfficeIcon, GlobeAltIcon, MapPinIcon } from '@heroicons/react/24/outline'
import { prisma } from '@/lib/db'

export const revalidate = 60 // Revalidate every 60 seconds

export default async function CompaniesPage() {
  // Fetch companies from the database
  let companies
  try {
    companies = await prisma.company.findMany({
      include: {
        jobApplications: {
          select: {
            id: true,
            status: true
          }
        },
        contacts: {
          select: {
            id: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
  } catch (error) {
    console.error('Failed to fetch companies:', error)
    throw new Error('Failed to load companies. Please try again.')
  }

  const getCompanyStats = (company: any) => {
    const activeApplications = company.jobApplications.filter((app: any) =>
      ['applied', 'interview_scheduled', 'interviewed'].includes(app.status)
    ).length

    return {
      totalApplications: company.jobApplications.length,
      activeApplications,
      totalContacts: company.contacts.length
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                Companies
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage companies you&apos;re interested in or have applied to
              </p>
            </div>
            <Link
              href="/companies/new"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
              Add Company
            </Link>
          </div>

          {/* Navigation */}
          <nav className="mt-4 flex space-x-4">
            <Link href="/" className="text-gray-600 hover:text-gray-900">
              Dashboard
            </Link>
            <Link href="/applications" className="text-gray-600 hover:text-gray-900">
              Applications
            </Link>
            <span className="text-blue-600 font-medium">Companies</span>
            <Link href="/contacts" className="text-gray-600 hover:text-gray-900">
              Contacts
            </Link>
            <Link href="/activities" className="text-gray-600 hover:text-gray-900">
              Activities
            </Link>
            <Link href="/notes" className="text-gray-600 hover:text-gray-900">
              Notes
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {companies.length === 0 ? (
          /* Empty State */
          <div className="text-center py-12">
            <BuildingOfficeIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No companies</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by adding your first company.
            </p>
            <div className="mt-6">
              <Link
                href="/companies/new"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                Add Company
              </Link>
            </div>
          </div>
        ) : (
          /* Companies Grid */
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {companies.map((company) => {
              const stats = getCompanyStats(company)
              return (
                <div
                  key={company.id}
                  className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow duration-200"
                >
                  <div className="p-6">                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1 min-w-0">
                      {/* Logo */}
                      <div className="flex-shrink-0">
                        {(company as any).logo ? (
                          <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                            <Image
                              src={(company as any).logo}
                              alt={`${company.name} logo`}
                              width={48}
                              height={48}
                              className="object-contain"
                            />
                          </div>
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
                            <BuildingOfficeIcon className="w-6 h-6 text-gray-400" />
                          </div>
                        )}
                      </div>

                      {/* Company Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-medium text-gray-900 truncate">
                          {company.name}
                        </h3>
                        {company.industry && (
                          <p className="mt-1 text-sm text-gray-500">
                            {company.industry}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                    {company.location && (
                      <div className="mt-2 flex items-center text-sm text-gray-500">
                        <MapPinIcon className="flex-shrink-0 mr-1.5 h-4 w-4" />
                        {company.location}
                      </div>
                    )}

                    {company.website && (
                      <div className="mt-1 flex items-center text-sm text-gray-500">
                        <GlobeAltIcon className="flex-shrink-0 mr-1.5 h-4 w-4" />
                        <a
                          href={company.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-500 truncate"
                        >
                          {company.website.replace(/^https?:\/\//, '')}
                        </a>
                      </div>
                    )}

                    {company.description && (
                      <p className="mt-3 text-sm text-gray-600 line-clamp-3">
                        {company.description}
                      </p>
                    )}

                    {/* Stats */}
                    <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-lg font-semibold text-gray-900">
                          {stats.totalApplications}
                        </p>
                        <p className="text-xs text-gray-500">Applications</p>
                      </div>
                      <div>
                        <p className="text-lg font-semibold text-green-600">
                          {stats.activeApplications}
                        </p>
                        <p className="text-xs text-gray-500">Active</p>
                      </div>
                      <div>
                        <p className="text-lg font-semibold text-blue-600">
                          {stats.totalContacts}
                        </p>
                        <p className="text-xs text-gray-500">Contacts</p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-4 flex justify-between">
                      <Link
                        href={`/companies/${company.id}`}
                        className="text-sm text-blue-600 hover:text-blue-500 font-medium"
                      >
                        View Details
                      </Link>
                      <Link
                        href={`/companies/${company.id}/edit`}
                        className="text-sm text-gray-600 hover:text-gray-500"
                      >
                        Edit
                      </Link>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
