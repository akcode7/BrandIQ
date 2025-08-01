export default function About() {
  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            About LLM Grounding Agent
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Transforming generic AI responses into culturally-grounded, actionable business insights using Qloo's industry-leading cultural intelligence platform.
          </p>
        </div>

        {/* Problem & Solution */}
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">The Problem</h2>
            <div className="space-y-4 text-gray-600">
              <p>
                Large Language Models (LLMs) like GPT and Gemini provide generic responses that often lack:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Cultural context and regional preferences</li>
                <li>Real-time market trends and consumer behavior</li>
                <li>Actionable, data-driven recommendations</li>
                <li>Brand-specific and audience-targeted insights</li>
              </ul>
              <p>
                This results in AI-generated content that feels disconnected from real consumer preferences and market dynamics.
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Solution</h2>
            <div className="space-y-4 text-gray-600">
              <p>
                The LLM Grounding Agent enhances AI responses by integrating:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Qloo's 575+ million cultural data points</li>
                <li>Real-time trend analysis and consumer insights</li>
                <li>Geographic and demographic targeting</li>
                <li>Industry-specific recommendations</li>
              </ul>
              <p>
                The result is AI that understands culture, trends, and consumer behavior—delivering actionable insights that drive real business results.
              </p>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="mb-16">
          <h2 className="text-3xl font-semibold text-gray-900 text-center mb-8">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">1️⃣</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Input Query</h3>
              <p className="text-gray-600">
                Submit your marketing question or challenge to our system.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">2️⃣</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Cultural Grounding</h3>
              <p className="text-gray-600">
                Qloo's AI analyzes cultural trends, preferences, and consumer behavior data.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">3️⃣</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Enhanced Response</h3>
              <p className="text-gray-600">
                Receive culturally-aware, data-backed recommendations and strategies.
              </p>
            </div>
          </div>
        </div>

        {/* Technology Stack */}
        <div className="mb-16">
          <h2 className="text-3xl font-semibold text-gray-900 text-center mb-8">Technology Stack</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg mx-auto mb-3"></div>
              <h3 className="font-semibold text-gray-900 mb-1">Qloo API</h3>
              <p className="text-sm text-gray-600">Cultural intelligence platform</p>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-500 rounded-lg mx-auto mb-3"></div>
              <h3 className="font-semibold text-gray-900 mb-1">Google Gemini</h3>
              <p className="text-sm text-gray-600">Large Language Model</p>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-gray-700 to-gray-900 rounded-lg mx-auto mb-3"></div>
              <h3 className="font-semibold text-gray-900 mb-1">Next.js 14</h3>
              <p className="text-sm text-gray-600">React framework with PWA</p>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-green-800 rounded-lg mx-auto mb-3"></div>
              <h3 className="font-semibold text-gray-900 mb-1">MongoDB</h3>
              <p className="text-sm text-gray-600">Database & analytics</p>
            </div>
          </div>
        </div>

        {/* Key Features */}
        <div className="mb-16">
          <h2 className="text-3xl font-semibold text-gray-900 text-center mb-8">Key Features</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-blue-600 text-sm">🎯</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Cultural Intelligence</h3>
                  <p className="text-gray-600">Leverage 575+ million data points to understand consumer preferences and cultural trends.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-green-600 text-sm">📊</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Performance Analytics</h3>
                  <p className="text-gray-600">Track improvement metrics and analyze response quality over time.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-purple-600 text-sm">⚡</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Real-time Processing</h3>
                  <p className="text-gray-600">Get enhanced responses powered by the latest cultural trends and market data.</p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-yellow-600 text-sm">📱</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Progressive Web App</h3>
                  <p className="text-gray-600">Install as a native app on any device with offline capabilities.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-red-600 text-sm">🔒</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Secure Authentication</h3>
                  <p className="text-gray-600">Google OAuth integration with conversation history and analytics.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-indigo-600 text-sm">🌍</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Global Insights</h3>
                  <p className="text-gray-600">Access cultural data spanning multiple countries, demographics, and industries.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Use Cases */}
        <div className="mb-16">
          <h2 className="text-3xl font-semibold text-gray-900 text-center mb-8">Use Cases</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-3">Brand Strategy</h3>
              <p className="text-gray-600 text-sm">
                Develop culturally-aware brand positioning and messaging strategies that resonate with target audiences.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-3">Campaign Planning</h3>
              <p className="text-gray-600 text-sm">
                Create marketing campaigns informed by real cultural trends and consumer behavior patterns.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-3">Product Development</h3>
              <p className="text-gray-600 text-sm">
                Guide product features and positioning based on cultural preferences and market demands.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Ready to Transform Your AI?
          </h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Experience the power of culturally-grounded AI responses. Try our interactive demo to see the difference Qloo's cultural intelligence makes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/#demo"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Try Interactive Demo
            </a>
            <a
              href="/dashboard"
              className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              View Dashboard
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
