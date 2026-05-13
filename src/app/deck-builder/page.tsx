'use client'

import { useState, useEffect } from 'react'
import Navbar from '@/components/Navbar'
import { Search, X, Plus, Trash2, Download, RefreshCw, Layers, Sparkles, AlertCircle } from 'lucide-react'
import Link from 'next/link'

export default function DeckBuilderPage() {
  const [mainDeck, setMainDeck] = useState<any[]>([])
  const [extraDeck, setExtraDeck] = useState<any[]>([])
  const [sideDeck, setSideDeck] = useState<any[]>([])

  // Search state
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [filterType, setFilterType] = useState<'all' | 'monster' | 'spell' | 'trap'>('all')

  // Load saved deck from localStorage on mount
  useEffect(() => {
    const savedMain = localStorage.getItem('ygo_deck_main')
    const savedExtra = localStorage.getItem('ygo_deck_extra')
    const savedSide = localStorage.getItem('ygo_deck_side')

    if (savedMain) setMainDeck(JSON.parse(savedMain))
    if (savedExtra) setExtraDeck(JSON.parse(savedExtra))
    if (savedSide) setSideDeck(JSON.parse(savedSide))
  }, [])

  // Persist deck changes
  const saveDeckToStorage = (main: any[], extra: any[], side: any[]) => {
    localStorage.setItem('ygo_deck_main', JSON.stringify(main))
    localStorage.setItem('ygo_deck_extra', JSON.stringify(extra))
    localStorage.setItem('ygo_deck_side', JSON.stringify(side))
  };

  // Card search
  const handleSearch = async (query: string, type = filterType) => {
    setSearchQuery(query)
    setFilterType(type)

    if (query.trim().length < 2) {
      setSearchResults([])
      return
    }

    setIsSearching(true)
    try {
      // Build filters
      let url = `/api/cards?search=${encodeURIComponent(query)}&limit=12`
      const res = await fetch(url)
      const data = await res.json()
      if (data && Array.isArray(data.cards)) {
        let cards = data.cards
        if (type !== 'all') {
          cards = cards.filter((c: any) => {
            const cardType = c.type?.name?.toLowerCase() || ''
            if (type === 'monster') return cardType.includes('monster')
            if (type === 'spell') return cardType.includes('spell')
            if (type === 'trap') return cardType.includes('trap')
            return true
          })
        }
        setSearchResults(cards)
      }
    } catch (err) {
      console.error('Error fetching cards for deck builder:', err)
    } finally {
      setIsSearching(false)
    }
  }

  // Count copies of a card in the entire deck list (Main + Extra + Side)
  const countCardCopies = (passcode: string) => {
    const countMain = mainDeck.filter(c => c.passcode === passcode).length
    const countExtra = extraDeck.filter(c => c.passcode === passcode).length
    const countSide = sideDeck.filter(c => c.passcode === passcode).length
    return countMain + countExtra + countSide
  }

  // Add Card to specific sub-deck
  const addCard = (card: any, target: 'main' | 'extra' | 'side') => {
    const copies = countCardCopies(card.passcode)
    if (copies >= 3) {
      alert(`⚠️ Aturan Konami: Maksimal hanya diperbolehkan 3 salinan untuk kartu yang sama ("${card.name}") dalam satu susunan Deck!`)
      return
    }

    // Verify rules limits
    if (target === 'main') {
      if (mainDeck.length >= 60) {
        alert('⚠️ Main Deck tidak boleh melebihi batas maksimal rilis 60 kartu!')
        return
      }
      const newMain = [...mainDeck, card]
      setMainDeck(newMain)
      saveDeckToStorage(newMain, extraDeck, sideDeck)
    } else if (target === 'extra') {
      // Rule: Extra Deck can only contain Fusion, Synchro, Xyz, Link, etc.
      const typeName = card.type?.name?.toLowerCase() || ''
      const isExtraType = typeName.includes('fusion') || typeName.includes('synchro') || typeName.includes('xyz') || typeName.includes('link') || typeName.includes('xyz')
      
      if (!isExtraType) {
        alert('⚠️ Extra Deck hanya boleh diisi oleh kartu berjenis Fusion, Synchro, Xyz, atau Link Monster!')
        return
      }
      if (extraDeck.length >= 15) {
        alert('⚠️ Extra Deck tidak boleh melebihi batas maksimal rilis 15 kartu!')
        return
      }
      const newExtra = [...extraDeck, card]
      setExtraDeck(newExtra)
      saveDeckToStorage(mainDeck, newExtra, sideDeck)
    } else if (target === 'side') {
      if (sideDeck.length >= 15) {
        alert('⚠️ Side Deck tidak boleh melebihi batas maksimal rilis 15 kartu!')
        return
      }
      const newSide = [...sideDeck, card]
      setSideDeck(newSide)
      saveDeckToStorage(mainDeck, extraDeck, newSide)
    }
  }

  // Remove Card by Index
  const removeCard = (index: number, target: 'main' | 'extra' | 'side') => {
    if (target === 'main') {
      const newMain = mainDeck.filter((_, i) => i !== index)
      setMainDeck(newMain)
      saveDeckToStorage(newMain, extraDeck, sideDeck)
    } else if (target === 'extra') {
      const newExtra = extraDeck.filter((_, i) => i !== index)
      setExtraDeck(newExtra)
      saveDeckToStorage(mainDeck, newExtra, sideDeck)
    } else if (target === 'side') {
      const newSide = sideDeck.filter((_, i) => i !== index)
      setSideDeck(newSide)
      saveDeckToStorage(mainDeck, extraDeck, newSide)
    }
  }

  // Clear Deck
  const clearAllDecks = () => {
    if (window.confirm('Apakah Anda yakin ingin menghapus seluruh susunan deck yang sedang dibangun?')) {
      setMainDeck([])
      setExtraDeck([])
      setSideDeck([])
      saveDeckToStorage([], [], [])
    }
  }

  // Generate random playable deck from database
  const generateRandomDeck = async () => {
    setIsSearching(true)
    try {
      const res = await fetch('/api/booster-pack/open?setName=Legend of Blue Eyes White Dragon')
      const data1 = await res.json()
      
      const res2 = await fetch('/api/booster-pack/open?setName=Metal Raiders')
      const data2 = await res2.json()

      const combinedCards = [...(data1.cards || []), ...(data2.cards || [])]
      
      // Separate extra vs main
      const randomMain: any[] = []
      const randomExtra: any[] = []

      combinedCards.forEach((card: any) => {
        const typeName = card.type?.name?.toLowerCase() || ''
        const isExtra = typeName.includes('fusion') || typeName.includes('synchro') || typeName.includes('xyz') || typeName.includes('link')
        
        if (isExtra && randomExtra.length < 5) {
          randomExtra.push(card)
        } else if (!isExtra && randomMain.length < 40) {
          randomMain.push(card)
        }
      })

      setMainDeck(randomMain)
      setExtraDeck(randomExtra)
      setSideDeck([])
      saveDeckToStorage(randomMain, randomExtra, [])
    } catch (err) {
      console.error('Failed to generate sample random deck:', err)
    } finally {
      setIsSearching(false)
    }
  }

  // Export to official .YDK format file
  const exportToYDK = () => {
    if (mainDeck.length === 0) {
      alert('Tambahkan kartu ke Main Deck terlebih dahulu sebelum mengekspor file .ydk!')
      return
    }

    let ydkContent = '#created by yugi-pedia custom deck builder\n#main\n'
    mainDeck.forEach(card => {
      ydkContent += `${card.passcode || card.id}\n`
    })
    ydkContent += '#extra\n'
    extraDeck.forEach(card => {
      ydkContent += `${card.passcode || card.id}\n`
    })
    ydkContent += '!side\n'
    sideDeck.forEach(card => {
      ydkContent += `${card.passcode || card.id}\n`
    })

    const blob = new Blob([ydkContent], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'deck_yugipedia.ydk'
    link.click()
  }

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-250">
      <Navbar />

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <span className="text-yellow-500 text-xs font-black uppercase tracking-widest bg-yellow-500/10 border border-yellow-500/20 px-3 py-1 rounded-full">Fasilitas Dek</span>
            <h1 className="text-3xl font-black uppercase mt-3 mb-1 tracking-wider yugioh-glow-text flex items-center gap-2">🛠️ Interactive Deck Builder</h1>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Rakit deck impian Anda, patuhi regulasi resmi 3-kartu, dan unduh sebagai file `.ydk` yang kompatibel dengan simulator global.</p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={generateRandomDeck}
              className="px-4 py-2 bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 border dark:border-slate-800 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
            >
              <RefreshCw size={14} />
              <span>Acak Deck 🎲</span>
            </button>
            <button
              onClick={clearAllDecks}
              className="px-4 py-2 bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5"
            >
              <Trash2 size={14} />
              <span>Bersihkan 🧹</span>
            </button>
            <button
              onClick={exportToYDK}
              className="px-4 py-2 bg-yellow-500 hover:bg-yellow-400 text-slate-950 rounded-xl text-xs font-black transition flex items-center gap-1.5 shadow-md shadow-yellow-500/10"
            >
              <Download size={14} />
              <span>Ekspor .YDK 📥</span>
            </button>
          </div>
        </div>

        {/* Workspace Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* PANEL KIRI: CARI KARTU (4 Kolom) */}
          <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-5 rounded-3xl shadow-xl space-y-5">
            <h2 className="text-base font-black uppercase tracking-wider text-slate-900 dark:text-amber-100/95 flex items-center gap-2">🔍 Cari & Tambah Kartu</h2>
            
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-yellow-500/70" size={15} />
              <input
                type="text"
                placeholder="Ketik minimal 2 karakter..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value, filterType)}
                className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-850 dark:text-slate-100 text-sm font-semibold focus:outline-none focus:border-yellow-500 transition duration-200"
              />
            </div>

            {/* Sub-type Filters */}
            <div className="flex bg-slate-50 dark:bg-slate-950 p-1 rounded-xl">
              {(['all', 'monster', 'spell', 'trap'] as const).map(type => (
                <button
                  key={type}
                  onClick={() => handleSearch(searchQuery, type)}
                  className={`flex-1 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition ${
                    filterType === type
                      ? 'bg-yellow-500 text-slate-950 font-black'
                      : 'text-gray-400 hover:text-slate-700 dark:hover:text-slate-300'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>

            {/* Results Grid Scrollable */}
            <div className="max-h-[500px] overflow-y-auto divide-y divide-slate-100 dark:divide-slate-850/60 pr-1">
              {isSearching ? (
                <div className="flex flex-col items-center py-10">
                  <div className="w-6 h-6 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : searchResults.length === 0 ? (
                <p className="text-center py-10 text-xs text-gray-400 font-semibold italic uppercase tracking-wider">Gunakan kolom di atas untuk mencari kartu</p>
              ) : (
                searchResults.map(card => {
                  const copiesCount = countCardCopies(card.passcode)
                  return (
                    <div key={card.id} className="py-3 flex justify-between items-center gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <img src={card.imageUrl} alt="" className="w-9 h-13 object-cover rounded shadow flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="font-extrabold text-xs text-slate-900 dark:text-white truncate">{card.name}</p>
                          <p className="text-[9px] text-gray-400 font-mono uppercase mt-0.5">{card.subType || 'Monster'}</p>
                          <p className="text-[8px] font-semibold text-yellow-600 dark:text-yellow-500 mt-0.5">Milik: {copiesCount}/3</p>
                        </div>
                      </div>

                      {/* Quick-add zones buttons */}
                      <div className="flex gap-1 shrink-0">
                        <button
                          onClick={() => addCard(card, 'main')}
                          className="px-2 py-1 bg-slate-100 hover:bg-yellow-500 dark:bg-slate-950 dark:hover:bg-yellow-500 hover:text-slate-950 rounded text-[9px] font-black uppercase transition border dark:border-slate-850"
                        >
                          +Main
                        </button>
                        <button
                          onClick={() => addCard(card, 'extra')}
                          className="px-2 py-1 bg-slate-100 hover:bg-yellow-500 dark:bg-slate-950 dark:hover:bg-yellow-500 hover:text-slate-950 rounded text-[9px] font-black uppercase transition border dark:border-slate-850"
                        >
                          +Extra
                        </button>
                        <button
                          onClick={() => addCard(card, 'side')}
                          className="px-2 py-1 bg-slate-100 hover:bg-yellow-500 dark:bg-slate-950 dark:hover:bg-yellow-500 hover:text-slate-950 rounded text-[9px] font-black uppercase transition border dark:border-slate-850"
                        >
                          +Side
                        </button>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>

          {/* PANEL KANAN: SUSUNAN DECK AKTIF (8 Kolom) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* 1. Main Deck Area (40 - 60) */}
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-5 rounded-3xl shadow-xl relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-amber-500"></div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-base font-black uppercase tracking-wider text-slate-900 dark:text-amber-100/95 flex items-center gap-2">
                  <Layers size={16} className="text-amber-500" />
                  <span>Main Deck ({mainDeck.length} / 60)</span>
                </h3>
                {mainDeck.length < 40 && (
                  <span className="text-[10px] text-orange-500 font-extrabold uppercase bg-orange-500/10 px-2.5 py-1 rounded border border-orange-500/10 flex items-center gap-1.5">
                    <AlertCircle size={11} />
                    <span>Kurang dari 40</span>
                  </span>
                )}
              </div>

              {mainDeck.length === 0 ? (
                <div className="py-14 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl text-center text-gray-400">
                  <p className="text-xs font-bold uppercase tracking-wider">Main Deck Masih Kosong</p>
                  <p className="text-[10px] text-gray-500 mt-1">Gunakan panel pencarian di sebelah kiri untuk memasukkan kartu.</p>
                </div>
              ) : (
                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2.5">
                  {mainDeck.map((card, i) => (
                    <div 
                      key={i} 
                      onClick={() => removeCard(i, 'main')}
                      className="group aspect-[3/4] relative rounded-md overflow-hidden bg-slate-950 border border-slate-200 dark:border-slate-800 shadow cursor-pointer hover:border-red-500 transition"
                    >
                      <img src={card.imageUrl} alt="" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-red-600/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-150">
                        <Trash2 size={16} className="text-white" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 2. Extra Deck Area (0 - 15) */}
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-5 rounded-3xl shadow-xl relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-purple-500"></div>
              <h3 className="text-base font-black uppercase tracking-wider text-slate-900 dark:text-amber-100/95 flex items-center gap-2 mb-4">
                <Layers size={16} className="text-purple-500" />
                <span>Extra Deck ({extraDeck.length} / 15)</span>
              </h3>

              {extraDeck.length === 0 ? (
                <div className="py-10 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl text-center text-gray-400">
                  <p className="text-xs font-bold uppercase tracking-wider">Extra Deck Masih Kosong</p>
                  <p className="text-[10px] text-gray-500 mt-1">Kartu berjenis Fusion, Synchro, Xyz, atau Link Monster.</p>
                </div>
              ) : (
                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2.5">
                  {extraDeck.map((card, i) => (
                    <div 
                      key={i} 
                      onClick={() => removeCard(i, 'extra')}
                      className="group aspect-[3/4] relative rounded-md overflow-hidden bg-slate-950 border border-slate-200 dark:border-slate-800 shadow cursor-pointer hover:border-red-500 transition"
                    >
                      <img src={card.imageUrl} alt="" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-red-600/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-150">
                        <Trash2 size={16} className="text-white" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 3. Side Deck Area (0 - 15) */}
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-5 rounded-3xl shadow-xl relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-teal-500"></div>
              <h3 className="text-base font-black uppercase tracking-wider text-slate-900 dark:text-amber-100/95 flex items-center gap-2 mb-4">
                <Layers size={16} className="text-teal-500" />
                <span>Side Deck ({sideDeck.length} / 15)</span>
              </h3>

              {sideDeck.length === 0 ? (
                <div className="py-10 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl text-center text-gray-400">
                  <p className="text-xs font-bold uppercase tracking-wider">Side Deck Masih Kosong</p>
                </div>
              ) : (
                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2.5">
                  {sideDeck.map((card, i) => (
                    <div 
                      key={i} 
                      onClick={() => removeCard(i, 'side')}
                      className="group aspect-[3/4] relative rounded-md overflow-hidden bg-slate-950 border border-slate-200 dark:border-slate-800 shadow cursor-pointer hover:border-red-500 transition"
                    >
                      <img src={card.imageUrl} alt="" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-red-600/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-150">
                        <Trash2 size={16} className="text-white" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </main>
  )
}
