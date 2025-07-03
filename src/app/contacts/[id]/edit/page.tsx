'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'react-hot-toast'
import { X, Plus } from 'lucide-react'
import ImageUpload from '@/components/ImageUpload'
import Header from '@/components/layout/Header'
import { TagList, TagComponent } from '@/components/TagComponent'
import { Tag } from '@/types'

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
  contactTags?: ContactTag[]
}

interface Company {
  id: string
  name: string
}

interface ContactTag {
  id: number
  contactId: number
  tagId: number
  tag: Tag
}

export default function EditContactPage() {
  const { id } = useParams()
  const router = useRouter()
  const [contact, setContact] = useState<Contact | null>(null)
  const [companies, setCompanies] = useState<Company[]>([])
  const [availableTags, setAvailableTags] = useState<Tag[]>([])
  const [contactTags, setContactTags] = useState<Tag[]>([])
  const [showTagSelector, setShowTagSelector] = useState(false)
  const [showCreateTag, setShowCreateTag] = useState(false)
  const [newTagName, setNewTagName] = useState('')
  const [newTagColor, setNewTagColor] = useState('#3b82f6')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    position: '',
    companyId: '',
    summary: '',
    image: ''
  })

  const fetchContact = useCallback(async () => {
    try {
      const response = await fetch(`/api/contacts/${id}`)
      if (!response.ok) {
        throw new Error('Failed to fetch contact')
      }
      const data = await response.json()
      setContact(data)
      setFormData({
        firstName: data.firstName || '',
        lastName: data.lastName || '',
        email: data.email || '',
        phone: data.phone || '',
        position: data.position || '',
        companyId: data.companyId || '',
        summary: data.summary || '',
        image: data.image || ''
      })
      // Set contact tags if available
      if (data.contactTags) {
        setContactTags(data.contactTags.map((ct: ContactTag) => ct.tag))
      }
    } catch (error) {
      console.error('Error fetching contact:', error)
      toast.error('Failed to load contact')
    }
  }, [id])

  const fetchCompanies = useCallback(async () => {
    try {
      const response = await fetch('/api/companies')
      if (!response.ok) {
        throw new Error('Failed to fetch companies')
      }
      const data = await response.json()
      setCompanies(data)
    } catch (error) {
      console.error('Error fetching companies:', error)
      toast.error('Failed to load companies')
    }
  }, [])

  const fetchTags = useCallback(async () => {
    try {
      const response = await fetch('/api/tags?userId=1') // TODO: Get actual user ID
      if (!response.ok) {
        throw new Error('Failed to fetch tags')
      }
      const data = await response.json()
      setAvailableTags(data)
    } catch (error) {
      console.error('Error fetching tags:', error)
      toast.error('Failed to load tags')
    }
  }, [])

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      await Promise.all([fetchContact(), fetchCompanies(), fetchTags()])
      setLoading(false)
    }
    loadData()
  }, [fetchContact, fetchCompanies, fetchTags])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const response = await fetch(`/api/contacts/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          companyId: formData.companyId || null
        })
      })

      if (!response.ok) {
        throw new Error('Failed to update contact')
      }

      toast.success('Contact updated successfully!')
      router.push(`/contacts/${id}`)
    } catch (error) {
      console.error('Error updating contact:', error)
      toast.error('Failed to update contact')
    } finally {
      setSaving(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleImageUpload = (imageUrl: string) => {
    setFormData(prev => ({
      ...prev,
      image: imageUrl
    }))
  }

  const handleImageRemove = () => {
    setFormData(prev => ({
      ...prev,
      image: ''
    }))
  }

  const handleAddTag = async (tag: Tag) => {
    try {
      const response = await fetch(`/api/contacts/${id}/tags`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tagId: tag.id }),
      })

      if (!response.ok) {
        throw new Error('Failed to add tag')
      }

      setContactTags(prev => [...prev, tag])
      setShowTagSelector(false)
      toast.success('Tag added successfully!')
    } catch (error) {
      console.error('Error adding tag:', error)
      toast.error('Failed to add tag')
    }
  }

  const handleRemoveTag = async (tagId: string) => {
    try {
      const response = await fetch(`/api/contacts/${id}/tags?tagId=${tagId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to remove tag')
      }

      setContactTags(prev => prev.filter(tag => tag.id !== tagId))
      toast.success('Tag removed successfully!')
    } catch (error) {
      console.error('Error removing tag:', error)
      toast.error('Failed to remove tag')
    }
  }

  const handleCreateTag = async () => {
    if (!newTagName.trim()) {
      toast.error('Tag name is required')
      return
    }

    try {
      const response = await fetch('/api/tags', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newTagName.trim(),
          color: newTagColor,
          userId: 1, // TODO: Get actual user ID
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create tag')
      }

      const newTag = await response.json()
      setAvailableTags(prev => [...prev, newTag])
      setNewTagName('')
      setNewTagColor('#3b82f6')
      setShowCreateTag(false)
      toast.success('Tag created successfully!')

      // Automatically add the new tag to the contact
      await handleAddTag(newTag)
    } catch (error) {
      console.error('Error creating tag:', error)
      toast.error('Failed to create tag')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-2xl mx-auto p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
            <div className="space-y-4">
              <div className="h-10 bg-gray-200 rounded"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
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
        <div className="max-w-2xl mx-auto p-6">
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
      <div className="max-w-2xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Edit Contact</h1>
          <Link
            href={`/contacts/${id}`}
            className="text-blue-600 hover:text-blue-500"
          >
            Cancel
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Contact Photo */}
          <ImageUpload
            currentImage={formData.image}
            onImageUpload={handleImageUpload}
            onImageRemove={handleImageRemove}
            category="contacts"
          />

          {/* Name Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                First Name *
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                Last Name *
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              Phone
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Position */}
          <div>
            <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-1">
              Position
            </label>
            <input
              type="text"
              id="position"
              name="position"
              value={formData.position}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Summary */}
          <div>
            <label htmlFor="summary" className="block text-sm font-medium text-gray-700 mb-1">
              Summary
            </label>
            <textarea
              id="summary"
              name="summary"
              value={formData.summary}
              onChange={handleInputChange}
              rows={4}
              placeholder="Brief markdown-formatted note about this contact..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <p className="mt-1 text-sm text-gray-500">
              You can use markdown formatting (e.g., **bold**, *italic*, lists)
            </p>
          </div>

          {/* Company */}
          <div>
            <label htmlFor="companyId" className="block text-sm font-medium text-gray-700 mb-1">
              Company
            </label>
            <select
              id="companyId"
              name="companyId"
              value={formData.companyId}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select a company</option>
              {companies.map((company) => (
                <option key={company.id} value={company.id}>
                  {company.name}
                </option>
              ))}
            </select>
          </div>

          {/* Tags Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Tags
            </label>

            {/* Current Tags */}
            <div className="space-y-3">
              {contactTags.length > 0 ? (
                <div>
                  <p className="text-sm text-gray-600 mb-2">Current tags:</p>
                  <TagList
                    tags={contactTags}
                    removable={true}
                    clickable={false}
                    onRemove={handleRemoveTag}
                  />
                </div>
              ) : (
                <p className="text-sm text-gray-500">No tags assigned</p>
              )}

              {/* Add Tag Button */}
              <div>
                {!showTagSelector ? (
                  <button
                    type="button"
                    onClick={() => setShowTagSelector(true)}
                    className="inline-flex items-center px-3 py-2 border border-dashed border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Tag
                  </button>
                ) : (
                  <div className="border border-gray-200 rounded-md p-4 bg-gray-50">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-medium text-gray-900">Select a tag to add:</h4>
                      <button
                        type="button"
                        onClick={() => setShowTagSelector(false)}
                        className="text-gray-400 hover:text-gray-600"
                        title="Close tag selector"
                        aria-label="Close tag selector"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {availableTags
                        .filter(tag => !contactTags.some(ct => ct.id === tag.id))
                        .map(tag => (
                          <button
                            key={tag.id}
                            type="button"
                            onClick={() => handleAddTag(tag)}
                            className="text-left p-2 border border-gray-200 rounded-md hover:bg-white hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <TagComponent tag={tag} clickable={false} />
                            {tag.description && (
                              <p className="text-xs text-gray-500 mt-1">{tag.description}</p>
                            )}
                          </button>
                        ))}
                    </div>

                    {availableTags.filter(tag => !contactTags.some(ct => ct.id === tag.id)).length === 0 && (
                      <p className="text-sm text-gray-500">All available tags have been assigned to this contact.</p>
                    )}

                    {/* Create New Tag Section */}
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      {!showCreateTag ? (
                        <button
                          type="button"
                          onClick={() => setShowCreateTag(true)}
                          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                        >
                          + Create New Tag
                        </button>
                      ) : (
                        <div className="space-y-3">
                          <h5 className="text-sm font-medium text-gray-900">Create New Tag</h5>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <input
                                type="text"
                                placeholder="Tag name"
                                value={newTagName}
                                onChange={(e) => setNewTagName(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            </div>
                            <div>
                              <label htmlFor="newTagColor" className="sr-only">Tag color</label>
                              <input
                                id="newTagColor"
                                type="color"
                                value={newTagColor}
                                onChange={(e) => setNewTagColor(e.target.value)}
                                className="w-full h-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                title="Choose tag color"
                              />
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={handleCreateTag}
                              className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              Create & Add
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setShowCreateTag(false)
                                setNewTagName('')
                                setNewTagColor('#3b82f6')
                              }}
                              className="px-3 py-1.5 text-gray-700 text-sm border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Saving...' : 'Save Contact'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
