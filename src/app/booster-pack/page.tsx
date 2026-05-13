'use client'

import { useState, useMemo } from 'react'
import Navbar from '@/components/Navbar'
import { Search, Calendar, ExternalLink, RefreshCw } from 'lucide-react'

interface BoosterPack {
  name: string
  releaseDate: string
  description: string
  code: string
  link: string
}

const BOOSTER_PACKS: BoosterPack[] = [
  {
    name: "Chaos Origins",
    releaseDate: "2026-07-03",
    description: "Chaos Origins brings back the one-and-only legendary King of Games, with some of his favorite monsters from the original Yu-Gi-Oh! manga and anime!",
    code: "CORI",
    link: "https://www.yugioh-card.com/en/products/cori/"
  },
  {
    name: "Battles of Legend: Glorious Gallery",
    releaseDate: "2026-06-05",
    description: "Battles of Legend: Glorious Gallery comes with more extended art cards, chibi cards, and blinged-out upgrades to make your Deck as glorious as it can be!",
    code: "BLGG",
    link: "https://www.yugioh-card.com/en/products/blgg/"
  },
  {
    name: "Blazing Dominion",
    releaseDate: "2026-05-08",
    description: "Blazing Dominion burns bright with fantastic and fearsome new cards you won’t want to miss, starting off with Fairy Tails, Anna Kaboom, and the Master of Faster himself!",
    code: "BLZD",
    link: "https://www.yugioh-card.com/en/products/blzd/"
  },
  {
    name: "Rarity Collection V",
    releaseDate: "2026-04-17",
    description: "Rarity Collection V gives you a special variant art card in every pack, like you’ve never seen before! It’s still All-Foil, it’s still All-Amazing, but it’s also your first crack at some unique cards.",
    code: "RA05",
    link: "https://www.yugioh-card.com/en/products/ra05/"
  },
  {
    name: "Maze of Muertos",
    releaseDate: "2026-02-20",
    description: "Join Pumpking and his Pals for Halloween in the Spring, with Maze of Muertos!",
    code: "MZMU",
    link: "https://www.yugioh-card.com/en/products/mzmu/"
  },
  {
    name: "Burst Protocol",
    releaseDate: "2026-02-06",
    description: "Add a little New Year’s fireworks show to your Deck with Burst Protocol!",
    code: "BPRO",
    link: "https://www.yugioh-card.com/en/products/bpro/"
  },
  {
    name: "Phantom Revenge",
    releaseDate: "2025-12-19",
    description: "Phantom Revenge brings three brand-new themes so you can take vengeance on your competition!",
    code: "PHRE",
    link: "https://www.yugioh-card.com/en/products/phre/"
  },
  {
    name: "Doom of Dimensions",
    releaseDate: "2025-09-26",
    description: "Dare to descend into different domains and demolish the defining divisions of the different Dueling dimensions with Doom of Dimensions!",
    code: "DOOD",
    link: "https://www.yugioh-card.com/en/products/dood/"
  },
  {
    name: "Retro Pack 2",
    releaseDate: "2025-08-29",
    description: "Retro Pack 2 is an oft-requested time capsule from the past, but now with increased foil drop rates!",
    code: "RP02",
    link: "https://www.yugioh-card.com/en/products/rp02_2025/"
  },
  {
    name: "Limited Pack World Championship 2025",
    releaseDate: "2025-08-30",
    description: "Celebrate a whole year of incredible Dueling stories with Limited Pack World Championship 2025 booster set!",
    code: "WCS2025",
    link: "https://www.yugioh-card.com/en/products/wcs2025booster/"
  },
  {
    name: "Justice Hunters",
    releaseDate: "2025-08-01",
    description: "Justice Hunters brings you three brand-new themes ready to shake up the Yu-Gi-Oh! TRADING CARD GAME, each focusing on a different type of Extra Deck monster!",
    code: "JUSH",
    link: "https://www.yugioh-card.com/en/products/jush/"
  },
  {
    name: "Duelist’s Advance",
    releaseDate: "2025-07-04",
    description: "Do do do do Duel, with Duelist’s Advance!",
    code: "DUAD",
    link: "https://www.yugioh-card.com/en/products/duad/"
  },
  {
    name: "Battles of Legend: Monster Mayhem",
    releaseDate: "2025-06-13",
    description: "This year’s Battles of Legend set, Battles of Legend: Monster Mayhem, comes with three new surprises!",
    code: "BLMM",
    link: "https://www.yugioh-card.com/en/products/blmm/"
  },
  {
    name: "Alliance Insight",
    releaseDate: "2025-05-02",
    description: "Alliance Insight is the last call for Quarter Century Secret Rares!",
    code: "ALIN",
    link: "https://www.yugioh-card.com/en/products/alin/"
  },
  {
    name: "Quarter Century Stampede",
    releaseDate: "2025-04-11",
    description: "Quarter Century Stampede will be your last chance to get some of your all-time favorite cards as Quarter Century Secret Rares before this spectacular, shining rarity is gone forever.",
    code: "QCS",
    link: "https://www.yugioh-card.com/en/products/qcs/"
  },
  {
    name: "Maze of the Master",
    releaseDate: "2025-03-14",
    description: "Explore the Deck ideas of your favorite Duelists with the anime-themed Maze of the Master!",
    code: "MZTM",
    link: "https://www.yugioh-card.com/en/products/mztm/"
  },
  {
    name: "Supreme Darkness",
    releaseDate: "2025-01-24",
    description: "Supreme King Jaden’s “Evil HERO” monsters are back in a big way in Supreme Darkness, with new “Evil HERO” monsters and incredible support cards!",
    code: "SUDA",
    link: "https://www.yugioh-card.com/en/products/suda/"
  },
  {
    name: "Crossover Breakers",
    releaseDate: "2024-12-06",
    description: "Jump into the action with all-new themes in Crossover Breakers!",
    code: "CRBR",
    link: "https://www.yugioh-card.com/en/products/crbr/"
  },
  {
    name: "Quarter Century Bonanza",
    releaseDate: "2024-11-08",
    description: "Quarter Century Bonanza picks up where the Rarity Collection sets left off, with a bunch of new twists! Get ready for a wild ride!",
    code: "QCB",
    link: "https://www.yugioh-card.com/en/products/qcb/"
  },
  {
    name: "Rage of the Abyss",
    releaseDate: "2024-10-11",
    description: "Descend to the deepest depths of the ocean with Rage of the Abyss!",
    code: "ROTA",
    link: "https://www.yugioh-card.com/en/products/rota/"
  },
  {
    name: "Retro Pack",
    releaseDate: "2024-08-23",
    description: "Celebrate the 25th Anniversary of the Yu-Gi-Oh! Card Game with Retro Pack, the booster set that never was!",
    code: "RP01",
    link: "https://www.yugioh-card.com/en/products/rp01/"
  },
  {
    name: "The Infinite Forbidden",
    releaseDate: "2024-07-19",
    description: "Return to where it all began with a new strategy featuring the unstoppable Exodia in The Infinite Forbidden!",
    code: "INFO",
    link: "https://www.yugioh-card.com/en/products/info/"
  },
  {
    name: "Battles of Legend: Terminal Revenge",
    releaseDate: "2024-06-21",
    description: "Get awesome foil upgrades as well as sought-after tournament cards in Battles of Legend: Terminal Revenge.",
    code: "BLTR",
    link: "https://www.yugioh-card.com/en/products/bltr/"
  },
  {
    name: "25th Anniversary Rarity Collection II",
    releaseDate: "2024-05-24",
    description: "The 25th Anniversary Rarity Collection II is a rapid-fire waterfall of high-powered cards, in seven of the game’s most popular foil rarities!",
    code: "RA02",
    link: "https://www.yugioh-card.com/en/products/ra02/"
  },
  {
    name: "Legacy of Destruction",
    releaseDate: "2024-04-26",
    description: "Cement your legend as a top-level Duelist with the latest core booster set, Legacy of Destruction!",
    code: "LEDE",
    link: "https://www.yugioh-card.com/en/products/lede/"
  },
  {
    name: "Phantom Nightmare",
    releaseDate: "2024-02-09",
    description: "Unlock the terrifying secrets of new themes, find brand-new cards for recent favorites, and meet more memorable monsters!",
    code: "PHNI",
    link: "https://www.yugioh-card.com/en/products/phni/"
  },
  {
    name: "Maze of Millennia",
    releaseDate: "2024-01-19",
    description: "Maze of Millennia contains new long-thought-lost cards seen in the TV series, and some of today’s hottest tournament-level cards!",
    code: "MZMI",
    link: "https://www.yugioh-card.com/en/products/mzmi/"
  },
  {
    name: "Valiant Smashers",
    releaseDate: "2023-11-17",
    description: "Take to the front lines and lead an all-out attack against your opponent with 3 new themes in Valiant Smashers!",
    code: "VASM",
    link: "https://www.yugioh-card.com/en/products/vasm/"
  },
  {
    name: "25th Anniversary Rarity Collection",
    releaseDate: "2023-11-03",
    description: "Get your hands on two new card technologies with the 25th Anniversary Rarity Collection!",
    code: "RA01",
    link: "https://www.yugioh-card.com/en/products/ra01/"
  },
  {
    name: "Age of Overlord",
    releaseDate: "2023-10-20",
    description: "A new age dawns this Fall with Age of Overlord, the latest core booster set!",
    code: "AGOV",
    link: "https://www.yugioh-card.com/en/products/agov/"
  },
  {
    name: "Invasion of Chaos",
    releaseDate: "2004-03-01",
    description: "Invasion of Chaos is one of the most iconic Yu-Gi-Oh! TRADING CARD GAME booster sets of all time!",
    code: "IOC",
    link: "https://www.yugioh-card.com/en/products/ioc/"
  }
]

