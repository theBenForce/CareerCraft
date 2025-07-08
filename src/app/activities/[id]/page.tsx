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
  ArrowLeftIcon,
  BriefcaseIcon
} from '@heroicons/react/24/outline'
import Header from '@/components/layout/Header'
import { EntityCard } from '@/components/EntityCard'
import DetailsLayout from '@/components/layout/DetailsLayout'
import { Contact, Company, JobApplication, Tag, Activity } from '@prisma/client'

interface ActivityWithRelations extends Activity {
  company?: Company | null
  jobApplication?: JobApplication | null
  contacts?: Contact[] | null
  tags?: Tag[] | null
}

export default function ActivityDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const [activity, setActivity] = useState<ActivityWithRelations | null>(null)
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

  // Header section for DetailsLayout
  const headerSection = (
    <div className="flex justify-between items-center">
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
  )

  // Left column: EntityCard
  const leftColumn = (
    <EntityCard
      id={activity.id}
      name={activity.title || activity.subject || formatActivityType(activity.type)}
      subtitle={activity.company ? activity.company.name : undefined}
      fallbackIcon={<CalendarDaysIcon className="w-16 h-16 text-primary bg-primary/10 p-4 rounded-full" />}
      properties={[
        {
          icon: <CalendarDaysIcon className="w-4 h-4" />,
          text: new Date(activity.date).toLocaleDateString()
        },
        ...(activity.duration ? [{
          icon: <ClockIcon className="w-4 h-4" />,
          text: `${activity.duration} minutes`
        }] : []),
        ...(activity.company ? [{
          icon: <BuildingOfficeIcon className="w-4 h-4" />,
          text: activity.company.name,
          href: `/companies/${activity.company.id}`
        }] : []),
        ...(activity.contacts && activity.contacts.length > 0 ? [{
          icon: <UserGroupIcon className="w-4 h-4" />,
          text: activity.contacts.map(c => `${c.firstName} ${c.lastName}`).join(', '),
          href: activity.contacts.length === 1 ? `/contacts/${activity.contacts[0].id}` : undefined
        }] : []),
        ...(activity.followUpDate ? [{
          icon: <CalendarDaysIcon className="w-4 h-4 text-amber-700 dark:text-amber-300" />,
          text: `Follow-up: ${new Date(activity.followUpDate).toLocaleDateString()}`
        }] : []),
        ...(activity.jobApplication ? [{
          icon: <BriefcaseIcon className="w-4 h-4" />,
          text: activity.jobApplication.position,
          href: `/applications/${activity.jobApplication.id}`
        }] : [])
      ]}
      tags={activity.tags || []}
      createdAt={activity.createdAt}
      updatedAt={activity.updatedAt}
      imageType='icon'
      imageSize="large"
    >
      {activity.description && (
        <div className="mt-2 text-sm text-muted-foreground text-center whitespace-pre-wrap">
          {activity.description}
        </div>
      )}
    </EntityCard>
  )

  // Right column: Main Content
  const rightColumn = (
    <div className="flex flex-col gap-6">
      {/* Note Section */}
      {activity.note && (
        <div className="bg-card shadow rounded-lg">
          <div className="px-6 py-4 border-b border-border">
            <h2 className="text-lg font-semibold text-foreground">Note</h2>
          </div>
          <div className="p-6">
            <p className="text-muted-foreground whitespace-pre-wrap">{activity.note}</p>
          </div>
        </div>
      )}

      {/* Additional Details (now displays notes) */}
      <div className="bg-card shadow rounded-lg">
        <div className="px-6 py-4 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">Details</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {/* Notes Section */}
            {activity.note && (
              <div>
                <h4 className="text-sm font-medium text-foreground mb-2">Note</h4>
                <div className="prose prose-sm prose-gray dark:prose-invert max-w-none text-foreground">
                  <ReactMarkdown rehypePlugins={[rehypeSanitize]}>{activity.note}</ReactMarkdown>
                </div>
              </div>
            )}

            {/* Show message if no additional details */}
            {!activity.note && !Boolean(activity.tags?.length) && (
              <p className="text-muted-foreground text-sm">No additional details available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <DetailsLayout
      leftColumn={leftColumn}
      rightColumn={rightColumn}
      headerSection={headerSection}
    />
  )
}
