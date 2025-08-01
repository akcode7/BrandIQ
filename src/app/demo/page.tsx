import { Metadata } from 'next'
import InteractiveDemoStandalone from '@/components/demo/InteractiveDemoStandalone'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Interactive Demo - LLM Grounding Agent',
  description: 'Experience the LLM Grounding Agent in action with our interactive demo',
  keywords: ['AI demo', 'LLM grounding', 'brand strategy demo', 'interactive AI'],
}

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Navigation */}
        <div className="mb-8">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent mb-4">
            Interactive Demo
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Experience the power of AI-driven brand strategy analysis. Test different scenarios 
            and see how our LLM Grounding Agent provides strategic insights in real-time.
          </p>
        </div>

        {/* Demo Component */}
        <div className="max-w-7xl mx-auto">
          <InteractiveDemoStandalone />
        </div>

        {/* Additional Information */}
        <div className="mt-16 text-center">
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 border border-gray-200 dark:border-gray-700 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              How It Works
            </h2>
            <div className="grid md:grid-cols-3 gap-6 text-left">
              <div className="space-y-2">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-3">
                  <span className="text-blue-600 dark:text-blue-400 font-bold">1</span>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Input Analysis</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Enter your brand or business scenario and our AI analyzes the context
                </p>
              </div>
              <div className="space-y-2">
                <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mb-3">
                  <span className="text-purple-600 dark:text-purple-400 font-bold">2</span>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Strategic Processing</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Advanced LLM algorithms process market data and generate insights
                </p>
              </div>
              <div className="space-y-2">
                <div className="w-8 h-8 bg-cyan-100 dark:bg-cyan-900 rounded-lg flex items-center justify-center mb-3">
                  <span className="text-cyan-600 dark:text-cyan-400 font-bold">3</span>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Actionable Results</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Receive comprehensive brand strategy recommendations and metrics
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
            <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Brand Strategy?</h2>
            <p className="text-xl mb-6 text-blue-100">
              Join thousands of businesses already using our AI-powered insights
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/signup"
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Get Started Free
              </Link>
              <Link
                href="/dashboard"
                className="border border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors"
              >
                View Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
