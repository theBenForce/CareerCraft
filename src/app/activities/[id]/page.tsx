'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import rehypeSanitize from 'rehype-sanitize'
import { toast } from 'react-hot-toast'
import {
  PencilIcon,
  TrashIcon,
  ClockIcon,
  CalendarDaysIcon,
  BuildingOfficeIcon,
  UserGroupIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline'
import Header from '@/components/layout/Header'
import { TagList } from '@/components/TagComponent'
import ActivityIcon from '@/components/ActivityIcon'

interface Contact {
  id: number
  firstName: string
  lastName: string
  email: string
  position?: string
}

interface Company {
  id: number
  name: string
}

interface JobApplication {
  id: number
  position: string
}

interface Tag {
  id: number
  name: string
  color?: string
  description?: string
  createdAt: Date
  updatedAt: Date
  userId: number
}

interface ActivityTag {
  id: number
  activityId: number
  tagId: number
  tag: Tag
}

interface Activity {
  id: number
  type: string
  title?: string
  subject: string
  description?: string
  date: string
  duration?: number
  note?: string
  outcome?: string
  followUpDate?: string
  company?: Company
  jobApplication?: JobApplication
  contacts?: Contact[]
  activityTags?: ActivityTag[]
  createdAt: string
  updatedAt: string
}

export default function ActivityDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const [activity, setActivity] = useState<Activity | null>(null)
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const response = await fetch(`/api/activities/${id}`)
        if (!response.ok) {
          throw new Error('Failed to fetch activity')
        }
        const data = await response.json()
        setActivity(data)
      } catch (error) {
        console.error('Error fetching activity:', error)
        toast.error('Failed to load activity')
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchActivity()
    }
  }, [id])

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this activity?')) {
      return
    }

    setDeleting(true)
    try {
      const response = await fetch(`/api/activities/${id}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Failed to delete activity')
      }

      toast.success('Activity deleted successfully')
      router.push('/activities')
    } catch (error) {
      console.error('Error deleting activity:', error)
      toast.error('Failed to delete activity')
    } finally {
      setDeleting(false)
    }
  }

  const formatActivityType = (type: string) => {
    const upperType = type.toUpperCase()
    switch (upperType) {
      case 'PHONE_CALL':
        return 'Phone Call'
      case 'NETWORKING_EVENT':
        return 'Networking Event'
      case 'COFFEE_CHAT':
        return 'Coffee Chat'
      case 'FOLLOW_UP':
        return 'Follow Up'
      case 'LINKEDIN_MESSAGE':
        return 'LinkedIn Message'
      default:
        return upperType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="flex justify-between items-center mb-8">
              <div className="h-6 bg-muted rounded w-32"></div>
              <div className="flex gap-2">
                <div className="h-10 bg-muted rounded w-20"></div>
                <div className="h-10 bg-muted rounded w-20"></div>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="col-span-1">
                <div className="bg-card rounded-lg p-6">
                  <div className="flex flex-col items-center mb-6">
                    <div className="w-16 h-16 bg-muted rounded-full mb-4"></div>
                    <div className="h-6 bg-muted rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-muted rounded w-1/2"></div>
                  </div>
                  <div className="space-y-4">
                    <div className="h-4 bg-muted rounded w-full"></div>
                    <div className="h-4 bg-muted rounded w-2/3"></div>
                  </div>
                </div>
              </div>
              <div className="col-span-2">
                <div className="space-y-6">
                  <div className="bg-card rounded-lg p-6">
                    <div className="h-6 bg-muted rounded w-1/4 mb-4"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-muted rounded w-full"></div>
                      <div className="h-4 bg-muted rounded w-3/4"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!activity) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Activity Not Found</h1>
            <Link
              href="/activities"
              className="text-primary hover:text-primary/80"
            >
              Back to Activities
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-background">
        {/* Header Row */}
        <div className="flex justify-between items-center mb-8">
          <Link
            href="/activities"
            className="text-primary hover:text-primary/80 text-sm font-medium flex items-center gap-1"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            Back to Activities
          </Link>
          <div className="flex gap-2">
            <Link
              href={`/activities/${activity.id}/edit`}
              className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 flex items-center text-sm font-medium"
            >
              <PencilIcon className="w-4 h-4 mr-2" />
              Edit
            </Link>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="bg-secondary text-secondary-foreground px-4 py-2 rounded-lg hover:bg-secondary/80 flex items-center text-sm font-medium disabled:opacity-50"
            >
              <TrashIcon className="w-4 h-4 mr-2" />
              {deleting ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Activity Summary Card */}
          <div className="col-span-1">
            <div className="bg-card shadow rounded-lg p-6">
              {/* Activity Type and Icon */}
              <div className="flex flex-col items-center mb-6">
                <ActivityIcon
                  type={activity.type}
                  size="xl"
                  withBackground={true}
                  className="mb-4"
                />
                <h1 className="text-xl font-bold tracking-tight text-foreground text-center mb-2">
                  {activity.title || activity.subject}
                </h1>
                <div className="text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">
                  {formatActivityType(activity.type)}
                </div>
              </div>

              {/* Key Details */}
              <div className="space-y-4">
                {/* Date and Duration */}
                <div className="text-center">
                  <div className="flex items-center justify-center text-muted-foreground text-sm mb-1">
                    <CalendarDaysIcon className="w-4 h-4 mr-2" />
                    {new Date(activity.date).toLocaleDateString()}
                  </div>
                  {activity.duration && (
                    <div className="flex items-center justify-center text-muted-foreground text-sm">
                      <ClockIcon className="w-4 h-4 mr-2" />
                      {activity.duration} minutes
                    </div>
                  )}
                </div>

                {/* Company */}
                {activity.company && (
                  <div className="text-center">
                    <div className="flex items-center justify-center text-muted-foreground text-sm mb-1">
                      <BuildingOfficeIcon className="w-4 h-4 mr-2" />
                      Company
                    </div>
                    <Link
                      href={`/companies/${activity.company.id}`}
                      className="text-primary hover:text-primary/80 font-medium"
                    >
                      {activity.company.name}
                    </Link>
                  </div>
                )}

                {/* Contacts */}
                {activity.contacts && activity.contacts.length > 0 && (
                  <div className="text-center">
                    <div className="flex items-center justify-center text-muted-foreground text-sm mb-2">
                      <UserGroupIcon className="w-4 h-4 mr-2" />
                      Contacts
                    </div>
                    <div className="space-y-1">
                      {activity.contacts.map((contact) => (
                        <div key={contact.id}>
                          <Link
                            href={`/contacts/${contact.id}`}
                            className="text-primary hover:text-primary/80 text-sm"
                          >
                            {contact.firstName} {contact.lastName}
                          </Link>
                          {contact.position && (
                            <div className="text-muted-foreground text-xs">
                              {contact.position}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Follow-up Date */}
                {activity.followUpDate && (
                  <div className="text-center p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                    <div className="flex items-center justify-center text-amber-700 dark:text-amber-300 text-sm mb-1">
                      <CalendarDaysIcon className="w-4 h-4 mr-2" />
                      Follow-up Required
                    </div>
                    <div className="text-amber-800 dark:text-amber-200 font-medium text-sm">
                      {new Date(activity.followUpDate).toLocaleDateString()}
                    </div>
                  </div>
                )}
              </div>

              {/* Timestamps */}
              <div className="mt-6 pt-4 border-t border-border text-xs text-muted-foreground text-center">
                Created {new Date(activity.createdAt).toLocaleDateString()}<br />
                Updated {new Date(activity.updatedAt).toLocaleDateString()}
              </div>
            </div>
          </div>

          {/* Right Column: Main Content */}
          <div className="col-span-2 flex flex-col gap-6">
            {/* Description Section */}
            {activity.description && (
              <div className="bg-card shadow rounded-lg">
                <div className="px-6 py-4 border-b border-border">
                  <h2 className="text-lg font-semibold text-foreground">Description</h2>
                </div>
                <div className="p-6">
                  <p className="text-muted-foreground whitespace-pre-wrap">{activity.description}</p>
                </div>
              </div>
            )}

            {/* Note Section */}
            {activity.note && (
              <div className="bg-card shadow rounded-lg">
                <div className="px-6 py-4 border-b border-border">
                  <h2 className="text-lg font-semibold text-foreground">Note</h2>
                </div>
                <div className="p-6">
                  <div className="prose prose-sm prose-gray dark:prose-invert max-w-none text-foreground">
                    <ReactMarkdown rehypePlugins={[rehypeSanitize]}>{activity.note}</ReactMarkdown>
                  </div>
                </div>
              </div>
            )}

            {/* Outcome Section */}
            {activity.outcome && (
              <div className="bg-card shadow rounded-lg">
                <div className="px-6 py-4 border-b border-border">
                  <h2 className="text-lg font-semibold text-foreground">Outcome</h2>
                </div>
                <div className="p-6">
                  <p className="text-muted-foreground whitespace-pre-wrap">{activity.outcome}</p>
                </div>
              </div>
            )}

            {/* Additional Details */}
            <div className="bg-card shadow rounded-lg">
              <div className="px-6 py-4 border-b border-border">
                <h2 className="text-lg font-semibold text-foreground">Additional Details</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {/* Job Application */}
                  {activity.jobApplication && (
                    <div>
                      <h4 className="text-sm font-medium text-foreground mb-1">Related Job Application</h4>
                      <p className="text-muted-foreground">{activity.jobApplication.position}</p>
                    </div>
                  )}

                  {/* Tags */}
                  {activity.activityTags && activity.activityTags.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-foreground mb-2">Tags</h4>
                      <TagList
                        tags={activity.activityTags.map(at => at.tag)}
                        maxDisplay={10}
                      />
                    </div>
                  )}

                  {/* Show message if no additional details */}
                  {!activity.jobApplication && (!activity.activityTags || activity.activityTags.length === 0) && (
                    <p className="text-muted-foreground text-sm">No additional details available.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
