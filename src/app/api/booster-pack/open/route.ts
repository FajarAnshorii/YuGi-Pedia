import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const setName = searchParams.get('setName')

    if (!setName) {
      return NextResponse.json({ error: 'setName parameter is required' }, { status: 400 })
    }

    // 1. Get cards in this set
    const setRelations = await prisma.cardSet.findMany({
      where: {
        setName: {
          equals: setName,
          mode: 'insensitive'
        }
      },
      include: {
        rarity: true,
        card: {
          include: {
            type: true,
            attribute: true
          }
        }
      }
    })

    let cards = setRelations.map(rel => rel.card).filter(Boolean)

    // Helper: Shuffle Array
    const shuffle = (array: any[]) => {
      const copy = [...array]
      for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]]
      }
      return copy
    }

    // Shuffle the set cards
    cards = shuffle(cards)

    // 2. Fallback: If we have fewer than 9 cards, backfill with general random cards
    if (cards.length < 9) {
      const missingCount = 9 - cards.length
      const totalCount = await prisma.card.count()
      
      const extraCardsPromises = Array.from({ length: missingCount }).map(async () => {
        const randomIndex = Math.floor(Math.random() * totalCount)
        return prisma.card.findFirst({
          skip: randomIndex,
          include: {
            type: true,
            attribute: true
          }
        })
      })
      
      const extraCards = await Promise.all(extraCardsPromises)
      cards = [...cards, ...(extraCards.filter(Boolean) as any[])]
    }

    // Return exactly 9 cards
    const finalCards = cards.slice(0, 9).map(card => {
      // Find rarity for this specific card in the set
      const matchingRelation = setRelations.find(rel => rel.cardId === card.id)
      return {
        ...card,
        drawnRarity: matchingRelation?.rarity?.name || 'Common'
      }
    })

    return NextResponse.json({
      setName,
      cards: finalCards,
      timestamp: new Date().toISOString()
    })
  } catch (err: any) {
    console.error('Error in booster open api:', err)
    return NextResponse.json({ error: 'Internal Server Error', details: err.message }, { status: 500 })
  }
}
