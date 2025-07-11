import * as React from "react"
import { Tag } from "@prisma/client"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
  CommandEmpty,
} from "@/components/ui/command"
import { XMarkIcon, PlusIcon } from "@heroicons/react/24/outline"
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer'
import { useMediaQuery } from '@/hooks/use-media-query'
import { Button } from "@/components/ui/button"
import TagCreateDialog from '@/components/ui/tag-create-dialog'

export interface TagSelectProps {
  availableTags: Tag[]
  selectedTags: Tag[]
  onChange: (tags: Tag[]) => void
  placeholder?: string
  disabled?: boolean
  className?: string
}

export const TagSelect: React.FC<TagSelectProps> = ({
  availableTags,
  selectedTags,
  onChange,
  placeholder = "Select or type to add tags...",
  disabled = false,
  className = "",
}) => {
  const [open, setOpen] = React.useState(false)
  const [input, setInput] = React.useState("")
  const [showCreateDialog, setShowCreateDialog] = React.useState(false)
  const isDesktop = useMediaQuery('(min-width: 768px)')

  // Filter tags based on input and exclude already selected
  const filteredTags = availableTags.filter(
    (tag) =>
      tag.name.toLowerCase().includes(input.toLowerCase()) &&
      !selectedTags.some((t) => t.id === tag.id)
  )

  const handleSelect = (tag: Tag) => {
    if (!selectedTags.some((t) => t.id === tag.id)) {
      onChange([...selectedTags, tag])
      setInput("")
      setOpen(false)
    }
  }

  const handleRemove = (tag: Tag) => {
    onChange(selectedTags.filter((t) => t.id !== tag.id))
  }

  const tagExists = !!availableTags.find(
    (tag) => tag.name.toLowerCase() === input.trim().toLowerCase()
  )
  const canCreate = input.trim().length > 0 && !tagExists

  const handleTagCreated = (tag: Tag) => {
    onChange([...selectedTags, tag])
    setInput("")
    setShowCreateDialog(false)
    setOpen(false)
  }

  return (
    <div className={`w-full ${className}`}>
      <div className="border border-gray-300 rounded-md bg-transparent p-2">
        <div className="flex flex-wrap gap-2 items-center mb-2">
          {selectedTags.map((tag) => (
            <Badge
              key={tag.id}
              className="flex items-center gap-1"
              style={{ backgroundColor: tag.color || '#3b82f6', color: '#fff' }}
            >
              {tag.name}
              <button
                type="button"
                aria-label={`Remove tag ${tag.name}`}
                className="ml-1 focus:outline-none"
                onClick={() => handleRemove(tag)}
                tabIndex={-1}
                style={{ color: 'rgba(255,255,255,0.7)' }}
              >
                <XMarkIcon className="w-4 h-4 hover:text-white" />
              </button>
            </Badge>
          ))}
          {isDesktop ? (
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="secondary"
                  size="icon"
                  className="size-8 ml-1"
                  aria-label="Add tag"
                  onClick={() => setOpen(true)}
                  disabled={disabled}
                  type="button"
                >
                  <PlusIcon className="w-5 h-5" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="p-0 w-full min-w-[220px]">
                <Command>
                  <CommandInput
                    value={input}
                    onValueChange={setInput}
                    placeholder="Search tags..."
                    autoFocus
                  />
                  <CommandList>
                    {filteredTags.length === 0 ? (
                      <CommandEmpty>No tags found.</CommandEmpty>
                    ) : (
                      filteredTags.map((tag) => (
                        <CommandItem
                          key={tag.id}
                          onSelect={() => handleSelect(tag)}
                          className="cursor-pointer"
                        >
                          {tag.name}
                        </CommandItem>
                      ))
                    )}
                    {canCreate && (
                      <div className="p-2">
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={() => setShowCreateDialog(true)}
                        >
                          <PlusIcon className="w-4 h-4 mr-2" />Create tag &quot;{input.trim()}&quot;
                        </Button>
                      </div>
                    )}
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          ) : (
            <Drawer open={open} onOpenChange={setOpen}>
              <DrawerTrigger asChild>
                <Button
                  variant="secondary"
                  size="icon"
                  className="size-8 ml-1"
                  aria-label="Add tag"
                  onClick={() => setOpen(true)}
                  disabled={disabled}
                  type="button"
                >
                  <PlusIcon className="w-5 h-5" />
                </Button>
              </DrawerTrigger>
              <DrawerContent>
                <div className="mt-4 border-t">
                  <Command>
                    <CommandInput
                      value={input}
                      onValueChange={setInput}
                      placeholder="Search tags..."
                      autoFocus
                    />
                    <CommandList>
                      {filteredTags.length === 0 ? (
                        <CommandEmpty>No tags found.</CommandEmpty>
                      ) : (
                        filteredTags.map((tag) => (
                          <CommandItem
                            key={tag.id}
                            onSelect={() => handleSelect(tag)}
                            className="cursor-pointer"
                          >
                            {tag.name}
                          </CommandItem>
                        ))
                      )}
                      {canCreate && (
                        <div className="p-2">
                          <Button
                            variant="outline"
                            className="w-full"
                            onClick={() => setShowCreateDialog(true)}
                          >
                            <PlusIcon className="w-4 h-4 mr-2" />Create tag &quot;{input.trim()}&quot;
                          </Button>
                        </div>
                      )}
                    </CommandList>
                  </Command>
                </div>
              </DrawerContent>
            </Drawer>
          )}
        </div>
      </div>
      {/* Tag creation dialog */}
      <TagCreateDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        value={input.trim()}
        onValueChange={setInput}
        onTagCreated={handleTagCreated}
      />
    </div>
  )
}

export default TagSelect
