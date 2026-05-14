'use client'

import { useState, useEffect, useMemo } from 'react'
import Navbar from '@/components/Navbar'
import { Search, Calendar, Hash, ChevronDown, Sparkles, X, Eye, RefreshCw } from 'lucide-react'
import Link from 'next/link'

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

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 12

  // Pack Opener State
  const [activePack, setActivePack] = useState<BoosterPack | null>(null)
  const [isOpenModal, setIsOpenModal] = useState(false)
  const [openedCards, setOpenedCards] = useState<any[]>([])
  const [isLoadingCards, setIsLoadingCards] = useState(false)
  const [packStatus, setPackStatus] = useState<'closed' | 'tearing' | 'opened'>('closed')
  const [flippedIndices, setFlippedIndices] = useState<Record<number, boolean>>({})

  // Fetch booster packs
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

  // Reset pagination on filter change
  useEffect(() => {
    setCurrentPage(1)
  }, [search, sortBy])

  // Handle broken images
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

  // Paginated packs
  const paginatedPacks = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return filteredPacks.slice(startIndex, startIndex + itemsPerPage)
  }, [filteredPacks, currentPage, itemsPerPage])

  const totalPages = Math.ceil(filteredPacks.length / itemsPerPage)

  // Trigger Pack Opening
  const handleOpenPackStart = async (pack: BoosterPack) => {
    setActivePack(pack)
    setIsOpenModal(true)
    setPackStatus('closed')
    setIsLoadingCards(true)
    setFlippedIndices({})
    setOpenedCards([])

    try {
      const res = await fetch(`/api/booster-pack/open?setName=${encodeURIComponent(pack.setName)}`)
      const data = await res.json()
      if (data && Array.isArray(data.cards)) {
        setOpenedCards(data.cards)
      } else {
        throw new Error('Cards not found')
      }
    } catch (err) {
      console.error('Failed to load set cards for opening:', err)
      alert('Gagal mengambil isi kartu set booster. Menutup simulator.')
      setIsOpenModal(false)
    } finally {
      setIsLoadingCards(false)
    }
  }

  // Tear open trigger
  const handleTearOpen = () => {
    setPackStatus('tearing')
    setTimeout(() => {
      setPackStatus('opened')
    }, 1200) // matches split wrapper animation time
  }

  // Flip single card
  const toggleFlip = (index: number) => {
    setFlippedIndices(prev => ({ ...prev, [index]: !prev[index] }))
  }

  // Flip all cards
  const flipAllCards = () => {
    const newFlipped: Record<number, boolean> = {}
    openedCards.forEach((_, i) => {
      newFlipped[i] = true
    })
    setFlippedIndices(newFlipped)
  }

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-250">
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
          <p className="text-gray-500 dark:text-gray-400 font-semibold text-sm sm:pl-[60px]">
            Daftar rilis booster pack & card set terlengkap dengan fitur simulator pembukaan pack 3D
          </p>
        </div>

        {/* Filters and Controls */}
        <div className="relative overflow-hidden bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-5 rounded-2xl shadow-xl mb-8 transition-all duration-300">
          <div className="flex flex-col md:flex-row gap-3.5 items-center">
            {/* Search Input */}
            <div className="flex-1 w-full relative">
              <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-yellow-500/70" size={16} />
              <input
                type="text"
                placeholder="Cari booster pack (contoh: Legend of Blue Eyes, LOB, SDY, dsb)..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-yellow-500 dark:focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500/30 text-sm font-semibold transition duration-200"
              />
            </div>

            {/* Sort Dropdown */}
            <div className="relative w-full md:w-64">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full h-11 pl-4 pr-10 appearance-none rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-yellow-500 dark:focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500/30 text-xs font-bold transition cursor-pointer"
              >
                <option value="newest" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200">📅 Rilis: Terbaru</option>
                <option value="oldest" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200">📅 Rilis: Terlama</option>
                <option value="most_cards" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200">🎴 Jumlah Kartu: Terbanyak</option>
                <option value="least_cards" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200">🎴 Jumlah Kartu: Tersedikit</option>
              </select>
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 dark:text-yellow-500/70">
                <ChevronDown size={14} strokeWidth={2.5} />
              </div>
            </div>
          </div>
        </div>

        {/* Content States */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="relative mb-4 h-24 w-24 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-2 border-dashed border-yellow-400/30 animate-[spin_10s_linear_infinite]"></div>
              <div className="relative h-20 w-20 flex items-center justify-center animate-pulse">
                <div className="absolute inset-0 bg-yellow-500/20 rounded-full blur-xl"></div>
                <div className="relative w-12 h-18 bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-yellow-500/60 rounded-xl shadow-[0_0_20px_rgba(234,179,8,0.4)] flex flex-col justify-between p-1.5">
                  <div className="flex justify-between items-center px-0.5">
                    <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full animate-pulse"></div>
                    <div className="w-2 h-[3px] bg-slate-700 rounded-sm"></div>
                  </div>
                  <div className="w-5 h-5 mx-auto flex items-center justify-center rounded-full bg-yellow-500/10 border border-yellow-500/30">
                    <svg className="w-3.5 h-3.5 text-yellow-500 animate-[spin_3s_linear_infinite]" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                  </div>
                  <div className="w-full flex justify-center">
                    <div className="w-5 h-[2px] bg-yellow-500/50 rounded-sm"></div>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-gray-500 dark:text-gray-400 font-bold text-lg tracking-wider animate-pulse">Menghubungkan ke Database...</p>
          </div>
        ) : error ? (
          <div className="text-center py-16 bg-red-500/5 rounded-2xl border border-red-500/10 max-w-lg mx-auto p-8">
            <div className="text-5xl mb-4">⚠️</div>
            <h3 className="text-lg font-bold text-red-500 mb-2">Gagal Mengunduh Data</h3>
            <button
              onClick={() => {
                setLoading(true)
                setError(false)
                fetch('/api/booster-pack')
                  .then(res => res.json())
                  .then(data => { setPacks(data); setLoading(false); })
                  .catch(() => { setError(true); setLoading(false); })
              }}
              className="px-6 py-2.5 bg-yellow-500 hover:bg-yellow-400 text-slate-900 rounded-xl font-bold text-xs transition"
            >
              Coba Lagi
            </button>
          </div>
        ) : filteredPacks.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-gray-850 dark:text-white mb-2">Booster tidak ditemukan</h3>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedPacks.map((pack) => {
                const isFuture = pack.releaseDate && new Date(pack.releaseDate).getTime() > Date.now()
                const hasImageError = failedImages[pack.setName]
                const useFallback = !pack.imageUrl || hasImageError

                return (
                  <div 
                    key={pack.setName}
                    className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-100 dark:border-slate-900 bg-white dark:bg-slate-900/40 hover:border-yellow-500/40 dark:hover:border-yellow-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-yellow-500/5 hover:-translate-y-1"
                  >
                    <div>
                      {/* Cover Pack */}
                      <div className="relative h-56 w-full bg-slate-950/80 border-b border-gray-100 dark:border-slate-800/40 flex items-center justify-center overflow-hidden">
                        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:14px_24px] opacity-20"></div>
                        <div className="absolute inset-0 bg-radial-gradient from-yellow-500/5 via-transparent to-transparent pointer-events-none"></div>

                        {!useFallback ? (
                          <div className="relative w-28 h-40 transform group-hover:scale-108 group-hover:-translate-y-1 transition-all duration-300 z-10">
                            <div className="absolute inset-0 bg-yellow-500/10 rounded-lg blur-md group-hover:bg-yellow-500/20 transition duration-300 -z-10"></div>
                            <img 
                              src={pack.imageUrl!} 
                              alt={pack.setName}
                              onError={() => handleImageError(pack.setName)}
                              className="w-full h-full object-contain rounded-md shadow-2xl"
                            />
                            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/15 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out pointer-events-none rounded-md"></div>
                          </div>
                        ) : (
                          <div className="relative w-32 h-44 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 border border-yellow-500/20 rounded-lg shadow-2xl flex flex-col justify-between p-2 transform group-hover:scale-105 group-hover:-translate-y-1.5 group-hover:border-yellow-500/40 transition-all duration-300">
                            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-yellow-500/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out pointer-events-none rounded-md"></div>
                            <div className="absolute top-0 left-0 right-0 h-2 bg-slate-850 flex gap-[1px] justify-center overflow-hidden">
                              {Array.from({ length: 20 }).map((_, i) => (
                                <div key={i} className="w-[4px] h-full bg-slate-900 border-r border-slate-800/40"></div>
                              ))}
                            </div>
                            <div className="absolute bottom-0 left-0 right-0 h-2 bg-slate-850 flex gap-[1px] justify-center overflow-hidden">
                              {Array.from({ length: 20 }).map((_, i) => (
                                <div key={i} className="w-[4px] h-full bg-slate-900 border-r border-slate-800/40"></div>
                              ))}
                            </div>
                            <div className="mt-2 text-center relative z-10">
                              <div className="text-[6.5px] font-black tracking-[0.2em] text-yellow-500 uppercase drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">BOOSTER PACK</div>
                            </div>
                            <div className="relative my-1.5 mx-auto h-24 w-24 flex items-center justify-center">
                              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-yellow-500/15 via-purple-500/15 to-yellow-500/15 animate-[spin_12s_linear_infinite] border border-yellow-500/20 shadow-[0_0_12px_rgba(234,179,8,0.2)]"></div>
                              <div className="relative h-[82px] w-[82px] rounded-full overflow-hidden border border-yellow-500/30 bg-slate-950 flex items-center justify-center shadow-inner">
                                <div className="text-yellow-500 font-extrabold text-[10px]">YGO</div>
                              </div>
                            </div>
                            <div className="mb-2 text-center relative z-10">
                              <div className="inline-block px-2 py-0.5 bg-gradient-to-r from-yellow-500 to-yellow-400 text-slate-950 font-black text-[8px] rounded uppercase tracking-wider shadow-md">{pack.setCode || 'SET'}</div>
                              <div className="text-[6.5px] font-extrabold text-slate-400 mt-1 uppercase tracking-tight truncate max-w-[105px] mx-auto">{pack.setName}</div>
                            </div>
                          </div>
                        )}

                        <div className="absolute top-3 left-3 z-10">
                          <span className="px-2.5 py-1 bg-slate-900/90 text-yellow-400 border border-yellow-500/20 backdrop-blur-md rounded-lg text-[10px] font-black uppercase tracking-wider shadow-md">
                            {pack.setCode || 'SET'}
                          </span>
                        </div>

                        {isFuture && (
                          <div className="absolute top-3 right-3 z-10">
                            <span className="px-2.5 py-1 bg-rose-500 text-white rounded-lg text-[9px] font-extrabold uppercase tracking-widest shadow-md animate-pulse">🔮 Upcoming</span>
                          </div>
                        )}
                      </div>

                      {/* Info body */}
                      <div className="p-6 pb-2">
                        <h3 className="text-lg font-extrabold text-slate-900 dark:text-slate-100 mb-4 group-hover:text-yellow-500 transition-colors duration-200 leading-snug line-clamp-2">{pack.setName}</h3>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2.5 text-xs font-semibold text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-slate-950/40 p-2.5 rounded-xl border dark:border-slate-800/40">
                            <Calendar size={14} className="text-yellow-500 shrink-0" />
                            <span>Rilis: {formatDate(pack.releaseDate)}</span>
                          </div>
                          <div className="flex items-center gap-2.5 text-xs font-semibold text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-slate-950/40 p-2.5 rounded-xl border dark:border-slate-800/40">
                            <Hash size={14} className="text-yellow-500 shrink-0" />
                            <span>Jumlah: <span className="text-yellow-600 dark:text-yellow-400 font-extrabold">{pack.num_of_cards || 0}</span> kartu</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Dual Buttons Block */}
                    <div className="px-6 pb-6 pt-4 border-t border-slate-100 dark:border-slate-900/60 flex flex-col sm:flex-row gap-2.5">
                      <Link
                        href={`/album?search=${encodeURIComponent(pack.setName)}`}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-3 bg-slate-150 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-xl transition"
                      >
                        <Eye size={13} />
                        <span>Isi Pack</span>
                      </Link>
                      <button
                        onClick={() => handleOpenPackStart(pack)}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-3 bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-slate-950 text-xs font-black rounded-xl transition shadow-md shadow-yellow-500/10 hover:shadow-yellow-500/25 active:scale-95"
                      >
                        <Sparkles size={13} />
                        <span>Buka Pack</span>
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-4 rounded-2xl shadow-xl">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Menampilkan <span className="text-yellow-600 dark:text-yellow-500 font-bold">{(currentPage - 1) * itemsPerPage + 1}</span> - <span className="text-yellow-600 dark:text-yellow-500 font-bold">{Math.min(currentPage * itemsPerPage, filteredPacks.length)}</span> dari <span className="text-yellow-600 dark:text-yellow-500 font-bold">{filteredPacks.length}</span> booster pack
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-slate-50 dark:bg-slate-950 border dark:border-slate-800 hover:border-yellow-500/30 text-slate-600 dark:text-slate-300 hover:text-yellow-500 disabled:opacity-40 rounded-xl text-xs font-bold transition duration-200 active:scale-95"
                  >
                    ◀ Sebelumnya
                  </button>

                  <div className="hidden sm:flex items-center gap-1.5">
                    {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                      let pageNum = i + 1
                      if (currentPage > 3 && totalPages > 5) {
                        pageNum = currentPage - 2 + i
                        if (pageNum + (4 - i) > totalPages) {
                          pageNum = totalPages - 4 + i
                        }
                      }

                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`h-9 w-9 flex items-center justify-center rounded-xl text-xs font-bold transition duration-200 active:scale-95 ${
                            currentPage === pageNum
                              ? 'bg-gradient-to-r from-yellow-500 to-yellow-400 text-slate-950 shadow-md shadow-yellow-500/10'
                              : 'bg-slate-50 dark:bg-slate-950 border dark:border-slate-800 hover:border-yellow-500/30 text-slate-600 dark:text-slate-300 hover:text-yellow-500'
                          }`}
                        >
                          {pageNum}
                        </button>
                      )
                    })}
                  </div>

                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 bg-slate-50 dark:bg-slate-950 border dark:border-slate-800 hover:border-yellow-500/30 text-slate-600 dark:text-slate-300 hover:text-yellow-500 disabled:opacity-40 rounded-xl text-xs font-bold transition duration-200 active:scale-95"
                  >
                    Selanjutnya ▶
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* 3D PACK OPENING INTERACTIVE ARENA MODAL */}
      {isOpenModal && activePack && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-md animate-in fade-in duration-300">
          <div className="relative w-full h-full max-w-5xl flex flex-col justify-between py-6">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center px-4">
              <div>
                <span className="text-yellow-400 text-[10px] font-extrabold uppercase tracking-widest bg-yellow-400/10 px-2.5 py-1 rounded">Booster Opener Simulator</span>
                <h2 className="text-xl md:text-2xl font-black text-white mt-1.5 uppercase tracking-wide">{activePack.setName}</h2>
              </div>
              <button
                onClick={() => setIsOpenModal(false)}
                className="p-2.5 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-gray-400 hover:text-white rounded-full transition"
              >
                <X size={18} />
              </button>
            </div>

            {/* STAGE A: Closed Pack Waiting to be Torn */}
            {packStatus === 'closed' && (
              <div className="flex-1 flex flex-col items-center justify-center">
                {isLoadingCards ? (
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-gray-400 text-sm font-bold animate-pulse uppercase tracking-widest">Memanggil Booster Foil...</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    {/* 3D Pack Wrapper hovering */}
                    <div className="w-56 h-80 relative rounded-2xl bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 border border-yellow-500/30 shadow-[0_20px_50px_rgba(234,179,8,0.15)] p-4 flex flex-col justify-between items-center transform animate-[float_3s_infinite_ease-in-out] [perspective:1000px] hover:scale-102 transition duration-300 cursor-pointer" onClick={handleTearOpen}>
                      <div className="absolute top-0 left-0 right-0 h-3.5 bg-slate-800 border-b border-slate-950/50 flex gap-[1.5px] justify-center overflow-hidden rounded-t-xl">
                        {Array.from({ length: 30 }).map((_, i) => (
                          <div key={i} className="w-[4px] h-full bg-slate-900 border-r border-slate-800/20"></div>
                        ))}
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 h-3.5 bg-slate-800 border-t border-slate-950/50 flex gap-[1.5px] justify-center overflow-hidden rounded-b-xl">
                        {Array.from({ length: 30 }).map((_, i) => (
                          <div key={i} className="w-[4px] h-full bg-slate-900 border-r border-slate-800/20"></div>
                        ))}
                      </div>

                      <div className="mt-4 text-center">
                        <span className="text-[8px] font-black tracking-[0.25em] text-yellow-500 uppercase">OFFICIAL BOOSTER</span>
                        <h4 className="text-xs font-black text-white uppercase mt-1 truncate max-w-[180px]">{activePack.setName}</h4>
                      </div>

                      {/* Pack Art Circle */}
                      <div className="relative h-28 w-28 flex items-center justify-center my-4">
                        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-yellow-500/20 via-amber-500/10 to-yellow-500/20 animate-spin border border-yellow-500/20 shadow-lg shadow-yellow-500/5"></div>
                        <div className="relative h-24 w-24 rounded-full overflow-hidden border-2 border-yellow-500/30 bg-slate-950 flex items-center justify-center">
                          {activePack.imageUrl && !failedImages[activePack.setName] ? (
                            <img src={activePack.imageUrl} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-yellow-500 font-extrabold text-xs">DUEL PACK</span>
                          )}
                        </div>
                      </div>

                      <div className="mb-4 text-center">
                        <span className="px-3 py-1 bg-yellow-500 text-slate-950 font-black text-[9px] rounded-lg tracking-widest uppercase shadow-md">{activePack.setCode || 'SET'}</span>
                        <p className="text-[8px] text-gray-500 mt-2">Dapatkan 9 Kartu Acak Set!</p>
                      </div>
                    </div>

                    <button
                      onClick={handleTearOpen}
                      className="mt-10 px-8 py-4 bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-slate-950 font-black rounded-2xl tracking-widest transition shadow-lg shadow-yellow-500/25 uppercase text-sm"
                    >
                      💥 SOBEK BOOSTER PACK
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* STAGE B: Tearing Pack Animation */}
            {packStatus === 'tearing' && (
              <div className="flex-1 flex flex-col items-center justify-center overflow-hidden relative">
                <div className="relative w-56 h-80 flex flex-col items-center justify-between">
                  {/* Top torn half sliding up */}
                  <div className="absolute top-0 w-full h-40 bg-gradient-to-b from-slate-900 to-slate-950 border border-yellow-500/20 rounded-t-2xl p-4 flex flex-col justify-start items-center animate-[slideUp_1.2s_forwards] border-b-0">
                    <span className="text-[8px] font-black text-yellow-500 uppercase mt-4">OFFICIAL BOOSTER</span>
                  </div>
                  {/* Glowing split lines */}
                  <div className="absolute top-1/2 -translate-y-1/2 w-full h-2 bg-yellow-400 shadow-[0_0_30px_#eab308] z-20 animate-ping"></div>
                  {/* Bottom torn half sliding down */}
                  <div className="absolute bottom-0 w-full h-40 bg-gradient-to-b from-slate-950 to-slate-900 border border-yellow-500/20 rounded-b-2xl p-4 flex flex-col justify-end items-center animate-[slideDown_1.2s_forwards] border-t-0">
                    <span className="px-3 py-1 bg-yellow-500 text-slate-950 font-black text-[9px] rounded-lg tracking-widest uppercase mb-4">{activePack.setCode || 'SET'}</span>
                  </div>
                </div>
                <div className="absolute inset-0 bg-yellow-500/10 pointer-events-none animate-pulse"></div>
              </div>
            )}

            {/* STAGE C: Opened Cards Revealed Grid */}
            {packStatus === 'opened' && (
              <div className="flex-1 flex flex-col justify-between items-center py-4">
                
                {/* 9 Card Grid Arena */}
                <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-3 w-full max-w-5xl px-4 items-center justify-center flex-1 my-auto">
                  {openedCards.map((card, i) => {
                    const isFlipped = flippedIndices[i]
                    const isUltraRare = card.drawnRarity && (card.drawnRarity.includes('Ultra') || card.drawnRarity.includes('Secret') || card.drawnRarity.includes('Ghost'))
                    const isSuperRare = card.drawnRarity && card.drawnRarity.includes('Super')

                    return (
                      <div 
                        key={i} 
                        onClick={() => toggleFlip(i)}
                        className="aspect-[3/4] relative cursor-pointer [perspective:1000px] select-none h-32 md:h-44 group"
                      >
                        <div className={`relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d] ${
                          isFlipped ? '[transform:rotateY(180deg)]' : ''
                        }`}>
                          
                          {/* Face Down Backside */}
                          <div className="absolute inset-0 w-full h-full rounded-lg border-2 border-amber-600/30 bg-cover bg-center shadow-xl [backface-visibility:hidden]"
                               style={{ backgroundImage: `url('https://images.ygoprodeck.com/images/cards/back.jpg')` }}>
                            {/* Neon glow hover sweep */}
                            <div className="absolute inset-0 bg-yellow-500/0 group-hover:bg-yellow-500/10 transition duration-300 rounded-lg"></div>
                          </div>

                          {/* Face Up Revealed card details */}
                          <div className={`absolute inset-0 w-full h-full rounded-lg overflow-hidden border shadow-2xl [backface-visibility:hidden] [transform:rotateY(180deg)] ${
                            isUltraRare ? 'border-amber-400 shadow-[0_0_15px_rgba(234,179,8,0.5)]' :
                            isSuperRare ? 'border-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.3)]' :
                            'border-slate-800'
                          }`}>
                            <img src={card.imageUrl} alt={card.name} className="w-full h-full object-cover" />
                            
                            {/* Foil shining sweeps for rare pulls */}
                            {(isUltraRare || isSuperRare) && (
                              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out pointer-events-none"></div>
                            )}

                            {/* Small hovering hover metadata tags */}
                            <div className="absolute inset-0 bg-slate-950/80 p-2 opacity-0 group-hover:opacity-100 transition duration-200 flex flex-col justify-between text-left">
                              <div>
                                <p className="text-[8px] font-black text-yellow-400 tracking-wide uppercase line-clamp-2">{card.name}</p>
                                <p className="text-[6px] text-gray-400 font-extrabold uppercase mt-0.5">{card.drawnRarity || 'Common'}</p>
                              </div>
                              <Link 
                                href={`/cards/${card.id}`}
                                className="w-full py-1 bg-yellow-500 text-slate-950 font-extrabold text-[7px] rounded text-center block uppercase mt-2 tracking-wider"
                              >
                                Detail Card
                              </Link>
                            </div>
                          </div>

                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Bottom Reveal controls */}
                <div className="flex flex-col sm:flex-row gap-3 mt-6 items-center">
                  <button
                    onClick={flipAllCards}
                    className="px-6 py-2.5 bg-slate-800 border border-slate-700 hover:bg-slate-750 text-white font-bold rounded-xl text-xs uppercase tracking-wider"
                  >
                    📖 Buka Semua Kartu
                  </button>
                  <button
                    onClick={() => handleOpenPackStart(activePack)}
                    className="px-6 py-2.5 bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-black rounded-xl text-xs uppercase tracking-wider shadow-lg shadow-yellow-500/10 flex items-center gap-1.5"
                  >
                    <RefreshCw size={13} />
                    <span>Buka Pack Lagi 🔄</span>
                  </button>
                </div>
              </div>
            )}

            {/* Modal Footer */}
            <div className="text-center px-4">
              <p className="text-[10px] text-gray-500">© 2026 YuGi Pedia Simulator • Didukung Basis Data Lokal PostgreSQL</p>
            </div>

          </div>
        </div>
      )}

      {/* Embedded CSS Keyframe Animations for tearing split cards */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-8px) rotate(0.5deg); }
        }
        @keyframes slideUp {
          to { transform: translateY(-300px); opacity: 0; }
        }
        @keyframes slideDown {
          to { transform: translateY(300px); opacity: 0; }
        }
      `}</style>
    </main>
  )
}
