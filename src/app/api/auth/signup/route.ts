import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { connectToDatabase } from '@/lib/mongodb'
import { validateInput, UserError } from '@/lib/error-handling'
import { logger } from '@/lib/monitoring'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate input
    const validatedData = validateInput(body, {
      name: { type: 'string', required: true, minLength: 2, maxLength: 50 },
      email: { type: 'email', required: true },
      password: { type: 'string', required: true, minLength: 8, maxLength: 128 }
    })

    const { name, email, password } = validatedData

    // Connect to database
    const client = await connectToDatabase()
    const db = client.db('qloohack')  // Changed to match your MongoDB URI
    const users = db.collection('users')

    // Check if user already exists
    const existingUser = await users.findOne({ email: email.toLowerCase() })
    if (existingUser) {
      throw new UserError('User with this email already exists', 400)
    }

    // Hash password
    const saltRounds = 12
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    // Create user
    const newUser = {
      name: name.trim(),
      email: email.toLowerCase(),
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
      emailVerified: null, // Will be set when email is verified
      image: null,
      role: 'user'
    }

    const result = await users.insertOne(newUser)

    // Log successful signup
    logger.info('User signup successful', {
      userId: result.insertedId,
      email: email.toLowerCase(),
      name: name.trim()
    })

    // Return success response (don't include password)
    const userResponse = {
      id: result.insertedId,
      name: newUser.name,
      email: newUser.email,
      createdAt: newUser.createdAt
    }

    return NextResponse.json({
      success: true,
      message: 'Account created successfully',
      user: userResponse
    }, { status: 201 })

  } catch (error) {
    // Log error
    logger.error(
      'Signup error', 
      error instanceof Error ? error : new Error('Unknown error')
    )

    if (error instanceof UserError) {
      return NextResponse.json({
        success: false,
        message: error.message
      }, { status: error.statusCode })
    }

    return NextResponse.json({
      success: false,
      message: 'Internal server error'
    }, { status: 500 })
  }
}
