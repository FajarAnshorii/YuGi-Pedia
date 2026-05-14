'use client'

import { useState } from 'react'
import Navbar from '@/components/Navbar'
import { Search, ExternalLink, TrendingUp, TrendingDown, DollarSign, BarChart2, Activity } from 'lucide-react'
import Link from 'next/link'

interface CardData {
  id: string
  name: string
  passcode: string | null
  imageUrl: string | null
  type?: { id: number; name: string }
  prices?: {
    cardMarket: string | null
    tcgPlayer: string | null
    eBay: string | null
    amazon: string | null
    coolStuffInc: string | null
  }
  cardMarketPrice?: number | null
  tcgPlayerPrice?: number | null
  eBayPrice?: number | null
  amazonPrice?: number | null
  coolStuffIncPrice?: number | null
}

const TOP_EXPENSIVE_CARDS = [
  { passcode: '28150175', name: 'S:P Little Knight', price: 114.99, change: '+5.2%', sparkline: [102, 105, 108, 107, 112, 114.99] },
  { passcode: '60072134', name: 'Bonfire', price: 89.50, change: '+12.4%', sparkline: [75, 78, 80, 85, 84, 89.50] },
  { passcode: '97268402', name: 'Diabellstar the Black Witch', price: 44.25, change: '-2.1%', sparkline: [46, 45, 45, 43, 44, 44.25] },
  { passcode: '40653303', name: 'Promethean Princess, Bestower of Flames', price: 34.99, change: '+8.7%', sparkline: [30, 31, 31, 33, 32, 34.99] },
  { passcode: '25451299', name: 'Snake-Eye Flamberge Dragon', price: 18.50, change: '+15.2%', sparkline: [14, 15, 16, 17, 17, 18.50] }
]

const TOP_GAINERS = [
  { passcode: '10294155', name: 'Sangen Summoning', price: '$24.50', change: '+45.2%', reason: 'Tenpai Meta Dominance' },
  { passcode: '92110255', name: 'Fire King High Avatar Kirin', price: '$12.99', change: '+32.8%', reason: 'YCS Champion Hype' },
  { passcode: '22881299', name: 'Yubel - Loving Defender Forever', price: '$19.00', change: '+24.5%', reason: 'Fiend Deck Support' }
]

const TOP_LOSERS = [
  { passcode: '34815190', name: 'Baronne de Fleur', price: '$0.85', change: '-95.4%', reason: 'Banned in TCG Format' },
  { passcode: '21044178', name: 'Abyss Dweller', price: '$1.20', change: '-18.2%', reason: 'Reprint in Mega Tin' },
  { passcode: '47790912', name: 'Yubel - Terror Incarnate', price: '$4.50', change: '-12.5%', reason: 'Market Oversupply' }
]

