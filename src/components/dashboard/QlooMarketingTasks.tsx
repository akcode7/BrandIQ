import { useState } from 'react'
import { Search, Target, TrendingUp, Users, Lightbulb, Zap, ChevronRight, X, CheckCircle } from 'lucide-react'

interface QlooTaskRequest {
  category: string
  target: string
  context: string
  objectives: string[]
}

interface QlooInsight {
  id: string
  type: 'audience' | 'content' | 'trends' | 'recommendations'
  title: string
  description: string
  confidence: number
  data: any
  actionable: boolean
  actionPlan?: {
    steps: Array<{
      id: string
      title: string
      description: string
      priority: 'high' | 'medium' | 'low'
      timeline: string
      resources: string[]
      kpis: string[]
    }>
    timeline: string
    budget: string
    expectedOutcome: string
  }
}

export default function QlooMarketingTasks() {
  const [activeCategory, setActiveCategory] = useState<string>('audience')
  const [taskRequest, setTaskRequest] = useState<QlooTaskRequest>({
    category: 'audience',
    target: '',
    context: '',
    objectives: []
  })
  const [insights, setInsights] = useState<QlooInsight[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedActionPlan, setSelectedActionPlan] = useState<QlooInsight | null>(null)

  const marketingCategories = [
    {
      id: 'audience',
      name: 'Audience Analysis',
      icon: <Users className="w-5 h-5" />,
      description: 'Discover target audience preferences and behaviors',
      color: 'blue'
    },
    {
      id: 'content',
      name: 'Content Strategy',
      icon: <Lightbulb className="w-5 h-5" />,
      description: 'Generate content ideas based on taste preferences',
      color: 'green'
    },
    {
      id: 'trends',
      name: 'Trend Analysis',
      icon: <TrendingUp className="w-5 h-5" />,
      description: 'Identify emerging trends in your market',
      color: 'purple'
    },
    {
      id: 'campaigns',
      name: 'Campaign Ideas',
      icon: <Target className="w-5 h-5" />,
      description: 'AI-powered marketing campaign suggestions',
      color: 'orange'
    }
  ]

  const predefinedObjectives = {
    audience: [
      'Identify key demographics',
      'Understand preference patterns',
      'Find brand affinity connections',
      'Discover crossover opportunities'
    ],
    content: [
      'Generate content themes',
      'Suggest collaboration opportunities',
      'Identify trending topics',
      'Create engagement strategies'
    ],
    trends: [
      'Spot emerging trends',
      'Analyze market shifts',
      'Predict future preferences',
      'Compare competitor landscapes'
    ],
    campaigns: [
      'Develop campaign concepts',
      'Target audience segments',
      'Create messaging frameworks',
      'Plan activation strategies'
    ]
  }

  const handleObjectiveToggle = (objective: string) => {
    setTaskRequest(prev => ({
      ...prev,
      objectives: prev.objectives.includes(objective)
        ? prev.objectives.filter(obj => obj !== objective)
        : [...prev.objectives, objective]
    }))
  }

  const executeQlooTask = async () => {
    if (!taskRequest.target.trim()) return

    setIsLoading(true)
    try {
      // Call Qloo Marketing Task API
      const response = await fetch('/api/qloo/marketing-task', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskRequest)
      })

      if (response.ok) {
        const data = await response.json()
        setInsights(data.insights)
        
        // Save the session data for conversation history
        if (data.sessionId && data.savedActionPlans) {
          console.log(`✅ Qloo task saved to database:`)
          console.log(`📝 Session ID: ${data.sessionId}`)
          console.log(`🎯 Action Plans: ${data.savedActionPlans.length} saved`)
          console.log(`💾 Storage: ${data.metadata.saved}`)
        }
      }
    } catch (error) {
      console.error('Failed to execute Qloo task:', error)
      // Demo data for presentation
      const demoInsights: QlooInsight[] = [
        {
          id: '1',
          type: 'audience',
          title: 'Primary Audience Segment',
          description: 'Urban millennials aged 25-35 with interests in sustainable living and premium experiences',
          confidence: 92,
          data: {
            demographics: { age: '25-35', location: 'Urban', income: '$50-75k' },
            interests: ['Sustainability', 'Premium brands', 'Health & wellness']
          },
          actionable: true
        },
        {
          id: '2',
          type: 'content',
          title: 'Content Theme Recommendation',
          description: 'Focus on behind-the-scenes authentic storytelling with emphasis on craftsmanship',
          confidence: 88,
          data: {
            themes: ['Authenticity', 'Craftsmanship', 'Sustainability'],
            formats: ['Video stories', 'Process documentation', 'User testimonials']
          },
          actionable: true
        },
        {
          id: '3',
          type: 'trends',
          title: 'Emerging Trend Alert',
          description: 'Growing interest in "quiet luxury" and minimalist premium products',
          confidence: 85,
          data: {
            trend: 'Quiet Luxury',
            growth: '+34% interest',
            timeline: 'Next 6 months'
          },
          actionable: true
        }
      ]
      setInsights(demoInsights)
    } finally {
      setIsLoading(false)
    }
  }

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-100 text-blue-800 border-blue-200',
      green: 'bg-green-100 text-green-800 border-green-200',
      purple: 'bg-purple-100 text-purple-800 border-purple-200',
      orange: 'bg-orange-100 text-orange-800 border-orange-200'
    }
    return colors[color as keyof typeof colors] || colors.blue
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-3">
          <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
            <Zap className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Qloo Marketing Intelligence</h2>
            <p className="text-sm text-gray-600">AI-powered taste and preference analysis for marketing optimization</p>
          </div>
        </div>
      </div>

      {/* Category Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {marketingCategories.map((category) => (
          <button
            key={category.id}
            onClick={() => {
              setActiveCategory(category.id)
              setTaskRequest(prev => ({ ...prev, category: category.id, objectives: [] }))
            }}
            className={`p-4 rounded-lg border-2 transition-all text-left ${
              activeCategory === category.id
                ? 'border-indigo-500 bg-indigo-50'
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            <div className="flex items-center space-x-2 mb-2">
              <div className={`p-2 rounded-md ${getColorClasses(category.color)}`}>
                {category.icon}
              </div>
              <h3 className="font-medium text-gray-900">{category.name}</h3>
            </div>
            <p className="text-sm text-gray-600">{category.description}</p>
          </button>
        ))}
      </div>

      {/* Task Configuration */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Configure Marketing Task</h3>
        
        <div className="space-y-4">
          {/* Target Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Target Brand/Product/Category
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={taskRequest.target}
                onChange={(e) => setTaskRequest(prev => ({ ...prev, target: e.target.value }))}
                placeholder="e.g., Premium coffee brand, Athletic wear, Luxury skincare..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 bg-white placeholder-gray-500"
              />
            </div>
          </div>

          {/* Context Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Marketing Context
            </label>
            <textarea
              value={taskRequest.context}
              onChange={(e) => setTaskRequest(prev => ({ ...prev, context: e.target.value }))}
              placeholder="Provide additional context about your brand, target market, current challenges..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 bg-white placeholder-gray-500"
            />
          </div>

          {/* Objectives Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Analysis Objectives
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {predefinedObjectives[activeCategory as keyof typeof predefinedObjectives]?.map((objective) => (
                <label key={objective} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={taskRequest.objectives.includes(objective)}
                    onChange={() => handleObjectiveToggle(objective)}
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-sm text-gray-700">{objective}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Execute Button */}
          <div className="flex justify-end">
            <button
              onClick={executeQlooTask}
              disabled={!taskRequest.target.trim() || isLoading}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Zap className="w-4 h-4" />
              )}
              <span>{isLoading ? 'Analyzing...' : 'Generate Insights'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Results */}
      {insights.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Qloo Insights</h3>
            <p className="text-sm text-gray-500">AI-powered marketing intelligence from taste and preference data</p>
          </div>
          
          <div className="p-6 space-y-4">
            {insights.map((insight) => (
              <div key={insight.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <div className={`p-2 rounded-md ${
                      insight.type === 'audience' ? 'bg-blue-100 text-blue-600' :
                      insight.type === 'content' ? 'bg-green-100 text-green-600' :
                      insight.type === 'trends' ? 'bg-purple-100 text-purple-600' :
                      'bg-orange-100 text-orange-600'
                    }`}>
                      {insight.type === 'audience' && <Users className="w-4 h-4" />}
                      {insight.type === 'content' && <Lightbulb className="w-4 h-4" />}
                      {insight.type === 'trends' && <TrendingUp className="w-4 h-4" />}
                      {insight.type === 'recommendations' && <Target className="w-4 h-4" />}
                    </div>
                    <h4 className="font-medium text-gray-900">{insight.title}</h4>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-medium text-gray-500">
                      Confidence: {insight.confidence}%
                    </span>
                    <div className={`w-2 h-2 rounded-full ${
                      insight.confidence >= 90 ? 'bg-green-500' :
                      insight.confidence >= 70 ? 'bg-yellow-500' :
                      'bg-red-500'
                    }`} />
                  </div>
                </div>
                
                <p className="text-gray-600 mb-3">{insight.description}</p>
                
                {insight.data && (
                  <div className="bg-gray-50 rounded-lg p-3 mb-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                      {Object.entries(insight.data).map(([key, value]) => (
                        <div key={key}>
                          <span className="font-medium text-gray-700 capitalize">{key}: </span>
                          <span className="text-gray-600">
                            {Array.isArray(value) ? value.join(', ') : 
                             typeof value === 'object' ? JSON.stringify(value) : 
                             String(value)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {insight.actionable && (
                  <button 
                    onClick={() => setSelectedActionPlan(insight)}
                    className="text-sm text-indigo-600 hover:text-indigo-800 font-medium flex items-center space-x-1 transition-colors"
                  >
                    <span>View Action Plan</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Plan Modal */}
      {selectedActionPlan && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div 
                className="absolute inset-0 bg-gray-500 opacity-75"
                onClick={() => setSelectedActionPlan(null)}
              ></div>
            </div>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
              <div className="bg-white px-6 pt-6 pb-4">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-xl leading-6 font-bold text-gray-900 mb-2">
                      Action Plan: {selectedActionPlan.title}
                    </h3>
                    <p className="text-sm text-gray-600">{selectedActionPlan.description}</p>
                  </div>
                  <button
                    onClick={() => setSelectedActionPlan(null)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
                
                <div className="space-y-6">
                  {/* Action Plan Overview */}
                  {selectedActionPlan.actionPlan && (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <h4 className="font-medium text-blue-900 mb-1">Timeline</h4>
                          <p className="text-sm text-blue-700">{selectedActionPlan.actionPlan.timeline}</p>
                        </div>
                        <div className="bg-green-50 p-4 rounded-lg">
                          <h4 className="font-medium text-green-900 mb-1">Budget Range</h4>
                          <p className="text-sm text-green-700">{selectedActionPlan.actionPlan.budget}</p>
                        </div>
                        <div className="bg-purple-50 p-4 rounded-lg">
                          <h4 className="font-medium text-purple-900 mb-1">Expected Outcome</h4>
                          <p className="text-sm text-purple-700">{selectedActionPlan.actionPlan.expectedOutcome}</p>
                        </div>
                      </div>

                      {/* Action Steps */}
                      <div>
                        <h4 className="font-medium text-gray-900 mb-4">Implementation Steps</h4>
                        <div className="space-y-4">
                          {selectedActionPlan.actionPlan.steps.map((step, index) => (
                            <div key={step.id} className="border border-gray-200 rounded-lg p-4">
                              <div className="flex items-start space-x-3">
                                <div className="flex-shrink-0">
                                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                                    step.priority === 'high' ? 'bg-red-100 text-red-600' :
                                    step.priority === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                                    'bg-green-100 text-green-600'
                                  }`}>
                                    {index + 1}
                                  </div>
                                </div>
                                <div className="flex-grow">
                                  <div className="flex items-center justify-between mb-2">
                                    <h5 className="font-medium text-gray-900">{step.title}</h5>
                                    <div className="flex items-center space-x-2">
                                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                        step.priority === 'high' ? 'bg-red-100 text-red-800' :
                                        step.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                        'bg-green-100 text-green-800'
                                      }`}>
                                        {step.priority} priority
                                      </span>
                                      <span className="text-xs text-gray-500">{step.timeline}</span>
                                    </div>
                                  </div>
                                  <p className="text-sm text-gray-600 mb-3">{step.description}</p>
                                  
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                      <h6 className="text-xs font-medium text-gray-700 mb-1">Resources Needed:</h6>
                                      <ul className="text-xs text-gray-600 space-y-1">
                                        {step.resources.map((resource, idx) => (
                                          <li key={idx} className="flex items-center space-x-1">
                                            <CheckCircle className="w-3 h-3 text-green-500" />
                                            <span>{resource}</span>
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                    <div>
                                      <h6 className="text-xs font-medium text-gray-700 mb-1">Success Metrics:</h6>
                                      <ul className="text-xs text-gray-600 space-y-1">
                                        {step.kpis.map((kpi, idx) => (
                                          <li key={idx} className="flex items-center space-x-1">
                                            <Target className="w-3 h-3 text-blue-500" />
                                            <span>{kpi}</span>
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
              
              <div className="bg-gray-50 px-6 py-4">
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setSelectedActionPlan(null)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Close
                  </button>
                  <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
                    Export Action Plan
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
