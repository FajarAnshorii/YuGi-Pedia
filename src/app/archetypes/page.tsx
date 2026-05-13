'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import { Sparkles, Search, Layers, ChevronRight, Star } from 'lucide-react'

const ARCHETYPES = [
  {
    name: 'Blue-Eyes',
    playstyle: 'Agresif — Beatdown / OTK',
    description: 'Suku naga legenda berkekuatan murni yang bertujuan memanggil monster legendaris ber-ATK 3000+ dengan cepat untuk meluncurkan serangan penghancur langsung.',
    icon: '🐉',
    difficulty: 'Pemula',
    difficultyColor: 'text-green-500',
    difficultyBg: 'bg-green-500/10 border-green-500/20',
    searchKey: 'Blue-Eyes'
  },
  {
    name: 'Dark Magician',
    playstyle: 'Kontrol — Spell Synergies',
    description: 'Suku penyihir andalan Yugi Mutou yang berfokus pada aktivasi Spell & Trap interaktif untuk membuang dan mengunci pergerakan kartu lawan.',
    icon: '🧙‍♂️',
    difficulty: 'Pemula',
    difficultyColor: 'text-green-500',
    difficultyBg: 'bg-green-500/10 border-green-500/20',
    searchKey: 'Dark Magician'
  },
  {
    name: 'Cyber Dragon',
    playstyle: 'Agresif — OTK Machine',
    description: 'Sagu naga mesin Cybernetic yang mahir memanggil dirinya sendiri ke arena dan melakukan Fusion raksasa untuk melibas pertahanan lawan seketika.',
    icon: '⚙️',
    difficulty: 'Pemula',
    difficultyColor: 'text-green-500',
    difficultyBg: 'bg-green-500/10 border-green-500/20',
    searchKey: 'Cyber Dragon'
  },
  {
    name: 'Red-Eyes',
    playstyle: 'Agresif — Burn / Fusion',
    description: 'Suku naga hitam bermata merah dengan potensi tak terbatas, berfokus pada pemberian efek damage langsung (Burn Damage) ke LP musuh.',
    icon: '🔥',
    difficulty: 'Pemula',
    difficultyColor: 'text-green-500',
    difficultyBg: 'bg-green-500/10 border-green-500/20',
    searchKey: 'Red-Eyes'
  },
  {
    name: 'Harpie',
    playstyle: 'Kontrol — Backrow Removal',
    description: 'Suku wanita bersayap (Winged Beast) yang mahir menyapu bersih kartu jebakan dan Spell di baris belakang lawan dengan kartu andalannya.',
    icon: '🦅',
    difficulty: 'Pemula',
    difficultyColor: 'text-green-500',
    difficultyBg: 'bg-green-500/10 border-green-500/20',
    searchKey: 'Harpie'
  },
  {
    name: 'Elemental HERO',
    playstyle: 'Kombo — Fusion Spam',
    description: 'Pahlawan super bertipe Prajurit yang memanfaatkan variasi efek kartu Fusion tingkat tinggi untuk menggabungkan monster menjadi bentuk pamungkas.',
    icon: '🦸',
    difficulty: 'Menengah',
    difficultyColor: 'text-yellow-500',
    difficultyBg: 'bg-yellow-500/10 border-yellow-500/20',
    searchKey: 'HERO'
  },
  {
    name: 'Kashtira',
    playstyle: 'Kontrol — Zone Lock / Banishing',
    description: 'Monster psikis luar angkasa ber-ATK tinggi yang memiliki kemampuan unik membuang kartu lawan secara Face-Down dan memblokir zona bermain mereka.',
    icon: '👽',
    difficulty: 'Menengah',
    difficultyColor: 'text-yellow-500',
    difficultyBg: 'bg-yellow-500/10 border-yellow-500/20',
    searchKey: 'Kashtira'
  },
  {
    name: 'Labrynth',
    playstyle: 'Kontrol — Normal Traps',
    description: 'Suku kastil jebakan iblis yang dikomandoi oleh Lady Labrynth, berfokus pada pemanfaatan rantai aktivasi kartu Normal Trap secara dinamis.',
    icon: '🏰',
    difficulty: 'Menengah',
    difficultyColor: 'text-yellow-500',
    difficultyBg: 'bg-yellow-500/10 border-yellow-500/20',
    searchKey: 'Labrynth'
  },
  {
    name: 'Sky Striker',
    playstyle: 'Kontrol — Solo Striker Spell',
    description: 'Mengendalikan 1 unit prajurit wanita di Zona Monster Utama, didukung oleh puluhan Spell taktis berkekuatan tinggi di kuburan.',
    icon: '🤖',
    difficulty: 'Mahir',
    difficultyColor: 'text-orange-500',
    difficultyBg: 'bg-orange-500/10 border-orange-500/20',
    searchKey: 'Sky Striker'
  },
  {
    name: 'Exodia',
    playstyle: 'Spesial — FTK / Hand Draw',
    description: 'Kombinasi 5 bagian tubuh Exodia yang terlarang. Suku ini bertujuan menarik kartu secepat mungkin dari Deck langsung ke tangan untuk kemenangan otomatis.',
    icon: '⛓️',
    difficulty: 'Mahir',
    difficultyColor: 'text-orange-500',
    difficultyBg: 'bg-orange-500/10 border-orange-500/20',
    searchKey: 'Exodia'
  },
  {
    name: 'Synchron',
    playstyle: 'Kombo — Synchro Climb',
    description: 'Mesin kombo cepat yang mengorbankan Tuner Monster berlevel kecil untuk mendaki tingkat bintang Synchro legendaris milik Yusei Fudo.',
    icon: '🏍️',
    difficulty: 'Mahir',
    difficultyColor: 'text-orange-500',
    difficultyBg: 'bg-orange-500/10 border-orange-500/20',
    searchKey: 'Synchron'
  },
  {
    name: 'Tearlaments',
    playstyle: 'Kombo — Graveyard Fusion',
    description: 'Suku peri air legendaris yang memicu efek pemanggilan Fusion langsung ketika dikirim ke Kuburan (Graveyard) oleh efek kartu lain.',
    icon: '🧜‍♀️',
    difficulty: 'Ahli',
    difficultyColor: 'text-red-500',
    difficultyBg: 'bg-red-500/10 border-red-500/20',
    searchKey: 'Tearlaments'
  }
]

