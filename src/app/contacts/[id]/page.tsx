'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import rehypeSanitize from 'rehype-sanitize'
import { toast } from 'react-hot-toast'
import {
  PencilIcon,
  TrashIcon,
  EnvelopeIcon,
  PhoneIcon,
  UserIcon,
  BuildingOfficeIcon,
  ClockIcon,
  CalendarDaysIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import Header from '@/components/layout/Header'
import ActivityCard from '@/components/ActivityCard'

interface Contact {
  id: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  position?: string
  companyId?: string
  summary?: string
  image?: string
  company?: {
    id: string
    name: string
  }
  createdAt: string
  updatedAt: string
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
  company?: {
    id: number
    name: string
  }
  jobApplication?: {
    id: number
    position: string
  }
  createdAt: string
  updatedAt: string
}

interface Note {
  id: number
  title: string
  content: string
  tags?: string
  createdAt: string
  updatedAt: string
  userId: number
}

interface TimelineItem extends Partial<Activity>, Partial<Note> {
  itemType: 'activity' | 'note'
}

export default function ContactDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const [contact, setContact] = useState<Contact | null>(null)
  const [activities, setActivities] = useState<Activity[]>([])
  const [notes, setNotes] = useState<Note[]>([])
  const [timelineItems, setTimelineItems] = useState<TimelineItem[]>([])
  const [loading, setLoading] = useState(true)
  const [activitiesLoading, setActivitiesLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)
  const [editingSummary, setEditingSummary] = useState(false)
  const [editedSummary, setEditedSummary] = useState('')
  const [savingSummary, setSavingSummary] = useState(false)

  const fetchContact = useCallback(async () => {
    try {
      const response = await fetch(`/api/contacts/${id}`)
      if (!response.ok) {
        throw new Error('Failed to fetch contact')
      }
      const data = await response.json()
      setContact(data)
    } catch (error) {
      console.error('Error fetching contact:', error)
      toast.error('Failed to load contact')
    } finally {
      setLoading(false)
    }
  }, [id])

  const fetchActivities = useCallback(async () => {
    try {
      const response = await fetch(`/api/contacts/${id}/activities`)
      if (!response.ok) {
        throw new Error('Failed to fetch activities')
      }
      const data = await response.json()
      setActivities(data)
    } catch (error) {
      console.error('Error fetching activities:', error)
      toast.error('Failed to load activities')
    }
  }, [id])

  const fetchNotes = useCallback(async () => {
    try {
      const response = await fetch('/api/notes')
      if (!response.ok) {
        throw new Error('Failed to fetch notes')
      }
      const data = await response.json()
      setNotes(data)
    } catch (error) {
      console.error('Error fetching notes:', error)
      toast.error('Failed to load notes')
    }
  }, [])

  const combineTimelineItems = useCallback(() => {
    const activityItems: TimelineItem[] = activities.map(activity => ({
      ...activity,
      itemType: 'activity' as const
    }))

    const noteItems: TimelineItem[] = notes.map(note => ({
      ...note,
      itemType: 'note' as const
    }))

    const combined = [...activityItems, ...noteItems]

    // Sort by date (activities use 'date', notes use 'createdAt')
    combined.sort((a, b) => {
      const dateA = new Date(a.itemType === 'activity' ? a.date! : a.createdAt!)
      const dateB = new Date(b.itemType === 'activity' ? b.date! : b.createdAt!)
      return dateB.getTime() - dateA.getTime()
    })

    setTimelineItems(combined)
    setActivitiesLoading(false)
  }, [activities, notes])

  useEffect(() => {
    combineTimelineItems()
  }, [combineTimelineItems])

  useEffect(() => {
    fetchContact()
    fetchActivities()
    fetchNotes()
  }, [fetchContact, fetchActivities, fetchNotes])

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this contact?')) {
      return
    }

    setDeleting(true)
    try {
      const response = await fetch(`/api/contacts/${id}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Failed to delete contact')
      }

      toast.success('Contact deleted successfully')
      router.push('/contacts')
    } catch (error) {
      console.error('Error deleting contact:', error)
      toast.error('Failed to delete contact')
    } finally {
      setDeleting(false)
    }
  }

  const handleEditSummary = useCallback(() => {
    setEditedSummary(contact?.summary || '')
    setEditingSummary(true)
  }, [contact?.summary])

  const handleCancelSummaryEdit = useCallback(() => {
    setEditingSummary(false)
    setEditedSummary('')
  }, [])

  const handleSaveSummary = useCallback(async () => {
    if (!contact) return

    setSavingSummary(true)
    try {
      const response = await fetch(`/api/contacts/${contact.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          firstName: contact.firstName,
          lastName: contact.lastName,
          email: contact.email,
          phone: contact.phone,
          position: contact.position,
          companyId: contact.companyId,
          summary: editedSummary,
          image: contact.image
        })
      })

      if (!response.ok) {
        throw new Error('Failed to update summary')
      }

      const updatedContact = await response.json()
      setContact(updatedContact)
      setEditingSummary(false)
      setEditedSummary('')
      toast.success('Summary updated successfully')
    } catch (error) {
      console.error('Error updating summary:', error)
      toast.error('Failed to update summary')
    } finally {
      setSavingSummary(false)
    }
  }, [contact, editedSummary])

  // Handle keyboard shortcuts for summary editing
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (editingSummary) {
        if (e.key === 'Escape') {
          handleCancelSummaryEdit()
        } else if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
          e.preventDefault()
          handleSaveSummary()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [editingSummary, handleCancelSummaryEdit, handleSaveSummary])

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="animate-pulse">
          <div className="flex items-start space-x-6">
            <div className="w-32 h-32 bg-gray-200 rounded-lg"></div>
            <div className="flex-1">
              <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!contact) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto p-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Contact Not Found</h1>
            <Link
              href="/contacts"
              className="text-blue-600 hover:text-blue-500"
            >
              Back to Contacts
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div className="flex items-center space-x-4">
            <Link
              href="/contacts"
              className="text-blue-600 hover:text-blue-500"
            >
              ← Back to Contacts
            </Link>
          </div>
          <div className="flex space-x-2">
            <Link
              href={`/contacts/${contact.id}/edit`}
              className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <PencilIcon className="w-4 h-4 mr-2" />
              Edit
            </Link>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="inline-flex items-center px-3 py-2 border border-red-300 rounded-md text-sm font-medium text-red-700 bg-white hover:bg-red-50 disabled:opacity-50"
            >
              <TrashIcon className="w-4 h-4 mr-2" />
              {deleting ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>

        {/* Contact Details */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="p-6">
            <div className="flex items-start space-x-6">
              {/* Contact Photo */}
              <div className="flex-shrink-0">
                <div className="w-32 h-32 border-2 border-gray-300 rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center">
                  {contact.image ? (
                    <Image
                      src={contact.image}
                      alt={`${contact.firstName} ${contact.lastName}`}
                      width={128}
                      height={128}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <UserIcon className="w-16 h-16 text-gray-400" />
                  )}
                </div>
              </div>

              {/* Contact Info */}
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {contact.firstName} {contact.lastName}
                </h1>

                {contact.position && (
                  <p className="text-lg text-gray-600 mb-4">{contact.position}</p>
                )}

                <div className="space-y-3">
                  <div className="flex items-center text-gray-600">
                    <EnvelopeIcon className="w-5 h-5 mr-3" />
                    <a
                      href={`mailto:${contact.email}`}
                      className="text-blue-600 hover:text-blue-500"
                    >
                      {contact.email}
                    </a>
                  </div>

                  {contact.phone && (
                    <div className="flex items-center text-gray-600">
                      <PhoneIcon className="w-5 h-5 mr-3" />
                      <a
                        href={`tel:${contact.phone}`}
                        className="text-blue-600 hover:text-blue-500"
                      >
                        {contact.phone}
                      </a>
                    </div>
                  )}

                  {contact.company && (
                    <div className="flex items-center text-gray-600">
                      <BuildingOfficeIcon className="w-5 h-5 mr-3" />
                      <Link
                        href={`/companies/${contact.company.id}`}
                        className="text-blue-600 hover:text-blue-500"
                      >
                        {contact.company.name}
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Metadata */}
          <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
            <div className="text-sm text-gray-500">
              <p>Created: {new Date(contact.createdAt).toLocaleDateString()}</p>
              <p>Updated: {new Date(contact.updatedAt).toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        {/* Summary Section */}
        <div className="mt-8">
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900">Summary</h2>
              {!editingSummary ? (
                <button
                  onClick={handleEditSummary}
                  className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                  title={contact.summary ? "Edit summary" : "Add summary"}
                >
                  <PencilIcon className="w-4 h-4" />
                </button>
              ) : (
                <div className="flex space-x-2">
                  <button
                    onClick={handleSaveSummary}
                    disabled={savingSummary}
                    className="p-1 text-green-600 hover:text-green-700 transition-colors disabled:opacity-50"
                    title="Save changes"
                  >
                    <CheckIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleCancelSummaryEdit}
                    disabled={savingSummary}
                    className="p-1 text-red-600 hover:text-red-700 transition-colors disabled:opacity-50"
                    title="Cancel editing"
                  >
                    <XMarkIcon className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
            <div className="p-6">
              {editingSummary ? (<div className="space-y-3">
                <textarea
                  value={editedSummary}
                  onChange={(e) => setEditedSummary(e.target.value)}
                  rows={6}
                  placeholder="Brief markdown-formatted note about this contact..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                  disabled={savingSummary}
                  autoFocus
                />
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>You can use markdown formatting (e.g., **bold**, *italic*, lists)</span>
                  <span>Press Ctrl+Enter to save, Escape to cancel</span>
                </div>
              </div>
              ) : contact.summary ? (
                <div className="prose prose-sm max-w-none">
                  <ReactMarkdown rehypePlugins={[rehypeSanitize]}>
                    {contact.summary}
                  </ReactMarkdown>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-gray-400 mb-2">
                    <PencilIcon className="mx-auto h-8 w-8" />
                  </div>
                  <p className="text-sm text-gray-500 mb-4">No summary yet</p>
                  <button
                    onClick={handleEditSummary}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <PencilIcon className="w-4 h-4 mr-2" />
                    Add Summary
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Timeline Section */}
        <div className="mt-8">
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900 flex items-center">
                <ClockIcon className="w-5 h-5 mr-2" />
                Timeline
              </h2>
            </div>

            <div className="p-6">
              {activitiesLoading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="animate-pulse flex space-x-4">
                      <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : timelineItems.length === 0 ? (
                <div className="text-center py-8">
                  <ClockIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No activities or notes yet</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Activities and notes will appear here.
                  </p>
                  <div className="mt-6">
                    <Link
                      href="/activities/new"
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                    >
                      <CalendarDaysIcon className="w-4 h-4 mr-2" />
                      Add Activity
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="flow-root">
                  <ul className="-mb-8">
                    {timelineItems.map((item, itemIdx) => (
                      <ActivityCard
                        key={`${item.itemType}-${item.id}`}
                        item={item}
                        showTimeline={true}
                        isLast={itemIdx === timelineItems.length - 1}
                      />
                    ))}
                  </ul>

                  {timelineItems.length > 0 && (
                    <div className="mt-6 text-center">
                      <Link
                        href="/activities/new"
                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                      >
                        <CalendarDaysIcon className="w-4 h-4 mr-2" />
                        Add New Activity
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
