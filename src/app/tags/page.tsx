'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { PlusIcon, TagIcon } from '@heroicons/react/24/outline'
import { Button } from '@/components/ui/button'
import Header from '@/components/layout/Header'

export default function TagsPage() {
  const [tags, setTags] = useState<any[]>([])
  const [filter, setFilter] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTags = async () => {
      setLoading(true)
      try {
        const res = await fetch('/api/tags')
        if (!res.ok) throw new Error('Failed to fetch tags')
        const data = await res.json()
        setTags(data)
      } catch (error) {
        setTags([])
      } finally {
        setLoading(false)
      }
    }
    fetchTags()
  }, [])

  const filteredTags = filter
    ? tags.filter((tag: any) => tag.name.toLowerCase().includes(filter.toLowerCase()))
    : tags

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Page Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Tags</h1>
          </div>
          <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <Link href="/tags/new">
              <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
              New Tag
            </Link>
          </Button>
        </div>

        {/* Filter Input */}
        <div className="mb-6">
          <input
            type="text"
            value={filter}
            onChange={e => setFilter(e.target.value)}
            placeholder="Filter tags by name..."
            className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:border-primary"
            aria-label="Filter tags"
          />
        </div>

        {loading ? (
          <div className="text-center py-12 text-muted-foreground">Loading...</div>
        ) : filteredTags.length === 0 ? (
          /* Empty State */
          <div className="text-center py-12">
            <TagIcon className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-2 text-sm font-medium text-foreground">No tags</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Get started by adding your first tag.
            </p>
            <div className="mt-6">
              <Button asChild>
                <Link href="/tags/new">
                  <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                  Add Tag
                </Link>
              </Button>
            </div>
          </div>
        ) : (
          <div className="bg-card shadow rounded-lg overflow-hidden border border-border">
            <table className="min-w-full divide-y divide-border">
              <thead className="bg-muted">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Contacts
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Activities
                  </th>
                </tr>
              </thead>
              <tbody className="bg-card divide-y divide-border">
                {filteredTags.map((tag: any) => (
                  <tr key={tag.id} className="hover:bg-muted/50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link href={`/tags/${tag.id}`} className="text-sm font-medium text-foreground hover:text-primary flex items-center gap-2">
                        <span
                          className={`inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary/20 ring-2 ${tag.color ? `ring-[${tag.color}]` : 'ring-primary'}`}
                          aria-label={tag.name + ' color'}
                        >
                          <TagIcon className="w-4 h-4" style={tag.color ? { color: tag.color } : {}} />
                        </span>
                        {tag.name}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-muted-foreground truncate max-w-xs">{tag.description || '-'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-primary">{tag._count?.contacts ?? 0}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-primary">{tag._count?.activity ?? 0}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
