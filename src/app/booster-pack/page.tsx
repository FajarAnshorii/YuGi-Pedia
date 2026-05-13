'use client'

import { useState, useEffect, useMemo } from 'react'
import Navbar from '@/components/Navbar'
import { Search, Calendar, ExternalLink, Hash, Award } from 'lucide-react'

interface YGOPack {
  set_name: string
  set_code: string
  num_of_cards: number
  tcg_date: string
}

export default function BoosterPackPage() {
  const [packs, setPacks] = useState<YGOPack[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'most_cards' | 'least_cards'>('newest')

  // Fetch live booster packs from YGOPRODeck API
  useEffect(() => {
    fetch('https://db.ygoprodeck.com/api/v7/cardsets.php')
      .then((res) => {
        if (!res.ok) throw new Error('API request failed')
        return res.json()
      })
      .then((data) => {
        if (Array.isArray(data)) {
          // Clean up and store
          setPacks(data)
        } else {
          throw new Error('Data format error')
        }
        setLoading(false)
      })
      .catch((err) => {
        console.error('Error fetching card sets:', err)
        setError(true)
        setLoading(false)
      })
  }, [])

  // Format date helper
  const formatDate = (dateStr: string | null | undefined) => {
    if (!dateStr) return 'Tanggal tidak diketahui'
    try {
      const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' }
      return new Date(dateStr).toLocaleDateString('id-ID', options)
    } catch {
      return dateStr
    }
  }

  // Filter & Sort
  const filteredPacks = useMemo(() => {
    let result = packs.filter(pack => {
      const q = search.toLowerCase()
      return (
        pack.set_name.toLowerCase().includes(q) ||
        (pack.set_code && pack.set_code.toLowerCase().includes(q))
      )
    })

    result.sort((a, b) => {
      if (sortBy === 'newest' || sortBy === 'oldest') {
        const timeA = a.tcg_date ? new Date(a.tcg_date).getTime() : 0
        const timeB = b.tcg_date ? new Date(b.tcg_date).getTime() : 0
        return sortBy === 'newest' ? timeB - timeA : timeA - timeB
      } else {
        const cardsA = a.num_of_cards || 0
        const cardsB = b.num_of_cards || 0
        return sortBy === 'most_cards' ? cardsB - cardsA : cardsA - cardsB
      }
    })

    return result
  }, [packs, search, sortBy])

  return (
    <main className="min-h-screen transition-colors duration-200">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 text-center sm:text-left">
          <h1 className="text-3xl sm:text-4xl font-extrabold yugioh-glow-text uppercase tracking-wider mb-2 flex flex-col sm:flex-row items-center gap-3 justify-center sm:justify-start">
            <div className="inline-flex items-center justify-center p-2 rounded-xl bg-yellow-500/10 border border-yellow-500/20 shadow-inner">
              <svg className="w-8 h-8 text-yellow-400 drop-shadow-[0_0_8px_rgba(234,179,8,0.6)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            Booster Pack Releases
          </h1>
          <p className="text-gray-600 dark:text-gray-400 font-semibold text-sm sm:pl-[60px]">
            Informasi rilis booster pack & card set langsung secara real-time dari YGOPRODeck API
          </p>
        </div>

        {/* Filters and Controls */}
        <div className="bg-white dark:bg-slate-900/60 border border-gray-100 dark:border-slate-800/40 p-4 rounded-xl shadow-md mb-8 transition-colors duration-200">
          <div className="flex flex-col md:flex-row gap-3">
            {/* Search Input */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Cari booster pack (contoh: Rarity, Chaos, LOB, dll)..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-slate-700/60 rounded-xl focus:ring-2 focus:ring-yellow-400 bg-white dark:bg-slate-800 dark:text-white dark:placeholder-gray-400 text-sm font-medium"
                />
              </div>
            </div>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-4 py-3 border border-gray-200 dark:border-slate-700/60 rounded-xl focus:ring-2 focus:ring-yellow-400 bg-white dark:bg-slate-800 dark:text-white text-sm font-semibold transition"
            >
              <option value="newest">📅 Rilis: Terbaru</option>
              <option value="oldest">📅 Rilis: Terlama</option>
              <option value="most_cards">🎴 Jumlah Kartu: Terbanyak</option>
              <option value="least_cards">🎴 Jumlah Kartu: Tersedikit</option>
            </select>
          </div>
        </div>

        {/* Content States */}
        {loading ? (
          /* Custom Rotating Logo summon circle */
          <div className="flex flex-col items-center justify-center py-24">
            <div className="relative mb-4 h-24 w-24 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-2 border-dashed border-yellow-400/30 animate-[spin_10s_linear_infinite]"></div>
              <img 
                src="/images/logo.png" 
                alt="Loading..." 
                className="h-20 w-20 animate-spin object-contain drop-shadow-[0_0_15px_rgba(234,179,8,0.5)]" 
              />
            </div>
            <p className="text-gray-500 dark:text-gray-400 font-bold text-lg tracking-wider animate-pulse">Menghubungkan ke YGOPRODeck...</p>
            <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">Mengunduh database set kartu...</p>
          </div>
        ) : error ? (
          <div className="text-center py-16 bg-red-500/5 rounded-2xl border border-red-500/10 max-w-lg mx-auto p-8">
            <div className="text-5xl mb-4">⚠️</div>
            <h3 className="text-lg font-bold text-red-500 mb-2">Gagal Mengunduh Data</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
              Ada kendala koneksi saat menghubungi server API YGOPRODeck.
            </p>
            <button
              onClick={() => {
                setLoading(true)
                setError(false)
                fetch('https://db.ygoprodeck.com/api/v7/cardsets.php')
                  .then(res => res.json())
                  .then(data => {
                    setPacks(data)
                    setLoading(false)
                  })
                  .catch(() => {
                    setError(true)
                    setLoading(false)
                  })
              }}
              className="px-6 py-2.5 bg-yellow-500 hover:bg-yellow-400 text-slate-900 rounded-xl font-bold text-xs transition"
            >
              Coba Lagi
            </button>
          </div>
        ) : filteredPacks.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Booster tidak ditemukan</h3>
            <p className="text-gray-500 dark:text-gray-400">Coba masukkan kata kunci pencarian yang berbeda.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPacks.map((pack) => {
              const isFuture = pack.tcg_date && new Date(pack.tcg_date).getTime() > Date.now()

              return (
                <div 
                  key={pack.set_name}
                  className="group relative flex flex-col justify-between rounded-2xl border border-gray-100 dark:border-slate-800/40 p-6 bg-white dark:bg-slate-900/40 hover:border-yellow-500/40 dark:hover:border-yellow-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-yellow-500/5 hover:-translate-y-1"
                >
                  {/* Subtle inner radial glow */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-yellow-500/0 via-transparent to-yellow-500/0 group-hover:from-yellow-500/[0.02] group-hover:to-yellow-500/[0.03] transition-all duration-300 pointer-events-none"></div>

                  <div>
                    {/* Pack Badge Code & Status */}
                    <div className="flex items-center justify-between mb-4">
                      {pack.set_code ? (
                        <span className="px-3 py-1 bg-yellow-500/10 text-yellow-500 dark:text-yellow-400 border border-yellow-500/20 rounded-full text-xs font-bold uppercase tracking-wider">
                          {pack.set_code}
                        </span>
                      ) : (
                        <span className="px-3 py-1 bg-slate-500/10 text-slate-500 dark:text-slate-400 border border-slate-500/20 rounded-full text-xs font-bold uppercase tracking-wider">
                          SET
                        </span>
                      )}
                      {isFuture && (
                        <span className="px-2.5 py-0.5 bg-rose-500/10 text-rose-500 dark:text-rose-400 border border-rose-500/20 rounded-full text-[10px] font-extrabold uppercase tracking-wide flex items-center gap-1 animate-pulse">
                          🔮 Upcoming
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-extrabold text-slate-800 dark:text-slate-100 mb-3 group-hover:text-yellow-500 transition-colors duration-200 leading-snug">
                      {pack.set_name}
                    </h3>

                    {/* Stats Badges */}
                    <div className="space-y-2 mb-4">
                      {/* Release Date */}
                      <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-slate-800/30 p-2.5 rounded-xl border border-gray-100/50 dark:border-slate-800/30">
                        <Calendar size={14} className="text-yellow-500 shrink-0" />
                        <span>Rilis: {formatDate(pack.tcg_date)}</span>
                      </div>

                      {/* Number of cards */}
                      <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-slate-800/30 p-2.5 rounded-xl border border-gray-100/50 dark:border-slate-800/30">
                        <Hash size={14} className="text-yellow-500 shrink-0" />
                        <span>Jumlah: <span className="text-yellow-600 dark:text-yellow-400 font-bold">{pack.num_of_cards || 0}</span> kartu terdaftar</span>
                      </div>
                    </div>
                  </div>

                  {/* External lookup reference buttons */}
                  <div className="pt-4 border-t border-gray-100 dark:border-slate-800/40 flex items-center justify-between gap-4">
                    {/* Search inside website */}
                    <a
                      href={`/album?search=${encodeURIComponent(pack.set_name)}`}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-yellow-600 dark:text-yellow-400 hover:underline hover:text-yellow-500"
                    >
                      <span>Temukan Kartu →</span>
                    </a>

                    {/* DB Link */}
                    <a
                      href={`https://db.ygoprodeck.com/set/?set=${encodeURIComponent(pack.set_name)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-400 hover:text-gray-200 transition-colors duration-150"
                    >
                      <span>YGOPRODeck</span>
                      <ExternalLink size={11} />
                    </a>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}
