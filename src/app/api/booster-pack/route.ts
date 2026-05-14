import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// Global in-memory cache to prevent Yugipedia API rate limiting and provide instant 10ms response times
let cachedBoosterPacks: any[] | null = null
let lastCacheTime = 0
const CACHE_TTL = 1000 * 60 * 30 // Cache for 30 minutes

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''
    const bypassCache = searchParams.get('bypassCache') === 'true'

    const now = Date.now()
    if (cachedBoosterPacks && (now - lastCacheTime < CACHE_TTL) && !bypassCache) {
      let filtered = [...cachedBoosterPacks]
      if (search) {
        const q = search.toLowerCase()
        filtered = filtered.filter((p: any) => 
          p.setName.toLowerCase().includes(q) || 
          p.setCode.toLowerCase().includes(q)
        )
      }
      return NextResponse.json(filtered)
    }

    // 1. Fetch ALL global sets from YGOPRODeck for robust schema merging (Set Code, Card Counts, and Release Dates)
    const ygoproSetsMap = new Map<string, { setCode: string; releaseDate: string; numCards: number; rawName: string }>()
    try {
      const response = await fetch('https://db.ygoprodeck.com/api/v7/cardsets.php', {
        next: { revalidate: 86400 } // Cache for 24 hours on Next.js CDN
      })
      if (response.ok) {
        const apiSets = await response.json()
        if (Array.isArray(apiSets)) {
          apiSets.forEach((set: any) => {
            if (set.set_name) {
              const key = set.set_name.toLowerCase().trim()
              ygoproSetsMap.set(key, {
                setCode: set.set_code || 'SET',
                releaseDate: set.tcg_date || '2002-03-08',
                numCards: set.num_of_cards || 100,
                rawName: set.set_name
              })
            }
          })
        }
      }
    } catch (e) {
      console.error('Failed to fetch from YGOPRODeck API:', e)
    }

    // 2. Query Yugipedia MediaWiki API for TCG, OCG, and overall Booster Pack categories
    const categories = [
      'Category:TCG_Booster_Packs',
      'Category:OCG_Booster_Packs',
      'Category:Booster_Packs'
    ]

    const pagesMap = new Map<string, any>()

    const fetchPromises = categories.map(async (category) => {
      try {
        const yugipediaUrl = `https://yugipedia.com/api.php?action=query&generator=categorymembers&gcmtitle=${category}&gcmlimit=500&prop=pageimages&piprop=thumbnail&pithumbsize=500&format=json`
        const response = await fetch(yugipediaUrl, {
          headers: {
            'User-Agent': 'YuGiPediaWebClient/1.0 (https://yugi-pedia.vercel.app)'
          },
          next: { revalidate: 3600 } // CDN cache 1 hour
        })
        if (response.ok) {
          const data = await response.json()
          const pages = data?.query?.pages || {}
          Object.values(pages).forEach((page: any) => {
            if (page.title && page.ns === 0) {
              // Exclude non-booster parent directory pages or guidelines
              const skipTitles = ['booster pack', 'booster box', 'core booster', 'master set', 'set', 'release', 'pack']
              const titleLower = page.title.toLowerCase()
              if (skipTitles.includes(titleLower)) return

              pagesMap.set(page.title, page)
            }
          })
        }
      } catch (err) {
        console.error(`Failed to fetch Yugipedia category ${category}:`, err)
      }
    })

    await Promise.all(fetchPromises)

    let boosterPacks: any[] = []

    pagesMap.forEach((page, originalTitle) => {
      // Clean page title from wiki suffixes (e.g. "Legend of Blue Eyes White Dragon (TCG)" -> "Legend of Blue Eyes White Dragon")
      let cleanedTitle = originalTitle
        .replace(/\s*\((TCG|OCG|set|release|pack|card set)\)\s*/gi, '')
        .trim()

      // Clean MediaWiki thumbnail URL into original High-Resolution Cover Art
      let imageUrl: string | null = null
      if (page.thumbnail && page.thumbnail.source) {
        const src = page.thumbnail.source
        let clean = src.replace('/thumb/', '/').replace('//thumb/', '/')
        const extMatch = clean.match(/\.(png|jpg|jpeg|gif|webp)/i)
        if (extMatch && extMatch.index !== undefined) {
          clean = clean.substring(0, extMatch.index + extMatch[0].length)
        }
        imageUrl = clean
      }

      // Try matching cleaned title against YGOPRODeck's registry
      const titleLower = cleanedTitle.toLowerCase()
      const ygoproSet = ygoproSetsMap.get(titleLower) || ygoproSetsMap.get(originalTitle.toLowerCase())

      // Resolve fields with perfect defaults
      const setName = ygoproSet?.rawName || cleanedTitle
      const setCode = ygoproSet?.setCode || setName.split(' ').map((w: string) => w[0]).join('').toUpperCase().substring(0, 4)
      const releaseDate = ygoproSet?.releaseDate || '2024-05-13'
      const num_of_cards = ygoproSet?.numCards || 100

      boosterPacks.push({
        setName,
        setCode,
        releaseDate,
        num_of_cards,
        imageUrl
      })
    })

    // 3. Fallback to YGOPRODeck entire list if Yugipedia query returned absolutely empty
    if (boosterPacks.length === 0) {
      ygoproSetsMap.forEach((val) => {
        boosterPacks.push({
          setName: val.rawName,
          setCode: val.setCode,
          releaseDate: val.releaseDate,
          num_of_cards: val.numCards,
          imageUrl: `https://images.ygoprodeck.com/images/sets/${val.setCode}.jpg`
        })
      })
    }

    // Sort booster packs by releaseDate desc (newest first)
    boosterPacks.sort((a: any, b: any) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime())

    // Update global in-memory cache
    cachedBoosterPacks = boosterPacks
    lastCacheTime = now

    // Apply search filter if requested
    if (search) {
      const q = search.toLowerCase()
      boosterPacks = boosterPacks.filter((p: any) => 
        p.setName.toLowerCase().includes(q) || 
        p.setCode.toLowerCase().includes(q)
      )
    }

    return NextResponse.json(boosterPacks)
  } catch (err: any) {
    console.error('Error in booster pack catalog API:', err)
    return NextResponse.json({ error: 'Internal Server Error', details: err.message }, { status: 500 })
  }
}
