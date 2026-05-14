'use client'

import { Card } from '@/lib/types'
import CardCard from './CardCard'

interface CardGridProps {
  cards: Card[]
  emptyMessage?: string
}

export default function CardGrid({ cards, emptyMessage = 'Tidak ada kartu ditemukan' }: CardGridProps) {
  if (!cards || cards.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-4">🎴</div>
        <p className="text-gray-500 dark:text-gray-400 text-lg">{emptyMessage}</p>
        <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">Coba ubah filter atau kata kunci pencarian</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-4">
      {cards.map((card) => (
        <CardCard key={card.id} card={card} />
      ))}
    </div>
  )
}
