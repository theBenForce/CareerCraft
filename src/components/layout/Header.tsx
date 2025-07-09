'use client'

import { useState } from 'react'
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
          <Link 
            href="/" 
            className="text-2xl font-bold tracking-tight text-foreground hover:text-muted-foreground"
            onClick={closeMobileMenu}
          >
            Career Craft
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <nav className="flex space-x-4">
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`transition-colors pb-1 px-2 py-1 ${isActivePage(item.href)
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

          {/* Mobile Navigation Button */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMobileMenu}
              className="h-10 w-10"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? (
                <XMarkIcon className="h-6 w-6" data-testid="x-mark-icon" />
              ) : (
                <Bars3Icon className="h-6 w-6" data-testid="bars-3-icon" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-border pt-4">
            <nav className="flex flex-col space-y-4">
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMobileMenu}
                  className={`transition-colors py-3 px-4 rounded-lg text-lg ${isActivePage(item.href)
                    ? 'text-foreground font-medium bg-primary/10 border-l-4 border-primary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                    }`}
                >
                  {item.label}
                </Link>
              ))}
              {session && (
                <>
                  <div className="border-t border-border pt-4 mt-4">
                    <div className="flex items-center space-x-3 px-4 py-2 text-foreground">
                      <UserCircleIcon className="h-6 w-6" />
                      <span className="font-medium">
                        {session.user.firstName} {session.user.lastName}
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        handleSignOut()
                        closeMobileMenu()
                      }}
                      className="w-full flex items-center space-x-3 px-4 py-3 mt-2 text-muted-foreground hover:text-foreground hover:bg-secondary/50 rounded-lg transition-colors text-left"
                    >
                      <ArrowRightOnRectangleIcon className="h-5 w-5" />
                      <span>Sign out</span>
                    </button>
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
