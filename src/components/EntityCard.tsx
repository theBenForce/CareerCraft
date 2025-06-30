import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { PencilIcon } from '@heroicons/react/24/outline'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { TagList } from '@/components/TagComponent'

interface EntityProperty {
  icon?: React.ReactNode
  text: string
  href?: string
}

interface EntityCardProps {
  id: string | number
  name: string
  subtitle?: string
  image?: string
  imageAlt?: string
  fallbackIcon?: React.ReactNode
  fallbackText?: string
  properties: EntityProperty[]
  tags?: any[]
  viewPath: string
  editPath: string
  imageType?: 'avatar' | 'logo'
}

export function EntityCard({
  id,
  name,
  subtitle,
  image,
  imageAlt,
  fallbackIcon,
  fallbackText,
  properties,
  tags = [],
  viewPath,
  editPath,
  imageType = 'avatar'
}: EntityCardProps) {
  const renderImage = () => {
    if (imageType === 'avatar') {
      return (
        <Avatar className="w-16 h-16">
          <AvatarImage src={image} alt={imageAlt || name} />
          <AvatarFallback>
            {fallbackText || name.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      )
    }

    // Logo type
    if (image) {
      return (
        <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted flex items-center justify-center">
          <Image
            src={image}
            alt={imageAlt || `${name} logo`}
            width={48}
            height={48}
            className="object-contain"
          />
        </div>
      )
    }

    return (
      <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
        {fallbackIcon || (fallbackText && (
          <span className="text-muted-foreground font-medium">
            {fallbackText}
          </span>
        ))}
      </div>
    )
  }

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          {/* Entity Image */}
          <div className="flex-shrink-0">
            {renderImage()}
          </div>

          {/* Entity Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <Link
                  href={viewPath}
                  className="hover:text-primary transition-colors"
                >
                  <h3 className="text-lg font-medium text-foreground truncate">
                    {name}
                  </h3>
                </Link>
                {subtitle && (
                  <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                    {subtitle}
                  </p>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="ml-2 flex-shrink-0 p-2"
              >
                <Link href={editPath}>
                  <PencilIcon className="h-4 w-4" />
                  <span className="sr-only">Edit {name}</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Properties */}
        {properties.length > 0 && (
          <div className="mt-4 space-y-2">
            {properties.map((property, index) => (
              <div key={index} className="flex items-center text-sm text-muted-foreground">
                {property.icon && (
                  <div className="flex-shrink-0 mr-2 h-4 w-4">
                    {property.icon}
                  </div>
                )}
                {property.href ? (
                  <a
                    href={property.href}
                    target={property.href.startsWith('http') ? '_blank' : undefined}
                    rel={property.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="text-primary hover:underline truncate"
                  >
                    {property.text}
                  </a>
                ) : (
                  <span className="truncate">{property.text}</span>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Tags */}
        {tags.length > 0 && (
          <div className="mt-4">
            <TagList tags={tags} maxDisplay={3} />
          </div>
        )}
      </CardContent>
    </Card>
  )
}
