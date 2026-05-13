'use client'

import { useState, useEffect, useRef } from 'react'
import Navbar from '@/components/Navbar'
import { Sparkles, Trophy, RotateCcw, AlertCircle, ArrowRight, Timer, HelpCircle, CheckCircle2, XCircle } from 'lucide-react'
import Link from 'next/link'

interface Question {
  card: any
  options: any[]
  correctAnswer: string
}

export default function QuizPage() {
  const [gameMode, setGameMode] = useState<'lobby' | 'artwork' | 'attribute'>('lobby')
  const [currentRound, setCurrentRound] = useState(1)
  const [score, setScore] = useState(0)
  const [gameState, setGameState] = useState<'loading' | 'question' | 'answered' | 'completed'>('loading')
  
  // Active question state
  const [question, setQuestion] = useState<Question | null>(null)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [timeRemaining, setTimeRemaining] = useState(30)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // Load a new question
  const generateQuestion = async (mode: 'artwork' | 'attribute') => {
    setGameState('loading')
    setSelectedAnswer(null)
    setTimeRemaining(30)

    try {
      // Fetch 4 random cards in parallel to form multiple choices
      const cardsResponse = await Promise.all([
        fetch('/api/cards/random').then(r => r.json()),
        fetch('/api/cards/random').then(r => r.json()),
        fetch('/api/cards/random').then(r => r.json()),
        fetch('/api/cards/random').then(r => r.json())
      ])

      // Ensure all fetched elements are valid
      const cards = cardsResponse.filter(c => c && c.name)
      if (cards.length < 4) throw new Error('Not enough valid cards fetched')

      // Target Card is the first element
      const targetCard = cards[0]

      // Helper: Shuffle Array
      const shuffle = (array: any[]) => {
        const copy = [...array]
        for (let i = copy.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [copy[i], copy[j]] = [copy[j], copy[i]]
        }
        return copy
      }

      if (mode === 'artwork') {
        const options = shuffle(cards.map(c => c.name))
        setQuestion({
          card: targetCard,
          options,
          correctAnswer: targetCard.name
        })
      } else {
        // Attribute Mode - choices are standard attributes
        const attributes = ['FIRE', 'WATER', 'EARTH', 'WIND', 'LIGHT', 'DARK', 'DIVINE']
        const correctAttr = targetCard.attribute?.name || 'LIGHT'
        
        // Pick 3 other random attributes
        const otherAttrs = shuffle(attributes.filter(a => a !== correctAttr)).slice(0, 3)
        const options = shuffle([correctAttr, ...otherAttrs])

        setQuestion({
          card: targetCard,
          options,
          correctAnswer: correctAttr
        })
      }

      setGameState('question')
    } catch (err) {
      console.error('Failed to compile quiz question:', err)
      // Retry
      setTimeout(() => generateQuestion(mode), 1000)
    }
  }

  // Start game
  const startGame = (mode: 'artwork' | 'attribute') => {
    setGameMode(mode)
    setCurrentRound(1)
    setScore(0)
    generateQuestion(mode)
  }

  // Submit Answer
  const submitAnswer = (answer: string) => {
    if (gameState !== 'question') return
    
    // Stop Timer
    if (timerRef.current) clearInterval(timerRef.current)

    setSelectedAnswer(answer)
    setGameState('answered')

    if (answer === question?.correctAnswer) {
      setScore(prev => prev + 1)
    }
  }

  // Next Question / Finish Game
  const handleNextRound = () => {
    if (currentRound >= 10) {
      setGameState('completed')
    } else {
      setCurrentRound(prev => prev + 1)
      generateQuestion(gameMode as any)
    }
  }

  // Timer effect
  useEffect(() => {
    if (gameState === 'question') {
      timerRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            // Time Out - submit blank answer
            if (timerRef.current) clearInterval(timerRef.current)
            submitAnswer('')
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [gameState])

  // Get duel rank from final score
  const getDuelRank = () => {
    const percentage = (score / 10) * 100
    if (percentage >= 90) return { name: 'King of Games 👑', color: 'text-yellow-400 border-yellow-400 bg-yellow-500/10 shadow-yellow-500/10', title: 'Pharaoh Duelist' }
    if (percentage >= 60) return { name: 'Obelisk Blue 🛡️', color: 'text-blue-400 border-blue-400 bg-blue-500/10 shadow-blue-500/10', title: 'Elite Academy Student' }
    if (percentage >= 30) return { name: 'Ra Yellow ☀️', color: 'text-amber-500 border-amber-500 bg-amber-500/10 shadow-amber-500/10', title: 'Senior Student' }
    return { name: 'Slifer Red 👹', color: 'text-red-500 border-red-500 bg-red-500/10 shadow-red-500/10', title: 'New Academy Recruit' }
  }

  const rank = getDuelRank()

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-250">
      <Navbar />

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        
        {/* GAME SCREEN A: LOBBY SELECT */}
        {gameMode === 'lobby' && (
          <div className="flex flex-col items-center justify-center min-h-[70vh]">
            <div className="text-center max-w-xl mx-auto mb-10">
              <span className="text-yellow-400 text-xs font-black uppercase tracking-widest bg-yellow-500/10 border border-yellow-500/20 px-3 py-1.5 rounded-full">Mini-Game Arena</span>
              <h1 className="text-3xl sm:text-5xl font-black mt-4 mb-2 uppercase tracking-wider yugioh-glow-text">🎮 Yugioh Trivia Quiz</h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base leading-relaxed">Uji seberapa luas pengetahuan deck duel kartu Anda! Hadapi kuis interaktif 10 ronde dan peroleh ranking akademi legendarismu.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-2xl">
              {/* Option 1: Guess Artwork */}
              <button
                onClick={() => startGame('artwork')}
                className="group p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 hover:border-yellow-500/30 rounded-3xl shadow-xl hover:shadow-2xl transition duration-300 text-left flex flex-col justify-between h-56"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 flex items-center justify-center text-xl mb-4 group-hover:scale-110 transition">🖼️</div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 uppercase tracking-wide group-hover:text-yellow-500 transition-colors">Tebak Gambar Art</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">Tebak judul nama kartu yang benar dari potongan gambar ilustrasi seni di dalam kartu.</p>
                </div>
                <span className="text-xs font-bold text-yellow-500 mt-4 flex items-center gap-1">Mulai Bermain <ArrowRight size={14} /></span>
              </button>

              {/* Option 2: Guess Element */}
              <button
                onClick={() => startGame('attribute')}
                className="group p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 hover:border-yellow-500/30 rounded-3xl shadow-xl hover:shadow-2xl transition duration-300 text-left flex flex-col justify-between h-56"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 flex items-center justify-center text-xl mb-4 group-hover:scale-110 transition">🔥</div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 uppercase tracking-wide group-hover:text-yellow-500 transition-colors">Tebak Atribut Elemen</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">Tebak tipe elemen atribut (LIGHT, DARK, FIRE, WATER, dsb) dari kartu monster yang ditampilkan.</p>
                </div>
                <span className="text-xs font-bold text-yellow-500 mt-4 flex items-center gap-1">Mulai Bermain <ArrowRight size={14} /></span>
              </button>
            </div>
          </div>
        )}

        {/* GAME SCREEN B: ACTIVE GAMEPLAY */}
        {gameMode !== 'lobby' && gameState !== 'completed' && (
          <div className="min-h-[70vh] flex flex-col justify-between">
            {/* Round & Timer HUD */}
            <div className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-850/80 p-4 rounded-2xl shadow-lg flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 font-bold text-xs rounded-lg uppercase tracking-wider">Ronde {currentRound} / 10</span>
                <span className="text-xs font-semibold text-gray-400">Skor: <span className="text-yellow-500 font-extrabold">{score}</span> / {currentRound - (gameState === 'answered' ? 0 : 1)}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100 font-bold text-sm">
                <Timer size={16} className={`text-yellow-500 ${timeRemaining < 10 ? 'animate-bounce text-red-500' : ''}`} />
                <span className={`${timeRemaining < 10 ? 'text-red-500' : ''}`}>{timeRemaining}s</span>
              </div>
            </div>

            {/* Loading stage */}
            {gameState === 'loading' && (
              <div className="flex-1 flex flex-col items-center justify-center py-20">
                <div className="w-10 h-10 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-gray-400 font-semibold text-xs uppercase tracking-widest mt-4">Merangkai Kartu Tantangan...</p>
              </div>
            )}

            {/* Question Play stage */}
            {gameState !== 'loading' && question && (
              <div className="flex-1 flex flex-col items-center">
                
                {/* Visual Challenge Container */}
                <div className="mb-8 w-full max-w-sm flex items-center justify-center">
                  {gameMode === 'artwork' ? (
                    /* Artwork Guess: Show cropped artwork only */
                    <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-3xl overflow-hidden border-4 border-yellow-500/30 bg-slate-950 shadow-2xl relative">
                      <img 
                        src={
                          question.card.imageUrl 
                            ? question.card.imageUrl.replace('/cards/', '/cards_cropped/') 
                            : `https://images.ygoprodeck.com/images/cards_cropped/${question.card.passcode || question.card.id}.jpg`
                        } 
                        alt="Guess Me" 
                        className="w-full h-full object-cover" 
                        onError={(e) => {
                          e.currentTarget.src = question.card.imageUrl || `https://via.placeholder.com/300x420/1e293b/ffffff?text=${encodeURIComponent(question.card.name)}`
                        }}
                      />
                    </div>
                  ) : (
                    /* Attribute Guess: Show full card image */
                    <div className="w-44 h-64 sm:w-52 sm:h-76 rounded-2xl overflow-hidden shadow-2xl bg-slate-950 border border-slate-800">
                      <img 
                        src={question.card.imageUrl || `https://via.placeholder.com/300x420/1e293b/ffffff?text=${encodeURIComponent(question.card.name)}`} 
                        alt="Guess Me" 
                        className="w-full h-full object-contain" 
                        onError={(e) => {
                          e.currentTarget.src = `https://via.placeholder.com/300x420/1e293b/ffffff?text=${encodeURIComponent(question.card.name)}`
                        }}
                      />
                    </div>
                  )}
                </div>

                {/* Subtitle / Task */}
                <div className="text-center mb-6">
                  <h2 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-wider mb-1 flex items-center justify-center gap-1.5">
                    <HelpCircle size={18} className="text-yellow-500" />
                    <span>{gameMode === 'artwork' ? 'Nama kartu apakah gambar di atas?' : 'Apakah Atribut Elemen dari kartu ini?'}</span>
                  </h2>
                  <p className="text-xs text-gray-400">Pilih satu jawaban paling akurat dari tombol-tombol pilihan ganda di bawah ini.</p>
                </div>

                {/* Multiple Choices */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-2xl mb-8">
                  {question.options.map((option, i) => {
                    const isSelected = selectedAnswer === option
                    const isCorrect = option === question.correctAnswer
                    const hasAnswered = gameState === 'answered'

                    return (
                      <button
                        key={i}
                        onClick={() => submitAnswer(option)}
                        disabled={hasAnswered}
                        className={`w-full py-4 px-5 rounded-2xl border text-left font-bold text-sm transition-all duration-200 flex justify-between items-center ${
                          hasAnswered
                            ? isCorrect
                              ? 'bg-green-500/10 border-green-500 text-green-500 shadow-md'
                              : isSelected
                                ? 'bg-red-500/10 border-red-500 text-red-500'
                                : 'bg-slate-100/50 dark:bg-slate-900/20 border-slate-200 dark:border-slate-850 text-gray-500'
                            : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-850 hover:border-yellow-500 text-slate-800 dark:text-slate-200 hover:text-yellow-500'
                        }`}
                      >
                        <span>{option}</span>
                        {hasAnswered && isCorrect && <CheckCircle2 size={16} className="text-green-500 shrink-0" />}
                        {hasAnswered && isSelected && !isCorrect && <XCircle size={16} className="text-red-500 shrink-0" />}
                      </button>
                    )
                  })}
                </div>

                {/* Next controller */}
                {gameState === 'answered' && (
                  <button
                    onClick={handleNextRound}
                    className="px-8 py-3.5 bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-black rounded-xl tracking-wider uppercase text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-yellow-500/10 animate-[bounce_2s_infinite]"
                  >
                    <span>{currentRound >= 10 ? 'Selesai & Lihat Hasil' : 'Ronde Berikutnya'}</span>
                    <ArrowRight size={14} />
                  </button>
                )}

              </div>
            )}
          </div>
        )}

        {/* GAME SCREEN C: COMPLETED SCORE SCORE */}
        {gameState === 'completed' && (
          <div className="flex flex-col items-center justify-center min-h-[70vh] py-10">
            <div className="w-16 h-16 bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 rounded-2xl flex items-center justify-center text-3xl mb-4 animate-[spin_5s_infinite_linear]">
              <Trophy size={28} />
            </div>

            <span className="text-gray-400 text-xs font-bold uppercase tracking-widest">Kuis Selesai!</span>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white mt-1.5 mb-1 tracking-wide uppercase">Hasil Penilaian Duel</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center max-w-sm">Selamat, Anda berhasil menyelesaikan kuis pertarungan trivia dengan baik.</p>

            {/* Academy Rank Badge */}
            <div className={`mt-8 p-6 rounded-3xl border-2 flex flex-col items-center shadow-2xl text-center max-w-xs w-full ${rank.color}`}>
              <span className="text-[10px] font-black uppercase tracking-wider opacity-60">Akademi Rank</span>
              <h2 className="text-2xl font-black uppercase mt-1 tracking-wide">{rank.name}</h2>
              <p className="text-xs font-bold uppercase tracking-tight opacity-75 mt-0.5">{rank.title}</p>
              
              <div className="mt-5 text-4xl font-black tracking-wider text-slate-900 dark:text-white bg-white/10 px-6 py-2.5 rounded-2xl border border-white/5 shadow-inner">
                {score * 10} <span className="text-xs opacity-60">PTS</span>
              </div>
              <p className="text-[10px] opacity-50 mt-3 font-semibold">{score} dari 10 Jawaban Benar</p>
            </div>

            {/* Lobby & replay controls */}
            <div className="flex flex-col sm:flex-row gap-3 mt-10 w-full max-w-md">
              <button
                onClick={() => setGameMode('lobby')}
                className="px-6 py-3 bg-slate-800 hover:bg-slate-750 border border-slate-700 text-white font-bold rounded-xl text-xs uppercase tracking-wider flex-1"
              >
                Kembali ke Lobby
              </button>
              <button
                onClick={() => startGame(gameMode as any)}
                className="px-6 py-3 bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-black rounded-xl text-xs uppercase tracking-wider flex-1 flex items-center justify-center gap-1.5 shadow-lg shadow-yellow-500/15"
              >
                <RotateCcw size={13} />
                <span>Bermain Lagi</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </main>
  )
}
