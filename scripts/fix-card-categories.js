const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

// Map subType patterns to race names
const RACE_MAP = {
  'dragon': 'Dragon',
  'warrior': 'Warrior',
  'spellcaster': 'Spellcaster',
  'fiend': 'Fiend',
  'zombie': 'Zombie',
  'machine': 'Machine',
  'aqua': 'Aqua',
  'pyro': 'Pyro',
  'reptile': 'Reptile',
  'psychic': 'Psychic',
  'beast-warrior': 'Beast-Warrior',
  'beast': 'Beast',
  'fish': 'Fish',
  'plant': 'Plant',
  'insect': 'Insect',
  'dinosaur': 'Dinosaur',
  'rock': 'Rock',
  'fairy': 'Fairy',
  'thunder': 'Thunder',
  'sea serpent': 'Sea Serpent',
  'winged beast': 'Winged Beast',
  'divine-beast': 'Divine-Beast',
  'cyberse': 'Cyberse',
  'illusion': 'Illusion',
  'celestial warrior': 'Celestial Warrior',
  'wyrm': 'Wyrm',
  'dimmons': 'Dimmons',
  'gishki': 'Gishki',
  'viser': 'Viser',
  'archfiend': 'Archfiend',
  'gorgon': 'Gorgon',
}

async function main() {
  console.log('🔧 Starting card_categories repair...\n')

  // Delete existing card_categories
  console.log('🗑️  Deleting existing card_categories...')
  await prisma.cardCategory.deleteMany()

  // Get all categories
  const categories = await prisma.category.findMany()
  const categoryMap = new Map()
  categories.forEach(c => {
    categoryMap.set(c.name.toLowerCase(), c.id)
    categoryMap.set(c.slug.toLowerCase(), c.id)
  })
  console.log('Found', categories.length, 'categories\n')

  // Get all cards with their type info
  const allCards = await prisma.card.findMany({
    include: {
      type: true
    }
  })
  console.log('Processing', allCards.length, 'cards...\n')

  // Type category IDs
  const typeCategoryIds = {
    'monster cards': categoryMap.get('monster cards'),
    'spell cards': categoryMap.get('spell cards'),
    'trap cards': categoryMap.get('trap cards'),
    'all cards': categoryMap.get('all cards'),
  }

  // Parse race from subType
  function parseRace(subType) {
    if (!subType) return null
    const lower = subType.toLowerCase()
    for (const [key, raceName] of Object.entries(RACE_MAP)) {
      if (lower.includes(key)) return raceName
    }
    return null
  }

  let count = 0
  const links = []

  for (const card of allCards) {
    const typeName = card.type?.name?.toLowerCase() || ''

    // 1. Link to type-based category
    let typeCategoryId = null
    if (typeName === 'monster') typeCategoryId = typeCategoryIds['monster cards']
    else if (typeName === 'spell') typeCategoryId = typeCategoryIds['spell cards']
    else if (typeName === 'trap') typeCategoryId = typeCategoryIds['trap cards']
    if (typeCategoryId) typeCategoryId = categoryMap.get('all cards') // All cards too

    // Link to type category
    if (typeName === 'monster') links.push({ cardId: card.id, categoryId: typeCategoryIds['monster cards'] })
    else if (typeName === 'spell') links.push({ cardId: card.id, categoryId: typeCategoryIds['spell cards'] })
    else if (typeName === 'trap') links.push({ cardId: card.id, categoryId: typeCategoryIds['trap cards'] })

    // All cards
    const allCardsId = typeCategoryIds['all cards']
    if (allCardsId) links.push({ cardId: card.id, categoryId: allCardsId })

    // 2. Parse race from subType and link to race category
    const raceName = parseRace(card.subType)
    if (raceName) {
      const raceCategoryId = categoryMap.get(raceName.toLowerCase())
      if (raceCategoryId) {
        links.push({ cardId: card.id, categoryId: raceCategoryId })
      }
    }
  }

  console.log('Created', links.length, 'links...\n')

  // Batch insert
  for (let i = 0; i < links.length; i += 1000) {
    const batch = links.slice(i, i + 1000)
    await prisma.cardCategory.createMany({
      data: batch,
      skipDuplicates: true
    })
    console.log(`Inserted ${Math.min(i + 1000, links.length)}/${links.length}...`)
  }

  // Verify
  console.log('\n📊 Verification:')
  const finalCategories = await prisma.category.findMany({
    include: {
      _count: {
        select: { cardCategories: true }
      }
    },
    orderBy: { name: 'asc' }
  })

  console.log('\nCategories with counts:')
  finalCategories.forEach(cat => {
    const count = cat._count.cardCategories
    const status = count > 0 ? '✅' : '❌'
    console.log(`  ${status} ${cat.name}: ${count}`)
  })

  const totalLinks = await prisma.cardCategory.count()
  console.log('\n✅ Total card_category links:', totalLinks)
  console.log('\n🎉 Repair complete!')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())