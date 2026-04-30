import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/cards/[id] - Get single card
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const card = await prisma.card.findUnique({
      where: { id: params.id },
      include: {
        type: true,
        attribute: true,
        frame: true,
        race: true,
        cardSets: {
          include: {
            rarity: true,
            cardSetPrices: true,
          },
          orderBy: {
            releaseDate: 'desc',
          },
        },
        cardCategories: {
          include: {
            category: true,
          },
        },
      },
    })

    if (!card) {
      return NextResponse.json(
        { error: 'Card not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(card)
  } catch (error) {
    console.error('Error fetching card:', error)
    return NextResponse.json(
      { error: 'Failed to fetch card' },
      { status: 500 }
    )
  }
}

// PUT /api/cards/[id] - Update card (Admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()

    const card = await prisma.card.update({
      where: { id: params.id },
      data: {
        name: body.name,
        passcode: body.passcode,
        typeId: body.typeId,
        attributeId: body.attributeId,
        frameId: body.frameId,
        raceId: body.raceId,
        level: body.level,
        rank: body.rank,
        linkRating: body.linkRating,
        attack: body.attack,
        defense: body.defense,
        description: body.description,
        imageUrl: body.imageUrl,
        subType: body.subType,
      },
    })

    return NextResponse.json(card)
  } catch (error) {
    console.error('Error updating card:', error)
    return NextResponse.json(
      { error: 'Failed to update card' },
      { status: 500 }
    )
  }
}

// DELETE /api/cards/[id] - Delete card (Admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.card.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting card:', error)
    return NextResponse.json(
      { error: 'Failed to delete card' },
      { status: 500 }
    )
  }
}