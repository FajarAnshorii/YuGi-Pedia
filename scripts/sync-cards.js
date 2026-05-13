const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Rarity normalization helper
function normalizeRarity(rarityStr) {
  if (!rarityStr) return 'C';
  const r = rarityStr.toLowerCase();
  if (r.includes('quarter century')) return 'QUARTER';
  if (r.includes('prismatic secret')) return 'PRISMATIC';
  if (r.includes('platinum secret') || r.includes('premium gold') || r.includes('platinum rare')) return 'PLATINUM';
  if (r.includes('secret rare')) return 'SECRET';
  if (r.includes('ghost rare')) return 'GHOST';
  if (r.includes('gold rare')) return 'GR';
  if (r.includes('ultimate rare')) return 'ULTIMATE';
  if (r.includes('starlight rare')) return 'STAR';
  if (r.includes('ultra rare')) return 'UR';
  if (r.includes('super rare')) return 'SR';
  if (r.includes('rare')) return 'R';
  return 'C';
}

async function main() {
  console.log('🔄 Fetching reference lookup tables from database...');
  const cardTypes = await prisma.cardType.findMany();
  const typeIdMap = {};
  cardTypes.forEach(ct => {
    typeIdMap[ct.name.toUpperCase()] = ct.id;
  });

  const cardAttributes = await prisma.cardAttribute.findMany();
  const attrIdMap = {};
  cardAttributes.forEach(ca => {
    attrIdMap[ca.name.toUpperCase()] = ca.id;
  });

  const monsterRaces = await prisma.monsterRace.findMany();
  const raceIdMap = {};
  monsterRaces.forEach(mr => {
    raceIdMap[mr.name.toLowerCase()] = mr.id;
  });

  const rarities = await prisma.rarity.findMany();
  const rarityCodeMap = {};
  rarities.forEach(r => {
    rarityCodeMap[r.code.toUpperCase()] = r.id;
  });

  // Fetch all category IDs
  const categoriesList = await prisma.category.findMany();
  const categorySlugMap = {};
  categoriesList.forEach(cat => {
    categorySlugMap[cat.slug] = cat.id;
  });

  console.log('📚 Database reference loaded. Fetching existing card names from local database...');
  const existingCards = await prisma.card.findMany({
    select: { name: true }
  });
  const existingSet = new Set(existingCards.map(c => c.name.toLowerCase()));
  console.log(`📊 Local cards in database: ${existingSet.size}`);

  console.log('🌐 Fetching full card database from YGOPRODeck API (this can take several seconds)...');
  const response = await fetch('https://db.ygoprodeck.com/api/v7/cardinfo.php');
  if (!response.ok) {
    throw new Error(`YGOPRODeck API responded with status: ${response.status}`);
  }
  const result = await response.json();
  const apiCards = result.data;
  console.log(`🌐 Total cards in YGOPRODeck API: ${apiCards.length}`);

  // Find cards not in local database
  const missingCards = apiCards.filter(c => !existingSet.has(c.name.toLowerCase()));
  console.log(`✨ Found ${missingCards.length} missing cards to insert.`);

  if (missingCards.length === 0) {
    console.log('✅ Your database is already fully synced and up-to-date!');
    return;
  }

  // Concurrent execution within batches
  const batchSize = 50;
  let insertedCount = 0;

  async function importSingleCard(card) {
    try {
      // Determine typeId
      const isSpell = card.type.toLowerCase().includes('spell');
      const isTrap = card.type.toLowerCase().includes('trap');
      let typeId = typeIdMap['MONSTER'] || 1;
      if (isSpell) typeId = typeIdMap['SPELL'] || 2;
      if (isTrap) typeId = typeIdMap['TRAP'] || 3;

      // Determine attributeId
      let attributeId = null;
      if (card.attribute) {
        const attrKey = card.attribute.toUpperCase();
        if (attrIdMap[attrKey]) {
          attributeId = attrIdMap[attrKey];
        }
      }

      // Determine raceId
      let raceId = null;
      if (card.race) {
        const raceKey = card.race.toLowerCase();
        if (raceIdMap[raceKey]) {
          raceId = raceIdMap[raceKey];
        }
      }

      // Parse stats
      const level = card.level ? parseInt(card.level) : null;
      const linkRating = card.linkval ? parseInt(card.linkval) : null;
      const rank = card.type.toLowerCase().includes('xyz') ? level : null;

      // SubType formulation
      let subType = null;
      if (!isSpell && !isTrap) {
        // Monster card
        const monsterType = card.type.replace(' Monster', '').trim();
        subType = `[${card.race || 'Unknown'}／${monsterType}]`;
      } else {
        // Spell/Trap card
        if (card.race && card.race !== 'Normal') {
          subType = card.race;
        }
      }

      // Prices parsing
      const tcgPrice = parseFloat(card.card_prices?.[0]?.tcgplayer_price) || null;
      const cmPrice = parseFloat(card.card_prices?.[0]?.cardmarket_price) || null;
      const ebayPrice = parseFloat(card.card_prices?.[0]?.ebay_price) || null;
      const amazonPrice = parseFloat(card.card_prices?.[0]?.amazon_price) || null;
      const coolstuffPrice = parseFloat(card.card_prices?.[0]?.coolstuffinc_price) || null;

      // Create card entry
      const createdCard = await prisma.card.create({
        data: {
          name: card.name,
          passcode: card.id ? String(card.id) : null,
          typeId: typeId,
          attributeId: attributeId,
          raceId: raceId,
          level: level,
          rank: rank,
          linkRating: linkRating,
          attack: card.atk !== undefined ? parseInt(card.atk) : null,
          defense: card.def !== undefined ? parseInt(card.def) : null,
          description: card.desc || null,
          imageUrl: card.card_images?.[0]?.image_url || null,
          subType: subType,
          linkMarkers: card.link_markers ? JSON.stringify(card.link_markers) : null,
          price: tcgPrice,
          tcgPlayerPrice: tcgPrice,
          cardMarketPrice: cmPrice,
          eBayPrice: ebayPrice,
          amazonPrice: amazonPrice,
          coolStuffIncPrice: coolstuffPrice,
          priceUpdatedAt: new Date()
        }
      });

      // Insert card sets if they exist
      if (card.card_sets && card.card_sets.length > 0) {
        for (const set of card.card_sets) {
          if (!set.set_name || !set.set_code) continue;
          const rarityId = rarityCodeMap[normalizeRarity(set.set_rarity)] || rarityCodeMap['C'] || 1;

          try {
            const createdSet = await prisma.cardSet.create({
              data: {
                cardId: createdCard.id,
                setName: set.set_name,
                setCode: set.set_code,
                rarityId: rarityId,
                releaseDate: null,
                price: parseFloat(set.set_price) || null
              }
            });

            if (set.set_price) {
              await prisma.cardSetPrice.create({
                data: {
                  cardSetId: createdSet.id,
                  source: 'YGOPRODeck',
                  price: parseFloat(set.set_price) || null,
                  lastUpdated: new Date()
                }
              });
            }
          } catch (setErr) {
            // Ignore duplicate set code gracefully
          }
        }
      }

      // Add default categories
      const categoriesToAdd = ['all-cards'];
      if (!isSpell && !isTrap) {
        categoriesToAdd.push('monster-cards');
        if (card.race) {
          const raceSlug = card.race.toLowerCase().replace(' ', '-').replace('_', '-');
          if (categorySlugMap[raceSlug]) {
            categoriesToAdd.push(raceSlug);
          }
        }
      } else if (isSpell) {
        categoriesToAdd.push('spell-cards');
      } else if (isTrap) {
        categoriesToAdd.push('trap-cards');
      }

      for (const slug of categoriesToAdd) {
        const categoryId = categorySlugMap[slug];
        if (categoryId) {
          try {
            await prisma.cardCategory.create({
              data: {
                cardId: createdCard.id,
                categoryId: categoryId
              }
            });
          } catch (ccErr) {
            // Ignore duplicates
          }
        }
      }

      return true;
    } catch (err) {
      console.error(`❌ Failed to import card "${card.name}":`, err.message);
      return false;
    }
  }

  for (let i = 0; i < missingCards.length; i += batchSize) {
    const batch = missingCards.slice(i, i + batchSize);
    const results = await Promise.all(batch.map(card => importSingleCard(card)));
    const successCount = results.filter(Boolean).length;
    insertedCount += successCount;
    console.log(`📦 Progress: Imported ${insertedCount}/${missingCards.length} missing cards...`);
  }

  console.log(`\n🎉 Sync complete! Total new cards imported: ${insertedCount}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
