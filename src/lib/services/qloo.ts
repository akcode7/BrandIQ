const QLOO_BASE_URL = 'https://hackathon.api.qloo.com'
const QLOO_API_KEY = process.env.QLOO_API_KEY

export interface QlooSearchParams {
  query: string
  types?: string[]
  limit?: number
}

export interface QlooInsightsParams {
  filterType: string
  signals?: {
    interests?: {
      entities?: string[]
      tags?: string[]
    }
    demographics?: {
      audiences?: string[]
    }
  }
  filters?: {
    tags?: string[]
    entities?: string[]
  }
}

export interface QlooAudienceData {
  id: string
  name: string
  description: string
  size: number
  affinityScore: number
  overIndex: number
}

export interface QlooInsightData {
  recommendations: any[]
  audience: QlooAudienceData[]
  culturalContext: {
    correlations: any[]
    tasteProfile: any[]
    behavioralSignals: any[]
  }
}

class QlooService {
  private apiKey: string
  private baseUrl: string

  constructor() {
    this.apiKey = QLOO_API_KEY || ''
    this.baseUrl = QLOO_BASE_URL
    
    if (!this.apiKey) {
      console.warn('Qloo API key not provided - using mock data')
    }
  }

  private async makeRequest(endpoint: string, params: Record<string, any> = {}) {
    if (!this.apiKey) {
      return this.getMockData(endpoint, params)
    }

    const url = new URL(`${this.baseUrl}${endpoint}`)
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, typeof value === 'object' ? JSON.stringify(value) : value.toString())
      }
    })

    try {
      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`Qloo API error: ${response.status} ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Qloo API request failed:', error)
      return this.getMockData(endpoint, params)
    }
  }

  private getMockData(endpoint: string, params: any) {
    // Return mock data for development/demo purposes
    if (endpoint.includes('/search')) {
      return {
        data: [
          { id: 'coffee_1', name: 'Premium Coffee Brands', type: 'brand' },
          { id: 'coffee_2', name: 'Ethical Coffee', type: 'brand' }
        ]
      }
    }

    if (endpoint.includes('/v2/insights')) {
      return {
        data: {
          recommendations: [
            {
              entity: 'Documentary Film Festivals',
              affinity: 3.4,
              reason: 'Target audience over-indexes 340% on documentary films'
            },
            {
              entity: 'Outdoor Gear Retailers',
              affinity: 2.8,
              reason: 'Strong correlation with sustainable outdoor activities'
            },
            {
              entity: 'The New Yorker',
              affinity: 2.6,
              reason: 'High engagement with intellectual content'
            }
          ],
          audience: {
            demographics: [
              { segment: '25-34 Urban Professionals', overIndex: 280 },
              { segment: 'Environmentally Conscious', overIndex: 340 },
              { segment: 'High Income Educated', overIndex: 220 }
            ]
          },
          culturalContext: {
            interests: [
              'Documentary Films',
              'Sustainable Living', 
              'Outdoor Activities',
              'Intellectual Content'
            ],
            correlations: [
              { source: 'Premium Coffee', target: 'Documentary Films', strength: 3.4 },
              { source: 'Ethical Brands', target: 'Outdoor Gear', strength: 2.8 }
            ]
          }
        }
      }
    }

    return { data: {} }
  }

  async searchEntities(params: QlooSearchParams) {
    return this.makeRequest('/search', {
      q: params.query,
      types: params.types?.join(','),
      limit: params.limit || 10
    })
  }

  async getInsights(params: QlooInsightsParams) {
    return this.makeRequest('/v2/insights', {
      'filter.type': params.filterType,
      ...params.signals,
      ...params.filters
    })
  }

  async getAudienceData(brandName: string): Promise<QlooInsightData> {
    // First search for the brand
    const searchResult = await this.searchEntities({
      query: brandName,
      types: ['brand'],
      limit: 5
    })

    // Then get insights for that brand
    const insightsResult = await this.getInsights({
      filterType: 'urn:entity:brand',
      signals: {
        interests: {
          entities: searchResult.data?.map((item: any) => item.id) || []
        }
      }
    })

    return {
      recommendations: insightsResult.data?.recommendations || [],
      audience: insightsResult.data?.audience?.demographics || [],
      culturalContext: insightsResult.data?.culturalContext || {}
    }
  }

  async getTags(category: string) {
    return this.makeRequest('/v2/tags', {
      category,
      limit: 20
    })
  }

  async getAudiences() {
    return this.makeRequest('/v2/audiences', {
      limit: 20
    })
  }
}

export default new QlooService()
