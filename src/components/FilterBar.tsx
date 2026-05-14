'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Search, X, SlidersHorizontal, ChevronDown } from 'lucide-react'

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
    <div className="relative overflow-hidden bg-slate-900/70 border border-yellow-500/15 backdrop-blur-md p-3 sm:p-5 rounded-2xl shadow-xl shadow-yellow-500/[0.02] mb-6 sm:mb-8 transition-all duration-300">
      {/* Decorative Golden Ambient Line */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-yellow-500/30 to-transparent"></div>

      {/* Grid container with proper hierarchy */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-2 sm:gap-3.5 items-center">
        
        {/* 1. Main Search Bar (Left side / first) */}
        <div className="col-span-1 lg:col-span-4 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-yellow-500/70" size={14} />
          <input
            type="text"
            placeholder="Cari nama kartu..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
            className="w-full h-9 sm:h-11 pl-9 pr-4 rounded-xl border border-slate-700 bg-slate-950/60 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500/30 text-[11px] sm:text-sm font-semibold transition duration-200"
          />
        </div>

        {/* 2. Select Dropdowns Filter Section */}
        <div className="col-span-1 lg:col-span-6 grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-2.5">
          
          {/* Card Type Dropdown */}
          <div className="relative">
            <select
              value={selectedTypeId}
              onChange={(e) => setSelectedTypeId(e.target.value)}
              className="w-full h-9 sm:h-11 pl-3 sm:pl-4 pr-9 sm:pr-10 appearance-none rounded-xl border border-slate-700 bg-slate-950/60 text-slate-200 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500/30 text-[10px] sm:text-xs font-bold transition cursor-pointer"
            >
              <option value="" className="bg-slate-900 text-slate-400">🃏 All Types</option>
              {cardTypes.map(type => (
                <option key={type.id} value={type.id} className="bg-slate-900 text-slate-200">
                  {type.name}
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-yellow-500/70">
              <ChevronDown size={12} strokeWidth={2.5} />
            </div>
          </div>

          {/* Attribute Dropdown */}
          <div className="relative">
            <select
              value={selectedAttribute}
              onChange={(e) => setSelectedAttribute(e.target.value)}
              className="w-full h-9 sm:h-11 pl-3 sm:pl-4 pr-9 sm:pr-10 appearance-none rounded-xl border border-slate-700 bg-slate-950/60 text-slate-200 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500/30 text-[10px] sm:text-xs font-bold transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!!selectedTypeId && cardTypes.find(t => t.id == selectedTypeId)?.name?.toLowerCase() !== 'monster'}
            >
              <option value="" className="bg-slate-900 text-slate-400">🔥 All Attributes</option>
              <option value="FIRE" className="bg-slate-900 text-slate-200">FIRE</option>
              <option value="WATER" className="bg-slate-900 text-slate-200">WATER</option>
              <option value="EARTH" className="bg-slate-900 text-slate-200">EARTH</option>
              <option value="WIND" className="bg-slate-900 text-slate-200">WIND</option>
              <option value="LIGHT" className="bg-slate-900 text-slate-200">LIGHT</option>
              <option value="DARK" className="bg-slate-900 text-slate-200">DARK</option>
              <option value="DIVINE" className="bg-slate-900 text-slate-200">DIVINE</option>
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-yellow-500/70">
              <ChevronDown size={12} strokeWidth={2.5} />
            </div>
          </div>

          {/* Sort Filter */}
          <div className="relative">
            <select
              value={selectedSort}
              onChange={(e) => setSelectedSort(e.target.value)}
              className="w-full h-9 sm:h-11 pl-3 sm:pl-4 pr-9 sm:pr-10 appearance-none rounded-xl border border-slate-700 bg-slate-950/60 text-slate-200 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500/30 text-[10px] sm:text-xs font-bold transition cursor-pointer"
            >
              <option value="" className="bg-slate-900 text-slate-400">📊 Urutan: Default</option>
              <option value="atk_desc" className="bg-slate-900 text-slate-200">ATK Terbesar</option>
              <option value="atk_asc" className="bg-slate-900 text-slate-200">ATK Terlemah</option>
              <option value="def_desc" className="bg-slate-900 text-slate-200">DEF Terbesar</option>
              <option value="def_asc" className="bg-slate-900 text-slate-200">DEF Terlemah</option>
              <option value="price_desc" className="bg-slate-900 text-slate-200">Harga Termahal</option>
              <option value="price_asc" className="bg-slate-900 text-slate-200">Harga Termurah</option>
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-yellow-500/70">
              <ChevronDown size={12} strokeWidth={2.5} />
            </div>
          </div>

        </div>

        {/* 3. Action Buttons Section (Right side) */}
        <div className="col-span-1 lg:col-span-2 flex items-center gap-2 w-full">
          <button
            onClick={applyFilters}
            className="flex-1 h-9 sm:h-11 flex items-center justify-center gap-1.5 bg-gradient-to-r from-yellow-500 to-yellow-400 hover:from-yellow-400 hover:to-yellow-300 text-slate-950 rounded-xl font-black text-[10px] sm:text-xs tracking-wider uppercase transition-all duration-200 hover:shadow-lg hover:shadow-yellow-500/25 active:scale-[0.98]"
          >
            <SlidersHorizontal size={12} strokeWidth={2.5} />
            Filter
          </button>
          
          {hasFilters && (
            <button
              onClick={clearAll}
              title="Reset Filter"
              className="h-9 w-9 sm:h-11 sm:w-11 flex items-center justify-center rounded-xl bg-slate-800 hover:bg-slate-700/80 border border-slate-700 hover:border-slate-600 text-slate-300 hover:text-white transition duration-200 active:scale-95"
            >
              <X size={14} />
            </button>
          )}
        </div>

      </div>
    </div>
  )
}
