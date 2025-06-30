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
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="max-w-md w-full bg-card shadow-lg rounded-lg p-6">
        <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 dark:bg-red-900/20 rounded-full">
          <ExclamationTriangleIcon className="w-6 h-6 text-red-600 dark:text-red-400" />
        </div>

        <div className="mt-4 text-center">
          <h1 className="text-lg font-semibold text-foreground">
            Something went wrong!
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {error.message || 'Failed to load companies. Please try again.'}
          </p>
        </div>

        <div className="mt-6 flex flex-col space-y-3">
          <button
            onClick={reset}
            className="btn-primary w-full"
          >
            Try again
          </button>

          <Link
            href="/"
            className="btn-secondary w-full"
          >
            Go to Dashboard
          </Link>
        </div>

        {process.env.NODE_ENV === 'development' && error.digest && (
          <div className="mt-4 p-3 bg-muted rounded text-xs text-muted-foreground">
            <strong>Error ID:</strong> {error.digest}
          </div>
        )}
      </div>
    </div>
  )
}
