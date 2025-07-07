'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'react-hot-toast'
import {
  BuildingOfficeIcon,
  ArrowLeftIcon,
  GlobeAltIcon,
  MapPinIcon,
  UserGroupIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline'
import ImageUpload from '@/components/ImageUpload'
import Header from '@/components/layout/Header'
import LinksManager from '@/components/LinksManager'
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useMediaQuery } from "../../../../hooks/use-media-query";

interface CompanyFormData {
  name: string
  industry: string
  description: string
  location: string
  size: string
  logo: string
  notes: string
  links: {
    id: string;
    label: string | null;
    url: string;
    companyId: string | null;
    contactId: string | null;
    jobApplicationId: string | null;
    activityId: string | null;
    createdAt: Date;
    updatedAt: Date;
  }[]
}

const companySizes = [
  'Startup (1-10)',
  'Small (11-50)',
  'Medium (51-200)',
  'Large (201-1000)',
  'Enterprise (1000+)'
]

const industries = [
  'Technology',
  'Healthcare',
  'Finance',
  'Education',
  'Retail',
  'Manufacturing',
  'Consulting',
  'Media & Entertainment',
  'Real Estate',
  'Transportation',
  'Energy',
  'Government',
  'Non-Profit',
  'Other'
]

export default function EditCompanyPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const companyId = params.id;

  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<CompanyFormData>({
    name: '',
    industry: '',
    description: '',
    location: '',
    size: '',
    logo: '',
    notes: '',
    links: [],
  })

  useEffect(() => {

    const fetchCompany = async () => {
      try {
        const response = await fetch(`/api/companies/${companyId}`)
        if (!response.ok) {
          if (response.status === 404) {
            notFound()
          }
          throw new Error('Failed to fetch company')
        }

        const company = await response.json()
        setFormData({
          name: company.name || '',
          industry: company.industry || '',
          description: company.description || '',
          location: company.location || '',
          size: company.size || '',
          logo: company.logo || '',
          notes: company.notes || '',
          links: company.links || [],
        })
      } catch (error) {
        console.error('Error fetching company:', error)
        toast.error('Failed to load company details')
      } finally {
        setIsLoading(false)
      }
    }

    fetchCompany()
  }, [companyId])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleLinksChange = (updatedLinks: any[]) => {
    setFormData(prev => ({
      ...prev,
      links: updatedLinks
    }))
  }

  const handleLogoUpload = (logoUrl: string) => {
    setFormData(prev => ({
      ...prev,
      logo: logoUrl
    }))
  }

  const handleLogoRemove = () => {
    setFormData(prev => ({
      ...prev,
      logo: ''
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name.trim()) {
      toast.error('Company name is required')
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/companies/${companyId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          // Clean up empty strings
          industry: formData.industry || null,
          description: formData.description || null,
          location: formData.location || null,
          size: formData.size || null,
          logo: formData.logo || null,
          notes: formData.notes || null,
          links: formData.links || [],
        })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to update company')
      }

      toast.success('Company updated successfully!')
      router.push(`/companies/${companyId}`)
    } catch (error) {
      console.error('Error updating company:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to update company')
    } finally {
      setIsSubmitting(false)
    }
  }

  // ComboBox for Industry
  function IndustryComboBox({ value, onChange }: { value: string; onChange: (val: string) => void }) {
    const [open, setOpen] = useState(false);
    const isDesktop = useMediaQuery("(min-width: 768px)");
    const [selected, setSelected] = useState<string>(value);

    useEffect(() => {
      setSelected(value);
    }, [value]);

    const handleSelect = (val: string) => {
      setSelected(val);
      onChange(val);
      setOpen(false);
    };

    const options = industries.map((industry) => ({ value: industry, label: industry }));

    if (isDesktop) {
      return (
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full justify-start">
              {selected ? <>{selected}</> : <>Select an industry</>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0" align="start">
            <Command>
              <CommandInput placeholder="Filter industry..." />
              <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup>
                  {options.map((option) => (
                    <CommandItem
                      key={option.value}
                      value={option.value}
                      onSelect={() => handleSelect(option.value)}
                    >
                      {option.label}
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
          <Button variant="outline" className="w-full justify-start">
            {selected ? <>{selected}</> : <>Select an industry</>}
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <div className="mt-4 border-t">
            <Command>
              <CommandInput placeholder="Filter industry..." />
              <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup>
                  {options.map((option) => (
                    <CommandItem
                      key={option.value}
                      value={option.value}
                      onSelect={() => handleSelect(option.value)}
                    >
                      {option.label}
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

  // ComboBox for Company Size
  function SizeComboBox({ value, onChange }: { value: string; onChange: (val: string) => void }) {
    const [open, setOpen] = useState(false);
    const isDesktop = useMediaQuery("(min-width: 768px)");
    const [selected, setSelected] = useState<string>(value);

    useEffect(() => {
      setSelected(value);
    }, [value]);

    const handleSelect = (val: string) => {
      setSelected(val);
      onChange(val);
      setOpen(false);
    };

    const options = companySizes.map((size) => ({ value: size, label: size }));

    if (isDesktop) {
      return (
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full justify-start">
              {selected ? <>{selected}</> : <>Select company size</>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0" align="start">
            <Command>
              <CommandInput placeholder="Filter size..." />
              <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup>
                  {options.map((option) => (
                    <CommandItem
                      key={option.value}
                      value={option.value}
                      onSelect={() => handleSelect(option.value)}
                    >
                      {option.label}
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
          <Button variant="outline" className="w-full justify-start">
            {selected ? <>{selected}</> : <>Select company size</>}
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <div className="mt-4 border-t">
            <Command>
              <CommandInput placeholder="Filter size..." />
              <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup>
                  {options.map((option) => (
                    <CommandItem
                      key={option.value}
                      value={option.value}
                      onSelect={() => handleSelect(option.value)}
                    >
                      {option.label}
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Main Content */}
      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex items-center mb-6">
          <Link
            href={`/companies/${companyId}`}
            className="mr-4 p-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeftIcon className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Edit Company
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Update company information
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-card shadow rounded-lg">
            <div className="px-6 py-4 border-b border-border">
              <h2 className="text-lg font-medium text-foreground">Company Information</h2>
            </div>

            <div className="px-6 py-4 space-y-6">
              {/* Company Name */}
              <div className="grid w-full max-w-sm items-center gap-3">
                <Label htmlFor="name">Company Name *</Label>
                <Input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border-border rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm bg-input text-input-foreground"
                  placeholder="Enter company name"
                />
              </div>

              {/* Logo Upload */}
              <ImageUpload
                currentImage={formData.logo || null}
                onImageUpload={handleLogoUpload}
                onImageRemove={handleLogoRemove}
              />

              {/* Industry */}
              <div className="grid w-full max-w-sm items-center gap-3">
                <Label htmlFor="industry">Industry</Label>
                <IndustryComboBox
                  value={formData.industry}
                  onChange={(val) => handleInputChange({ target: { name: "industry", value: val } } as any)}
                />
              </div>

              {/* Location */}
              <div className="grid w-full max-w-sm items-center gap-3">
                <Label htmlFor="location">Location</Label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPinIcon className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <Input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="block w-full pl-10 border-border rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm bg-input text-input-foreground"
                    placeholder="City, State/Country"
                  />
                </div>
              </div>

              {/* Company Size */}
              <div className="grid w-full max-w-sm items-center gap-3">
                <Label htmlFor="size">Company Size</Label>
                <SizeComboBox
                  value={formData.size}
                  onChange={(val) => handleInputChange({ target: { name: "size", value: val } } as any)}
                />
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-foreground">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  value={formData.description}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border-border rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm bg-input text-input-foreground"
                  placeholder="Brief description of the company..."
                />
              </div>

              {/* Notes */}
              <div className="grid w-full max-w-sm items-center gap-3">
                <Label htmlFor="notes">Notes</Label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute top-3 left-0 pl-3 flex items-start pointer-events-none">
                    <DocumentTextIcon className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <textarea
                    id="notes"
                    name="notes"
                    rows={3}
                    value={formData.notes}
                    onChange={handleInputChange}
                    className="block w-full pl-10 border-border rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm bg-input text-input-foreground"
                    placeholder="Additional notes about this company..."
                  />
                </div>
              </div>

              {/* Links Manager */}
              <div>
                <label className="block text-sm font-medium text-foreground">
                  Links
                </label>
                <LinksManager
                  links={formData.links}
                  entityType="company"
                  entityId={companyId}
                  onLinksChange={handleLinksChange}
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3">
            <Link
              href={`/companies/${companyId}`}
              className="px-4 py-2 border border-border rounded-md shadow-sm text-sm font-medium text-foreground bg-card hover:bg-card/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-primary-foreground" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Updating...
                </>
              ) : (
                'Update Company'
              )}
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}
