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
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
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
              className="px-8 py-4 bg-yellow-500 text-slate-900 rounded-xl font-bold text-lg hover:bg-yellow-400 transition shadow-lg shadow-yellow-500/30"
            >
              🃏 Lihat Semua Kartu
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white dark:bg-slate-800">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-6 bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/30 dark:to-red-800/30 rounded-xl">
              <div className="text-4xl mb-2">👹</div>
              <p className="text-3xl font-bold text-red-600 dark:text-red-400">8,724</p>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Monster Cards</p>
            </div>
            <div className="p-6 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 rounded-xl">
              <div className="text-4xl mb-2">✨</div>
              <p className="text-3xl font-bold text-green-600 dark:text-green-400">2,688</p>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Spell Cards</p>
            </div>
            <div className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 rounded-xl">
              <div className="text-4xl mb-2">🛡️</div>
              <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">1,984</p>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Trap Cards</p>
            </div>
            <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 rounded-xl">
              <div className="text-4xl mb-2">📦</div>
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">33,989</p>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Card Sets</p>
            </div>
          </div>
        </div>
      </section>

      {/* Card Type Categories - SEPARATED */}
      <section className="py-12 bg-gray-50 dark:bg-slate-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8 text-slate-900 dark:text-white">📂 Kategori Kartu</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Monster Cards */}
            <Link href="/album?typeId=4" className="group">
              <div className="bg-gradient-to-br from-red-500 to-red-600 p-8 rounded-2xl text-white text-center hover:scale-105 transition shadow-lg h-full">
                <div className="text-6xl mb-4">👹</div>
                <h3 className="text-2xl font-bold mb-2">Monster Cards</h3>
                <p className="text-red-100">8,724 kartu</p>
                <p className="text-sm mt-4 text-red-200 group-hover:underline">Lihat semua Monster →</p>
              </div>
            </Link>

            {/* Spell Cards */}
            <Link href="/album?typeId=5" className="group">
              <div className="bg-gradient-to-br from-green-500 to-green-600 p-8 rounded-2xl text-white text-center hover:scale-105 transition shadow-lg h-full">
                <div className="text-6xl mb-4">✨</div>
                <h3 className="text-2xl font-bold mb-2">Spell Cards</h3>
                <p className="text-green-100">2,688 kartu</p>
                <p className="text-sm mt-4 text-green-200 group-hover:underline">Lihat semua Spell →</p>
              </div>
            </Link>

            {/* Trap Cards */}
            <Link href="/album?typeId=6" className="group">
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-8 rounded-2xl text-white text-center hover:scale-105 transition shadow-lg h-full">
                <div className="text-6xl mb-4">🛡️</div>
                <h3 className="text-2xl font-bold mb-2">Trap Cards</h3>
                <p className="text-purple-100">1,984 kartu</p>
                <p className="text-sm mt-4 text-purple-200 group-hover:underline">Lihat semua Trap →</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Attributes Section */}
      <section className="py-12 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8 text-slate-900 dark:text-white">🔥💧🌍 Element Attributes</h2>

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
