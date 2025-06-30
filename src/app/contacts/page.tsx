import Link from 'next/link'
import { PlusIcon, UserGroupIcon, EnvelopeIcon, PhoneIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline'
import { Button } from '@/components/ui/button'
import Header from '@/components/layout/Header'
import { EntityCard } from '@/components/EntityCard'
import { prisma } from '@/lib/db'

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

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto p-6">
        {/* Page Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Contacts</h1>
            <p className="text-muted-foreground mt-1">Manage your professional network contacts</p>
          </div>
          <Button asChild>
            <Link href="/contacts/new">
              <PlusIcon className="w-4 h-4 mr-2" />
              Add Contact
            </Link>
          </Button>
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
          /* Contacts Grid */
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {contacts.map((contact: any) => {
              const properties = [
                ...(contact.company ? [{
                  icon: <BuildingOfficeIcon className="h-4 w-4" />,
                  text: contact.company.name
                }] : []),
                ...(contact.email ? [{
                  icon: <EnvelopeIcon className="h-4 w-4" />,
                  text: contact.email,
                  href: `mailto:${contact.email}`
                }] : []),
                ...(contact.phone ? [{
                  icon: <PhoneIcon className="h-4 w-4" />,
                  text: contact.phone,
                  href: `tel:${contact.phone}`
                }] : []),
                ...(contact.department ? [{
                  icon: <BuildingOfficeIcon className="h-4 w-4" />,
                  text: contact.department
                }] : [])
              ].filter(prop => prop.text)

              return (
                <EntityCard
                  key={contact.id}
                  id={contact.id}
                  name={`${contact.firstName} ${contact.lastName}`}
                  subtitle={contact.position || undefined}
                  image={(contact as any).image}
                  imageType="avatar"
                  fallbackText={`${contact.firstName.charAt(0)}${contact.lastName.charAt(0)}`}
                  properties={properties}
                  tags={contact.contactTags?.map((ct: any) => ct.tag) || []}
                  viewPath={`/contacts/${contact.id}`}
                  editPath={`/contacts/${contact.id}/edit`}
                />
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
