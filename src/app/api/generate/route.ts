import { NextRequest, NextResponse } from 'next/server'
import geminiService from '@/lib/services/gemini'
import qlooService from '@/lib/services/qloo'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { query, includeQlooData = true } = body

    if (!query) {
      return NextResponse.json(
        { error: 'Query is required' },
        { status: 400 }
      )
    }

    let qlooData = null
    
    if (includeQlooData) {
      // Extract brand/product information from query for Qloo analysis
      const brandMatch = query.match(/\b(coffee|fashion|fitness|app|brand|product|startup|company)\b/i)
      const brandType = brandMatch ? brandMatch[1] : 'brand'
      
      qlooData = await qlooService.getAudienceData(`premium ${brandType}`)
    }

    const comparison = await geminiService.generateComparison(query, qlooData)

    const response = {
      query,
      ungrounded: comparison.ungrounded,
      grounded: comparison.grounded,
      qlooData,
      metrics: comparison.improvement,
      timestamp: Date.now()
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Generate API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Handle ungrounded responses only
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get('q')

    if (!query) {
      return NextResponse.json(
        { error: 'Query parameter "q" is required' },
        { status: 400 }
      )
    }

    const ungroundedResponse = await geminiService.generateUngroundedResponse(query)

    return NextResponse.json({
      query,
      response: ungroundedResponse,
      timestamp: Date.now()
    })
  } catch (error) {
    console.error('Ungrounded generation API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
