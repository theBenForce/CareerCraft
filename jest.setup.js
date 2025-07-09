import '@testing-library/jest-dom'

// Mock next/navigation
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
}))

// Mock next-auth/react
jest.mock('next-auth/react', () => ({
  useSession: jest.fn(),
  signOut: jest.fn(),
}))

// Mock next/link
jest.mock('next/link', () => {
  return ({ children, href, onClick, ...props }) => {
    return (
      <a href={href} onClick={onClick} {...props}>
        {children}
      </a>
    )
  }
})

// Suppress console warnings for tests
const originalError = console.error
beforeAll(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('Warning:') || 
       args[0].includes('Not implemented: navigation'))
    ) {
      return
    }
    // Also suppress JSDOM navigation errors
    if (args[0] && args[0].type === 'not implemented' && args[0].message?.includes('navigation')) {
      return
    }
    originalError.call(console, ...args)
  }
})

afterAll(() => {
  console.error = originalError
})