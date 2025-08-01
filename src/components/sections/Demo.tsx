export default function Demo() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            See the Difference
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Watch how Qloo transforms generic AI responses into specific, actionable business insights
          </p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Ungrounded Response */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-red-600 font-bold text-xl">×</span>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-red-700">Ungrounded LLM</h3>
                <p className="text-sm text-gray-500">Generic, unhelpful responses</p>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <p className="text-sm text-gray-600 mb-2">Query:</p>
              <p className="text-gray-800">"I'm launching a premium, ethically sourced coffee brand. Suggest marketing partnerships."</p>
            </div>
            
            <div className="bg-red-50 rounded-lg p-4">
              <p className="text-sm text-red-600 mb-2">Response:</p>
              <p className="text-gray-700">
                "Partner with food bloggers, collaborate with lifestyle influencers on Instagram, offer discounts at local farmers' markets."
              </p>
            </div>
            
            <div className="mt-4 flex items-center text-sm text-gray-500">
              <span className="inline-block w-2 h-2 bg-red-500 rounded-full mr-2"></span>
              Specificity: 20% • Actionability: 15%
            </div>
          </div>

          {/* Grounded Response */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 font-bold text-xl">✓</span>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-green-700">Qloo-Grounded</h3>
                <p className="text-sm text-gray-500">Cultural intelligence + LLM</p>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <p className="text-sm text-gray-600 mb-2">Same Query + Cultural Data:</p>
              <p className="text-gray-800">"I'm launching a premium, ethically sourced coffee brand. Suggest marketing partnerships."</p>
            </div>
            
            <div className="bg-green-50 rounded-lg p-4">
              <p className="text-sm text-green-600 mb-2">Enhanced Response:</p>
              <p className="text-gray-700">
                "Your target audience over-indexes 340% on documentary films and sustainable outdoor activities. Consider sponsoring a local film festival's documentary category or creating a co-branded 'Trail Brew' with an outdoor gear retailer like Patagonia."
              </p>
            </div>
            
            <div className="mt-4 flex items-center text-sm text-gray-500">
              <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              Specificity: 89% • Actionability: 94%
            </div>
          </div>
        </div>
        
        <div className="text-center mt-12">
          <button className="btn-primary text-lg px-8 py-4">
            Try Interactive Demo
          </button>
        </div>
      </div>
    </section>
  )
}
