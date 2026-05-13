import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''

    // 1. Get unique set names from our card_sets database
    // We can query unique cardSet entries using distinct on setName
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

    // 2. Fetch the counts for each setName to know how many cards are inside
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

    // 3. Map the results into a clean booster pack list format
    let boosterPacks = uniqueSets.map(item => {
      // Extract the pack code prefix from the printed setCode (e.g., LOB-EN001 -> LOB)
      const codeParts = item.setCode ? item.setCode.split('-') : []
      const packCode = codeParts[0] || 'SET'

      return {
        setName: item.setName,
        setCode: packCode,
        releaseDate: item.releaseDate ? item.releaseDate.toISOString().split('T')[0] : '2002-03-08',
        num_of_cards: countMap[item.setName] || 1,
        imageUrl: item.card?.imageUrl || null
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
