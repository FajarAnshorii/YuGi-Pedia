'use client'

import { useEffect, useState, useCallback, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Navbar from '@/components/Navbar'
import CardGrid from '@/components/CardGrid'
import FilterBar from '@/components/FilterBar'
import Pagination from '@/components/Pagination'
import { Card } from '@/lib/types'

function AlbumContent() {
  const searchParams = useSearchParams()
  const [cards, setCards] = useState<Card[]>([])
  const [loading, setLoading] = useState(true)
  const [cardTypes, setCardTypes] = useState<any[]>([])
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 24,
    totalPages: 0,
  })

  // Fetch card types only once
  useEffect(() => {
    const cached = sessionStorage.getItem('cardTypes')
    if (cached) {
      setCardTypes(JSON.parse(cached))
      return
    }

    fetch('/api/cards/lookup')
      .then(res => res.json())
      .then(data => {
        setCardTypes(data.cardTypes || [])
        sessionStorage.setItem('cardTypes', JSON.stringify(data.cardTypes || []))
      })
  }, [])

  // Fetch cards with debounce and caching
  const fetchCards = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams(searchParams.toString())
      if (!params.get('limit')) params.set('limit', '24')

      // Remove cache buster to allow caching
      params.delete('_t')

      const query = params.toString() ? `?${params.toString()}` : ''

      const res = await fetch(`/api/cards${query}`, {
        cache: 'force-cache',
        next: { revalidate: 60 } // Cache for 60 seconds
      })
      const data = await res.json()

      setCards(data.cards || [])
      setPagination(data.pagination || {})
    } catch (error) {
      console.error('Failed to fetch cards:', error)
      setCards([])
    } finally {
      setLoading(false)
    }
  }, [searchParams])

  useEffect(() => {
    fetchCards()
  }, [fetchCards])

  // Get current type name for header
  const getTypeName = () => {
    const typeId = searchParams.get('typeId')
    const search = searchParams.get('search')
    const attribute = searchParams.get('attribute')

    if (search) return `Search: "${search}"`
    if (attribute) return `Attribute: ${attribute}`
    if (typeId) {
      const type = cardTypes.find(t => t.id == typeId)
      return type?.name || 'Cards'
    }
    return 'All Cards'
  }

  return (
    <main className="min-h-screen transition-colors duration-200">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold yugioh-glow-text uppercase tracking-wider mb-2">
            🃏 {getTypeName()}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 font-semibold text-sm">
            {pagination.total ? pagination.total.toLocaleString() : '0'} kartu ditemukan
          </p>
        </div>

        {/* Filters */}
        <FilterBar />

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-yellow-400 border-t-transparent mb-4"></div>
            <p className="text-gray-500 dark:text-gray-400 text-lg">Loading cards...</p>
          </div>
        ) : (
          <>
            {/* Cards Grid */}
            <CardGrid
              cards={cards}
              emptyMessage="Tidak ada kartu ditemukan"
            />

            {/* Pagination */}
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
            />
          </>
        )}
      </div>
    </main>
  )
}

export default function AlbumPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen transition-colors duration-200">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-yellow-400 border-t-transparent mb-4"></div>
            <p className="text-gray-500 dark:text-gray-400 text-lg">Loading...</p>
          </div>
        </div>
      </main>
    }>
      <AlbumContent />
    </Suspense>
  )
}