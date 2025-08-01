interface ScenarioCardProps {
  scenario: {
    id: string
    title: string
    description: string
    query: string
    industry: string
    icon: string
  }
  isSelected: boolean
  onSelect: () => void
}

export default function ScenarioCard({ scenario, isSelected, onSelect }: ScenarioCardProps) {
  return (
    <div
      className={`card p-6 cursor-pointer transition-all duration-200 transform hover:scale-105 hover:shadow-lg ${
        isSelected 
          ? 'ring-2 ring-blue-500 bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200 shadow-md' 
          : 'hover:bg-gray-50 border-gray-200'
      }`}
      onClick={onSelect}
    >
      <div className="flex items-center mb-4">
        <div className={`text-3xl mr-3 transition-transform duration-200 ${isSelected ? 'scale-110' : ''}`}>
          {scenario.icon}
        </div>
        <div>
          <h3 className={`font-semibold transition-colors ${isSelected ? 'text-blue-900' : 'text-gray-900'}`}>
            {scenario.title}
          </h3>
          <p className={`text-sm ${isSelected ? 'text-blue-600' : 'text-gray-500'}`}>
            {scenario.industry}
          </p>
        </div>
      </div>
      <p className={`text-sm mb-4 transition-colors ${isSelected ? 'text-gray-700' : 'text-gray-600'}`}>
        {scenario.description}
      </p>
      
      {isSelected && (
        <div className="flex items-center text-blue-600 text-sm font-medium animate-fadeIn">
          <div className="w-2 h-2 bg-blue-600 rounded-full mr-2 animate-pulse"></div>
          Selected
        </div>
      )}
    </div>
  )
}
