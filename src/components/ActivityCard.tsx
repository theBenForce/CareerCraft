import Link from 'next/link'
import {
  EnvelopeIcon,
  PhoneArrowUpRightIcon,
  VideoCameraIcon,
  DocumentTextIcon,
  ChatBubbleLeftEllipsisIcon,
  CalendarDaysIcon,
  BuildingOfficeIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline'

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

interface Activity {
  id: number
  type: string
  subject: string
  description?: string
  date: string
  duration?: number
  outcome?: string
  followUpDate?: string
  company?: Company
  jobApplication?: JobApplication
  contacts?: Contact[]
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
    switch (type) {
      case 'email':
        return <EnvelopeIcon className="w-5 h-5" />
      case 'call':
        return <PhoneArrowUpRightIcon className="w-5 h-5" />
      case 'meeting':
        return <VideoCameraIcon className="w-5 h-5" />
      case 'note':
        return <DocumentTextIcon className="w-5 h-5" />
      case 'application':
        return <DocumentTextIcon className="w-5 h-5" />
      case 'interview':
        return <VideoCameraIcon className="w-5 h-5" />
      default:
        return <ChatBubbleLeftEllipsisIcon className="w-5 h-5" />
    }
  }

  const getActivityIconColor = (type: string) => {
    switch (type) {
      case 'email':
        return 'text-blue-600 bg-blue-100'
      case 'call':
        return 'text-green-600 bg-green-100'
      case 'meeting':
        return 'text-purple-600 bg-purple-100'
      case 'note':
        return 'text-gray-600 bg-gray-100'
      case 'application':
        return 'text-orange-600 bg-orange-100'
      case 'interview':
        return 'text-indigo-600 bg-indigo-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const formatActivityType = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1)
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
  const displayType = isNote ? 'note' : item.type!
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
                {!isNote && item.outcome && (
                  <p className="mt-1 text-sm text-gray-600">
                    <span className="font-medium">Outcome:</span> {item.outcome}
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

  return (
    <li>
      <div className="px-4 py-4 sm:px-6 hover:bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center">
              <span
                className={`h-8 w-8 rounded-full flex items-center justify-center ${getActivityIconColor(
                  displayType
                )}`}
              >
                {getActivityIcon(displayType)}
              </span>
              <div className="ml-3">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getActivityIconColor(displayType).replace('bg-', 'bg-').replace('text-', 'text-')}`}>
                  {displayType}
                </span>
                <Link
                  href={`/activities/${item.id}`}
                  className="ml-2 text-lg font-medium text-gray-900 hover:text-blue-600 hover:underline inline"
                >
                  {displaySubject}
                </Link>
              </div>
            </div>

            {displayDescription && (
              <p className="mt-2 text-sm text-gray-600">{displayDescription}</p>
            )}

            <div className="mt-2 flex items-center text-sm text-gray-500 space-x-4">
              <div className="flex items-center">
                <CalendarDaysIcon className="w-4 h-4 mr-1" />
                {new Date(displayDate).toLocaleDateString()}
                <span className="ml-2">
                  {new Date(displayDate).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>

              {item.duration && (
                <div className="flex items-center">
                  <span>{item.duration} min</span>
                </div>
              )}

              {item.company && (
                <div className="flex items-center">
                  <BuildingOfficeIcon className="w-4 h-4 mr-1" />
                  <Link
                    href={`/companies/${item.company.id}`}
                    className="text-blue-600 hover:text-blue-500"
                  >
                    {item.company.name}
                  </Link>
                </div>
              )}
            </div>

            {/* Contacts */}
            {item.contacts && item.contacts.length > 0 && (
              <div className="mt-2 flex items-center text-sm text-gray-500">
                <UserGroupIcon className="w-4 h-4 mr-1" />
                <span className="mr-1">Contacts:</span>
                <div className="flex flex-wrap gap-1">
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
              </div>
            )}

            {item.outcome && (
              <div className="mt-2">
                <span className="text-sm font-medium text-gray-600">Outcome: </span>
                <span className="text-sm text-gray-600">{item.outcome}</span>
              </div>
            )}

            {item.followUpDate && (
              <div className="mt-2 text-sm text-amber-600">
                <CalendarDaysIcon className="w-4 h-4 inline mr-1" />
                Follow up: {new Date(item.followUpDate).toLocaleDateString()}
              </div>
            )}

            {item.jobApplication && (
              <div className="mt-2 text-sm text-gray-500">
                Related to: {item.jobApplication.position}
              </div>
            )}
          </div>

          <div className="ml-4 flex-shrink-0">
            <Link
              href={`/activities/${item.id}`}
              className="text-blue-600 hover:text-blue-500 text-sm font-medium"
            >
              View Details
            </Link>
          </div>
        </div>
      </div>
    </li>
  )
}
