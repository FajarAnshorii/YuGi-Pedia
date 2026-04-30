/**
 * ================================================================
 * PRISMA SEED SCRIPT V2
 * Seed database dengan data kartu Yu-Gi-Oh dari seed_data_v2.json
 * ================================================================
 */

import { PrismaClient, CardType, CardAttribute, Rarity } from '@prisma/client'
import seedData from './seed_data_v2.json'

const prisma = new PrismaClient()

// Type mappings from JSON to Prisma Enums
const typeMap: Record<string, CardType> = {
  'monster': CardType.MONSTER,
  'spell': CardType.SPELL,
  'trap': CardType.TRAP,
}

const attributeMap: Record<string, CardAttribute> = {
  'FIRE': CardAttribute.FIRE,
  'WATER': CardAttribute.WATER,
  'EARTH': CardAttribute.EARTH,
  'WIND': CardAttribute.WIND,
  'LIGHT': CardAttribute.LIGHT,
  'DARK': CardAttribute.DARK,
  'DIVINE': CardAttribute.DIVINE,
}

const rarityMap: Record<string, Rarity> = {
  'C': Rarity.C,
  'R': Rarity.R,
  'SR': Rarity.SR,
  'UR': Rarity.UR,
  'GR': Rarity.GR,
  'SECRET': Rarity.SECRET,
  'ULTIMATE': Rarity.ULTIMATE,
  'PRISMATIC': Rarity.PRISMATIC,
  'PLATINUM': Rarity.PLATINUM,
  'STAR': Rarity.STAR,
  'QUARTER': Rarity.QUARTER,
}

async function main() {
  console.log('🌱 Starting seed process...')
  console.log(`📊 Total cards: ${seedData.cards.length}`)
  console.log(`📁 Total categories: ${seedData.categories.length}`)

  // Clear existing data
  console.log('\n🗑️  Clearing existing data...')
  await prisma.cardCategory.deleteMany({})
  await prisma.cardSet.deleteMany({})
  await prisma.card.deleteMany({})
  await prisma.category.deleteMany({})

  // ============================================
  // 1. Insert Categories
  // ============================================
  console.log('\n🏷️  Inserting categories...')
  for (const category of seedData.categories) {
    await prisma.category.create({
      data: {
        name: category.name,
        slug: category.slug,
        description: category.description,
      },
    })
  }
  console.log(`✅ Inserted ${seedData.categories.length} categories`)

  // ============================================
  // 2. Insert Cards with Sets (batched)
  // ============================================
  console.log('\n🃏 Inserting cards with sets...')

  const batchSize = 100
  let processed = 0

  for (let i = 0; i < seedData.cards.length; i += batchSize) {
    const batch = seedData.cards.slice(i, i + batchSize)

    for (const card of batch) {
      // Create card
      const createdCard = await prisma.card.create({
        data: {
          name: card.name,
          type: typeMap[card.type] || CardType.MONSTER,
          subType: card.subType,
          attribute: card.attribute ? attributeMap[card.attribute] : null,
          passcode: card.passcode,
          level: card.level,
          rank: card.rank,
          linkRating: card.linkRating,
          attack: card.attack,
          defense: card.defense,
          description: card.description,
          imageUrl: card.imageUrl,
          price: card.price,
        },
      })

      // Create card sets
      if (card.cardSets && card.cardSets.length > 0) {
        for (const set of card.cardSets) {
          if (set.setCode && set.setName) {
            await prisma.cardSet.create({
              data: {
                cardId: createdCard.id,
                setName: set.setName,
                setCode: set.setCode,
                rarity: rarityMap[set.rarity] || Rarity.C,
                releaseDate: set.releaseDate ? new Date(set.releaseDate) : null,
                price: set.price,
              },
            })
          }
        }
      }
    }

    processed += batch.length
    console.log(`  📦 Processed ${processed}/${seedData.cards.length} cards...`)
  }

  console.log('\n✅ Seed completed successfully!')
  console.log(`   Total cards: ${seedData.cards.length}`)
  console.log(`   Total categories: ${seedData.categories.length}`)

  // ============================================
  // 3. Create default admin user
  // ============================================
  console.log('\n👤 Creating default admin user...')

  const bcrypt = await import('bcryptjs')
  const hashedPassword = await bcrypt.hash('admin123', 10)

  await prisma.user.upsert({
    where: { email: 'admin@yugioh.com' },
    update: {},
    create: {
      email: 'admin@yugioh.com',
      password: hashedPassword,
      name: 'Admin',
      role: 'ADMIN',
    },
  })

  console.log('✅ Admin user created:')
  console.log('   Email: admin@yugioh.com')
  console.log('   Password: admin123')
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