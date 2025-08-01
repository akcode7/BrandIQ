import { useEffect, useState } from 'react'
import { TrendingUp, TrendingDown, Minus, AlertTriangle, Target, Lightbulb, Clock, Zap } from 'lucide-react'
import QlooMarketingTasks from './QlooMarketingTasks'

interface MarketData {
  trends: Array<{
    keyword: string
    score: number
    change: number
    category: 'rising' | 'falling' | 'stable'
    timeframe: string
  }>
  sentiment: {
    positive: number
    neutral: number
    negative: number
    overallScore: number
    keyTopics: string[]
  }
  competitorActivity: Array<{
    name: string
    activity: string
    impact: 'high' | 'medium' | 'low'
    timestamp: Date
  }>
  realTimeMetrics: {
    websiteTraffic: { current: number; change: number }
    socialEngagement: { current: number; change: number }
    brandSentiment: { score: number; change: number }
  }
  lastUpdated: Date
}

interface PersonalizedInsight {
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

interface RealTimeDashboardProps {
  userId?: string
}

export default function RealTimeDashboard({ userId }: RealTimeDashboardProps) {
  const [marketData, setMarketData] = useState<MarketData | null>(null)
  const [insights, setInsights] = useState<PersonalizedInsight[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null)
  const [lastSaveTime, setLastSaveTime] = useState<Date | null>(null)

  useEffect(() => {
    fetchMarketData()
    fetchPersonalizedInsights()
    
    // Set up real-time updates every 30 seconds
    const interval = setInterval(() => {
      fetchMarketData()
    }, 30000)

    // Fetch insights every 5 minutes
    const insightsInterval = setInterval(() => {
      fetchPersonalizedInsights()
    }, 300000)

    return () => {
      clearInterval(interval)
      clearInterval(insightsInterval)
    }
  }, [userId])

  const fetchMarketData = async () => {
    try {
      const response = await fetch('/api/market-data/live')
      if (response.ok) {
        const data = await response.json()
        setMarketData(data)
        setLastUpdate(new Date())
      }
    } catch (error) {
      console.error('Failed to fetch market data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchPersonalizedInsights = async () => {
    try {
      const response = await fetch('/api/insights/personalized', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, preferences: {} })
      })
      if (response.ok) {
        const data = await response.json()
        setInsights(data.insights)
        
        // Auto-save insights to conversation history
        await saveDashboardInsights(data.insights)
      }
    } catch (error) {
      console.error('Failed to fetch insights:', error)
    }
  }

