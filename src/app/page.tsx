import Link from 'next/link'
import { 
  BriefcaseIcon, 
  BuildingOfficeIcon, 
  UserGroupIcon, 
  ClockIcon,
  DocumentTextIcon,
  PlusIcon
} from '@heroicons/react/24/outline'

export default function Dashboard() {
  const stats = [
    { name: 'Active Applications', value: '12', icon: BriefcaseIcon, href: '/applications' },
    { name: 'Companies', value: '8', icon: BuildingOfficeIcon, href: '/companies' },
    { name: 'Contacts', value: '24', icon: UserGroupIcon, href: '/contacts' },
    { name: 'Recent Activities', value: '6', icon: ClockIcon, href: '/activities' },
  ]

  const quickActions = [
    { name: 'Add Job Application', href: '/applications/new', icon: BriefcaseIcon },
    { name: 'Add Contact', href: '/contacts/new', icon: UserGroupIcon },
    { name: 'Add Company', href: '/companies/new', icon: BuildingOfficeIcon },
    { name: 'Add Note', href: '/notes/new', icon: DocumentTextIcon },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Personal CRM Dashboard
            </h1>
            <nav className="flex space-x-4">
              <Link href="/applications" className="text-gray-600 hover:text-gray-900">
                Applications
              </Link>
              <Link href="/companies" className="text-gray-600 hover:text-gray-900">
                Companies
              </Link>
              <Link href="/contacts" className="text-gray-600 hover:text-gray-900">
                Contacts
              </Link>
              <Link href="/activities" className="text-gray-600 hover:text-gray-900">
                Activities
              </Link>
              <Link href="/notes" className="text-gray-600 hover:text-gray-900">
                Notes
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Stats */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          {stats.map((stat) => (
            <Link key={stat.name} href={stat.href}>
              <div className="card hover:shadow-lg transition-shadow cursor-pointer">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <stat.icon className="h-8 w-8 text-primary-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        {stat.name}
                      </dt>
                      <dd className="text-3xl font-semibold text-gray-900">
                        {stat.value}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {quickActions.map((action) => (
              <Link key={action.name} href={action.href}>
                <div className="card hover:shadow-lg transition-shadow cursor-pointer text-center">
                  <action.icon className="h-8 w-8 text-primary-600 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-900">{action.name}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Applications</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Senior Developer</p>
                  <p className="text-sm text-gray-600">TechCorp Inc.</p>
                </div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  Interview Scheduled
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Product Manager</p>
                  <p className="text-sm text-gray-600">StartupXYZ</p>
                </div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Applied
                </span>
              </div>
            </div>
            <div className="mt-4">
              <Link href="/applications" className="text-primary-600 hover:text-primary-500 text-sm font-medium">
                View all applications →
              </Link>
            </div>
          </div>

          <div className="card">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Upcoming Activities</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Interview with TechCorp</p>
                  <p className="text-sm text-gray-600">Tomorrow, 2:00 PM</p>
                </div>
                <ClockIcon className="h-5 w-5 text-gray-400" />
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Follow up with John Doe</p>
                  <p className="text-sm text-gray-600">Friday, 10:00 AM</p>
                </div>
                <ClockIcon className="h-5 w-5 text-gray-400" />
              </div>
            </div>
            <div className="mt-4">
              <Link href="/activities" className="text-primary-600 hover:text-primary-500 text-sm font-medium">
                View all activities →
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
