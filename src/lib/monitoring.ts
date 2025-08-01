interface LogEntry {
  timestamp: string
  level: 'info' | 'warn' | 'error' | 'debug'
  message: string
  userId?: string
  requestId?: string
  metadata?: Record<string, any>
}

class Logger {
  private logs: LogEntry[] = []

  private createEntry(
    level: LogEntry['level'], 
    message: string, 
    metadata?: Record<string, any>
  ): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      metadata,
      ...(typeof window !== 'undefined' && {
        requestId: window.crypto?.randomUUID?.() || Math.random().toString(36)
      })
    }
  }

  info(message: string, metadata?: Record<string, any>) {
    const entry = this.createEntry('info', message, metadata)
    this.logs.push(entry)
    console.log(`[INFO] ${message}`, metadata || '')
  }

  warn(message: string, metadata?: Record<string, any>) {
    const entry = this.createEntry('warn', message, metadata)
    this.logs.push(entry)
    console.warn(`[WARN] ${message}`, metadata || '')
  }

  error(message: string, error?: Error, metadata?: Record<string, any>) {
    const entry = this.createEntry('error', message, {
      ...metadata,
      error: error?.message,
      stack: error?.stack
    })
    this.logs.push(entry)
    console.error(`[ERROR] ${message}`, error || '', metadata || '')
  }

  debug(message: string, metadata?: Record<string, any>) {
    if (process.env.NODE_ENV === 'development') {
      const entry = this.createEntry('debug', message, metadata)
      this.logs.push(entry)
      console.debug(`[DEBUG] ${message}`, metadata || '')
    }
  }

  // Get recent logs for debugging
  getRecentLogs(limit: number = 100): LogEntry[] {
    return this.logs.slice(-limit)
  }

  // Clear logs to prevent memory issues
  clearLogs() {
    this.logs = []
  }

  // Send logs to external service (implement as needed)
  async sendToService(entries: LogEntry[]) {
    if (process.env.NODE_ENV === 'production') {
      try {
        // Implementation for external logging service
        // await fetch('/api/logs', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(entries)
        // })
      } catch (error) {
        console.error('Failed to send logs to service:', error)
      }
    }
  }
}

// Create singleton logger instance
export const logger = new Logger()

// Performance monitoring
export class PerformanceMonitor {
  private static metrics: Record<string, number[]> = {}

  static startTimer(label: string): () => number {
    const start = performance.now()
    
    return () => {
      const duration = performance.now() - start
      
      if (!this.metrics[label]) {
        this.metrics[label] = []
      }
      
      this.metrics[label].push(duration)
      
      // Keep only last 100 measurements
      if (this.metrics[label].length > 100) {
        this.metrics[label] = this.metrics[label].slice(-100)
      }
      
      logger.debug(`Performance: ${label}`, { duration: `${duration.toFixed(2)}ms` })
      
      return duration
    }
  }

  static getMetrics(label: string) {
    const measurements = this.metrics[label] || []
    
    if (measurements.length === 0) {
      return null
    }

    const sum = measurements.reduce((a, b) => a + b, 0)
    const avg = sum / measurements.length
    const min = Math.min(...measurements)
    const max = Math.max(...measurements)

    return {
      count: measurements.length,
      average: avg,
      min,
      max,
      latest: measurements[measurements.length - 1]
    }
  }

  static getAllMetrics() {
    const result: Record<string, any> = {}
    
    Object.keys(this.metrics).forEach(label => {
      result[label] = this.getMetrics(label)
    })
    
    return result
  }
}

// Analytics tracking
export class Analytics {
  private static events: Array<{
    event: string
    properties: Record<string, any>
    timestamp: string
    userId?: string
  }> = []

  static track(event: string, properties: Record<string, any> = {}, userId?: string) {
    const entry = {
      event,
      properties,
      timestamp: new Date().toISOString(),
      userId
    }

    this.events.push(entry)
    
    // Keep only last 1000 events
    if (this.events.length > 1000) {
      this.events = this.events.slice(-1000)
    }

    logger.info(`Analytics: ${event}`, { properties, userId })

    // Send to analytics service in production
    if (process.env.NODE_ENV === 'production') {
      this.sendToService(entry)
    }
  }

  static getEvents(limit: number = 100) {
    return this.events.slice(-limit)
  }

  private static async sendToService(entry: any) {
    try {
      // Implementation for analytics service
      // await fetch('/api/analytics/track', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(entry)
      // })
    } catch (error) {
      logger.error('Failed to send analytics event', error as Error)
    }
  }
}

// Error boundary reporting
export function reportError(error: Error, context?: Record<string, any>) {
  logger.error('Unhandled error', error, context)
  
  Analytics.track('error_occurred', {
    message: error.message,
    stack: error.stack,
    context
  })
}
