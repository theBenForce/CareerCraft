export default function ApplicationsLoading() {
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
              <div className="h-9 w-20 bg-gray-200 rounded-md animate-pulse"></div>
              <div className="h-9 w-32 bg-gray-200 rounded-md animate-pulse"></div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <div className="border-b-2 border-transparent py-4 text-sm font-medium text-gray-500">
              Dashboard
            </div>
            <div className="border-b-2 border-primary-500 py-4 text-sm font-medium text-primary-600">
              Applications
            </div>
            <div className="border-b-2 border-transparent py-4 text-sm font-medium text-gray-500">
              Companies
            </div>
            <div className="border-b-2 border-transparent py-4 text-sm font-medium text-gray-500">
              Contacts
            </div>
          </div>
        </div>
      </nav>

      {/* Main content - Loading skeleton */}
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
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
