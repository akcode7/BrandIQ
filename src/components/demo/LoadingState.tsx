interface LoadingStateProps {
  message?: string
  stage?: 'generating' | 'grounding' | 'analyzing'
}

export default function LoadingState({ message = 'Processing...', stage = 'generating' }: LoadingStateProps) {
  const getStageInfo = (currentStage: string) => {
    switch (currentStage) {
      case 'generating':
        return {
          title: 'Generating Base Response',
          description: 'Creating initial LLM response...',
          color: 'blue'
        }
      case 'grounding':
        return {
          title: 'Grounding with Qloo Data',
          description: 'Enhancing with cultural intelligence...',
          color: 'purple'
        }
      case 'analyzing':
        return {
          title: 'Analyzing Results',
          description: 'Comparing and scoring responses...',
          color: 'green'
        }
      default:
        return {
          title: 'Processing',
          description: message,
          color: 'blue'
        }
    }
  }

  const stageInfo = getStageInfo(stage)

  return (
    <div className="flex flex-col items-center justify-center py-12">
      {/* Animated Logo/Icon */}
      <div className={`relative w-16 h-16 mb-6`}>
        <div className={`absolute inset-0 rounded-full border-4 border-${stageInfo.color}-200`}></div>
        <div className={`absolute inset-0 rounded-full border-4 border-${stageInfo.color}-500 border-t-transparent animate-spin`}></div>
        <div className={`absolute inset-2 rounded-full bg-${stageInfo.color}-100 flex items-center justify-center`}>
          <div className={`w-4 h-4 bg-${stageInfo.color}-500 rounded-full animate-pulse`}></div>
        </div>
      </div>

      {/* Loading Text */}
      <h3 className="text-xl font-semibold text-gray-800 mb-2">{stageInfo.title}</h3>
      <p className="text-gray-600 text-center max-w-md mb-6">{stageInfo.description}</p>

      {/* Progress Stages */}
      <div className="flex items-center space-x-4 mb-8">
        {['generating', 'grounding', 'analyzing'].map((s, index) => (
          <div key={s} className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                s === stage
                  ? 'bg-blue-500 text-white animate-pulse'
                  : index < ['generating', 'grounding', 'analyzing'].indexOf(stage)
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200 text-gray-500'
              }`}
            >
              {index < ['generating', 'grounding', 'analyzing'].indexOf(stage) ? '✓' : index + 1}
            </div>
            {index < 2 && (
              <div
                className={`w-8 h-1 mx-2 ${
                  index < ['generating', 'grounding', 'analyzing'].indexOf(stage)
                    ? 'bg-green-500'
                    : 'bg-gray-200'
                }`}
              ></div>
            )}
          </div>
        ))}
      </div>

      {/* Fun Facts During Loading */}
      <div className="max-w-lg text-center">
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Did you know?</h4>
          <p className="text-sm text-gray-600">
            {stage === 'generating' && "Qloo analyzes over 575+ million data points to understand cultural preferences and trends."}
            {stage === 'grounding' && "Our cultural intelligence platform can identify micro-trends that generic AI might miss."}
            {stage === 'analyzing' && "Grounded responses typically show 3x higher engagement rates in real-world applications."}
          </p>
        </div>
      </div>

      {/* Animated Dots */}
      <div className="flex space-x-1 mt-6">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={`w-2 h-2 bg-${stageInfo.color}-500 rounded-full animate-bounce`}
            style={{ animationDelay: `${i * 0.2}s` }}
          ></div>
        ))}
      </div>
    </div>
  )
}
