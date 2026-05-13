import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const format = searchParams.get('format') || 'tcg' // tcg, ocg, goat

    // Map format to correct YGOPRODeck parameter
    let banlistParam = 'tcg'
    if (format === 'ocg') banlistParam = 'ocg'
    if (format === 'goat') banlistParam = 'goat'

    const url = `https://db.ygoprodeck.com/api/v7/cardinfo.php?banlist=${banlistParam}`
    
    // Fetch from YGOPRODeck with a cache header
    const response = await fetch(url, {
      next: { revalidate: 86400 } // Cache for 24 hours on Vercel Edge CDN
    })

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch banlist from external provider' }, { status: 502 })
    }

    const data = await response.json()
    if (!data || !Array.isArray(data.data)) {
      return NextResponse.json({ error: 'Invalid response format' }, { status: 502 })
    }

    const cards = data.data

    // Separate into three official levels
    const forbidden: any[] = []
    const limited: any[] = []
    const semiLimited: any[] = []

    cards.forEach((card: any) => {
      const banInfo = card.banlist_info
      if (!banInfo) return

      let status = ''
      if (format === 'tcg') status = banInfo.ban_tcg
      else if (format === 'ocg') status = banInfo.ban_ocg
      else if (format === 'goat') status = banInfo.ban_goat

      const cleanCard = {
        id: card.id,
        name: card.name,
        type: card.type,
        race: card.race,
        imageUrl: card.card_images?.[0]?.image_url || null,
        croppedUrl: card.card_images?.[0]?.image_url_cropped || null,
        description: card.desc,
        passcode: card.id.toString().padStart(8, '0'),
        attack: card.atk,
        defense: card.def,
        level: card.level
      }

      if (status === 'Banned' || status === 'Forbidden') {
        forbidden.push(cleanCard)
      } else if (status === 'Limited') {
        limited.push(cleanCard)
      } else if (status === 'Semi-Limited') {
        semiLimited.push(cleanCard)
      }
    })

    // Sort alphabetically
    const sortByName = (a: any, b: any) => a.name.localeCompare(b.name)

    return NextResponse.json({
      format,
      forbidden: forbidden.sort(sortByName),
      limited: limited.sort(sortByName),
      semiLimited: semiLimited.sort(sortByName),
      timestamp: new Date().toISOString()
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=43200'
      }
    })
  } catch (err: any) {
    console.error('Error in banlist api:', err)
    return NextResponse.json({ error: 'Internal Server Error', details: err.message }, { status: 500 })
  }
}
