import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''

    // 1. Fetch live booster set images from YGOPRODeck's cardsets.php API to get real physical pack covers
    const setImagesMap = new Map<string, string>()
    try {
      const response = await fetch('https://db.ygoprodeck.com/api/v7/cardsets.php', {
        next: { revalidate: 86400 } // Cache for 24 hours
      })
      if (response.ok) {
        const apiSets = await response.json()
        if (Array.isArray(apiSets)) {
          apiSets.forEach((set: any) => {
            if (set.set_name && set.set_image) {
              setImagesMap.set(set.set_name.toLowerCase(), set.set_image)
            }
          })
        }
      }
    } catch (e) {
      console.error('Failed to fetch set images from YGOPRODeck API:', e)
    }

    // 2. Get unique set names from our card_sets database
    const uniqueSets = await prisma.cardSet.findMany({
      distinct: ['setName'],
      select: {
        setName: true,
        setCode: true,
        releaseDate: true,
        card: {
          select: {
            imageUrl: true
          }
        }
      },
      orderBy: {
        setName: 'asc'
      }
    })

    // 3. Fetch the counts for each setName to know how many cards are inside
    const setCounts = await prisma.cardSet.groupBy({
      by: ['setName'],
      _count: {
        cardId: true
      }
    })

    // Create a lookup map for counts
    const countMap: Record<string, number> = {}
    setCounts.forEach(item => {
      countMap[item.setName] = item._count.cardId
    })

    // 4. Map the results into a clean booster pack list format
    let boosterPacks = uniqueSets.map(item => {
      // Extract the pack code prefix from the printed setCode (e.g., LOB-EN001 -> LOB)
      const codeParts = item.setCode ? item.setCode.split('-') : []
      const packCode = codeParts[0] || 'SET'

      // Check if we have the physical pack wrapper image from YGOPRODeck's cardsets API
      // Otherwise fallback to the representative card's illustration
      const packImageUrl = setImagesMap.get(item.setName.toLowerCase()) || item.card?.imageUrl || null

      return {
        setName: item.setName,
        setCode: packCode,
        releaseDate: item.releaseDate ? item.releaseDate.toISOString().split('T')[0] : '2002-03-08',
        num_of_cards: countMap[item.setName] || 1,
        imageUrl: packImageUrl
      }
    })

    // Filter by search if provided
    if (search) {
      const q = search.toLowerCase()
      boosterPacks = boosterPacks.filter(p => 
        p.setName.toLowerCase().includes(q) || 
        p.setCode.toLowerCase().includes(q)
      )
    }

    return NextResponse.json(boosterPacks)
  } catch (err: any) {
    console.error('Error in booster pack api:', err)
    return NextResponse.json({ error: 'Internal Server Error', details: err.message }, { status: 500 })
  }
}
