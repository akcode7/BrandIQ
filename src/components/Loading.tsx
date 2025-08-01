'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

interface LoadingState {
  [key: string]: boolean
}

interface LoadingContextType {
  loadingStates: LoadingState
  setLoading: (key: string, loading: boolean) => void
  isLoading: (key: string) => boolean
  isAnyLoading: () => boolean
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined)

export function LoadingProvider({ children }: { children: ReactNode }) {
  const [loadingStates, setLoadingStates] = useState<LoadingState>({})

  const setLoading = (key: string, loading: boolean) => {
    setLoadingStates(prev => ({
      ...prev,
      [key]: loading
    }))
  }

  const isLoading = (key: string) => {
    return loadingStates[key] ?? false
  }

  const isAnyLoading = () => {
    return Object.values(loadingStates).some(Boolean)
  }

  return (
    <LoadingContext.Provider value={{
      loadingStates,
      setLoading,
      isLoading,
      isAnyLoading
    }}>
      {children}
      {isAnyLoading() && <GlobalLoadingIndicator />}
    </LoadingContext.Provider>
  )
}

function GlobalLoadingIndicator() {
  return (
    <div className="fixed top-0 left-0 w-full h-1 z-50">
      <div className="h-full bg-blue-600 animate-pulse" />
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white to-transparent animate-shimmer" />
    </div>
  )
}

export function useLoading() {
  const context = useContext(LoadingContext)
  if (!context) {
    throw new Error('useLoading must be used within LoadingProvider')
  }
  return context
}

// Spinner Components
export function Spinner({ size = 'md', className = '' }: { 
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string 
}) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  }

  return (
    <div className={`${sizeClasses[size]} ${className}`}>
      <div className="animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" />
    </div>
  )
}

export function LoadingButton({ 
  loading, 
  children, 
  className = '', 
  disabled = false,
  ...props 
}: {
  loading: boolean
  children: ReactNode
  className?: string
  disabled?: boolean
  [key: string]: any
}) {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={`
        relative inline-flex items-center justify-center
        ${loading ? 'cursor-not-allowed opacity-75' : ''}
        ${className}
      `}
    >
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Spinner size="sm" />
        </div>
      )}
      <span className={loading ? 'opacity-0' : ''}>
        {children}
      </span>
    </button>
  )
}

export function LoadingCard({ 
  loading, 
  children, 
  className = '',
  fallback
}: {
  loading: boolean
  children: ReactNode
  className?: string
  fallback?: ReactNode
}) {
  if (loading) {
    return (
      <div className={`animate-pulse ${className}`}>
        {fallback || <SkeletonCard />}
      </div>
    )
  }

  return <div className={className}>{children}</div>
}

export function SkeletonCard() {
  return (
    <div className="space-y-4 p-6 bg-white rounded-lg border">
      <div className="h-4 bg-gray-200 rounded w-3/4" />
      <div className="space-y-2">
        <div className="h-3 bg-gray-200 rounded" />
        <div className="h-3 bg-gray-200 rounded w-5/6" />
      </div>
      <div className="flex space-x-2">
        <div className="h-8 bg-gray-200 rounded w-20" />
        <div className="h-8 bg-gray-200 rounded w-16" />
      </div>
    </div>
  )
}

export function SkeletonList({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="animate-pulse flex items-center space-x-4 p-4 bg-white rounded-lg border">
          <div className="w-10 h-10 bg-gray-200 rounded-full" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4" />
            <div className="h-3 bg-gray-200 rounded w-1/2" />
          </div>
        </div>
      ))}
    </div>
  )
}

export function LoadingOverlay({ 
  loading, 
  children, 
  message = 'Loading...',
  className = ''
}: {
  loading: boolean
  children: ReactNode
  message?: string
  className?: string
}) {
  return (
    <div className={`relative ${className}`}>
      {children}
      {loading && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
          <div className="flex flex-col items-center space-y-2">
            <Spinner size="lg" />
            <p className="text-gray-600 text-sm">{message}</p>
          </div>
        </div>
      )}
    </div>
  )
}

// Hook for managing async operations
export function useAsyncOperation() {
  const { setLoading } = useLoading()

  const execute = async <T,>(
    key: string,
    operation: () => Promise<T>,
    options?: {
      onSuccess?: (result: T) => void
      onError?: (error: Error) => void
    }
  ): Promise<T | null> => {
    try {
      setLoading(key, true)
      const result = await operation()
      options?.onSuccess?.(result)
      return result
    } catch (error) {
      console.error(`Operation ${key} failed:`, error)
      options?.onError?.(error as Error)
      return null
    } finally {
      setLoading(key, false)
    }
  }

  return { execute }
}
