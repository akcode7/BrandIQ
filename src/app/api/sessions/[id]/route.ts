import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import connectDB from '@/lib/mongodb'
import ChatSession from '@/lib/models/ChatSession'
import ActionPlan from '@/lib/models/ActionPlan'

// GET specific session
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const sessionId = params.id

    try {
      await connectDB()

      // Fetch specific session for the authenticated user
      const chatSession = await ChatSession.findOne({
        _id: sessionId,
        userEmail: session.user.email
      }).lean() as any

      if (!chatSession) {
        return NextResponse.json({ 
          error: 'Session not found or access denied' 
        }, { status: 404 })
      }

      // Fetch related action plans if any
      const actionPlanIds = [
        ...(chatSession.marketingTasks?.flatMap((task: any) => task.actionPlans) || []),
        ...(chatSession.insights?.map((insight: any) => insight.actionPlanId).filter(Boolean) || [])
      ]

      let actionPlans: any[] = []
      if (actionPlanIds.length > 0) {
        actionPlans = await ActionPlan.find({
          _id: { $in: actionPlanIds },
          userEmail: session.user.email
        }).lean()
      }

      // Transform data for frontend
      const formattedSession = {
        id: chatSession._id.toString(),
        title: chatSession.title,
        query: chatSession.query,
        sessionType: chatSession.sessionType,
        status: chatSession.status,
        metrics: chatSession.metrics,
        qlooData: chatSession.qlooData,
        marketingTasks: chatSession.marketingTasks,
        insights: chatSession.insights,
        messages: chatSession.messages,
        actionPlans: actionPlans.map((plan: any) => ({
          id: plan._id.toString(),
          title: plan.title,
          description: plan.description,
          category: plan.category,
          status: plan.status,
          progress: plan.progress,
          createdAt: plan.createdAt
        })),
        createdAt: chatSession.createdAt,
        updatedAt: chatSession.updatedAt
      }

      return NextResponse.json({ 
        session: formattedSession
      })

    } catch (dbError) {
      console.error('Database query failed for session:', dbError)
      
      return NextResponse.json({ 
        error: 'Database temporarily unavailable'
      }, { status: 503 })
    }
  } catch (error) {
    console.error('Error fetching session:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT - Update session
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const sessionId = params.id
    const body = await req.json()
    const { updates } = body

    try {
      await connectDB()

      // Update session - ensure user owns it
      const updatedSession = await ChatSession.findOneAndUpdate(
        { 
          _id: sessionId, 
          userEmail: session.user.email 
        },
        { 
          ...updates,
          updatedAt: new Date()
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
        session: {
          id: updatedSession._id.toString(),
          title: updatedSession.title,
          status: updatedSession.status,
          updatedAt: updatedSession.updatedAt
        }
      })
    } catch (dbError) {
      console.error('Database update failed for session:', dbError)
      
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to update session'
      }, { status: 500 })
    }
  } catch (error) {
    console.error('Error updating session:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE session
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const sessionId = params.id

    try {
      await connectDB()

      // Delete session - ensure user owns it
      const deletedSession = await ChatSession.findOneAndDelete({
        _id: sessionId,
        userEmail: session.user.email
      })

      if (!deletedSession) {
        return NextResponse.json({ 
          error: 'Session not found or access denied' 
        }, { status: 404 })
      }

      return NextResponse.json({ 
        success: true, 
        message: 'Session deleted successfully'
      })
    } catch (dbError) {
      console.error('Database delete failed for session:', dbError)
      
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to delete session'
      }, { status: 500 })
    }
  } catch (error) {
    console.error('Error deleting session:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
