import Link from 'next/link'
import Image from 'next/image'
import { PlusIcon, UserGroupIcon, EnvelopeIcon, PhoneIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import Header from '@/components/layout/Header'
import { prisma } from '@/lib/db'

export const revalidate = 60 // Revalidate every 60 seconds

export default async function ContactsPage() {
  // Fetch contacts from the database
  let contacts
  try {
    contacts = await prisma.contact.findMany({
      include: {
        company: {
          select: {
            id: true,
            name: true
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
            {contacts.map((contact) => (
              <Card
                key={contact.id}
                className="overflow-hidden hover:shadow-md transition-shadow duration-200"
              >
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    {/* Contact Photo */}
                    <div className="flex-shrink-0">
                      <Avatar className="w-16 h-16">
                        <AvatarImage
                          src={(contact as any).image || undefined}
                          alt={`${contact.firstName} ${contact.lastName}`}
                        />
                        <AvatarFallback>
                          {contact.firstName.charAt(0)}{contact.lastName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                    </div>

                    {/* Contact Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-medium text-foreground truncate">
                        {contact.firstName} {contact.lastName}
                      </h3>
                      {contact.position && (
                        <p className="mt-1 text-sm text-muted-foreground truncate">
                          {contact.position}
                        </p>
                      )}
                      {contact.company && (
                        <p className="mt-1 text-sm text-primary truncate">
                          {contact.company.name}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Contact Details */}
                  <div className="mt-4 space-y-2">
                    {contact.email && (
                      <div className="flex items-center text-sm text-muted-foreground">
                        <EnvelopeIcon className="flex-shrink-0 mr-2 h-4 w-4" />
                        <a
                          href={`mailto:${contact.email}`}
                          className="text-primary hover:underline truncate"
                        >
                          {contact.email}
                        </a>
                      </div>
                    )}

                    {contact.phone && (
                      <div className="flex items-center text-sm text-muted-foreground">
                        <PhoneIcon className="flex-shrink-0 mr-2 h-4 w-4" />
                        <a
                          href={`tel:${contact.phone}`}
                          className="text-primary hover:underline"
                        >
                          {contact.phone}
                        </a>
                      </div>
                    )}

                    {contact.department && (
                      <div className="flex items-center text-sm text-muted-foreground">
                        <BuildingOfficeIcon className="flex-shrink-0 mr-2 h-4 w-4" />
                        <span className="truncate">{contact.department}</span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="mt-4 flex justify-between">
                    <Button variant="link" asChild className="p-0">
                      <Link href={`/contacts/${contact.id}`}>
                        View Details
                      </Link>
                    </Button>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/contacts/${contact.id}/edit`}>
                        Edit
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
