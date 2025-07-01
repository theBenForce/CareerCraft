import Link from 'next/link'
import Image from 'next/image'
import { PlusIcon, UserGroupIcon, MagnifyingGlassIcon, ChevronDownIcon } from '@heroicons/react/24/outline'
import { Button } from '@/components/ui/button'
import Header from '@/components/layout/Header'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'
export const revalidate = 60 // Revalidate every 60 seconds

export default async function ContactsPage() {
  // Fetch contacts from the database
  let contacts
  try {
    contacts = await (prisma as any).contact.findMany({
      include: {
        company: {
          select: {
            id: true,
            name: true
          }
        },
        contactTags: {
          include: {
            tag: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
  } catch (error) {
    console.error('Failed to fetch contacts:', error)
    throw new Error('Failed to load contacts. Please try again.')
  }

  // Function to format time ago
  const timeAgo = (date: Date) => {
    const now = new Date()
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))

    if (diffInDays === 0) return 'Today'
    if (diffInDays === 1) return '1 day ago'
    if (diffInDays < 7) return `${diffInDays} days ago`
    if (diffInDays < 30) {
      const weeks = Math.floor(diffInDays / 7)
      return weeks === 1 ? '1 week ago' : `${weeks} weeks ago`
    }
    const months = Math.floor(diffInDays / 30)
    return months === 1 ? '1 month ago' : `${months} months ago`
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Page Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Contacts</h1>
          </div>
          <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <Link href="/contacts/new">
              New Contact
            </Link>
          </Button>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search contacts"
              className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-3 mb-6">
          <button className="inline-flex items-center px-3 py-2 text-sm font-medium text-foreground bg-card border border-border rounded-md hover:bg-accent">
            All Contacts
            <ChevronDownIcon className="ml-2 h-4 w-4" />
          </button>
          <button className="inline-flex items-center px-3 py-2 text-sm font-medium text-foreground bg-card border border-border rounded-md hover:bg-accent">
            Recently Added
            <ChevronDownIcon className="ml-2 h-4 w-4" />
          </button>
          <button className="inline-flex items-center px-3 py-2 text-sm font-medium text-foreground bg-card border border-border rounded-md hover:bg-accent">
            Favorites
            <ChevronDownIcon className="ml-2 h-4 w-4" />
          </button>
        </div>

        {contacts.length === 0 ? (
          /* Empty State */
          <div className="text-center py-12">
            <UserGroupIcon className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-2 text-sm font-medium text-foreground">No contacts</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Get started by adding your first contact.
            </p>
            <div className="mt-6">
              <Button asChild>
                <Link href="/contacts/new">
                  <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                  Add Contact
                </Link>
              </Button>
            </div>
          </div>
        ) : (
          /* Contacts Table */
          <div className="bg-card shadow rounded-lg overflow-hidden border border-border">
            <table className="min-w-full divide-y divide-border">
              <thead className="bg-muted">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Company
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Last Contacted
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Tags
                  </th>
                </tr>
              </thead>
              <tbody className="bg-card divide-y divide-border">
                {contacts.map((contact: any) => (
                  <tr key={contact.id} className="hover:bg-muted/50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          {contact.image ? (
                            <Image
                              className="h-10 w-10 rounded-full"
                              src={contact.image}
                              alt={`${contact.firstName} ${contact.lastName}`}
                              width={40}
                              height={40}
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center">
                              <span className="text-sm font-medium text-primary-foreground">
                                {contact.firstName.charAt(0)}{contact.lastName.charAt(0)}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-foreground">
                            <Link href={`/contacts/${contact.id}`} className="hover:text-primary">
                              {contact.firstName} {contact.lastName}
                            </Link>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-primary">
                        {contact.company?.name || '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-foreground">
                        {contact.position || '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-muted-foreground">
                        {timeAgo(new Date(contact.updatedAt))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-wrap gap-1">
                        {contact.contactTags?.length > 0 ? (
                          contact.contactTags.slice(0, 2).map((ct: any) => (
                            <span
                              key={ct.tag.id}
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${ct.tag.name.toLowerCase() === 'active' ? 'bg-green-100 text-green-800' :
                                  ct.tag.name.toLowerCase() === 'applied' ? 'bg-blue-100 text-blue-800' :
                                    ct.tag.name.toLowerCase() === 'interviewing' ? 'bg-yellow-100 text-yellow-800' :
                                      ct.tag.name.toLowerCase() === 'offer extended' ? 'bg-purple-100 text-purple-800' :
                                        ct.tag.name.toLowerCase() === 'hired' ? 'bg-green-100 text-green-800' :
                                          'bg-gray-100 text-gray-800'
                                }`}
                            >
                              {ct.tag.name}
                            </span>
                          ))
                        ) : (
                          <span className="text-sm text-muted-foreground">-</span>
                        )}
                        {contact.contactTags?.length > 2 && (
                          <span className="text-xs text-muted-foreground">
                            +{contact.contactTags.length - 2} more
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
        {contacts.length > 0 && (
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
                  Showing <span className="font-medium text-foreground">1</span> to <span className="font-medium text-foreground">{Math.min(10, contacts.length)}</span> of{' '}
                  <span className="font-medium text-foreground">{contacts.length}</span> results
                </p>
              </div>
              <div>
                <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                  <a href="#" className="relative inline-flex items-center rounded-l-md px-2 py-2 text-muted-foreground ring-1 ring-inset ring-border hover:bg-muted focus:z-20 focus:outline-offset-0">
                    <span className="sr-only">Previous</span>
                    <ChevronDownIcon className="h-5 w-5 rotate-90" aria-hidden="true" />
                  </a>
                  <a href="#" aria-current="page" className="relative z-10 inline-flex items-center bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
                    1
                  </a>
                  <a href="#" className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-foreground ring-1 ring-inset ring-border hover:bg-muted focus:z-20 focus:outline-offset-0">
                    2
                  </a>
                  <a href="#" className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-foreground ring-1 ring-inset ring-border hover:bg-muted focus:z-20 focus:outline-offset-0">
                    3
                  </a>
                  <a href="#" className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-foreground ring-1 ring-inset ring-border hover:bg-muted focus:z-20 focus:outline-offset-0">
                    4
                  </a>
                  <a href="#" className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-foreground ring-1 ring-inset ring-border hover:bg-muted focus:z-20 focus:outline-offset-0">
                    5
                  </a>
                  <a href="#" className="relative inline-flex items-center rounded-r-md px-2 py-2 text-muted-foreground ring-1 ring-inset ring-border hover:bg-muted focus:z-20 focus:outline-offset-0">
                    <span className="sr-only">Next</span>
                    <ChevronDownIcon className="h-5 w-5 -rotate-90" aria-hidden="true" />
                  </a>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
