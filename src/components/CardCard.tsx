'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Card } from '@/lib/types'

interface CardCardProps {
  card: Card
}

export default function CardCard({ card }: CardCardProps) {
  // Get type info
  const typeName = card.type?.name || card.typeId?.toString() || 'Unknown'
  const typeSlug = typeName.toLowerCase()

  // Get attribute info
  const attributeName = card.attribute?.name || null

  // Type badge styling
  const getTypeBadge = () => {
    if (typeSlug.includes('monster')) return 'bg-red-500'
    if (typeSlug.includes('spell')) return 'bg-green-500'
    if (typeSlug.includes('trap')) return 'bg-purple-500'
    return 'bg-gray-500'
  }

  // Attribute styling
  const getAttributeColor = () => {
    if (!attributeName) return ''
    const attr = attributeName.toLowerCase()
    if (attr === 'fire') return 'text-red-500'
    if (attr === 'water') return 'text-blue-500'
    if (attr === 'earth') return 'text-yellow-600'
    if (attr === 'wind') return 'text-green-400'
    if (attr === 'light') return 'text-yellow-400'
    if (attr === 'dark') return 'text-purple-500'
    if (attr === 'divine') return 'text-amber-400'
    return ''
  }

  // Attribute emoji
  const getAttributeEmoji = () => {
    if (!attributeName) return ''
    const attr = attributeName.toUpperCase()
    const emojis: Record<string, string> = {
      FIRE: '🔥',
      WATER: '💧',
      EARTH: '🌍',
      WIND: '💨',
      LIGHT: '☀️',
      DARK: '🌑',
      DIVINE: '⭐',
    }
    return emojis[attr] || ''
  }

  // Card image URL - use imageUrl from database first, then fallback
  const getCardImageUrl = () => {
    // If imageUrl exists in database, use it
    if (card.imageUrl) {
      return card.imageUrl
    }
    // Fallback to placeholder with card name
    return `https://via.placeholder.com/300x420/1e293b/ffffff?text=${encodeURIComponent(card.name)}`
  }

  return (
    <Link href={`/cards/${card.id}`} className="group">
      <div className="card-border bg-white dark:bg-slate-800 cursor-pointer h-full flex flex-col transition-colors duration-200">
        {/* Card Image */}
        <div className="aspect-[3/4] relative bg-gradient-to-br from-slate-700 to-slate-900 overflow-hidden">
          <img
            src={getCardImageUrl()}
            alt={card.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              // If YGOPRODeck image fails, use placeholder with card name
              e.currentTarget.src = `https://via.placeholder.com/300x420/1e293b/ffffff?text=${encodeURIComponent(card.name)}`
            }}
          />

          {/* Type badge */}
          <div className="absolute top-1 right-1 sm:top-2 sm:right-2">
            <span className={`${getTypeBadge()} text-white text-[7px] sm:text-xs px-1 sm:px-2 py-0 sm:py-1 rounded-full font-bold shadow-lg`}>
              {typeName}
            </span>
          </div>

          {/* Attribute badge (for monsters) */}
          {attributeName && (
            <div className="absolute top-1 left-1 sm:top-2 sm:left-2">
              <span className={`${getAttributeColor()} bg-black/60 backdrop-blur text-[7px] sm:text-xs px-1 sm:px-2 py-0 sm:py-1 rounded-full font-bold shadow-lg`}>
                {getAttributeEmoji()} <span className="hidden xs:inline ml-0.5">{attributeName}</span>
              </span>
            </div>
          )}
        </div>

        {/* Card Info */}
        <div className="p-1 sm:p-3 flex-1 flex flex-col">
          <h3 className="font-extrabold text-[9px] sm:text-sm text-slate-900 dark:text-amber-100/90 group-hover:text-yellow-400 transition-colors line-clamp-2 mb-0.5 leading-tight" title={card.name}>
            {card.name}
          </h3>

          {/* SubType */}
          {card.subType && (
            <p className="text-[8px] sm:text-xs text-gray-500 dark:text-gray-400 mb-0.5 sm:mb-2 line-clamp-1 opacity-80">
              {card.subType}
            </p>
          )}

          {/* Level/Rank/Link */}
          <div className="mt-auto">
            {card.level && (
              <div className="flex items-center gap-0.5 sm:gap-1 text-[8px] sm:text-xs text-yellow-500 mb-0.5">
                <span>★</span>
                <span>Lv {card.level}</span>
              </div>
            )}
            {card.rank && (
              <div className="flex items-center gap-0.5 sm:gap-1 text-[8px] sm:text-xs text-purple-500 mb-0.5">
                <span>☆</span>
                <span>Rk {card.rank}</span>
              </div>
            )}
            {card.linkRating && (
              <div className="flex items-center gap-0.5 sm:gap-1 text-[8px] sm:text-xs text-cyan-500 mb-0.5">
                <span>⚡</span>
                <span>Lk {card.linkRating}</span>
              </div>
            )}
          </div>

          {/* ATK/DEF for monsters */}
          {card.type?.name?.toLowerCase() === 'monster' && (
            <div className="flex justify-between mt-auto text-[9px] sm:text-sm font-black">
              <span className="text-red-500">A {card.attack ?? '?'}</span>
              <span className="text-blue-500">D {card.defense ?? '?'}</span>
            </div>
          )}

          {/* Price Display */}
          {(card.tcgPlayerPrice || card.cardMarketPrice) && (
            <div className="mt-1 sm:mt-2 pt-1 sm:pt-2 border-t border-gray-100 dark:border-slate-700/40 flex items-center justify-between">
              <span className="text-[7px] sm:text-[10px] text-gray-400 uppercase tracking-tighter font-bold">Price</span>
              <div className="flex items-center gap-0.5 sm:gap-1 text-[8px] sm:text-xs">
                <span className="text-emerald-600 dark:text-emerald-400 font-black text-[9px] sm:text-sm">
                  {card.tcgPlayerPrice
                    ? `$${card.tcgPlayerPrice.toFixed(1)}`
                    : card.cardMarketPrice
                    ? `€${card.cardMarketPrice.toFixed(1)}`
                    : '-'}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}
