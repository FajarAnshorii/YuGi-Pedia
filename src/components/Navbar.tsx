'use client'

import Link from 'next/link'
import { Menu, Sun, Moon } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useTheme } from './ThemeProvider'

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { theme, toggleTheme } = useTheme()
  const [cardCount, setCardCount] = useState<number | null>(null)

  useEffect(() => {
    fetch('/api/cards/count')
      .then(res => res.json())
      .then(data => {
        if (typeof data.count === 'number') {
          setCardCount(data.count)
        }
      })
      .catch(err => console.error('Failed to fetch card count:', err))
  }, [])

  return (
    <nav className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white shadow-xl sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 sm:gap-3 hover:opacity-90 transition">
            <img src="/images/logo.png" alt="YuGi Pedia" className="h-9 sm:h-10 w-auto object-contain" />
            <div>
              <span className="font-bold text-lg sm:text-xl tracking-tight">YuGi Pedia</span>
              <p className="text-[10px] sm:text-xs text-gray-400 hidden sm:block">
                {cardCount !== null ? `${cardCount.toLocaleString('id-ID')} Cards` : '14,523 Cards'}
              </p>
            </div>
          </Link>
 
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            <Link
              href="/"
              className="px-4 py-2 rounded-lg hover:bg-slate-700/50 transition font-medium text-sm"
            >
              🏠 Home
            </Link>
            <Link
              href="/album"
              className="px-4 py-2 rounded-lg hover:bg-slate-700/50 transition font-medium text-sm"
            >
              🃏 Album
            </Link>
            <Link
              href="/album?typeId=4"
              className="px-4 py-2 rounded-lg hover:bg-slate-700/50 transition font-medium text-sm"
            >
              👹 Monster
            </Link>
            <Link
              href="/album?typeId=5"
              className="px-4 py-2 rounded-lg hover:bg-slate-700/50 transition font-medium text-sm"
            >
              ✨ Spell
            </Link>
            <Link
              href="/album?typeId=6"
              className="px-4 py-2 rounded-lg hover:bg-slate-700/50 transition font-medium text-sm"
            >
              🛡️ Trap
            </Link>
            <Link
              href="/booster-pack"
              className="px-4 py-2 rounded-lg hover:bg-slate-700/50 transition font-medium text-sm text-yellow-400"
            >
              📦 Booster Pack
            </Link>
            <Link
              href="/market"
              className="px-4 py-2 rounded-lg hover:bg-slate-700/50 transition font-medium text-sm"
            >
              📊 Market
            </Link>
          </div>
 
          {/* Right side */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-slate-700/50 transition"
              title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
            >
              {theme === 'light' ? (
                <Moon size={18} className="text-yellow-300 sm:w-[20px] sm:h-[20px]" />
              ) : (
                <Sun size={18} className="text-yellow-400 sm:w-[20px] sm:h-[20px]" />
              )}
            </button>
 
            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-slate-700 transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
 
        {/* Mobile menu drawer */}
        {isMenuOpen && (
          <div className="md:hidden pb-4 border-t border-slate-700/50 animate-in fade-in slide-in-from-top-2 duration-150">
            <div className="flex flex-col gap-1 mt-3">
              <Link
                href="/"
                onClick={() => setIsMenuOpen(false)}
                className="px-4 py-3 rounded-lg hover:bg-slate-700/50 transition flex items-center gap-2"
              >
                <span>🏠</span> Home
              </Link>
              <Link
                href="/album"
                onClick={() => setIsMenuOpen(false)}
                className="px-4 py-3 rounded-lg hover:bg-slate-700/50 transition flex items-center gap-2"
              >
                <span>🃏</span> Album
              </Link>
              <Link
                href="/album?typeId=4"
                onClick={() => setIsMenuOpen(false)}
                className="px-4 py-3 rounded-lg hover:bg-slate-700/50 transition flex items-center gap-2"
              >
                <span>👹</span> Monster Cards
              </Link>
              <Link
                href="/album?typeId=5"
                onClick={() => setIsMenuOpen(false)}
                className="px-4 py-3 rounded-lg hover:bg-slate-700/50 transition flex items-center gap-2"
              >
                <span>✨</span> Spell Cards
              </Link>
              <Link
                href="/album?typeId=6"
                onClick={() => setIsMenuOpen(false)}
                className="px-4 py-3 rounded-lg hover:bg-slate-700/50 transition flex items-center gap-2"
              >
                <span>🛡️</span> Trap Cards
              </Link>
              <Link
                href="/booster-pack"
                onClick={() => setIsMenuOpen(false)}
                className="px-4 py-3 rounded-lg hover:bg-slate-700/50 transition flex items-center gap-2 text-yellow-400 font-bold"
              >
                <span>📦</span> Booster Pack
              </Link>
              <Link
                href="/market"
                onClick={() => setIsMenuOpen(false)}
                className="px-4 py-3 rounded-lg hover:bg-slate-700/50 transition flex items-center gap-2"
              >
                <span>📊</span> Market
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