export default function MarketPage() {
  const [activeTab, setActiveTab] = useState<'search' | 'trends'>('search')
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
    if (card.prices && card.prices[key]) {
      return card.prices[key]
    }
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
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-250">
      <Navbar />

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header Title */}
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="text-yellow-500 text-xs font-black uppercase tracking-widest bg-yellow-500/10 border border-yellow-500/20 px-3.5 py-1.5 rounded-full">Indeks Finansial & Pasar</span>
          <h1 className="text-4xl font-black uppercase mt-4 mb-2 tracking-wider yugioh-glow-text flex items-center justify-center gap-2">📊 Market Tracker</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Pantau pergerakan harga pasar, temukan kartu termahal, dan bandingkan harga antar marketplace dunia secara real-time.</p>
        </div>

        {/* Tab Selectors Slider */}
        <div className="flex max-w-md mx-auto bg-white dark:bg-slate-900 border dark:border-slate-850 p-1 rounded-2xl mb-10 shadow-inner">
          <button
            onClick={() => setActiveTab('search')}
            className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'search'
                ? 'bg-yellow-500 text-slate-950 font-black shadow'
                : 'text-gray-400 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <Search size={14} />
            <span>Cek Harga Kartu</span>
          </button>
          <button
            onClick={() => setActiveTab('trends')}
            className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'trends'
                ? 'bg-yellow-500 text-slate-950 font-black shadow'
                : 'text-gray-400 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <Activity size={14} />
            <span>Tren & Lonjakan</span>
          </button>
        </div>

        {/* TAB 1: Search Panel */}
        {activeTab === 'search' && (
          <div className="space-y-8">
            {/* Search Input Bar */}
            <div className="max-w-2xl mx-auto mb-8">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    placeholder="Masukkan nama kartu (contoh: Dark Magician, Pot of Greed)..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    className="w-full pl-12 pr-4 py-4 border border-slate-200 dark:border-slate-800 rounded-2xl focus:outline-none focus:border-yellow-500 bg-white dark:bg-slate-900 text-slate-850 dark:text-white text-base font-semibold shadow-sm"
                  />
                </div>
                <button
                  onClick={handleSearch}
                  disabled={loading}
                  className="w-full sm:w-auto px-8 py-4 bg-yellow-500 text-slate-900 rounded-2xl hover:bg-yellow-400 font-bold transition shadow-md disabled:opacity-50"
                >
                  {loading ? 'Mencari...' : '🔍 Cek Harga'}
                </button>
              </div>
            </div>

            {/* Results Grid / Showcase */}
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="w-8 h-8 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin mb-3"></div>
                <p className="text-sm text-gray-400 font-bold uppercase tracking-wider animate-pulse">Menghubungkan ke API Pasar Global...</p>
              </div>
            ) : hasSearched && cards.length === 0 ? (
              <div className="text-center py-16 max-w-md mx-auto bg-white dark:bg-slate-900 border dark:border-slate-850 rounded-3xl p-6">
                <div className="text-5xl mb-3">🔍</div>
                <p className="text-slate-800 dark:text-gray-300 font-bold">Kartu Tidak Ditemukan</p>
                <p className="text-xs text-gray-500 mt-1">Pastikan ejaan nama kartu bahasa Inggris tertulis dengan benar.</p>
              </div>
            ) : cards.length > 0 ? (
              <div className="space-y-4 max-w-6xl mx-auto">
                {cards.map((card) => (
                  <div
                    key={card.id}
                    className="bg-white dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/60 rounded-3xl shadow-lg overflow-hidden transition-all hover:shadow-xl"
                  >
                    <div className="flex flex-col md:flex-row">
                      {/* Card Image Thumbnail */}
                      <div className="w-44 aspect-[3/4] mx-auto md:w-44 md:mx-0 bg-slate-950 flex-shrink-0 flex items-center justify-center p-4">
                        {card.imageUrl ? (
                          <img
                            src={card.imageUrl}
                            alt={card.name}
                            className="w-full h-full object-contain rounded-lg shadow-md"
                          />
                        ) : (
                          <div className="text-4xl">{getTypeIcon(card.type?.name)}</div>
                        )}
                      </div>

                      {/* Card Details & Prices Showcase */}
                      <div className="flex-1 p-6 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-wider mb-1">{card.name}</h3>
                              <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">{getTypeIcon(card.type?.name)} {card.type?.name || 'Monster Card'}</p>
                            </div>
                            <Link
                              href={`/cards/${card.id}`}
                              className="text-yellow-600 dark:text-yellow-500 hover:underline text-xs flex items-center gap-1 font-bold uppercase tracking-wider"
                            >
                              <span>Detail</span>
                              <ExternalLink size={12} />
                            </Link>
                          </div>

                          {/* Prices Grid Layout */}
                          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                            <div className="p-3 bg-slate-50 dark:bg-slate-950 border dark:border-slate-850/60 rounded-xl">
                              <span className="text-[8px] font-bold text-blue-500 uppercase tracking-wider block">CardMarket</span>
                              <p className="text-sm font-black text-slate-900 dark:text-white mt-1">{formatPrice(getPrice(card, 'cardMarket'))}</p>
                              <p className="text-[7px] text-gray-400 mt-0.5">EUR (€)</p>
                            </div>
                            <div className="p-3 bg-slate-50 dark:bg-slate-950 border dark:border-slate-850/60 rounded-xl">
                              <span className="text-[8px] font-bold text-green-500 uppercase tracking-wider block">TCGPlayer</span>
                              <p className="text-sm font-black text-slate-900 dark:text-white mt-1">{formatPrice(getPrice(card, 'tcgPlayer'))}</p>
                              <p className="text-[7px] text-gray-400 mt-0.5">USD ($)</p>
                            </div>
                            <div className="p-3 bg-slate-50 dark:bg-slate-950 border dark:border-slate-850/60 rounded-xl">
                              <span className="text-[8px] font-bold text-red-500 uppercase tracking-wider block">eBay Price</span>
                              <p className="text-sm font-black text-slate-900 dark:text-white mt-1">{formatPrice(getPrice(card, 'eBay'))}</p>
                              <p className="text-[7px] text-gray-400 mt-0.5">USD ($)</p>
                            </div>
                            <div className="p-3 bg-slate-50 dark:bg-slate-950 border dark:border-slate-850/60 rounded-xl">
                              <span className="text-[8px] font-bold text-orange-500 uppercase tracking-wider block">Amazon API</span>
                              <p className="text-sm font-black text-slate-900 dark:text-white mt-1">{formatPrice(getPrice(card, 'amazon'))}</p>
                              <p className="text-[7px] text-gray-400 mt-0.5">USD ($)</p>
                            </div>
                            <div className="p-3 bg-slate-50 dark:bg-slate-950 border dark:border-slate-850/60 rounded-xl">
                              <span className="text-[8px] font-bold text-purple-500 uppercase tracking-wider block">CoolStuffInc</span>
                              <p className="text-sm font-black text-slate-900 dark:text-white mt-1">{formatPrice(getPrice(card, 'coolStuffInc'))}</p>
                              <p className="text-[7px] text-gray-400 mt-0.5">USD ($)</p>
                            </div>
                          </div>
                        </div>

                        <p className="text-[9px] text-gray-400 dark:text-gray-500 mt-4 italic">💡 Selisih harga merupakan data estimasi real-time dari platform API TCGPlayer global.</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Search Prompt Hero */
              <div className="text-center py-16 max-w-lg mx-auto bg-white dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 rounded-3xl p-8 shadow-xl">
                <div className="text-6xl mb-4">🔍</div>
                <h2 className="text-xl font-extrabold tracking-wide text-slate-900 dark:text-white">Cari Harga Kartu Anda</h2>
                <p className="text-xs text-gray-400 mt-2 leading-relaxed">Gunakan tombol pencarian di bawah untuk menguji beberapa kartu legendaris terpopuler saat ini:</p>
                <div className="mt-5 flex flex-wrap justify-center gap-2">
                  {['Dark Magician', 'Blue-Eyes White Dragon', 'Pot of Greed'].map((cardName) => (
                    <button
                      key={cardName}
                      onClick={() => { setSearch(cardName); handleSearch(); }}
                      className="px-4 py-2 bg-slate-100 dark:bg-slate-950 hover:bg-yellow-500 hover:text-slate-950 rounded-xl text-xs font-bold transition border dark:border-slate-850 cursor-pointer"
                    >
                      {cardName}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: Market Trends & Top Gainers/Losers Dashboard */}
        {activeTab === 'trends' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-6xl mx-auto">
            
            {/* Left: Top 5 Most Expensive Cards with financial Sparklines (7 columns) */}
            <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
              <div>
                <h3 className="text-base font-black uppercase tracking-wider text-slate-900 dark:text-amber-100/95 flex items-center gap-2 mb-1">
                  <DollarSign size={16} className="text-yellow-500" />
                  <span>Katalog Kartu Termahal (Meta Hype)</span>
                </h3>
                <p className="text-[10px] sm:text-xs text-gray-400">Daftar harga tertinggi saat ini berdasarkan tingkat kegunaan di dalam Deck Turnamen global.</p>
              </div>

              <div className="divide-y divide-slate-100 dark:divide-slate-850/60">
                {TOP_EXPENSIVE_CARDS.map((card, idx) => (
                  <div key={card.passcode} className="py-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 font-extrabold text-xs flex items-center justify-center">
                        #{idx + 1}
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-extrabold text-xs text-slate-900 dark:text-white truncate leading-tight">{card.name}</h4>
                        <span className={`text-[8px] font-black uppercase mt-0.5 tracking-wider inline-block ${
                          card.change.startsWith('+') ? 'text-green-500' : 'text-red-500'
                        }`}>
                          {card.change} (Mingguan)
                        </span>
                      </div>
                    </div>

                    {/* Financial Sparkline Graph (Custom SVG) */}
                    <div className="hidden sm:block w-24 h-8">
                      <svg viewBox="0 0 100 30" className="w-full h-full">
                        <polyline
                          fill="none"
                          stroke={card.change.startsWith('+') ? '#22c55e' : '#ef4444'}
                          strokeWidth="2"
                          points={card.sparkline.map((val, index) => `${index * 20},${30 - ((val - Math.min(...card.sparkline)) / (Math.max(...card.sparkline) - Math.min(...card.sparkline) || 1) * 25 + 2)}`).join(' ')}
                        />
                      </svg>
                    </div>

                    <div className="text-right">
                      <p className="font-black text-sm text-slate-900 dark:text-white">${card.price.toFixed(2)}</p>
                      <p className="text-[8px] text-gray-400 font-mono mt-0.5">ID: {card.passcode}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Top Gainers & Top Losers columns (5 columns) */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* 1. Top Gainers Panel */}
              <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
                <h3 className="text-xs font-black uppercase tracking-wider text-green-500 flex items-center gap-1.5">
                  <TrendingUp size={14} />
                  <span>Top Gainers (Lonjakan Harga)</span>
                </h3>
                <div className="space-y-3.5">
                  {TOP_GAINERS.map((card) => (
                    <div key={card.passcode} className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <h4 className="font-extrabold text-[11px] text-slate-900 dark:text-white truncate">{card.name}</h4>
                        <p className="text-[8px] text-gray-400 italic mt-0.5">{card.reason}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-[9px] font-black text-green-500 bg-green-500/10 px-2 py-0.5 rounded-full">{card.change}</span>
                        <p className="text-[10px] font-extrabold text-slate-900 dark:text-gray-300 mt-1">{card.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 2. Top Losers Panel */}
              <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
                <h3 className="text-xs font-black uppercase tracking-wider text-red-500 flex items-center gap-1.5">
                  <TrendingDown size={14} />
                  <span>Top Losers (Penurunan Harga)</span>
                </h3>
                <div className="space-y-3.5">
                  {TOP_LOSERS.map((card) => (
                    <div key={card.passcode} className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <h4 className="font-extrabold text-[11px] text-slate-900 dark:text-white truncate">{card.name}</h4>
                        <p className="text-[8px] text-gray-400 italic mt-0.5">{card.reason}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-[9px] font-black text-red-500 bg-red-500/10 px-2 py-0.5 rounded-full">{card.change}</span>
                        <p className="text-[10px] font-extrabold text-slate-900 dark:text-gray-300 mt-1">{card.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        )}

      </div>
    </main>
  )
}