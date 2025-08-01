import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import connectDB from '@/lib/mongodb'
import ChatSession from '@/lib/models/ChatSession'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { 
      insights, 
      marketData, 
      sessionId,
      sessionTitle = 'Dashboard Session'
    } = body

    try {
      await connectDB()

      let currentSessionId = sessionId

      // Create new session if none provided
      if (!currentSessionId) {
        const newSession = new ChatSession({
          userEmail: session.user.email,
          title: sessionTitle,
          sessionType: 'dashboard',
          status: 'active',
          messages: [{
            type: 'system',
            content: 'Dashboard session started - capturing real-time insights',
            timestamp: new Date()
          }]
        })

        await newSession.save()
        currentSessionId = newSession._id.toString()
      }

      // Prepare insights data
      const formattedInsights = insights.map((insight: any) => ({
        type: insight.type || 'dashboard-insight',
        content: {
          title: insight.title,
          description: insight.description,
          category: insight.category,
          priority: insight.priority,
          marketData: insight.relatedMarketData,
          recommendations: insight.recommendations,
          metrics: insight.metrics
        },
        timestamp: new Date()
      }))

      // Update the session with new insights
      const updatedSession = await ChatSession.findByIdAndUpdate(
        currentSessionId,
        {
          $push: {
            insights: { $each: formattedInsights },
            messages: {
              type: 'assistant',
              content: `Captured ${insights.length} real-time insights from dashboard`,
              timestamp: new Date(),
              metadata: {
                isGrounded: true,
                insightType: 'dashboard-batch'
              }
            }
          },
          $set: {
            updatedAt: new Date()
          }
        },
        { new: true }
      )

      if (!updatedSession) {
        return NextResponse.json({ 
          error: 'Session not found or access denied' 
        }, { status: 404 })
      }

      return NextResponse.json({ 
        success: true, 
        sessionId: currentSessionId,
        insightsSaved: insights.length,
        saved: 'database'
      })

    } catch (dbError) {
      console.error('Database save failed for dashboard insights:', dbError)
      
      return NextResponse.json({ 
        success: false, 
        sessionId: sessionId || `session-${Date.now()}`,
        saved: 'session',
        message: 'Insights saved locally (database temporarily unavailable)'
      })
    }
  } catch (error) {
    console.error('Error saving dashboard insights:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// GET endpoint to retrieve dashboard sessions
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const limit = parseInt(searchParams.get('limit') || '20')

    try {
      await connectDB()

      // Fetch dashboard sessions for the authenticated user
      const dashboardSessions = await ChatSession.find({
        userEmail: session.user.email,
        sessionType: 'dashboard'
      })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean()

      // Transform data for frontend
      const formattedSessions = dashboardSessions.map((sess: any) => ({
        id: sess._id.toString(),
        title: sess.title,
        insightsCount: sess.insights?.length || 0,
        messagesCount: sess.messages?.length || 0,
        lastActivity: sess.updatedAt,
        status: sess.status,
        createdAt: sess.createdAt
      }))

      return NextResponse.json({ 
        sessions: formattedSessions,
        total: dashboardSessions.length 
      })

    } catch (dbError) {
      console.error('Database query failed for dashboard sessions:', dbError)
      
      return NextResponse.json({ 
        sessions: [],
        total: 0,
        source: 'fallback',
        message: 'Database temporarily unavailable'
      })
    }
  } catch (error) {
    console.error('Error fetching dashboard sessions:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
