export default function CTA() {
  return (
    <section className="py-20 bg-gray-900 text-white">
      <div className="container text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Transform Your AI Today
        </h2>
        <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
          Join the revolution of grounded AI that delivers real business value through cultural intelligence
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors">
            Try Interactive Demo
          </button>
          <button className="border border-gray-600 text-gray-300 hover:bg-gray-800 px-8 py-4 rounded-lg font-semibold text-lg transition-colors">
            View Documentation
          </button>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-400 mb-2">340%</div>
            <div className="text-gray-400">Better Targeting</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-400 mb-2">89%</div>
            <div className="text-gray-400">More Specific</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-400 mb-2">94%</div>
            <div className="text-gray-400">Actionability</div>
          </div>
        </div>
      </div>
    </section>
  )
}