export default function BoosterPackPage() {
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest')

  // Format date helper
  const formatDate = (dateStr: string) => {
    try {
      const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' }
      return new Date(dateStr).toLocaleDateString('id-ID', options)
    } catch {
      return dateStr
    }
  }

  // Filter & Sort
  const filteredPacks = useMemo(() => {
    let result = BOOSTER_PACKS.filter(pack => {
      const q = search.toLowerCase()
      return (
        pack.name.toLowerCase().includes(q) ||
        pack.code.toLowerCase().includes(q) ||
        pack.description.toLowerCase().includes(q)
      )
    })

    result.sort((a, b) => {
      const timeA = new Date(a.releaseDate).getTime()
      const timeB = new Date(b.releaseDate).getTime()
      return sortBy === 'newest' ? timeB - timeA : timeA - timeB
    })

    return result
  }, [search, sortBy])

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
            Daftar booster pack resmi Yu-Gi-Oh! dari Konami Trading Card Game
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
                  placeholder="Cari booster pack (contoh: Rarity, Chaos, dll)..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-slate-700/60 rounded-xl focus:ring-2 focus:ring-yellow-400 bg-white dark:bg-slate-800 dark:text-white dark:placeholder-gray-400 text-sm font-medium"
                />
              </div>
            </div>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest')}
              className="px-4 py-3 border border-gray-200 dark:border-slate-700/60 rounded-xl focus:ring-2 focus:ring-yellow-400 bg-white dark:bg-slate-800 dark:text-white text-sm font-semibold transition"
            >
              <option value="newest">📅 Rilis: Terbaru</option>
              <option value="oldest">📅 Rilis: Terlama</option>
            </select>
          </div>
        </div>

        {/* Grid Listings */}
        {filteredPacks.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Booster tidak ditemukan</h3>
            <p className="text-gray-500 dark:text-gray-400">Coba masukkan nama booster pack yang lain.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPacks.map((pack) => {
              const isFuture = new Date(pack.releaseDate).getTime() > Date.now()

              return (
                <div 
                  key={pack.code}
                  className="group relative flex flex-col justify-between rounded-2xl border border-gray-100 dark:border-slate-800/40 p-6 bg-white dark:bg-slate-900/40 hover:border-yellow-500/40 dark:hover:border-yellow-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-yellow-500/5 hover:-translate-y-1"
                >
                  {/* Subtle inner radial glow */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-yellow-500/0 via-transparent to-yellow-500/0 group-hover:from-yellow-500/[0.02] group-hover:to-yellow-500/[0.03] transition-all duration-300 pointer-events-none"></div>

                  <div>
                    {/* Pack Badge Code & Status */}
                    <div className="flex items-center justify-between mb-4">
                      <span className="px-3 py-1 bg-yellow-500/10 text-yellow-500 dark:text-yellow-400 border border-yellow-500/20 rounded-full text-xs font-bold uppercase tracking-wider">
                        {pack.code}
                      </span>
                      {isFuture && (
                        <span className="px-2.5 py-0.5 bg-rose-500/10 text-rose-500 dark:text-rose-400 border border-rose-500/20 rounded-full text-[10px] font-extrabold uppercase tracking-wide flex items-center gap-1 animate-pulse">
                          🔮 Upcoming
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-extrabold text-slate-800 dark:text-slate-100 mb-2 group-hover:text-yellow-500 transition-colors duration-200">
                      {pack.name}
                    </h3>

                    {/* Date and Calendar */}
                    <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 dark:text-gray-400 mb-4 bg-gray-50 dark:bg-slate-800/30 p-2.5 rounded-xl border border-gray-100/50 dark:border-slate-800/30">
                      <Calendar size={14} className="text-yellow-500" />
                      <span>Rilis: {formatDate(pack.releaseDate)}</span>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-6 font-medium">
                      {pack.description}
                    </p>
                  </div>

                  {/* External official Konami reference button */}
                  <div className="pt-4 border-t border-gray-100 dark:border-slate-800/40">
                    <a
                      href={pack.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-xs font-bold text-yellow-600 dark:text-yellow-400 hover:text-yellow-500 dark:hover:text-yellow-300 transition-colors duration-150"
                    >
                      <span>Selengkapnya di Konami</span>
                      <ExternalLink size={12} />
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
