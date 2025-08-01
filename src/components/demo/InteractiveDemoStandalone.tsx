'use client'

import { useState } from 'react'
import { demoScenarios, mockGroundedResponses } from '@/lib/data/scenarios'
import ScenarioCard from './ScenarioCard'
import ComparisonView from './ComparisonView'
import LoadingState from './LoadingState'

export default function InteractiveDemoStandalone() {
  const [selectedScenario, setSelectedScenario] = useState(demoScenarios[0])
  const [isGenerating, setIsGenerating] = useState(false)
  const [comparisonData, setComparisonData] = useState<any>(null)

  const handleScenarioSelect = (scenario: typeof demoScenarios[0]) => {
    setSelectedScenario(scenario)
    setComparisonData(null)
  }

  const handleGenerateComparison = async () => {
    setIsGenerating(true)
    
    // Simulate API delay with progress feedback
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    try {
      // Use mock data for demo purposes - enhanced with more realistic content
      const mockData = {
        query: selectedScenario.query,
        ungrounded: {
          content: `For ${selectedScenario.title}: Consider partnering with relevant brands and influencers in your industry. Use social media marketing, attend networking events, and explore cross-promotional opportunities. Traditional advertising and word-of-mouth marketing could also be effective approaches for your business.`,
          timestamp: Date.now()
        },
        grounded: {
          content: mockGroundedResponses[selectedScenario.id as keyof typeof mockGroundedResponses]?.content || 
            `Data-driven insights for ${selectedScenario.title}: Based on cultural intelligence and consumer behavior analysis, your target audience shows specific engagement patterns. Here are precise partnership recommendations with measurable impact potential, backed by real market data and cultural trends.`,
          timestamp: Date.now()
        },
        qlooData: {
          audience: {
            age: selectedScenario.id === 'coffee' ? '28-35' : selectedScenario.id === 'fashion' ? '24-32' : '25-40',
            interests: selectedScenario.id === 'coffee' ? 
              ['sustainability', 'premium quality', 'ethical consumption', 'documentary films'] :
              selectedScenario.id === 'fashion' ? 
              ['sustainable fashion', 'indie music', 'environmental activism', 'ethical brands'] :
              ['productivity', 'wellness', 'business podcasts', 'work-life balance'],
            behavioral_patterns: selectedScenario.id === 'coffee' ? 
              ['Over-indexes 340% on documentaries', '260% higher engagement with intellectual content'] :
              selectedScenario.id === 'fashion' ? 
              ['260% over-index on indie music festivals', '310% engagement with sustainability content'] :
              ['290% over-index on business podcasts', '340% higher LinkedIn engagement']
          },
          partnerships: selectedScenario.id === 'coffee' ? 
            ['Film festivals', 'Outdoor gear retailers', 'The New Yorker content partnership'] :
            selectedScenario.id === 'fashion' ? 
            ['Music festival collaborations', 'TikTok sustainability influencers', 'Ethical outdoor brands'] :
            ['Co-working spaces', 'Productivity software companies', 'Business podcast sponsorships']
        },
        metrics: {
          specificity: selectedScenario.id === 'coffee' ? 89 : selectedScenario.id === 'fashion' ? 92 : 85,
          actionability: selectedScenario.id === 'coffee' ? 94 : selectedScenario.id === 'fashion' ? 88 : 91,
          culturalRelevance: selectedScenario.id === 'coffee' ? 87 : selectedScenario.id === 'fashion' ? 91 : 88
        },
        timestamp: Date.now()
      }
      
      setComparisonData(mockData)
    } catch (error) {
      console.error('Error generating comparison:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <section className="py-12 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
            Interactive Demo
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
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
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 animate-scaleIn">
            <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200">
              Selected Query:
            </h3>
            <p className="text-gray-600 dark:text-gray-300 italic mb-4">
              "{selectedScenario.query}"
            </p>
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm">
                {selectedScenario.industry}
              </span>
              <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm">
                {selectedScenario.icon} {selectedScenario.title}
              </span>
            </div>
            
            {/* What will be analyzed */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-4 border border-blue-100 dark:border-blue-800">
              <h4 className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">
                What our AI will analyze:
              </h4>
              <div className="grid md:grid-cols-3 gap-3 text-sm">
                <div className="flex items-center text-gray-600 dark:text-gray-300">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  Target audience behavior
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-300">
                  <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                  Cultural preferences
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-300">
                  <span className="w-2 h-2 bg-cyan-500 rounded-full mr-2"></span>
                  Partnership opportunities
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Generate Button */}
        <div className="text-center mb-8">
          <button
            onClick={handleGenerateComparison}
            disabled={isGenerating}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            {isGenerating ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating AI Insights...
              </span>
            ) : 'Generate AI Comparison'}
          </button>
        </div>

        {/* Loading State */}
        {isGenerating && <LoadingState />}

        {/* Comparison Results */}
        {comparisonData && !isGenerating && (
          <div className="space-y-8 animate-slideUp">
            <ComparisonView data={comparisonData} />
            
            {/* Try Another Scenario */}
            <div className="text-center">
              <button
                onClick={() => setComparisonData(null)}
                className="bg-white border-2 border-blue-600 text-blue-600 px-6 py-2 rounded-lg font-medium hover:bg-blue-50 transition-all transform hover:scale-105"
              >
                Try Another Scenario
              </button>
            </div>
          </div>
        )}

        {/* Demo Notice */}
        <div className="mt-16 text-center">
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 max-w-2xl mx-auto">
            <div className="flex items-center justify-center mb-3">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center">
                <span className="text-blue-600 dark:text-blue-400">ℹ️</span>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
              Demo Mode
            </h3>
            <p className="text-blue-800 dark:text-blue-200">
              This demo uses simulated data to showcase our AI capabilities. 
              Sign up for real-time analysis with live market data and personalized insights.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
