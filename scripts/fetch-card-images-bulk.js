const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

// Total cards in YGOPRODeck database
const YGOPRODECK_TOTAL = 14503
const BATCH_SIZE = 100

async function fetchYGOPRODeckCards(offset, limit) {
  try {
    const response = await fetch(`https://db.ygoprodeck.com/api/v7/cardinfo.php?num=${limit}&offset=${offset}`)
    if (!response.ok) {
      console.error(`API error: ${response.status}`)
      return null
    }
    return await response.json()
  } catch (error) {
    console.error(`Fetch error at offset ${offset}:`, error.message)
    return null
  }
}

async function main() {
  console.log('🚀 Fetching ALL card data from YGOPRODeck API...\n')
  console.log(`Total cards to fetch: ${YGOPRODECK_TOTAL}`)
  console.log(`Batch size: ${BATCH_SIZE}`)
  console.log(`Estimated batches: ${Math.ceil(YGOPRODECK_TOTAL / BATCH_SIZE)}\n`)

  // Step 1: Fetch all cards from YGOPRODeck
  console.log('📡 Fetching card data from YGOPRODeck (this will take a few minutes)...\n')

  const nameToImageUrl = new Map()

  for (let offset = 0; offset < YGOPRODECK_TOTAL; offset += BATCH_SIZE) {
    const batchNum = Math.floor(offset / BATCH_SIZE) + 1
    const totalBatches = Math.ceil(YGOPRODECK_TOTAL / BATCH_SIZE)

    process.stdout.write(`\rFetching batch ${batchNum}/${totalBatches} (${offset} - ${Math.min(offset + BATCH_SIZE, YGOPRODECK_TOTAL)})`)

    const data = await fetchYGOPRODeckCards(offset, BATCH_SIZE)

    if (data && data.data) {
      for (const card of data.data) {
        if (card.card_images && card.card_images.length > 0) {
          // Map card name (case-insensitive) to image URL
          const name = card.name
          nameToImageUrl.set(name.toLowerCase(), card.card_images[0].image_url)
        }
      }
    }

    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 100))
  }

  console.log(`\n\n✅ Fetched image URLs for ${nameToImageUrl.size} unique cards from YGOPRODeck\n`)

  // Step 2: Get all cards from our database
  console.log('📦 Getting cards from our database...')
  const dbCards = await prisma.card.findMany({
    select: {
      id: true,
      name: true,
      imageUrl: true
    }
  })
  console.log(`Found ${dbCards.length} cards in database\n`)

  // Step 3: Update cards with matching images
  console.log('🔄 Updating cards with image URLs...\n')

  let updated = 0
  let skipped = 0
  let notFound = 0

  for (const card of dbCards) {
    const normalizedName = card.name.toLowerCase()

    // Check if already has valid imageUrl
    if (card.imageUrl && card.imageUrl.includes('ygoprodeck.com')) {
      skipped++
      continue
    }

    // Look for matching image URL
    let imageUrl = nameToImageUrl.get(normalizedName)

    // Try partial matching if exact match not found
    if (!imageUrl) {
      for (const [apiName, url] of nameToImageUrl.entries()) {
        if (apiName.includes(normalizedName) || normalizedName.includes(apiName)) {
          imageUrl = url
          break
        }
      }
    }

    if (imageUrl) {
      await prisma.card.update({
        where: { id: card.id },
        data: { imageUrl: imageUrl }
      })
      updated++
      if (updated <= 10) {
        console.log(`  ✅ ${card.name} -> ${imageUrl}`)
      } else if (updated === 11) {
        console.log('  ... (more updates in progress)')
      }
    } else {
      notFound++
    }
  }

  console.log('\n========================================')
  console.log('📊 RESULTS:')
  console.log(`   Cards updated with images: ${updated}`)
  console.log(`   Cards skipped (already had image): ${skipped}`)
  console.log(`   Cards not found in YGOPRODeck: ${notFound}`)
  console.log('========================================\n')

  if (updated > 0) {
    console.log(`🎉 ${updated} card images have been updated!`)
    console.log('Refresh the website to see the images.\n')
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
