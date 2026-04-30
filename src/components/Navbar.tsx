'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { User, LogOut, Menu, Sun, Moon } from 'lucide-react'
import { useState } from 'react'
import { useTheme } from './ThemeProvider'

export default function Navbar() {
  const { data: session } = useSession()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { theme, toggleTheme } = useTheme()

  return (
    <nav className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white shadow-xl sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition">
            <img src="/images/logo.png" alt="YuGi Pedia" className="h-10 w-auto object-contain" />
            <div>
              <span className="font-bold text-xl tracking-tight">YuGi Pedia</span>
              <p className="text-xs text-gray-400">13,396 Cards</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            <Link
              href="/"
              className="px-4 py-2 rounded-lg hover:bg-slate-700/50 transition font-medium"
            >
              🏠 Home
            </Link>
            <Link
              href="/album"
              className="px-4 py-2 rounded-lg hover:bg-slate-700/50 transition font-medium"
            >
              🃏 Album
            </Link>
            <Link
              href="/album?typeId=4"
              className="px-4 py-2 rounded-lg hover:bg-slate-700/50 transition font-medium"
            >
              👹 Monster
            </Link>
            <Link
              href="/album?typeId=5"
              className="px-4 py-2 rounded-lg hover:bg-slate-700/50 transition font-medium"
            >
              ✨ Spell
            </Link>
            <Link
              href="/album?typeId=6"
              className="px-4 py-2 rounded-lg hover:bg-slate-700/50 transition font-medium"
            >
              🛡️ Trap
            </Link>
            <Link
              href="/market"
              className="px-4 py-2 rounded-lg hover:bg-slate-700/50 transition font-medium"
            >
              📊 Market
            </Link>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-slate-700/50 transition"
              title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
            >
              {theme === 'light' ? (
                <Moon size={20} className="text-yellow-300" />
              ) : (
                <Sun size={20} className="text-yellow-400" />
              )}
            </button>

            {session?.user ? (
              <div className="flex items-center gap-3">
                {session.user.role === 'admin' && (
                  <Link
                    href="/admin/dashboard"
                    className="hidden sm:block bg-yellow-500 text-slate-900 px-4 py-2 rounded-lg font-bold hover:bg-yellow-400 transition text-sm"
                  >
                    ⚙️ Admin
                  </Link>
                )}
                <button
                  onClick={() => signOut()}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-red-500/20 text-red-400 hover:text-red-300 transition"
                >
                  <LogOut size={18} />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-2 bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-500 transition font-medium"
              >
                <User size={18} />
                <span>Login</span>
              </Link>
            )}

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-slate-700"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu size={24} />
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden pb-4 border-t border-slate-700">
            <div className="flex flex-col gap-1 mt-3">
              <Link href="/" className="px-4 py-3 rounded-lg hover:bg-slate-700">
                🏠 Home
              </Link>
              <Link href="/album" className="px-4 py-3 rounded-lg hover:bg-slate-700">
                🃏 Album
              </Link>
              <Link href="/album?typeId=4" className="px-4 py-3 rounded-lg hover:bg-slate-700">
                👹 Monster Cards
              </Link>
              <Link href="/album?typeId=5" className="px-4 py-3 rounded-lg hover:bg-slate-700">
                ✨ Spell Cards
              </Link>
              <Link href="/album?typeId=6" className="px-4 py-3 rounded-lg hover:bg-slate-700">
                🛡️ Trap Cards
              </Link>
              <Link href="/market" className="px-4 py-3 rounded-lg hover:bg-slate-700">
                📊 Market
              </Link>
              {/* Mobile theme toggle */}
              <button
                onClick={toggleTheme}
                className="px-4 py-3 rounded-lg hover:bg-slate-700 flex items-center gap-2"
              >
                {theme === 'light' ? (
                  <>
                    <Moon size={18} className="text-yellow-300" />
                    Dark Mode
                  </>
                ) : (
                  <>
                    <Sun size={18} className="text-yellow-400" />
                    Light Mode
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
