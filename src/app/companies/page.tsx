import Link from 'next/link'
import { PlusIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline'
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
  companyTags: { tag: Tag }[]
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
      ...company,
      companyTags: company.tags.map((tag: Tag) => ({ tag })),
    }))
  } catch (error) {
    console.error('Failed to fetch companies:', error)
    throw new Error('Failed to load companies. Please try again.')
  }

  return (
    <div className="min-h-screen bg-background">
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
          <CompaniesList companies={companies} />
        )}
      </main>
    </div>
  )
}
