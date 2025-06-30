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

interface ActivityIconProps {
  type: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  withBackground?: boolean
  className?: string
}

export default function ActivityIcon({
  type,
  size = 'md',
  withBackground = false,
  className = ''
}: ActivityIconProps) {
  const getActivityIcon = (type: string) => {
    const iconSize = {
      'sm': 'w-4 h-4',
      'md': 'w-5 h-5',
      'lg': 'w-6 h-6',
      'xl': 'w-8 h-8'
    }[size]

    const iconProps = { className: iconSize }

    switch (type.toUpperCase()) {
      case 'EMAIL':
        return <EnvelopeIcon {...iconProps} />
      case 'PHONE_CALL':
        return <PhoneArrowUpRightIcon {...iconProps} />
      case 'MEETING':
        return <CalendarDaysIcon {...iconProps} />
      case 'NOTE':
        return <DocumentTextIcon {...iconProps} />
      case 'APPLICATION':
        return <DocumentTextIcon {...iconProps} />
      case 'INTERVIEW':
        return <VideoCameraIcon {...iconProps} />
      case 'NETWORKING_EVENT':
        return <UserGroupIcon {...iconProps} />
      case 'COFFEE_CHAT':
        return <ChatBubbleLeftEllipsisIcon {...iconProps} />
      case 'FOLLOW_UP':
        return <ClockIcon {...iconProps} />
      case 'REFERRAL':
        return <UserIcon {...iconProps} />
      case 'LINKEDIN_MESSAGE':
        return <ChatBubbleLeftEllipsisIcon {...iconProps} />
      case 'RESEARCH':
        return <DocumentTextIcon {...iconProps} />
      default:
        return <ChatBubbleLeftEllipsisIcon {...iconProps} />
    }
  }

  const getActivityIconColor = (type: string) => {
    switch (type.toUpperCase()) {
      case 'EMAIL':
        return 'text-blue-700 bg-blue-50 dark:text-blue-300 dark:bg-blue-950'
      case 'PHONE_CALL':
        return 'text-green-700 bg-green-50 dark:text-green-300 dark:bg-green-950'
      case 'MEETING':
        return 'text-purple-700 bg-purple-50 dark:text-purple-300 dark:bg-purple-950'
      case 'NOTE':
        return 'text-gray-700 bg-gray-50 dark:text-gray-300 dark:bg-gray-950'
      case 'APPLICATION':
        return 'text-orange-700 bg-orange-50 dark:text-orange-300 dark:bg-orange-950'
      case 'INTERVIEW':
        return 'text-indigo-700 bg-indigo-50 dark:text-indigo-300 dark:bg-indigo-950'
      case 'NETWORKING_EVENT':
        return 'text-pink-700 bg-pink-50 dark:text-pink-300 dark:bg-pink-950'
      case 'COFFEE_CHAT':
        return 'text-amber-700 bg-amber-50 dark:text-amber-300 dark:bg-amber-950'
      case 'FOLLOW_UP':
        return 'text-yellow-700 bg-yellow-50 dark:text-yellow-300 dark:bg-yellow-950'
      case 'REFERRAL':
        return 'text-emerald-700 bg-emerald-50 dark:text-emerald-300 dark:bg-emerald-950'
      case 'LINKEDIN_MESSAGE':
        return 'text-cyan-700 bg-cyan-50 dark:text-cyan-300 dark:bg-cyan-950'
      case 'RESEARCH':
        return 'text-slate-700 bg-slate-50 dark:text-slate-300 dark:bg-slate-950'
      default:
        return 'text-gray-700 bg-gray-50 dark:text-gray-300 dark:bg-gray-950'
    }
  }

  const containerSize = {
    'sm': 'w-6 h-6',
    'md': 'w-8 h-8',
    'lg': 'w-10 h-10',
    'xl': 'w-16 h-16'
  }[size]

  if (withBackground) {
    return (
      <div className={`${containerSize} rounded-full flex items-center justify-center ${getActivityIconColor(type)} ${className}`}>
        {getActivityIcon(type)}
      </div>
    )
  }

  return (
    <div className={`${getActivityIconColor(type).split(' ')[0]} ${className}`}>
      {getActivityIcon(type)}
    </div>
  )
}
