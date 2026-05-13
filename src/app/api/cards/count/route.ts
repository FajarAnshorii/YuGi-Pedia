import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const [total, monsters, spells, traps, sets] = await Promise.all([
      prisma.card.count(),
      prisma.card.count({ where: { typeId: 4 } }), // Monster
      prisma.card.count({ where: { typeId: 5 } }), // Spell
      prisma.card.count({ where: { typeId: 6 } }), // Trap
      prisma.cardSet.count()
    ])

    return NextResponse.json({
      count: total,
      monsterCount: monsters,
      spellCount: spells,
      trapCount: traps,
      setCount: sets
    })
  } catch (err: any) {
    console.error('Error in card count api:', err)
    return NextResponse.json({ error: 'Internal Server Error', details: err.message }, { status: 500 })
  }
}
