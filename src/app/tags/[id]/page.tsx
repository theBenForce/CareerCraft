'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { toast } from 'react-hot-toast'
import {
  TagIcon,
  UserGroupIcon,
  BuildingOfficeIcon,
  CalendarDaysIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import Header from '@/components/layout/Header'
import ActivityCard from '@/components/ActivityCard'
import { Tag, Contact, Company, Activity } from '@prisma/client'
import { ActivityWithTags } from '@/types'


interface TagData {
  tag: Tag
  contacts: (Contact & { company?: Company | null })[]
  companies: Company[]
  activities: ActivityWithTags[]
}

export default function TagDetailPage() {
  const params = useParams()
  const tagId = params.id as string
  const [tagData, setTagData] = useState<TagData | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchTagData = useCallback(async () => {
    try {
      setLoading(true)

      // Fetch tag details
      const tagResponse = await fetch(`/api/tags/${tagId}`)
      if (!tagResponse.ok) throw new Error('Failed to fetch tag')
      const tag = await tagResponse.json()

      // Fetch contacts with this tag
      const contactsResponse = await fetch(`/api/tags/${tagId}/contacts`)
      const contacts = contactsResponse.ok ? await contactsResponse.json() : []

      // Fetch companies with this tag
      const companiesResponse = await fetch(`/api/tags/${tagId}/companies`)
      const companies = companiesResponse.ok ? await companiesResponse.json() : []

      // Fetch activities with this tag
      const activitiesResponse = await fetch(`/api/tags/${tagId}/activities`)
      const activities = activitiesResponse.ok ? await activitiesResponse.json() : []

      setTagData({
        tag,
        contacts,
        companies,
        activities
      })
    } catch (error) {
      console.error('Error fetching tag data:', error)
      toast.error('Failed to load tag data')
    } finally {
      setLoading(false)
    }
  }, [tagId])

  useEffect(() => {
    if (tagId) {
      fetchTagData()
    }
  }, [tagId, fetchTagData])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="h-32 bg-gray-200 rounded"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!tagData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto p-6">
          <div className="text-center py-12">
            <TagIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Tag not found</h3>
            <p className="mt-1 text-sm text-gray-500">
              The tag you&apos;re looking for doesn&apos;t exist or has been deleted.
            </p>
            <div className="mt-6">
              <Button asChild>
                <Link href="/contacts">
                  <ArrowLeftIcon className="w-4 h-4 mr-2" />
                  Back to Contacts
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const { tag, contacts, companies, activities } = tagData
  const totalItems = contacts.length + companies.length + activities.length

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto p-6">
        {/* Page Header */}
        <div className="mb-6">
          <div className="flex items-center mb-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/contacts">
                <ArrowLeftIcon className="w-4 h-4 mr-2" />
                Back
              </Link>
            </Button>
          </div>

          <div className="flex items-center gap-3 mb-2">
            <Badge
              variant="secondary"
              className="text-lg p-2"
              style={{
                backgroundColor: tag.color ? `${tag.color}20` : undefined,
                borderColor: tag.color || undefined,
                color: tag.color || undefined,
              }}
            >
              <TagIcon className="w-5 h-5 mr-2" />
              {tag.name}
            </Badge>
          </div>

          {tag.description && (
            <p className="text-gray-600 mb-4">{tag.description}</p>
          )}

          <p className="text-sm text-gray-500">
            {totalItems} item{totalItems !== 1 ? 's' : ''} tagged
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Contacts</CardTitle>
              <UserGroupIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{contacts.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Companies</CardTitle>
              <BuildingOfficeIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{companies.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Activities</CardTitle>
              <CalendarDaysIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activities.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Content Sections */}
        <div className="space-y-8">
          {/* Contacts Section */}
          {contacts.length > 0 && (
            <section>
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <UserGroupIcon className="w-5 h-5 mr-2" />
                Contacts ({contacts.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {contacts.map((contact) => (
                  <Card key={contact.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={contact.image || undefined} alt={`${contact.firstName} ${contact.lastName}`} />
                          <AvatarFallback>
                            {contact.firstName.charAt(0)}{contact.lastName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1">
                          <Link
                            href={`/contacts/${contact.id}`}
                            className="text-sm font-medium text-gray-900 hover:text-blue-600"
                          >
                            {contact.firstName} {contact.lastName}
                          </Link>
                          {contact.position && (
                            <p className="text-xs text-gray-500 truncate">{contact.position}</p>
                          )}
                          {contact.company && (
                            <p className="text-xs text-blue-600 truncate">{contact.company.name}</p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          )}

          {/* Companies Section */}
          {companies.length > 0 && (
            <section>
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <BuildingOfficeIcon className="w-5 h-5 mr-2" />
                Companies ({companies.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {companies.map((company) => (
                  <Card key={company.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                          {company.logo ? (
                            <Image src={company.logo} alt={company.name} width={32} height={32} className="object-contain" />
                          ) : (
                            <BuildingOfficeIcon className="w-5 h-5 text-gray-400" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <Link
                            href={`/companies/${company.id}`}
                            className="text-sm font-medium text-gray-900 hover:text-blue-600"
                          >
                            {company.name}
                          </Link>
                          {company.industry && (
                            <p className="text-xs text-gray-500 truncate">{company.industry}</p>
                          )}
                          {company.location && (
                            <p className="text-xs text-gray-500 truncate">{company.location}</p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          )}

          {/* Activities Section */}
          {activities.length > 0 && (
            <section>
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <CalendarDaysIcon className="w-5 h-5 mr-2" />
                Activities ({activities.length})
              </h2>
              <div className="bg-white shadow rounded-lg">
                <ul className="divide-y divide-gray-200">
                  {activities.map((activity) => (
                    <ActivityCard
                      key={activity.id}
                      item={activity}
                    />
                  ))}
                </ul>
              </div>
            </section>
          )}

          {/* Empty State */}
          {totalItems === 0 && (
            <div className="text-center py-12">
              <TagIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No items found</h3>
              <p className="mt-1 text-sm text-gray-500">
                This tag hasn&apos;t been applied to any contacts, companies, or activities yet.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
