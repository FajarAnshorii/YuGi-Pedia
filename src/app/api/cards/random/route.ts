import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const count = await prisma.card.count()
    if (count === 0) {
      return NextResponse.json({ error: 'No cards found' }, { status: 404 })
    }
    const randomIndex = Math.floor(Math.random() * count)
    const randomCard = await prisma.card.findFirst({
      skip: randomIndex,
      include: {
        type: true,
        attribute: true,
      }
    })
    return NextResponse.json(randomCard)
  } catch (err: any) {
    console.error('Error in random card api:', err)
    return NextResponse.json({ error: 'Internal Server Error', details: err.message }, { status: 500 })
  }
}
