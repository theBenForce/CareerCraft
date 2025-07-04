'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/theme-toggle'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { UserCircleIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline'

export default function Header() {
  const pathname = usePathname()
  const { data: session } = useSession()

  const navigationItems = [
    { href: '/contacts', label: 'Contacts' },
    { href: '/companies', label: 'Companies' },
    { href: '/applications', label: 'Applications' },
    { href: '/activities', label: 'Activities' }
  ]

  const isActivePage = (href: string) => {
    // For root path, only match exactly
    if (href === '/') return pathname === '/'
    // For other paths, match if pathname starts with the href
    return pathname.startsWith(href)
  }

  const handleSignOut = () => {
    signOut({
      callbackUrl: '/auth/signin',
      redirect: true
    })
  }

  return (
    <header className="bg-background border-b border-border shadow-sm">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold tracking-tight text-foreground hover:text-muted-foreground">
            Career Craft
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
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              {session && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center space-x-2">
                      <UserCircleIcon className="h-5 w-5" />
                      <span className="hidden sm:inline">{session.user.firstName}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>
                      {session.user.firstName} {session.user.lastName}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut} className="flex items-center space-x-2 cursor-pointer">
                      <ArrowRightOnRectangleIcon className="h-4 w-4" />
                      <span>Sign out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
