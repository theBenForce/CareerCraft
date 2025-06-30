'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/theme-toggle'

export default function Header() {
  const pathname = usePathname()

  const navigationItems = [
    { href: '/applications', label: 'Applications' },
    { href: '/companies', label: 'Companies' },
    { href: '/contacts', label: 'Contacts' },
    { href: '/activities', label: 'Activities' },
    { href: '/notes', label: 'Notes' }
  ]

  const isActivePage = (href: string) => {
    // For root path, only match exactly
    if (href === '/') return pathname === '/'
    // For other paths, match if pathname starts with the href
    return pathname.startsWith(href)
  }

  return (
    <header className="bg-background border-b border-border shadow-sm">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold tracking-tight text-foreground hover:text-muted-foreground">
            Personal CRM
          </Link>
          <div className="flex items-center space-x-6">
            <nav className="flex space-x-4">
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`transition-colors pb-1 ${isActivePage(item.href)
                    ? 'text-foreground font-medium border-b-2 border-primary'
                    : 'text-muted-foreground hover:text-foreground'
                    }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  )
}
