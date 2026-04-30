import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react'

// Set how many cards per page
const CARDS_PER_PAGE = 50

interface PageProps {
  searchParams: { page?: string }
}

export default async function AdminCardsPage({ searchParams }: PageProps) {
  const currentPage = parseInt(searchParams.page || '1')
  const skip = (currentPage - 1) * CARDS_PER_PAGE

  // Get total count
  const totalCards = await prisma.card.count()

  // Get cards with pagination
  const cards = await prisma.card.findMany({
    skip,
    take: CARDS_PER_PAGE,
    orderBy: { name: 'asc' },
    include: {
      type: true,
      attribute: true,
      cardCategories: {
        include: {
          category: true,
        },
      },
    },
  })

  const totalPages = Math.ceil(totalCards / CARDS_PER_PAGE)

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Cards Management</h1>
        <Link
          href="/admin/cards/new"
          className="bg-yellow-500 text-slate-900 px-4 py-2 rounded-lg font-semibold hover:bg-yellow-400 transition flex items-center gap-2"
        >
          <Plus size={20} />
          Add New Card
        </Link>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md overflow-hidden">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>Attribute</th>
              <th>Level/Rank</th>
              <th>ATK/DEF</th>
              <th>Category</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {cards.map((card) => {
              const cardType = card.type?.name?.toLowerCase() || 'unknown'
              return (
              <tr key={card.id}>
                <td className="font-medium dark:text-white">{card.name}</td>
                <td>
                  <span className={`px-2 py-1 rounded text-xs font-semibold text-white ${
                    cardType === 'monster' ? 'bg-red-500' :
                    cardType === 'spell' ? 'bg-green-500' : 'bg-purple-500'
                  }`}>
                    {card.type?.name || 'Unknown'}
                  </span>
                </td>
                <td>{card.attribute?.name || '-'}</td>
                <td>
                  {card.level && `★ ${card.level}`}
                  {card.rank && `☆ ${card.rank}`}
                  {card.linkRating && `⚡ ${card.linkRating}`}
                  {!card.level && !card.rank && !card.linkRating && '-'}
                </td>
                <td className="text-red-500 font-semibold">
                  {card.attack ?? '-'} / {card.defense ?? '-'}
                </td>
                <td>{card.cardCategories?.[0]?.category?.name || '-'}</td>
                <td>
                  <div className="flex gap-2">
                    <Link
                      href={`/cards/${card.id}`}
                      className="px-3 py-1 bg-blue-100 text-blue-600 rounded text-sm hover:bg-blue-200"
                      target="_blank"
                    >
                      View
                    </Link>
                    <Link
                      href={`/admin/cards/${card.id}`}
                      className="px-3 py-1 bg-yellow-100 text-yellow-600 rounded text-sm hover:bg-yellow-200"
                    >
                      Edit
                    </Link>
                  </div>
                </td>
              </tr>
              )
            })}
          </tbody>
        </table>

        {cards.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            <p>No cards found. Add your first card!</p>
            <Link href="/admin/cards/new" className="text-blue-500 hover:underline mt-2 inline-block">
              + Add New Card
            </Link>
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-6 bg-white dark:bg-slate-800 p-4 rounded-xl shadow-md">
        <p className="text-gray-600 dark:text-gray-300">
          Showing {skip + 1}-{Math.min(skip + CARDS_PER_PAGE, totalCards)} of {totalCards.toLocaleString()} cards
        </p>
        <div className="flex gap-2">
          {currentPage > 1 && (
            <Link
              href={`/admin/cards?page=${currentPage - 1}`}
              className="px-4 py-2 bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-slate-600 flex items-center gap-1"
            >
              <ChevronLeft size={18} />
              Previous
            </Link>
          )}
          {currentPage < totalPages && (
            <Link
              href={`/admin/cards?page=${currentPage + 1}`}
              className="px-4 py-2 bg-yellow-500 text-slate-900 rounded-lg hover:bg-yellow-400 flex items-center gap-1 font-semibold"
            >
              Next
              <ChevronRight size={18} />
            </Link>
          )}
        </div>
      </div>

      {/* Page Numbers */}
      <div className="flex justify-center gap-2 mt-4 flex-wrap">
        {Array.from({ length: Math.min(10, totalPages) }, (_, i) => {
          let pageNum
          if (totalPages <= 10) {
            pageNum = i + 1
          } else if (currentPage <= 6) {
            pageNum = i + 1
          } else if (currentPage >= totalPages - 5) {
            pageNum = totalPages - 9 + i
          } else {
            pageNum = currentPage - 5 + i
          }
          return (
            <Link
              key={pageNum}
              href={`/admin/cards?page=${pageNum}`}
              className={`px-3 py-1 rounded-lg font-semibold ${
                pageNum === currentPage
                  ? 'bg-yellow-500 text-slate-900'
                  : 'bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-slate-600'
              }`}
            >
              {pageNum}
            </Link>
          )
        })}
      </div>
    </div>
  )
}