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
          <h1 className="text-3xl font-extrabold yugioh-glow-text uppercase tracking-wider mb-2 flex items-center">
            <div className="inline-flex items-center justify-center p-2 rounded-lg bg-yellow-500/10 border border-yellow-500/20 mr-3 shadow-inner">
              <svg className="w-6 h-6 text-yellow-400 drop-shadow-[0_0_6px_rgba(234,179,8,0.6)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="6" width="12" height="15" rx="2" stroke="currentColor" strokeOpacity="0.5" />
                <rect x="6" y="4" width="12" height="15" rx="2" stroke="currentColor" strokeOpacity="0.75" />
                <rect x="9" y="2" width="12" height="15" rx="2" stroke="currentColor" fill="currentColor" fillOpacity="0.1" />
              </svg>
            </div>
            {getTypeName()}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 font-semibold text-sm pl-[52px]">
            {pagination.total ? pagination.total.toLocaleString() : '0'} kartu ditemukan
          </p>
        </div>

        {/* Filters */}
        <FilterBar />

        {/* Loading State */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="relative mb-4 h-20 w-20 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-2 border-dashed border-yellow-400/30 animate-[spin_10s_linear_infinite]"></div>
              <img 
                src="/images/logo.png" 
                alt="Loading..." 
                className="h-16 w-16 animate-spin object-contain drop-shadow-[0_0_12px_rgba(234,179,8,0.5)]" 
              />
            </div>
            <p className="text-gray-500 dark:text-gray-400 font-semibold text-lg tracking-wider animate-pulse">Loading cards...</p>
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
          <div className="flex flex-col items-center justify-center py-16">
            <div className="relative mb-4 h-20 w-20 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-2 border-dashed border-yellow-400/30 animate-[spin_10s_linear_infinite]"></div>
              <img 
                src="/images/logo.png" 
                alt="Loading..." 
                className="h-16 w-16 animate-spin object-contain drop-shadow-[0_0_12px_rgba(234,179,8,0.5)]" 
              />
            </div>
            <p className="text-gray-500 dark:text-gray-400 font-semibold text-lg tracking-wider animate-pulse">Loading...</p>
          </div>
        </div>
      </main>
    }>
      <AlbumContent />
    </Suspense>
  )
}