'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'

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
    <header className="bg-white shadow">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold tracking-tight text-gray-900 hover:text-gray-700">
            Personal CRM
          </Link>
          <nav className="flex space-x-4">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`${isActivePage(item.href)
                    ? 'text-gray-900 font-medium border-b-2 border-blue-500 pb-1'
                    : 'text-gray-600 hover:text-gray-900'
                  }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  )
}
