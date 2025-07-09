import Link from 'next/link'
import { PlusIcon, FunnelIcon } from '@heroicons/react/24/outline'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Header from '@/components/layout/Header'
import { prisma } from '@/lib/db'
import type { JobStatus, Priority } from '@/types'

export const dynamic = 'force-dynamic'
export const revalidate = 60 // Revalidate every 60 seconds

export default async function ApplicationsPage() {
  // Fetch applications from the database
  let applications
  try {
    applications = await prisma.jobApplication.findMany({
      include: {
        company: {
          select: {
            name: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
  } catch (error) {
    console.error('Failed to fetch applications:', error)
    throw new Error('Failed to load job applications. Please try again.')
  }

  const getStatusBadge = (status: JobStatus) => {
    const statusLabels: Record<JobStatus, string> = {
      applied: 'Applied',
      interview_scheduled: 'Interview Scheduled',
      interviewed: 'Interviewed',
      offer: 'Offer',
      rejected: 'Rejected',
      accepted: 'Accepted'
    }

    const statusVariants: Record<JobStatus, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      applied: 'default',
      interview_scheduled: 'secondary',
      interviewed: 'outline',
      offer: 'default',
      rejected: 'destructive',
      accepted: 'default'
    }

    return (
      <Badge variant={statusVariants[status]}>
        {statusLabels[status]}
      </Badge>
    )
  }

  const getPriorityBadge = (priority: Priority) => {
    const priorityVariants: Record<Priority, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      low: 'secondary',
      medium: 'outline',
      high: 'destructive'
    }

    return (
      <Badge variant={priorityVariants[priority]}>
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </Badge>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Main content */}
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Job Applications
            </h1>
            <p className="mt-2 text-muted-foreground">
              Track your job applications and their progress
            </p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline">
              <FunnelIcon className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button asChild>
              <Link href="/applications/new">
                <PlusIcon className="h-4 w-4 mr-2" />
                Add Application
              </Link>
            </Button>
          </div>
        </div>

        {applications.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto max-w-md">
              <h3 className="mt-2 text-sm font-medium text-foreground">No applications</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Get started by creating your first job application.
              </p>
              <div className="mt-6">
                <Button asChild>
                  <Link href="/applications/new">
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Add Job Application
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((application: any) => (
              <Card key={application.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <Link href={`/applications/${application.id}`} className="block">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-medium text-primary truncate">
                            {application.position}
                          </h3>
                          <div className="flex space-x-2">
                            {getPriorityBadge(application.priority as Priority)}
                            {getStatusBadge(application.status as JobStatus)}
                          </div>
                        </div>
                        <div className="mt-2 sm:flex sm:justify-between">
                          <div className="sm:flex">
                            <p className="flex items-center text-sm text-muted-foreground">
                              {application.company.name}
                            </p>
                            <p className="mt-2 flex items-center text-sm text-muted-foreground sm:mt-0 sm:ml-6">
                              Applied: {new Date(application.appliedDate).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="mt-2 flex items-center text-sm text-muted-foreground sm:mt-0">
                            {application.salary && <p>{application.salary}</p>}
                            {application.source && (
                              <p className={application.salary ? "ml-6" : ""}>
                                via {application.source}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
