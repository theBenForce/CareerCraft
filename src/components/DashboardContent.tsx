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
import { prisma } from '@/lib/db'

interface DashboardStats {
  activeApplications: number;
  companies: number;
  contacts: number;
  recentActivities: number;
}

async function getDashboardStats(): Promise<DashboardStats> {
  try {
    // Get all stats in parallel for better performance
    const [
      activeApplicationsCount,
      companiesCount,
      contactsCount,
      recentActivitiesCount,
    ] = await Promise.all([
      // Count active applications (not rejected or closed)
      prisma.jobApplication.count({
        where: {
          status: {
            notIn: ["rejected", "closed", "withdrawn"],
          },
        },
      }),
      // Count total companies
      prisma.company.count(),
      // Count total contacts
      prisma.contact.count(),
      // Count activities from the last 30 days
      prisma.activity.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
          },
        },
      }),
    ]);

    return {
      activeApplications: activeApplicationsCount,
      companies: companiesCount,
      contacts: contactsCount,
      recentActivities: recentActivitiesCount,
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    // Return default values if DB query fails
    return {
      activeApplications: 0,
      companies: 0,
      contacts: 0,
      recentActivities: 0,
    };
  }
}

async function getRecentApplications() {
  try {
    const applications = await prisma.jobApplication.findMany({
      take: 3, // Get latest 3 applications
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        company: {
          select: {
            name: true,
          },
        },
      },
    });
    return applications;
  } catch (error) {
    console.error('Error fetching recent applications:', error);
    return [];
  }
}

async function getUpcomingActivities() {
  try {
    const activities = await prisma.activity.findMany({
      take: 3, // Get next 3 activities
      where: {
        date: {
          gte: new Date(), // Future activities only
        },
      },
      orderBy: {
        date: 'asc',
      },
      include: {
        company: {
          select: {
            name: true,
          },
        },
        jobApplication: {
          select: {
            position: true,
          },
        },
      },
    });
    return activities;
  } catch (error) {
    console.error('Error fetching upcoming activities:', error);
    return [];
  }
}

export default async function DashboardContent() {
  const [dashboardStats, recentApplications, upcomingActivities] = await Promise.all([
    getDashboardStats(),
    getRecentApplications(),
    getUpcomingActivities(),
  ]);

  const stats = [
    { name: 'Active Applications', value: dashboardStats.activeApplications.toString(), icon: BriefcaseIcon, href: '/applications' },
    { name: 'Companies', value: dashboardStats.companies.toString(), icon: BuildingOfficeIcon, href: '/companies' },
    { name: 'Contacts', value: dashboardStats.contacts.toString(), icon: UserGroupIcon, href: '/contacts' },
    { name: 'Recent Activities', value: dashboardStats.recentActivities.toString(), icon: ClockIcon, href: '/activities' },
  ]

  const quickActions = [
    { name: 'Add Job Application', href: '/applications/new', icon: BriefcaseIcon },
    { name: 'Add Contact', href: '/contacts/new', icon: UserGroupIcon },
    { name: 'Add Company', href: '/companies/new', icon: BuildingOfficeIcon },
    { name: 'Add Note', href: '/notes/new', icon: DocumentTextIcon },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Dashboard
          </h1>
          <p className="text-muted-foreground">
            Welcome back! Here&apos;s an overview of your job search progress.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <Link key={index} href={stat.href} className="block">
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          {stat.name}
                        </p>
                        <p className="text-3xl font-bold text-foreground">
                          {stat.value}
                        </p>
                      </div>
                      <Icon className="h-8 w-8 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon
              return (
                <Button key={index} variant="outline" asChild className="h-auto p-4">
                  <Link href={action.href} className="flex items-center space-x-3">
                    <Icon className="h-5 w-5" />
                    <span>{action.name}</span>
                  </Link>
                </Button>
              )
            })}
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Applications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Recent Applications
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/applications/new">
                    <PlusIcon className="h-4 w-4" />
                  </Link>
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentApplications.length > 0 ? (
                  recentApplications.map((application) => (
                    <div key={application.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-medium text-foreground">
                          {application.position}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {application.company.name}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Applied {application.createdAt.toLocaleDateString()}
                        </p>
                      </div>
                      <Badge variant={
                        application.status === 'applied' ? 'default' :
                          application.status === 'interviewing' ? 'secondary' :
                            application.status === 'offer' ? 'default' :
                              'outline'
                      }>
                        {application.status}
                      </Badge>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4">
                    <p className="text-muted-foreground">No applications found</p>
                    <Button variant="link" asChild className="mt-2">
                      <Link href="/applications/new">Create your first application</Link>
                    </Button>
                  </div>
                )}
              </div>
              <div className="mt-4">
                <Button variant="link" asChild className="p-0">
                  <Link href="/applications">View all applications →</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Activities */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Upcoming Activities
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/activities/new">
                    <PlusIcon className="h-4 w-4" />
                  </Link>
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingActivities.length > 0 ? (
                  upcomingActivities.map((activity) => (
                    <div key={activity.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-medium text-foreground">
                          {activity.type.charAt(0).toUpperCase() + activity.type.slice(1)}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {activity.company?.name}
                          {activity.jobApplication?.position && ` - ${activity.jobApplication.position}`}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {activity.date.toLocaleDateString('en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                            hour: 'numeric',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                      <ClockIcon className="h-5 w-5 text-muted-foreground" />
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4">
                    <p className="text-muted-foreground">No upcoming activities found</p>
                  </div>
                )}
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
