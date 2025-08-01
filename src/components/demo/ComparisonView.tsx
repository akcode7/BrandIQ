import { useState } from 'react'
import MetricsDisplay from './MetricsDisplay'
import InsightsPanel from './InsightsPanel'

interface ComparisonViewProps {
  data: {
    query: string
    ungrounded: {
      content: string
      isGrounded: boolean
    }
    grounded: {
      content: string
      isGrounded: boolean
    }
    qlooData?: any
    metrics: {
      specificity: number
      actionability: number
      culturalRelevance: number
    }
  }
}

export default function ComparisonView({ data }: ComparisonViewProps) {
  const [activeTab, setActiveTab] = useState<'comparison' | 'insights'>('comparison')

  return (
    <div className="max-w-6xl mx-auto">
      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-8">
        <button
          onClick={() => setActiveTab('comparison')}
          className={`px-6 py-3 border-b-2 font-medium text-sm ${
            activeTab === 'comparison'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Before vs After Comparison
        </button>
        <button
          onClick={() => setActiveTab('insights')}
          className={`px-6 py-3 border-b-2 font-medium text-sm ${
            activeTab === 'insights'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Cultural Insights
        </button>
      </div>

      {activeTab === 'comparison' && (
        <div>
          {/* Metrics Overview */}
          <MetricsDisplay metrics={data.metrics} />

          {/* Side-by-Side Comparison */}
          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            {/* Ungrounded Response */}
            <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-red-500">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-red-600 font-bold text-xl">×</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-red-700">Ungrounded LLM</h3>
                  <p className="text-sm text-gray-500">Generic AI response</p>
                </div>
              </div>
              
              <div className="bg-red-50 rounded-lg p-4 mb-4">
                <p className="text-gray-700 leading-relaxed">{data.ungrounded.content}</p>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-red-600 font-medium">Issues:</span>
                <div className="text-gray-500">
                  <span className="inline-block w-2 h-2 bg-red-500 rounded-full mr-1"></span>
                  Generic • Vague • Unactionable
                </div>
              </div>
            </div>

            {/* Grounded Response */}
            <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-green-500">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-green-600 font-bold text-xl">✓</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-green-700">Qloo-Grounded</h3>
                  <p className="text-sm text-gray-500">Enhanced with cultural data</p>
                </div>
              </div>
              
              <div className="bg-green-50 rounded-lg p-4 mb-4">
                <p className="text-gray-700 leading-relaxed">{data.grounded.content}</p>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-green-600 font-medium">Improvements:</span>
                <div className="text-gray-500">
                  <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                  Specific • Data-driven • Actionable
                </div>
              </div>
            </div>
          </div>

          {/* Key Improvements */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6">
            <h4 className="text-lg font-semibold mb-4 text-gray-800">
              Key Improvements with Qloo Grounding
            </h4>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 mb-1">
                  +{data.metrics.specificity}%
                </div>
                <div className="text-sm text-gray-600">More Specific</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 mb-1">
                  +{data.metrics.actionability}%
                </div>
                <div className="text-sm text-gray-600">More Actionable</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600 mb-1">
                  +{data.metrics.culturalRelevance}%
                </div>
                <div className="text-sm text-gray-600">Cultural Relevance</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'insights' && data.qlooData && (
        <InsightsPanel qlooData={data.qlooData} />
      )}
    </div>
  )
}
