'use client'

import Link from 'next/link'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
        <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full">
          <ExclamationTriangleIcon className="w-6 h-6 text-red-600" />
        </div>

        <div className="mt-4 text-center">
          <h1 className="text-lg font-semibold text-gray-900">
            Something went wrong!
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            {error.message || 'Failed to load companies. Please try again.'}
          </p>
        </div>

        <div className="mt-6 flex flex-col space-y-3">
          <button
            onClick={reset}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Try again
          </button>

          <Link
            href="/"
            className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Go to Dashboard
          </Link>
        </div>

        {process.env.NODE_ENV === 'development' && error.digest && (
          <div className="mt-4 p-3 bg-gray-100 rounded text-xs text-gray-600">
            <strong>Error ID:</strong> {error.digest}
          </div>
        )}
      </div>
    </div>
  )
}
