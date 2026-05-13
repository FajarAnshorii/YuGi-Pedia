'use client'

import { useState } from 'react'
import Navbar from '@/components/Navbar'
import { Sparkles, ChevronRight, Info } from 'lucide-react'

const RARITY_LIST = [
  {
    id: 'qcsr',
    name: 'Quarter Century Secret Rare (QCSR)',
    rating: '★★★★★ Ultra Rare',
    multiplier: '50x - 100x Harga Dasar',
    description: 'Format cetakan spesial peringatan ulang tahun ke-25 franchise Yu-Gi-Oh!. Memiliki watermark logo "25th Anniversary" transparan di tengah text box, foil berulir perak silang, nama kartu emas mengkilap, serta teks berwarna merah berkilau.',
    sweepColor: 'rgba(239, 68, 68, 0.5)',
    passcode: '89631139', // Blue-Eyes White Dragon ✓
    icon: '✨'
  },
  {
    id: 'starlight',
    name: 'Starlight Rare',
    rating: '★★★★★ Ultra Rare',
    multiplier: '30x - 80x Harga Dasar',
    description: 'Format kelangkaan legendaris modern dengan rasio muncul 1 per 24 box booster. Seluruh permukaan kartu termasuk pinggiran, teks, dan artwork memancarkan pantulan cahaya horizontal silang yang sangat rapat dan mewah.',
    sweepColor: 'rgba(59, 130, 246, 0.5)',
    passcode: '46986414', // Dark Magician ✓
    icon: '⭐'
  },
  {
    id: 'ghost',
    name: 'Ghost Rare',
    rating: '★★★★☆ Extremely Rare',
    multiplier: '15x - 40x Harga Dasar',
    description: 'Menghilangkan seluruh spektrum warna dari ilustrasi, menggantinya dengan cetakan hologram 3D berwarna perak pucat berkilau. Di bawah sudut cahaya tertentu, monster terlihat mengambang keluar seperti arwah hantu.',
    sweepColor: 'rgba(200, 200, 220, 0.6)',
    passcode: '72283691', // Stardust Dragon ✓
    icon: '👻'
  },
  {
    id: 'ultimate',
    name: 'Ultimate Rare',
    rating: '★★★☆☆ Collector Rare',
    multiplier: '5x - 15x Harga Dasar',
    description: 'Menggunakan teknik pahatan bertekstur (embossed) pada permukaan bintang level, simbol atribut, garis batas, dan seluruh artwork monster. Memiliki warna emas kecokelatan bertekstur unik saat diraba.',
    sweepColor: 'rgba(234, 179, 8, 0.5)',
    passcode: '31893528', // Red-Eyes Black Dragon ✓
    icon: '👑'
  },
  {
    id: 'collector',
    name: "Collector's Rare",
    rating: '★★★☆☆ Collector Rare',
    multiplier: '4x - 10x Harga Dasar',
    description: 'Cetakan khusus khas OCG Asia yang membawa kemilau foil perak berbutir pasir sangat padat di bagian pinggir text box dan bingkai artwork, kontras dengan warna kartu utama yang gelap.',
    sweepColor: 'rgba(168, 85, 247, 0.5)',
    passcode: '38100739', // Thunder Dragon ✓
    icon: '💎'
  }
]

// Helper to get card image URL with fallback
function getCardImageUrl(passcode: string) {
  return `https://images.ygoprodeck.com/images/cards/${passcode}.jpg`
}

function getCardName(passcode: string) {
  const map: Record<string, string> = {
    '89631139': 'Blue-Eyes White Dragon',
    '46986414': 'Dark Magician',
    '72283691': 'Stardust Dragon',
    '31893528': 'Red-Eyes Black Dragon',
    '38100739': 'Thunder Dragon',
  }
  return map[passcode] || 'Unknown Card'
}

