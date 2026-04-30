import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/cards/lookup - Get lookup tables data
export async function GET() {
  try {
    const [cardTypes, attributes, frames, races, rarities] = await Promise.all([
      prisma.cardType.findMany({ orderBy: { name: 'asc' } }),
      prisma.cardAttribute.findMany({ orderBy: { name: 'asc' } }),
      prisma.cardFrame.findMany({ orderBy: { name: 'asc' } }),
      prisma.monsterRace.findMany({ orderBy: { name: 'asc' } }),
      prisma.rarity.findMany({ orderBy: { name: 'asc' } }),
    ])

    return NextResponse.json({
      cardTypes,
      attributes,
      frames,
      races,
      rarities,
    })
  } catch (error) {
    console.error('Error fetching lookup data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch lookup data' },
      { status: 500 }
    )
  }
}
