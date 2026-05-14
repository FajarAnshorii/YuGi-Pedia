'use client'

import { useState, useEffect } from 'react'
import Navbar from '@/components/Navbar'
import { Search, X, BarChart3, TrendingDown, Swords, Shield, Sparkles } from 'lucide-react'
import Link from 'next/link'

export default function ComparePage() {
  const [slots, setSlots] = useState<Record<number, any>>({ 1: null, 2: null, 3: null })
  
  // Autocomplete search states
  const [searchQueries, setSearchQueries] = useState<Record<number, string>>({ 1: '', 2: '', 3: '' })
  const [searchResults, setSearchResults] = useState<Record<number, any[]>>({ 1: [], 2: [], 3: [] })
  const [activeSearchSlot, setActiveSearchSlot] = useState<number | null>(null)
  const [isSearching, setIsSearching] = useState(false)

  // Real-time search handler for each slot
  const handleSearchChange = async (slotId: number, query: string) => {
    setSearchQueries(prev => ({ ...prev, [slotId]: query }))
    
    if (query.trim().length < 2) {
      setSearchResults(prev => ({ ...prev, [slotId]: [] }))
      return
    }

    setIsSearching(true)
    setActiveSearchSlot(slotId)

    try {
      const res = await fetch(`/api/cards?search=${encodeURIComponent(query)}&limit=5`)
      const data = await res.json()
      if (data && Array.isArray(data.cards)) {
        setSearchResults(prev => ({ ...prev, [slotId]: data.cards }))
      }
    } catch (err) {
      console.error('Failed to query cards for comparison:', err)
    } finally {
      setIsSearching(false)
    }
  }

  // Choose card for comparison slot
  const selectCardForSlot = (slotId: number, card: any) => {
    setSlots(prev => ({ ...prev, [slotId]: card }))
    setSearchQueries(prev => ({ ...prev, [slotId]: '' }))
    setSearchResults(prev => ({ ...prev, [slotId]: [] }))
    setActiveSearchSlot(null)
  }

  // Remove card from slot
  const removeCardFromSlot = (slotId: number) => {
    setSlots(prev => ({ ...prev, [slotId]: null }))
  }

  // Helper values to highlight the highest ATK / DEF
  const highestAtk = Math.max(
    ...Object.values(slots)
      .map(card => card && typeof card.attack === 'number' ? card.attack : -1)
  )

  const highestDef = Math.max(
    ...Object.values(slots)
      .map(card => card && typeof card.defense === 'number' ? card.defense : -1)
  )

  // Helper values to highlight the cheapest card
  const lowestPrice = Math.min(
    ...Object.values(slots)
      .map(card => card && typeof card.tcgPlayerPrice === 'number' ? card.tcgPlayerPrice : Infinity)
  )

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-250">
      <Navbar />

      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8 max-w-7xl">
        {/* Title */}
        <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-10">
          <span className="text-yellow-500 text-[9px] sm:text-xs font-black uppercase tracking-widest bg-yellow-500/10 border border-yellow-500/20 px-2.5 py-1 rounded-full">Duelist Analisis</span>
          <h1 className="text-xl sm:text-4xl font-black uppercase tracking-wider mt-2 mb-1.5 yugioh-glow-text">🆚 Card Comparer</h1>
          <p className="text-gray-500 dark:text-gray-400 text-[10px] sm:text-base leading-relaxed opacity-80">Bandingkan statistik, efek, dan harga hingga 3 kartu sekaligus.</p>
        </div>

        {/* 3 Input Search Slots */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-6 mb-8 sm:mb-10">
          {[1, 2, 3].map(slotId => (
            <div key={slotId} className="relative bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl shadow-xl flex flex-col justify-between">
              
              {!slots[slotId] ? (
                <div>
                  <label className="text-[9px] sm:text-xs font-extrabold uppercase tracking-widest text-yellow-500 mb-2 block">Slot Pemilihan {slotId}</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-yellow-500/70" size={13} />
                    <input
                      type="text"
                      placeholder="Cari kartu..."
                      value={searchQueries[slotId]}
                      onChange={(e) => handleSearchChange(slotId, e.target.value)}
                      onFocus={() => setActiveSearchSlot(slotId)}
                      className="w-full h-9 sm:h-11 pl-9 pr-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 text-[11px] sm:text-sm font-semibold focus:outline-none focus:border-yellow-500 transition duration-200"
                    />
                  </div>

                  {/* Autocomplete Suggestions Panel */}
                  {activeSearchSlot === slotId && searchResults[slotId].length > 0 && (
                    <div className="absolute left-0 right-0 mt-2 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl z-30 overflow-hidden divide-y divide-slate-850">
                      {searchResults[slotId].map(card => (
                        <div
                          key={card.id}
                          onClick={() => selectCardForSlot(slotId, card)}
                          className="p-2.5 sm:p-3 hover:bg-slate-800 cursor-pointer flex items-center gap-3 transition"
                        >
                          <img src={card.imageUrl} alt="" className="w-7 h-10 sm:w-8 sm:h-11 object-cover rounded shadow" />
                          <div className="min-w-0">
                            <p className="text-[10px] sm:text-xs font-bold text-white truncate">{card.name}</p>
                            <p className="text-[8px] sm:text-[9px] text-gray-400 font-mono mt-0.5 uppercase">{card.subType || 'Monster'}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-950 p-2 sm:p-3 rounded-xl sm:rounded-2xl border dark:border-slate-850">
                  <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0">
                    <img src={slots[slotId].imageUrl} alt="" className="w-8 h-11 sm:w-10 sm:h-14 object-cover rounded shadow-lg" />
                    <div className="min-w-0">
                      <p className="font-extrabold text-[11px] sm:text-sm text-slate-900 dark:text-white truncate">{slots[slotId].name}</p>
                      <p className="text-[9px] sm:text-[10px] text-gray-400 font-mono mt-0.5 uppercase">{slots[slotId].subType || 'Card'}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeCardFromSlot(slotId)}
                    className="p-1.5 sm:p-2 bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white rounded-full transition shrink-0"
                  >
                    <X size={12} />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

                  {/* Autocomplete Suggestions Panel */}
                  {activeSearchSlot === slotId && searchResults[slotId].length > 0 && (
                    <div className="absolute left-5 right-5 mt-2 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl z-30 overflow-hidden divide-y divide-slate-850">
                      {searchResults[slotId].map(card => (
                        <div
                          key={card.id}
                          onClick={() => selectCardForSlot(slotId, card)}
                          className="p-3 hover:bg-slate-800 cursor-pointer flex items-center gap-3 transition"
                        >
                          <img src={card.imageUrl} alt="" className="w-8 h-11 object-cover rounded shadow" />
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-white truncate">{card.name}</p>
                            <p className="text-[9px] text-gray-400 font-mono mt-0.5 uppercase">{card.subType || 'Monster'}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-950 p-3 rounded-2xl border dark:border-slate-850">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <img src={slots[slotId].imageUrl} alt="" className="w-10 h-14 object-cover rounded shadow-lg" />
                    <div className="min-w-0">
                      <p className="font-extrabold text-sm text-slate-900 dark:text-white truncate">{slots[slotId].name}</p>
                      <p className="text-[10px] text-gray-400 font-mono mt-0.5 uppercase">{slots[slotId].subType || 'Card'}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeCardFromSlot(slotId)}
                    className="p-2 bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white rounded-full transition shrink-0"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Comparison Matrix Table */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden relative">
          
          <div className="overflow-x-auto scrollbar-hide">
            <table className="w-full text-left border-collapse table-fixed min-w-[600px] sm:min-w-[800px]">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-950 text-[10px] sm:text-xs font-black uppercase tracking-widest text-gray-500 border-b border-slate-200 dark:border-slate-850">
                  <th className="p-3 sm:p-5 w-32 sm:w-48 text-yellow-500 sticky left-0 z-20 bg-slate-100 dark:bg-slate-950">
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <BarChart3 size={13} className="sm:size-[15px]" />
                      <span>Atribut Matrix</span>
                    </div>
                  </th>
                  <th className="p-3 sm:p-5 w-40 sm:w-64 border-l border-slate-200 dark:border-slate-850">Slot 1</th>
                  <th className="p-3 sm:p-5 w-40 sm:w-64 border-l border-slate-200 dark:border-slate-850">Slot 2</th>
                  <th className="p-3 sm:p-5 w-40 sm:w-64 border-l border-slate-200 dark:border-slate-850">Slot 3</th>
                </tr>
              </thead>
              <tbody className="text-sm font-semibold tracking-wide divide-y divide-slate-150 dark:divide-slate-850/60">
                
                {/* 1. Illustration Row */}
                <tr className="group">
                  <td className="p-3 sm:p-5 font-bold uppercase tracking-wider text-[9px] sm:text-xs text-gray-400 sticky left-0 z-10 bg-white dark:bg-slate-900 group-hover:bg-slate-50 dark:group-hover:bg-slate-850 transition-colors">Ilustrasi</td>
                  {[1, 2, 3].map(slotId => (
                    <td key={slotId} className="p-3 sm:p-5 border-l border-slate-150 dark:border-slate-850/60 align-middle">
                      {slots[slotId] ? (
                        <div className="w-24 h-36 sm:w-36 sm:h-52 mx-auto rounded-lg sm:rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 transition duration-300">
                          <img src={slots[slotId].imageUrl} alt={slots[slotId].name} className="w-full h-full object-contain" />
                        </div>
                      ) : (
                        <div className="w-24 h-36 sm:w-36 sm:h-52 mx-auto rounded-lg sm:rounded-xl border border-dashed border-slate-300 dark:border-slate-800 flex flex-col items-center justify-center text-gray-400">
                          <span className="text-lg sm:text-xl">🎴</span>
                          <span className="text-[8px] sm:text-[10px] uppercase font-bold mt-2">Kosong</span>
                        </div>
                      )}
                    </td>
                  ))}
                </tr>

                {/* 2. Name & Type */}
                <tr className="group">
                  <td className="p-3 sm:p-5 font-bold uppercase tracking-wider text-[9px] sm:text-xs text-gray-400 sticky left-0 z-10 bg-white dark:bg-slate-900 group-hover:bg-slate-50 dark:group-hover:bg-slate-850 transition-colors">Nama Lengkap</td>
                  {[1, 2, 3].map(slotId => (
                    <td key={slotId} className="p-3 sm:p-5 border-l border-slate-150 dark:border-slate-850/60 font-black text-slate-900 dark:text-amber-100/90 text-center sm:text-left text-[11px] sm:text-sm">
                      {slots[slotId] ? slots[slotId].name : '-'}
                    </td>
                  ))}
                </tr>

                {/* 3. Attribute */}
                <tr className="group">
                  <td className="p-3 sm:p-5 font-bold uppercase tracking-wider text-[9px] sm:text-xs text-gray-400 sticky left-0 z-10 bg-white dark:bg-slate-900 group-hover:bg-slate-50 dark:group-hover:bg-slate-850 transition-colors">Attribute</td>
                  {[1, 2, 3].map(slotId => {
                    const attr = slots[slotId]?.attribute?.name
                    return (
                      <td key={slotId} className="p-3 sm:p-5 border-l border-slate-150 dark:border-slate-850/60">
                        {attr ? (
                          <span className="px-2 py-0.5 sm:px-3 sm:py-1 bg-slate-100 dark:bg-slate-950 rounded-lg border dark:border-slate-800 font-bold flex items-center gap-1 sm:gap-1.5 w-max text-[10px] sm:text-xs">
                            {attr === 'FIRE' && '🔥'}
                            {attr === 'WATER' && '💧'}
                            {attr === 'EARTH' && '🌍'}
                            {attr === 'WIND' && '💨'}
                            {attr === 'LIGHT' && '☀️'}
                            {attr === 'DARK' && '🌑'}
                            {attr === 'DIVINE' && '⭐'}
                            <span>{attr}</span>
                          </span>
                        ) : '-'}
                      </td>
                    )
                  })}
                </tr>

                {/* 4. Race */}
                <tr className="group">
                  <td className="p-3 sm:p-5 font-bold uppercase tracking-wider text-[9px] sm:text-xs text-gray-400 sticky left-0 z-10 bg-white dark:bg-slate-900 group-hover:bg-slate-50 dark:group-hover:bg-slate-850 transition-colors">Race / Tipe</td>
                  {[1, 2, 3].map(slotId => (
                    <td key={slotId} className="p-3 sm:p-5 border-l border-slate-150 dark:border-slate-850/60 text-[11px] sm:text-sm">
                      {slots[slotId]?.race?.name || '-'}
                    </td>
                  ))}
                </tr>

                {/* 5. Level / Rank */}
                <tr className="group">
                  <td className="p-3 sm:p-5 font-bold uppercase tracking-wider text-[9px] sm:text-xs text-gray-400 sticky left-0 z-10 bg-white dark:bg-slate-900 group-hover:bg-slate-50 dark:group-hover:bg-slate-850 transition-colors">Level / Rank</td>
                  {[1, 2, 3].map(slotId => (
                    <td key={slotId} className="p-3 sm:p-5 border-l border-slate-150 dark:border-slate-850/60 font-black text-yellow-500 text-[11px] sm:text-sm">
                      {slots[slotId]?.level ? `★ ${slots[slotId].level}` : slots[slotId]?.rank ? `☆ ${slots[slotId].rank}` : '-'}
                    </td>
                  ))}
                </tr>

                {/* 6. Attack ATK */}
                <tr className="group">
                  <td className="p-3 sm:p-5 font-bold uppercase tracking-wider text-[9px] sm:text-xs text-gray-400 sticky left-0 z-10 bg-white dark:bg-slate-900 group-hover:bg-slate-50 dark:group-hover:bg-slate-850 transition-colors">ATK</td>
                  {[1, 2, 3].map(slotId => {
                    const card = slots[slotId]
                    const isHighest = card && typeof card.attack === 'number' && card.attack === highestAtk && highestAtk > 0
                    return (
                      <td key={slotId} className="p-3 sm:p-5 border-l border-slate-150 dark:border-slate-850/60">
                        {card && typeof card.attack === 'number' ? (
                          <span className={`px-2 py-1 sm:px-4 sm:py-1.5 rounded-lg sm:rounded-xl font-black text-[10px] sm:text-sm inline-flex items-center gap-1 sm:gap-1.5 ${
                            isHighest 
                              ? 'bg-yellow-500 text-slate-950 shadow-lg shadow-yellow-500/25 border border-yellow-400 animate-pulse' 
                              : 'bg-red-500/10 text-red-500 border border-red-500/20'
                          }`}>
                            <Swords size={11} className="sm:size-[13px]" />
                            <span>{card.attack}</span>
                            {isHighest && <Sparkles size={10} className="sm:size-[11px]" />}
                          </span>
                        ) : '-'}
                      </td>
                    )
                  })}
                </tr>

                {/* 7. Defense DEF */}
                <tr className="group">
                  <td className="p-3 sm:p-5 font-bold uppercase tracking-wider text-[9px] sm:text-xs text-gray-400 sticky left-0 z-10 bg-white dark:bg-slate-900 group-hover:bg-slate-50 dark:group-hover:bg-slate-850 transition-colors">DEF</td>
                  {[1, 2, 3].map(slotId => {
                    const card = slots[slotId]
                    const isHighest = card && typeof card.defense === 'number' && card.defense === highestDef && highestDef > 0
                    return (
                      <td key={slotId} className="p-3 sm:p-5 border-l border-slate-150 dark:border-slate-850/60">
                        {card && typeof card.defense === 'number' ? (
                          <span className={`px-2 py-1 sm:px-4 sm:py-1.5 rounded-lg sm:rounded-xl font-black text-[10px] sm:text-sm inline-flex items-center gap-1 sm:gap-1.5 ${
                            isHighest 
                              ? 'bg-green-500 text-slate-950 shadow-lg shadow-green-500/25 border border-green-400' 
                              : 'bg-blue-500/10 text-blue-500 border border-blue-500/20'
                          }`}>
                            <Shield size={11} className="sm:size-[13px]" />
                            <span>{card.defense}</span>
                          </span>
                        ) : '-'}
                      </td>
                    )
                  })}
                </tr>

                {/* 8. Price */}
                <tr className="group">
                  <td className="p-3 sm:p-5 font-bold uppercase tracking-wider text-[9px] sm:text-xs text-gray-400 sticky left-0 z-10 bg-white dark:bg-slate-900 group-hover:bg-slate-50 dark:group-hover:bg-slate-850 transition-colors">Harga</td>
                  {[1, 2, 3].map(slotId => {
                    const card = slots[slotId]
                    const isCheapest = card && typeof card.tcgPlayerPrice === 'number' && card.tcgPlayerPrice === lowestPrice && lowestPrice !== Infinity
                    return (
                      <td key={slotId} className="p-3 sm:p-5 border-l border-slate-150 dark:border-slate-850/60">
                        {card && typeof card.tcgPlayerPrice === 'number' ? (
                          <span className={`px-2 py-0.5 sm:px-3 sm:py-1 rounded-md sm:rounded-lg font-black text-[10px] sm:text-xs inline-flex items-center gap-1 ${
                            isCheapest 
                              ? 'bg-emerald-500 text-slate-950 font-black' 
                              : 'bg-slate-100 dark:bg-slate-950 border dark:border-slate-800'
                          }`}>
                            {isCheapest && <TrendingDown size={11} className="sm:size-[12px]" />}
                            <span>${card.tcgPlayerPrice.toFixed(2)}</span>
                          </span>
                        ) : '-'}
                      </td>
                    )
                  })}
                </tr>

                {/* 9. Description / Effect */}
                <tr className="group">
                  <td className="p-3 sm:p-5 font-bold uppercase tracking-wider text-[9px] sm:text-xs text-gray-400 sticky left-0 z-10 bg-white dark:bg-slate-900 group-hover:bg-slate-50 dark:group-hover:bg-slate-850 transition-colors">Efek</td>
                  {[1, 2, 3].map(slotId => (
                    <td key={slotId} className="p-3 sm:p-5 border-l border-slate-150 dark:border-slate-850/60 text-[10px] sm:text-xs leading-relaxed max-w-sm align-top">
                      {slots[slotId]?.description ? (
                        <p className="whitespace-pre-line text-gray-600 dark:text-gray-300 leading-relaxed font-medium line-clamp-[12]">{slots[slotId].description}</p>
                      ) : '-'}
                    </td>
                  ))}
                </tr>

              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  )
}
