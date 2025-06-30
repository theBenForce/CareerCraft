import Link from 'next/link'
import {
  BriefcaseIcon,
  BuildingOfficeIcon,
  UserGroupIcon,
  ClockIcon,
  DocumentTextIcon,
  PlusIcon
} from '@heroicons/react/24/outline'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Header from '@/components/layout/Header'

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
      <Header />

      {/* Main content */}
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Stats */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          {stats.map((stat) => (
            <Link key={stat.name} href={stat.href}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <stat.icon className="h-8 w-8 text-primary" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-muted-foreground truncate">
                          {stat.name}
                        </dt>
                        <dd className="text-3xl font-semibold text-foreground">
                          {stat.value}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-lg font-medium text-foreground mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {quickActions.map((action) => (
              <Link key={action.name} href={action.href}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <action.icon className="h-8 w-8 text-primary mx-auto mb-2" />
                    <p className="text-sm font-medium text-foreground">{action.name}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Applications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <p className="font-medium text-foreground">Senior Developer</p>
                    <p className="text-sm text-muted-foreground">TechCorp Inc.</p>
                  </div>
                  <Badge variant="secondary">Interview Scheduled</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <p className="font-medium text-foreground">Product Manager</p>
                    <p className="text-sm text-muted-foreground">StartupXYZ</p>
                  </div>
                  <Badge>Applied</Badge>
                </div>
              </div>
              <div className="mt-4">
                <Button variant="link" asChild className="p-0">
                  <Link href="/applications">View all applications →</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Upcoming Activities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <p className="font-medium text-foreground">Interview with TechCorp</p>
                    <p className="text-sm text-muted-foreground">Tomorrow, 2:00 PM</p>
                  </div>
                  <ClockIcon className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <p className="font-medium text-foreground">Follow up with John Doe</p>
                    <p className="text-sm text-muted-foreground">Friday, 10:00 AM</p>
                  </div>
                  <ClockIcon className="h-5 w-5 text-muted-foreground" />
                </div>
              </div>
              <div className="mt-4">
                <Button variant="link" asChild className="p-0">
                  <Link href="/activities">View all activities →</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
