import Link from 'next/link'
import Image from 'next/image'
import { PlusIcon, BuildingOfficeIcon, GlobeAltIcon, MapPinIcon } from '@heroicons/react/24/outline'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Header from '@/components/layout/Header'
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
      <Header />

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Companies
            </h1>
            <p className="mt-1 text-muted-foreground">
              Manage companies you&apos;re interested in or have applied to
            </p>
          </div>
          <Button asChild>
            <Link href="/companies/new">
              <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
              Add Company
            </Link>
          </Button>
        </div>
        {companies.length === 0 ? (
          /* Empty State */
          <div className="text-center py-12">
            <BuildingOfficeIcon className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-2 text-sm font-medium text-foreground">No companies</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Get started by adding your first company.
            </p>
            <div className="mt-6">
              <Button asChild>
                <Link href="/companies/new">
                  <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                  Add Company
                </Link>
              </Button>
            </div>
          </div>
        ) : (
          /* Companies Grid */
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {companies.map((company) => {
              const stats = getCompanyStats(company)
              return (
                <Card
                  key={company.id}
                  className="overflow-hidden hover:shadow-md transition-shadow duration-200"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3 flex-1 min-w-0">
                        {/* Logo */}
                        <div className="flex-shrink-0">
                          {(company as any).logo ? (
                            <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted flex items-center justify-center">
                              <Image
                                src={(company as any).logo}
                                alt={`${company.name} logo`}
                                width={48}
                                height={48}
                                className="object-contain"
                              />
                            </div>
                          ) : (
                            <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                              <BuildingOfficeIcon className="w-6 h-6 text-muted-foreground" />
                            </div>
                          )}
                        </div>

                        {/* Company Info */}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-medium text-foreground truncate">
                            {company.name}
                          </h3>
                          {company.industry && (
                            <p className="mt-1 text-sm text-muted-foreground">
                              {company.industry}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {company.location && (
                      <div className="mt-2 flex items-center text-sm text-muted-foreground">
                        <MapPinIcon className="flex-shrink-0 mr-1.5 h-4 w-4" />
                        {company.location}
                      </div>
                    )}

                    {company.website && (
                      <div className="mt-1 flex items-center text-sm text-muted-foreground">
                        <GlobeAltIcon className="flex-shrink-0 mr-1.5 h-4 w-4" />
                        <a
                          href={company.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline truncate"
                        >
                          {company.website.replace(/^https?:\/\//, '')}
                        </a>
                      </div>
                    )}

                    {company.description && (
                      <p className="mt-3 text-sm text-muted-foreground line-clamp-3">
                        {company.description}
                      </p>
                    )}

                    {/* Stats */}
                    <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-lg font-semibold text-foreground">
                          {stats.totalApplications}
                        </p>
                        <p className="text-xs text-muted-foreground">Applications</p>
                      </div>
                      <div>
                        <p className="text-lg font-semibold text-green-600">
                          {stats.activeApplications}
                        </p>
                        <p className="text-xs text-muted-foreground">Active</p>
                      </div>
                      <div>
                        <p className="text-lg font-semibold text-primary">
                          {stats.totalContacts}
                        </p>
                        <p className="text-xs text-muted-foreground">Contacts</p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-4 flex justify-between">
                      <Button variant="link" asChild className="p-0">
                        <Link href={`/companies/${company.id}`}>
                          View Details
                        </Link>
                      </Button>
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/companies/${company.id}/edit`}>
                          Edit
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
