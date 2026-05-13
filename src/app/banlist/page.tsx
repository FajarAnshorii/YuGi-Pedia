'use client'

import { useState, useEffect, useMemo } from 'react'
import Navbar from '@/components/Navbar'
import { Search, AlertTriangle, ShieldAlert, Sparkles, X, ArrowRight, Info } from 'lucide-react'
import Link from 'next/link'

export default function BanlistPage() {
  const [format, setFormat] = useState<'tcg' | 'ocg' | 'goat'>('tcg')
  const [forbidden, setForbidden] = useState<any[]>([])
  const [limited, setLimited] = useState<any[]>([])
  const [semiLimited, setSemiLimited] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  // Selected card preview modal
  const [selectedCard, setSelectedCard] = useState<any>(null)

  useEffect(() => {
    setLoading(true)
    setError(false)
    fetch(`/api/banlist?format=${format}`)
      .then(res => {
        if (!res.ok) throw new Error()
        return res.json()
      })
      .then(data => {
        setForbidden(data.forbidden || [])
        setLimited(data.limited || [])
        setSemiLimited(data.semiLimited || [])
        setLoading(false)
      })
      .catch(err => {
        console.error('Failed to load banlist:', err)
        setError(true)
        setLoading(false)
      })
  }, [format])

  // Filter lists based on Search Query
  const filteredForbidden = useMemo(() => {
    return forbidden.filter(card => card.name.toLowerCase().includes(searchQuery.toLowerCase()))
  }, [forbidden, searchQuery])

  const filteredLimited = useMemo(() => {
    return limited.filter(card => card.name.toLowerCase().includes(searchQuery.toLowerCase()))
  }, [limited, searchQuery])

  const filteredSemiLimited = useMemo(() => {
    return semiLimited.filter(card => card.name.toLowerCase().includes(searchQuery.toLowerCase()))
  }, [semiLimited, searchQuery])

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-250">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        {/* Title */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-yellow-500 text-xs font-black uppercase tracking-widest bg-yellow-500/10 border border-yellow-500/20 px-3 py-1 rounded-full">Turnamen Hub</span>
          <h1 className="text-3xl md:text-4xl font-black uppercase tracking-wider mt-3 mb-2 yugioh-glow-text">🚫 Official Banlist Hub</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base leading-relaxed">Daftar kartu terlarang, terbatas, dan setengah terbatas resmi Konami untuk format TCG, OCG, dan format klasik GOAT.</p>
        </div>

        {/* Format Switcher & Search Bar */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-5 rounded-3xl shadow-xl flex flex-col md:flex-row gap-4 items-center mb-8">
          {/* Formats Tabs */}
          <div className="flex bg-slate-100 dark:bg-slate-950 p-1.5 rounded-2xl w-full md:w-auto">
            <button
              onClick={() => setFormat('tcg')}
              className={`flex-1 md:flex-none px-6 py-2.5 rounded-xl text-xs font-bold transition uppercase tracking-wider ${
                format === 'tcg'
                  ? 'bg-gradient-to-r from-yellow-500 to-yellow-400 text-slate-950 shadow-md'
                  : 'text-gray-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              TCG (Western)
            </button>
            <button
              onClick={() => setFormat('ocg')}
              className={`flex-1 md:flex-none px-6 py-2.5 rounded-xl text-xs font-bold transition uppercase tracking-wider ${
                format === 'ocg'
                  ? 'bg-gradient-to-r from-yellow-500 to-yellow-400 text-slate-950 shadow-md'
                  : 'text-gray-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              OCG (Asia)
            </button>
            <button
              onClick={() => setFormat('goat')}
              className={`flex-1 md:flex-none px-6 py-2.5 rounded-xl text-xs font-bold transition uppercase tracking-wider ${
                format === 'goat'
                  ? 'bg-gradient-to-r from-yellow-500 to-yellow-400 text-slate-950 shadow-md'
                  : 'text-gray-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              GOAT (Classic)
            </button>
          </div>

          {/* Search Box */}
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-yellow-500/70" size={16} />
            <input
              type="text"
              placeholder="Cari kartu terlarang (contoh: Pot of Greed, Raigeki, dsb)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-11 pl-11 pr-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 text-sm font-semibold focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500/30 transition duration-200"
            />
          </div>
        </div>

        {/* Content Stages */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="relative mb-4 h-24 w-24 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-2 border-dashed border-yellow-400/30 animate-[spin_10s_linear_infinite]"></div>
              <img src="/images/logo.png" alt="Loading..." className="h-20 w-20 animate-spin object-contain drop-shadow-[0_0_15px_rgba(234,179,8,0.5)]" />
            </div>
            <p className="text-gray-500 dark:text-gray-400 font-bold text-lg tracking-wider animate-pulse uppercase tracking-widest">Sinkronisasi Daftar Banlist...</p>
          </div>
        ) : error ? (
          <div className="text-center py-16 bg-red-500/5 rounded-3xl border border-red-500/10 max-w-lg mx-auto p-8">
            <div className="text-5xl mb-4">⚠️</div>
            <h3 className="text-lg font-bold text-red-500 mb-2">Gagal Menghubungkan ke API</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Tidak dapat menjangkau server data turnamen global. Silakan ulangi.</p>
            <button
              onClick={() => setFormat(format)}
              className="px-6 py-2 bg-yellow-500 hover:bg-yellow-400 text-slate-900 rounded-xl font-bold text-xs"
            >
              Coba Lagi
            </button>
          </div>
        ) : (
          <div className="space-y-12">

            {/* SEKSI 1: FORBIDDEN (BANNED - 0 COPIES) */}
            <div className="bg-white dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/60 rounded-3xl p-6 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-red-600"></div>
              <div className="flex items-center gap-3.5 mb-6">
                <div className="h-10 w-10 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 flex items-center justify-center">
                  <ShieldAlert size={20} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-red-500 uppercase tracking-wide">🚫 Forbidden (Kartu Terlarang)</h3>
                  <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">Kartu terlarang yang sama sekali tidak boleh dimasukkan ke dalam Deck Utama, Ekstra, maupun Samping (0 lembar).</p>
                </div>
              </div>

              {filteredForbidden.length === 0 ? (
                <p className="text-center py-8 text-sm text-gray-400 italic">Tidak ada kartu terlarang yang cocok.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {filteredForbidden.map(card => (
                    <div 
                      key={card.id}
                      onClick={() => setSelectedCard(card)}
                      className="group cursor-pointer p-2.5 bg-slate-50 dark:bg-slate-950/60 border dark:border-slate-850 rounded-2xl flex flex-row items-center gap-3 hover:border-red-500/30 transition shadow-inner"
                    >
                      <div className="w-11 h-16 rounded-md overflow-hidden bg-slate-900 flex-shrink-0 relative">
                        {card.croppedUrl ? (
                          <img src={card.croppedUrl} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[8px] text-gray-500">YGO</div>
                        )}
                        <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-transparent transition-colors"></div>
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-bold text-xs truncate group-hover:text-red-500 dark:group-hover:text-red-400 transition leading-snug">{card.name}</h4>
                        <p className="text-[8px] text-gray-400 font-mono mt-0.5">ID: {card.passcode}</p>
                        <p className="text-[7px] font-black text-red-500 mt-0.5 tracking-wider uppercase">Forbidden 0</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* SEKSI 2: LIMITED (MAX 1 COPY) */}
            <div className="bg-white dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/60 rounded-3xl p-6 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-orange-500"></div>
              <div className="flex items-center gap-3.5 mb-6">
                <div className="h-10 w-10 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-500 flex items-center justify-center">
                  <AlertTriangle size={20} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-orange-500 uppercase tracking-wide">⚠️ Limited 1 (Maksimal 1 Kartu)</h3>
                  <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">Kartu terbatas yang hanya boleh dimasukkan maksimal 1 lembar saja ke dalam gabungan seluruh susunan Deck.</p>
                </div>
              </div>

              {filteredLimited.length === 0 ? (
                <p className="text-center py-8 text-sm text-gray-400 italic">Tidak ada kartu terbatas yang cocok.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {filteredLimited.map(card => (
                    <div 
                      key={card.id}
                      onClick={() => setSelectedCard(card)}
                      className="group cursor-pointer p-2.5 bg-slate-50 dark:bg-slate-950/60 border dark:border-slate-850 rounded-2xl flex flex-row items-center gap-3 hover:border-orange-500/30 transition shadow-inner"
                    >
                      <div className="w-11 h-16 rounded-md overflow-hidden bg-slate-900 flex-shrink-0 relative">
                        {card.croppedUrl ? (
                          <img src={card.croppedUrl} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[8px] text-gray-500">YGO</div>
                        )}
                        <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-transparent transition-colors"></div>
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-bold text-xs truncate group-hover:text-orange-500 dark:group-hover:text-orange-400 transition leading-snug">{card.name}</h4>
                        <p className="text-[8px] text-gray-400 font-mono mt-0.5">ID: {card.passcode}</p>
                        <p className="text-[7px] font-black text-orange-500 mt-0.5 tracking-wider uppercase">Limited 1</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* SEKSI 3: SEMI-LIMITED (MAX 2 COPIES) */}
            <div className="bg-white dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/60 rounded-3xl p-6 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-yellow-500"></div>
              <div className="flex items-center gap-3.5 mb-6">
                <div className="h-10 w-10 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 flex items-center justify-center">
                  <Info size={20} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-yellow-500 uppercase tracking-wide">🟡 Semi-Limited 2 (Maksimal 2 Kartu)</h3>
                  <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">Kartu semi-terbatas yang boleh dimasukkan maksimal hingga 2 lembar saja di dalam susunan Deck.</p>
                </div>
              </div>

              {filteredSemiLimited.length === 0 ? (
                <p className="text-center py-8 text-sm text-gray-400 italic">Tidak ada kartu semi-terbatas yang cocok.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {filteredSemiLimited.map(card => (
                    <div 
                      key={card.id}
                      onClick={() => setSelectedCard(card)}
                      className="group cursor-pointer p-2.5 bg-slate-50 dark:bg-slate-950/60 border dark:border-slate-850 rounded-2xl flex flex-row items-center gap-3 hover:border-yellow-500/30 transition shadow-inner"
                    >
                      <div className="w-11 h-16 rounded-md overflow-hidden bg-slate-900 flex-shrink-0 relative">
                        {card.croppedUrl ? (
                          <img src={card.croppedUrl} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[8px] text-gray-500">YGO</div>
                        )}
                        <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-transparent transition-colors"></div>
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-bold text-xs truncate group-hover:text-yellow-500 transition leading-snug">{card.name}</h4>
                        <p className="text-[8px] text-gray-400 font-mono mt-0.5">ID: {card.passcode}</p>
                        <p className="text-[7px] font-black text-yellow-500 mt-0.5 tracking-wider uppercase">Semi-Limited 2</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}
      </div>

      {/* QUICK PREVIEW DRAWER MODAL */}
      {selectedCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col sm:flex-row gap-6">
            <button
              onClick={() => setSelectedCard(null)}
              className="absolute top-4 right-4 p-2 bg-slate-800 hover:bg-slate-750 text-gray-400 hover:text-white rounded-full transition"
            >
              <X size={16} />
            </button>

            {/* Artwork Card */}
            <div className="w-full sm:w-44 aspect-[3/4] rounded-2xl overflow-hidden shadow-xl bg-slate-950 border border-slate-800 flex-shrink-0 flex items-center justify-center mx-auto">
              {selectedCard.imageUrl ? (
                <img src={selectedCard.imageUrl} alt={selectedCard.name} className="w-full h-full object-contain" />
              ) : (
                <span className="text-yellow-500 font-bold">Image Unavailable</span>
              )}
            </div>

            {/* Specs detail content */}
            <div className="flex-1 text-center sm:text-left flex flex-col justify-between">
              <div>
                <span className="text-[9px] font-bold tracking-widest text-yellow-400 uppercase bg-yellow-500/10 border border-yellow-500/20 px-2 py-0.5 rounded">Status Detail</span>
                <h3 className="text-xl font-black text-white uppercase tracking-wide mt-2 mb-1">{selectedCard.name}</h3>
                <p className="text-[10px] text-gray-400 font-mono mb-4">Passcode ID: {selectedCard.passcode}</p>

                {/* Description */}
                <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-850 max-h-40 overflow-y-auto mb-4 text-left">
                  <p className="text-xs text-gray-300 leading-relaxed whitespace-pre-line">{selectedCard.description || 'Tidak ada deskripsi efek.'}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2.5">
                <button
                  onClick={() => setSelectedCard(null)}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-300 font-bold rounded-xl text-xs transition flex-1"
                >
                  Tutup Preview
                </button>
                <Link
                  href={`/album?search=${encodeURIComponent(selectedCard.name)}`}
                  className="px-4 py-2.5 bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-black rounded-xl text-xs transition flex-1 flex items-center justify-center gap-1"
                >
                  <span>Cari di Album</span>
                  <ArrowRight size={12} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
