import mongoose from 'mongoose'

export interface IQuery {
  _id?: string
  sessionId: string
  originalQuery: string
  ungroundedResponse: string
  groundedResponse: string
  qlooData: {
    audienceInsights?: any
    culturalCorrelations?: any
    tasteProfile?: any
  }
  metrics: {
    specificity: number
    actionability: number
    culturalRelevance: number
  }
  createdAt: Date
}

const querySchema = new mongoose.Schema<IQuery>({
  sessionId: {
    type: String,
    required: true,
    index: true
  },
  originalQuery: {
    type: String,
    required: true,
    trim: true
  },
  ungroundedResponse: {
    type: String,
    required: true
  },
  groundedResponse: {
    type: String,
    required: true
  },
  qlooData: {
    audienceInsights: mongoose.Schema.Types.Mixed,
    culturalCorrelations: mongoose.Schema.Types.Mixed,
    tasteProfile: mongoose.Schema.Types.Mixed
  },
  metrics: {
    specificity: {
      type: Number,
      min: 0,
      max: 100,
      required: true
    },
    actionability: {
      type: Number,
      min: 0,
      max: 100,
      required: true
    },
    culturalRelevance: {
      type: Number,
      min: 0,
      max: 100,
      required: true
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

// Index for better query performance
querySchema.index({ sessionId: 1, createdAt: -1 })

export default mongoose.models.Query || mongoose.model<IQuery>('Query', querySchema)
