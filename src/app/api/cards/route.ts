import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/cards - Get all cards with filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    // Query parameters
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '24')
    const typeId = searchParams.get('typeId')
    const attribute = searchParams.get('attribute') // string: FIRE, WATER, etc.
    const search = searchParams.get('search')
    const categoryId = searchParams.get('categoryId')
    const sortBy = searchParams.get('sortBy')

    // Build where clause
    const where: any = {}

    if (typeId) {
      where.typeId = parseInt(typeId)
    }

    // Handle attribute by name (FIRE, WATER, etc.)
    if (attribute) {
      const attrRecord = await prisma.cardAttribute.findUnique({
        where: { name: attribute }
      })
      if (attrRecord) {
        where.attributeId = attrRecord.id
      } else {
        // If attribute doesn't exist, return no results
        where.attributeId = -1
      }
    }

    if (search) {
      const trimmed = search.trim()
      // Use case-insensitive search for the whole phrase OR each individual word
      const words = trimmed.split(/\s+/).filter(w => w.length > 0)

      where.OR = [
        // Whole phrase match (highest priority, catches hyphenated names like Blue-Eyes)
        { name: { contains: trimmed, mode: 'insensitive' } },
        // Individual word matches
        ...words.map(word => ({ name: { contains: word, mode: 'insensitive' } }))
      ]
    }

    if (categoryId) {
      where.cardCategories = {
        some: {
          categoryId: parseInt(categoryId)
        }
      }
    }

    // Build orderBy clause
    let orderBy: any = { name: 'asc' }

    if (sortBy === 'atk_desc') {
      orderBy = { attack: { sort: 'desc', nulls: 'last' } }
    } else if (sortBy === 'atk_asc') {
      orderBy = { attack: { sort: 'asc', nulls: 'last' } }
    } else if (sortBy === 'def_desc') {
      orderBy = { defense: { sort: 'desc', nulls: 'last' } }
    } else if (sortBy === 'def_asc') {
      orderBy = { defense: { sort: 'asc', nulls: 'last' } }
    } else if (sortBy === 'price_desc') {
      orderBy = { tcgPlayerPrice: { sort: 'desc', nulls: 'last' } }
    } else if (sortBy === 'price_asc') {
      orderBy = { tcgPlayerPrice: { sort: 'asc', nulls: 'last' } }
    }

    // Get total count
    const total = await prisma.card.count({ where })

    // Get cards with pagination
    // Only include necessary relations for the album listing
    const cards = await prisma.card.findMany({
      where,
      include: {
        type: true,
        attribute: true,
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy,
    })

    const response = NextResponse.json({
      cards,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    })

    // Cache for 60 seconds to improve performance
    response.headers.set('Cache-Control', 's-maxage=60, stale-while-revalidate=300')

    return response
  } catch (error: any) {
    console.error('Error fetching cards:', error)
    return NextResponse.json(
      { error: `Failed to fetch cards: ${error.message}` },
      { status: 500 }
    )
  }
}

// POST /api/cards - Create new card (Admin only)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const card = await prisma.card.create({
      data: {
        name: body.name,
        passcode: body.passcode,
        typeId: body.typeId,
        attributeId: body.attributeId,
        frameId: body.frameId,
        raceId: body.raceId,
        level: body.level,
        rank: body.rank,
        linkRating: body.linkRating,
        attack: body.attack,
        defense: body.defense,
        description: body.description,
        imageUrl: body.imageUrl,
        subType: body.subType,
      },
    })

    return NextResponse.json(card, { status: 201 })
  } catch (error) {
    console.error('Error creating card:', error)
    return NextResponse.json(
      { error: 'Failed to create card' },
      { status: 500 }
    )
  }
}