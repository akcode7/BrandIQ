import { NextRequest, NextResponse } from 'next/server'
import qlooService from '@/lib/services/qloo'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { filterType, signals, filters } = body

    if (!filterType) {
      return NextResponse.json(
        { error: 'filterType is required' },
        { status: 400 }
      )
    }

    const result = await qlooService.getInsights({
      filterType,
      signals,
      filters
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error('Insights API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const brand = searchParams.get('brand')

    if (!brand) {
      return NextResponse.json(
        { error: 'Brand parameter is required' },
        { status: 400 }
      )
    }

    const result = await qlooService.getAudienceData(brand)
    return NextResponse.json({ data: result })
  } catch (error) {
    console.error('Audience insights API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
