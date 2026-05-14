'use client'

import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PaginationProps {
  currentPage: number
  totalPages: number
  baseUrl?: string
}

export default function Pagination({ currentPage, totalPages, baseUrl = '/album' }: PaginationProps) {
  if (totalPages <= 1) return null

  const getPageUrl = (page: number) => {
    const params = new URLSearchParams(window.location.search)
    params.set('page', page.toString())
    return `${baseUrl}?${params.toString()}`
  }

  const renderPages = () => {
    const pages = []
    const maxVisible = 5

    let start = Math.max(1, currentPage - 2)
    let end = Math.min(totalPages, start + maxVisible - 1)

    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1)
    }

    if (start > 1) {
      pages.push(
        <Link
          key={1}
          href={getPageUrl(1)}
          className="px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 font-medium text-slate-700 dark:text-slate-300"
        >
          1
        </Link>
      )
      if (start > 2) {
        pages.push(<span key="dots1" className="px-2 text-gray-400">...</span>)
      }
    }

    for (let i = start; i <= end; i++) {
      pages.push(
        <Link
          key={i}
          href={getPageUrl(i)}
          className={`px-4 py-2 rounded-lg font-medium transition text-slate-700 dark:text-slate-300 ${
            i === currentPage
              ? 'bg-yellow-500 text-white shadow-md'
              : 'hover:bg-gray-100 dark:hover:bg-slate-700'
          }`}
        >
          {i}
        </Link>
      )
    }

    if (end < totalPages) {
      if (end < totalPages - 1) {
        pages.push(<span key="dots2" className="px-2 text-gray-400">...</span>)
      }
      pages.push(
        <Link
          key={totalPages}
          href={getPageUrl(totalPages)}
          className="px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 font-medium text-slate-700 dark:text-slate-300"
        >
          {totalPages}
        </Link>
      )
    }

    return pages
  }

  return (
    <div className="mt-8 flex flex-col items-center gap-4">
      {/* Desktop Pagination */}
      <div className="hidden sm:flex items-center justify-center gap-2">
        {currentPage > 1 && (
          <Link
            href={getPageUrl(currentPage - 1)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition text-slate-700 dark:text-slate-300"
          >
            <ChevronLeft size={20} />
          </Link>
        )}

        {renderPages()}

        {currentPage < totalPages && (
          <Link
            href={getPageUrl(currentPage + 1)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition text-slate-700 dark:text-slate-300"
          >
            <ChevronRight size={20} />
          </Link>
        )}
      </div>

      {/* Mobile Pagination */}
      <div className="flex sm:hidden items-center justify-between w-full max-w-[280px] px-2">
        {currentPage > 1 ? (
          <Link
            href={getPageUrl(currentPage - 1)}
            className="flex items-center gap-1 px-3 py-1.5 border border-gray-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 transition text-[10px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-tighter"
          >
            <ChevronLeft size={14} />
            Prev
          </Link>
        ) : (
          <div className="flex items-center gap-1 px-3 py-1.5 border border-gray-100 dark:border-slate-800 rounded-lg bg-gray-50 dark:bg-slate-900/30 text-[10px] font-bold text-gray-300 dark:text-slate-600 cursor-not-allowed uppercase tracking-tighter">
            <ChevronLeft size={14} />
            Prev
          </div>
        )}

        <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-tighter">
          {currentPage} / {totalPages}
        </span>

        {currentPage < totalPages ? (
          <Link
            href={getPageUrl(currentPage + 1)}
            className="flex items-center gap-1 px-3 py-1.5 border border-gray-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 transition text-[10px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-tighter"
          >
            Next
            <ChevronRight size={14} />
          </Link>
        ) : (
          <div className="flex items-center gap-1 px-3 py-1.5 border border-gray-100 dark:border-slate-800 rounded-lg bg-gray-50 dark:bg-slate-900/30 text-[10px] font-bold text-gray-300 dark:text-slate-600 cursor-not-allowed uppercase tracking-tighter">
            Next
            <ChevronRight size={14} />
          </div>
        )}
      </div>
    </div>
  )
}
