const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

// Rate limit helper
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))

// Fetch card image from YGOPRODeck API
async function fetchCardImage(cardName) {
  try {
    const encodedName = encodeURIComponent(cardName)
    const response = await fetch(`https://db.ygoprodeck.com/api/v7/cardinfo.php?name=${encodedName}&num=1`)

    if (!response.ok) {
      return null
    }

    const data = await response.json()

    if (data.data && data.data.length > 0) {
      const card = data.data[0]
      if (card.card_images && card.card_images.length > 0) {
        return {
          imageUrl: card.card_images[0].image_url,
          ygoproId: card.id
        }
      }
    }

    return null
  } catch (error) {
    console.error(`Error fetching ${cardName}:`, error.message)
    return null
  }
}

async function main() {
  console.log('🚀 Starting YGOPRODeck Image Fetch...\n')
  console.log('This will take some time due to API rate limits.')
  console.log('Estimated time: 10-20 minutes for 13,118 cards\n')

  // Get all cards without imageUrl or with placeholder
  const cards = await prisma.card.findMany({
    where: {
      OR: [
        { imageUrl: null },
        { imageUrl: { contains: 'placeholder' } }
      ]
    },
    select: {
      id: true,
      name: true,
      passcode: true,
      imageUrl: true
    }
  })

  const totalCards = cards.length
  console.log(`Found ${totalCards} cards needing image update\n`)

  let success = 0
  let failed = 0
  let skipped = 0

  // Process in batches with rate limiting
  const BATCH_SIZE = 10
  const DELAY_MS = 500 // 500ms delay between requests to avoid rate limiting

  for (let i = 0; i < cards.length; i += BATCH_SIZE) {
    const batch = cards.slice(i, i + BATCH_SIZE)

    console.log(`\n📦 Processing batch ${Math.floor(i / BATCH_SIZE) + 1} (cards ${i + 1} to ${Math.min(i + BATCH_SIZE, totalCards)})`)

    for (const card of batch) {
      // Check if already has valid imageUrl (not placeholder)
      if (card.imageUrl && !card.imageUrl.includes('placeholder') && card.imageUrl.startsWith('http')) {
        console.log(`  ⏭️  Skipping ${card.name} (already has image)`)
        skipped++
        continue
      }

      const result = await fetchCardImage(card.name)

      if (result && result.imageUrl) {
        // Update database
        await prisma.card.update({
          where: { id: card.id },
          data: { imageUrl: result.imageUrl }
        })
        success++
        console.log(`  ✅ ${card.name} -> ${result.imageUrl}`)
      } else {
        failed++
        console.log(`  ❌ ${card.name} (not found in YGOPRODeck)`)
      }

      // Rate limiting
      await sleep(DELAY_MS)
    }

    // Progress update
    const progress = Math.min(i + BATCH_SIZE, totalCards)
    const percent = ((progress / totalCards) * 100).toFixed(1)
    console.log(`\n📊 Progress: ${progress}/${totalCards} (${percent}%) | ✅ ${success} | ❌ ${failed} | ⏭️ ${skipped}`)
  }

  console.log('\n========================================')
  console.log('📊 FINAL RESULTS:')
  console.log(`   Total cards processed: ${totalCards}`)
  console.log(`   ✅ Successfully updated: ${success}`)
  console.log(`   ❌ Failed (not found): ${failed}`)
  console.log(`   ⏭️  Skipped (already had image): ${skipped}`)
  console.log('========================================\n')

  if (success > 0) {
    console.log(`🎉 ${success} card images have been updated!`)
    console.log('Refreshing the website will now show the images.\n')
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
