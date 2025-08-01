import mongoose from 'mongoose'

export interface IUser {
  _id?: string
  email: string
  name: string
  preferences: {
    industries: string[]
    defaultScenarios: string[]
  }
  createdAt: Date
  lastActive: Date
}

const userSchema = new mongoose.Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  preferences: {
    industries: [{
      type: String,
      trim: true
    }],
    defaultScenarios: [{
      type: String,
      trim: true
    }]
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastActive: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
})

// Update lastActive on save
userSchema.pre('save', function(next) {
  this.lastActive = new Date()
  next()
})

export default mongoose.models.User || mongoose.model<IUser>('User', userSchema)
