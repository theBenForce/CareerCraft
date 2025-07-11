'use client'

import { ActivityTimeline } from '@/components/ActivityTimeline'
import { EntityCard } from '@/components/EntityCard'
import DetailsLayout from '@/components/layout/DetailsLayout'
import {
  faFacebook,
  faGithub,
  faInstagram,
  faLinkedin,
  faXTwitter
} from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  BuildingOfficeIcon,
  CheckIcon,
  EnvelopeIcon,
  LinkIcon,
  PencilIcon,
  PhoneIcon,
  TrashIcon,
  UserIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import { Tag } from '@prisma/client'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import ReactMarkdown from 'react-markdown'
import rehypeSanitize from 'rehype-sanitize'


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
  tags?: Tag[]
  links?: Array<{
    id: number
    url: string
    label?: string
    createdAt: string
    updatedAt: string
  }>
  createdAt: string
  updatedAt: string
}

export default function ContactDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const [contact, setContact] = useState<Contact | null>(null)
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)
  const [editingSummary, setEditingSummary] = useState(false)
  const [editedSummary, setEditedSummary] = useState('')
  const [savingSummary, setSavingSummary] = useState(false)

  // Function to get brand icon for a URL
  const getBrandIcon = (url: string) => {
    const domain = url.toLowerCase()

    if (domain.includes('linkedin.com')) {
      return <FontAwesomeIcon icon={faLinkedin} className="w-4 h-4 text-muted-foreground" />
    }
    if (domain.includes('twitter.com') || domain.includes('x.com')) {
      return <FontAwesomeIcon icon={faXTwitter} className="w-4 h-4 text-muted-foreground" />
    }
    if (domain.includes('facebook.com')) {
      return <FontAwesomeIcon icon={faFacebook} className="w-4 h-4 text-muted-foreground" />
    }
    if (domain.includes('instagram.com')) {
      return <FontAwesomeIcon icon={faInstagram} className="w-4 h-4 text-muted-foreground" />
    }
    if (domain.includes('github.com')) {
      return <FontAwesomeIcon icon={faGithub} className="w-4 h-4 text-muted-foreground" />
    }
    if (domain.includes('glassdoor.com')) {
      return <LinkIcon className="w-4 h-4 text-muted-foreground" />
    }
    if (domain.includes('crunchbase.com')) {
      return <LinkIcon className="w-4 h-4 text-muted-foreground" />
    }
    if (domain.includes('portfolio') || domain.includes('personal') || domain.includes('.dev') || domain.includes('.me')) {
      return <LinkIcon className="w-4 h-4 text-muted-foreground" />
    }

    // Default to LinkIcon for other URLs
    return <LinkIcon className="w-4 h-4 text-muted-foreground" />
  }

  const handleLinksChange = (updatedLinks: any[]) => {
    if (contact) {
      setContact({
        ...contact,
        links: updatedLinks
      })
    }
  }

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

  useEffect(() => {
    fetchContact()
  }, [fetchContact])

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
      <DetailsLayout
        headerSection={null}
        leftColumn={
          <div className="animate-pulse">
            <div className="w-32 h-32 bg-gray-200 rounded-lg mx-auto mb-4"></div>
            <div className="space-y-2">
              <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
              <div className="h-4 bg-gray-200 rounded w-1/3 mx-auto"></div>
            </div>
          </div>
        }
        rightColumn={
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="space-y-4">
              <div className="h-20 bg-gray-200 rounded"></div>
              <div className="h-20 bg-gray-200 rounded"></div>
              <div className="h-20 bg-gray-200 rounded"></div>
            </div>
          </div>
        }
      />
    )
  }

  if (!contact) {
    return (
      <DetailsLayout
        headerSection={null}
        leftColumn={
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Contact Not Found</h1>
            <Link
              href="/contacts"
              className="text-primary hover:text-primary/80"
            >
              Back to Contacts
            </Link>
          </div>
        }
        rightColumn={<div></div>}
      />
    )
  }

  // Header Section Component
  const headerSection = (
    <div className="flex justify-between items-center">
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
  )

  // Left Column Component
  const leftColumn = (
    <EntityCard
      id={contact.id}
      name={`${contact.firstName} ${contact.lastName}`}
      subtitle={contact.position}
      image={contact.image}
      imageAlt={`${contact.firstName} ${contact.lastName}`}
      fallbackIcon={<UserIcon className="w-16 h-16 text-muted-foreground" />}
      fallbackText={`${contact.firstName.charAt(0)}${contact.lastName.charAt(0)}`}
      imageType="avatar"
      imageSize="large"
      createdAt={contact.createdAt}
      updatedAt={contact.updatedAt}
      properties={[
        {
          icon: <EnvelopeIcon className="w-5 h-5" />,
          text: contact.email,
          href: `mailto:${contact.email}`
        },
        ...(contact.phone ? [{
          icon: <PhoneIcon className="w-5 h-5" />,
          text: contact.phone,
          href: `tel:${contact.phone}`
        }] : []),
        ...(contact.company ? [{
          icon: <BuildingOfficeIcon className="w-5 h-5" />,
          text: contact.company.name,
          href: `/companies/${contact.company.id}`
        }] : []),
        ...(contact.links || []).map(link => ({
          icon: getBrandIcon(link.url),
          text: link.label || 'Link',
          href: link.url
        }))
      ]}
      tags={contact.tags || []}
    />
  )

  // Right Column Component  
  const rightColumn = (
    <>
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
      <ActivityTimeline
        entityType="contact"
        entityId={contact.id}
        title="Timeline"
        addActivityHref={`/activities/new?contactId=${contact.id}`}
      />
    </>
  )

  return (
    <DetailsLayout
      headerSection={headerSection}
      leftColumn={leftColumn}
      rightColumn={rightColumn}
    />
  )
}
