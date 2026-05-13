/**
 * Bulk Fetch Card Prices from YGOPRODeck API
 * Fetches prices for all cards in the database
 *
 * Usage: node scripts/fetch-prices-bulk.js
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const YGOPRODECK_API = 'https://db.ygoprodeck.com/api/v7/cardinfo.php';

// Rate limiting - wait between requests
const REQUEST_DELAY = 100; // ms

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchCardPrice(cardName) {
  try {
    const response = await fetch(`${YGOPRODECK_API}?fname=${encodeURIComponent(cardName)}`, {
      headers: {
        'User-Agent': 'YuGiPedia/1.0 (Market Price Update Script)'
      }
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    const cards = data.data || [];

    if (cards.length === 0) {
      return null;
    }

    // Get the first card's prices
    const card = cards[0];
    const prices = card.card_prices?.[0] || {};

    return {
      name: card.name,
      prices: {
        cardMarketPrice: prices.cardmarket_price || null,
        tcgPlayerPrice: prices.tcgplayer_price || null,
        eBayPrice: prices.ebay_price || null,
        amazonPrice: prices.amazon_price || null,
        coolStuffIncPrice: prices.coolstuffinc_price || null,
      }
    };
  } catch (error) {
    console.error(`Error fetching price for ${cardName}:`, error.message);
    return null;
  }
}

async function updateCardPrices() {
  console.log('🚀 Starting bulk price fetch...\n');

  // Get all cards from database
  const cards = await prisma.card.findMany({
    select: {
      id: true,
      name: true,
      passcode: true,
    },
    orderBy: {
      name: 'asc',
    },
  });

  console.log(`📦 Total cards in database: ${cards.length}\n`);

  let updated = 0;
  let skipped = 0;
  let errors = 0;

  // Process in batches to avoid overwhelming the API
  const batchSize = 50;
  const batches = Math.ceil(cards.length / batchSize);

  for (let batch = 0; batch < batches; batch++) {
    const start = batch * batchSize;
    const end = Math.min(start + batchSize, cards.length);
    const batchCards = cards.slice(start, end);

    console.log(`\n📦 Processing batch ${batch + 1}/${batches} (cards ${start + 1}-${end})`);

    // Process cards in this batch concurrently (with limit)
    const batchPromises = batchCards.map(async (card, index) => {
      const priceData = await fetchCardPrice(card.name);

      await sleep(REQUEST_DELAY); // Rate limiting

      if (priceData && priceData.prices) {
        // Update card with prices
        await prisma.card.update({
          where: { id: card.id },
          data: {
            price: priceData.prices.tcgPlayerPrice
              ? parseFloat(priceData.prices.tcgPlayerPrice)
              : null,
            cardMarketPrice: priceData.prices.cardMarketPrice
              ? parseFloat(priceData.prices.cardMarketPrice)
              : null,
            tcgPlayerPrice: priceData.prices.tcgPlayerPrice
              ? parseFloat(priceData.prices.tcgPlayerPrice)
              : null,
            eBayPrice: priceData.prices.eBayPrice
              ? parseFloat(priceData.prices.eBayPrice)
              : null,
            amazonPrice: priceData.prices.amazonPrice
              ? parseFloat(priceData.prices.amazonPrice)
              : null,
            coolStuffIncPrice: priceData.prices.coolStuffIncPrice
              ? parseFloat(priceData.prices.coolStuffIncPrice)
              : null,
            priceUpdatedAt: new Date(),
          },
        });

        console.log(`  ✅ ${card.name}`);
        return { success: true, name: card.name };
      } else {
        console.log(`  ⚠️  No price data for ${card.name}`);
        return { success: false, name: card.name, reason: 'no_data' };
      }
    });

    const results = await Promise.all(batchPromises);

    updated += results.filter(r => r.success).length;
    skipped += results.filter(r => !r.success).length;

    // Progress update
    const progress = ((batch + 1) / batches * 100).toFixed(1);
    console.log(`\n📊 Progress: ${progress}% | Updated: ${updated} | Skipped: ${skipped}`);
  }

  console.log('\n========================================');
  console.log('📊 FINAL STATS');
  console.log('========================================');
  console.log(`Total cards: ${cards.length}`);
  console.log(`Updated: ${updated}`);
  console.log(`Skipped: ${skipped}`);
  console.log(`Errors: ${errors}`);
  console.log('========================================\n');

  console.log('✅ Price update complete!');
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n\n⚠️ Interrupted by user. Saving progress...');
  await prisma.$disconnect();
  process.exit(1);
});

process.on('SIGTERM', async () => {
  console.log('\n\n⚠️ Received SIGTERM. Saving progress...');
  await prisma.$disconnect();
  process.exit(1);
});

// Run the script
updateCardPrices()
  .then(async () => {
    await prisma.$disconnect();
    process.exit(0);
  })
  .catch(async (error) => {
    console.error('❌ Fatal error:', error);
    await prisma.$disconnect();
    process.exit(1);
  });