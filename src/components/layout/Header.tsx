'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { useState } from 'react'
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
import { 
  UserCircleIcon, 
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline'

export default function Header() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

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

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  return (
    <header className="bg-background border-b border-border shadow-sm">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="text-xl sm:text-2xl font-bold tracking-tight text-foreground hover:text-muted-foreground">
            Career Craft
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <nav className="flex space-x-4">
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`transition-colors pb-1 px-2 py-1 rounded hover:bg-accent ${isActivePage(item.href)
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

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMobileMenu}
              className="p-2"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-border">
            <nav className="flex flex-col space-y-2 pt-4">
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMobileMenu}
                  className={`transition-colors px-3 py-2 rounded-lg text-base font-medium ${isActivePage(item.href)
                    ? 'text-foreground bg-primary/10 border-l-4 border-primary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                    }`}
                >
                  {item.label}
                </Link>
              ))}
              {session && (
                <>
                  <div className="border-t border-border my-2"></div>
                  <div className="px-3 py-2">
                    <div className="flex items-center space-x-3 mb-3">
                      <UserCircleIcon className="h-8 w-8 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {session.user.firstName} {session.user.lastName}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleSignOut}
                      className="w-full justify-start space-x-2"
                    >
                      <ArrowRightOnRectangleIcon className="h-4 w-4" />
                      <span>Sign out</span>
                    </Button>
                  </div>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
