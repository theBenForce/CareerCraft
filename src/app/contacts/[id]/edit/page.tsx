'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'react-hot-toast'
import { X, Plus } from 'lucide-react'
import ImageUpload from '@/components/ImageUpload'
import Header from '@/components/layout/Header'
import { TagList, TagComponent } from '@/components/TagComponent'
import { Contact, Company, Tag } from '@prisma/client';
import { ContactTag } from '@/types';
import { ThemeProvider } from '@/components/theme-provider';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectContent, SelectItem } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useMediaQuery } from '@/hooks/use-media-query';
import TagSelect from '@/components/ui/tag-select';

export default function EditContactPage() {
  const { id } = useParams()
  const router = useRouter()
  const [contact, setContact] = useState<Contact | null>(null)
  const [companies, setCompanies] = useState<Company[]>([])
  const [availableTags, setAvailableTags] = useState<Tag[]>([])
  const [contactTags, setContactTags] = useState<Tag[]>([])
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
      if (data.tags) {
        setContactTags(data.tags)
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

  function CompanyComboBox({ value, onChange, companies }: { value: string; onChange: (val: string) => void; companies: Company[] }) {
    const [open, setOpen] = useState(false);
    const isDesktop = useMediaQuery('(min-width: 768px)');
    const [selectedCompany, setSelectedCompany] = useState<Company | null>(
      companies.find((c) => c.id === value) || null
    );

    useEffect(() => {
      setSelectedCompany(companies.find((c) => c.id === value) || null);
    }, [value, companies]);

    const handleSelect = (val: string) => {
      const company = companies.find((c) => c.id === val) || null;
      setSelectedCompany(company);
      onChange(val);
      setOpen(false);
    };

    if (isDesktop) {
      return (
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-start border border-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-transparent text-foreground"
            >
              {selectedCompany ? selectedCompany.name : 'Select a company'}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0" align="start">
            <Command>
              <CommandInput placeholder="Filter company..." />
              <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup>
                  {companies.map((company) => (
                    <CommandItem
                      key={company.id}
                      value={company.id}
                      onSelect={() => handleSelect(company.id)}
                    >
                      {company.name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      );
    }

    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-start border border-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-transparent text-foreground"
          >
            {selectedCompany ? selectedCompany.name : 'Select a company'}
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <div className="mt-4 border-t">
            <Command>
              <CommandInput placeholder="Filter company..." />
              <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup>
                  {companies.map((company) => (
                    <CommandItem
                      key={company.id}
                      value={company.id}
                      onSelect={() => handleSelect(company.id)}
                    >
                      {company.name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </div>
        </DrawerContent>
      </Drawer>
    );
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
    <ThemeProvider>
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-2xl mx-auto p-6">
          <Card>
            <CardHeader>
              <CardTitle>Edit Contact</CardTitle>
            </CardHeader>
            <CardContent>
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
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                      className="border border-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                      className="border border-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="border border-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Phone */}
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="border border-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Position */}
                <div>
                  <Label htmlFor="position">Position</Label>
                  <Input
                    type="text"
                    id="position"
                    name="position"
                    value={formData.position}
                    onChange={handleInputChange}
                    className="border border-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Summary */}
                <div>
                  <Label htmlFor="summary">Summary</Label>
                  <Textarea
                    id="summary"
                    name="summary"
                    value={formData.summary}
                    onChange={handleInputChange}
                    rows={4}
                    placeholder="Brief markdown-formatted note about this contact..."
                    className="border border-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <p className="mt-1 text-sm text-muted-foreground">
                    You can use markdown formatting (e.g., **bold**, *italic*, lists)
                  </p>
                </div>

                {/* Company */}
                <div>
                  <Label htmlFor="companyId">Company</Label>
                  <div className="bg-transparent border border-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <CompanyComboBox
                      value={formData.companyId}
                      onChange={(val) => setFormData((prev) => ({ ...prev, companyId: val }))}
                      companies={companies}
                    />
                  </div>
                </div>

                {/* Tags Section */}
                <div>
                  <Label className="block text-sm font-medium text-gray-700 mb-3">
                    Tags
                  </Label>
                  <TagSelect
                    availableTags={availableTags}
                    selectedTags={contactTags}
                    onChange={async (tags) => {
                      // Add new tags
                      for (const tag of tags) {
                        if (!contactTags.some((t) => t.id === tag.id)) {
                          await handleAddTag(tag)
                        }
                      }
                      // Remove unselected tags
                      for (const tag of contactTags) {
                        if (!tags.some((t) => t.id === tag.id)) {
                          await handleRemoveTag(tag.id)
                        }
                      }
                    }}
                    placeholder="Type or select tags..."
                    disabled={saving}
                  />
                </div>

                {/* Submit Button */}
                <div className="flex justify-end">
                  <Button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save Contact'}</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </ThemeProvider>
  )
}
