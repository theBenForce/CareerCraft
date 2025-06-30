'use client'

import Link from 'next/link'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import Header from '@/components/layout/Header'

export default function ApplicationsError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

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
