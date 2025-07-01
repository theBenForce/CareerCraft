import React from 'react'
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
  onView?: () => void
  onEdit?: () => void
  imageType?: 'avatar' | 'logo'
  imageSize?: 'small' | 'medium' | 'large'
  createdAt?: string | Date
  updatedAt?: string | Date
  children?: React.ReactNode
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
  onView,
  onEdit,
  imageType = 'avatar',
  imageSize = 'medium',
  createdAt,
  updatedAt,
  children
}: EntityCardProps) {
  const renderImage = () => {
    const sizeClasses = {
      small: 'w-12 h-12',
      medium: 'w-16 h-16',
      large: 'w-32 h-32'
    }
    
    const iconSizes = {
      small: 'w-6 h-6',
      medium: 'w-8 h-8', 
      large: 'w-16 h-16'
    }

    if (imageType === 'avatar') {
      return (
        <Avatar className={`${sizeClasses[imageSize]} ${imageSize === 'large' ? 'rounded-full border-4 border-primary/20' : ''}`}>
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
        <div className={`${sizeClasses[imageSize]} rounded-lg overflow-hidden bg-muted flex items-center justify-center`}>
          <Image
            src={image}
            alt={imageAlt || `${name} logo`}
            width={imageSize === 'large' ? 128 : imageSize === 'medium' ? 64 : 48}
            height={imageSize === 'large' ? 128 : imageSize === 'medium' ? 64 : 48}
            className="object-contain"
          />
        </div>
      )
    }

    return (
      <div className={`${sizeClasses[imageSize]} rounded-lg bg-muted flex items-center justify-center`}>
        {fallbackIcon ? (
          <div className={iconSizes[imageSize]}>
            {fallbackIcon}
          </div>
        ) : (fallbackText && (
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
        {imageSize === 'large' ? (
          // Large image layout - center everything
          <div className="flex flex-col items-center">
            {/* Entity Image */}
            <div className="flex-shrink-0 mb-4">
              {renderImage()}
            </div>

            {/* Entity Info */}
            <div className="w-full">
              <div className="flex items-center justify-between mb-4">
                <div className="flex-1 text-center">
                  {onView ? (
                    <button
                      onClick={onView}
                      className="hover:text-primary transition-colors"
                    >
                      <h1 className="text-2xl font-bold tracking-tight text-foreground">
                        {name}
                      </h1>
                    </button>
                  ) : (
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">
                      {name}
                    </h1>
                  )}
                  {subtitle && (
                    <p className="mt-1 text-lg font-semibold text-muted-foreground">
                      {subtitle}
                    </p>
                  )}
                </div>
                {onEdit && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onEdit}
                    className="ml-2 flex-shrink-0 p-2"
                  >
                    <PencilIcon className="h-4 w-4" />
                    <span className="sr-only">Edit {name}</span>
                  </Button>
                )}
              </div>

              {/* Properties */}
              {properties.length > 0 && (
                <div className="flex flex-wrap gap-x-6 gap-y-2 justify-center mb-4">
                  {properties.map((property, index) => (
                    <div key={index} className="flex items-center text-sm text-muted-foreground">
                      {property.icon && (
                        <div className="flex-shrink-0 mr-2 h-5 w-5">
                          {property.icon}
                        </div>
                      )}
                      {property.href ? (
                        <a
                          href={property.href}
                          target={property.href.startsWith('http') ? '_blank' : undefined}
                          rel={property.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                          className="text-primary hover:underline"
                        >
                          {property.text}
                        </a>
                      ) : (
                        <span>{property.text}</span>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Children Content */}
              {children && (
                <div className="mb-4">
                  {children}
                </div>
              )}

              {/* Tags */}
              {tags.length > 0 && (
                <div className="mb-4">
                  <div className="flex flex-wrap gap-1 justify-center">
                    <TagList tags={tags} maxDisplay={6} />
                  </div>
                </div>
              )}

              {/* Created/Updated Info */}
              {(createdAt || updatedAt) && (
                <div className="text-xs text-muted-foreground text-center">
                  {createdAt && (
                    <>
                      Joined {new Date(createdAt).toLocaleDateString()}
                      {updatedAt && <br />}
                    </>
                  )}
                  {updatedAt && (
                    <>Last updated {new Date(updatedAt).toLocaleDateString()}</>
                  )}
                </div>
              )}
            </div>
          </div>
        ) : (
          // Regular layout for small/medium images
          <div className="flex items-start space-x-4">
            {/* Entity Image */}
            <div className="flex-shrink-0">
              {renderImage()}
            </div>

            {/* Entity Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  {onView ? (
                    <button
                      onClick={onView}
                      className="hover:text-primary transition-colors"
                    >
                      <h3 className="text-lg font-medium text-foreground truncate">
                        {name}
                      </h3>
                    </button>
                  ) : (
                    <h3 className="text-lg font-medium text-foreground truncate">
                      {name}
                    </h3>
                  )}
                  {subtitle && (
                    <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                      {subtitle}
                    </p>
                  )}
                </div>
                {onEdit && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onEdit}
                    className="ml-2 flex-shrink-0 p-2"
                  >
                    <PencilIcon className="h-4 w-4" />
                    <span className="sr-only">Edit {name}</span>
                  </Button>
                )}
              </div>

              {/* Properties */}
              {properties.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
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

              {/* Children Content */}
              {children && (
                <div className="mt-4">
                  {children}
                </div>
              )}

              {/* Tags */}
              {tags.length > 0 && (
                <div className="mt-4">
                  <TagList tags={tags} maxDisplay={3} />
                </div>
              )}

              {/* Created/Updated Info */}
              {(createdAt || updatedAt) && (
                <div className="mt-4 text-xs text-muted-foreground">
                  {createdAt && (
                    <>
                      Created {new Date(createdAt).toLocaleDateString()}
                      {updatedAt && ' • '}
                    </>
                  )}
                  {updatedAt && (
                    <>Updated {new Date(updatedAt).toLocaleDateString()}</>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
