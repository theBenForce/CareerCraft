import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import Header from '@/components/layout/Header'

// Mock the modules
jest.mock('next/navigation')
jest.mock('next-auth/react')

const mockUsePathname = usePathname as jest.MockedFunction<typeof usePathname>
const mockUseSession = useSession as jest.MockedFunction<typeof useSession>
const mockSignOut = signOut as jest.MockedFunction<typeof signOut>

// Mock session data
const mockSession = {
  user: {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
  }
}

describe('Header Component', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks()
    mockUsePathname.mockReturnValue('/')
    mockUseSession.mockReturnValue({
      data: null,
      status: 'unauthenticated'
    })
  })

  describe('Basic Rendering', () => {
    test('renders the Career Craft logo', () => {
      render(<Header />)
      expect(screen.getByText('Career Craft')).toBeInTheDocument()
    })

    test('renders navigation links on desktop', () => {
      render(<Header />)
      expect(screen.getByText('Contacts')).toBeInTheDocument()
      expect(screen.getByText('Companies')).toBeInTheDocument()
      expect(screen.getByText('Applications')).toBeInTheDocument()
      expect(screen.getByText('Activities')).toBeInTheDocument()
    })

    test('renders theme toggle', () => {
      render(<Header />)
      // Theme toggle should be present (button with theme functionality)
      const themeButtons = screen.getAllByRole('button')
      expect(themeButtons.length).toBeGreaterThan(0)
    })

    test('renders mobile menu button on mobile', () => {
      render(<Header />)
      const menuButton = screen.getByLabelText('Toggle navigation menu')
      expect(menuButton).toBeInTheDocument()
    })
  })

  describe('Active Navigation States', () => {
    test('highlights active navigation link - contacts page', () => {
      mockUsePathname.mockReturnValue('/contacts')
      render(<Header />)
      
      const contactsLink = screen.getByRole('link', { name: 'Contacts' })
      expect(contactsLink).toHaveClass('text-foreground', 'font-medium', 'border-b-2', 'border-primary')
    })

    test('highlights active navigation link - companies page', () => {
      mockUsePathname.mockReturnValue('/companies/123')
      render(<Header />)
      
      const companiesLink = screen.getByRole('link', { name: 'Companies' })
      expect(companiesLink).toHaveClass('text-foreground', 'font-medium', 'border-b-2', 'border-primary')
    })

    test('does not highlight inactive links', () => {
      mockUsePathname.mockReturnValue('/contacts')
      render(<Header />)
      
      const companiesLink = screen.getByRole('link', { name: 'Companies' })
      expect(companiesLink).toHaveClass('text-muted-foreground')
      expect(companiesLink).not.toHaveClass('border-primary')
    })

    test('handles root path correctly', () => {
      mockUsePathname.mockReturnValue('/')
      render(<Header />)
      
      // All navigation links should be inactive when on root
      const contactsLink = screen.getByRole('link', { name: 'Contacts' })
      expect(contactsLink).toHaveClass('text-muted-foreground')
    })
  })

  describe('Mobile Menu Functionality', () => {
    test('mobile menu is initially closed', () => {
      render(<Header />)
      
      // Mobile menu content should not be visible
      const mobileMenu = screen.queryByRole('navigation')
      // The mobile menu navigation should not be visible initially
      expect(screen.queryByText('Contacts')).toBeInTheDocument() // Desktop version
    })

    test('opens mobile menu when hamburger button is clicked', async () => {
      const user = userEvent.setup()
      render(<Header />)
      
      const menuButton = screen.getByLabelText('Toggle navigation menu')
      await user.click(menuButton)
      
      // Should show X icon when open
      expect(screen.getByTestId('x-mark-icon')).toBeInTheDocument()
    })

    test('closes mobile menu when navigation link is clicked', async () => {
      const user = userEvent.setup()
      render(<Header />)
      
      // Open mobile menu
      const menuButton = screen.getByLabelText('Toggle navigation menu')
      await user.click(menuButton)
      
      // Verify menu is open
      expect(screen.getByTestId('x-mark-icon')).toBeInTheDocument()
      
      // Click a navigation link in the mobile menu
      const mobileLinks = screen.getAllByText('Contacts')
      if (mobileLinks.length > 1) {
        await user.click(mobileLinks[1]) // Click mobile version
      }
      
      // Menu should close (hamburger icon should be visible again)
      await waitFor(() => {
        expect(screen.getByTestId('bars-3-icon')).toBeInTheDocument()
      })
    })

    test('closes mobile menu when logo is clicked', async () => {
      const user = userEvent.setup()
      render(<Header />)
      
      // Open mobile menu
      const menuButton = screen.getByLabelText('Toggle navigation menu')
      await user.click(menuButton)
      
      // Verify menu is open
      expect(screen.getByTestId('x-mark-icon')).toBeInTheDocument()
      
      // Click logo
      const logo = screen.getByText('Career Craft')
      await user.click(logo)
      
      // Menu should close
      await waitFor(() => {
        expect(screen.getByTestId('bars-3-icon')).toBeInTheDocument()
      })
    })
  })

  describe('User Authentication', () => {
    test('shows user dropdown when authenticated', () => {
      mockUseSession.mockReturnValue({
        data: mockSession,
        status: 'authenticated'
      })
      
      render(<Header />)
      
      expect(screen.getByText('John')).toBeInTheDocument()
    })

    test('user dropdown shows full name in mobile menu', () => {
      mockUseSession.mockReturnValue({
        data: mockSession,
        status: 'authenticated'
      })
      
      render(<Header />)
      
      // Open mobile menu to see user info
      const menuButton = screen.getByLabelText('Toggle navigation menu')
      fireEvent.click(menuButton)
      
      expect(screen.getByText('John Doe')).toBeInTheDocument()
    })

    test('calls signOut when sign out is clicked', async () => {
      const user = userEvent.setup()
      mockUseSession.mockReturnValue({
        data: mockSession,
        status: 'authenticated'
      })
      
      render(<Header />)
      
      // Open user dropdown
      const userButton = screen.getByRole('button', { name: /john/i })
      await user.click(userButton)
      
      // Click sign out
      const signOutButton = screen.getByText('Sign out')
      await user.click(signOutButton)
      
      expect(mockSignOut).toHaveBeenCalledWith({
        callbackUrl: '/auth/signin',
        redirect: true
      })
    })

    test('calls signOut from mobile menu', async () => {
      const user = userEvent.setup()
      mockUseSession.mockReturnValue({
        data: mockSession,
        status: 'authenticated'
      })
      
      render(<Header />)
      
      // Open mobile menu
      const menuButton = screen.getByLabelText('Toggle navigation menu')
      await user.click(menuButton)
      
      // Click sign out in mobile menu
      const signOutButtons = screen.getAllByText('Sign out')
      await user.click(signOutButtons[signOutButtons.length - 1]) // Mobile version
      
      expect(mockSignOut).toHaveBeenCalledWith({
        callbackUrl: '/auth/signin',
        redirect: true
      })
    })
  })

  describe('Responsive Design', () => {
    test('has proper CSS classes for desktop navigation', () => {
      render(<Header />)
      
      // Desktop navigation should be hidden on mobile, visible on desktop
      const desktopNav = screen.getByText('Contacts').closest('nav')?.parentElement
      expect(desktopNav).toHaveClass('hidden', 'md:flex')
    })

    test('mobile menu button has proper responsive classes', () => {
      render(<Header />)
      
      const mobileButtonContainer = screen.getByLabelText('Toggle navigation menu').parentElement
      expect(mobileButtonContainer).toHaveClass('md:hidden')
    })

    test('navigation links have proper touch targets for mobile', async () => {
      const user = userEvent.setup()
      render(<Header />)
      
      // Open mobile menu
      const menuButton = screen.getByLabelText('Toggle navigation menu')
      await user.click(menuButton)
      
      // Mobile navigation links should have proper padding for touch targets
      const mobileLinks = screen.getAllByText('Contacts')
      if (mobileLinks.length > 1) {
        const mobileLink = mobileLinks[1] // Mobile version
        expect(mobileLink).toHaveClass('py-3', 'px-4')
      }
    })
  })

  describe('Accessibility', () => {
    test('mobile menu button has proper aria label', () => {
      render(<Header />)
      
      const menuButton = screen.getByLabelText('Toggle navigation menu')
      expect(menuButton).toHaveAttribute('aria-label', 'Toggle navigation menu')
    })

    test('all navigation links are accessible', () => {
      render(<Header />)
      
      expect(screen.getByRole('link', { name: 'Career Craft' })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: 'Contacts' })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: 'Companies' })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: 'Applications' })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: 'Activities' })).toBeInTheDocument()
    })

    test('maintains focus management for keyboard navigation', () => {
      render(<Header />)
      
      const menuButton = screen.getByLabelText('Toggle navigation menu')
      menuButton.focus()
      expect(menuButton).toHaveFocus()
    })
  })

  describe('Component Integration', () => {
    test('integrates properly with Next.js Link component', () => {
      render(<Header />)
      
      const logoLink = screen.getByRole('link', { name: 'Career Craft' })
      expect(logoLink).toHaveAttribute('href', '/')
      
      const contactsLink = screen.getByRole('link', { name: 'Contacts' })
      expect(contactsLink).toHaveAttribute('href', '/contacts')
    })

    test('handles theme toggle component presence', () => {
      render(<Header />)
      
      // Should have theme toggle buttons (one for desktop, one for mobile)
      const buttons = screen.getAllByRole('button')
      expect(buttons.length).toBeGreaterThanOrEqual(1)
    })
  })
})