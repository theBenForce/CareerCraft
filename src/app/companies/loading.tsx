export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Skeleton */}
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 w-64 bg-gray-200 rounded animate-pulse mt-2"></div>
            </div>
            <div className="h-10 w-32 bg-gray-200 rounded animate-pulse"></div>
          </div>

          {/* Navigation Skeleton */}
          <nav className="mt-4 flex space-x-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
            ))}
          </nav>
        </div>
      </header>

      {/* Main Content Skeleton */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0 space-y-3">
                    <div className="h-6 w-3/4 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                  <div className="h-6 w-6 bg-gray-200 rounded animate-pulse"></div>
                </div>

                <div className="mt-4 space-y-2">
                  <div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse"></div>
                </div>

                <div className="mt-6 space-y-3">
                  <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 w-5/6 bg-gray-200 rounded animate-pulse"></div>
                </div>

                {/* Stats Skeleton */}
                <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                  {[...Array(3)].map((_, j) => (
                    <div key={j}>
                      <div className="h-6 w-8 mx-auto bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-3 w-12 mx-auto bg-gray-200 rounded animate-pulse mt-1"></div>
                    </div>
                  ))}
                </div>

                {/* Actions Skeleton */}
                <div className="mt-4 flex justify-between">
                  <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 w-12 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
