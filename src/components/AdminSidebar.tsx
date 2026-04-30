'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'
import { Home, CreditCard, FolderOpen, Users, LogOut, LayoutDashboard } from 'lucide-react'

export default function AdminSidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()

  const navItems = [
    { href: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/admin/cards', icon: CreditCard, label: 'Cards' },
    { href: '/admin/categories', icon: FolderOpen, label: 'Categories' },
  ]

  return (
    <aside className="admin-sidebar">
      {/* Logo */}
      <div className="p-6 border-b border-slate-700">
        <Link href="/" className="flex items-center gap-3">
          <span className="text-4xl">🎴</span>
          <div>
            <p className="font-bold text-lg">Admin Panel</p>
            <p className="text-xs text-gray-400">YuGi Pedia</p>
          </div>
        </Link>
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-slate-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center text-slate-900 font-bold">
            {session?.user?.name?.charAt(0) || 'A'}
          </div>
          <div>
            <p className="font-semibold text-sm">{session?.user?.name || 'Admin'}</p>
            <p className="text-xs text-gray-400">{session?.user?.email}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href)
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                    isActive
                      ? 'bg-yellow-500 text-slate-900 font-bold'
                      : 'hover:bg-slate-800'
                  }`}
                >
                  <item.icon size={20} />
                  <span>{item.label}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Bottom Actions */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-700 space-y-1">
        <Link
          href="/"
          className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 transition"
        >
          🌐 Lihat Website
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-500/20 transition w-full text-left text-red-400"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  )
}
