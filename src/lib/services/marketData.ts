// Real-time market data service
export interface MarketData {
  industry: string
  trends: TrendData[]
  sentiment: SentimentData
  competitorActivity: CompetitorData[]
  brandMentions: BrandMention[]
  lastUpdated: Date
}

export interface TrendData {
  keyword: string
  score: number
  change: number
  category: 'rising' | 'falling' | 'stable'
  timeframe: '24h' | '7d' | '30d'
}

export interface SentimentData {
  positive: number
  neutral: number
  negative: number
  overallScore: number
  keyTopics: string[]
}

export interface CompetitorData {
  name: string
  activity: string
  impact: 'high' | 'medium' | 'low'
  timestamp: Date
}

export interface BrandMention {
  source: string
  content: string
  sentiment: 'positive' | 'neutral' | 'negative'
  reach: number
  timestamp: Date
}

export interface PersonalizedInsight {
  id: string
  type: 'opportunity' | 'warning' | 'trend' | 'recommendation'
  title: string
  description: string
  impact: 'high' | 'medium' | 'low'
  actionItems: string[]
  relevanceScore: number
  timeframe: string
  data: any
}

class MarketDataService {
  private wsConnection: WebSocket | null = null
  private subscribers: Map<string, (data: MarketData) => void> = new Map()

  // Initialize real-time connection
  connect() {
    if (typeof window === 'undefined') return

    try {
      this.wsConnection = new WebSocket(process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8080/market-data')
      
      this.wsConnection.onmessage = (event) => {
        const data = JSON.parse(event.data) as MarketData
        this.subscribers.forEach(callback => callback(data))
      }

      this.wsConnection.onerror = () => {
        console.warn('WebSocket connection failed, falling back to polling')
        this.startPolling()
      }
    } catch (error) {
      console.warn('WebSocket not available, using polling mode')
      this.startPolling()
    }
  }

  // Fallback polling mechanism
  private startPolling() {
    setInterval(() => {
      this.fetchMarketData().then(data => {
        this.subscribers.forEach(callback => callback(data))
      })
    }, 30000) // Poll every 30 seconds
  }

  // Subscribe to real-time updates
  subscribe(id: string, callback: (data: MarketData) => void) {
    this.subscribers.set(id, callback)
    
    // Send initial data
    this.fetchMarketData().then(callback)
    
    return () => this.subscribers.delete(id)
  }

  // Fetch market data from API
  private async fetchMarketData(): Promise<MarketData> {
    try {
      const response = await fetch('/api/market-data/live')
      if (!response.ok) throw new Error('Failed to fetch market data')
      return await response.json()
    } catch (error) {
      console.error('Error fetching market data:', error)
      return this.getMockMarketData()
    }
  }

  // Generate personalized insights based on user data and market trends
  async generatePersonalizedInsights(userId: string, userPreferences: any): Promise<PersonalizedInsight[]> {
    try {
      const response = await fetch('/api/insights/personalized', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, preferences: userPreferences })
      })
      
      if (!response.ok) throw new Error('Failed to generate insights')
      const data = await response.json()
      return data.insights
    } catch (error) {
      console.error('Error generating insights:', error)
      return this.getMockInsights()
    }
  }

  // Mock data for demo purposes
  private getMockMarketData(): MarketData {
    return {
      industry: 'General',
      trends: [
        {
          keyword: 'sustainable brands',
          score: 87,
          change: 12,
          category: 'rising',
          timeframe: '24h'
        },
        {
          keyword: 'ai-powered marketing',
          score: 73,
          change: 8,
          category: 'rising',
          timeframe: '7d'
        },
        {
          keyword: 'influencer partnerships',
          score: 65,
          change: -3,
          category: 'falling',
          timeframe: '24h'
        }
      ],
      sentiment: {
        positive: 68,
        neutral: 25,
        negative: 7,
        overallScore: 81,
        keyTopics: ['innovation', 'sustainability', 'customer experience']
      },
      competitorActivity: [
        {
          name: 'Brand X',
          activity: 'Launched sustainability campaign',
          impact: 'high',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
        },
        {
          name: 'Company Y',
          activity: 'Partnership with tech startup',
          impact: 'medium',
          timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000) // 5 hours ago
        }
      ],
      brandMentions: [
        {
          source: 'Twitter',
          content: 'Great customer service experience!',
          sentiment: 'positive',
          reach: 1250,
          timestamp: new Date(Date.now() - 30 * 60 * 1000) // 30 minutes ago
        }
      ],
      lastUpdated: new Date()
    }
  }

  private getMockInsights(): PersonalizedInsight[] {
    return [
      {
        id: '1',
        type: 'opportunity',
        title: 'Sustainability Trend Surge',
        description: 'Sustainability-focused content is trending 45% higher than last month in your industry.',
        impact: 'high',
        actionItems: [
          'Create content highlighting your eco-friendly practices',
          'Partner with environmental organizations',
          'Launch a sustainability-focused campaign'
        ],
        relevanceScore: 92,
        timeframe: 'Next 2 weeks',
        data: { trendScore: 87, industryAverage: 42 }
      },
      {
        id: '2',
        type: 'warning',
        title: 'Competitor Activity Alert',
        description: 'Three major competitors have launched similar campaigns in the past 48 hours.',
        impact: 'medium',
        actionItems: [
          'Differentiate your messaging',
          'Accelerate your campaign timeline',
          'Focus on unique value propositions'
        ],
        relevanceScore: 78,
        timeframe: 'Immediate action needed',
        data: { competitorCount: 3, timeframe: '48h' }
      },
      {
        id: '3',
        type: 'recommendation',
        title: 'Optimal Posting Time',
        description: 'Your audience is most active between 2-4 PM on weekdays based on recent engagement data.',
        impact: 'medium',
        actionItems: [
          'Schedule posts for 2-4 PM weekdays',
          'Test weekend posting times',
          'Increase posting frequency during peak hours'
        ],
        relevanceScore: 85,
        timeframe: 'Ongoing optimization',
        data: { peakHours: ['14:00', '16:00'], engagementLift: '23%' }
      }
    ]
  }

  disconnect() {
    if (this.wsConnection) {
      this.wsConnection.close()
      this.wsConnection = null
    }
    this.subscribers.clear()
  }
}

export const marketDataService = new MarketDataService()
