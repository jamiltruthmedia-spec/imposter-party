'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { loadGame, clearGame, GameState } from '@/lib/game'

export default function ResultsPage() {
  const router = useRouter()
  const [game, setGame] = useState<GameState | null>(null)

  useEffect(() => {
    const g = loadGame()
    if (!g) {
      router.replace('/')
      return
    }
    setGame(g)
  }, [router])

  const handlePlayAgain = () => {
    clearGame()
    router.push('/setup')
  }

  const handleNewGame = () => {
    clearGame()
    router.push('/')
  }

  if (!game) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#1a1a2e' }}>
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  const impostors = game.impostorIndices.map((i) => game.players[i])
  const impostorLabel =
    impostors.length === 1
      ? impostors[0]
      : impostors.slice(0, -1).join(', ') + ' and ' + impostors[impostors.length - 1]

  return (
    <main
      className="min-h-screen flex flex-col px-6 py-10 items-center"
      style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)' }}
    >
      <div className="w-full max-w-sm flex flex-col items-center">
        {/* Icon */}
        <div className="text-6xl mb-4">🎭</div>

        {/* THE IMPOSTER WAS */}
        <p
          className="text-sm font-black uppercase tracking-widest mb-2"
          style={{ color: '#ff6644' }}
        >
          The Imposter Was
        </p>

        {/* Imposter name(s) — large gradient text */}
        <p
          className="text-4xl font-black text-center mb-8 leading-tight"
          style={{
            background: 'linear-gradient(135deg, #f97316, #fbbf24)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            textShadow: 'none',
          }}
        >
          {impostorLabel}
        </p>

        {/* Secret word card */}
        <div
          className="w-full rounded-2xl p-6 text-center mb-6"
          style={{
            background: 'rgba(0,212,255,0.08)',
            border: '2px solid rgba(0,212,255,0.4)',
            boxShadow: '0 0 24px rgba(0,212,255,0.2)',
          }}
        >
          <p
            className="text-xs font-black uppercase tracking-widest mb-2"
            style={{ color: 'rgba(0,212,255,0.6)' }}
          >
            Secret Word
          </p>
          <p
            className="text-5xl font-black capitalize"
            style={{ color: '#00d4ff', textShadow: '0 0 20px rgba(0,212,255,0.7)' }}
          >
            {game.word}
          </p>
        </div>

        {/* Category info */}
        <div
          className="w-full rounded-xl p-3 flex items-center gap-3 mb-8"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
        >
          <span className="text-lg">
            {game.category === 'Objects' ? '📦' : game.category === 'Locations' ? '🗺️' : '🍕'}
          </span>
          <p className="text-gray-400 text-xs">
            {game.category} · {game.players.length} players · {game.impostorIndices.length} imposter
            {game.impostorIndices.length > 1 ? 's' : ''}
          </p>
        </div>

        {/* Buttons */}
        <div className="w-full space-y-3">
          <button
            onClick={handlePlayAgain}
            className="w-full py-4 rounded-2xl font-bold text-lg transition-all duration-200 active:scale-95"
            style={{
              background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
              color: 'white',
              boxShadow: '0 0 20px rgba(139,92,246,0.4)',
            }}
          >
            Play Again 🔄
          </button>
          <button
            onClick={handleNewGame}
            className="w-full py-4 rounded-2xl font-bold text-lg transition-all duration-200 active:scale-95"
            style={{
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.12)',
              color: 'white',
            }}
          >
            New Game 🏠
          </button>
        </div>
      </div>
    </main>
  )
}
