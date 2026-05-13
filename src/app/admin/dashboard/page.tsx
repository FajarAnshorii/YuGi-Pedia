import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { CreditCard, FolderOpen, Users } from 'lucide-react'

export default async function AdminDashboard() {
  const [totalCards, totalCategories, recentCards] = await Promise.all([
    prisma.card.count(),
    prisma.category.count(),
    prisma.card.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        type: true,
        attribute: true,
      },
    }),
  ])

  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-900 mb-8">📊 Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Total Cards</p>
              <p className="text-4xl font-bold text-slate-900 dark:text-white">{totalCards.toLocaleString()}</p>
            </div>
            <div className="bg-blue-100 dark:bg-blue-900/30 p-4 rounded-full">
              <CreditCard className="text-blue-600 dark:text-blue-400" size={32} />
            </div>
          </div>
          <Link href="/admin/cards" className="text-blue-500 dark:text-blue-400 text-sm hover:underline mt-4 inline-block">
            Lihat semua →
          </Link>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Categories</p>
              <p className="text-4xl font-bold text-slate-900 dark:text-white">{totalCategories}</p>
            </div>
            <div className="bg-green-100 dark:bg-green-900/30 p-4 rounded-full">
              <FolderOpen className="text-green-600 dark:text-green-400" size={32} />
            </div>
          </div>
          <Link href="/admin/categories" className="text-green-500 dark:text-green-400 text-sm hover:underline mt-4 inline-block">
            Kelola →
          </Link>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Monster Cards</p>
              <p className="text-4xl font-bold text-slate-900 dark:text-white">
                {Math.round(totalCards * 0.65).toLocaleString()}
              </p>
            </div>
            <div className="bg-red-100 dark:bg-red-900/30 p-4 rounded-full">
              <Users className="text-red-600 dark:text-red-400" size={32} />
            </div>
          </div>
          <p className="text-gray-400 dark:text-gray-500 text-sm mt-4">~65% dari koleksi</p>
        </div>
      </div>

      {/* Recent Cards */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            ⏰ Recent Cards
          </h2>
          <Link
            href="/admin/cards/new"
            className="bg-yellow-500 text-slate-900 px-4 py-2 rounded-lg font-bold hover:bg-yellow-400 transition"
          >
            + Add Card
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Attribute</th>
                <th>ATK</th>
                <th>DEF</th>
              </tr>
            </thead>
            <tbody>
              {recentCards.map((card) => (
                <tr key={card.id}>
                  <td className="dark:text-white">
                    <Link href={`/cards/${card.id}`} target="_blank" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                      {card.name}
                    </Link>
                  </td>
                  <td>
                    <span className={`px-2 py-1 rounded text-xs font-semibold text-white ${
                      card.type?.name?.toLowerCase() === 'monster' ? 'bg-red-500' :
                      card.type?.name?.toLowerCase() === 'spell' ? 'bg-green-500' : 'bg-purple-500'
                    }`}>
                      {card.type?.name || 'N/A'}
                    </span>
                  </td>
                  <td>{card.attribute?.name || '-'}</td>
                  <td className="text-red-500 font-semibold">{card.attack ?? '-'}</td>
                  <td className="text-blue-500 font-semibold">{card.defense ?? '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}