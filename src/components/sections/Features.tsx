export default function Features() {
  const features = [
    {
      icon: "🎯",
      title: "Audience Intelligence",
      description: "Discover unexpected audience correlations using 10+ trillion consumer signals",
      metric: "340% better targeting"
    },
    {
      icon: "🧠", 
      title: "Cultural Context",
      description: "Ground AI responses in real behavioral data and cultural preferences",
      metric: "89% more specific"
    },
    {
      icon: "🚀",
      title: "Actionable Insights",
      description: "Transform generic suggestions into concrete business opportunities",
      metric: "94% actionability"
    },
    {
      icon: "⚡",
      title: "Real-time Grounding",
      description: "Instant LLM enhancement with live cultural intelligence data",
      metric: "< 2s response time"
    }
  ]

  return (
    <section className="py-20 bg-white">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Why Grounding Matters
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Traditional LLMs hallucinate and provide generic responses. Qloo's cultural intelligence solves the reliability problem.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-gray-600 mb-4">{feature.description}</p>
              <div className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                {feature.metric}
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-4">
            Ready to Ground Your AI?
          </h3>
          <p className="text-lg mb-6 opacity-90">
            Experience the difference between generic AI and culturally-intelligent responses
          </p>
          <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
            Start Live Demo
          </button>
        </div>
      </div>
    </section>
  )
}
