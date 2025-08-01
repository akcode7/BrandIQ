import { NextRequest, NextResponse } from 'next/server'

export class AppError extends Error {
  statusCode: number
  isOperational: boolean

  constructor(message: string, statusCode: number = 500) {
    super(message)
    this.statusCode = statusCode
    this.isOperational = true

    Error.captureStackTrace(this, this.constructor)
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400)
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication required') {
    super(message, 401)
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = 'Insufficient permissions') {
    super(message, 403)
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'Resource not found') {
    super(message, 404)
  }
}

export class RateLimitError extends AppError {
  constructor(message: string = 'Too many requests') {
    super(message, 429)
  }
}

export class UserError extends AppError {
  constructor(message: string, statusCode: number = 400) {
    super(message, statusCode)
  }
}

// Input validation utility
interface ValidationRule {
  type: 'string' | 'number' | 'email' | 'boolean'
  required?: boolean
  minLength?: number
  maxLength?: number
  min?: number
  max?: number
}

interface ValidationSchema {
  [key: string]: ValidationRule
}

export function validateInput(data: any, schema: ValidationSchema): any {
  const validated: any = {}
  const errors: string[] = []

  for (const [field, rule] of Object.entries(schema)) {
    const value = data[field]

    // Check required fields
    if (rule.required && (value === undefined || value === null || value === '')) {
      errors.push(`${field} is required`)
      continue
    }

    // Skip validation if field is not required and empty
    if (!rule.required && (value === undefined || value === null || value === '')) {
      continue
    }

    // Type validation
    switch (rule.type) {
      case 'string':
        if (typeof value !== 'string') {
          errors.push(`${field} must be a string`)
          break
        }
        if (rule.minLength && value.length < rule.minLength) {
          errors.push(`${field} must be at least ${rule.minLength} characters`)
        }
        if (rule.maxLength && value.length > rule.maxLength) {
          errors.push(`${field} must be no more than ${rule.maxLength} characters`)
        }
        validated[field] = value.trim()
        break

      case 'email':
        if (typeof value !== 'string') {
          errors.push(`${field} must be a string`)
          break
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(value)) {
          errors.push(`${field} must be a valid email address`)
        }
        validated[field] = value.toLowerCase().trim()
        break

      case 'number':
        const num = Number(value)
        if (isNaN(num)) {
          errors.push(`${field} must be a number`)
          break
        }
        if (rule.min !== undefined && num < rule.min) {
          errors.push(`${field} must be at least ${rule.min}`)
        }
        if (rule.max !== undefined && num > rule.max) {
          errors.push(`${field} must be no more than ${rule.max}`)
        }
        validated[field] = num
        break

      case 'boolean':
        if (typeof value !== 'boolean') {
          errors.push(`${field} must be a boolean`)
        }
        validated[field] = Boolean(value)
        break
    }
  }

  if (errors.length > 0) {
    throw new ValidationError(errors.join(', '))
  }

  return validated
}

export function handleApiError(error: any): NextResponse {
  console.error('API Error:', error)

  // Log error details for monitoring
  const errorLog = {
    message: error.message,
    stack: error.stack,
    timestamp: new Date().toISOString(),
    type: error.constructor.name
  }

  // In production, you'd send this to a monitoring service
  if (process.env.NODE_ENV === 'production') {
    // logToMonitoringService(errorLog)
  }

  if (error instanceof AppError) {
    return NextResponse.json(
      { 
        error: error.message,
        code: error.constructor.name
      },
      { status: error.statusCode }
    )
  }

  // Unexpected errors
  return NextResponse.json(
    { 
      error: process.env.NODE_ENV === 'production' 
        ? 'Internal server error' 
        : error.message,
      code: 'InternalServerError'
    },
    { status: 500 }
  )
}

export function asyncHandler(fn: Function) {
  return (req: NextRequest, ...args: any[]) => {
    return Promise.resolve(fn(req, ...args)).catch((error) => {
      return handleApiError(error)
    })
  }
}

// Rate limiting utility
const rateLimitMap = new Map()

export function rateLimit(identifier: string, limit: number = 100, windowMs: number = 15 * 60 * 1000) {
  const now = Date.now()
  const windowStart = now - windowMs

  if (!rateLimitMap.has(identifier)) {
    rateLimitMap.set(identifier, [])
  }

  const requests = rateLimitMap.get(identifier)
  
  // Remove old requests outside the window
  const validRequests = requests.filter((timestamp: number) => timestamp > windowStart)
  
  if (validRequests.length >= limit) {
    throw new RateLimitError(`Rate limit exceeded. Max ${limit} requests per ${windowMs/1000/60} minutes.`)
  }

  validRequests.push(now)
  rateLimitMap.set(identifier, validRequests)

  return {
    remaining: limit - validRequests.length,
    resetTime: windowStart + windowMs
  }
}

// Input validation helper
export function validateRequired(data: any, fields: string[]): void {
  const missing = fields.filter(field => !data[field])
  
  if (missing.length > 0) {
    throw new ValidationError(`Missing required fields: ${missing.join(', ')}`)
  }
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .trim()
    .substring(0, 1000) // Limit length
}

// Performance monitoring
export function performanceTimer(label: string) {
  const start = performance.now()
  
  return {
    end: () => {
      const duration = performance.now() - start
      console.log(`[Performance] ${label}: ${duration.toFixed(2)}ms`)
      return duration
    }
  }
}
