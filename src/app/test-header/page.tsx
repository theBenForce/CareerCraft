import Header from '@/components/layout/Header'

export default function TestHeaderPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Header Mobile Test Page
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            This page is used to test the mobile responsiveness of the header component.
          </p>
          <div className="mt-8 grid gap-4 text-left">
            <div className="bg-card p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Desktop Features</h2>
              <ul className="space-y-2">
                <li>• Horizontal navigation menu</li>
                <li>• User dropdown with profile info</li>
                <li>• Theme toggle visible</li>
                <li>• Full logo text</li>
              </ul>
            </div>
            <div className="bg-card p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Mobile Features</h2>
              <ul className="space-y-2">
                <li>• Hamburger menu button</li>
                <li>• Collapsible navigation</li>
                <li>• Touch-friendly tap targets</li>
                <li>• Compact layout</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}