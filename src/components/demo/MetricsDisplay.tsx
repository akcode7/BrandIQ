interface MetricsDisplayProps {
  metrics: {
    specificity: number
    actionability: number
    culturalRelevance: number
  }
}

export default function MetricsDisplay({ metrics }: MetricsDisplayProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100 border-green-200'
    if (score >= 60) return 'text-yellow-600 bg-yellow-100 border-yellow-200'
    return 'text-red-600 bg-red-100 border-red-200'
  }

  const getScoreIcon = (score: number) => {
    if (score >= 80) return '🚀'
    if (score >= 60) return '📈'
    return '⚠️'
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Performance Metrics</h3>
      
      <div className="grid md:grid-cols-3 gap-6">
        {/* Specificity */}
        <div className="text-center">
          <div className={`w-24 h-24 mx-auto rounded-full border-4 flex items-center justify-center mb-3 ${getScoreColor(metrics.specificity)}`}>
            <div className="text-center">
              <div className="text-2xl font-bold">{metrics.specificity}%</div>
            </div>
          </div>
          <h4 className="font-medium text-gray-800 mb-1">Specificity</h4>
          <p className="text-sm text-gray-600">
            How detailed and precise the recommendations are
          </p>
          <div className="mt-2 text-lg">{getScoreIcon(metrics.specificity)}</div>
        </div>

        {/* Actionability */}
        <div className="text-center">
          <div className={`w-24 h-24 mx-auto rounded-full border-4 flex items-center justify-center mb-3 ${getScoreColor(metrics.actionability)}`}>
            <div className="text-center">
              <div className="text-2xl font-bold">{metrics.actionability}%</div>
            </div>
          </div>
          <h4 className="font-medium text-gray-800 mb-1">Actionability</h4>
          <p className="text-sm text-gray-600">
            How implementable and practical the suggestions are
          </p>
          <div className="mt-2 text-lg">{getScoreIcon(metrics.actionability)}</div>
        </div>

        {/* Cultural Relevance */}
        <div className="text-center">
          <div className={`w-24 h-24 mx-auto rounded-full border-4 flex items-center justify-center mb-3 ${getScoreColor(metrics.culturalRelevance)}`}>
            <div className="text-center">
              <div className="text-2xl font-bold">{metrics.culturalRelevance}%</div>
            </div>
          </div>
          <h4 className="font-medium text-gray-800 mb-1">Cultural Relevance</h4>
          <p className="text-sm text-gray-600">
            How well aligned with cultural trends and preferences
          </p>
          <div className="mt-2 text-lg">{getScoreIcon(metrics.culturalRelevance)}</div>
        </div>
      </div>

      {/* Overall Score */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="text-center">
          <div className="text-sm text-gray-600 mb-1">Overall Improvement Score</div>
          <div className="text-3xl font-bold text-blue-600">
            {Math.round((metrics.specificity + metrics.actionability + metrics.culturalRelevance) / 3)}%
          </div>
          <div className="text-sm text-gray-500 mt-1">
            Average across all metrics
          </div>
        </div>
      </div>

      {/* Progress Bars */}
      <div className="mt-6 space-y-3">
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600">Specificity</span>
            <span className="font-medium">{metrics.specificity}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${metrics.specificity}%` }}
            ></div>
          </div>
        </div>

        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600">Actionability</span>
            <span className="font-medium">{metrics.actionability}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-green-500 h-2 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${metrics.actionability}%` }}
            ></div>
          </div>
        </div>

        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600">Cultural Relevance</span>
            <span className="font-medium">{metrics.culturalRelevance}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-purple-500 h-2 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${metrics.culturalRelevance}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  )
}
