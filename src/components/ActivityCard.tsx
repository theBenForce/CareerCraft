import Link from 'next/link'
import {
  CalendarDaysIcon,
  BuildingOfficeIcon,
  UserGroupIcon,
  ClockIcon
} from '@heroicons/react/24/outline'
import { TagList } from './TagComponent'
import { EntityCard } from './EntityCard'
import ActivityIcon from './ActivityIcon'

interface Contact {
  id: number
  firstName: string
  lastName: string
  email: string
  position?: string
}

interface Company {
  id: number
  name: string
}

interface JobApplication {
  id: number
  position: string
}

interface Tag {
  id: number
  name: string
  color?: string
  description?: string
  createdAt: Date
  updatedAt: Date
  userId: number
}

interface ActivityTag {
  id: number
  activityId: number
  tagId: number
  tag: Tag
}

interface Activity {
  id: number
  type: string
  title?: string
  subject: string
  description?: string
  date: string
  duration?: number
  note?: string
  followUpDate?: string
  company?: Company
  jobApplication?: JobApplication
  contacts?: Contact[]
  activityTags?: ActivityTag[]
  createdAt: string
  updatedAt: string
}
interface ActivityCardProps {
  item: Activity
  showTimeline?: boolean
  isLast?: boolean
}

export default function ActivityCard({ item, showTimeline = false, isLast = false }: ActivityCardProps) {
  const formatActivityType = (type: string) => {
    const upperType = type.toUpperCase()
    switch (upperType) {
      case 'PHONE_CALL':
        return 'Phone Call'
      case 'NETWORKING_EVENT':
        return 'Networking Event'
      case 'COFFEE_CHAT':
        return 'Coffee Chat'
      case 'FOLLOW_UP':
        return 'Follow Up'
      case 'LINKEDIN_MESSAGE':
        return 'LinkedIn Message'
      default:
        // Convert underscores to spaces and capitalize each word
        return upperType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 1) {
      return 'Yesterday'
    } else if (diffDays <= 7) {
      return `${diffDays} days ago`
    } else {
      return date.toLocaleDateString()
    }
  }

  // Get display properties based on item type
  const isNote = item.type === 'NOTE'
  const displayDate = isNote ? item.createdAt! : item.date!
  const displayType = isNote ? 'NOTE' : item.type!
  const displaySubject = isNote ? item.title! : item.subject!
  const displayDescription = isNote ? item.note! : item.description

  if (showTimeline) {
    // Timeline format for contact detail page
    return (
      <li>
        <div className="relative pb-8">
          {!isLast && (
            <span
              className="absolute top-5 left-4 -ml-px h-full w-0.5 bg-border"
              aria-hidden="true"
            />
          )}
          <div className="relative flex space-x-3">
            <div className="relative z-20">
              <div className="h-8 w-8 rounded-full flex items-center justify-center ring-4 ring-background bg-background">
                <ActivityIcon type={displayType} size="md" withBackground={true} />
              </div>
            </div>
            <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
              <div>
                <p className="text-sm text-foreground">
                  <Link
                    href={`/activities/${item.id}`}
                    className="text-primary hover:text-primary/80 hover:underline font-medium"
                  >
                    {displaySubject}
                  </Link>
                </p>
                {displayDescription && (
                  <p className="mt-1 text-sm text-muted-foreground">
                    {displayDescription}
                  </p>
                )}
                {!isNote && item.note && (
                  <p className="mt-1 text-sm text-foreground">
                    <span className="font-medium">Note:</span> {item.note}
                  </p>
                )}
                {!isNote && item.duration && (
                  <p className="mt-1 text-sm text-muted-foreground">
                    Duration: {item.duration} minutes
                  </p>
                )}
                {!isNote && item.followUpDate && (
                  <p className="mt-1 text-sm text-amber-600">
                    <CalendarDaysIcon className="w-4 h-4 inline mr-1" />
                    Follow up: {new Date(item.followUpDate).toLocaleDateString()}
                  </p>
                )}
                {!isNote && item.company && (
                  <p className="mt-1 text-sm text-muted-foreground">
                    <BuildingOfficeIcon className="w-4 h-4 inline mr-1" />
                    {item.company.name}
                  </p>
                )}
                {!isNote && item.jobApplication && (
                  <p className="mt-1 text-sm text-muted-foreground">
                    Related to: {item.jobApplication.position}
                  </p>
                )}
                {!isNote && item.contacts && item.contacts.length > 0 && (
                  <div className="mt-1 text-sm text-muted-foreground">
                    <UserGroupIcon className="w-4 h-4 inline mr-1" />
                    {item.contacts.map((contact, index) => (
                      <span key={contact.id}>
                        <Link
                          href={`/contacts/${contact.id}`}
                          className="text-primary hover:text-primary/80"
                        >
                          {contact.firstName} {contact.lastName}
                        </Link>
                        {index < (item.contacts?.length || 0) - 1 && ', '}
                      </span>
                    ))}
                  </div>
                )}
                {!isNote && item.activityTags && item.activityTags.length > 0 && (
                  <div className="mt-2">
                    <TagList
                      tags={item.activityTags.map(at => at.tag)}
                      maxDisplay={3}
                    />
                  </div>
                )}
              </div>
              <div className="text-right text-sm whitespace-nowrap text-muted-foreground">
                <time dateTime={displayDate}>
                  {formatDate(displayDate)}
                </time>
                <p className="mt-1">
                  {new Date(displayDate).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </li>
    )
  }

  // Card format for activities page (only for activities, not notes)
  if (isNote) {
    // Notes don't have a card format, return null or a simple display
    return null
  }

  // Prepare properties for EntityCard
  const properties = []

  // Date and time
  properties.push({
    icon: <CalendarDaysIcon className="w-4 h-4" />,
    text: `${new Date(displayDate).toLocaleDateString()} at ${new Date(displayDate).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    })}`
  })

  // Duration
  if (item.duration) {
    properties.push({
      icon: <ClockIcon className="w-4 h-4" />,
      text: `${item.duration} minutes`
    })
  }

  // Company
  if (item.company) {
    properties.push({
      icon: <BuildingOfficeIcon className="w-4 h-4" />,
      text: item.company.name,
      href: `/companies/${item.company.id}`
    })
  }

  // Contacts
  if (item.contacts && item.contacts.length > 0) {
    const contactsText = item.contacts.map(contact => `${contact.firstName} ${contact.lastName}`).join(', ')
    properties.push({
      icon: <UserGroupIcon className="w-4 h-4" />,
      text: `Contacts: ${contactsText}`
    })
  }

  // Note
  if (item.note) {
    properties.push({
      text: `Note: ${item.note}`
    })
  }

  // Follow up date
  if (item.followUpDate) {
    properties.push({
      icon: <CalendarDaysIcon className="w-4 h-4" />,
      text: `Follow up: ${new Date(item.followUpDate).toLocaleDateString()}`
    })
  }

  // Job application
  if (item.jobApplication) {
    properties.push({
      text: `Related to: ${item.jobApplication.position}`
    })
  }

  return (
    <EntityCard
      id={item.id!}
      name={displaySubject}
      subtitle={displayDescription}
      fallbackIcon={<ActivityIcon type={displayType} size="md" />}
      fallbackText={formatActivityType(displayType)}
      properties={properties}
      tags={item.activityTags?.map(at => at.tag) || []}
      viewPath={`/activities/${item.id}`}
      editPath={`/activities/${item.id}/edit`}
      imageType="logo"
    />
  )
}
