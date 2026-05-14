'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'

// Fun Duelist Fortune Fortunes List
const DUELIST_FORTUNES = [
  "Hari ini adalah hari keberuntunganmu! Kekuatan kartu pilihanmu akan meningkatkan kreativitasmu sebesar +2000 ATK!",
  "Waspadalah! Ada Trap Card tersembunyi di sekitarmu hari ini. Tetap fokus dan melangkahlah dengan hati-hati!",
  "Dewa Obelisk the Tormentor melindungi hari ini. Energi positifmu tidak terkalahkan oleh hambatan apa pun!",
  "Dewa Slifer the Sky Dragon mengalirkan inspirasi tak terbatas. Kembangkan strategimu hari ini!",
  "Hari ini penuh dengan atribut LIGHT! Kejujuran dan kebaikanmu akan bersinar menerangi jalanmu!",
  "Atribut DARK mendominasi hari ini. Waktu yang tepat untuk merenung, menyusun rencana rahasia, dan membuat kejutan luar biasa!",
  "Atribut WIND berhembus kencang! Pikiranmu hari ini melesat cepat dan lincah menemukan solusi cerdas!",
  "Atribut WATER membawa kedamaian. Tenangkan pikiranmu dan hadapi segala tantangan dengan kepala dingin!",
  "Atribut FIRE membakar semangatmu! Selesaikan semua tugasmu hari ini dengan energi yang meledak-ledak!",
  "Atribut EARTH memberikan kestabilan. Pondasi bisnismu atau belajarmu hari ini sangat kuat dan kokoh!"
]

