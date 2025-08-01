'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import LoadingState from '@/components/demo/LoadingState'
import RealTimeDashboard from '@/components/dashboard/RealTimeDashboard'
import ConversationHistory from '@/components/ConversationHistory'
import { useRealTimeMarketData } from '@/hooks/useMarketDataSocket'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface ConversationHistory {
  id: string
  query: string
  ungroundedResponse: string
  groundedResponse: string
  metrics: {
    specificity: number
    actionability: number
    culturalRelevance: number
  }
  timestamp: Date
}

export default function Dashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [conversations, setConversations] = useState<ConversationHistory[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedConversation, setSelectedConversation] = useState<ConversationHistory | null>(null)

  // Real-time market data
  const { marketData, insights, isConnected, connectionStatus } = useRealTimeMarketData(session?.user?.email || undefined)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=' + encodeURIComponent('/dashboard'))
    } else if (status === 'authenticated') {
      fetchConversations()
    }
  }, [status, router])

  const fetchConversations = async () => {
    try {
      const response = await fetch('/api/conversations')
      if (response.ok) {
        const data = await response.json()
        setConversations(data.conversations || [])
        
        // If we got demo data, also try to load from localStorage
        if (data.source === 'demo') {
          try {
            const localConversations = JSON.parse(localStorage.getItem('conversations') || '[]')
            const userConversations = localConversations.filter(
              (conv: any) => conv.userEmail === session?.user?.email
            )
            
            if (userConversations.length > 0) {
              // Combine demo data with local conversations
              const combinedConversations = [
                ...userConversations.map((conv: any) => ({
                  id: conv.id,
                  query: conv.query,
                  ungroundedResponse: conv.ungroundedResponse,
                  groundedResponse: conv.groundedResponse,
                  metrics: conv.metrics,
                  timestamp: new Date(conv.timestamp)
                })),
                ...data.conversations
              ]
              setConversations(combinedConversations)
            }
          } catch (localError) {
            console.error('Failed to load from localStorage:', localError)
          }
        }
      }
    } catch (error) {
      console.error('Failed to fetch conversations:', error)
      
      // Fallback: try to load from localStorage only
      try {
        const localConversations = JSON.parse(localStorage.getItem('conversations') || '[]')
        const userConversations = localConversations.filter(
          (conv: any) => conv.userEmail === session?.user?.email
        )
        
        if (userConversations.length > 0) {
          setConversations(userConversations.map((conv: any) => ({
            id: conv.id,
            query: conv.query,
            ungroundedResponse: conv.ungroundedResponse,
            groundedResponse: conv.groundedResponse,
            metrics: conv.metrics,
            timestamp: new Date(conv.timestamp)
          })))
        }
      } catch (localError) {
        console.error('Failed to load from localStorage:', localError)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const getOverallScore = (metrics: ConversationHistory['metrics']) => {
    return Math.round((metrics.specificity + metrics.actionability + metrics.culturalRelevance) / 3)
  }

  if (status === 'loading' || isLoading) {
    return <LoadingState message="Loading dashboard..." />
  }

  if (status === 'unauthenticated') {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {session?.user?.name?.split(' ')[0] || 'User'}!
          </h1>
          <p className="text-gray-600">
            Your AI Brand Strategy Command Center with Real-time Market Intelligence
          </p>
          
          {/* Connection Status */}
          <div className="mt-4">
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              isConnected 
                ? 'bg-green-100 text-green-800' 
                : connectionStatus === 'connecting'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-gray-100 text-gray-800'
            }`}>
              <div className={`w-2 h-2 rounded-full mr-2 ${
                isConnected 
                  ? 'bg-green-500 animate-pulse' 
                  : connectionStatus === 'connecting'
                  ? 'bg-yellow-500 animate-pulse'
                  : 'bg-gray-500'
              }`}></div>
              {isConnected ? 'Live Data Connected' : connectionStatus === 'connecting' ? 'Connecting...' : 'Polling Mode'}
            </div>
          </div>
        </div>

        {/* Tabbed Interface */}
        <Tabs defaultValue="realtime" className="w-full mb-8">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="realtime">Real-time Analytics</TabsTrigger>
            <TabsTrigger value="conversations">Conversation History</TabsTrigger>
          </TabsList>
          
          <TabsContent value="realtime">
            <RealTimeDashboard userId={session?.user?.email || undefined} />
          </TabsContent>
          
          <TabsContent value="conversations">
            <ConversationHistory />
          </TabsContent>
        </Tabs>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-md flex items-center justify-center">
                  <span className="text-blue-600 font-semibold text-sm">💬</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Conversations
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {conversations.length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-md flex items-center justify-center">
                  <span className="text-green-600 font-semibold text-sm">📈</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Avg. Improvement
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {conversations.length > 0
                      ? Math.round(
                          conversations.reduce((acc, conv) => acc + getOverallScore(conv.metrics), 0) /
                          conversations.length
                        )
                      : 0}%
                  </dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-100 rounded-md flex items-center justify-center">
                  <span className="text-purple-600 font-semibold text-sm">🎯</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Best Score
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {conversations.length > 0
                      ? Math.max(...conversations.map(conv => getOverallScore(conv.metrics)))
                      : 0}%
                  </dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-yellow-100 rounded-md flex items-center justify-center">
                  <span className="text-yellow-600 font-semibold text-sm">🔥</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    This Week
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {conversations.filter(conv => {
                      const weekAgo = new Date()
                      weekAgo.setDate(weekAgo.getDate() - 7)
                      return new Date(conv.timestamp) > weekAgo
                    }).length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Conversation History */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Recent Conversations</h2>
          </div>
          
          {conversations.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-600 mb-2">No conversations yet</h3>
              <p className="text-gray-500 mb-4">
                Start using the interactive demo to see your conversation history here.
              </p>
              <button
                onClick={() => router.push('/#demo')}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Try Demo
              </button>
            </div>
          ) : (
            <div className="overflow-hidden">
              <ul className="divide-y divide-gray-200">
                {conversations.slice(0, 10).map((conversation) => (
                  <li
                    key={conversation.id}
                    className="px-6 py-4 hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => setSelectedConversation(conversation)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {conversation.query}
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(conversation.timestamp).toLocaleDateString()} at{' '}
                          {new Date(conversation.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="text-sm text-gray-500">
                          Overall: {getOverallScore(conversation.metrics)}%
                        </div>
                        <div className={`px-2 py-1 text-xs font-medium rounded-full ${
                          getOverallScore(conversation.metrics) >= 80
                            ? 'bg-green-100 text-green-800'
                            : getOverallScore(conversation.metrics) >= 60
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {getOverallScore(conversation.metrics) >= 80 ? 'Excellent' : 
                           getOverallScore(conversation.metrics) >= 60 ? 'Good' : 'Needs Work'}
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Conversation Detail Modal */}
      {selectedConversation && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div 
                className="absolute inset-0 bg-gray-500 opacity-75"
                onClick={() => setSelectedConversation(null)}
              ></div>
            </div>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Conversation Details
                  </h3>
                  <button
                    onClick={() => setSelectedConversation(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <span className="sr-only">Close</span>
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Query:</h4>
                    <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">
                      {selectedConversation.query}
                    </p>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Ungrounded Response:</h4>
                      <p className="text-gray-700 bg-red-50 p-3 rounded-lg border-l-4 border-red-500 text-sm">
                        {selectedConversation.ungroundedResponse}
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Grounded Response:</h4>
                      <p className="text-gray-700 bg-green-50 p-3 rounded-lg border-l-4 border-green-500 text-sm">
                        {selectedConversation.groundedResponse}
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Performance Metrics:</h4>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <div className="text-xl font-bold text-blue-600">
                          {selectedConversation.metrics.specificity}%
                        </div>
                        <div className="text-sm text-gray-600">Specificity</div>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <div className="text-xl font-bold text-green-600">
                          {selectedConversation.metrics.actionability}%
                        </div>
                        <div className="text-sm text-gray-600">Actionability</div>
                      </div>
                      <div className="text-center p-3 bg-purple-50 rounded-lg">
                        <div className="text-xl font-bold text-purple-600">
                          {selectedConversation.metrics.culturalRelevance}%
                        </div>
                        <div className="text-sm text-gray-600">Cultural Relevance</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
