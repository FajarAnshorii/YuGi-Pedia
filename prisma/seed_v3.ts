/**
 * ================================================================
 * PRISMA SEED SCRIPT V3
 * Seed database dengan schema baru (lookup tables + CardSetPrice)
 * ================================================================
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Seed data
import seedData from './seed_data_v3.json'

async function main() {
  console.log('🌱 Starting seed process (v3)...')
  console.log(`📊 Total cards: ${seedData.cards.length}`)
  console.log(`📁 Total categories: ${seedData.categories.length}`)

  // ============================================
  // 0. Clear existing data
  // ============================================
  console.log('\n🗑️  Clearing existing data...')
  await prisma.userCard.deleteMany({})
  await prisma.cardSetPrice.deleteMany({})
  await prisma.cardCategory.deleteMany({})
  await prisma.cardSet.deleteMany({})
  await prisma.card.deleteMany({})
  await prisma.category.deleteMany({})
  await prisma.cardSetPrice.deleteMany({})
  await prisma.rarity.deleteMany({})
  await prisma.cardType.deleteMany({})
  await prisma.cardAttribute.deleteMany({})
  await prisma.cardFrame.deleteMany({})
  await prisma.monsterRace.deleteMany({})

  // ============================================
  // 1. Seed Lookup Tables
  // ============================================
  console.log('\n📋 Seeding lookup tables...')

  // Card Types
  const cardTypes = [
    { name: 'Monster' },
    { name: 'Spell' },
    { name: 'Trap' },
  ]
  for (const ct of cardTypes) {
    await prisma.cardType.create({ data: ct })
  }
  console.log(`  ✅ CardTypes: ${cardTypes.length}`)

  // Card Attributes
  const cardAttributes = [
    { name: 'FIRE' },
    { name: 'WATER' },
    { name: 'EARTH' },
    { name: 'WIND' },
    { name: 'LIGHT' },
    { name: 'DARK' },
    { name: 'DIVINE' },
  ]
  for (const ca of cardAttributes) {
    await prisma.cardAttribute.create({ data: ca })
  }
  console.log(`  ✅ CardAttributes: ${cardAttributes.length}`)

  // Card Frames
  const cardFrames = [
    { name: 'Normal' },
    { name: 'Effect' },
    { name: 'Fusion' },
    { name: 'Synchro' },
    { name: 'Xyz' },
    { name: 'Pendulum' },
    { name: 'Link' },
    { name: 'Token' },
  ]
  for (const cf of cardFrames) {
    await prisma.cardFrame.create({ data: cf })
  }
  console.log(`  ✅ CardFrames: ${cardFrames.length}`)

  // Monster Races
  const monsterRaces = [
    'Aqua', 'Beast', 'Beast-Warrior', 'Celestial Warrior', 'Cyberse',
    'Dinosaur', 'Divine-Beast', 'Dragon', 'Fairy', 'Fiend', 'Fish',
    'Illusion', 'Insect', 'Machine', 'Plant', 'Psychic', 'Pyro',
    'Reptile', 'Rock', 'Sea Serpent', 'Spellcaster', 'Thunder',
    'Warrior', 'Winged Beast', 'Wyrm', 'Zombie'
  ]
  for (const mr of monsterRaces) {
    await prisma.monsterRace.create({ data: { name: mr } })
  }
  console.log(`  ✅ MonsterRaces: ${monsterRaces.length}`)

  // Rarities
  const rarities = [
    { name: 'Common', code: 'C' },
    { name: 'Rare', code: 'R' },
    { name: 'Super Rare', code: 'SR' },
    { name: 'Ultra Rare', code: 'UR' },
    { name: 'Gold Rare', code: 'GR' },
    { name: 'Ghost Rare', code: 'GHOST' },
    { name: 'Secret Rare', code: 'SECRET' },
    { name: 'Ultimate Rare', code: 'ULTIMATE' },
    { name: 'Prismatic Secret Rare', code: 'PRISMATIC' },
    { name: 'Platinum Rare', code: 'PLATINUM' },
    { name: 'Starlight Rare', code: 'STAR' },
    { name: 'Quarter Century Secret Rare', code: 'QUARTER' },
  ]
  for (const r of rarities) {
    await prisma.rarity.create({ data: r })
  }
  console.log(`  ✅ Rarities: ${rarities.length}`)

  // Create ID maps
  const typeIdMap: Record<string, number> = {}
  for (const ct of cardTypes) {
    const found = await prisma.cardType.findUnique({ where: { name: ct.name } })
    if (found) typeIdMap[ct.name.toUpperCase()] = found.id
  }

  const attrIdMap: Record<string, number> = {}
  for (const ca of cardAttributes) {
    const found = await prisma.cardAttribute.findUnique({ where: { name: ca.name } })
    if (found) attrIdMap[ca.name] = found.id
  }

  const raceIdMap: Record<string, number> = {}
  const allRaces = await prisma.monsterRace.findMany()
  for (const r of allRaces) {
    raceIdMap[r.name] = r.id
  }

  const rarityCodeMap: Record<string, number> = {}
  for (const r of rarities) {
    const found = await prisma.rarity.findUnique({ where: { code: r.code } })
    if (found) rarityCodeMap[r.code] = found.id
  }

  // ============================================
  // 2. Seed Categories
  // ============================================
  console.log('\n🏷️  Seeding categories...')
  const categorySlugMap: Record<string, number> = {}
  for (const cat of seedData.categories) {
    const created = await prisma.category.create({
      data: {
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
      },
    })
    categorySlugMap[cat.slug] = created.id
  }
  console.log(`  ✅ Categories: ${seedData.categories.length}`)

  // ============================================
  // 3. Seed Cards with Sets
  // ============================================
  console.log('\n🃏 Seeding cards...')

  const batchSize = 100
  let processed = 0
  const nameToId: Record<string, string> = {}

  for (let i = 0; i < seedData.cards.length; i += batchSize) {
    const batch = seedData.cards.slice(i, i + batchSize)

    for (const card of batch) {
      // Determine race ID from subType
      let raceId: number | undefined
      if (card.subType) {
        const baseRace = card.subType.split('／')[0].trim()
        if (raceIdMap[baseRace]) {
          raceId = raceIdMap[baseRace]
        }
      }

      // Create card
      const createdCard = await prisma.card.create({
        data: {
          name: card.name,
          passcode: card.passcode,
          typeId: typeIdMap[card.type.toUpperCase()] || 1,
          attributeId: card.attribute ? attrIdMap[card.attribute] : null,
          raceId: raceId,
          level: card.level,
          rank: card.rank,
          linkRating: card.linkRating,
          attack: card.attack,
          defense: card.defense,
          description: card.description,
          imageUrl: card.imageUrl,
          subType: card.subType,
          linkMarkers: card.linkMarkers,
          price: card.price,
        },
      })

      nameToId[card.name] = createdCard.id

      // Create card sets
      if (card.cardSets && card.cardSets.length > 0) {
        for (const set of card.cardSets) {
          const rarityId = rarityCodeMap[set.rarity] || rarityCodeMap['C']

          const createdSet = await prisma.cardSet.create({
            data: {
              cardId: createdCard.id,
              setName: set.setName,
              setCode: set.setCode,
              rarityId: rarityId,
              releaseDate: set.releaseDate ? new Date(set.releaseDate) : null,
              price: set.price,
            },
          })

          // Create CardSetPrice if price exists
          if (set.price) {
            await prisma.cardSetPrice.create({
              data: {
                cardSetId: createdSet.id,
                source: 'YGOPRODeck',
                price: set.price,
                lastUpdated: new Date(),
              },
            })
          }
        }
      }

      // Create card-category relationships from pre-built data
      if (seedData.cardCategories) {
        const relationships = seedData.cardCategories.filter(
          (cc: any) => cc.cardName === card.name
        )
        for (const rel of relationships) {
          const categoryId = categorySlugMap[rel.categorySlug]
          if (categoryId) {
            await prisma.cardCategory.create({
              data: {
                cardId: createdCard.id,
                categoryId: categoryId,
              },
            })
          }
        }
      }
    }

    processed += batch.length
    if (processed % 500 === 0) {
      console.log(`  📦 Processed ${processed}/${seedData.cards.length} cards...`)
    }
  }

  console.log(`  ✅ Cards seeded: ${seedData.cards.length}`)

  // ============================================
  // 4. Create Default Admin User
  // ============================================
  console.log('\n👤 Creating default admin user...')

  const bcrypt = await import('bcryptjs')
  const hashedPassword = bcrypt.hashSync('admin123', 10)

  await prisma.user.upsert({
    where: { email: 'admin@yugioh.com' },
    update: {},
    create: {
      email: 'admin@yugioh.com',
      password: hashedPassword,
      name: 'Admin',
      role: 'admin',
    },
  })

  console.log('  ✅ Admin user created:')
  console.log('     Email: admin@yugioh.com')
  console.log('     Password: admin123')

  // ============================================
  // Summary
  // ============================================
  console.log('\n' + '='.repeat(50))
  console.log('✅ SEED COMPLETED SUCCESSFULLY!')
  console.log('='.repeat(50))
  console.log(`   Total Cards: ${seedData.cards.length}`)
  console.log(`   Total Categories: ${seedData.categories.length}`)
  console.log(`   Total Card-Categories: ${seedData.cardCategories?.length || 0}`)
  console.log(`   Lookup Tables: CardType, CardAttribute, CardFrame, MonsterRace, Rarity`)
  console.log('='.repeat(50))
}

// Run seed
main()
  .catch((e) => {
    console.error('❌ Error during seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
