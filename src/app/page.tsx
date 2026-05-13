import Link from 'next/link'
import Navbar from '@/components/Navbar'

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-slate-900 text-white py-20 px-4 overflow-hidden">
        {/* Background Image - positioned absolute */}
        <div className="absolute inset-0">
          <img
            src="/images/hero-bg.jpg"
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
        {/* Dark overlay with 80% opacity */}
        <div className="absolute inset-0 bg-black/80"></div>
        {/* Content */}
        <div className="container mx-auto text-center max-w-4xl relative z-10">
          <div className="mb-6">
            <img src="/images/logo.png" alt="YuGi Pedia" className="h-32 mx-auto object-contain" />
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4 yugioh-glow-text tracking-wider uppercase">
            YuGi Pedia
          </h1>
          <p className="text-xl text-gray-300 mb-2">
            Koleksi kartu Yu-Gi-Oh! terlengkap di Indonesia
          </p>
          <p className="text-lg text-yellow-400 font-semibold mb-8">
            📊 13,396 Kartu | Monster • Spell • Trap
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/album"
              className="px-5 py-3 sm:px-8 sm:py-4 bg-yellow-500 text-slate-900 rounded-xl font-bold text-sm sm:text-lg hover:bg-yellow-400 transition shadow-lg shadow-yellow-500/30"
            >
              🃏 Lihat Semua Kartu
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white dark:bg-slate-900/40 border-b border-gray-100 dark:border-slate-800/40">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 text-center">
            <div className="p-6 bg-gradient-to-br from-red-50 to-red-100 dark:from-slate-900/60 dark:to-slate-950/60 dark:border dark:border-red-500/20 dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.02)] rounded-xl">
              <div className="text-4xl mb-2 drop-shadow-[0_0_8px_rgba(239,68,68,0.2)]">👹</div>
              <p className="text-3xl font-bold text-red-600 dark:text-red-400">8,724</p>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Monster Cards</p>
            </div>
            <div className="p-6 bg-gradient-to-br from-green-50 to-green-100 dark:from-slate-900/60 dark:to-slate-950/60 dark:border dark:border-green-500/20 dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.02)] rounded-xl">
              <div className="text-4xl mb-2 drop-shadow-[0_0_8px_rgba(16,185,129,0.2)]">✨</div>
              <p className="text-3xl font-bold text-green-600 dark:text-green-400">2,688</p>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Spell Cards</p>
            </div>
            <div className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-slate-900/60 dark:to-slate-950/60 dark:border dark:border-purple-500/20 dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.02)] rounded-xl">
              <div className="text-4xl mb-2 drop-shadow-[0_0_8px_rgba(139,92,246,0.2)]">🛡️</div>
              <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">1,984</p>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Trap Cards</p>
            </div>
            <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-slate-900/60 dark:to-slate-950/60 dark:border dark:border-blue-500/20 dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.02)] rounded-xl">
              <div className="text-4xl mb-2 drop-shadow-[0_0_8px_rgba(59,130,246,0.2)]">📦</div>
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">33,989</p>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Card Sets</p>
            </div>
          </div>
        </div>
      </section>

      {/* Card Type Categories - SEPARATED */}
      <section className="py-12 bg-gray-50 dark:bg-slate-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-center mb-8 tracking-wider yugioh-glow-text">📂 Kategori Kartu</h2>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6 max-w-5xl mx-auto">
            {/* Monster Cards */}
            <Link href="/album?typeId=4" className="group">
              <div className="bg-gradient-to-br from-slate-900 via-red-950/80 to-slate-950 border border-amber-600/10 dark:border-red-500/20 p-4 sm:p-8 rounded-xl sm:rounded-2xl text-white text-center hover:scale-105 transition hover:border-red-500 hover:shadow-lg hover:shadow-red-500/20 h-full flex flex-col justify-between">
                <div>
                  <div className="text-4xl sm:text-6xl mb-2 sm:mb-4 drop-shadow-[0_0_10px_rgba(239,68,68,0.3)]">👹</div>
                  <h3 className="text-base sm:text-2xl font-bold mb-1 sm:mb-2 text-red-400 group-hover:text-red-300">Monster</h3>
                  <p className="text-xs sm:text-base text-gray-400">8,724 kartu</p>
                </div>
                <p className="text-[10px] sm:text-sm mt-3 sm:mt-4 text-red-500 group-hover:text-red-400 font-semibold group-hover:underline">Lihat semua →</p>
              </div>
            </Link>

            {/* Spell Cards */}
            <Link href="/album?typeId=5" className="group">
              <div className="bg-gradient-to-br from-slate-900 via-emerald-950/80 to-slate-950 border border-amber-600/10 dark:border-emerald-500/20 p-4 sm:p-8 rounded-xl sm:rounded-2xl text-white text-center hover:scale-105 transition hover:border-emerald-500 hover:shadow-lg hover:shadow-emerald-500/20 h-full flex flex-col justify-between">
                <div>
                  <div className="text-4xl sm:text-6xl mb-2 sm:mb-4 drop-shadow-[0_0_10px_rgba(16,185,129,0.3)]">✨</div>
                  <h3 className="text-base sm:text-2xl font-bold mb-1 sm:mb-2 text-emerald-400 group-hover:text-emerald-300">Spell</h3>
                  <p className="text-xs sm:text-base text-gray-400">2,688 kartu</p>
                </div>
                <p className="text-[10px] sm:text-sm mt-3 sm:mt-4 text-emerald-500 group-hover:text-emerald-400 font-semibold group-hover:underline">Lihat semua →</p>
              </div>
            </Link>

            {/* Trap Cards */}
            <Link href="/album?typeId=6" className="group col-span-2 md:col-span-1">
              <div className="bg-gradient-to-br from-slate-900 via-purple-950/80 to-slate-950 border border-amber-600/10 dark:border-purple-500/20 p-4 sm:p-8 rounded-xl sm:rounded-2xl text-white text-center hover:scale-105 transition hover:border-purple-500 hover:shadow-lg hover:shadow-purple-500/20 h-full flex flex-col justify-between">
                <div>
                  <div className="text-4xl sm:text-6xl mb-2 sm:mb-4 drop-shadow-[0_0_10px_rgba(139,92,246,0.3)]">🛡️</div>
                  <h3 className="text-base sm:text-2xl font-bold mb-1 sm:mb-2 text-purple-400 group-hover:text-purple-300">Trap</h3>
                  <p className="text-xs sm:text-base text-gray-400">1,984 kartu</p>
                </div>
                <p className="text-[10px] sm:text-sm mt-3 sm:mt-4 text-purple-500 group-hover:text-purple-400 font-semibold group-hover:underline">Lihat semua →</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Attributes Section */}
      <section className="py-12 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-center mb-8 tracking-wider yugioh-glow-text">🔥💧🌍 Element Attributes</h2>

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-3 max-w-4xl mx-auto">
            <Link href="/album?typeId=4&attribute=FIRE" className="bg-gradient-to-br from-orange-500 to-red-500 p-4 rounded-xl text-center text-white hover:scale-105 transition">
              <div className="text-3xl mb-1">🔥</div>
              <p className="font-bold text-sm">FIRE</p>
            </Link>
            <Link href="/album?typeId=4&attribute=WATER" className="bg-gradient-to-br from-blue-500 to-cyan-500 p-4 rounded-xl text-center text-white hover:scale-105 transition">
              <div className="text-3xl mb-1">💧</div>
              <p className="font-bold text-sm">WATER</p>
            </Link>
            <Link href="/album?typeId=4&attribute=EARTH" className="bg-gradient-to-br from-yellow-600 to-amber-600 p-4 rounded-xl text-center text-white hover:scale-105 transition">
              <div className="text-3xl mb-1">🌍</div>
              <p className="font-bold text-sm">EARTH</p>
            </Link>
            <Link href="/album?typeId=4&attribute=WIND" className="bg-gradient-to-br from-green-400 to-emerald-500 p-4 rounded-xl text-center text-white hover:scale-105 transition">
              <div className="text-3xl mb-1">💨</div>
              <p className="font-bold text-sm">WIND</p>
            </Link>
            <Link href="/album?typeId=4&attribute=LIGHT" className="bg-gradient-to-br from-yellow-300 to-yellow-500 p-4 rounded-xl text-center text-slate-900 hover:scale-105 transition">
              <div className="text-3xl mb-1">☀️</div>
              <p className="font-bold text-sm">LIGHT</p>
            </Link>
            <Link href="/album?typeId=4&attribute=DARK" className="bg-gradient-to-br from-purple-600 to-gray-800 p-4 rounded-xl text-center text-white hover:scale-105 transition">
              <div className="text-3xl mb-1">🌑</div>
              <p className="font-bold text-sm">DARK</p>
            </Link>
            <Link href="/album?typeId=4&attribute=DIVINE" className="bg-gradient-to-br from-amber-300 to-yellow-400 p-4 rounded-xl text-center text-slate-900 hover:scale-105 transition">
              <div className="text-3xl mb-1">⭐</div>
              <p className="font-bold text-sm">DIVINE</p>
            </Link>
          </div>

          <p className="text-center text-gray-500 dark:text-gray-400 text-sm mt-4">
            💡 Filter Attribute hanya menampilkan kartu Monster
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-gray-400 py-8">
        <div className="container mx-auto px-4 text-center">
          <img src="/images/logo.png" alt="YuGi Pedia" className="h-16 mx-auto mb-2 object-contain" />
          <p className="text-lg font-semibold text-white">YuGi Pedia</p>
          <p className="text-sm mt-2 max-w-xl mx-auto">
            YuGi Pedia adalah koleksi kartu Yu-Gi-Oh! terlengkap di Indonesia dengan fitur lengkap meliputi album kartu, filter Monster/Spell/Trap, cek harga real-time dari berbagai marketplace, dan dark mode. Didukung database PostgreSQL dan API YGOPRODeck untuk data terkini.
          </p>
          <div className="mt-4 pt-4 border-t border-slate-700">
            <p className="text-sm">Built with Next.js + PostgreSQL (Neon)</p>
          </div>
          <p className="text-xs mt-4 text-gray-500">© 2026 YuGi Pedia</p>
        </div>
      </footer>
    </main>
  )
}
