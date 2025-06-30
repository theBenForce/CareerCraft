import Link from 'next/link'
import { PlusIcon, BuildingOfficeIcon, GlobeAltIcon, MapPinIcon } from '@heroicons/react/24/outline'
import { Button } from '@/components/ui/button'
import Header from '@/components/layout/Header'
import { EntityCard } from '@/components/EntityCard'
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

              const properties = [
                ...(company.industry ? [{
                  icon: <BuildingOfficeIcon className="h-4 w-4" />,
                  text: company.industry
                }] : []),
                ...(company.location ? [{
                  icon: <MapPinIcon className="h-4 w-4" />,
                  text: company.location
                }] : []),
                ...(company.website ? [{
                  icon: <GlobeAltIcon className="h-4 w-4" />,
                  text: company.website.replace(/^https?:\/\//, ''),
                  href: company.website
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
                  image={(company as any).logo}
                  imageType="logo"
                  fallbackIcon={<BuildingOfficeIcon className="w-6 h-6 text-muted-foreground" />}
                  properties={properties}
                  tags={(company as any).companyTags?.map((ct: any) => ct.tag) || []}
                  viewPath={`/companies/${company.id}`}
                  editPath={`/companies/${company.id}/edit`}
                />
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
