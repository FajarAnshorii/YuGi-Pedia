'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Search, X } from 'lucide-react'

export default function FilterBar() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [cardTypes, setCardTypes] = useState<any[]>([])
  const [selectedTypeId, setSelectedTypeId] = useState(searchParams.get('typeId') || '')
  const [selectedAttribute, setSelectedAttribute] = useState(searchParams.get('attribute') || '')
  const [selectedSort, setSelectedSort] = useState(searchParams.get('sortBy') || '')

  useEffect(() => {
    fetch('/api/cards/lookup')
      .then(res => res.json())
      .then(data => {
        setCardTypes(data.cardTypes || [])
      })
  }, [])

  // Sync state with search params (e.g. back button, category clicks)
  useEffect(() => {
    setSelectedTypeId(searchParams.get('typeId') || '')
    setSelectedAttribute(searchParams.get('attribute') || '')
    setSelectedSort(searchParams.get('sortBy') || '')
    setSearch(searchParams.get('search') || '')
  }, [searchParams])

  const applyFilters = () => {
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (selectedTypeId) params.set('typeId', selectedTypeId)
    if (selectedAttribute) params.set('attribute', selectedAttribute)
    if (selectedSort) params.set('sortBy', selectedSort)
    router.push(`/album${params.toString() ? '?' + params.toString() : ''}`)
  }

  const clearAll = () => {
    setSearch('')
    setSelectedTypeId('')
    setSelectedAttribute('')
    setSelectedSort('')
    router.push('/album')
  }

  const hasFilters = search || selectedTypeId || selectedAttribute || selectedSort

  return (
    <div className="bg-white dark:bg-slate-900/60 border border-gray-100 dark:border-slate-800/40 p-4 rounded-xl shadow-md mb-6 transition-colors duration-200">
      <div className="flex flex-col md:flex-row gap-3">
        {/* Type Filter */}
        <select
          value={selectedTypeId}
          onChange={(e) => setSelectedTypeId(e.target.value)}
          className="order-2 md:order-1 px-4 py-3 border border-gray-200 dark:border-slate-700/60 rounded-xl focus:ring-2 focus:ring-yellow-400 bg-white dark:bg-slate-800 dark:text-white text-sm font-semibold transition"
        >
          <option value="">All Types</option>
          {cardTypes.map(type => (
            <option key={type.id} value={type.id}>
              {type.name}
            </option>
          ))}
        </select>

        {/* Attribute Filter */}
        <select
          value={selectedAttribute}
          onChange={(e) => setSelectedAttribute(e.target.value)}
          className="order-3 md:order-2 px-4 py-3 border border-gray-200 dark:border-slate-700/60 rounded-xl focus:ring-2 focus:ring-yellow-400 bg-white dark:bg-slate-800 dark:text-white text-sm font-semibold transition"
          disabled={!!selectedTypeId && cardTypes.find(t => t.id == selectedTypeId)?.name?.toLowerCase() !== 'monster'}
        >
          <option value="">All Attributes</option>
          <option value="FIRE">🔥 FIRE</option>
          <option value="WATER">💧 WATER</option>
          <option value="EARTH">🌍 EARTH</option>
          <option value="WIND">💨 WIND</option>
          <option value="LIGHT">☀️ LIGHT</option>
          <option value="DARK">🌑 DARK</option>
          <option value="DIVINE">⭐ DIVINE</option>
        </select>

        {/* Sort/Order Filter */}
        <select
          value={selectedSort}
          onChange={(e) => setSelectedSort(e.target.value)}
          className="order-4 md:order-3 px-4 py-3 border border-gray-200 dark:border-slate-700/60 rounded-xl focus:ring-2 focus:ring-yellow-400 bg-white dark:bg-slate-800 dark:text-white text-sm font-semibold transition"
        >
          <option value="">Urutan: Default</option>
          <option value="atk_desc">⚔️ Attack Terbesar</option>
          <option value="atk_asc">⚔️ Attack Terlemah</option>
          <option value="def_desc">🛡️ Defense Terbesar</option>
          <option value="def_asc">🛡️ Defense Terlemah</option>
          <option value="price_desc">💰 Harga Termahal</option>
          <option value="price_asc">💰 Harga Termurah</option>
        </select>

        {/* Search Input */}
        <div className="order-1 md:order-4 flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Cari nama kartu..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-slate-700/60 rounded-xl focus:ring-2 focus:ring-yellow-400 bg-white dark:bg-slate-800 dark:text-white dark:placeholder-gray-400 text-sm"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="order-5 flex gap-2 w-full md:w-auto">
          <button
            onClick={applyFilters}
            className="flex-1 md:flex-none px-6 py-3 bg-yellow-500 text-slate-900 rounded-xl hover:bg-yellow-400 font-bold transition shadow-md shadow-yellow-500/10 text-sm"
          >
            🔍 Filter
          </button>
          {hasFilters && (
            <button
              onClick={clearAll}
              className="px-4 py-3 bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700/60 text-gray-700 dark:text-white rounded-xl hover:bg-gray-200 dark:hover:bg-slate-700 transition"
            >
              <X size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
