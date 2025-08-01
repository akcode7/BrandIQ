'use client'

import { useEffect, useRef, ReactNode } from 'react'

// Focus management utilities
export function useFocusManagement() {
  const focusRef = useRef<HTMLElement | null>(null)

  const setFocus = (element: HTMLElement | null) => {
    focusRef.current = element
    if (element) {
      element.focus()
    }
  }

  const restoreFocus = () => {
    if (focusRef.current) {
      focusRef.current.focus()
    }
  }

  return { setFocus, restoreFocus }
}

// Keyboard navigation hook
export function useKeyboardNavigation(
  items: HTMLElement[],
  orientation: 'horizontal' | 'vertical' = 'vertical'
) {
  const currentIndex = useRef(0)

  const handleKeyDown = (event: KeyboardEvent) => {
    const { key } = event
    const isHorizontal = orientation === 'horizontal'
    
    switch (key) {
      case isHorizontal ? 'ArrowLeft' : 'ArrowUp':
        event.preventDefault()
        currentIndex.current = Math.max(0, currentIndex.current - 1)
        items[currentIndex.current]?.focus()
        break
      case isHorizontal ? 'ArrowRight' : 'ArrowDown':
        event.preventDefault()
        currentIndex.current = Math.min(items.length - 1, currentIndex.current + 1)
        items[currentIndex.current]?.focus()
        break
      case 'Home':
        event.preventDefault()
        currentIndex.current = 0
        items[0]?.focus()
        break
      case 'End':
        event.preventDefault()
        currentIndex.current = items.length - 1
        items[items.length - 1]?.focus()
        break
    }
  }

  return { handleKeyDown }
}

// Skip link component for accessibility
export function SkipLink({ href = '#main-content', children = 'Skip to main content' }: {
  href?: string
  children?: ReactNode
}) {
  return (
    <a
      href={href}
      className="
        sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 
        bg-blue-600 text-white px-4 py-2 rounded-md z-50
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
      "
    >
      {children}
    </a>
  )
}

// Visually hidden component for screen readers
export function VisuallyHidden({ children, as: Component = 'span' }: {
  children: ReactNode
  as?: keyof JSX.IntrinsicElements
}) {
  return (
    <Component className="sr-only">
      {children}
    </Component>
  )
}

// Announcement component for screen readers
export function Announcement({ children, priority = 'polite' }: {
  children: ReactNode
  priority?: 'polite' | 'assertive'
}) {
  return (
    <div
      aria-live={priority}
      aria-atomic="true"
      className="sr-only"
    >
      {children}
    </div>
  )
}

// Focus trap component for modals/dialogs
export function FocusTrap({ 
  children, 
  active = true,
  restoreFocus = true 
}: {
  children: ReactNode
  active?: boolean
  restoreFocus?: boolean
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const previousActiveElement = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!active) return

    previousActiveElement.current = document.activeElement as HTMLElement

    const container = containerRef.current
    if (!container) return

    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    ) as NodeListOf<HTMLElement>

    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]

    const handleTabKey = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return

      if (event.shiftKey) {
        if (document.activeElement === firstElement) {
          event.preventDefault()
          lastElement?.focus()
        }
      } else {
        if (document.activeElement === lastElement) {
          event.preventDefault()
          firstElement?.focus()
        }
      }
    }

    document.addEventListener('keydown', handleTabKey)
    firstElement?.focus()

    return () => {
      document.removeEventListener('keydown', handleTabKey)
      if (restoreFocus && previousActiveElement.current) {
        previousActiveElement.current.focus()
      }
    }
  }, [active, restoreFocus])

  return <div ref={containerRef}>{children}</div>
}

// Accessible button component
export function AccessibleButton({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  className = '',
  ...props
}: {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
  className?: string
  [key: string]: any
}) {
  const baseClasses = `
    inline-flex items-center justify-center font-medium rounded-md
    transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
  `

  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500',
    outline: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-blue-500',
    ghost: 'text-gray-700 hover:bg-gray-100 focus:ring-gray-500'
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  }

  return (
    <button
      {...props}
      disabled={disabled || loading}
      aria-disabled={disabled || loading}
      className={`
        ${baseClasses}
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
    >
      {loading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      )}
      {children}
    </button>
  )
}

// Accessible form field component
export function FormField({
  label,
  error,
  required = false,
  children,
  className = ''
}: {
  label: string
  error?: string
  required?: boolean
  children: ReactNode
  className?: string
}) {
  const fieldId = useRef(`field-${Math.random().toString(36).substring(2, 9)}`)
  const errorId = useRef(`error-${Math.random().toString(36).substring(2, 9)}`)

  return (
    <div className={`space-y-1 ${className}`}>
      <label
        htmlFor={fieldId.current}
        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
      >
        {label}
        {required && (
          <span className="text-red-500 ml-1" aria-label="required">
            *
          </span>
        )}
      </label>
      
      <div>
        {children}
      </div>
      
      {error && (
        <p
          id={errorId.current}
          className="text-sm text-red-600 dark:text-red-400"
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  )
}

// ARIA label utilities
export function useAriaLabel(baseLabel: string, state?: Record<string, any>) {
  const buildLabel = () => {
    let label = baseLabel
    
    if (state) {
      const stateDescriptions = Object.entries(state)
        .filter(([_, value]) => value !== undefined && value !== null)
        .map(([key, value]) => {
          if (typeof value === 'boolean') {
            return value ? key : `not ${key}`
          }
          return `${key}: ${value}`
        })
      
      if (stateDescriptions.length > 0) {
        label += `, ${stateDescriptions.join(', ')}`
      }
    }
    
    return label
  }

  return buildLabel()
}

// Color contrast checker (development helper)
export function checkColorContrast(foreground: string, background: string): {
  ratio: number
  aaPass: boolean
  aaaPass: boolean
} {
  // This is a simplified version - in production you'd want a more robust implementation
  const getLuminance = (hex: string) => {
    const rgb = parseInt(hex.slice(1), 16)
    const r = (rgb >> 16) & 0xff
    const g = (rgb >> 8) & 0xff
    const b = (rgb >> 0) & 0xff
    
    const rsRGB = r / 255
    const gsRGB = g / 255
    const bsRGB = b / 255
    
    const rLin = rsRGB <= 0.03928 ? rsRGB / 12.92 : Math.pow((rsRGB + 0.055) / 1.055, 2.4)
    const gLin = gsRGB <= 0.03928 ? gsRGB / 12.92 : Math.pow((gsRGB + 0.055) / 1.055, 2.4)
    const bLin = bsRGB <= 0.03928 ? bsRGB / 12.92 : Math.pow((bsRGB + 0.055) / 1.055, 2.4)
    
    return 0.2126 * rLin + 0.7152 * gLin + 0.0722 * bLin
  }

  const fgLum = getLuminance(foreground)
  const bgLum = getLuminance(background)
  
  const ratio = (Math.max(fgLum, bgLum) + 0.05) / (Math.min(fgLum, bgLum) + 0.05)
  
  return {
    ratio,
    aaPass: ratio >= 4.5,
    aaaPass: ratio >= 7
  }
}
