import * as React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface TagEditDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  value: string
  onValueChange: (val: string) => void
  onTagSaved: (tag: any) => void
  tagId?: string
}

const TAG_COLORS = [
  "#3b82f6", // blue
  "#f59e42", // orange
  "#10b981", // green
  "#f43f5e", // red
  "#6366f1", // indigo
  "#eab308", // yellow
  "#8b5cf6", // violet
  "#14b8a6", // teal
  "#f472b6", // pink
  "#64748b", // slate
]

function getRandomColor() {
  return TAG_COLORS[Math.floor(Math.random() * TAG_COLORS.length)]
}

export const TagEditDialog: React.FC<TagEditDialogProps> = ({
  open,
  onOpenChange,
  value,
  onValueChange,
  onTagSaved,
  tagId,
}) => {
  const [saving, setSaving] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [description, setDescription] = React.useState("")
  const [color, setColor] = React.useState(() => getRandomColor())

  // Populate fields if editing
  React.useEffect(() => {
    if (open && tagId) {
      setSaving(true)
      fetch(`/api/tags/${tagId}`)
        .then(res => res.ok ? res.json() : Promise.reject('Failed to fetch tag'))
        .then(tag => {
          onValueChange(tag.name)
          setDescription(tag.description || "")
          setColor(tag.color || getRandomColor())
        })
        .catch(e => setError(typeof e === 'string' ? e : 'Failed to load tag'))
        .finally(() => setSaving(false))
    } else if (open && !tagId) {
      setDescription("")
      setColor(getRandomColor())
      setError(null)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, tagId])

  const handleSave = async () => {
    if (!value.trim()) return
    setSaving(true)
    setError(null)
    try {
      let res
      if (tagId) {
        res = await fetch(`/api/tags/${tagId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: value.trim(), description, color })
        })
        if (!res.ok) throw new Error('Failed to update tag')
      } else {
        res = await fetch('/api/tags', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: value.trim(), description, color })
        })
        if (!res.ok) throw new Error('Failed to create tag')
      }
      const tag = await res.json()
      onTagSaved(tag)
      onOpenChange(false)
    } catch (e: any) {
      setError(e.message || 'Failed to save tag')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{tagId ? 'Edit Tag' : 'Create New Tag'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="tag-name">Tag Name</Label>
            <Input
              id="tag-name"
              value={value}
              onChange={e => onValueChange(e.target.value)}
              disabled={saving}
              autoFocus
            />
          </div>
          <div>
            <Label htmlFor="tag-description">Description</Label>
            <Input
              id="tag-description"
              value={description}
              onChange={e => setDescription(e.target.value)}
              disabled={saving}
              placeholder="Optional description"
            />
          </div>
          <div>
            <Label htmlFor="tag-color">Color</Label>
            <input
              id="tag-color"
              type="color"
              value={color}
              onChange={e => setColor(e.target.value)}
              disabled={saving}
              className="w-12 h-8 p-0 border-0 bg-transparent"
              title="Choose tag color"
            />
          </div>
          {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
        </div>
        <DialogFooter>
          <Button onClick={handleSave} disabled={saving || !value.trim()}>
            {saving ? (tagId ? 'Saving...' : 'Creating...') : (tagId ? 'Save Changes' : 'Create Tag')}
          </Button>
          <Button variant="secondary" onClick={() => onOpenChange(false)} disabled={saving}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default TagEditDialog
