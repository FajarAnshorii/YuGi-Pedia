'use client'

import { useState } from 'react'
import Navbar from '@/components/Navbar'
import { Trophy, ArrowRight, Layers, Star, Zap, Shield, Sparkles, Check } from 'lucide-react'
import { useRouter } from 'next/navigation'

// Pre-defined premium meta decks list with matching Konami passcodes
const META_DECKS = [
  {
    id: 'snake-eye-fire-king',
    name: 'Snake-Eye Fire King',
    tier: 'Tier 1',
    type: 'Combo / Graveyard Spam',
    description: 'Deck Tier 1 terkuat saat ini yang menggabungkan kecepatan mesin pencari "Snake-Eye" dengan efek destruktif regenerasi monster "Fire King" dari kuburan.',
    stats: { attack: 95, defense: 88, speed: 98, difficulty: 85 },
    main: [
      { id: '1', passcode: '9674034', name: 'Snake-Eye Ash', imageUrl: 'https://images.ygoprodeck.com/images/cards/9674034.jpg', type: { name: 'Effect Monster' }, subType: 'Monster' },
      { id: '2', passcode: '9674034', name: 'Snake-Eye Ash', imageUrl: 'https://images.ygoprodeck.com/images/cards/9674034.jpg', type: { name: 'Effect Monster' }, subType: 'Monster' },
      { id: '3', passcode: '9674034', name: 'Snake-Eye Ash', imageUrl: 'https://images.ygoprodeck.com/images/cards/9674034.jpg', type: { name: 'Effect Monster' }, subType: 'Monster' },
      { id: '4', passcode: '45663742', name: 'Snake-Eye Oak', imageUrl: 'https://images.ygoprodeck.com/images/cards/45663742.jpg', type: { name: 'Effect Monster' }, subType: 'Monster' },
      { id: '5', passcode: '48452496', name: 'Snake-Eye Flamberge Dragon', imageUrl: 'https://images.ygoprodeck.com/images/cards/48452496.jpg', type: { name: 'Effect Monster' }, subType: 'Monster' },
      { id: '6', passcode: '72270339', name: 'Diabellstar the Black Witch', imageUrl: 'https://images.ygoprodeck.com/images/cards/72270339.jpg', type: { name: 'Effect Monster' }, subType: 'Monster' },
      { id: '7', passcode: '72270339', name: 'Diabellstar the Black Witch', imageUrl: 'https://images.ygoprodeck.com/images/cards/72270339.jpg', type: { name: 'Effect Monster' }, subType: 'Monster' },
      { id: '8', passcode: '66431519', name: 'Sacred Fire King Garunix', imageUrl: 'https://images.ygoprodeck.com/images/cards/66431519.jpg', type: { name: 'Effect Monster' }, subType: 'Monster' },
      { id: '9', passcode: '66431519', name: 'Sacred Fire King Garunix', imageUrl: 'https://images.ygoprodeck.com/images/cards/66431519.jpg', type: { name: 'Effect Monster' }, subType: 'Monster' },
      { id: '10', passcode: '2526224', name: 'Fire King High Avatar Kirin', imageUrl: 'https://images.ygoprodeck.com/images/cards/2526224.jpg', type: { name: 'Effect Monster' }, subType: 'Monster' },
      { id: '11', passcode: '2526224', name: 'Fire King High Avatar Kirin', imageUrl: 'https://images.ygoprodeck.com/images/cards/2526224.jpg', type: { name: 'Effect Monster' }, subType: 'Monster' },
      { id: '12', passcode: '14558127', name: 'Ash Blossom & Joyous Spring', imageUrl: 'https://images.ygoprodeck.com/images/cards/14558127.jpg', type: { name: 'Effect Monster' }, subType: 'Monster' },
      { id: '13', passcode: '14558127', name: 'Ash Blossom & Joyous Spring', imageUrl: 'https://images.ygoprodeck.com/images/cards/14558127.jpg', type: { name: 'Effect Monster' }, subType: 'Monster' },
      { id: '14', passcode: '14558127', name: 'Ash Blossom & Joyous Spring', imageUrl: 'https://images.ygoprodeck.com/images/cards/14558127.jpg', type: { name: 'Effect Monster' }, subType: 'Monster' },
      { id: '15', passcode: '3361010', name: 'Bonfire', imageUrl: 'https://images.ygoprodeck.com/images/cards/3361010.jpg', type: { name: 'Spell Card' }, subType: 'Spell' },
      { id: '16', passcode: '3361010', name: 'Bonfire', imageUrl: 'https://images.ygoprodeck.com/images/cards/3361010.jpg', type: { name: 'Spell Card' }, subType: 'Spell' },
      { id: '17', passcode: '3361010', name: 'Bonfire', imageUrl: 'https://images.ygoprodeck.com/images/cards/3361010.jpg', type: { name: 'Spell Card' }, subType: 'Spell' }
    ],
    extra: [
      { id: 'e1', passcode: '2772337', name: 'Promethean Princess, Bestower of Flames', imageUrl: 'https://images.ygoprodeck.com/images/cards/2772337.jpg', type: { name: 'Link Monster' }, subType: 'Monster' },
      { id: 'e2', passcode: '20665527', name: 'Amphibious Swarmship Amblowhale', imageUrl: 'https://images.ygoprodeck.com/images/cards/20665527.jpg', type: { name: 'Link Monster' }, subType: 'Monster' },
      { id: 'e3', passcode: '29301450', name: 'S:P Little Knight', imageUrl: 'https://images.ygoprodeck.com/images/cards/29301450.jpg', type: { name: 'Link Monster' }, subType: 'Monster' },
      { id: 'e4', passcode: '65741786', name: 'I:P Masquerena', imageUrl: 'https://images.ygoprodeck.com/images/cards/65741786.jpg', type: { name: 'Link Monster' }, subType: 'Monster' },
      { id: 'e5', passcode: '4280258', name: 'Apollousa, Bow of the Goddess', imageUrl: 'https://images.ygoprodeck.com/images/cards/4280258.jpg', type: { name: 'Link Monster' }, subType: 'Monster' }
    ],
    side: [
      { id: 's1', passcode: '27204311', name: 'Nibiru, the Primal Being', imageUrl: 'https://images.ygoprodeck.com/images/cards/27204311.jpg', type: { name: 'Effect Monster' }, subType: 'Monster' },
      { id: 's2', passcode: '94145021', name: 'Droll & Lock Bird', imageUrl: 'https://images.ygoprodeck.com/images/cards/94145021.jpg', type: { name: 'Effect Monster' }, subType: 'Monster' },
      { id: 's3', passcode: '90448279', name: 'Cosmic Cyclone', imageUrl: 'https://images.ygoprodeck.com/images/cards/90448279.jpg', type: { name: 'Spell Card' }, subType: 'Spell' }
    ]
  },
  {
    id: 'yubel-fiend',
    name: 'Yubel - Fiend Link',
    tier: 'Tier 1',
    type: 'Control / Link Summon',
    description: 'Memanfaatkan sinergi tipe Fiend untuk memicu efek pantulan damage Yubel asli dan mengunci pergerakan musuh lewat monster Link yang sangat tangguh.',
    stats: { attack: 85, defense: 96, speed: 92, difficulty: 90 },
    main: [
      { id: 'y1', passcode: '78371393', name: 'Yubel', imageUrl: 'https://images.ygoprodeck.com/images/cards/78371393.jpg', type: { name: 'Effect Monster' }, subType: 'Monster' },
      { id: 'y2', passcode: '4779091', name: 'Yubel - Terror Incarnate', imageUrl: 'https://images.ygoprodeck.com/images/cards/4779091.jpg', type: { name: 'Effect Monster' }, subType: 'Monster' },
      { id: 'y3', passcode: '90829280', name: 'Spirit of Yubel', imageUrl: 'https://images.ygoprodeck.com/images/cards/90829280.jpg', type: { name: 'Effect Monster' }, subType: 'Monster' },
      { id: 'y4', passcode: '90829280', name: 'Spirit of Yubel', imageUrl: 'https://images.ygoprodeck.com/images/cards/90829280.jpg', type: { name: 'Effect Monster' }, subType: 'Monster' },
      { id: 'y5', passcode: '62318994', name: 'Samsara D Lotus', imageUrl: 'https://images.ygoprodeck.com/images/cards/62318994.jpg', type: { name: 'Effect Monster' }, subType: 'Monster' },
      { id: 'y6', passcode: '62318994', name: 'Samsara D Lotus', imageUrl: 'https://images.ygoprodeck.com/images/cards/62318994.jpg', type: { name: 'Effect Monster' }, subType: 'Monster' },
      { id: 'y7', passcode: '80312545', name: 'Opening of the Spirit Gates', imageUrl: 'https://images.ygoprodeck.com/images/cards/80312545.jpg', type: { name: 'Spell Card' }, subType: 'Spell' },
      { id: 'y8', passcode: '80312545', name: 'Opening of the Spirit Gates', imageUrl: 'https://images.ygoprodeck.com/images/cards/80312545.jpg', type: { name: 'Spell Card' }, subType: 'Spell' },
      { id: 'y9', passcode: '14558127', name: 'Ash Blossom & Joyous Spring', imageUrl: 'https://images.ygoprodeck.com/images/cards/14558127.jpg', type: { name: 'Effect Monster' }, subType: 'Monster' },
      { id: 'y10', passcode: '14558127', name: 'Ash Blossom & Joyous Spring', imageUrl: 'https://images.ygoprodeck.com/images/cards/14558127.jpg', type: { name: 'Effect Monster' }, subType: 'Monster' }
    ],
    extra: [
      { id: 'ye1', passcode: '47172959', name: 'Yubel - The Loving Defender Forever', imageUrl: 'https://images.ygoprodeck.com/images/cards/47172959.jpg', type: { name: 'Fusion Monster' }, subType: 'Monster' },
      { id: 'ye2', passcode: '29301450', name: 'S:P Little Knight', imageUrl: 'https://images.ygoprodeck.com/images/cards/29301450.jpg', type: { name: 'Link Monster' }, subType: 'Monster' },
      { id: 'ye3', passcode: '4280258', name: 'Apollousa, Bow of the Goddess', imageUrl: 'https://images.ygoprodeck.com/images/cards/4280258.jpg', type: { name: 'Link Monster' }, subType: 'Monster' }
    ],
    side: [
      { id: 'ys1', passcode: '18144506', name: 'Harpies Feather Duster', imageUrl: 'https://images.ygoprodeck.com/images/cards/18144506.jpg', type: { name: 'Spell Card' }, subType: 'Spell' },
      { id: 'ys2', passcode: '10045474', name: 'Infinite Impermanence', imageUrl: 'https://images.ygoprodeck.com/images/cards/10045474.jpg', type: { name: 'Trap Card' }, subType: 'Trap' }
    ]
  },
  {
    id: 'tenpai-dragon',
    name: 'Tenpai Dragon',
    tier: 'Tier 1.5',
    type: 'Battle OTK',
    description: 'Deck agresif spesialis giliran kedua (Go-Second) yang memanfaatkan Battle Phase untuk melakukan Synchro Summon instan dan meluncurkan serangan mematikan (One-Turn Kill).',
    stats: { attack: 99, defense: 70, speed: 96, difficulty: 70 },
    main: [
      { id: 't1', passcode: '39931513', name: 'Tenpai Dragon Paidra', imageUrl: 'https://images.ygoprodeck.com/images/cards/39931513.jpg', type: { name: 'Effect Monster' }, subType: 'Monster' },
      { id: 't2', passcode: '39931513', name: 'Tenpai Dragon Paidra', imageUrl: 'https://images.ygoprodeck.com/images/cards/39931513.jpg', type: { name: 'Effect Monster' }, subType: 'Monster' },
      { id: 't3', passcode: '39931513', name: 'Tenpai Dragon Paidra', imageUrl: 'https://images.ygoprodeck.com/images/cards/39931513.jpg', type: { name: 'Effect Monster' }, subType: 'Monster' },
      { id: 't4', passcode: '91810826', name: 'Tenpai Dragon Chundra', imageUrl: 'https://images.ygoprodeck.com/images/cards/91810826.jpg', type: { name: 'Effect Monster' }, subType: 'Monster' },
      { id: 't5', passcode: '91810826', name: 'Tenpai Dragon Chundra', imageUrl: 'https://images.ygoprodeck.com/images/cards/91810826.jpg', type: { name: 'Effect Monster' }, subType: 'Monster' },
      { id: 't6', passcode: '30336082', name: 'Sangen Summoning', imageUrl: 'https://images.ygoprodeck.com/images/cards/30336082.jpg', type: { name: 'Spell Card' }, subType: 'Spell' },
      { id: 't7', passcode: '30336082', name: 'Sangen Summoning', imageUrl: 'https://images.ygoprodeck.com/images/cards/30336082.jpg', type: { name: 'Spell Card' }, subType: 'Spell' },
      { id: 't8', passcode: '30336082', name: 'Sangen Summoning', imageUrl: 'https://images.ygoprodeck.com/images/cards/30336082.jpg', type: { name: 'Spell Card' }, subType: 'Spell' },
      { id: 't9', passcode: '14558127', name: 'Ash Blossom & Joyous Spring', imageUrl: 'https://images.ygoprodeck.com/images/cards/14558127.jpg', type: { name: 'Effect Monster' }, subType: 'Monster' },
      { id: 't10', passcode: '14558127', name: 'Ash Blossom & Joyous Spring', imageUrl: 'https://images.ygoprodeck.com/images/cards/14558127.jpg', type: { name: 'Effect Monster' }, subType: 'Monster' }
    ],
    extra: [
      { id: 'te1', passcode: '82570174', name: 'Sangenpai Bident Dragion', imageUrl: 'https://images.ygoprodeck.com/images/cards/82570174.jpg', type: { name: 'Synchro Monster' }, subType: 'Monster' },
      { id: 'te2', passcode: '18969888', name: 'Sangenpai Transcendent Dragion', imageUrl: 'https://images.ygoprodeck.com/images/cards/18969888.jpg', type: { name: 'Synchro Monster' }, subType: 'Monster' },
      { id: 'te3', passcode: '39402797', name: 'Trident Dragion', imageUrl: 'https://images.ygoprodeck.com/images/cards/39402797.jpg', type: { name: 'Synchro Monster' }, subType: 'Monster' }
    ],
    side: [
      { id: 'ts1', passcode: '27204311', name: 'Nibiru, the Primal Being', imageUrl: 'https://images.ygoprodeck.com/images/cards/27204311.jpg', type: { name: 'Effect Monster' }, subType: 'Monster' },
      { id: 'ts2', passcode: '94634433', name: 'Lightning Storm', imageUrl: 'https://images.ygoprodeck.com/images/cards/94634433.jpg', type: { name: 'Spell Card' }, subType: 'Spell' }
    ]
  }
]

