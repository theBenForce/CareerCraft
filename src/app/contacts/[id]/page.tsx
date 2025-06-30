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
import { TagList } from '@/components/TagComponent'

interface Tag {
  id: number
  name: string
  color?: string
  description?: string
  createdAt: Date
  updatedAt: Date
  userId: number
}

interface ContactTag {
  id: number
  contactId: number
  tagId: number
  tag: Tag
}

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
  contactTags?: ContactTag[]
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
      const response = await fetch('/api/activities?type=NOTE')
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
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-4xl mx-auto p-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Contact Not Found</h1>
            <Link
              href="/contacts"
              className="text-primary hover:text-primary/80"
            >
              Back to Contacts
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
            href="/contacts"
            className="text-primary hover:text-primary/80 text-sm font-medium flex items-center gap-1"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
            Back to Contacts
          </Link>
          <div className="flex gap-2">
            <Link
              href={`/contacts/${contact.id}/edit`}
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
          {/* Left Column: Profile Card */}
          <div className="col-span-1">
            <div className="bg-card shadow rounded-lg p-8 flex flex-col items-center">
              <div className="w-32 h-32 rounded-full border-4 border-primary/20 bg-muted overflow-hidden flex items-center justify-center mb-4">
                {contact.image ? (
                  <Image
                    src={contact.image}
                    alt={`${contact.firstName} ${contact.lastName}`}
                    width={128}
                    height={128}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <UserIcon className="w-16 h-16 text-muted-foreground" />
                )}
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground mb-1 text-center">
                {contact.firstName} {contact.lastName}
              </h1>
              {contact.position && (
                <div className="text-lg font-semibold text-muted-foreground mb-2 text-center">{contact.position}</div>
              )}
              {contact.company && (
                <div className="flex items-center gap-2 mb-4 justify-center">
                  <BuildingOfficeIcon className="w-5 h-5 text-primary" />
                  <Link
                    href={`/companies/${contact.company.id}`}
                    className="text-primary hover:text-primary/80 font-medium"
                  >
                    {contact.company.name}
                  </Link>
                </div>
              )}
              <div className="flex flex-col gap-2 mt-2 w-full">
                <div className="flex items-center text-muted-foreground text-sm justify-center">
                  <EnvelopeIcon className="w-5 h-5 mr-2" />
                  <a href={`mailto:${contact.email}`} className="hover:underline text-primary">{contact.email}</a>
                </div>
                {contact.phone && (
                  <div className="flex items-center text-muted-foreground text-sm justify-center">
                    <PhoneIcon className="w-5 h-5 mr-2" />
                    <a href={`tel:${contact.phone}`} className="hover:underline text-primary">{contact.phone}</a>
                  </div>
                )}
              </div>

              {/* Tags */}
              {contact.contactTags && contact.contactTags.length > 0 && (
                <div className="mt-6 w-full">
                  <div className="flex flex-wrap gap-1 justify-center">
                    <TagList
                      tags={contact.contactTags.map(ct => ct.tag)}
                      maxDisplay={6}
                    />
                  </div>
                </div>
              )}

              <div className="mt-6 text-xs text-muted-foreground text-center">
                Joined {new Date(contact.createdAt).toLocaleDateString()}<br />
                Last updated {new Date(contact.updatedAt).toLocaleDateString()}
              </div>
            </div>
          </div>

          {/* Right Column: Main Content */}
          <div className="col-span-2 flex flex-col gap-8">
            {/* Summary Section */}
            <div className="bg-card shadow rounded-lg">
              <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                <h2 className="text-lg font-semibold text-foreground">Summary</h2>
                {!editingSummary ? (
                  <button
                    onClick={handleEditSummary}
                    className="p-1 text-muted-foreground hover:text-primary focus:outline-none"
                    title={contact.summary ? 'Edit summary' : 'Add summary'}
                    aria-label="Edit summary"
                  >
                    <PencilIcon className="w-5 h-5" />
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={handleSaveSummary}
                      disabled={savingSummary}
                      className="p-1 text-green-600 hover:text-green-700 focus:outline-none disabled:opacity-50"
                      title="Save changes"
                      aria-label="Save summary"
                    >
                      <CheckIcon className="w-5 h-5" />
                    </button>
                    <button
                      onClick={handleCancelSummaryEdit}
                      disabled={savingSummary}
                      className="p-1 text-destructive hover:text-destructive/80 focus:outline-none disabled:opacity-50"
                      title="Cancel editing"
                      aria-label="Cancel summary edit"
                    >
                      <XMarkIcon className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>
              <div className="p-6">
                {editingSummary ? (
                  <div className="space-y-3">
                    <textarea
                      value={editedSummary}
                      onChange={(e) => setEditedSummary(e.target.value)}
                      rows={6}
                      placeholder="Brief markdown-formatted note about this contact..."
                      className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring resize-none text-sm bg-background text-foreground"
                      disabled={savingSummary}
                      autoFocus
                    />
                    <div className="flex justify-between items-center text-xs text-muted-foreground">
                      <span>Markdown supported</span>
                      <span>Ctrl+Enter to save, Esc to cancel</span>
                    </div>
                  </div>
                ) : contact.summary ? (
                  <div className="prose prose-sm prose-gray dark:prose-invert max-w-none text-foreground">
                    <ReactMarkdown rehypePlugins={[rehypeSanitize]}>{contact.summary}</ReactMarkdown>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <PencilIcon className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground mb-4">No summary yet</p>
                    <button
                      onClick={handleEditSummary}
                      className="bg-secondary text-secondary-foreground px-4 py-2 rounded-lg hover:bg-secondary/80 flex items-center text-sm font-medium focus:outline-none mx-auto"
                    >
                      <PencilIcon className="w-4 h-4 mr-2" />
                      Add Summary
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Timeline Section */}
            <div className="bg-card shadow rounded-lg">
              <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                <div className="flex items-center">
                  <ClockIcon className="w-5 h-5 text-primary mr-2" />
                  <h2 className="text-lg font-semibold text-foreground">Timeline</h2>
                </div>
                <Link
                  href="/activities/new"
                  className="bg-primary text-primary-foreground px-3 py-2 rounded-lg hover:bg-primary/90 flex items-center text-sm font-medium"
                >
                  <CalendarDaysIcon className="w-4 h-4 mr-2" />
                  Add Activity
                </Link>
              </div>
              <div className="p-6">
                {activitiesLoading ? (
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
                ) : timelineItems.length === 0 ? (
                  <div className="text-center py-8">
                    <ClockIcon className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-2 text-sm font-medium text-foreground">No activities or notes yet</h3>
                    <p className="mt-1 text-sm text-muted-foreground">Activities and notes will appear here.</p>
                    <div className="mt-6">
                      <Link
                        href="/activities/new"
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
                      {timelineItems.map((item, itemIdx) => (
                        <ActivityCard
                          key={`${item.itemType}-${item.id}`}
                          item={item}
                          showTimeline={true}
                          isLast={itemIdx === timelineItems.length - 1}
                        />
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
