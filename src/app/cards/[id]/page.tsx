'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import { Card } from '@/lib/types'
import { ChevronLeft, Download, Image as ImageIcon, Smartphone, Monitor, Sparkles, X } from 'lucide-react'

export default function CardDetailPage() {
  const params = useParams()
  const [card, setCard] = useState<Card | null>(null)
  const [loading, setLoading] = useState(true)

  // Wallpaper states
  const [showWallpaperModal, setShowWallpaperModal] = useState(false)
  const [wallpaperType, setWallpaperType] = useState<'square' | 'mobile' | 'desktop'>('mobile')
  const [isGenerating, setIsGenerating] = useState(false)

  useEffect(() => {
    const fetchCard = async () => {
      try {
        const res = await fetch(`/api/cards/${params.id}`)
        const data = await res.json()
        setCard(data)
      } catch (error) {
        console.error('Failed to fetch card:', error)
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchCard()
    }
  }, [params.id])

  if (loading) {
    return (
      <main className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center">
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
      </main>
    )
  }

  if (!card) {
    return (
      <main className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Kartu tidak ditemukan</h1>
          <Link href="/album" className="text-blue-500 hover:underline mt-4 inline-block dark:text-yellow-400">
            Kembali ke Album
          </Link>
        </div>
      </main>
    )
  }

  // Get type name
  const typeName = card.type?.name || 'Unknown'
  const typeSlug = typeName.toLowerCase()

  // Get attribute info
  const attributeName = card.attribute?.name || null
  const raceName = card.race?.name || null

  // Card image URL
  const getCardImageUrl = () => {
    if (card.imageUrl) {
      return card.imageUrl
    }
    return `https://via.placeholder.com/400x560/1e293b/ffffff?text=${encodeURIComponent(card.name)}`
  }

  // Cropped art URL (Square)
  const getCroppedArtUrl = () => {
    if (card.passcode) {
      return `https://images.ygoprodeck.com/images/cards_cropped/${card.passcode}.jpg`
    }
    return getCardImageUrl()
  }

  // Get rarity from first set
  const firstSet = card.cardSets?.[0]
  const rarityName = firstSet?.rarity?.name || null

  // Wallpaper rendering and trigger download
  const handleDownloadWallpaper = async () => {
    setIsGenerating(true)
    try {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      const img = new Image()
      img.crossOrigin = 'anonymous'

      // Set source based on type
      img.src = wallpaperType === 'square' ? getCroppedArtUrl() : getCardImageUrl()

      await new Promise((resolve, reject) => {
        img.onload = resolve
        img.onerror = reject
      })

      if (wallpaperType === 'square') {
        canvas.width = img.width
        canvas.height = img.height
        ctx.drawImage(img, 0, 0)
      } else if (wallpaperType === 'mobile') {
        canvas.width = 1080
        canvas.height = 1920

        // 1. Draw blurred background with clean downscaling
        const tempCanvas = document.createElement('canvas')
        tempCanvas.width = 54
        tempCanvas.height = 96
        const tempCtx = tempCanvas.getContext('2d')
        if (tempCtx) {
          tempCtx.drawImage(img, 0, 0, 54, 96)
          ctx.drawImage(tempCanvas, 0, 0, 1080, 1920)
        }

        // Overlay slate gradient
        ctx.fillStyle = 'rgba(15, 23, 42, 0.7)'
        ctx.fillRect(0, 0, 1080, 1920)

        // 2. Draw card floating in middle (aspect 3:4)
        const cardW = 720
        const cardH = 1000
        const cardX = (1080 - cardW) / 2
        const cardY = (1920 - cardH) / 2

        // Draw shadow behind card
        ctx.fillStyle = 'rgba(0, 0, 0, 0.6)'
        ctx.fillRect(cardX - 15, cardY - 15, cardW + 30, cardH + 30)

        ctx.drawImage(img, cardX, cardY, cardW, cardH)
      } else if (wallpaperType === 'desktop') {
        canvas.width = 1920
        canvas.height = 1080

        // 1. Draw blurred background
        const tempCanvas = document.createElement('canvas')
        tempCanvas.width = 96
        tempCanvas.height = 54
        const tempCtx = tempCanvas.getContext('2d')
        if (tempCtx) {
          tempCtx.drawImage(img, 0, 0, 96, 54)
          ctx.drawImage(tempCanvas, 0, 0, 1920, 1080)
        }

        // Overlay slate gradient
        ctx.fillStyle = 'rgba(15, 23, 42, 0.7)'
        ctx.fillRect(0, 0, 1920, 1080)

        // 2. Draw card centered (aspect 3:4)
        const cardH = 860
        const cardW = 620
        const cardX = (1920 - cardW) / 2
        const cardY = (1080 - cardH) / 2

        // Draw shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.6)'
        ctx.fillRect(cardX - 15, cardY - 15, cardW + 30, cardH + 30)

        ctx.drawImage(img, cardX, cardY, cardW, cardH)
      }

      // Generate local jpeg trigger download
      const dataUrl = canvas.toDataURL('image/jpeg', 0.95)
      const downloadLink = document.createElement('a')
      downloadLink.download = `${card.name.toLowerCase().replace(/\s+/g, '_')}_wallpaper.jpg`
      downloadLink.href = dataUrl
      downloadLink.click()
    } catch (err) {
      console.error('Failed to generate card wallpaper:', err)
      alert('Gagal membuat wallpaper. Pastikan jaringan internet stabil.')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-250">
      <Navbar />

      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8 max-w-7xl">
        {/* Back Button */}
        <Link
          href="/album"
          className="inline-flex items-center gap-1.5 text-gray-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white mb-4 sm:mb-6 font-bold text-[11px] sm:text-sm transition uppercase tracking-wide"
        >
          <ChevronLeft size={16} />
          Album
        </Link>

        <div className="grid md:grid-cols-12 gap-5 md:gap-8 items-start">
          {/* Card Image Block */}
          <div className="md:col-span-5 bg-white dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/40 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xl flex flex-col items-center">
            <div className="w-full aspect-[3/4] max-w-[280px] sm:max-w-sm bg-gradient-to-br from-slate-900 to-slate-950 rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl relative group mb-4 sm:mb-6">
              <img
                src={getCardImageUrl()}
                alt={card.name}
                className="w-full h-full object-contain transform group-hover:scale-102 transition duration-300"
                onError={(e) => {
                  e.currentTarget.src = `https://via.placeholder.com/400x560/1e293b/ffffff?text=${encodeURIComponent(card.name)}`
                }}
              />
            </div>

            {/* Premium Wallpaper Downloader Trigger */}
            <button
              onClick={() => setShowWallpaperModal(true)}
              className="w-full max-w-[280px] sm:max-w-sm py-3 px-5 bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-slate-950 rounded-xl font-black transition shadow-lg shadow-yellow-500/10 flex items-center justify-center gap-2 text-xs sm:text-base uppercase tracking-wider"
            >
              <Sparkles size={16} className="animate-pulse" />
              <span>DOWNLOAD WALLPAPER</span>
            </button>
          </div>

          {/* Card Info Block */}
          <div className="md:col-span-7 space-y-4 sm:space-y-6">
            {/* Header */}
            <div className="bg-white dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/40 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xl">
              <div className="flex items-center gap-2 mb-2 sm:mb-4">
                <span className="text-xl sm:text-3xl">
                  {typeSlug === 'monster' ? '👹' : typeSlug === 'spell' ? '✨' : '🛡️'}
                </span>
                <span className={`px-3 py-1 rounded-full text-[9px] sm:text-xs font-black tracking-widest uppercase text-white ${
                  typeSlug === 'monster' ? 'bg-red-500 shadow-md shadow-red-500/10' :
                  typeSlug === 'spell' ? 'bg-green-500 shadow-md shadow-green-500/10' : 'bg-purple-500 shadow-md shadow-purple-500/10'
                }`}>
                  {typeName}
                </span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-amber-100/95 yugioh-glow-text tracking-wide uppercase mb-1">{card.name}</h1>
              {card.passcode && (
                <p className="text-gray-400 dark:text-gray-500 font-mono text-[10px] tracking-widest">ID: {card.passcode}</p>
              )}
            </div>

            {/* Statistics */}
            <div className="bg-white dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/40 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xl">
              <h2 className="text-xs sm:text-base font-black text-slate-900 dark:text-slate-200 tracking-widest uppercase mb-3 sm:mb-4 flex items-center gap-2">📊 Statistics</h2>
              <div className="grid grid-cols-2 gap-2.5 sm:gap-3.5">
                {attributeName && (
                  <div className="bg-slate-50 dark:bg-slate-900/80 p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl border dark:border-slate-800">
                    <p className="text-[9px] text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider mb-0.5">Attribute</p>
                    <p className="text-sm sm:text-base font-black dark:text-white flex items-center gap-1.5">
                      {attributeName === 'FIRE' && '🔥'}
                      {attributeName === 'WATER' && '💧'}
                      {attributeName === 'EARTH' && '🌍'}
                      {attributeName === 'WIND' && '💨'}
                      {attributeName === 'LIGHT' && '☀️'}
                      {attributeName === 'DARK' && '🌑'}
                      {attributeName === 'DIVINE' && '⭐'}
                      <span>{attributeName}</span>
                    </p>
                  </div>
                )}

                {raceName && (
                  <div className="bg-slate-50 dark:bg-slate-900/80 p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl border dark:border-slate-800">
                    <p className="text-[9px] text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider mb-0.5">Race</p>
                    <p className="text-sm sm:text-base font-black dark:text-white truncate">{raceName}</p>
                  </div>
                )}

                {card.subType && (
                  <div className="bg-slate-50 dark:bg-slate-900/80 p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl col-span-2 border dark:border-slate-800">
                    <p className="text-[9px] text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider mb-0.5">Type Description</p>
                    <p className="text-sm sm:text-base font-black text-slate-900 dark:text-yellow-400 truncate">{card.subType}</p>
                  </div>
                )}

                {card.level && (
                  <div className="bg-yellow-500/5 p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl border border-yellow-500/10">
                    <p className="text-[9px] text-yellow-600 dark:text-yellow-500 font-bold uppercase tracking-wider mb-0.5">Level</p>
                    <p className="text-lg sm:text-xl font-black text-yellow-500">★ {card.level}</p>
                  </div>
                )}

                {card.rank && (
                  <div className="bg-purple-500/5 p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl border border-purple-500/10">
                    <p className="text-[9px] text-purple-600 dark:text-purple-500 font-bold uppercase tracking-wider mb-0.5">Rank</p>
                    <p className="text-lg sm:text-xl font-black text-purple-500">☆ {card.rank}</p>
                  </div>
                )}

                {card.linkRating && (
                  <div className="bg-cyan-500/5 p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl border border-cyan-500/10">
                    <p className="text-[9px] text-cyan-600 dark:text-cyan-500 font-bold uppercase tracking-wider mb-0.5">Link Rating</p>
                    <p className="text-lg sm:text-xl font-black text-cyan-500">⚡ {card.linkRating}</p>
                  </div>
                )}

                {typeSlug === 'monster' && (
                  <>
                    <div className="bg-red-500/5 p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl border border-red-500/10">
                      <p className="text-[9px] text-red-500 font-bold uppercase tracking-wider mb-0.5">ATK</p>
                      <p className="text-xl sm:text-2xl font-black text-red-500">{card.attack ?? '?'}</p>
                    </div>
                    <div className="bg-blue-500/5 p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl border border-blue-500/10">
                      <p className="text-[9px] text-blue-500 font-bold uppercase tracking-wider mb-0.5">DEF</p>
                      <p className="text-xl sm:text-2xl font-black text-blue-500">{card.defense ?? '?'}</p>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Description */}
            {card.description && (
              <div className="bg-white dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/40 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xl">
                <h2 className="text-xs sm:text-base font-black text-slate-900 dark:text-slate-200 tracking-widest uppercase mb-3 sm:mb-4">📜 Card Effect</h2>
                <div className="bg-slate-50 dark:bg-slate-900 p-3 sm:p-4 rounded-xl sm:rounded-2xl border dark:border-slate-800 leading-relaxed text-slate-700 dark:text-gray-300 text-xs sm:text-base">
                  <p className="whitespace-pre-line leading-relaxed">{card.description}</p>
                </div>
              </div>
            )}

            {/* Market Prices */}
            <div className="bg-white dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/40 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xl">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <h2 className="text-xs sm:text-base font-black text-slate-900 dark:text-slate-200 tracking-widest uppercase">💰 Market Prices</h2>
                {card.priceUpdatedAt && (
                  <span className="text-[8px] sm:text-xs text-gray-400 font-bold uppercase tracking-widest">
                    {new Date(card.priceUpdatedAt).toLocaleDateString('id-ID')}
                  </span>
                )}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                {card.tcgPlayerPrice && (
                  <div className="price-source-card price-source-tcg rounded-xl border dark:border-slate-800 p-2 sm:p-3">
                    <p className="text-[9px] font-bold tracking-widest uppercase opacity-70">TCGPlayer</p>
                    <p className="text-base sm:text-lg font-black mt-0.5 text-slate-900 dark:text-white">
                      ${card.tcgPlayerPrice.toFixed(2)}
                    </p>
                  </div>
                )}
                {card.cardMarketPrice && (
                  <div className="price-source-card price-source-cardmarket rounded-xl border dark:border-slate-800 p-2 sm:p-3">
                    <p className="text-[9px] font-bold tracking-widest uppercase opacity-70">CardMarket</p>
                    <p className="text-base sm:text-lg font-black mt-0.5 text-slate-900 dark:text-white">
                      €{card.cardMarketPrice.toFixed(2)}
                    </p>
                  </div>
                )}
                {card.eBayPrice && (
                  <div className="price-source-card price-source-ebay rounded-xl border dark:border-slate-800 p-2 sm:p-3">
                    <p className="text-[9px] font-bold tracking-widest uppercase opacity-70">eBay</p>
                    <p className="text-base sm:text-lg font-black mt-0.5 text-slate-900 dark:text-white">
                      ${card.eBayPrice.toFixed(2)}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Sets */}
            {card.cardSets && card.cardSets.length > 0 && (
              <div className="bg-white dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/40 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xl">
                <h2 className="text-xs sm:text-base font-black text-slate-900 dark:text-slate-200 tracking-widest uppercase mb-3 sm:mb-4 flex items-center gap-2">📦 Sets ({card.cardSets.length})</h2>
                <div className="space-y-2 max-h-48 sm:max-h-64 overflow-y-auto pr-1">
                  {card.cardSets.slice(0, 8).map((set) => (
                    <div key={set.id} className="flex justify-between items-center p-2.5 sm:p-3.5 bg-slate-50 dark:bg-slate-900/80 border dark:border-slate-800 rounded-xl transition">
                      <div className="min-w-0">
                        <p className="font-bold text-slate-900 dark:text-white text-xs sm:text-base truncate">{set.setName}</p>
                        <p className="text-[9px] text-gray-500 dark:text-gray-400 font-mono tracking-widest mt-0.5">{set.setCode}</p>
                      </div>
                      <div className="text-right flex-shrink-0 ml-2">
                        <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest ${
                          set.rarity?.code === 'UR' ? 'bg-amber-500/10 border border-amber-500/20 text-yellow-500' :
                          set.rarity?.code === 'SR' ? 'bg-blue-500/10 border border-blue-500/20 text-blue-400' :
                          set.rarity?.code === 'SECRET' ? 'bg-purple-500/10 border border-purple-500/20 text-purple-400' :
                          'bg-gray-100 dark:bg-slate-800 border dark:border-slate-700 text-gray-500 dark:text-gray-400'
                        }`}>
                          {set.rarity?.code || 'C'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* LIGHTROOM WALLPAPER MODAL */}
      {showWallpaperModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-4xl bg-slate-900/90 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl flex flex-col md:flex-row gap-6 md:gap-10">
            {/* Close Button */}
            <button
              onClick={() => setShowWallpaperModal(false)}
              className="absolute top-4 right-4 p-2 bg-slate-800 hover:bg-slate-750 text-gray-400 hover:text-white rounded-full transition"
            >
              <X size={18} />
            </button>

            {/* Left Preview Grid */}
            <div className="flex-1 flex items-center justify-center bg-slate-950 rounded-2xl overflow-hidden border border-slate-850 p-4 aspect-[4/3] md:aspect-auto">
              {wallpaperType === 'square' && (
                <div className="w-48 h-48 sm:w-60 sm:h-60 rounded-xl overflow-hidden border-2 border-yellow-500 shadow-xl">
                  <img src={getCroppedArtUrl()} alt="Square Art" className="w-full h-full object-cover" />
                </div>
              )}
              {wallpaperType === 'mobile' && (
                <div className="relative w-36 h-64 sm:w-44 sm:h-80 rounded-xl overflow-hidden border-2 border-yellow-500 shadow-xl flex items-center justify-center">
                  <img src={getCroppedArtUrl()} alt="Blurred Back" className="absolute inset-0 w-full h-full object-cover blur-md scale-110 opacity-30" />
                  <img src={getCardImageUrl()} alt="Card Front" className="w-28 sm:w-32 object-contain relative z-10 drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)]" />
                </div>
              )}
              {wallpaperType === 'desktop' && (
                <div className="relative w-64 h-36 sm:w-96 sm:h-54 rounded-xl overflow-hidden border-2 border-yellow-500 shadow-xl flex items-center justify-center">
                  <img src={getCroppedArtUrl()} alt="Blurred Back" className="absolute inset-0 w-full h-full object-cover blur-md scale-110 opacity-30" />
                  <img src={getCardImageUrl()} alt="Card Front" className="h-28 sm:h-44 object-contain relative z-10 drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)]" />
                </div>
              )}
            </div>

            {/* Right Options Sidebar */}
            <div className="w-full md:w-80 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold text-yellow-400 bg-yellow-400/10 border border-yellow-400/20 px-2.5 py-1 rounded-md uppercase tracking-wider">Premium Tool</span>
                <h3 className="text-xl md:text-2xl font-black text-white mt-2.5 mb-1 tracking-wide uppercase">Wallpaper Downloader</h3>
                <p className="text-gray-400 text-xs sm:text-sm leading-relaxed mb-6">Pilih rasio resolusi wallpaper yang Anda inginkan. Kami merangkai dan menghasilkan wallpaper resolusi tinggi secara instan.</p>

                {/* Option Selector */}
                <div className="space-y-3.5 mb-6">
                  {/* Option Mobile */}
                  <button
                    onClick={() => setWallpaperType('mobile')}
                    className={`w-full p-4 rounded-2xl border text-left flex items-center gap-3.5 transition ${
                      wallpaperType === 'mobile' 
                        ? 'bg-yellow-500/10 border-yellow-500 text-yellow-500' 
                        : 'bg-slate-850/50 border-slate-800 text-gray-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    <Smartphone size={20} />
                    <div>
                      <p className="font-extrabold text-sm sm:text-base">Mobile Wallpaper</p>
                      <p className="text-[10px] sm:text-xs opacity-70">Rasio 9:16 (1080 x 1920 HD)</p>
                    </div>
                  </button>

                  {/* Option Desktop */}
                  <button
                    onClick={() => setWallpaperType('desktop')}
                    className={`w-full p-4 rounded-2xl border text-left flex items-center gap-3.5 transition ${
                      wallpaperType === 'desktop' 
                        ? 'bg-yellow-500/10 border-yellow-500 text-yellow-500' 
                        : 'bg-slate-850/50 border-slate-800 text-gray-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    <Monitor size={20} />
                    <div>
                      <p className="font-extrabold text-sm sm:text-base">Desktop Wallpaper</p>
                      <p className="text-[10px] sm:text-xs opacity-70">Rasio 16:9 (1920 x 1080 Full HD)</p>
                    </div>
                  </button>

                  {/* Option Square */}
                  <button
                    onClick={() => setWallpaperType('square')}
                    className={`w-full p-4 rounded-2xl border text-left flex items-center gap-3.5 transition ${
                      wallpaperType === 'square' 
                        ? 'bg-yellow-500/10 border-yellow-500 text-yellow-500' 
                        : 'bg-slate-850/50 border-slate-800 text-gray-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    <ImageIcon size={20} />
                    <div>
                      <p className="font-extrabold text-sm sm:text-base">Square Artwork</p>
                      <p className="text-[10px] sm:text-xs opacity-70">Hanya gambar seni kartu saja</p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={handleDownloadWallpaper}
                disabled={isGenerating}
                className="w-full py-4 bg-yellow-500 hover:bg-yellow-400 disabled:bg-slate-800 disabled:text-gray-500 text-slate-950 font-black rounded-xl transition shadow-lg shadow-yellow-500/10 flex items-center justify-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
                    <span>Sedang Merangkai...</span>
                  </>
                ) : (
                  <>
                    <Download size={18} />
                    <span>DOWNLOAD WALLPAPER</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}