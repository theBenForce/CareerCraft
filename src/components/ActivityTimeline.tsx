'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { toast } from 'react-hot-toast'
import {
  ClockIcon,
  CalendarDaysIcon
} from '@heroicons/react/24/outline'
import ActivityCard from '@/components/ActivityCard'
import { ActivityWithTags } from '@/types'

interface ActivityTimelineProps {
  entityType: 'contact' | 'company' | 'application'
  entityId: string
  title?: string
  addActivityHref?: string
  className?: string
  standalone?: boolean // Whether to render as standalone card or as tab content
}

export function ActivityTimeline({
  entityType,
  entityId,
  title = 'Timeline',
  addActivityHref = '/activities/new',
  className = '',
  standalone = true
}: ActivityTimelineProps) {
  const [activities, setActivities] = useState<ActivityWithTags[]>([])
  const [loading, setLoading] = useState(true)

  const fetchActivities = useCallback(async () => {
    try {
      let activitiesUrl = ''

      switch (entityType) {
        case 'contact':
          activitiesUrl = `/api/contacts/${entityId}/activities`
          break
        case 'company':
          activitiesUrl = `/api/companies/${entityId}/activities`
          break
        case 'application':
          activitiesUrl = `/api/applications/${entityId}/activities`
          break
        default:
          throw new Error(`Unknown entity type: ${entityType}`)
      }

      const response = await fetch(activitiesUrl)
      if (!response.ok) {
        throw new Error('Failed to fetch activities')
      }
      const data = await response.json()
      setActivities(data)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching activities:', error)
      toast.error('Failed to load activities')
      setLoading(false)
    }
  }, [entityType, entityId])

  useEffect(() => {
    fetchActivities()
  }, [fetchActivities])

  return (
    <div className={`${standalone ? 'bg-card shadow rounded-lg' : ''} ${className}`}>
      <div className="flex items-center justify-between px-6 py-4 border-b border-border">
        <div className="flex items-center">
          <ClockIcon className="w-5 h-5 text-primary mr-2" />
          <h2 className="text-lg font-semibold text-foreground">{title}</h2>
        </div>
        <Link
          href={addActivityHref}
          className="bg-primary text-primary-foreground px-3 py-2 rounded-lg hover:bg-primary/90 flex items-center text-sm font-medium"
        >
          <CalendarDaysIcon className="w-4 h-4 mr-2" />
          Add Activity
        </Link>
      </div>
      <div className="p-6">
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse flex space-x-4">
                <div className="w-10 h-10 bg-muted rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-muted rounded w-1/4 mb-2"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : activities.length === 0 ? (
          <div className="text-center py-8">
            <ClockIcon className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-2 text-sm font-medium text-foreground">No activities or notes yet</h3>
            <p className="mt-1 text-sm text-muted-foreground">Activities and notes will appear here.</p>
            <div className="mt-6">
              <Link
                href={addActivityHref}
                className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 flex items-center text-sm font-medium mx-auto"
              >
                <CalendarDaysIcon className="w-4 h-4 mr-2" />
                Add Activity
              </Link>
            </div>
          </div>
        ) : (
          <div className="relative">
            <ul className="space-y-0">
              {activities.map((item: ActivityWithTags, itemIdx: number) => (
                <ActivityCard
                  key={`activity-${item.id}`}
                  item={item}
                  showTimeline={true}
                  isLast={itemIdx === activities.length - 1}
                />
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
