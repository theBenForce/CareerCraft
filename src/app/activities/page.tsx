'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { toast } from 'react-hot-toast'
import {
  CalendarIcon,
  PlusIcon
} from '@heroicons/react/24/outline'
import Header from '@/components/layout/Header'
import ActivityCard from '@/components/ActivityCard'
import { ActivityWithTags } from '@/types'

export default function ActivitiesPage() {
  const [activities, setActivities] = useState<ActivityWithTags[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchActivities()
  }, [])

  const fetchActivities = async () => {
    try {
      const response = await fetch('/api/activities')
      if (!response.ok) {
        throw new Error('Failed to fetch activities')
      }
      const data = await response.json()
      setActivities(data)
    } catch (error) {
      console.error('Error fetching activities:', error)
      toast.error('Failed to load activities')
    } finally {
      setLoading(false)
    }
  }

  // Group activities by date
  const groupActivitiesByDate = (activities: ActivityWithTags[]) => {
    const grouped = activities.reduce((acc, activity) => {
      const date = new Date(activity.date).toDateString()
      if (!acc[date]) {
        acc[date] = []
      }
      acc[date].push(activity)
      return acc
    }, {} as Record<string, ActivityWithTags[]>)

    // Sort dates in descending order (newest first)
    const sortedDates = Object.keys(grouped).sort((a, b) =>
      new Date(b).getTime() - new Date(a).getTime()
    )

    return sortedDates.map(date => ({
      date,
      activities: grouped[date].sort((a, b) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
      )
    }))
  }

  const formatDateHeader = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) {
      return 'Today'
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday'
    } else {
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }
  }

  const groupedActivities = groupActivitiesByDate(activities)

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />

        <div className="max-w-7xl mx-auto p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-1/4 mb-6"></div>

            {/* Vertical timeline skeleton */}
            <div className="relative">
              {/* Vertical line skeleton */}
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border" aria-hidden="true" />

              <div className="space-y-8">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="relative">
                    {/* Date circle and label skeleton */}
                    <div className="flex items-center">
                      <div className="flex-shrink-0 w-12 h-12 bg-muted rounded-full relative z-10"></div>
                      <div className="ml-4">
                        <div className="h-5 bg-muted rounded w-32 mb-2"></div>
                        <div className="h-4 bg-muted rounded w-24"></div>
                      </div>
                    </div>

                    {/* Activities skeleton */}
                    <div className="ml-16 mt-4 space-y-4">
                      {[...Array(2)].map((_, j) => (
                        <div key={j} className="bg-card rounded-lg shadow-sm border border-border p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center mb-2">
                                <div className="h-8 w-8 bg-muted rounded-full"></div>
                                <div className="ml-3">
                                  <div className="h-4 bg-muted rounded w-20 mb-1"></div>
                                  <div className="h-5 bg-muted rounded w-48"></div>
                                </div>
                              </div>
                              <div className="h-3 bg-muted rounded w-3/4 mb-2"></div>
                              <div className="h-3 bg-muted rounded w-1/2"></div>
                            </div>
                            <div className="h-4 bg-muted rounded w-20"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Activities</h1>
            <p className="text-muted-foreground mt-1">Track meetings, calls, and interactions</p>
          </div>
          <Link
            href="/activities/new"
            className="btn-primary"
          >
            <PlusIcon className="w-4 h-4 mr-2" />
            Add Activity
          </Link>
        </div>

        {/* Activities Timeline */}
        {activities.length === 0 ? (
          <div className="text-center py-12">
            <CalendarIcon className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-2 text-sm font-medium text-foreground">No activities</h3>
            <p className="mt-1 text-sm text-muted-foreground">Get started by creating a new activity.</p>
            <div className="mt-6">
              <Link
                href="/activities/new"
                className="btn-primary"
              >
                <PlusIcon className="w-4 h-4 mr-2" />
                Add Activity
              </Link>
            </div>
          </div>
        ) : (
          <div className="relative">
            {/* Vertical timeline line */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border" aria-hidden="true" />

            <div className="space-y-8">
              {groupedActivities.map((group, groupIndex) => (
                <div key={group.date} className="relative">
                  {/* Date circle and label */}
                  <div className="flex items-center">
                    <div className="flex-shrink-0 w-12 h-12 bg-primary rounded-full flex items-center justify-center relative z-10 shadow-md">
                      <CalendarIcon className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold text-foreground">
                        {formatDateHeader(group.date)}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {new Date(group.date).toLocaleDateString('en-US', {
                          weekday: 'long',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>

                  {/* Activities for this date */}
                  <div className="ml-16 mt-4 space-y-4">
                    {group.activities.map((activity, activityIndex) => (
                      <ActivityCard
                        key={activity.id}
                        item={activity}
                        showTimeline={false}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
