import Link from 'next/link'
import { PlusIcon, FunnelIcon } from '@heroicons/react/24/outline'
import { prisma } from '@/lib/db'
import type { JobStatus, Priority } from '@/types'
import { revalidateTag } from 'next/cache'

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
    const statusConfig: Record<JobStatus, string> = {
      applied: 'bg-blue-100 text-blue-800',
      interview_scheduled: 'bg-yellow-100 text-yellow-800',
      interviewed: 'bg-purple-100 text-purple-800',
      offer: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      accepted: 'bg-green-100 text-green-800'
    }

    const statusLabels: Record<JobStatus, string> = {
      applied: 'Applied',
      interview_scheduled: 'Interview Scheduled',
      interviewed: 'Interviewed',
      offer: 'Offer',
      rejected: 'Rejected',
      accepted: 'Accepted'
    }

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig[status]}`}>
        {statusLabels[status]}
      </span>
    )
  }

  const getPriorityBadge = (priority: Priority) => {
    const priorityConfig: Record<Priority, string> = {
      low: 'bg-gray-100 text-gray-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-red-100 text-red-800'
    }

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${priorityConfig[priority]}`}>
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </span>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                Job Applications
              </h1>
              <p className="mt-2 text-sm text-gray-600">
                Track your job applications and their progress
              </p>
            </div>
            <div className="flex space-x-3">
              <button className="btn-secondary flex items-center">
                <FunnelIcon className="h-4 w-4 mr-2" />
                Filter
              </button>
              <Link href="/applications/new" className="btn-primary flex items-center">
                <PlusIcon className="h-4 w-4 mr-2" />
                Add Application
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <Link href="/" className="border-b-2 border-transparent py-4 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300">
              Dashboard
            </Link>
            <Link href="/applications" className="border-b-2 border-primary-500 py-4 text-sm font-medium text-primary-600">
              Applications
            </Link>
            <Link href="/companies" className="border-b-2 border-transparent py-4 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300">
              Companies
            </Link>
            <Link href="/contacts" className="border-b-2 border-transparent py-4 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300">
              Contacts
            </Link>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {applications.map((application) => (
              <li key={application.id}>
                <Link href={`/applications/${application.id}`} className="block hover:bg-gray-50">
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-lg font-medium text-primary-600 truncate">
                            {application.position}
                          </p>
                          <div className="flex space-x-2">
                            {getPriorityBadge(application.priority as Priority)}
                            {getStatusBadge(application.status as JobStatus)}
                          </div>
                        </div>
                        <div className="mt-2 sm:flex sm:justify-between">
                          <div className="sm:flex">
                            <p className="flex items-center text-sm text-gray-500">
                              {application.company.name}
                            </p>
                            <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                              Applied: {new Date(application.appliedDate).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
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
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {applications.length === 0 && (
          <div className="text-center py-12">
            <div className="mx-auto max-w-md">
              <h3 className="mt-2 text-sm font-medium text-gray-900">No applications</h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by creating your first job application.
              </p>
              <div className="mt-6">
                <Link href="/applications/new" className="btn-primary">
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Add Job Application
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
