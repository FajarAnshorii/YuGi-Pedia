'use client'

import Link from 'next/link'
import { Menu, Sun, Moon, ChevronDown } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useTheme } from './ThemeProvider'

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
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
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-1.5 sm:gap-2.5 hover:opacity-90 transition select-none">
            <img src="/images/logo.png" alt="Logo" className="w-7 h-7 sm:w-10 sm:h-10 object-contain drop-shadow-[0_0_8px_rgba(234,179,8,0.3)]" />
            <div className="flex flex-col justify-center">
              <span className="font-extrabold text-[13px] sm:text-xl tracking-wider bg-gradient-to-r from-white via-yellow-200 to-white bg-clip-text text-transparent uppercase leading-tight">YuGi Pedia</span>
              <p className="text-[7px] sm:text-[10px] text-yellow-400 font-extrabold tracking-widest leading-none mt-0.5">
                {cardCount !== null ? `${cardCount.toLocaleString('id-ID')} Cards` : '14.523 Cards'}
              </p>
            </div>
          </Link>
 
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1.5">
            <Link
              href="/"
              className="px-3 py-2 rounded-lg hover:bg-slate-700/50 transition font-bold text-xs uppercase tracking-wide"
            >
              Home
            </Link>
            <Link
              href="/album"
              className="px-3 py-2 rounded-lg hover:bg-slate-700/50 transition font-bold text-xs uppercase tracking-wide"
            >
              Album
            </Link>
            <Link
              href="/booster-pack"
              className="px-3 py-2 rounded-lg hover:bg-slate-700/50 transition font-bold text-xs uppercase tracking-wide text-yellow-400"
            >
              Booster Pack
            </Link>
            <Link
              href="/deck-builder"
              className="px-3 py-2 rounded-lg hover:bg-slate-700/50 transition font-bold text-xs uppercase tracking-wide"
            >
              Deck Builder
            </Link>
            <Link
              href="/banlist"
              className="px-3 py-2 rounded-lg hover:bg-slate-700/50 transition font-bold text-xs uppercase tracking-wide"
            >
              Banlist
            </Link>
            <Link
              href="/compare"
              className="px-3 py-2 rounded-lg hover:bg-slate-700/50 transition font-bold text-xs uppercase tracking-wide"
            >
              Comparer
            </Link>
            <Link
              href="/quiz"
              className="px-3 py-2 rounded-lg hover:bg-slate-700/50 transition font-bold text-xs uppercase tracking-wide"
            >
              Quiz
            </Link>
            <Link
              href="/market"
              className="px-3 py-2 rounded-lg hover:bg-slate-700/50 transition font-bold text-xs uppercase tracking-wide"
            >
              Market
            </Link>
 
            {/* PRE-DRAFT DROPDOWN FOR NEW FEATURES */}
            <div 
              className="relative"
              onMouseEnter={() => setIsDropdownOpen(true)}
              onMouseLeave={() => setIsDropdownOpen(false)}
            >
              <button
                className="px-3 py-2 rounded-lg hover:bg-slate-700/50 transition font-bold text-xs uppercase tracking-wide flex items-center gap-1 bg-yellow-500/10 border border-yellow-500/20 text-yellow-400"
              >
                <span>Jelajah</span>
                <ChevronDown size={12} className={`transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
 
              {isDropdownOpen && (
                <div className="absolute right-0 top-full mt-1.5 w-52 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-1.5 duration-100">
                  <Link
                    href="/meta-decks"
                    className="block px-4 py-2.5 hover:bg-slate-800 text-xs font-bold text-gray-200 hover:text-white uppercase tracking-wider transition"
                  >
                    Meta Decks
                  </Link>
                  <Link
                    href="/archetypes"
                    className="block px-4 py-2.5 hover:bg-slate-800 text-xs font-bold text-gray-200 hover:text-white uppercase tracking-wider transition"
                  >
                    Archetypes
                  </Link>
                  <Link
                    href="/lore"
                    className="block px-4 py-2.5 hover:bg-slate-800 text-xs font-bold text-gray-200 hover:text-white uppercase tracking-wider transition"
                  >
                    Story Hub
                  </Link>
                  <Link
                    href="/rarity"
                    className="block px-4 py-2.5 hover:bg-slate-800 text-xs font-bold text-gray-200 hover:text-white uppercase tracking-wider transition"
                  >
                    Rarity Guide
                  </Link>
                </div>
              )}
            </div>
          </div>
  
          {/* Right side */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-1.5 sm:p-2 rounded-lg hover:bg-slate-700/50 transition"
              title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
            >
              {theme === 'light' ? (
                <Moon size={16} className="text-yellow-300 sm:w-[20px] sm:h-[20px]" />
              ) : (
                <Sun size={16} className="text-yellow-400 sm:w-[20px] sm:h-[20px]" />
              )}
            </button>
  
            {/* Mobile menu button */}
            <button
              className="lg:hidden p-1.5 sm:p-2 rounded-lg hover:bg-slate-700 transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu size={20} className="sm:size-6" />
            </button>
          </div>
        </div>
 
        {/* Mobile menu drawer */}
        {isMenuOpen && (
          <div className="lg:hidden pb-4 border-t border-slate-700/50 animate-in fade-in slide-in-from-top-2 duration-150">
            <div className="flex flex-col gap-1 mt-3 max-h-[75vh] overflow-y-auto">
              <Link
                href="/"
                onClick={() => setIsMenuOpen(false)}
                className="px-4 py-3 rounded-lg hover:bg-slate-700/50 transition flex items-center gap-2 font-bold text-sm uppercase tracking-wide"
              >
                Home
              </Link>
              <Link
                href="/album"
                onClick={() => setIsMenuOpen(false)}
                className="px-4 py-3 rounded-lg hover:bg-slate-700/50 transition flex items-center gap-2 font-bold text-sm uppercase tracking-wide"
              >
                Album
              </Link>
              <Link
                href="/booster-pack"
                onClick={() => setIsMenuOpen(false)}
                className="px-4 py-3 rounded-lg hover:bg-slate-700/50 transition flex items-center gap-2 text-yellow-400 font-extrabold text-sm uppercase tracking-wide"
              >
                Booster Pack
              </Link>
              <Link
                href="/deck-builder"
                onClick={() => setIsMenuOpen(false)}
                className="px-4 py-3 rounded-lg hover:bg-slate-700/50 transition flex items-center gap-2 font-bold text-sm uppercase tracking-wide"
              >
                Deck Builder
              </Link>
              <Link
                href="/banlist"
                onClick={() => setIsMenuOpen(false)}
                className="px-4 py-3 rounded-lg hover:bg-slate-700/50 transition flex items-center gap-2 font-bold text-sm uppercase tracking-wide"
              >
                Banlist
              </Link>
              <Link
                href="/compare"
                onClick={() => setIsMenuOpen(false)}
                className="px-4 py-3 rounded-lg hover:bg-slate-700/50 transition flex items-center gap-2 font-bold text-sm uppercase tracking-wide"
              >
                Card Comparer
              </Link>
              <Link
                href="/quiz"
                onClick={() => setIsMenuOpen(false)}
                className="px-4 py-3 rounded-lg hover:bg-slate-700/50 transition flex items-center gap-2 font-bold text-sm uppercase tracking-wide"
              >
                Trivia Quiz
              </Link>
              <Link
                href="/market"
                onClick={() => setIsMenuOpen(false)}
                className="px-4 py-3 rounded-lg hover:bg-slate-700/50 transition flex items-center gap-2 font-bold text-sm uppercase tracking-wide"
              >
                Market
              </Link>

              {/* Mobile Explicit links */}
              <div className="border-t border-slate-800/80 my-2 pt-2">
                <Link
                  href="/meta-decks"
                  onClick={() => setIsMenuOpen(false)}
                  className="px-4 py-3 rounded-lg hover:bg-slate-700/50 transition flex items-center gap-2 font-bold text-sm uppercase text-yellow-400/90 tracking-wide"
                >
                  Meta Decks
                </Link>
                <Link
                  href="/archetypes"
                  onClick={() => setIsMenuOpen(false)}
                  className="px-4 py-3 rounded-lg hover:bg-slate-700/50 transition flex items-center gap-2 font-bold text-sm uppercase text-yellow-400/90 tracking-wide"
                >
                  Archetypes
                </Link>
                <Link
                  href="/lore"
                  onClick={() => setIsMenuOpen(false)}
                  className="px-4 py-3 rounded-lg hover:bg-slate-700/50 transition flex items-center gap-2 font-bold text-sm uppercase text-yellow-400/90 tracking-wide"
                >
                  Story Hub
                </Link>
                <Link
                  href="/rarity"
                  onClick={() => setIsMenuOpen(false)}
                  className="px-4 py-3 rounded-lg hover:bg-slate-700/50 transition flex items-center gap-2 font-bold text-sm uppercase text-yellow-400/90 tracking-wide"
                >
                  Rarity Guide
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