  const saveDashboardInsights = async (insightsData: PersonalizedInsight[]) => {
    try {
      const response = await fetch('/api/dashboard/insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          insights: insightsData,
          marketData,
          sessionId: currentSessionId,
          sessionTitle: `Dashboard Session - ${new Date().toLocaleDateString()}`
        })
      })
      
      if (response.ok) {
        const data = await response.json()
        if (data.sessionId && !currentSessionId) {
          setCurrentSessionId(data.sessionId)
        }
        setLastSaveTime(new Date())
        
        console.log(`✅ Dashboard insights saved:`)
        console.log(`📝 Session ID: ${data.sessionId}`)
        console.log(`📊 Insights: ${data.insightsSaved} saved`)
        console.log(`💾 Storage: ${data.saved}`)
      }
    } catch (error) {
      console.error('Failed to save dashboard insights:', error)
    }
  }

  const getTrendIcon = (category: string) => {
    switch (category) {
      case 'rising': return <TrendingUp className="w-4 h-4 text-green-500" />
      case 'falling': return <TrendingDown className="w-4 h-4 text-red-500" />
      default: return <Minus className="w-4 h-4 text-gray-500" />
    }
  }

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'opportunity': return <Target className="w-5 h-5 text-green-500" />
      case 'warning': return <AlertTriangle className="w-5 h-5 text-red-500" />
      case 'trend': return <TrendingUp className="w-5 h-5 text-blue-500" />
      case 'recommendation': return <Lightbulb className="w-5 h-5 text-yellow-500" />
      default: return <Target className="w-5 h-5 text-gray-500" />
    }
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-gray-200 h-32 rounded-lg"></div>
          ))}
        </div>
        <div className="bg-gray-200 h-64 rounded-lg"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Real-time Status Bar */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-gray-700">Live Market Data</span>
          </div>
          <span className="text-xs text-gray-500">
            Last updated: {lastUpdate.toLocaleTimeString()}
          </span>
        </div>
      </div>

      {/* Qloo Marketing Tasks */}
      <QlooMarketingTasks />

      {/* Real-time Metrics */}
      {marketData?.realTimeMetrics && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Website Traffic</p>
                <p className="text-2xl font-bold text-gray-900">
                  {marketData.realTimeMetrics.websiteTraffic.current.toLocaleString()}
                </p>
              </div>
              <div className={`text-sm font-medium ${
                marketData.realTimeMetrics.websiteTraffic.change >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {marketData.realTimeMetrics.websiteTraffic.change >= 0 ? '+' : ''}
                {marketData.realTimeMetrics.websiteTraffic.change}%
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Social Engagement</p>
                <p className="text-2xl font-bold text-gray-900">
                  {marketData.realTimeMetrics.socialEngagement.current.toLocaleString()}
                </p>
              </div>
              <div className={`text-sm font-medium ${
                marketData.realTimeMetrics.socialEngagement.change >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {marketData.realTimeMetrics.socialEngagement.change >= 0 ? '+' : ''}
                {marketData.realTimeMetrics.socialEngagement.change}%
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Brand Sentiment</p>
                <p className="text-2xl font-bold text-gray-900">
                  {marketData.realTimeMetrics.brandSentiment.score}%
                </p>
              </div>
              <div className={`text-sm font-medium ${
                marketData.realTimeMetrics.brandSentiment.change >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {marketData.realTimeMetrics.brandSentiment.change >= 0 ? '+' : ''}
                {marketData.realTimeMetrics.brandSentiment.change}%
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Trending Keywords */}
      {marketData?.trends && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Trending Keywords</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {marketData.trends.map((trend, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    {getTrendIcon(trend.category)}
                    <div>
                      <p className="font-medium text-gray-900">{trend.keyword}</p>
                      <p className="text-sm text-gray-500">{trend.timeframe}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">{trend.score}</p>
                    <p className={`text-sm ${trend.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {trend.change >= 0 ? '+' : ''}{trend.change}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Personalized Insights */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Personalized Insights</h3>
          <p className="text-sm text-gray-500">AI-powered recommendations based on your data and market trends</p>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {insights.slice(0, 4).map((insight) => (
              <div key={insight.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    {getInsightIcon(insight.type)}
                    <h4 className="font-medium text-gray-900">{insight.title}</h4>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getImpactColor(insight.impact)}`}>
                      {insight.impact} impact
                    </span>
                    <span className="text-xs text-gray-500">Score: {insight.relevanceScore}%</span>
                  </div>
                </div>
                
                <p className="text-gray-600 mb-3">{insight.description}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1 text-sm text-gray-500">
                    <Clock className="w-4 h-4" />
                    <span>{insight.timeframe}</span>
                  </div>
                  <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                    View Actions →
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          {insights.length > 4 && (
            <div className="mt-6 text-center">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                View All {insights.length} Insights
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Market Sentiment */}
      {marketData?.sentiment && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Market Sentiment</h3>
          </div>
          <div className="p-6">
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Overall Score</span>
                <span className="text-2xl font-bold text-gray-900">{marketData.sentiment.overallScore}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${marketData.sentiment.overallScore}%` }}
                ></div>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{marketData.sentiment.positive}%</div>
                <div className="text-sm text-gray-500">Positive</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-600">{marketData.sentiment.neutral}%</div>
                <div className="text-sm text-gray-500">Neutral</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{marketData.sentiment.negative}%</div>
                <div className="text-sm text-gray-500">Negative</div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Key Topics</h4>
              <div className="flex flex-wrap gap-2">
                {marketData.sentiment.keyTopics.map((topic, index) => (
                  <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    {topic}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
