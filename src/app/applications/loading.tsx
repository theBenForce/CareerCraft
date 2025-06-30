import Header from '@/components/layout/Header'

export default function ApplicationsLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 w-64 bg-gray-200 rounded animate-pulse mt-2"></div>
          </div>
          <div className="flex space-x-3">
            <div className="h-9 w-20 bg-gray-200 rounded-md animate-pulse"></div>
            <div className="h-9 w-32 bg-gray-200 rounded-md animate-pulse"></div>
          </div>
        </div>
        {/* Main content - Loading skeleton */}
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {[...Array(3)].map((_, index) => (
              <li key={index}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div className="h-6 w-48 bg-gray-200 rounded animate-pulse"></div>
                        <div className="flex space-x-2">
                          <div className="h-5 w-16 bg-gray-200 rounded-full animate-pulse"></div>
                          <div className="h-5 w-20 bg-gray-200 rounded-full animate-pulse"></div>
                        </div>
                      </div>
                      <div className="mt-2 sm:flex sm:justify-between">
                        <div className="sm:flex">
                          <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                          <div className="mt-2 h-4 w-28 bg-gray-200 rounded animate-pulse sm:mt-0 sm:ml-6"></div>
                        </div>
                        <div className="mt-2 flex items-center space-x-6 sm:mt-0">
                          <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                          <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  )
}
