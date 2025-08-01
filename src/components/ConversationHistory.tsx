import { useEffect, useState } from 'react'
import { Calendar, MessageSquare, Target, TrendingUp, Users, Lightbulb, ChevronRight, Clock, Database, HardDrive } from 'lucide-react'

interface ConversationSummary {
  id: string
  title: string
  sessionType: 'demo' | 'dashboard' | 'qloo-marketing' | 'general'
  insightsCount?: number
  messagesCount?: number
  actionPlansCount?: number
  lastActivity: Date
  status: 'active' | 'completed'
  createdAt: Date
  source?: 'database' | 'demo' | 'session'
}

interface ActionPlanSummary {
  id: string
  title: string
  category: 'audience' | 'content' | 'trends' | 'campaigns' | 'general'
  status: 'draft' | 'active' | 'completed' | 'archived'
  progress: {
    percentage: number
    completedSteps: number
    totalSteps: number
  }
  createdAt: Date
}

export default function ConversationHistory() {
  const [conversations, setConversations] = useState<ConversationSummary[]>([])
  const [actionPlans, setActionPlans] = useState<ActionPlanSummary[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'conversations' | 'action-plans'>('conversations')
  const [filter, setFilter] = useState<'all' | 'demo' | 'dashboard' | 'qloo-marketing'>('all')

  useEffect(() => {
    fetchConversationHistory()
    fetchActionPlans()
  }, [])

  const fetchConversationHistory = async () => {
    try {
      const response = await fetch('/api/conversations')
      if (response.ok) {
        const data = await response.json()
        
        // Transform conversations to include metadata
        const enhancedConversations = data.conversations.map((conv: any) => ({
          id: conv.id,
          title: conv.title || conv.query || 'Untitled Session',
          sessionType: conv.sessionType || 'general',
          insightsCount: conv.insights?.length || 0,
          messagesCount: conv.messages?.length || 0,
          actionPlansCount: conv.marketingTasks?.reduce((acc: number, task: any) => 
            acc + (task.actionPlans?.length || 0), 0) || 0,
          lastActivity: new Date(conv.updatedAt || conv.timestamp),
          status: conv.status || 'completed',
          createdAt: new Date(conv.createdAt || conv.timestamp),
          source: data.source || 'database'
        }))
        
        setConversations(enhancedConversations)
      }
    } catch (error) {
      console.error('Failed to fetch conversation history:', error)
    }
  }

  const fetchActionPlans = async () => {
    try {
      const response = await fetch('/api/action-plans')
      if (response.ok) {
        const data = await response.json()
        setActionPlans(data.actionPlans || [])
      }
    } catch (error) {
      console.error('Failed to fetch action plans:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getSessionTypeIcon = (type: string) => {
    switch (type) {
      case 'demo': return <MessageSquare className="w-4 h-4 text-blue-500" />
      case 'dashboard': return <TrendingUp className="w-4 h-4 text-green-500" />
      case 'qloo-marketing': return <Target className="w-4 h-4 text-purple-500" />
      default: return <Users className="w-4 h-4 text-gray-500" />
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'audience': return <Users className="w-4 h-4 text-blue-500" />
      case 'content': return <Lightbulb className="w-4 h-4 text-green-500" />
      case 'trends': return <TrendingUp className="w-4 h-4 text-purple-500" />
      case 'campaigns': return <Target className="w-4 h-4 text-orange-500" />
      default: return <MessageSquare className="w-4 h-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100'
      case 'completed': return 'text-blue-600 bg-blue-100'
      case 'draft': return 'text-gray-600 bg-gray-100'
      case 'archived': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const filteredConversations = filter === 'all' 
    ? conversations 
    : conversations.filter(conv => conv.sessionType === filter)

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Conversation History & Action Plans</h1>
        <p className="text-gray-600">
          All your AI brand strategy sessions and action plans are automatically saved to MongoDB
        </p>
        <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
          <Database className="w-4 h-4" />
          <span>
            {conversations.length} conversations · {actionPlans.length} action plans saved
          </span>
          {conversations.some(c => c.source === 'demo') && (
            <>
              <span>·</span>
              <HardDrive className="w-4 h-4" />
              <span>Includes demo data</span>
            </>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg w-fit">
        <button
          onClick={() => setActiveTab('conversations')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'conversations'
              ? 'bg-white text-purple-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <MessageSquare className="w-4 h-4 inline mr-2" />
          Conversations ({conversations.length})
        </button>
        <button
          onClick={() => setActiveTab('action-plans')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'action-plans'
              ? 'bg-white text-purple-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Target className="w-4 h-4 inline mr-2" />
          Action Plans ({actionPlans.length})
        </button>
      </div>

      {activeTab === 'conversations' && (
        <>
          {/* Filters */}
          <div className="flex gap-2 mb-4">
            {['all', 'demo', 'dashboard', 'qloo-marketing'].map((filterType) => (
              <button
                key={filterType}
                onClick={() => setFilter(filterType as any)}
                className={`px-3 py-1 rounded-full text-sm capitalize transition-colors ${
                  filter === filterType
                    ? 'bg-purple-100 text-purple-700'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {filterType === 'all' ? 'All Sessions' : filterType.replace('-', ' ')}
              </button>
            ))}
          </div>

          {/* Conversations List */}
          <div className="space-y-3">
            {filteredConversations.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>No conversations found for the selected filter</p>
              </div>
            ) : (
              filteredConversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => {
                    // Navigate to specific conversation (implement as needed)
                    console.log('Navigate to conversation:', conversation.id)
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {getSessionTypeIcon(conversation.sessionType)}
                        <h3 className="font-medium text-gray-900 truncate">
                          {conversation.title}
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(conversation.status)}`}>
                          {conversation.status}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
                        <span className="flex items-center gap-1">
                          <MessageSquare className="w-3 h-3" />
                          {conversation.messagesCount} messages
                        </span>
                        {(conversation.insightsCount || 0) > 0 && (
                          <span className="flex items-center gap-1">
                            <Lightbulb className="w-3 h-3" />
                            {conversation.insightsCount} insights
                          </span>
                        )}
                        {(conversation.actionPlansCount || 0) > 0 && (
                          <span className="flex items-center gap-1">
                            <Target className="w-3 h-3" />
                            {conversation.actionPlansCount} action plans
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <Clock className="w-3 h-3" />
                        <span>Created {formatDate(conversation.createdAt)}</span>
                        <span>·</span>
                        <span>Last activity {formatDate(conversation.lastActivity)}</span>
                      </div>
                    </div>
                    
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}

      {activeTab === 'action-plans' && (
        <div className="space-y-3">
          {actionPlans.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Target className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>No action plans saved yet</p>
              <p className="text-sm mt-1">Action plans will appear here when created through Qloo tasks</p>
            </div>
          ) : (
            actionPlans.map((plan) => (
              <div
                key={plan.id}
                className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => {
                  // Navigate to specific action plan (implement as needed)
                  console.log('Navigate to action plan:', plan.id)
                }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {getCategoryIcon(plan.category)}
                      <h3 className="font-medium text-gray-900 truncate">
                        {plan.title}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(plan.status)}`}>
                        {plan.status}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
                      <span className="capitalize">{plan.category} category</span>
                      <span>
                        {plan.progress.completedSteps}/{plan.progress.totalSteps} steps completed
                      </span>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                      <div 
                        className="bg-purple-600 h-2 rounded-full transition-all"
                        style={{ width: `${plan.progress.percentage}%` }}
                      ></div>
                    </div>
                    
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <Clock className="w-3 h-3" />
                      <span>Created {formatDate(plan.createdAt)}</span>
                      <span>·</span>
                      <span>{plan.progress.percentage}% complete</span>
                    </div>
                  </div>
                  
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}
