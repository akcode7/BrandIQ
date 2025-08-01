import mongoose from 'mongoose'

export interface IMessage {
  type: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
  metadata?: {
    isGrounded: boolean
    qlooInsights?: any
    geminiResponse?: any
    actionPlanId?: string
    marketingTaskId?: string
    insightType?: string
  }
}

export interface IChatSession {
  _id?: string
  userId?: string
  userEmail?: string
  title: string
  query?: string
  ungroundedResponse?: string
  groundedResponse?: string
  metrics?: {
    specificity: number
    actionability: number
    culturalRelevance: number
  }
  qlooData?: any
  marketingTasks?: {
    taskId: string
    category: string
    results: any
    actionPlans: string[] // Array of ActionPlan IDs
  }[]
  insights?: {
    type: string
    content: any
    actionPlanId?: string
    timestamp: Date
  }[]
  messages: IMessage[]
  status: 'active' | 'completed'
  sessionType: 'demo' | 'dashboard' | 'qloo-marketing' | 'general'
  createdAt: Date
  updatedAt: Date
}

const messageSchema = new mongoose.Schema<IMessage>({
  type: {
    type: String,
    enum: ['user', 'assistant', 'system'],
    required: true
  },
  content: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  metadata: {
    isGrounded: Boolean,
    qlooInsights: mongoose.Schema.Types.Mixed,
    geminiResponse: mongoose.Schema.Types.Mixed,
    actionPlanId: String,
    marketingTaskId: String,
    insightType: String
  }
})

const chatSessionSchema = new mongoose.Schema<IChatSession>({
  userId: {
    type: String,
    required: false // Allow anonymous sessions
  },
  userEmail: {
    type: String,
    required: false
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  query: {
    type: String,
    required: false
  },
  ungroundedResponse: {
    type: String,
    required: false
  },
  groundedResponse: {
    type: String,
    required: false
  },
  metrics: {
    specificity: { type: Number, default: 0 },
    actionability: { type: Number, default: 0 },
    culturalRelevance: { type: Number, default: 0 }
  },
  qlooData: {
    type: mongoose.Schema.Types.Mixed
  },
  marketingTasks: [{
    taskId: String,
    category: String,
    results: mongoose.Schema.Types.Mixed,
    actionPlans: [String]
  }],
  insights: [{
    type: String,
    content: mongoose.Schema.Types.Mixed,
    actionPlanId: String,
    timestamp: { type: Date, default: Date.now }
  }],
  messages: [messageSchema],
  status: {
    type: String,
    enum: ['active', 'completed'],
    default: 'active'
  },
  sessionType: {
    type: String,
    enum: ['demo', 'dashboard', 'qloo-marketing', 'general'],
    default: 'general'
  }
}, {
  timestamps: true
})

export default mongoose.models.ChatSession || mongoose.model<IChatSession>('ChatSession', chatSessionSchema)
