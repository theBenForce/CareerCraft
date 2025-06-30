import Header from '@/components/layout/Header'

export default function Loading() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Main Content Skeleton */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <div className="h-8 w-48 bg-muted rounded animate-pulse"></div>
            <div className="h-4 w-64 bg-muted rounded animate-pulse mt-2"></div>
          </div>
          <div className="h-10 w-32 bg-muted rounded animate-pulse"></div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-card overflow-hidden shadow rounded-lg">
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0 space-y-3">
                    <div className="h-6 w-3/4 bg-muted rounded animate-pulse"></div>
                    <div className="h-4 w-1/2 bg-muted rounded animate-pulse"></div>
                  </div>
                  <div className="h-6 w-6 bg-muted rounded animate-pulse"></div>
                </div>

                <div className="mt-4 space-y-2">
                  <div className="h-4 w-2/3 bg-muted rounded animate-pulse"></div>
                  <div className="h-4 w-1/2 bg-muted rounded animate-pulse"></div>
                </div>

                <div className="mt-6 space-y-3">
                  <div className="h-4 w-full bg-muted rounded animate-pulse"></div>
                  <div className="h-4 w-5/6 bg-muted rounded animate-pulse"></div>
                </div>

                {/* Stats Skeleton */}
                <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                  {[...Array(3)].map((_, j) => (
                    <div key={j}>
                      <div className="h-6 w-8 mx-auto bg-muted rounded animate-pulse"></div>
                      <div className="h-3 w-12 mx-auto bg-muted rounded animate-pulse mt-1"></div>
                    </div>
                  ))}
                </div>

                {/* Actions Skeleton */}
                <div className="mt-4 flex justify-between">
                  <div className="h-4 w-20 bg-muted rounded animate-pulse"></div>
                  <div className="h-4 w-12 bg-muted rounded animate-pulse"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
