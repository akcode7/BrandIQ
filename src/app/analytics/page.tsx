'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import LoadingState from '@/components/demo/LoadingState'

interface AnalyticsData {
  totalConversations: number
  averageImprovement: number
  topPerformingCategories: Array<{
    category: string
    averageScore: number
    count: number
  }>
  improvementTrend: Array<{
    date: string
    score: number
  }>
  metrics: {
    specificityTrend: number[]
    actionabilityTrend: number[]
    culturalRelevanceTrend: number[]
  }
}

export default function Analytics() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/')
    } else if (status === 'authenticated') {
      fetchAnalytics()
    }
  }, [status, router])

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/analytics')
      if (response.ok) {
        const data = await response.json()
        setAnalytics(data)
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (status === 'loading' || isLoading) {
    return <LoadingState message="Loading analytics..." />
  }

  if (status === 'unauthenticated') {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Performance Analytics
          </h1>
          <p className="text-gray-600">
            Track your LLM grounding improvements over time
          </p>
        </div>

        {analytics ? (
          <div className="space-y-8">
            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-100 rounded-md flex items-center justify-center">
                      <span className="text-blue-600 text-xl">📊</span>
                    </div>
                  </div>
                  <div className="ml-5">
                    <p className="text-sm font-medium text-gray-500">Total Sessions</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {analytics.totalConversations}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-green-100 rounded-md flex items-center justify-center">
                      <span className="text-green-600 text-xl">📈</span>
                    </div>
                  </div>
                  <div className="ml-5">
                    <p className="text-sm font-medium text-gray-500">Avg. Improvement</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {analytics.averageImprovement}%
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-purple-100 rounded-md flex items-center justify-center">
                      <span className="text-purple-600 text-xl">🎯</span>
                    </div>
                  </div>
                  <div className="ml-5">
                    <p className="text-sm font-medium text-gray-500">Best Category</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {analytics.topPerformingCategories[0]?.category || 'N/A'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-yellow-100 rounded-md flex items-center justify-center">
                      <span className="text-yellow-600 text-xl">⚡</span>
                    </div>
                  </div>
                  <div className="ml-5">
                    <p className="text-sm font-medium text-gray-500">Score Trend</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {analytics.improvementTrend.length > 1 
                        ? analytics.improvementTrend[analytics.improvementTrend.length - 1].score > 
                          analytics.improvementTrend[analytics.improvementTrend.length - 2].score 
                          ? '↗️' : '↘️'
                        : '→'
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Improvement Trend Chart */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Improvement Trend</h3>
              <div className="h-64 flex items-end justify-between space-x-2">
                {analytics.improvementTrend.slice(-10).map((point, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <div 
                      className="bg-blue-500 rounded-t w-8 transition-all duration-300"
                      style={{ height: `${(point.score / 100) * 200}px` }}
                    ></div>
                    <span className="text-xs text-gray-500 mt-2 transform -rotate-45">
                      {new Date(point.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Metrics Breakdown */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Specificity Scores</h3>
                <div className="space-y-3">
                  {analytics.metrics.specificityTrend.slice(-5).map((score, index) => (
                    <div key={index} className="flex items-center">
                      <span className="text-sm text-gray-500 w-12">#{index + 1}</span>
                      <div className="flex-1 bg-gray-200 rounded-full h-2 mx-3">
                        <div 
                          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${score}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900 w-10">{score}%</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Actionability Scores</h3>
                <div className="space-y-3">
                  {analytics.metrics.actionabilityTrend.slice(-5).map((score, index) => (
                    <div key={index} className="flex items-center">
                      <span className="text-sm text-gray-500 w-12">#{index + 1}</span>
                      <div className="flex-1 bg-gray-200 rounded-full h-2 mx-3">
                        <div 
                          className="bg-green-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${score}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900 w-10">{score}%</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Cultural Relevance</h3>
                <div className="space-y-3">
                  {analytics.metrics.culturalRelevanceTrend.slice(-5).map((score, index) => (
                    <div key={index} className="flex items-center">
                      <span className="text-sm text-gray-500 w-12">#{index + 1}</span>
                      <div className="flex-1 bg-gray-200 rounded-full h-2 mx-3">
                        <div 
                          className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${score}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900 w-10">{score}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Top Performing Categories */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Top Performing Categories</h3>
              <div className="space-y-4">
                {analytics.topPerformingCategories.map((category, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900">{category.category}</h4>
                      <p className="text-sm text-gray-500">{category.count} conversations</p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold text-green-600">{category.averageScore}%</div>
                      <div className="text-sm text-gray-500">avg. score</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-600 mb-2">No analytics data yet</h3>
            <p className="text-gray-500 mb-4">
              Start using the interactive demo to generate analytics data.
            </p>
            <button
              onClick={() => router.push('/#demo')}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Try Demo
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
