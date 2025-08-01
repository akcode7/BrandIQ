import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import connectDB from '@/lib/mongodb'
import ChatSession from '@/lib/models/ChatSession'

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()

    // Fetch all conversations for the user
    const conversations = await ChatSession.find({
      userEmail: session.user.email
    }).sort({ createdAt: -1 }).lean()

    if (conversations.length === 0) {
      return NextResponse.json({
        totalConversations: 0,
        averageImprovement: 0,
        topPerformingCategories: [],
        improvementTrend: [],
        metrics: {
          specificityTrend: [],
          actionabilityTrend: [],
          culturalRelevanceTrend: []
        }
      })
    }

    // Calculate analytics
    const totalConversations = conversations.length

    // Calculate average improvement
    const validConversations = conversations.filter(conv => conv.metrics)
    const averageImprovement = validConversations.length > 0 
      ? Math.round(
          validConversations.reduce((acc, conv) => {
            const overall = (conv.metrics.specificity + conv.metrics.actionability + conv.metrics.culturalRelevance) / 3
            return acc + overall
          }, 0) / validConversations.length
        )
      : 0

    // Group by categories (based on query keywords)
    const categoryMap = new Map()
    validConversations.forEach(conv => {
      let category = 'General'
      const query = conv.query?.toLowerCase() || ''
      
      if (query.includes('fashion') || query.includes('clothing')) category = 'Fashion'
      else if (query.includes('food') || query.includes('restaurant')) category = 'Food & Dining'
      else if (query.includes('travel') || query.includes('vacation')) category = 'Travel'
      else if (query.includes('tech') || query.includes('gadget')) category = 'Technology'
      else if (query.includes('health') || query.includes('fitness')) category = 'Health & Fitness'
      else if (query.includes('entertainment') || query.includes('movie')) category = 'Entertainment'

      if (!categoryMap.has(category)) {
        categoryMap.set(category, { scores: [], count: 0 })
      }
      
      const data = categoryMap.get(category)
      const overall = (conv.metrics.specificity + conv.metrics.actionability + conv.metrics.culturalRelevance) / 3
      data.scores.push(overall)
      data.count++
    })

    const topPerformingCategories = Array.from(categoryMap.entries())
      .map(([category, data]) => ({
        category,
        averageScore: Math.round(data.scores.reduce((a: number, b: number) => a + b, 0) / data.scores.length),
        count: data.count
      }))
      .sort((a, b) => b.averageScore - a.averageScore)
      .slice(0, 5)

    // Generate improvement trend (last 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    
    const recentConversations = validConversations.filter(conv => 
      new Date(conv.createdAt) > thirtyDaysAgo
    )

    const improvementTrend = recentConversations
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
      .map(conv => ({
        date: conv.createdAt.toISOString(),
        score: Math.round((conv.metrics.specificity + conv.metrics.actionability + conv.metrics.culturalRelevance) / 3)
      }))

    // Metrics trends
    const metrics = {
      specificityTrend: validConversations.slice(-10).map(conv => conv.metrics.specificity),
      actionabilityTrend: validConversations.slice(-10).map(conv => conv.metrics.actionability),
      culturalRelevanceTrend: validConversations.slice(-10).map(conv => conv.metrics.culturalRelevance)
    }

    return NextResponse.json({
      totalConversations,
      averageImprovement,
      topPerformingCategories,
      improvementTrend,
      metrics
    })
  } catch (error) {
    console.error('Error generating analytics:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
