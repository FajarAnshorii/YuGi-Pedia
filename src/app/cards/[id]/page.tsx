'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import { Card } from '@/lib/types'
import { ChevronLeft } from 'lucide-react'

export default function CardDetailPage() {
  const params = useParams()
  const [card, setCard] = useState<Card | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCard = async () => {
      try {
        const res = await fetch(`/api/cards/${params.id}`)
        const data = await res.json()
        setCard(data)
      } catch (error) {
        console.error('Failed to fetch card:', error)
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchCard()
    }
  }, [params.id])

  if (loading) {
    return (
      <main className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center">
          <div className="relative mb-4 h-20 w-20 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-2 border-dashed border-yellow-400/30 animate-[spin_10s_linear_infinite]"></div>
            <img 
              src="/images/logo.png" 
              alt="Loading..." 
              className="h-16 w-16 animate-spin object-contain drop-shadow-[0_0_12px_rgba(234,179,8,0.5)]" 
            />
          </div>
          <p className="text-gray-500 dark:text-gray-400 font-semibold text-lg tracking-wider animate-pulse">Loading...</p>
        </div>
      </main>
    )
  }

  if (!card) {
    return (
      <main className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Kartu tidak ditemukan</h1>
          <Link href="/album" className="text-blue-500 hover:underline mt-4 inline-block dark:text-yellow-400">
            Kembali ke Album
          </Link>
        </div>
      </main>
    )
  }

  // Get type name
  const typeName = card.type?.name || 'Unknown'
  const typeSlug = typeName.toLowerCase()

  // Get attribute info
  const attributeName = card.attribute?.name || null
  const raceName = card.race?.name || null

  // Card image URL - use imageUrl from database first, then fallback
  const getCardImageUrl = () => {
    // If imageUrl exists in database, use it
    if (card.imageUrl) {
      return card.imageUrl
    }
    // Fallback to placeholder with card name
    return `https://via.placeholder.com/400x560/1e293b/ffffff?text=${encodeURIComponent(card.name)}`
  }

  // Get rarity from first set
  const firstSet = card.cardSets?.[0]
  const rarityName = firstSet?.rarity?.name || null

  return (
    <main className="min-h-screen">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link
          href="/album"
          className="inline-flex items-center gap-2 text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white mb-6 font-medium"
        >
          <ChevronLeft size={20} />
          Kembali ke Album
        </Link>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Card Image */}
          <div className="bg-white dark:bg-slate-900/60 border border-gray-100 dark:border-slate-800/40 rounded-2xl p-6 shadow-lg">
            <div className="aspect-[3/4] bg-gradient-to-br from-slate-700 to-slate-900 rounded-xl overflow-hidden">
              <img
                src={getCardImageUrl()}
                alt={card.name}
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.currentTarget.src = `https://via.placeholder.com/400x560/1e293b/ffffff?text=${encodeURIComponent(card.name)}`
                }}
              />
            </div>
          </div>

          {/* Card Info */}
          <div className="space-y-6">
            {/* Name & Type */}
            <div className="bg-white dark:bg-slate-900/60 border border-gray-100 dark:border-slate-800/40 rounded-2xl p-6 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <span className={`text-4xl ${
                  typeSlug === 'monster' ? 'text-red-500' :
                  typeSlug === 'spell' ? 'text-green-500' : 'text-purple-500'
                }`}>
                  {typeSlug === 'monster' ? '👹' : typeSlug === 'spell' ? '✨' : '🛡️'}
                </span>
                <span className={`px-4 py-2 rounded-full text-white font-bold ${
                  typeSlug === 'monster' ? 'bg-red-500' :
                  typeSlug === 'spell' ? 'bg-green-500' : 'bg-purple-500'
                }`}>
                  {typeName}
                </span>
              </div>
              <h1 className="text-3xl font-extrabold text-slate-900 dark:text-amber-100/90 yugioh-glow-text tracking-wide">{card.name}</h1>
              {card.passcode && (
                <p className="text-gray-500 dark:text-gray-400 mt-1 font-mono text-sm">Passcode: {card.passcode}</p>
              )}
            </div>

            {/* Stats */}
            <div className="bg-white dark:bg-slate-900/60 border border-gray-100 dark:border-slate-800/40 rounded-2xl p-6 shadow-lg">
              <h2 className="text-lg font-bold text-gray-700 dark:text-slate-200 mb-4">Stats</h2>
              <div className="grid grid-cols-2 gap-4">
                {attributeName && (
                  <div className="bg-gray-50 dark:bg-slate-800 p-4 rounded-xl border dark:border-slate-700/40">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Attribute</p>
                    <p className="text-lg font-bold dark:text-white">
                      {attributeName === 'FIRE' && '🔥 '}
                      {attributeName === 'WATER' && '💧 '}
                      {attributeName === 'EARTH' && '🌍 '}
                      {attributeName === 'WIND' && '💨 '}
                      {attributeName === 'LIGHT' && '☀️ '}
                      {attributeName === 'DARK' && '🌑 '}
                      {attributeName === 'DIVINE' && '⭐ '}
                      {attributeName}
                    </p>
                  </div>
                )}

                {raceName && (
                  <div className="bg-gray-50 dark:bg-slate-800 p-4 rounded-xl border dark:border-slate-700/40">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Race</p>
                    <p className="text-lg font-bold dark:text-white">{raceName}</p>
                  </div>
                )}

                {card.subType && (
                  <div className="bg-gray-50 dark:bg-slate-800 p-4 rounded-xl col-span-2 border dark:border-slate-700/40">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Card Type</p>
                    <p className="text-lg font-bold dark:text-white">{card.subType}</p>
                  </div>
                )}

                {card.level && (
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-xl border dark:border-yellow-500/10">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Level</p>
                    <p className="text-2xl font-bold text-yellow-500 dark:text-yellow-400">★ {card.level}</p>
                  </div>
                )}

                {card.rank && (
                  <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-xl border dark:border-purple-500/10">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Rank</p>
                    <p className="text-2xl font-bold text-purple-500 dark:text-purple-400">☆ {card.rank}</p>
                  </div>
                )}

                {card.linkRating && (
                  <div className="bg-cyan-50 dark:bg-cyan-900/20 p-4 rounded-xl border dark:border-cyan-500/10">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Link</p>
                    <p className="text-2xl font-bold text-cyan-500 dark:text-cyan-400">⚡ {card.linkRating}</p>
                  </div>
                )}

                {typeSlug === 'monster' && (
                  <>
                    <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-xl border dark:border-red-500/10">
                      <p className="text-sm text-gray-500 dark:text-gray-400">ATK</p>
                      <p className="text-2xl font-bold text-red-500 dark:text-red-400">{card.attack ?? '?'}</p>
                    </div>
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border dark:border-blue-500/10">
                      <p className="text-sm text-gray-500 dark:text-gray-400">DEF</p>
                      <p className="text-2xl font-bold text-blue-500 dark:text-blue-400">{card.defense ?? '?'}</p>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Description */}
            {card.description && (
              <div className="bg-white dark:bg-slate-900/60 border border-gray-100 dark:border-slate-800/40 rounded-2xl p-6 shadow-lg">
                <h2 className="text-lg font-bold text-gray-700 dark:text-slate-200 mb-4">Card Effect</h2>
                <div className="bg-gray-50 dark:bg-slate-800 p-4 rounded-xl border dark:border-slate-700/40">
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line leading-relaxed">{card.description}</p>
                </div>
              </div>
            )}

            {/* Market Prices */}
            <div className="bg-white dark:bg-slate-900/60 border border-gray-100 dark:border-slate-800/40 rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-700 dark:text-slate-200">💰 Market Prices</h2>
                {card.priceUpdatedAt && (
                  <span className="text-xs text-gray-400 dark:text-gray-500">
                    Updated: {new Date(card.priceUpdatedAt).toLocaleDateString('id-ID')}
                  </span>
                )}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {/* TCGPlayer */}
                {card.tcgPlayerPrice && (
                  <div className="price-source-card price-source-tcg">
                    <p className="text-xs font-semibold tracking-wide uppercase opacity-80">TCGPlayer</p>
                    <p className="text-lg font-extrabold mt-1">
                      ${card.tcgPlayerPrice.toFixed(2)}
                    </p>
                    <p className="text-[10px] uppercase opacity-60">USD</p>
                  </div>
                )}
                {/* CardMarket */}
                {card.cardMarketPrice && (
                  <div className="price-source-card price-source-cardmarket">
                    <p className="text-xs font-semibold tracking-wide uppercase opacity-80">CardMarket</p>
                    <p className="text-lg font-extrabold mt-1">
                      €{card.cardMarketPrice.toFixed(2)}
                    </p>
                    <p className="text-[10px] uppercase opacity-60">EUR</p>
                  </div>
                )}
                {/* eBay */}
                {card.eBayPrice && (
                  <div className="price-source-card price-source-ebay">
                    <p className="text-xs font-semibold tracking-wide uppercase opacity-80">eBay</p>
                    <p className="text-lg font-extrabold mt-1">
                      ${card.eBayPrice.toFixed(2)}
                    </p>
                    <p className="text-[10px] uppercase opacity-60">USD</p>
                  </div>
                )}
                {/* Amazon */}
                {card.amazonPrice && (
                  <div className="price-source-card price-source-amazon">
                    <p className="text-xs font-semibold tracking-wide uppercase opacity-80">Amazon</p>
                    <p className="text-lg font-extrabold mt-1">
                      ${card.amazonPrice.toFixed(2)}
                    </p>
                    <p className="text-[10px] uppercase opacity-60">USD</p>
                  </div>
                )}
                {/* CoolStuffInc */}
                {card.coolStuffIncPrice && (
                  <div className="price-source-card price-source-coolstuff">
                    <p className="text-xs font-semibold tracking-wide uppercase opacity-80">CoolStuffInc</p>
                    <p className="text-lg font-extrabold mt-1">
                      ${card.coolStuffIncPrice.toFixed(2)}
                    </p>
                    <p className="text-[10px] uppercase opacity-60">USD</p>
                  </div>
                )}
              </div>
              {/* No price data */}
              {!card.tcgPlayerPrice && !card.cardMarketPrice && !card.eBayPrice &&
               !card.amazonPrice && !card.coolStuffIncPrice && (
                <div className="text-center py-4 text-gray-400 dark:text-gray-500">
                  <p>📊 Price data not available</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="mt-2 text-sm text-yellow-500 hover:underline"
                  >
                    Refresh prices
                  </button>
                </div>
              )}
            </div>

            {/* Sets */}
            {card.cardSets && card.cardSets.length > 0 && (
              <div className="bg-white dark:bg-slate-900/60 border border-gray-100 dark:border-slate-800/40 rounded-2xl p-6 shadow-lg">
                <h2 className="text-lg font-bold text-gray-700 dark:text-slate-200 mb-4">Sets ({card.cardSets.length})</h2>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {card.cardSets.slice(0, 10).map((set) => (
                    <div key={set.id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-slate-800/60 border border-transparent dark:border-slate-700/40 rounded-lg">
                      <div>
                        <p className="font-medium dark:text-white">{set.setName}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 font-mono">{set.setCode}</p>
                      </div>
                      <div className="text-right">
                        <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                          set.rarity?.code === 'UR' ? 'bg-blue-600/90 text-white' :
                          set.rarity?.code === 'SR' ? 'bg-yellow-600/90 text-white' :
                          set.rarity?.code === 'SECRET' ? 'bg-red-600/90 text-white' :
                          'bg-gray-300 dark:bg-slate-700 text-gray-700 dark:text-gray-300'
                        }`}>
                          {set.rarity?.name || 'Common'}
                        </span>
                        {set.releaseDate && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {new Date(set.releaseDate).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                  {card.cardSets.length > 10 && (
                    <p className="text-center text-gray-500 dark:text-gray-400 text-sm">
                      +{card.cardSets.length - 10} more sets
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}