export default function RarityPage() {
  const [selectedRarity, setSelectedRarity] = useState(RARITY_LIST[0])
  const [imgError, setImgError] = useState(false)

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-250">
      <Navbar />

      <style jsx global>{`
        @keyframes holoSweep {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        @keyframes holoShift {
          0%, 100% { opacity: 0.12; }
          50%       { opacity: 0.35; }
        }
        .holo-card {
          position: relative;
          overflow: hidden;
        }
        .holo-card:hover .holo-overlay {
          animation: holoSweep 3s infinite linear, holoShift 5s infinite ease-in-out;
          background-size: 400% 400%, 100% 100%;
        }
      `}</style>

      <div className="container mx-auto px-4 py-10 max-w-7xl">

        {/* ── Header ──────────────────────────────────────────── */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="inline-flex items-center gap-1.5 text-yellow-600 dark:text-yellow-400 text-xs font-black uppercase tracking-widest bg-yellow-500/10 border border-yellow-500/20 px-4 py-1.5 rounded-full mb-3">
            <Sparkles size={11} className="animate-pulse" />
            Koleksi & Tingkat Kelangkaan
          </span>
          <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-wider yugioh-glow-text leading-tight">
            ⭐ Rarity Guide & Gallery
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-3 leading-relaxed">
            Pahami perbedaan kemilau fisik cetakan kartu (<em>Rarity</em>) termahal dan saksikan efek kilauan hologram interaktifnya.
          </p>
        </div>

        {/* ── Rating Legend ───────────────────────────────────── */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {RARITY_LIST.map((r) => (
            <div key={r.id} className="flex items-center gap-2 text-xs font-bold border px-3 py-1.5 rounded-full"
              style={{ color: r.sweepColor.replace('0.5)', '1)'), background: r.sweepColor + '12', borderColor: r.sweepColor + '30' }}>
              <span>{r.icon}</span>
              <span className="hidden sm:inline">{r.name}</span>
              <span className="sm:hidden">{r.id.toUpperCase()}</span>
            </div>
          ))}
        </div>

        {/* ── Main Layout ─────────────────────────────────────── */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">

          {/* ── LEFT: Rarity Selector ──────────────────────────── */}
          <div className="xl:col-span-5 space-y-5">
            <div className="space-y-3 max-h-[680px] overflow-y-auto pr-1 custom-scrollbar">
              {RARITY_LIST.map((rarity) => (
                <div
                  key={rarity.id}
                  onClick={() => {
                    setSelectedRarity(rarity)
                    setImgError(false)
                  }}
                  className={`group p-5 rounded-2xl border cursor-pointer transition-all duration-200 shadow-sm relative overflow-hidden ${
                    selectedRarity.id === rarity.id
                      ? 'border-yellow-400/50 dark:border-yellow-500/40 shadow-md ring-1 ring-yellow-400/15'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-yellow-400/30 hover:shadow-md'
                  }`}
                  style={selectedRarity.id === rarity.id ? {
                    background: rarity.sweepColor + '12'
                  } : undefined}
                >
                  {/* Active left accent */}
                  {selectedRarity.id === rarity.id && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 rounded-full"
                      style={{ background: rarity.sweepColor.replace('0.5)', '1)') }} />
                  )}

                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className={`flex-shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center text-3xl transition-transform duration-200 ${
                      selectedRarity.id === rarity.id ? '' : 'group-hover:scale-105'
                    }`}
                      style={{ background: rarity.sweepColor + '20' }}>
                      {rarity.icon}
                    </div>

                    {/* Text */}
                    <div className="flex-grow min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className="font-extrabold text-base text-slate-900 dark:text-white leading-tight">
                          {rarity.name}
                        </h3>
                      </div>
                      <p className="text-xs font-bold text-yellow-600 dark:text-yellow-400 uppercase tracking-wide mb-2">
                        {rarity.rating}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-2">
                        {rarity.description}
                      </p>
                    </div>
                  </div>

                  {/* Bottom row: multiplier + arrow */}
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-xs font-black text-green-600 dark:text-green-400 bg-green-500/10 border border-green-500/20 px-2.5 py-0.5 rounded-full">
                      {rarity.multiplier}
                    </span>
                    <ChevronRight size={14} className={`transition-all duration-200 ${
                      selectedRarity.id === rarity.id
                        ? 'text-yellow-500 translate-x-0'
                        : 'text-gray-300 dark:text-gray-600 -translate-x-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-0'
                    }`} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── RIGHT: Card Viewer ──────────────────────────────── */}
          <div className="xl:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl overflow-hidden">

            {/* Panel Header */}
            <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 bg-gradient-to-r from-slate-50 to-white dark:from-slate-900 dark:to-slate-900">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
                  style={{ background: selectedRarity.sweepColor + '20', border: `1px solid ${selectedRarity.sweepColor}30` }}>
                  {selectedRarity.icon}
                </div>
                <div className="flex-grow min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-wide leading-tight">
                      {selectedRarity.name}
                    </h2>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-0.5">
                    {selectedRarity.rating} · {selectedRarity.multiplier}
                  </p>
                </div>
              </div>
            </div>

            {/* Card Display Area */}
            <div className="px-6 py-6">
              <div className="holo-card w-full max-w-xs mx-auto rounded-2xl overflow-hidden relative"
                style={{
                  aspectRatio: '3/4',
                  background: 'linear-gradient(145deg, #0f1923, #1a2535)',
                  boxShadow: `0 0 40px ${selectedRarity.sweepColor}, 0 20px 60px rgba(0,0,0,0.5)`,
                  border: `1px solid ${selectedRarity.sweepColor}40`,
                  maxWidth: '320px',
                }}>

                {/* Holographic overlay */}
                <div
                  className="holo-overlay absolute inset-0 pointer-events-none z-10"
                  style={{
                    background: `linear-gradient(110deg, transparent 30%, ${selectedRarity.sweepColor}60 48%, rgba(255,255,255,0.5) 50%, ${selectedRarity.sweepColor}60 52%, transparent 70%)`,
                    backgroundSize: '200% 100%',
                  }}
                />

                {/* Card image */}
                <div className="relative w-full h-full">
                  {imgError ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                      <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center text-3xl">
                        {selectedRarity.icon}
                      </div>
                      <p className="text-xs text-gray-400 font-medium">Gambar tidak tersedia</p>
                    </div>
                  ) : (
                    <img
                      src={getCardImageUrl(selectedRarity.passcode)}
                      alt={getCardName(selectedRarity.passcode)}
                      className="w-full h-full object-cover"
                      onError={() => setImgError(true)}
                    />
                  )}
                </div>

                {/* Card name badge */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent z-20">
                  <p className="text-xs font-black text-white text-center uppercase tracking-wider">
                    {getCardName(selectedRarity.passcode)}
                  </p>
                </div>
              </div>

              {/* Rarity info cards */}
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 text-center">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Rating</span>
                  <p className="text-sm font-black text-yellow-600 dark:text-yellow-400 mt-1">{selectedRarity.rating}</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 text-center">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Pengali Harga</span>
                  <p className="text-sm font-black text-green-600 dark:text-green-400 mt-1">{selectedRarity.multiplier}</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 text-center">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Passcode</span>
                  <p className="text-xs font-black text-slate-600 dark:text-gray-300 mt-1 font-mono">{selectedRarity.passcode}</p>
                </div>
              </div>

              {/* Full description */}
              <div className="mt-6 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Info size={14} className="text-yellow-500" />
                  <span className="text-xs font-black uppercase text-gray-400 tracking-widest">Penjelasan Lengkap</span>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                  {selectedRarity.description}
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </main>
  )
}