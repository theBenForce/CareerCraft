import * as React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface TagCreateDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  value: string
  onValueChange: (val: string) => void
  onTagCreated: (tag: any) => void
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

export const TagCreateDialog: React.FC<TagCreateDialogProps> = ({
  open,
  onOpenChange,
  value,
  onValueChange,
  onTagCreated,
}) => {
  const [creating, setCreating] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [description, setDescription] = React.useState("")
  const [color, setColor] = React.useState(() => getRandomColor())

  const handleCreate = async () => {
    if (!value.trim()) return
    setCreating(true)
    setError(null)
    try {
      const res = await fetch('/api/tags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: value.trim(), description, color })
      })
      if (!res.ok) throw new Error('Failed to create tag')
      const tag = await res.json()
      onTagCreated(tag)
      onOpenChange(false)
    } catch (e: any) {
      setError(e.message || 'Failed to create tag')
    } finally {
      setCreating(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Tag</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="new-tag-name">Tag Name</Label>
            <Input
              id="new-tag-name"
              value={value}
              onChange={e => onValueChange(e.target.value)}
              disabled={creating}
              autoFocus
            />
          </div>
          <div>
            <Label htmlFor="new-tag-description">Description</Label>
            <Input
              id="new-tag-description"
              value={description}
              onChange={e => setDescription(e.target.value)}
              disabled={creating}
              placeholder="Optional description"
            />
          </div>
          <div>
            <Label htmlFor="new-tag-color">Color</Label>
            <input
              id="new-tag-color"
              type="color"
              value={color}
              onChange={e => setColor(e.target.value)}
              disabled={creating}
              className="w-12 h-8 p-0 border-0 bg-transparent"
              title="Choose tag color"
            />
          </div>
          {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
        </div>
        <DialogFooter>
          <Button onClick={handleCreate} disabled={creating || !value.trim()}>
            {creating ? 'Creating...' : 'Create Tag'}
          </Button>
          <Button variant="secondary" onClick={() => onOpenChange(false)} disabled={creating}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default TagCreateDialog
