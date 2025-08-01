import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai'

const GEMINI_API_KEY = process.env.GEMINI_API_KEY
const MODEL_NAME = 'gemini-1.5-flash'

export interface GeminiPromptData {
  userQuery: string
  qlooInsights?: any
  context?: string
}

export interface GeminiResponse {
  content: string
  isGrounded: boolean
  metadata: {
    model: string
    timestamp: number
    tokenCount?: number
  }
}

class GeminiService {
  private genAI: GoogleGenerativeAI | null = null
  private model: GenerativeModel | null = null

  constructor() {
    if (GEMINI_API_KEY) {
      this.genAI = new GoogleGenerativeAI(GEMINI_API_KEY)
      this.model = this.genAI.getGenerativeModel({ model: MODEL_NAME })
    } else {
      console.warn('Gemini API key not provided - using mock responses')
    }
  }

  private buildUngroundedPrompt(query: string): string {
    return `You are a marketing consultant. Answer this business question concisely:

${query}

Provide practical marketing suggestions.`
  }

  private buildGroundedPrompt(query: string, qlooData: any): string {
    const audienceInsights = qlooData?.audience || []
    const culturalContext = qlooData?.culturalContext || {}
    const recommendations = qlooData?.recommendations || []

    return `You are an expert marketing strategist with access to detailed audience intelligence and cultural data.

BUSINESS QUESTION: ${query}

AUDIENCE INTELLIGENCE:
${audienceInsights.map((audience: any) => 
  `- ${audience.segment || audience.name}: ${audience.overIndex || audience.affinityScore}x over-index`
).join('\n')}

CULTURAL CORRELATIONS:
${recommendations.map((rec: any) => 
  `- ${rec.entity}: ${rec.affinity}x affinity (${rec.reason})`
).join('\n')}

BEHAVIORAL INSIGHTS:
${culturalContext.interests?.map((interest: string) => `- Strong interest in ${interest}`).join('\n') || 'N/A'}

Based on this specific audience intelligence and cultural data, provide highly targeted, actionable marketing partnership recommendations. Be specific about WHY each suggestion works based on the data provided. Include concrete next steps and mention the audience over-indexing percentages to show data-driven reasoning.`
  }

  private getMockResponse(isGrounded: boolean, query: string): GeminiResponse {
    if (!isGrounded) {
      return {
        content: "Partner with food bloggers, collaborate with lifestyle influencers on Instagram, offer discounts at local farmers' markets, and consider partnerships with local cafes for cross-promotion.",
        isGrounded: false,
        metadata: {
          model: 'mock-ungrounded',
          timestamp: Date.now()
        }
      }
    }

    return {
      content: "Your target audience over-indexes 340% on documentary films and sustainable outdoor activities. I recommend: 1) Sponsor a local film festival's documentary category targeting environmentally conscious viewers, 2) Create a co-branded 'Trail Brew' with outdoor gear retailers like Patagonia, leveraging the 280% over-index on sustainable products, 3) Partner with The New Yorker for a content series on ethical sourcing, as your audience shows 260% higher engagement with intellectual content. These partnerships align with your audience's proven behavioral preferences.",
      isGrounded: true,
      metadata: {
        model: 'mock-grounded',
        timestamp: Date.now()
      }
    }
  }

  async generateUngroundedResponse(query: string): Promise<GeminiResponse> {
    if (!this.model) {
      return this.getMockResponse(false, query)
    }

    try {
      const prompt = this.buildUngroundedPrompt(query)
      const result = await this.model.generateContent(prompt)
      const response = await result.response
      
      return {
        content: response.text(),
        isGrounded: false,
        metadata: {
          model: MODEL_NAME,
          timestamp: Date.now()
        }
      }
    } catch (error) {
      console.error('Gemini ungrounded generation failed:', error)
      return this.getMockResponse(false, query)
    }
  }

  async generateGroundedResponse(data: GeminiPromptData): Promise<GeminiResponse> {
    if (!this.model) {
      return this.getMockResponse(true, data.userQuery)
    }

    try {
      const prompt = this.buildGroundedPrompt(data.userQuery, data.qlooInsights)
      const result = await this.model.generateContent(prompt)
      const response = await result.response
      
      return {
        content: response.text(),
        isGrounded: true,
        metadata: {
          model: MODEL_NAME,
          timestamp: Date.now()
        }
      }
    } catch (error) {
      console.error('Gemini grounded generation failed:', error)
      return this.getMockResponse(true, data.userQuery)
    }
  }

  async generateComparison(query: string, qlooData: any) {
    const [ungrounded, grounded] = await Promise.all([
      this.generateUngroundedResponse(query),
      this.generateGroundedResponse({ userQuery: query, qlooInsights: qlooData })
    ])

    return {
      ungrounded,
      grounded,
      improvement: {
        specificity: this.calculateSpecificity(ungrounded.content, grounded.content),
        actionability: this.calculateActionability(ungrounded.content, grounded.content),
        culturalRelevance: this.calculateCulturalRelevance(grounded.content, qlooData)
      }
    }
  }

  private calculateSpecificity(ungrounded: string, grounded: string): number {
    // Simple heuristic: count specific numbers, brands, and concrete suggestions
    const ungroundedSpecifics = (ungrounded.match(/\b\d+%|\b[A-Z][a-z]+\s[A-Z][a-z]+|\b(specific|concrete|exact)\b/gi) || []).length
    const groundedSpecifics = (grounded.match(/\b\d+%|\b[A-Z][a-z]+\s[A-Z][a-z]+|\b(specific|concrete|exact)\b/gi) || []).length
    
    const improvement = groundedSpecifics > 0 ? (groundedSpecifics / (ungroundedSpecifics + 1)) * 25 : 20
    return Math.min(Math.max(improvement, 20), 95)
  }

  private calculateActionability(ungrounded: string, grounded: string): number {
    // Count actionable verbs and concrete steps
    const actionWords = /\b(sponsor|create|partner|contact|reach out|launch|develop|implement)\b/gi
    const ungroundedActions = (ungrounded.match(actionWords) || []).length
    const groundedActions = (grounded.match(actionWords) || []).length
    
    const improvement = groundedActions > 0 ? (groundedActions / (ungroundedActions + 1)) * 30 : 15
    return Math.min(Math.max(improvement, 15), 98)
  }

  private calculateCulturalRelevance(grounded: string, qlooData: any): number {
    // Check if response mentions cultural insights from Qloo data
    const culturalMentions = (grounded.match(/\b(over-index|affinity|audience|correlation|behavioral)\b/gi) || []).length
    return Math.min(Math.max(culturalMentions * 20, 60), 95)
  }
}

export default new GeminiService()
