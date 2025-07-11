import Link from 'next/link'
import Image from 'next/image';
import { PlusIcon, BuildingOfficeIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { Button } from '@/components/ui/button'
import Header from '@/components/layout/Header'
import { CompaniesList } from '@/components/CompaniesList'
import { prisma } from '@/lib/db'
import { JobApplication, Contact, Tag, Company } from '@prisma/client'

export const dynamic = 'force-dynamic'
export const revalidate = 60 // Revalidate every 60 seconds

interface CompanyListForUI extends Company {
  jobApplications: JobApplication[]
  contacts: Contact[]
  tags: Tag[]
}

export default async function CompaniesPage() {
  let companies: CompanyListForUI[] = []
  try {
    const dbCompanies = await prisma.company.findMany({
      include: {
        jobApplications: true,
        contacts: true,
        tags: true,
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
    companies = dbCompanies.map(company => ({
      ...company
    }))
  } catch (error) {
    console.error('Failed to fetch companies:', error)
    throw new Error('Failed to load companies. Please try again.')
  }

  // Function to format time ago
  const timeAgo = (date: Date) => {
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return '1 day ago';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) {
      const weeks = Math.floor(diffInDays / 7);
      return weeks === 1 ? '1 week ago' : `${weeks} weeks ago`;
    }
    const months = Math.floor(diffInDays / 30);
    return months === 1 ? '1 month ago' : `${months} months ago`;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Page Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Companies</h1>
          </div>
          <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <Link href="/companies/new">
              New Company
            </Link>
          </Button>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search companies"
              className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>
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
          /* Companies Table */
          <div className="bg-card shadow rounded-lg overflow-hidden border border-border">
            <table className="min-w-full divide-y divide-border">
              <thead className="bg-muted">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Industry
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Last Updated
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Tags
                  </th>
                </tr>
              </thead>
              <tbody className="bg-card divide-y divide-border">
                {companies.map((company: any) => (
                  <tr key={company.id} className="hover:bg-muted/50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          {company.logo ? (
                            <Image
                              className="h-10 w-10 rounded-full"
                              src={company.logo}
                              alt={company.name}
                              width={40}
                              height={40}
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center">
                              <span className="text-sm font-medium text-primary-foreground">
                                {company.name.charAt(0)}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-foreground">
                            <Link href={`/companies/${company.id}`} className="hover:text-primary">
                              {company.name}
                            </Link>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-primary">
                        {company.industry || '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-foreground">
                        {company.location || '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-muted-foreground">
                        {timeAgo(new Date(company.updatedAt))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-wrap gap-1">
                        {company.tags?.length > 0 ? (
                          company.tags.slice(0, 2).map((tag: any) => (
                            <span
                              key={tag.id}
                              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                            >
                              {tag.name}
                            </span>
                          ))
                        ) : (
                          <span className="text-sm text-muted-foreground">-</span>
                        )}
                        {company.tags?.length > 2 && (
                          <span className="text-xs text-muted-foreground">
                            +{company.tags.length - 2} more
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {companies.length > 0 && (
          <div className="flex items-center justify-between border-t border-border bg-card px-4 py-3 sm:px-6 mt-6">
            <div className="flex flex-1 justify-between sm:hidden">
              <a href="#" className="relative inline-flex items-center rounded-md border border-border bg-card px-4 py-2 text-sm font-medium text-foreground hover:bg-muted">
                Previous
              </a>
              <a href="#" className="relative ml-3 inline-flex items-center rounded-md border border-border bg-card px-4 py-2 text-sm font-medium text-foreground hover:bg-muted">
                Next
              </a>
            </div>
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Showing <span className="font-medium text-foreground">1</span> to <span className="font-medium text-foreground">{Math.min(10, companies.length)}</span> of{' '}
                  <span className="font-medium text-foreground">{companies.length}</span> results
                </p>
              </div>
              <div>
                <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                  {Array.from({ length: Math.ceil(companies.length / 10) }, (_, index) => (
                    <a
                      key={index}
                      href={`#page-${index + 1}`}
                      aria-current={index === 0 ? 'page' : undefined}
                      className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${index === 0 ? 'bg-primary text-primary-foreground' : 'text-foreground ring-1 ring-inset ring-border hover:bg-muted focus:z-20 focus:outline-offset-0'}`}
                    >
                      {index + 1}
                    </a>
                  ))}
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
