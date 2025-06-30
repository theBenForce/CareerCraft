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
  subject: string
  description?: string
  date: string
  duration?: number
  outcome?: string
  followUpDate?: string
  company?: Company
  jobApplication?: {
    id: number
    position: string
  }
  contacts: Contact[]
  activityTags?: ActivityTag[]
  createdAt: string
  updatedAt: string
}

export default function ActivitiesPage() {
  const [activities, setActivities] = useState<Activity[]>([])
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />

        <div className="max-w-7xl mx-auto p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Activities</h1>
            <p className="text-gray-600 mt-1">Track meetings, calls, and interactions</p>
          </div>
          <Link
            href="/activities/new"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <PlusIcon className="w-4 h-4 mr-2" />
            Add Activity
          </Link>
        </div>

        {/* Activities List */}
        {activities.length === 0 ? (
          <div className="text-center py-12">
            <CalendarIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No activities</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by creating a new activity.</p>
            <div className="mt-6">
              <Link
                href="/activities/new"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                <PlusIcon className="w-4 h-4 mr-2" />
                Add Activity
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {activities.map((activity) => (
                <ActivityCard
                  key={activity.id}
                  item={{ ...activity, itemType: 'activity' as const }}
                  showTimeline={false}
                />
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