export default function MetaDecksPage() {
  const [selectedDeck, setSelectedDeck] = useState(META_DECKS[0])
  const [isCopied, setIsCopied] = useState(false)
  const router = useRouter()

  const handleCopyToBuilder = (deck: typeof META_DECKS[0]) => {
    // Write full cards arrays to localStorage to match Deck Builder state structure
    localStorage.setItem('ygo_deck_main', JSON.stringify(deck.main))
    localStorage.setItem('ygo_deck_extra', JSON.stringify(deck.extra))
    localStorage.setItem('ygo_deck_side', JSON.stringify(deck.side))

    setIsCopied(true)
    setTimeout(() => {
      setIsCopied(false)
      // Redirect seamlessly
      router.push('/deck-builder')
    }, 1200)
  }

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-250">
      <Navbar />

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Title and Intro */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="text-yellow-500 text-xs font-black uppercase tracking-widest bg-yellow-500/10 border border-yellow-500/20 px-3.5 py-1.5 rounded-full">Katalog Turnamen Resmi</span>
          <h1 className="text-4xl font-black uppercase mt-4 mb-2 tracking-wider yugioh-glow-text flex items-center justify-center gap-2">🏆 Meta Decks Catalog</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Tinjau resep deck terkuat dari kejuaraan tingkat global (YCS, WCQ, OCG Asia) dan salin instan ke Deck Builder Anda.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT SIDE: Deck Profiles Navigator (4 columns) */}
          <div className="lg:col-span-4 space-y-4">
            <h2 className="text-sm font-black uppercase tracking-wider text-gray-400">Pilih Deck Juara:</h2>
            <div className="space-y-3">
              {META_DECKS.map((deck) => (
                <div
                  key={deck.id}
                  onClick={() => setSelectedDeck(deck)}
                  className={`p-4 rounded-2xl border cursor-pointer transition shadow-sm ${
                    selectedDeck.id === deck.id
                      ? 'bg-yellow-500/10 border-yellow-500 dark:bg-yellow-500/5'
                      : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-850 hover:border-yellow-500/30'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-black uppercase bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-gray-500 dark:text-gray-300">{deck.tier}</span>
                    <span className="text-[9px] font-bold text-yellow-600 dark:text-yellow-500">{deck.type}</span>
                  </div>
                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-white mb-1">{deck.name}</h3>
                  <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">{deck.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT SIDE: Selected Deck Detail Panel (8 columns) */}
          <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
            
            {/* Deck Header Card */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-850/60">
              <div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-wider">{selectedDeck.name}</h2>
                <p className="text-xs text-gray-400 mt-1 leading-relaxed max-w-xl">{selectedDeck.description}</p>
              </div>

              <button
                onClick={() => handleCopyToBuilder(selectedDeck)}
                disabled={isCopied}
                className={`px-5 py-3 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 shrink-0 shadow-md transition-all ${
                  isCopied
                    ? 'bg-green-500 text-white shadow-green-500/10'
                    : 'bg-yellow-500 hover:bg-yellow-400 text-slate-950 shadow-yellow-500/10'
                }`}
              >
                {isCopied ? (
                  <>
                    <Check size={14} />
                    <span>Disalin! 🛠️</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={14} />
                    <span>Salin Ke Builder 🛠️</span>
                  </>
                )}
              </button>
            </div>

            {/* Deck Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl">
              <div className="text-center sm:border-r border-slate-200 dark:border-slate-850/60">
                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block mb-0.5">🔥 Attack</span>
                <p className="text-lg font-black text-red-500">{selectedDeck.stats.attack}%</p>
              </div>
              <div className="text-center sm:border-r border-slate-200 dark:border-slate-850/60">
                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block mb-0.5">🛡️ Defense</span>
                <p className="text-lg font-black text-blue-500">{selectedDeck.stats.defense}%</p>
              </div>
              <div className="text-center sm:border-r border-slate-200 dark:border-slate-850/60">
                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block mb-0.5">⚡ Speed</span>
                <p className="text-lg font-black text-yellow-500">{selectedDeck.stats.speed}%</p>
              </div>
              <div className="text-center">
                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block mb-0.5">🎯 Difficulty</span>
                <p className="text-lg font-black text-purple-500">{selectedDeck.stats.difficulty}%</p>
              </div>
            </div>

            {/* Deck Resep Lists (Main, Extra, Side) */}
            <div className="space-y-8">
              
              {/* 1. Main Deck Recipe */}
              <div className="space-y-4">
                <h4 className="text-sm font-black uppercase text-slate-900 dark:text-amber-100/95 flex items-center gap-1.5 tracking-wider border-b dark:border-slate-850 pb-2">
                  <Layers size={14} className="text-amber-500" />
                  <span>Main Deck ({selectedDeck.main.length} Kartu)</span>
                </h4>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3.5">
                  {selectedDeck.main.map((card, idx) => (
                    <div 
                      key={idx} 
                      className="group aspect-[3/4] relative rounded-xl overflow-hidden bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-md cursor-pointer hover:scale-[1.04] hover:border-yellow-500 hover:shadow-yellow-500/10 transition-all duration-200"
                    >
                      <img src={card.imageUrl} alt={card.name} className="w-full h-full object-cover" />
                      {/* Premium Slide-up Title Overlay on Hover */}
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950 via-slate-950/90 to-transparent p-2 pt-8 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                        <p className="font-extrabold text-[9px] text-white text-center truncate leading-tight">{card.name}</p>
                        <p className="text-[7px] text-yellow-500 text-center font-mono mt-0.5">{card.passcode}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 2. Extra Deck Recipe */}
              <div className="space-y-4">
                <h4 className="text-sm font-black uppercase text-slate-900 dark:text-amber-100/95 flex items-center gap-1.5 tracking-wider border-b dark:border-slate-850 pb-2">
                  <Layers size={14} className="text-purple-500" />
                  <span>Extra Deck ({selectedDeck.extra.length} Kartu)</span>
                </h4>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3.5">
                  {selectedDeck.extra.map((card, idx) => (
                    <div 
                      key={idx} 
                      className="group aspect-[3/4] relative rounded-xl overflow-hidden bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-md cursor-pointer hover:scale-[1.04] hover:border-yellow-500 hover:shadow-yellow-500/10 transition-all duration-200"
                    >
                      <img src={card.imageUrl} alt={card.name} className="w-full h-full object-cover" />
                      {/* Premium Slide-up Title Overlay on Hover */}
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950 via-slate-950/90 to-transparent p-2 pt-8 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                        <p className="font-extrabold text-[9px] text-white text-center truncate leading-tight">{card.name}</p>
                        <p className="text-[7px] text-yellow-500 text-center font-mono mt-0.5">{card.passcode}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 3. Side Deck Recipe */}
              <div className="space-y-4">
                <h4 className="text-sm font-black uppercase text-slate-900 dark:text-amber-100/95 flex items-center gap-1.5 tracking-wider border-b dark:border-slate-850 pb-2">
                  <Layers size={14} className="text-teal-500" />
                  <span>Side Deck ({selectedDeck.side.length} Kartu)</span>
                </h4>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3.5">
                  {selectedDeck.side.map((card, idx) => (
                    <div 
                      key={idx} 
                      className="group aspect-[3/4] relative rounded-xl overflow-hidden bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-md cursor-pointer hover:scale-[1.04] hover:border-yellow-500 hover:shadow-yellow-500/10 transition-all duration-200"
                    >
                      <img src={card.imageUrl} alt={card.name} className="w-full h-full object-cover" />
                      {/* Premium Slide-up Title Overlay on Hover */}
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950 via-slate-950/90 to-transparent p-2 pt-8 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                        <p className="font-extrabold text-[9px] text-white text-center truncate leading-tight">{card.name}</p>
                        <p className="text-[7px] text-yellow-500 text-center font-mono mt-0.5">{card.passcode}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        </div>
      </div>
    </main>
  )
}
