'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Search, X } from 'lucide-react'

export default function FilterBar() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [cardTypes, setCardTypes] = useState<any[]>([])
  const [selectedTypeId, setSelectedTypeId] = useState<string>('')
  const [selectedAttribute, setSelectedAttribute] = useState<string>('')

  useEffect(() => {
    fetch('/api/cards/lookup')
      .then(res => res.json())
      .then(data => {
        setCardTypes(data.cardTypes || [])
        // Set initial type from URL
        const typeFromUrl = searchParams.get('typeId')
        if (typeFromUrl) setSelectedTypeId(typeFromUrl)
      })
  }, [])

  const applyFilters = () => {
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (selectedTypeId) params.set('typeId', selectedTypeId)
    if (selectedAttribute) params.set('attribute', selectedAttribute)
    router.push(`/album${params.toString() ? '?' + params.toString() : ''}`)
  }

  const clearAll = () => {
    setSearch('')
    setSelectedTypeId('')
    setSelectedAttribute('')
    router.push('/album')
  }

  const hasFilters = search || selectedTypeId || selectedAttribute

  return (
    <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-md mb-6 transition-colors duration-200">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Type Filter */}
        <select
          value={selectedTypeId}
          onChange={(e) => setSelectedTypeId(e.target.value)}
          className="px-4 py-3 border border-gray-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-yellow-400 bg-white dark:bg-slate-700 dark:text-white"
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
          className="px-4 py-3 border border-gray-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-yellow-400 bg-white dark:bg-slate-700 dark:text-white"
          disabled={selectedTypeId && cardTypes.find(t => t.id == selectedTypeId)?.name?.toLowerCase() !== 'monster'}
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

        {/* Search Input */}
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Cari nama kartu..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-yellow-400 bg-white dark:bg-slate-700 dark:text-white dark:placeholder-gray-400"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-2">
          <button
            onClick={applyFilters}
            className="px-6 py-3 bg-yellow-500 text-white rounded-xl hover:bg-yellow-400 font-semibold transition shadow-md"
          >
            🔍 Filter
          </button>
          {hasFilters && (
            <button
              onClick={clearAll}
              className="px-4 py-3 bg-gray-200 dark:bg-slate-600 text-gray-700 dark:text-white rounded-xl hover:bg-gray-300 dark:hover:bg-slate-500 transition"
            >
              <X size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
