const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

// Parse race from subType - handle both / and ／
function parseRace(subType) {
  if (!subType) return null

  const races = [
    'Beast-Warrior', 'beast-warrior',
    'Winged Beast', 'winged-beast',
    'Divine-Beast', 'divine-beast',
    'Dragon', 'dragon',
    'Warrior', 'warrior',
    'Spellcaster', 'spellcaster',
    'Fiend', 'fiend',
    'Zombie', 'zombie',
    'Machine', 'machine',
    'Aqua', 'aqua',
    'Pyro', 'pyro',
    'Reptile', 'reptile',
    'Psychic', 'psychic',
    'Beast', 'beast',
    'Fish', 'fish',
    'Plant', 'plant',
    'Insect', 'insect',
    'Dinosaur', 'dinosaur',
    'Rock', 'rock',
    'Fairy', 'fairy',
    'Thunder', 'thunder',
    'Sea Serpent', 'sea serpent',
    'Cyberse', 'cyberse',
    'Illusion', 'illusion',
    'Celestial Warrior', 'celestial warrior',
    'Wyrm', 'wyrm',
    'Dimmons', 'dimmons',
    'Gishki', 'gishki',
    'Viser', 'viser',
    'Archfiend', 'archfiend',
    'Gorgon', 'gorgon',
  ]

  const lower = subType.toLowerCase()
  for (const race of races) {
    if (lower.includes(race.toLowerCase())) {
      // Return proper case name
      return race
    }
  }
  return null
}

async function main() {
  console.log('🔧 Fixing remaining 0 count categories...\n')

  // Get categories
  const categories = await prisma.category.findMany()
  const categoryMap = new Map()
  categories.forEach(c => {
    categoryMap.set(c.name.toLowerCase(), c.id)
  })

  // Get all cards
  const allCards = await prisma.card.findMany({
    include: { type: true }
  })

  // Add missing links for the 3 categories
  const targetRaces = ['Beast-Warrior', 'Winged Beast', 'Divine-Beast']
  let addedCount = 0

  for (const card of allCards) {
    const raceName = parseRace(card.subType)
    if (raceName && targetRaces.includes(raceName)) {
      const catId = categoryMap.get(raceName.toLowerCase())
      if (catId) {
        try {
          await prisma.cardCategory.create({
            data: { cardId: card.id, categoryId: catId }
          })
          addedCount++
        } catch (e) {
          // Already exists
        }
      }
    }
  }

  console.log('Added', addedCount, 'links for Beast-Warrior, Winged Beast, Divine-Beast categories\n')

  // Verify
  console.log('📊 Verification:')
  for (const race of ['Beast-Warrior', 'Winged Beast', 'Divine-Beast']) {
    const count = await prisma.cardCategory.count({
      where: { category: { slug: race.toLowerCase().replace(' ', '-') } }
    })
    console.log(`  ${race}: ${count}`)
  }
}

main().catch(console.error).finally(() => prisma.$disconnect())