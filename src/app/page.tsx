import Link from 'next/link'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
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

async function getDashboardStats(userId: number): Promise<DashboardStats> {
  try {
    // Get all stats in parallel for better performance
    const [
      activeApplicationsCount,
      companiesCount,
      contactsCount,
      recentActivitiesCount,
    ] = await Promise.all([
      // Count active applications (not rejected or closed) for this user
      prisma.jobApplication.count({
        where: {
          userId,
          status: {
            notIn: ["rejected", "closed", "withdrawn"],
          },
        },
      }),
      // Count total companies for this user
      prisma.company.count({
        where: { userId },
      }),
      // Count total contacts for this user
      prisma.contact.count({
        where: { userId },
      }),
      // Count activities from the last 30 days for this user
      prisma.activity.count({
        where: {
          userId,
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

async function getRecentApplications(userId: number) {
  try {
    const applications = await prisma.jobApplication.findMany({
      take: 3, // Get latest 3 applications
      where: { userId },
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

async function getUpcomingActivities(userId: number) {
  try {
    const activities = await prisma.activity.findMany({
      take: 3, // Get next 3 activities
      where: {
        userId,
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

export default async function Dashboard() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect('/auth/signin')
  }

  const userId = parseInt(session.user.id)
  
  const [dashboardStats, recentApplications, upcomingActivities] = await Promise.all([
    getDashboardStats(userId),
    getRecentApplications(userId),
    getUpcomingActivities(userId),
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
                {recentApplications.length > 0 ? (
                  recentApplications.map((application) => (
                    <div key={application.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div>
                        <p className="font-medium text-foreground">{application.position}</p>
                        <p className="text-sm text-muted-foreground">{application.company.name}</p>
                      </div>
                      <Badge variant={
                        application.status === 'interview_scheduled' ? 'secondary' :
                          application.status === 'applied' ? 'default' :
                            application.status === 'offer' ? 'default' :
                              'outline'
                      }>
                        {application.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </Badge>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4">
                    <p className="text-muted-foreground">No recent applications found</p>
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

          <Card>
            <CardHeader>
              <CardTitle>Upcoming Activities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {upcomingActivities.length > 0 ? (
                  upcomingActivities.map((activity) => (
                    <div key={activity.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div>
                        <p className="font-medium text-foreground">{activity.subject}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(activity.date).toLocaleDateString('en-US', {
                            weekday: 'long',
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
