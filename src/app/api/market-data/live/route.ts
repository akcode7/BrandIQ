import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

// Simulated live market data - in production, this would connect to real data sources
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Simulate real-time market data
    const marketData = {
      industry: 'Technology',
      trends: [
        {
          keyword: 'ai automation',
          score: Math.floor(Math.random() * 40) + 60, // 60-100
          change: Math.floor(Math.random() * 30) - 15, // -15 to +15
          category: Math.random() > 0.5 ? 'rising' : 'falling',
          timeframe: '24h'
        },
        {
          keyword: 'sustainable tech',
          score: Math.floor(Math.random() * 40) + 50, // 50-90
          change: Math.floor(Math.random() * 20) - 10,
          category: 'rising',
          timeframe: '7d'
        },
        {
          keyword: 'remote collaboration',
          score: Math.floor(Math.random() * 30) + 45, // 45-75
          change: Math.floor(Math.random() * 25) - 12,
          category: Math.random() > 0.3 ? 'stable' : 'falling',
          timeframe: '24h'
        },
        {
          keyword: 'data privacy',
          score: Math.floor(Math.random() * 35) + 65, // 65-100
          change: Math.floor(Math.random() * 18) - 9,
          category: 'rising',
          timeframe: '30d'
        }
      ],
      sentiment: {
        positive: Math.floor(Math.random() * 30) + 55, // 55-85%
        neutral: Math.floor(Math.random() * 20) + 15, // 15-35%
        negative: Math.floor(Math.random() * 15) + 5, // 5-20%
        overallScore: Math.floor(Math.random() * 25) + 70, // 70-95
        keyTopics: ['innovation', 'sustainability', 'user experience', 'automation', 'security']
      },
      competitorActivity: [
        {
          name: 'TechCorp Inc.',
          activity: 'Launched AI-powered customer service bot',
          impact: 'high',
          timestamp: new Date(Date.now() - Math.floor(Math.random() * 6) * 60 * 60 * 1000) // Random 0-6 hours ago
        },
        {
          name: 'InnovateLabs',
          activity: 'Partnership with sustainability nonprofit',
          impact: 'medium',
          timestamp: new Date(Date.now() - Math.floor(Math.random() * 12) * 60 * 60 * 1000) // Random 0-12 hours ago
        },
        {
          name: 'FutureTech Solutions',
          activity: 'New data privacy certification',
          impact: 'medium',
          timestamp: new Date(Date.now() - Math.floor(Math.random() * 24) * 60 * 60 * 1000) // Random 0-24 hours ago
        }
      ],
      brandMentions: [
        {
          source: 'Twitter',
          content: 'Impressed with the latest tech innovations!',
          sentiment: 'positive',
          reach: Math.floor(Math.random() * 5000) + 1000,
          timestamp: new Date(Date.now() - Math.floor(Math.random() * 60) * 60 * 1000) // Random 0-60 minutes ago
        },
        {
          source: 'LinkedIn',
          content: 'Great thought leadership content on AI trends',
          sentiment: 'positive',
          reach: Math.floor(Math.random() * 3000) + 500,
          timestamp: new Date(Date.now() - Math.floor(Math.random() * 120) * 60 * 1000) // Random 0-120 minutes ago
        },
        {
          source: 'Reddit',
          content: 'Need better documentation for this tool',
          sentiment: 'neutral',
          reach: Math.floor(Math.random() * 2000) + 200,
          timestamp: new Date(Date.now() - Math.floor(Math.random() * 180) * 60 * 1000) // Random 0-180 minutes ago
        }
      ],
      lastUpdated: new Date(),
      realTimeMetrics: {
        websiteTraffic: {
          current: Math.floor(Math.random() * 1000) + 500,
          change: Math.floor(Math.random() * 40) - 20 // -20% to +20%
        },
        socialEngagement: {
          current: Math.floor(Math.random() * 500) + 100,
          change: Math.floor(Math.random() * 60) - 30
        },
        brandSentiment: {
          score: Math.floor(Math.random() * 20) + 75, // 75-95
          change: Math.floor(Math.random() * 10) - 5
        }
      }
    }

    return NextResponse.json(marketData)
  } catch (error) {
    console.error('Market data API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch market data' },
      { status: 500 }
    )
  }
}
