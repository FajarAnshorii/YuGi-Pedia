'use client'

import { useState, useEffect, useMemo } from 'react'
import Navbar from '@/components/Navbar'
import { Search, Calendar, Hash, ChevronDown } from 'lucide-react'

interface BoosterPack {
  setName: string
  setCode: string
  num_of_cards: number
  releaseDate: string
  imageUrl: string | null
}

export default function BoosterPackPage() {
  const [packs, setPacks] = useState<BoosterPack[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'most_cards' | 'least_cards'>('newest')
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({})

  // Fetch booster packs from our database-backed API (which now queries live cardsets.php images)
  useEffect(() => {
    fetch('/api/booster-pack')
      .then((res) => {
        if (!res.ok) throw new Error('API request failed')
        return res.json()
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setPacks(data)
        } else {
          throw new Error('Data format error')
        }
        setLoading(false)
      })
      .catch((err) => {
        console.error('Error fetching booster packs:', err)
        setError(true)
        setLoading(false)
      })
  }, [])

  // Handle broken images by falling back to the 3D custom portal mockup
  const handleImageError = (setName: string) => {
    setFailedImages(prev => ({ ...prev, [setName]: true }))
  }

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
        pack.setName.toLowerCase().includes(q) ||
        (pack.setCode && pack.setCode.toLowerCase().includes(q))
      )
    })

    result.sort((a, b) => {
      if (sortBy === 'newest' || sortBy === 'oldest') {
        const timeA = a.releaseDate ? new Date(a.releaseDate).getTime() : 0
        const timeB = b.releaseDate ? new Date(b.releaseDate).getTime() : 0
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
            Daftar rilis booster pack & card set langsung secara instan dari database lokal Yu-Gi-Oh! Anda
          </p>
        </div>

        {/* Filters and Controls */}
        <div className="relative overflow-hidden bg-slate-900/70 border border-yellow-500/15 backdrop-blur-md p-5 rounded-2xl shadow-xl shadow-yellow-500/[0.02] mb-8 transition-all duration-300">
          {/* Decorative Golden Ambient Line */}
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-yellow-500/30 to-transparent"></div>

          <div className="flex flex-col md:flex-row gap-3.5 items-center">
            {/* Search Input */}
            <div className="flex-1 w-full relative">
              <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-yellow-500/70" size={16} />
              <input
                type="text"
                placeholder="Cari booster pack (contoh: Legend of Blue Eyes, LOB, SDY, dsb)..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-700 bg-slate-950/60 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500/30 text-sm font-semibold transition duration-200"
              />
            </div>

            {/* Sort Dropdown */}
            <div className="relative w-full md:w-64">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full h-11 pl-4 pr-10 appearance-none rounded-xl border border-slate-700 bg-slate-950/60 text-slate-200 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500/30 text-xs font-bold transition cursor-pointer"
              >
                <option value="newest" className="bg-slate-900 text-slate-200">📅 Rilis: Terbaru</option>
                <option value="oldest" className="bg-slate-900 text-slate-200">📅 Rilis: Terlama</option>
                <option value="most_cards" className="bg-slate-900 text-slate-200">🎴 Jumlah Kartu: Terbanyak</option>
                <option value="least_cards" className="bg-slate-900 text-slate-200">🎴 Jumlah Kartu: Tersedikit</option>
              </select>
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-yellow-500/70">
                <ChevronDown size={14} strokeWidth={2.5} />
              </div>
            </div>
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
            <p className="text-gray-500 dark:text-gray-400 font-bold text-lg tracking-wider animate-pulse">Menghubungkan ke Database...</p>
            <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">Mengunduh daftar rilis set kartu...</p>
          </div>
        ) : error ? (
          <div className="text-center py-16 bg-red-500/5 rounded-2xl border border-red-500/10 max-w-lg mx-auto p-8">
            <div className="text-5xl mb-4">⚠️</div>
            <h3 className="text-lg font-bold text-red-500 mb-2">Gagal Mengunduh Data</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
              Ada kendala koneksi saat menghubungi server lokal database.
            </p>
            <button
              onClick={() => {
                setLoading(true)
                setError(false)
                fetch('/api/booster-pack')
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
              const isFuture = pack.releaseDate && new Date(pack.releaseDate).getTime() > Date.now()
              const hasImageError = failedImages[pack.setName]
              const useFallback = !pack.imageUrl || hasImageError

              return (
                <div 
                  key={pack.setName}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-gray-100 dark:border-slate-800/40 bg-white dark:bg-slate-900/40 hover:border-yellow-500/40 dark:hover:border-yellow-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-yellow-500/5 hover:-translate-y-1"
                >
                  {/* Subtle inner radial glow */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-yellow-500/0 via-transparent to-yellow-500/0 group-hover:from-yellow-500/[0.02] group-hover:to-yellow-500/[0.03] transition-all duration-300 pointer-events-none"></div>

                  <div>
                    {/* Cover Pack 3D Showcase Header */}
                    <div className="relative h-56 w-full bg-slate-950/80 border-b border-gray-100 dark:border-slate-800/40 flex items-center justify-center overflow-hidden">
                      {/* Technical Blueprint Grid overlay */}
                      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:14px_24px] opacity-20"></div>
                      
                      {/* Ambient Golden Radial Light */}
                      <div className="absolute inset-0 bg-radial-gradient from-yellow-500/5 via-transparent to-transparent pointer-events-none"></div>

                      {!useFallback ? (
                        /* Case A: Show real, high-resolution physical booster wrapper packaging artwork! */
                        <div className="relative w-28 h-40 transform group-hover:scale-110 group-hover:-translate-y-2 transition-all duration-300 z-10">
                          {/* Inner soft golden back shadow */}
                          <div className="absolute inset-0 bg-yellow-500/10 rounded-lg blur-md group-hover:bg-yellow-500/20 transition duration-300 -z-10"></div>
                          
                          <img 
                            src={pack.imageUrl!} 
                            alt={pack.setName}
                            onError={() => handleImageError(pack.setName)}
                            className="w-full h-full object-contain rounded-md shadow-2xl transition duration-300"
                          />
                          
                          {/* Holographic wrapper shine reflection line */}
                          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/15 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out pointer-events-none rounded-md"></div>
                        </div>
                      ) : (
                        /* Case B: Custom 3D Holographic portal backup wrapper */
                        <div className="relative w-32 h-44 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 border border-yellow-500/20 rounded-lg shadow-2xl flex flex-col justify-between p-2 transform group-hover:scale-105 group-hover:-translate-y-1.5 group-hover:border-yellow-500/40 transition-all duration-300">
                          
                          {/* Metallic foil sweep animation */}
                          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-yellow-500/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out pointer-events-none rounded-md"></div>

                          {/* Top sealed aluminum crimp lines */}
                          <div className="absolute top-0 left-0 right-0 h-2 bg-slate-800 border-b border-slate-950/50 flex gap-[1px] justify-center overflow-hidden">
                            {Array.from({ length: 20 }).map((_, i) => (
                              <div key={i} className="w-[4px] h-full bg-slate-900 border-r border-slate-800/40"></div>
                            ))}
                          </div>

                          {/* Bottom sealed aluminum crimp lines */}
                          <div className="absolute bottom-0 left-0 right-0 h-2 bg-slate-800 border-t border-slate-950/50 flex gap-[1px] justify-center overflow-hidden">
                            {Array.from({ length: 20 }).map((_, i) => (
                              <div key={i} className="w-[4px] h-full bg-slate-900 border-r border-slate-800/40"></div>
                            ))}
                          </div>

                          {/* Top Header */}
                          <div className="mt-2 text-center relative z-10">
                            <div className="text-[6.5px] font-black tracking-[0.2em] text-yellow-500 uppercase drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                              BOOSTER PACK
                            </div>
                          </div>

                          {/* Card Art portal frame */}
                          <div className="relative my-1.5 mx-auto h-24 w-24 flex items-center justify-center">
                            {/* Spinning holographic outer portal ring */}
                            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-yellow-500/15 via-purple-500/15 to-yellow-500/15 animate-[spin_12s_linear_infinite] border border-yellow-500/20 shadow-[0_0_12px_rgba(234,179,8,0.2)]"></div>
                            
                            {/* Inside portal artwork (perfectly circle-cropped card illustration fallback) */}
                            <div className="relative h-[82px] w-[82px] rounded-full overflow-hidden border border-yellow-500/30 bg-slate-950 flex items-center justify-center shadow-inner">
                              <div className="text-yellow-500 font-extrabold text-[10px]">YGO</div>
                            </div>
                          </div>

                          {/* Bottom Pack set metadata banner */}
                          <div className="mb-2 text-center relative z-10">
                            <div className="inline-block px-2 py-0.5 bg-gradient-to-r from-yellow-500 to-yellow-400 text-slate-950 font-black text-[8px] rounded uppercase tracking-wider shadow-md">
                              {pack.setCode || 'SET'}
                            </div>
                            <div className="text-[6.5px] font-extrabold text-slate-400 mt-1 uppercase tracking-tight truncate max-w-[105px] mx-auto">
                              {pack.setName}
                            </div>
                          </div>

                        </div>
                      )}

                      {/* Floating set-code badge */}
                      <div className="absolute top-3 left-3 z-10">
                        {pack.setCode ? (
                          <span className="px-2.5 py-1 bg-slate-900/95 text-yellow-400 border border-yellow-500/20 backdrop-blur-md rounded-lg text-[10px] font-black uppercase tracking-wider shadow-md">
                            {pack.setCode}
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 bg-slate-900/95 text-gray-400 border border-slate-800 backdrop-blur-md rounded-lg text-[10px] font-black uppercase tracking-wider shadow-md">
                            SET
                          </span>
                        )}
                      </div>

                      {isFuture && (
                        <div className="absolute top-3 right-3 z-10">
                          <span className="px-2.5 py-1 bg-rose-500 text-white rounded-lg text-[9px] font-extrabold uppercase tracking-widest shadow-md animate-pulse">
                            🔮 Upcoming
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="p-6">
                      {/* Title */}
                      <h3 className="text-lg font-extrabold text-slate-800 dark:text-slate-100 mb-4 group-hover:text-yellow-500 transition-colors duration-200 leading-snug line-clamp-2">
                        {pack.setName}
                      </h3>

                      {/* Stats Badges */}
                      <div className="space-y-2 mb-2">
                        {/* Release Date */}
                        <div className="flex items-center gap-2.5 text-xs font-semibold text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-slate-800/30 p-2.5 rounded-xl border border-gray-100/50 dark:border-slate-800/30">
                          <Calendar size={14} className="text-yellow-500 shrink-0" />
                          <span>Rilis: {formatDate(pack.releaseDate)}</span>
                        </div>

                        {/* Number of cards */}
                        <div className="flex items-center gap-2.5 text-xs font-semibold text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-slate-800/30 p-2.5 rounded-xl border border-gray-100/50 dark:border-slate-800/30">
                          <Hash size={14} className="text-yellow-500 shrink-0" />
                          <span>Jumlah: <span className="text-yellow-600 dark:text-yellow-400 font-bold">{pack.num_of_cards || 0}</span> kartu terdaftar</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Internal search button */}
                  <div className="mx-6 mb-6 pt-4 border-t border-gray-100 dark:border-slate-800/40">
                    <a
                      href={`/album?search=${encodeURIComponent(pack.setName)}`}
                      className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-yellow-500 hover:bg-yellow-400 text-slate-900 text-xs font-bold rounded-xl transition shadow-md shadow-yellow-500/10 hover:shadow-yellow-500/20 active:scale-95"
                    >
                      <span>Temukan Kartu di Album</span>
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
