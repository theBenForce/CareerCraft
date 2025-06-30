'use client'

import Link from 'next/link'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'

export default function ApplicationsError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
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

      {/* Error content */}
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="text-center py-12">
          <ExclamationTriangleIcon className="mx-auto h-12 w-12 text-red-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Something went wrong!</h3>
          <p className="mt-1 text-sm text-gray-500">
            Unable to load job applications. Please try again.
          </p>
          <div className="mt-6 flex justify-center space-x-4">
            <button
              onClick={reset}
              className="btn-primary"
            >
              Try again
            </button>
            <Link href="/" className="btn-secondary">
              Go to Dashboard
            </Link>
          </div>
          {process.env.NODE_ENV === 'development' && (
            <details className="mt-4 text-left max-w-md mx-auto">
              <summary className="text-sm text-gray-500 cursor-pointer">Error details</summary>
              <pre className="mt-2 text-xs text-red-600 bg-red-50 p-2 rounded overflow-auto">
                {error.message}
              </pre>
            </details>
          )}
        </div>
      </main>
    </div>
  )
}
