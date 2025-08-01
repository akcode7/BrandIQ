'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { demoScenarios } from '@/lib/data/scenarios'
import ScenarioCard from './ScenarioCard'
import ComparisonView from './ComparisonView'
import LoadingState from './LoadingState'

export default function InteractiveDemo() {
  const { data: session } = useSession()
  const [selectedScenario, setSelectedScenario] = useState(demoScenarios[0])
  const [isGenerating, setIsGenerating] = useState(false)
  const [comparisonData, setComparisonData] = useState(null)

  const handleScenarioSelect = (scenario: typeof demoScenarios[0]) => {
    setSelectedScenario(scenario)
    setComparisonData(null)
  }

  const saveConversation = async (data: any) => {
    if (!session) return // Only save if user is authenticated

    try {
      const response = await fetch('/api/conversations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: selectedScenario.query,
          ungroundedResponse: data.ungrounded.content,
          groundedResponse: data.grounded.content,
          metrics: data.metrics,
          qlooData: data.qlooData
        })
      })

      const result = await response.json()
      
      if (response.ok) {
        console.log('Conversation saved:', result.saved || 'database')
        
        // Also save to localStorage as backup
        const localConversations = JSON.parse(localStorage.getItem('conversations') || '[]')
        const newConversation = {
          id: result.conversationId,
          query: selectedScenario.query,
          ungroundedResponse: data.ungrounded.content,
          groundedResponse: data.grounded.content,
          metrics: data.metrics,
          timestamp: new Date().toISOString(),
          userEmail: session.user?.email
        }
        
        localConversations.unshift(newConversation)
        // Keep only last 50 conversations in localStorage
        if (localConversations.length > 50) {
          localConversations.splice(50)
        }
        localStorage.setItem('conversations', JSON.stringify(localConversations))
        
        if (result.saved === 'session') {
          alert('Conversation saved locally (database temporarily unavailable)')
        }
      } else {
        throw new Error(result.error || 'Failed to save conversation')
      }
    } catch (error) {
      console.error('Failed to save conversation:', error)
      
      // Fallback: save only to localStorage
      try {
        const localConversations = JSON.parse(localStorage.getItem('conversations') || '[]')
        const newConversation = {
          id: `local-${Date.now()}`,
          query: selectedScenario.query,
          ungroundedResponse: data.ungrounded.content,
          groundedResponse: data.grounded.content,
          metrics: data.metrics,
          timestamp: new Date().toISOString(),
          userEmail: session.user?.email,
          source: 'localStorage'
        }
        
        localConversations.unshift(newConversation)
        if (localConversations.length > 50) {
          localConversations.splice(50)
        }
        localStorage.setItem('conversations', JSON.stringify(localConversations))
        
        console.log('Conversation saved to localStorage as fallback')
      } catch (localError) {
        console.error('Failed to save to localStorage:', localError)
      }
    }
  }

  const handleGenerateComparison = async () => {
    setIsGenerating(true)
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: selectedScenario.query,
          includeQlooData: true
        })
      })

      if (response.ok) {
        const data = await response.json()
        setComparisonData(data)
        
        // Save conversation to database if user is authenticated
        await saveConversation(data)
      } else {
        console.error('Failed to generate comparison')
      }
    } catch (error) {
      console.error('Error generating comparison:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <section className="py-20 bg-gray-50">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Interactive Demo
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose a scenario and see how Qloo's cultural intelligence transforms generic AI responses into actionable business insights
          </p>
        </div>

        {/* Scenario Selection */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {demoScenarios.map((scenario) => (
            <ScenarioCard
              key={scenario.id}
              scenario={scenario}
              isSelected={selectedScenario.id === scenario.id}
              onSelect={() => handleScenarioSelect(scenario)}
            />
          ))}
        </div>

        {/* Selected Scenario Query */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold mb-3 text-gray-800">
              Marketing Challenge: {selectedScenario.title}
            </h3>
            <div className="bg-blue-50 rounded-lg p-4 mb-4">
              <p className="text-gray-700 font-medium">"{selectedScenario.query}"</p>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span className="flex items-center">
                  <span className="mr-2">{selectedScenario.icon}</span>
                  {selectedScenario.industry}
                </span>
              </div>
              <button
                onClick={handleGenerateComparison}
                disabled={isGenerating}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGenerating ? 'Generating...' : 'Generate Comparison'}
              </button>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isGenerating && <LoadingState />}

        {/* Comparison Results */}
        {comparisonData && !isGenerating && (
          <ComparisonView data={comparisonData} />
        )}

        {/* Call to Action */}
        {!comparisonData && !isGenerating && (
          <div className="text-center mt-12">
            <p className="text-gray-600 mb-4">
              Ready to see the difference? Click "Generate Comparison" above to see live results.
            </p>
            <div className="flex justify-center space-x-8 text-sm text-gray-500">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                Generic LLM Response
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                Qloo-Grounded Response
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