export default function Home() {
  // Stats state with fallback/default values
  const [stats, setStats] = useState({
    total: 14523,
    monsters: 8724,
    spells: 2688,
    traps: 1984,
    sets: 33989
  })

  // Lucky draw states
  const [isFlipped, setIsFlipped] = useState(false)
  const [isDrawing, setIsDrawing] = useState(false)
  const [drawnCard, setDrawnCard] = useState<any>(null)
  const [fortuneText, setFortuneText] = useState("")

  useEffect(() => {
    // Load counts dynamically
    fetch('/api/cards/count')
      .then(res => res.json())
      .then(data => {
        if (data && typeof data.count === 'number') {
          setStats({
            total: data.count,
            monsters: data.monsterCount || 8724,
            spells: data.spellCount || 2688,
            traps: data.trapCount || 1984,
            sets: data.setCount || 33989
          })
        }
      })
      .catch(err => console.error('Error fetching dynamic stats:', err))
  }, [])

  // Draw card handler
  const handleDrawCard = async () => {
    if (isDrawing) return

    setIsDrawing(true)
    setIsFlipped(false)

    try {
      const res = await fetch('/api/cards/random')
      const card = await res.json()

      // Select random fortune
      const randomFortune = DUELIST_FORTUNES[Math.floor(Math.random() * DUELIST_FORTUNES.length)]

      // Wait a split second to simulate build-up
      setTimeout(() => {
        setDrawnCard(card)
        setFortuneText(randomFortune)
        setIsFlipped(true)
        setIsDrawing(false)
      }, 600)
    } catch (err) {
      console.error('Failed to draw lucky card:', err)
      setIsDrawing(false)
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-200">
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-slate-900 text-white py-12 md:py-24 px-4 overflow-hidden border-b border-yellow-500/10">
        <div className="absolute inset-0">
          <img
            src="https://images.ygoprodeck.com/images/cards_cropped/10286023.jpg"
            alt=""
            className="w-full h-full object-cover opacity-10 blur-sm scale-110"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/90 via-slate-900/95 to-slate-950"></div>
        
        <div className="container mx-auto text-center max-w-4xl relative z-10">
          <div className="mb-4 md:mb-6 animate-[bounce_3s_infinite_ease-in-out]">
            <img src="/images/logo.png" alt="YuGi Pedia" className="h-20 md:h-32 mx-auto object-contain drop-shadow-[0_0_15px_rgba(234,179,8,0.4)]" />
          </div>
          <h1 className="text-2xl md:text-6xl font-extrabold mb-3 yugioh-glow-text tracking-wider uppercase">
            YuGi Pedia
          </h1>
          <p className="text-sm md:text-xl text-gray-300 mb-2 font-medium max-w-xs mx-auto md:max-w-none">
            Koleksi kartu Yu-Gi-Oh! terlengkap dan terinteraktif di Indonesia
          </p>
          <p className="text-[10px] md:text-lg text-yellow-400 font-bold mb-6 tracking-wide uppercase px-3 py-1 bg-yellow-400/10 border border-yellow-400/20 rounded-full inline-block">
            🔮 {stats.total.toLocaleString('id-ID')} Kartu | Monster • Spell • Trap
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <Link
              href="/album"
              className="w-full sm:w-auto px-6 py-3.5 bg-gradient-to-r from-yellow-500 to-amber-500 text-slate-900 rounded-xl font-black text-sm sm:text-lg hover:from-yellow-400 hover:to-amber-400 transition transform hover:-translate-y-0.5 active:translate-y-0 shadow-lg shadow-yellow-500/20 flex items-center justify-center gap-2"
            >
              🃏 Album Kartu
            </Link>
            <Link
              href="/deck-builder"
              className="w-full sm:w-auto px-6 py-3.5 bg-slate-800 border border-slate-700 rounded-xl font-bold text-sm sm:text-lg hover:bg-slate-750 transition flex items-center justify-center gap-2 text-yellow-400 hover:text-yellow-300"
            >
              🛠️ Deck Builder
            </Link>
          </div>
        </div>
      </section>

      {/* Interactive Lucky Draw (Gacha Card of the Day) */}
      <section className="py-12 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border-b border-slate-800">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-10">
            <span className="text-yellow-400 text-[10px] font-bold uppercase tracking-widest bg-yellow-400/10 border border-yellow-400/20 px-3 py-1 rounded-full">Mini-Game Harian</span>
            <h2 className="text-xl md:text-4xl font-black text-white mt-3 mb-2 tracking-wider yugioh-glow-text uppercase">🔮 Gacha Keberuntungan</h2>
            <p className="text-gray-400 max-w-xs mx-auto text-xs sm:text-base opacity-80">Tarik kartu harianmu untuk melihat ramalan duelmu hari ini!</p>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-16">
            {/* 3D Flipping Card back */}
            <div className="relative w-48 h-64 sm:w-64 sm:h-96 group [perspective:1000px] cursor-pointer" onClick={handleDrawCard}>
              <div 
                className={`relative w-full h-full transition-transform duration-1000 [transform-style:preserve-3d] ${
                  isFlipped ? '[transform:rotateY(180deg)]' : ''
                } ${isDrawing ? 'animate-[spin_1s_infinite_linear]' : ''}`}
              >
                {/* Card Front (Punggung Kartu) */}
                <div className="absolute inset-0 w-full h-full rounded-2xl border-4 border-amber-500/40 bg-gradient-to-br from-amber-950 via-slate-950 to-amber-950 p-2 shadow-2xl [backface-visibility:hidden]">
                  <div className="w-full h-full border border-amber-500/20 rounded-xl bg-cover bg-center flex flex-col items-center justify-center relative overflow-hidden"
                       style={{ backgroundImage: `url('https://images.ygoprodeck.com/images/cards/back.jpg')` }}>
                    <div className="absolute inset-0 bg-slate-950/20 hover:bg-transparent transition-colors"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-yellow-500/10 rounded-full border border-yellow-500/20 blur-md animate-pulse"></div>
                  </div>
                </div>

                {/* Card Back (Drawn Card Face) */}
                <div className="absolute inset-0 w-full h-full rounded-2xl bg-slate-900 border-4 border-yellow-400 overflow-hidden shadow-2xl [backface-visibility:hidden] [transform:rotateY(180deg)]">
                  {drawnCard ? (
                    <img 
                      src={drawnCard.imageUrl} 
                      alt={drawnCard.name} 
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-950 text-yellow-500 font-bold">Loading...</div>
                  )}
                </div>
              </div>
            </div>

            {/* Fortune Reading */}
            <div className="flex-1 text-center md:text-left bg-slate-900/50 border border-slate-800 p-5 md:p-8 rounded-2xl backdrop-blur-md max-w-md w-full">
              {!drawnCard ? (
                <div className="h-full flex flex-col justify-center items-center md:items-start py-4 md:py-8">
                  <h3 className="text-lg md:text-xl font-bold text-white mb-2">Panggil Keberuntunganmu!</h3>
                  <p className="text-gray-400 text-[11px] md:text-sm mb-6 text-center md:text-left opacity-80">Klik pada punggung kartu misterius atau tombol di bawah untuk mulai menarik gacha harian Anda.</p>
                  <button
                    onClick={handleDrawCard}
                    disabled={isDrawing}
                    className="w-full sm:w-auto px-6 py-3 bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-black rounded-xl transition shadow-lg shadow-yellow-500/10 text-xs sm:text-sm"
                  >
                    {isDrawing ? '🔄 Memanggil...' : '🔮 TARIK KARTU'}
                  </button>
                </div>
              ) : (
                <div>
                  <span className="px-2 py-0.5 text-[9px] font-bold bg-purple-500/20 border border-purple-500/30 text-purple-400 rounded-md tracking-wider uppercase">Hasil Ramalan</span>
                  <h3 className="text-xl md:text-2xl font-black text-yellow-400 mt-2 mb-1 tracking-wide">{drawnCard.name}</h3>
                  <p className="text-[10px] text-gray-400 font-semibold mb-4 uppercase">{drawnCard.subType || drawnCard.type?.name || 'Monster Card'}</p>
                  
                  <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-850 mb-5">
                    <p className="text-xs md:text-sm font-semibold text-gray-200 italic leading-relaxed">
                      " {fortuneText} "
                    </p>
                  </div>

                  <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-6">
                    {drawnCard.attack !== null && (
                      <span className="px-2.5 py-1 bg-red-500/10 border border-red-500/20 text-red-400 rounded-md text-[10px] font-bold">
                        ⚔️ {drawnCard.attack}
                      </span>
                    )}
                    {drawnCard.defense !== null && (
                      <span className="px-2.5 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-md text-[10px] font-bold">
                        🛡️ {drawnCard.defense}
                      </span>
                    )}
                    {drawnCard.level && (
                      <span className="px-2.5 py-1 bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 rounded-md text-[10px] font-bold">
                        ⭐ {drawnCard.level}
                      </span>
                    )}
                  </div>

                  <div className="flex gap-2.5">
                    <Link
                      href={`/cards/${drawnCard.id}`}
                      className="px-3 py-2.5 bg-slate-800 hover:bg-slate-750 border border-slate-700 text-white font-bold rounded-lg text-center text-[11px] transition flex-1"
                    >
                      Detail
                    </Link>
                    <button
                      onClick={handleDrawCard}
                      disabled={isDrawing}
                      className="px-3 py-2.5 bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-black rounded-lg text-[11px] transition flex-1 shadow-md"
                    >
                      🔄 Ulang
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Grid Section */}
      <section className="py-12 bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 text-center">
            <div className="p-4 sm:p-6 bg-gradient-to-br from-red-50 to-red-100 dark:from-slate-900/60 dark:to-slate-950/60 dark:border dark:border-red-500/20 rounded-xl hover:shadow-md transition">
              <div className="text-2xl sm:text-4xl mb-1.5 sm:mb-2">👹</div>
      <section className="py-8 bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 text-center">
            <div className="p-4 bg-gradient-to-br from-red-50 to-red-100 dark:from-slate-900/60 dark:to-slate-950/60 dark:border dark:border-red-500/20 rounded-xl hover:shadow-md transition">
              <div className="text-xl sm:text-4xl mb-1">👹</div>
              <p className="text-xl sm:text-3xl font-black text-red-600 dark:text-red-400">
                {stats.monsters.toLocaleString('id-ID')}
              </p>
              <p className="text-gray-500 dark:text-gray-400 text-[10px] sm:text-sm font-semibold">Monster Cards</p>
            </div>
            <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-slate-900/60 dark:to-slate-950/60 dark:border dark:border-green-500/20 rounded-xl hover:shadow-md transition">
              <div className="text-xl sm:text-4xl mb-1">✨</div>
              <p className="text-xl sm:text-3xl font-black text-green-600 dark:text-green-400">
                {stats.spells.toLocaleString('id-ID')}
              </p>
              <p className="text-gray-500 dark:text-gray-400 text-[10px] sm:text-sm font-semibold">Spell Cards</p>
            </div>
            <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-slate-900/60 dark:to-slate-950/60 dark:border dark:border-purple-500/20 rounded-xl hover:shadow-md transition">
              <div className="text-xl sm:text-4xl mb-1">🛡️</div>
              <p className="text-xl sm:text-3xl font-black text-purple-600 dark:text-purple-400">
                {stats.traps.toLocaleString('id-ID')}
              </p>
              <p className="text-gray-500 dark:text-gray-400 text-[10px] sm:text-sm font-semibold">Trap Cards</p>
            </div>
            <div className="p-4 sm:p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-slate-900/60 dark:to-slate-950/60 dark:border dark:border-blue-500/20 rounded-xl hover:shadow-md transition">
              <div className="text-2xl sm:text-4xl mb-1.5 sm:mb-2">📦</div>
              <p className="text-xl sm:text-3xl font-black text-blue-600 dark:text-blue-400">
                {stats.sets.toLocaleString('id-ID')}
              </p>
              <p className="text-gray-500 dark:text-gray-400 text-[10px] sm:text-sm font-semibold">Card Sets</p>
            </div>
          </div>
        </div>
      </section>

      {/* Card Type Categories */}
      <section className="py-16 bg-gray-50 dark:bg-slate-950">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-wider yugioh-glow-text uppercase">📂 Kategori Album</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base mt-2">Masuki album kartu berdasarkan tipe klasifikasi dasar deck Yu-Gi-Oh!</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Monster Cards */}
            <Link href="/album?typeId=4" className="group">
              <div className="bg-gradient-to-br from-slate-900 via-red-950/40 to-slate-950 border border-slate-800 dark:border-red-500/10 p-6 sm:p-8 rounded-2xl text-white text-center hover:scale-105 transition duration-300 hover:border-red-500/40 hover:shadow-lg hover:shadow-red-500/10 h-full flex flex-col justify-between">
                <div>
                  <div className="text-5xl mb-4 drop-shadow-[0_0_10px_rgba(239,68,68,0.3)]">👹</div>
                  <h3 className="text-xl sm:text-2xl font-bold mb-2 text-red-400 group-hover:text-red-300">Monster</h3>
                  <p className="text-sm text-gray-400">Panggil monster terkuat dengan ATK/DEF dahsyat untuk merobohkan baris musuh.</p>
                </div>
                <p className="text-sm mt-5 text-red-500 group-hover:text-red-400 font-semibold group-hover:underline">Lihat {stats.monsters.toLocaleString('id-ID')} Kartu →</p>
              </div>
            </Link>

            {/* Spell Cards */}
            <Link href="/album?typeId=5" className="group">
              <div className="bg-gradient-to-br from-slate-900 via-emerald-950/40 to-slate-950 border border-slate-800 dark:border-emerald-500/10 p-6 sm:p-8 rounded-2xl text-white text-center hover:scale-105 transition duration-300 hover:border-emerald-500/40 hover:shadow-lg hover:shadow-emerald-500/10 h-full flex flex-col justify-between">
                <div>
                  <div className="text-5xl mb-4 drop-shadow-[0_0_10px_rgba(16,185,129,0.3)]">✨</div>
                  <h3 className="text-xl sm:text-2xl font-bold mb-2 text-emerald-400 group-hover:text-emerald-300">Spell</h3>
                  <p className="text-sm text-gray-400">Aktifkan mantra sihir untuk mengubah jalannya duel, menambah ATK, atau menghancurkan lawan.</p>
                </div>
                <p className="text-sm mt-5 text-emerald-500 group-hover:text-emerald-400 font-semibold group-hover:underline">Lihat {stats.spells.toLocaleString('id-ID')} Kartu →</p>
              </div>
            </Link>

            {/* Trap Cards */}
            <Link href="/album?typeId=6" className="group">
              <div className="bg-gradient-to-br from-slate-900 via-purple-950/40 to-slate-950 border border-slate-800 dark:border-purple-500/10 p-6 sm:p-8 rounded-2xl text-white text-center hover:scale-105 transition duration-300 hover:border-purple-500/40 hover:shadow-lg hover:shadow-purple-500/10 h-full flex flex-col justify-between">
                <div>
                  <div className="text-5xl mb-4 drop-shadow-[0_0_10px_rgba(139,92,246,0.3)]">🛡️</div>
                  <h3 className="text-xl sm:text-2xl font-bold mb-2 text-purple-400 group-hover:text-purple-300">Trap</h3>
                  <p className="text-sm text-gray-400">Pasang jebakan tak terduga di baris belakang untuk mengecoh strategi penyerangan lawan.</p>
                </div>
                <p className="text-sm mt-5 text-purple-500 group-hover:text-purple-400 font-semibold group-hover:underline">Lihat {stats.traps.toLocaleString('id-ID')} Kartu →</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Attributes Section */}
      <section className="py-16 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-wider yugioh-glow-text uppercase">🔥 Element Attributes</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base mt-2">Filter langsung koleksi Monster berdasarkan atribut elemen dasarnya</p>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-3 max-w-4xl mx-auto">
            <Link href="/album?typeId=4&attribute=FIRE" className="bg-gradient-to-br from-orange-500 to-red-500 p-4 rounded-xl text-center text-white hover:scale-110 hover:-rotate-2 transition duration-250 shadow-md shadow-orange-500/10">
              <div className="text-3xl mb-1.5">🔥</div>
              <p className="font-extrabold text-xs tracking-wider">FIRE</p>
            </Link>
            <Link href="/album?typeId=4&attribute=WATER" className="bg-gradient-to-br from-blue-500 to-cyan-500 p-4 rounded-xl text-center text-white hover:scale-110 hover:rotate-2 transition duration-250 shadow-md shadow-blue-500/10">
              <div className="text-3xl mb-1.5">💧</div>
              <p className="font-extrabold text-xs tracking-wider">WATER</p>
            </Link>
            <Link href="/album?typeId=4&attribute=EARTH" className="bg-gradient-to-br from-yellow-600 to-amber-600 p-4 rounded-xl text-center text-white hover:scale-110 hover:-rotate-2 transition duration-250 shadow-md shadow-amber-600/10">
              <div className="text-3xl mb-1.5">🌍</div>
              <p className="font-extrabold text-xs tracking-wider">EARTH</p>
            </Link>
            <Link href="/album?typeId=4&attribute=WIND" className="bg-gradient-to-br from-green-400 to-emerald-500 p-4 rounded-xl text-center text-white hover:scale-110 hover:rotate-2 transition duration-250 shadow-md shadow-emerald-500/10">
              <div className="text-3xl mb-1.5">💨</div>
              <p className="font-extrabold text-xs tracking-wider">WIND</p>
            </Link>
            <Link href="/album?typeId=4&attribute=LIGHT" className="bg-gradient-to-br from-yellow-300 to-yellow-500 p-4 rounded-xl text-center text-slate-900 hover:scale-110 hover:-rotate-2 transition duration-250 shadow-md shadow-yellow-500/10">
              <div className="text-3xl mb-1.5">☀️</div>
              <p className="font-extrabold text-xs tracking-wider">LIGHT</p>
            </Link>
            <Link href="/album?typeId=4&attribute=DARK" className="bg-gradient-to-br from-purple-600 to-gray-800 p-4 rounded-xl text-center text-white hover:scale-110 hover:rotate-2 transition duration-250 shadow-md shadow-purple-600/10">
              <div className="text-3xl mb-1.5">🌑</div>
              <p className="font-extrabold text-xs tracking-wider">DARK</p>
            </Link>
            <Link href="/album?typeId=4&attribute=DIVINE" className="bg-gradient-to-br from-amber-300 to-yellow-400 p-4 rounded-xl text-center text-slate-900 hover:scale-110 hover:-rotate-2 transition duration-250 shadow-md shadow-amber-300/10">
              <div className="text-3xl mb-1.5">⭐</div>
              <p className="font-extrabold text-xs tracking-wider">DIVINE</p>
            </Link>
          </div>

          <p className="text-center text-gray-500 dark:text-gray-400 text-xs sm:text-sm mt-5 italic">
            💡 Filter Attribute hanya menampilkan kartu Monster
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 text-gray-400 py-10 border-t border-slate-900">
        <div className="container mx-auto px-4 text-center">
          <img src="/images/logo.png" alt="YuGi Pedia" className="h-16 mx-auto mb-2 object-contain" />
          <p className="text-lg font-bold text-white tracking-wider uppercase">YuGi Pedia</p>
          <p className="text-xs sm:text-sm mt-2 max-w-xl mx-auto leading-relaxed text-gray-500">
            YuGi Pedia adalah koleksi kartu Yu-Gi-Oh! terlengkap di Indonesia dengan fitur lengkap meliputi album kartu, filter Monster/Spell/Trap, cek harga real-time dari berbagai marketplace, dan dark mode. Didukung database PostgreSQL dan API YGOPRODeck untuk data terkini.
          </p>
          <div className="mt-6 pt-5 border-t border-slate-900">
            <p className="text-xs text-gray-600 font-semibold tracking-wider">Built with Next.js + PostgreSQL (Neon)</p>
          </div>
          <p className="text-[10px] mt-2 text-gray-700">© 2026 YuGi Pedia. All rights reserved.</p>
        </div>
      </footer>
    </main>
  )
}
