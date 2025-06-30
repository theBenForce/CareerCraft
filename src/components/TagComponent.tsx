import React from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { Tag } from '@/types';

interface TagComponentProps {
  tag: Tag;
  onRemove?: () => void;
  removable?: boolean;
  clickable?: boolean;
}

export function TagComponent({ tag, onRemove, removable = false, clickable = true }: TagComponentProps) {
  const badgeContent = (
    <Badge
      variant="secondary"
      className="flex items-center gap-1 text-xs"
      style={{
        backgroundColor: tag.color ? `${tag.color}20` : undefined,
        borderColor: tag.color || undefined,
        color: tag.color || undefined,
      }}
    >
      {tag.name}
      {removable && onRemove && (
        <button
          onClick={onRemove}
          className="ml-1 hover:bg-red-100 rounded-full p-0.5"
          type="button"
          title="Remove tag"
          aria-label="Remove tag"
        >
          <X size={10} />
        </button>
      )}
    </Badge>
  );

  if (clickable && !removable) {
    return (
      <Link href={`/tags/${tag.id}`} className="hover:opacity-80 transition-opacity">
        {badgeContent}
      </Link>
    );
  }

  return badgeContent;
}

interface TagListProps {
  tags: Tag[];
  onRemove?: (tagId: number) => void;
  removable?: boolean;
  maxDisplay?: number;
  clickable?: boolean;
}

export function TagList({ tags, onRemove, removable = false, maxDisplay, clickable = true }: TagListProps) {
  const displayTags = maxDisplay ? tags.slice(0, maxDisplay) : tags;
  const remainingCount = maxDisplay && tags.length > maxDisplay ? tags.length - maxDisplay : 0;

  return (
    <div className="flex flex-wrap gap-1">
      {displayTags.map((tag) => (
        <TagComponent
          key={tag.id}
          tag={tag}
          onRemove={onRemove ? () => onRemove(tag.id) : undefined}
          removable={removable}
          clickable={clickable}
        />
      ))}
      {remainingCount > 0 && (
        <Badge variant="outline" className="text-xs">
          +{remainingCount} more
        </Badge>
      )}
    </div>
  );
}
