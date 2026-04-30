import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const YGOPRODECK_API = 'https://db.ygoprodeck.com/api/v7/cardinfo.php'

// GET /api/market - Get card prices
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const cardId = searchParams.get('cardId')
    const cardName = searchParams.get('name')

    // If cardId is provided, fetch by ID
    if (cardId) {
      const card = await prisma.card.findUnique({
        where: { id: cardId },
        include: {
          type: true,
          attribute: true,
        },
      })

      if (!card) {
        return NextResponse.json({ error: 'Card not found' }, { status: 404 })
      }

      return NextResponse.json({
        card,
        prices: {
          cardMarket: card.cardMarketPrice,
          tcgPlayer: card.tcgPlayerPrice,
          eBay: card.eBayPrice,
          amazon: card.amazonPrice,
          coolStuffInc: card.coolStuffIncPrice,
        },
        timestamp: card.priceUpdatedAt,
      })
    }

    // If cardName is provided, search by name
    if (cardName) {
      // Use simple contains - database handles case-insensitive internally
      const cards = await prisma.card.findMany({
        where: {
          name: {
            contains: cardName,
          }
        },
        include: {
          type: true,
        },
        take: 10,
      })

      // Return cards with prices
      const cardsWithPrices = cards.map(card => ({
        id: card.id,
        name: card.name,
        passcode: card.passcode,
        imageUrl: card.imageUrl,
        type: card.type,
        cardMarketPrice: card.cardMarketPrice,
        tcgPlayerPrice: card.tcgPlayerPrice,
        eBayPrice: card.eBayPrice,
        amazonPrice: card.amazonPrice,
        coolStuffIncPrice: card.coolStuffIncPrice,
      }))

      return NextResponse.json({
        cards: cardsWithPrices,
        source: 'Database',
        count: cardsWithPrices.length,
        timestamp: new Date().toISOString(),
      })
    }

    // Get all cards with prices (paginated)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '24')

    const cards = await prisma.card.findMany({
      where: {
        OR: [
          { cardMarketPrice: { not: null } },
          { tcgPlayerPrice: { not: null } },
          { eBayPrice: { not: null } },
          { amazonPrice: { not: null } },
          { coolStuffIncPrice: { not: null } },
        ],
      },
      include: {
        type: true,
        attribute: true,
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: {
        name: 'asc',
      },
    })

    const total = await prisma.card.count({
      where: {
        OR: [
          { cardMarketPrice: { not: null } },
          { tcgPlayerPrice: { not: null } },
          { eBayPrice: { not: null } },
          { amazonPrice: { not: null } },
          { coolStuffIncPrice: { not: null } },
        ],
      },
    })

    return NextResponse.json({
      cards,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
      source: 'Database',
    })
  } catch (error) {
    console.error('Error in market API:', error)
    return NextResponse.json(
      { error: 'Failed to fetch card prices' },
      { status: 500 }
    )
  }
}