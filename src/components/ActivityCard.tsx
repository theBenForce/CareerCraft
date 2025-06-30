import Link from 'next/link'
import {
  EnvelopeIcon,
  PhoneArrowUpRightIcon,
  VideoCameraIcon,
  DocumentTextIcon,
  ChatBubbleLeftEllipsisIcon,
  CalendarDaysIcon,
  BuildingOfficeIcon,
  UserGroupIcon,
  ClockIcon,
  UserIcon
} from '@heroicons/react/24/outline'
import { TagList } from './TagComponent'
import { EntityCard } from './EntityCard'

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

interface Note {
  id: number
  title: string
  content: string
  tags?: string
  createdAt: string
  updatedAt: string
  userId: number
}

interface TimelineItem extends Partial<Activity>, Partial<Note> {
  itemType: 'activity' | 'note'
}

interface ActivityCardProps {
  item: TimelineItem
  showTimeline?: boolean
  isLast?: boolean
}

export default function ActivityCard({ item, showTimeline = false, isLast = false }: ActivityCardProps) {
  const getActivityIcon = (type: string) => {
    switch (type.toUpperCase()) {
      case 'EMAIL':
        return <EnvelopeIcon className="w-5 h-5" />
      case 'PHONE_CALL':
        return <PhoneArrowUpRightIcon className="w-5 h-5" />
      case 'MEETING':
        return <CalendarDaysIcon className="w-5 h-5" />
      case 'NOTE':
        return <DocumentTextIcon className="w-5 h-5" />
      case 'APPLICATION':
        return <DocumentTextIcon className="w-5 h-5" />
      case 'INTERVIEW':
        return <VideoCameraIcon className="w-5 h-5" />
      case 'NETWORKING_EVENT':
        return <UserGroupIcon className="w-5 h-5" />
      case 'COFFEE_CHAT':
        return <ChatBubbleLeftEllipsisIcon className="w-5 h-5" />
      case 'FOLLOW_UP':
        return <ClockIcon className="w-5 h-5" />
      case 'REFERRAL':
        return <UserIcon className="w-5 h-5" />
      case 'LINKEDIN_MESSAGE':
        return <ChatBubbleLeftEllipsisIcon className="w-5 h-5" />
      case 'RESEARCH':
        return <DocumentTextIcon className="w-5 h-5" />
      default:
        return <ChatBubbleLeftEllipsisIcon className="w-5 h-5" />
    }
  }

  const getActivityIconColor = (type: string) => {
    switch (type.toUpperCase()) {
      case 'EMAIL':
        return 'text-blue-600 bg-blue-100'
      case 'PHONE_CALL':
        return 'text-green-600 bg-green-100'
      case 'MEETING':
        return 'text-purple-600 bg-purple-100'
      case 'NOTE':
        return 'text-gray-600 bg-gray-100'
      case 'APPLICATION':
        return 'text-orange-600 bg-orange-100'
      case 'INTERVIEW':
        return 'text-indigo-600 bg-indigo-100'
      case 'NETWORKING_EVENT':
        return 'text-pink-600 bg-pink-100'
      case 'COFFEE_CHAT':
        return 'text-amber-600 bg-amber-100'
      case 'FOLLOW_UP':
        return 'text-yellow-600 bg-yellow-100'
      case 'REFERRAL':
        return 'text-emerald-600 bg-emerald-100'
      case 'LINKEDIN_MESSAGE':
        return 'text-cyan-600 bg-cyan-100'
      case 'RESEARCH':
        return 'text-slate-600 bg-slate-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

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
  const isNote = item.itemType === 'note'
  const displayDate = isNote ? item.createdAt! : item.date!
  const displayType = isNote ? 'NOTE' : item.type!
  const displaySubject = isNote ? item.title! : item.subject!
  const displayDescription = isNote ? item.content! : item.description

  if (showTimeline) {
    // Timeline format for contact detail page
    return (
      <li>
        <div className="relative pb-8">
          {!isLast && (
            <span
              className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
              aria-hidden="true"
            />
          )}
          <div className="relative flex space-x-3">
            <div>
              <span
                className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${getActivityIconColor(
                  displayType
                )}`}
              >
                {getActivityIcon(displayType)}
              </span>
            </div>
            <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
              <div>
                <p className="text-sm text-gray-900">
                  <span className="font-medium">
                    {formatActivityType(displayType)}:
                  </span>{' '}
                  {isNote ? (
                    <span>{displaySubject}</span>
                  ) : (
                    <Link
                      href={`/activities/${item.id}`}
                      className="text-blue-600 hover:text-blue-500 hover:underline"
                    >
                      {displaySubject}
                    </Link>
                  )}
                </p>
                {displayDescription && (
                  <p className="mt-1 text-sm text-gray-500">
                    {displayDescription}
                  </p>
                )}
                {!isNote && item.note && (
                  <p className="mt-1 text-sm text-gray-600">
                    <span className="font-medium">Note:</span> {item.note}
                  </p>
                )}
                {!isNote && item.duration && (
                  <p className="mt-1 text-sm text-gray-500">
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
                  <p className="mt-1 text-sm text-gray-500">
                    <BuildingOfficeIcon className="w-4 h-4 inline mr-1" />
                    {item.company.name}
                  </p>
                )}
                {!isNote && item.jobApplication && (
                  <p className="mt-1 text-sm text-gray-500">
                    Related to: {item.jobApplication.position}
                  </p>
                )}
                {!isNote && item.contacts && item.contacts.length > 0 && (
                  <div className="mt-1 text-sm text-gray-500">
                    <UserGroupIcon className="w-4 h-4 inline mr-1" />
                    {item.contacts.map((contact, index) => (
                      <span key={contact.id}>
                        <Link
                          href={`/contacts/${contact.id}`}
                          className="text-blue-600 hover:text-blue-500"
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
                {isNote && item.tags && (
                  <p className="mt-1 text-sm text-gray-500">
                    Tags: {item.tags}
                  </p>
                )}
              </div>
              <div className="text-right text-sm whitespace-nowrap text-gray-500">
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
      fallbackIcon={getActivityIcon(displayType)}
      fallbackText={formatActivityType(displayType)}
      properties={properties}
      tags={item.activityTags?.map(at => at.tag) || []}
      viewPath={`/activities/${item.id}`}
      editPath={`/activities/${item.id}/edit`}
      imageType="logo"
    />
  )
}