export default function ArchetypesPage() {
  const [selectedArch, setSelectedArch] = useState(ARCHETYPES[0])
  const [cards, setCards] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  // Filter archetypes by search
  const filteredArchetypes = ARCHETYPES.filter(arch =>
    arch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    arch.playstyle.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Fetch cards associated with selected archetype
  useEffect(() => {
    setLoading(true)
    fetch(`/api/cards?search=${encodeURIComponent(selectedArch.searchKey)}&limit=18`)
      .then(res => res.json())
      .then(data => {
        if (data && Array.isArray(data.cards)) {
          setCards(data.cards)
        } else {
          setCards([])
        }
        setLoading(false)
      })
      .catch(err => {
        console.error('Failed to load archetype cards:', err)
        setCards([])
        setLoading(false)
      })
  }, [selectedArch])

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-250">
      <Navbar />

      <div className="container mx-auto px-4 py-10 max-w-7xl">
        {/* ── Header ─────────────────────────────────────────── */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="inline-flex items-center gap-1.5 text-yellow-600 dark:text-yellow-400 text-xs font-black uppercase tracking-widest bg-yellow-500/10 border border-yellow-500/20 px-4 py-1.5 rounded-full mb-3">
            <Sparkles size={11} className="animate-pulse" />
            Sinergi & Tema Suku Kartu
          </span>
          <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-wider yugioh-glow-text leading-tight">
            🎭 Archetypes Catalog
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-3 leading-relaxed">
            Pahami konsep suku kartu (Archetype) terpopuler dan telusuri daftar kartu anggotanya langsung dari database Yu-Gi-Oh!
          </p>
        </div>

        {/* ── Difficulty Legend ───────────────────────────────── */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {[
            { label: 'Pemula', color: 'text-green-500', bg: 'bg-green-500/10 border-green-500/20' },
            { label: 'Menengah', color: 'text-yellow-500', bg: 'bg-yellow-500/10 border-yellow-500/20' },
            { label: 'Mahir', color: 'text-orange-500', bg: 'bg-orange-500/10 border-orange-500/20' },
            { label: 'Ahli', color: 'text-red-500', bg: 'bg-red-500/10 border-red-500/20' },
          ].map((d) => (
            <div key={d.label} className={`flex items-center gap-1.5 text-xs font-bold border px-3 py-1 rounded-full ${d.color} ${d.bg}`}>
              <Star size={10} />
              {d.label}
            </div>
          ))}
        </div>

        {/* ── Main Layout ─────────────────────────────────────── */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">

          {/* ── LEFT: Archetype List ─────────────────────────── */}
          <div className="xl:col-span-5 space-y-4">

            {/* Search filter */}
            <div className="relative mb-2">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <Search size={15} />
              </div>
              <input
                type="text"
                placeholder="Cari archetype..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-yellow-500/50 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-800 dark:text-white placeholder-slate-400 outline-none transition shadow-sm"
              />
            </div>

            {/* Archetype cards */}
            <div className="space-y-3 max-h-[680px] overflow-y-auto pr-1 custom-scrollbar">
              {filteredArchetypes.map((arch) => (
                <div
                  key={arch.name}
                  onClick={() => setSelectedArch(arch)}
                  className={`group p-5 rounded-2xl border cursor-pointer transition-all duration-200 shadow-sm relative overflow-hidden ${
                    selectedArch.name === arch.name
                      ? 'bg-yellow-50 dark:bg-yellow-500/[0.07] border-yellow-400/50 dark:border-yellow-500/30 shadow-md ring-1 ring-yellow-400/20'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-yellow-400/40 hover:shadow-md'
                  }`}
                >
                  {/* Active left accent bar */}
                  {selectedArch.name === arch.name && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-yellow-500 rounded-full" />
                  )}

                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className={`flex-shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center text-3xl transition-transform duration-200 ${
                      selectedArch.name === arch.name ? 'scale-110' : 'group-hover:scale-105'
                    } ${selectedArch.name === arch.name ? 'bg-yellow-500/10' : 'bg-slate-100 dark:bg-slate-800'}`}>
                      {arch.icon}
                    </div>

                    {/* Text content */}
                    <div className="flex-grow min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className="font-extrabold text-base text-slate-900 dark:text-white leading-tight">
                          {arch.name}
                        </h3>
                        <span className={`flex-shrink-0 text-xs font-bold border px-2.5 py-0.5 rounded-full ${arch.difficultyColor} ${arch.difficultyBg}`}>
                          {arch.difficulty}
                        </span>
                      </div>
                      <p className="text-[11px] font-semibold text-yellow-600 dark:text-yellow-400 uppercase tracking-wide mb-2">
                        {arch.playstyle}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-2">
                        {arch.description}
                      </p>
                    </div>
                  </div>

                  {/* Click indicator */}
                  <div className="flex justify-end mt-2">
                    <ChevronRight size={14} className={`transition-all duration-200 ${
                      selectedArch.name === arch.name
                        ? 'text-yellow-500 translate-x-0'
                        : 'text-gray-300 dark:text-gray-600 -translate-x-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-0'
                    }`} />
                  </div>
                </div>
              ))}

              {filteredArchetypes.length === 0 && (
                <div className="text-center py-12 text-gray-400">
                  <p className="text-sm">Tidak ada archetype yang cocok.</p>
                </div>
              )}
            </div>
          </div>

          {/* ── RIGHT: Card Viewer ───────────────────────────── */}
          <div className="xl:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl overflow-hidden">
            {/* Panel Header */}
            <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 bg-gradient-to-r from-slate-50 to-white dark:from-slate-900 dark:to-slate-900">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center text-2xl">
                  {selectedArch.icon}
                </div>
                <div className="flex-grow min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-wide leading-tight">
                      {selectedArch.name}
                    </h2>
                    <span className={`text-xs font-bold border px-2.5 py-0.5 rounded-full ${selectedArch.difficultyColor} ${selectedArch.difficultyBg}`}>
                      {selectedArch.difficulty}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-0.5">
                    {selectedArch.playstyle}
                  </p>
                </div>
                <div className="hidden sm:flex items-center gap-1 text-xs text-gray-400 font-medium bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl">
                  <Layers size={12} />
                  <span>{cards.length} kartu</span>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-4 leading-relaxed bg-slate-75 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-100 dark:border-slate-800">
                {selectedArch.description}
              </p>
            </div>

            {/* Card Grid */}
            <div className="p-5">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-24 gap-4">
                  <div className="w-10 h-10 border-3 border-yellow-500 border-t-transparent rounded-full animate-spin" />
                  <p className="text-sm text-gray-400 font-semibold animate-pulse">
                    Menghubungkan ke database...
                  </p>
                </div>
              ) : cards.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-gray-400">
                    <Layers size={22} />
                  </div>
                  <p className="text-sm text-gray-400 font-medium">
                    Tidak ada kartu ditemukan di database.
                  </p>
                  <p className="text-xs text-gray-400/70">
                    Coba pilih archetype lain di panel kiri.
                  </p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {cards.map((card) => (
                      <Link
                        key={card.id}
                        href={`/cards/${card.id}`}
                        className="group block"
                      >
                        <div className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden hover:border-yellow-400/50 hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
                          {/* Card image */}
                          <div className="aspect-[3/4] bg-slate-900 overflow-hidden relative">
                            <img
                              src={card.imageUrl || (card.passcode ? `https://images.ygoprodeck.com/images/cards/${card.passcode}.jpg` : '')}
                              alt={card.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                              onError={(e) => {
                                const t = e.currentTarget as HTMLImageElement
                                if (card.passcode && !t.dataset.retried) {
                                  t.dataset.retried = '1'
                                  t.src = `https://images.ygoprodeck.com/images/cards/${card.passcode}.jpg`
                                } else {
                                  t.style.display = 'none'
                                }
                              }}
                            />
                            {/* ATK/DEF overlay for monsters */}
                            {card.attack !== undefined && (
                              <div className="absolute bottom-2 left-2 right-2 flex justify-between">
                                <span className="text-xs font-black bg-red-600 text-white px-2 py-0.5 rounded text-[10px]">
                                  ATK {card.attack}
                                </span>
                                <span className="text-xs font-black bg-blue-700 text-white px-2 py-0.5 rounded text-[10px]">
                                  DEF {card.defense ?? '?'}
                                </span>
                              </div>
                            )}
                          </div>
                          {/* Card info */}
                          <div className="p-3">
                            <p className="font-bold text-sm text-slate-800 dark:text-white leading-tight line-clamp-2 group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition-colors">
                              {card.name}
                            </p>
                            <p className="text-xs text-gray-400 mt-1 font-medium truncate">
                              {card.type?.name || card.race?.name || 'Monster'}
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

        </div>
      </div>
    </main>
  )
}
