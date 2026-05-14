import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

// Helper: Shuffle Array
const shuffle = (array: any[]) => {
  const copy = [...array]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const setName = searchParams.get('setName')

    if (!setName) {
      return NextResponse.json({ error: 'setName parameter is required' }, { status: 400 })
    }

    let cards: any[] = []

    // Clean page title from wiki suffixes (e.g. "Legend of Blue Eyes White Dragon (Japanese)" -> "Legend of Blue Eyes White Dragon")
    const targetSetName = setName
      .replace(/\s*\((Japanese|Korean|Simplified Chinese|Traditional Chinese|Asian-English|German|French|Italian|Spanish|Portuguese|TCG|OCG|set|release|pack|card set)\)\s*/gi, '')
      .trim()

    // 1. Try fetching the real card list of this specific booster pack from YGOPRODeck
    try {
      const ygoproUrl = `https://db.ygoprodeck.com/api/v7/cardinfo.php?cardset=${encodeURIComponent(targetSetName)}`
      const response = await fetch(ygoproUrl, {
        next: { revalidate: 86400 } // Cache set content for 24 hours
      })

      if (response.ok) {
        const body = await response.json()
        const apiCards = body?.data || []
        if (Array.isArray(apiCards) && apiCards.length > 0) {
          cards = apiCards.map((c: any) => {
            // Find set-specific rarity code and name
            const setInfo = c.card_sets?.find(
              (s: any) => s.set_name?.toLowerCase() === targetSetName.toLowerCase()
            )
            const drawnRarity = setInfo?.set_rarity || 'Common'

            return {
              id: c.id,
              passcode: c.id.toString(), // YGOPRODeck id is the passcode
              name: c.name,
              desc: c.desc || '',
              type: c.type || 'Normal Monster',
              atk: c.atk ?? null,
              def: c.def ?? null,
              level: c.level ?? null,
              attribute: c.attribute ?? null,
              imageUrl: c.card_images?.[0]?.image_url || `https://images.ygoprodeck.com/images/cards/${c.id}.jpg`,
              drawnRarity
            }
          })
        }
      }
    } catch (apiErr) {
      console.error('Failed to retrieve cardset from YGOPRODeck API, falling back to local Prisma:', apiErr)
    }

    // 2. Local Fallback: If YGOPRODeck was empty or failed, fetch cards from local DB Prisma
    if (cards.length === 0) {
      const setRelations = await prisma.cardSet.findMany({
        where: {
          setName: {
            equals: setName,
            mode: 'insensitive'
          }
        },
        include: {
          rarity: true,
          card: true
        }
      })

      if (setRelations.length > 0) {
        cards = setRelations.map((rel) => {
          if (!rel.card) return null
          return {
            id: rel.card.id,
            passcode: rel.card.passcode,
            name: rel.card.name,
            desc: rel.card.description || '',
            type: 'Normal Monster', // default fallback
            atk: rel.card.attack ?? null,
            def: rel.card.defense ?? null,
            level: rel.card.level ?? null,
            attribute: null,
            imageUrl: rel.card.imageUrl || (rel.card.passcode ? `https://images.ygoprodeck.com/images/cards/${rel.card.passcode}.jpg` : null),
            drawnRarity: rel.rarity?.name || 'Common'
          }
        }).filter(Boolean) as any[]
      }
    }

    // Shuffle the loaded cards
    if (cards.length > 0) {
      cards = shuffle(cards)
    }

    // 3. Robust Backfill Fallback: If we have fewer than 9 cards, backfill using random popular cards from local DB
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
      const mappedExtras = extraCards
        .filter(Boolean)
        .map((c: any) => ({
          id: c.id,
          passcode: c.passcode,
          name: c.name,
          desc: c.description || '',
          type: c.type?.name || 'Normal Monster',
          atk: c.atk ?? null,
          def: c.def ?? null,
          level: c.level ?? null,
          attribute: c.attribute?.name || null,
          imageUrl: c.imageUrl || (c.passcode ? `https://images.ygoprodeck.com/images/cards/${c.passcode}.jpg` : null),
          drawnRarity: 'Common'
        }))

      cards = [...cards, ...mappedExtras]
    }

    // Keep exactly 9 cards for the booster opening
    const finalCards = cards.slice(0, 9)

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
