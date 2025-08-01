'use client'

import { useEffect, useState } from 'react'
import { PerformanceMonitor, Analytics, logger } from '@/lib/monitoring'

interface PerformanceMetrics {
  pageLoadTime: number
  firstContentfulPaint: number
  largestContentfulPaint: number
  cumulativeLayoutShift: number
  firstInputDelay: number
}

export default function PerformanceOptimizer() {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null)

  useEffect(() => {
    // Track page performance
    const trackPerformance = () => {
      if (typeof window !== 'undefined' && 'performance' in window) {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
        const paint = performance.getEntriesByType('paint')
        
        const pageLoadTime = navigation.loadEventEnd - navigation.loadEventStart
        const firstContentfulPaint = paint.find(entry => entry.name === 'first-contentful-paint')?.startTime || 0
        
        const performanceMetrics: PerformanceMetrics = {
          pageLoadTime,
          firstContentfulPaint,
          largestContentfulPaint: 0, // Will be updated by observer
          cumulativeLayoutShift: 0,  // Will be updated by observer
          firstInputDelay: 0         // Will be updated by observer
        }

        setMetrics(performanceMetrics)
        
        // Log performance metrics
        logger.info('Page performance measured', performanceMetrics)
        
        // Track analytics
        Analytics.track('page_performance', performanceMetrics)
      }
    }

    // Observe Core Web Vitals
    const observeWebVitals = () => {
      if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
        // Largest Contentful Paint
        try {
          const lcpObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries()
            const lastEntry = entries[entries.length - 1] as PerformanceEntry
            
            setMetrics(prev => prev ? {
              ...prev,
              largestContentfulPaint: lastEntry.startTime
            } : null)
            
            Analytics.track('lcp_measured', { value: lastEntry.startTime })
          })
          lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })
        } catch (error) {
          logger.warn('LCP observation failed', { error: (error as Error).message })
        }

        // Cumulative Layout Shift
        try {
          const clsObserver = new PerformanceObserver((list) => {
            let clsValue = 0
            for (const entry of list.getEntries()) {
              if (!(entry as any).hadRecentInput) {
                clsValue += (entry as any).value
              }
            }
            
            setMetrics(prev => prev ? {
              ...prev,
              cumulativeLayoutShift: clsValue
            } : null)
            
            Analytics.track('cls_measured', { value: clsValue })
          })
          clsObserver.observe({ entryTypes: ['layout-shift'] })
        } catch (error) {
          logger.warn('CLS observation failed', { error: (error as Error).message })
        }

        // First Input Delay
        try {
          const fidObserver = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
              const fid = (entry as any).processingStart - entry.startTime
              
              setMetrics(prev => prev ? {
                ...prev,
                firstInputDelay: fid
              } : null)
              
              Analytics.track('fid_measured', { value: fid })
            }
          })
          fidObserver.observe({ entryTypes: ['first-input'] })
        } catch (error) {
          logger.warn('FID observation failed', { error: (error as Error).message })
        }
      }
    }

    // Track resource loading
    const trackResourceLoading = () => {
      if (typeof window !== 'undefined') {
        const resources = performance.getEntriesByType('resource')
        
        resources.forEach((resource) => {
          const resourceTiming = resource as PerformanceResourceTiming
          
          if (resourceTiming.transferSize > 0) {
            const loadTime = resourceTiming.responseEnd - resourceTiming.requestStart
            
            if (loadTime > 1000) { // Log slow resources (>1s)
              logger.warn('Slow resource detected', {
                name: resourceTiming.name,
                loadTime,
                size: resourceTiming.transferSize
              })
            }
          }
        })
      }
    }

    // Initialize performance tracking
    setTimeout(() => {
      trackPerformance()
      observeWebVitals()
      trackResourceLoading()
    }, 1000)

    // Track user interactions
    const trackInteraction = (event: string) => {
      return () => {
        const timer = PerformanceMonitor.startTimer(`interaction_${event}`)
        
        // End timer on next tick
        setTimeout(() => {
          timer()
        }, 0)
        
        Analytics.track(`user_interaction`, { type: event })
      }
    }

    // Add interaction listeners
    const clickHandler = trackInteraction('click')
    const scrollHandler = trackInteraction('scroll')
    
    document.addEventListener('click', clickHandler)
    document.addEventListener('scroll', scrollHandler, { passive: true })

    return () => {
      document.removeEventListener('click', clickHandler)
      document.removeEventListener('scroll', scrollHandler)
    }
  }, [])

  // Development only - show performance overlay
  if (process.env.NODE_ENV === 'development' && metrics) {
    return (
      <div className="fixed bottom-4 right-4 bg-black bg-opacity-80 text-white p-3 rounded-lg text-xs font-mono z-50 max-w-xs">
        <div className="font-bold mb-2">Performance Metrics</div>
        <div>Page Load: {metrics.pageLoadTime.toFixed(0)}ms</div>
        <div>FCP: {metrics.firstContentfulPaint.toFixed(0)}ms</div>
        <div>LCP: {metrics.largestContentfulPaint.toFixed(0)}ms</div>
        <div>CLS: {metrics.cumulativeLayoutShift.toFixed(3)}</div>
        <div>FID: {metrics.firstInputDelay.toFixed(0)}ms</div>
        
        <div className="mt-2 text-xs">
          <div className={`${metrics.firstContentfulPaint < 2000 ? 'text-green-400' : 'text-red-400'}`}>
            FCP: {metrics.firstContentfulPaint < 2000 ? 'Good' : 'Poor'}
          </div>
          <div className={`${metrics.largestContentfulPaint < 2500 ? 'text-green-400' : 'text-red-400'}`}>
            LCP: {metrics.largestContentfulPaint < 2500 ? 'Good' : 'Poor'}
          </div>
          <div className={`${metrics.cumulativeLayoutShift < 0.1 ? 'text-green-400' : 'text-red-400'}`}>
            CLS: {metrics.cumulativeLayoutShift < 0.1 ? 'Good' : 'Poor'}
          </div>
        </div>
      </div>
    )
  }

  return null
}

// Hook for tracking component performance
export function usePerformanceTracking(componentName: string) {
  useEffect(() => {
    const timer = PerformanceMonitor.startTimer(`component_${componentName}`)
    
    return () => {
      timer()
    }
  }, [componentName])
}

// Higher-order component for performance tracking
export function withPerformanceTracking<T extends object>(
  Component: React.ComponentType<T>,
  componentName: string
) {
  return function PerformanceTrackedComponent(props: T) {
    usePerformanceTracking(componentName)
    return <Component {...props} />
  }
}
