import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const count = await prisma.card.count()
    return NextResponse.json({ count })
  } catch (err: any) {
    console.error('Error in card count api:', err)
    return NextResponse.json({ error: 'Internal Server Error', details: err.message }, { status: 500 })
  }
}
