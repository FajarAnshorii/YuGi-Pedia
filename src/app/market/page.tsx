'use client'

import { useState } from 'react'
import Navbar from '@/components/Navbar'
import { Search, ExternalLink } from 'lucide-react'
import Link from 'next/link'

interface CardData {
  id: string
  name: string
  passcode: string | null
  imageUrl: string | null
  type?: { id: number; name: string }
  // Nested prices from API
  prices?: {
    cardMarket: string | null
    tcgPlayer: string | null
    eBay: string | null
    amazon: string | null
    coolStuffInc: string | null
  }
  // Flat prices from database
  cardMarketPrice?: number | null
  tcgPlayerPrice?: number | null
  eBayPrice?: number | null
  amazonPrice?: number | null
  coolStuffIncPrice?: number | null
}

export default function MarketPage() {
  const [search, setSearch] = useState('')
  const [cards, setCards] = useState<CardData[]>([])
  const [loading, setLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<string | null>(null)

  const handleSearch = async () => {
    if (!search.trim()) return

    setLoading(true)
    setHasSearched(true)

    try {
      const res = await fetch(`/api/market?name=${encodeURIComponent(search)}`)
      const data = await res.json()

      if (data.cards) {
        setCards(data.cards)
        setLastUpdated(data.timestamp)
      } else {
        setCards([])
      }
    } catch (error) {
      console.error('Failed to fetch prices:', error)
      setCards([])
    } finally {
      setLoading(false)
    }
  }

  const formatPrice = (price: any) => {
    if (!price) return '-'
    const num = typeof price === 'string' ? parseFloat(price) : price
    if (isNaN(num)) return '-'
    return `$${num.toFixed(2)}`
  }

  const getPrice = (card: CardData, key: 'cardMarket' | 'tcgPlayer' | 'eBay' | 'amazon' | 'coolStuffInc') => {
    // Try nested prices first
    if (card.prices && card.prices[key]) {
      return card.prices[key]
    }
    // Fallback to flat fields from database
    switch (key) {
      case 'cardMarket': return card.cardMarketPrice
      case 'tcgPlayer': return card.tcgPlayerPrice
      case 'eBay': return card.eBayPrice
      case 'amazon': return card.amazonPrice
      case 'coolStuffInc': return card.coolStuffIncPrice
      default: return null
    }
  }

  const getTypeIcon = (type: any) => {
    const t = String(type || '').toLowerCase()
    if (t.includes('monster')) return '👹'
    if (t.includes('spell')) return '✨'
    if (t.includes('trap')) return '🛡️'
    return '🃏'
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors duration-200">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
            📊 Market Prices
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Cek harga kartu Yu-Gi-Oh! dari berbagai marketplace
          </p>
          {lastUpdated && (
            <p className="text-xs text-gray-400 mt-2">
              Update terakhir: {new Date(lastUpdated).toLocaleString('id-ID')}
            </p>
          )}
        </div>

        {/* Search */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Cari nama kartu..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full pl-12 pr-4 py-4 border border-gray-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-yellow-400 bg-white dark:bg-slate-800 dark:text-white dark:placeholder-gray-400 text-lg"
              />
            </div>
            <button
              onClick={handleSearch}
              disabled={loading}
              className="w-full sm:w-auto px-8 py-4 bg-yellow-500 text-white rounded-xl hover:bg-yellow-400 font-semibold transition shadow-md disabled:opacity-50"
            >
              {loading ? 'Loading...' : '🔍 Cek Harga'}
            </button>
          </div>
        </div>

        {/* Price Sources Legend */}
        <div className="max-w-6xl mx-auto mb-6">
          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-blue-500"></span>
              <span>CardMarket (EUR)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-green-500"></span>
              <span>TCGPlayer (USD)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500"></span>
              <span>eBay (USD)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-orange-500"></span>
              <span>Amazon (USD)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-purple-500"></span>
              <span>CoolStuffInc (USD)</span>
            </div>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-yellow-400 border-t-transparent mb-4"></div>
            <p className="text-gray-500 dark:text-gray-400 text-lg">Fetching prices...</p>
          </div>
        ) : hasSearched && cards.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-gray-500 dark:text-gray-400 text-lg">Kartu tidak ditemukan</p>
            <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">Coba cari dengan nama lain</p>
          </div>
        ) : cards.length > 0 ? (
          <div className="space-y-4 max-w-6xl mx-auto">
            {cards.map((card) => (
              <div
                key={card.id}
                className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden transition-all hover:shadow-xl"
              >
                <div className="flex flex-col md:flex-row">
                  {/* Card Image */}
                  <div className="w-48 aspect-[3/4] mx-auto md:w-48 md:mx-0 bg-gradient-to-br from-slate-700 to-slate-900 flex-shrink-0 flex items-center justify-center p-4">
                    {card.imageUrl ? (
                      <img
                        src={card.imageUrl}
                        alt={card.name}
                        className="w-full h-full object-contain rounded-lg shadow-md"
                        onError={(e) => {
                          e.currentTarget.src = `https://via.placeholder.com/200x280/1e293b/ffffff?text=${encodeURIComponent(card.name)}`
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-4xl">
                        {getTypeIcon(card.type?.name)}
                      </div>
                    )}
                  </div>

                  {/* Card Info */}
                  <div className="flex-1 p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
                          {card.name}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {getTypeIcon(card.type?.name)} {card.type?.name || 'Unknown'}
                        </p>
                        {card.passcode && (
                          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 font-mono">
                            Passcode: {card.passcode}
                          </p>
                        )}
                      </div>
                      <Link
                        href={`/cards/${card.id}`}
                        className="text-blue-500 hover:text-blue-400 text-sm flex items-center gap-1"
                      >
                        <ExternalLink size={14} />
                        Detail
                      </Link>
                    </div>

                    {/* Prices Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                      {/* CardMarket */}
                      <div className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-xl">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">CardMarket</span>
                        </div>
                        <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                          {formatPrice(getPrice(card, 'cardMarket'))}
                        </p>
                        <p className="text-xs text-gray-400">EUR</p>
                      </div>

                      {/* TCGPlayer */}
                      <div className="bg-green-50 dark:bg-green-900/30 p-3 rounded-xl">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="w-2 h-2 rounded-full bg-green-500"></span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">TCGPlayer</span>
                        </div>
                        <p className="text-lg font-bold text-green-600 dark:text-green-400">
                          {formatPrice(getPrice(card, 'tcgPlayer'))}
                        </p>
                        <p className="text-xs text-gray-400">USD</p>
                      </div>

                      {/* eBay */}
                      <div className="bg-red-50 dark:bg-red-900/30 p-3 rounded-xl">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="w-2 h-2 rounded-full bg-red-500"></span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">eBay</span>
                        </div>
                        <p className="text-lg font-bold text-red-600 dark:text-red-400">
                          {formatPrice(getPrice(card, 'eBay'))}
                        </p>
                        <p className="text-xs text-gray-400">USD</p>
                      </div>

                      {/* Amazon */}
                      <div className="bg-orange-50 dark:bg-orange-900/30 p-3 rounded-xl">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">Amazon</span>
                        </div>
                        <p className="text-lg font-bold text-orange-600 dark:text-orange-400">
                          {formatPrice(getPrice(card, 'amazon'))}
                        </p>
                        <p className="text-xs text-gray-400">USD</p>
                      </div>

                      {/* CoolStuffInc */}
                      <div className="bg-purple-50 dark:bg-purple-900/30 p-3 rounded-xl">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">CoolStuffInc</span>
                        </div>
                        <p className="text-lg font-bold text-purple-600 dark:text-purple-400">
                          {formatPrice(getPrice(card, 'coolStuffInc'))}
                        </p>
                        <p className="text-xs text-gray-400">USD</p>
                      </div>
                    </div>

                    {/* Disclaimer */}
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-4">
                      💡 Harga bersifat estimasi dan dapat berubah sewaktu-waktu
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 max-w-md mx-auto">
            <div className="text-8xl mb-6">📊</div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              Cek Harga Kartu
            </h2>
            <p className="text-gray-500 dark:text-gray-400">
              Masukkan nama kartu untuk melihat harga dari berbagai marketplace
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <button
                onClick={() => { setSearch('Dark Magician'); handleSearch(); }}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-700 rounded-lg text-sm text-gray-600 dark:text-gray-300 hover:bg-slate-200 dark:hover:bg-slate-600"
              >
                Dark Magician
              </button>
              <button
                onClick={() => { setSearch('Blue-Eyes White Dragon'); handleSearch(); }}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-700 rounded-lg text-sm text-gray-600 dark:text-gray-300 hover:bg-slate-200 dark:hover:bg-slate-600"
              >
                Blue-Eyes White Dragon
              </button>
              <button
                onClick={() => { setSearch('Pot of Greed'); handleSearch(); }}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-700 rounded-lg text-sm text-gray-600 dark:text-gray-300 hover:bg-slate-200 dark:hover:bg-slate-600"
              >
                Pot of Greed
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}