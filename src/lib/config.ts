// Environment configuration
export const config = {
  app: {
    name: 'LLM Grounding Agent',
    description: 'AI Brand Strategist powered by Qloo\'s cultural intelligence',
    url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    version: '1.0.0'
  },
  api: {
    qloo: {
      baseUrl: process.env.QLOO_BASE_URL || 'https://hackathon.api.qloo.com',
      apiKey: process.env.QLOO_API_KEY
    },
    gemini: {
      apiKey: process.env.GEMINI_API_KEY,
      model: 'gemini-1.5-flash'
    }
  },
  database: {
    mongodb: {
      uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/llm-grounding-agent'
    }
  },
  features: {
    enableRealApiCalls: process.env.NODE_ENV === 'production',
    enableAnalytics: false,
    enablePushNotifications: false
  }
}

export default config
