import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { jest } from '@jest/globals'
import userEvent from '@testing-library/user-event'

// Mock Next.js router
const mockPush = jest.fn()
const mockReplace = jest.fn()
const mockBack = jest.fn()

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: mockReplace,
    back: mockBack,
    refresh: jest.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}))

// Mock NextAuth
jest.mock('next-auth/react', () => ({
  useSession: () => ({
    data: null,
    status: 'unauthenticated',
  }),
  signIn: jest.fn(),
  signOut: jest.fn(),
  SessionProvider: ({ children }: { children: React.ReactNode }) => children,
}))

// Mock window.matchMedia for theme tests
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
})

// Mock IntersectionObserver for performance monitoring
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}))

// Mock ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}))

// Custom render function with providers
export function renderWithProviders(ui: React.ReactElement, options = {}) {
  // Import providers after mocks are set up
  const { ThemeProvider } = require('@/components/Theme')
  const { ToastProvider } = require('@/components/Toast')
  const { LoadingProvider } = require('@/components/Loading')
  
  const AllProviders = ({ children }: { children: React.ReactNode }) => (
    <ThemeProvider>
      <LoadingProvider>
        <ToastProvider>
          {children}
        </ToastProvider>
      </LoadingProvider>
    </ThemeProvider>
  )

  return render(ui, { wrapper: AllProviders, ...options })
}

// Utility functions for testing
export const testUtils = {
  // Wait for loading states to resolve
  waitForLoadingToFinish: async () => {
    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument()
    })
  },

  // Fill form field by label
  fillField: async (labelText: string, value: string) => {
    const field = screen.getByLabelText(labelText)
    await userEvent.clear(field)
    await userEvent.type(field, value)
  },

  // Click button and wait for action
  clickAndWait: async (buttonText: string) => {
    const button = screen.getByRole('button', { name: buttonText })
    await userEvent.click(button)
    await waitFor(() => {
      expect(button).not.toBeDisabled()
    })
  },

  // Test accessibility
  expectAccessibleButton: (button: HTMLElement) => {
    expect(button).toHaveAttribute('type', 'button')
    expect(button).toHaveAttribute('aria-label')
    expect(button).not.toHaveAttribute('aria-hidden', 'true')
  },

  // Test keyboard navigation
  testKeyboardNavigation: async (element: HTMLElement, key: string) => {
    element.focus()
    await userEvent.keyboard(`{${key}}`)
  },
}

// Mock API responses
export const mockApiResponse = (data: any, status = 200) => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: status >= 200 && status < 300,
      status,
      json: () => Promise.resolve(data),
      text: () => Promise.resolve(JSON.stringify(data)),
    })
  ) as jest.Mock
}

// Mock error console to test error handling
export const mockConsoleError = () => {
  const originalError = console.error
  console.error = jest.fn()
  return () => {
    console.error = originalError
  }
}

// Export everything for easy imports
export {
  render,
  screen,
  fireEvent,
  waitFor,
  userEvent,
  jest,
  mockPush,
  mockReplace,
  mockBack,
  localStorageMock,
}
