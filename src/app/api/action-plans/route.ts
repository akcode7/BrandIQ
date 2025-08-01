import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import connectDB from '@/lib/mongodb'
import ActionPlan from '@/lib/models/ActionPlan'
import ChatSession from '@/lib/models/ChatSession'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status')
    const category = searchParams.get('category')
    const limit = parseInt(searchParams.get('limit') || '50')

    try {
      await connectDB()

      // Build query filter
      const filter: any = { userEmail: session.user.email }
      if (status) filter.status = status
      if (category) filter.category = category

      // Fetch action plans for the authenticated user
      const actionPlans = await ActionPlan.find(filter)
        .sort({ createdAt: -1 })
        .limit(limit)
        .lean()

      // Transform data for frontend
      const formattedActionPlans = actionPlans.map((plan: any) => ({
        id: plan._id.toString(),
        title: plan.title,
        description: plan.description,
        category: plan.category,
        source: plan.source,
        sourceData: plan.sourceData,
        steps: plan.steps,
        budget: plan.budget,
        timeline: plan.timeline,
        targets: plan.targets,
        status: plan.status,
        progress: plan.progress,
        tags: plan.tags,
        createdAt: plan.createdAt,
        updatedAt: plan.updatedAt
      }))

      return NextResponse.json({ 
        actionPlans: formattedActionPlans,
        total: actionPlans.length 
      })
    } catch (dbError) {
      console.error('Database connection failed, returning empty action plans:', dbError)
      
      return NextResponse.json({ 
        actionPlans: [],
        total: 0,
        source: 'fallback',
        message: 'Database temporarily unavailable'
      })
    }
  } catch (error) {
    console.error('Error fetching action plans:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const {
      title,
      description,
      category,
      source,
      sourceData,
      steps,
      budget,
      timeline,
      targets,
      tags,
      sessionId // Optional: link to chat session
    } = body

    try {
      await connectDB()

      const newActionPlan = new ActionPlan({
        userEmail: session.user.email,
        title,
        description,
        category,
        source,
        sourceData,
        steps,
        budget,
        timeline,
        targets,
        status: 'draft',
        tags: tags || []
      })

      await newActionPlan.save()

      // If linked to a chat session, update the session
      if (sessionId) {
        try {
          await ChatSession.findByIdAndUpdate(sessionId, {
            $push: {
              insights: {
                type: 'action-plan-created',
                content: {
                  actionPlanId: newActionPlan._id.toString(),
                  title,
                  category
                },
                actionPlanId: newActionPlan._id.toString(),
                timestamp: new Date()
              }
            }
          })
        } catch (sessionError) {
          console.error('Failed to update chat session:', sessionError)
          // Continue anyway - action plan was saved successfully
        }
      }

      return NextResponse.json({ 
        success: true, 
        actionPlanId: newActionPlan._id.toString(),
        saved: 'database'
      })
    } catch (dbError) {
      console.error('Database save failed for action plan:', dbError)
      
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to save action plan',
        message: 'Database temporarily unavailable'
      }, { status: 500 })
    }
  } catch (error) {
    console.error('Error saving action plan:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { actionPlanId, updates } = body

    try {
      await connectDB()

      // Update action plan - ensure user owns it
      const updatedActionPlan = await ActionPlan.findOneAndUpdate(
        { 
          _id: actionPlanId, 
          userEmail: session.user.email 
        },
        { 
          ...updates,
          updatedAt: new Date()
        },
        { new: true }
      )

      if (!updatedActionPlan) {
        return NextResponse.json({ 
          error: 'Action plan not found or access denied' 
        }, { status: 404 })
      }

      return NextResponse.json({ 
        success: true, 
        actionPlan: updatedActionPlan
      })
    } catch (dbError) {
      console.error('Database update failed for action plan:', dbError)
      
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to update action plan'
      }, { status: 500 })
    }
  } catch (error) {
    console.error('Error updating action plan:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
