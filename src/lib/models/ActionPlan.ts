import mongoose from 'mongoose'

export interface IActionPlanStep {
  title: string
  description: string
  priority: 'high' | 'medium' | 'low'
  timeline: string
  resources: string[]
  successKPIs: string[]
  expectedOutcome: string
  status?: 'not-started' | 'in-progress' | 'completed'
  completedAt?: Date
}

export interface IActionPlan {
  _id?: string
  userId?: string
  userEmail?: string
  title: string
  description: string
  category: 'audience' | 'content' | 'trends' | 'campaigns' | 'general'
  source: 'qloo' | 'dashboard' | 'manual'
  sourceData?: {
    qlooInsightId?: string
    marketingTaskId?: string
    originalQuery?: string
  }
  steps: IActionPlanStep[]
  budget?: {
    min: number
    max: number
    currency: string
  }
  timeline: {
    totalWeeks: number
    startDate?: Date
    endDate?: Date
  }
  targets: {
    primary: string
    secondary?: string[]
    metrics: string[]
  }
  status: 'draft' | 'active' | 'completed' | 'archived'
  progress: {
    completedSteps: number
    totalSteps: number
    percentage: number
  }
  tags: string[]
  createdAt: Date
  updatedAt: Date
  completedAt?: Date
}

const actionPlanStepSchema = new mongoose.Schema<IActionPlanStep>({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  priority: {
    type: String,
    enum: ['high', 'medium', 'low'],
    required: true
  },
  timeline: {
    type: String,
    required: true
  },
  resources: [{
    type: String,
    required: true
  }],
  successKPIs: [{
    type: String,
    required: true
  }],
  expectedOutcome: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['not-started', 'in-progress', 'completed'],
    default: 'not-started'
  },
  completedAt: {
    type: Date
  }
}, { _id: false })

const actionPlanSchema = new mongoose.Schema<IActionPlan>({
  userId: {
    type: String,
    required: false
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
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['audience', 'content', 'trends', 'campaigns', 'general'],
    required: true
  },
  source: {
    type: String,
    enum: ['qloo', 'dashboard', 'manual'],
    required: true
  },
  sourceData: {
    qlooInsightId: String,
    marketingTaskId: String,
    originalQuery: String
  },
  steps: [actionPlanStepSchema],
  budget: {
    min: Number,
    max: Number,
    currency: {
      type: String,
      default: 'USD'
    }
  },
  timeline: {
    totalWeeks: {
      type: Number,
      required: true
    },
    startDate: Date,
    endDate: Date
  },
  targets: {
    primary: {
      type: String,
      required: true
    },
    secondary: [String],
    metrics: [String]
  },
  status: {
    type: String,
    enum: ['draft', 'active', 'completed', 'archived'],
    default: 'draft'
  },
  progress: {
    completedSteps: {
      type: Number,
      default: 0
    },
    totalSteps: {
      type: Number,
      default: 0
    },
    percentage: {
      type: Number,
      default: 0
    }
  },
  tags: [String]
}, {
  timestamps: true
})

// Middleware to automatically calculate progress
actionPlanSchema.pre('save', function(this: IActionPlan) {
  if (this.steps) {
    this.progress.totalSteps = this.steps.length
    this.progress.completedSteps = this.steps.filter(step => step.status === 'completed').length
    this.progress.percentage = this.progress.totalSteps > 0 
      ? Math.round((this.progress.completedSteps / this.progress.totalSteps) * 100)
      : 0
  }
})

// Index for efficient queries
actionPlanSchema.index({ userEmail: 1, createdAt: -1 })
actionPlanSchema.index({ status: 1, userEmail: 1 })
actionPlanSchema.index({ category: 1, userEmail: 1 })

export default mongoose.models.ActionPlan || mongoose.model<IActionPlan>('ActionPlan', actionPlanSchema)
