'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { loadGame, clearGame, GameState } from '@/lib/game'

export default function ResultsPage() {
  const router = useRouter()
  const [game, setGame] = useState<GameState | null>(null)
  const [revealed, setRevealed] = useState(false)

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
  const innocents = game.players.filter((_, i) => !game.impostorIndices.includes(i))

  return (
    <main
      className="min-h-screen flex flex-col px-6 py-10"
      style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)' }}
    >
      {/* Title */}
      <div className="text-center mb-8">
        <div className="text-5xl mb-4">🎭</div>
        <h1 className="text-3xl font-black text-white">Game Over!</h1>
        <p className="text-gray-400 mt-1">Who was the imposter?</p>
      </div>

      {/* Reveal button or results */}
      {!revealed ? (
        <div className="flex-1 flex flex-col items-center justify-center">
          <div
            className="w-full max-w-sm rounded-3xl p-8 text-center mb-8"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '2px dashed rgba(255,255,255,0.15)',
            }}
          >
            <div className="text-4xl mb-3">🤔</div>
            <p className="text-gray-300 font-semibold text-lg">Did you find them?</p>
            <p className="text-gray-500 text-sm mt-2">Tap below to reveal the truth</p>
          </div>

          <button
            onClick={() => setRevealed(true)}
            className="w-full max-w-sm py-5 rounded-2xl font-bold text-xl transition-all duration-200 active:scale-95"
            style={{
              background: 'linear-gradient(135deg, #ff4444, #cc2222)',
              color: 'white',
              boxShadow: '0 0 30px rgba(255,68,68,0.5)',
            }}
          >
            REVEAL THE TRUTH 😈
          </button>
        </div>
      ) : (
        <div className="flex-1 space-y-4 max-w-sm mx-auto w-full">
          {/* The Word */}
          <div
            className="rounded-2xl p-5 text-center"
            style={{
              background: 'rgba(0,212,255,0.1)',
              border: '2px solid rgba(0,212,255,0.4)',
              boxShadow: '0 0 20px rgba(0,212,255,0.2)',
            }}
          >
            <p className="text-gray-400 text-xs font-semibold uppercase tracking-widest mb-1">The Word Was</p>
            <p
              className="text-4xl font-black capitalize"
              style={{ color: '#00d4ff', textShadow: '0 0 20px rgba(0,212,255,0.8)' }}
            >
              {game.word}
            </p>
          </div>

          {/* The Imposters */}
          <div
            className="rounded-2xl p-5"
            style={{
              background: 'rgba(255,68,68,0.1)',
              border: '2px solid rgba(255,68,68,0.4)',
              boxShadow: '0 0 20px rgba(255,68,68,0.2)',
            }}
          >
            <p className="text-gray-400 text-xs font-semibold uppercase tracking-widest mb-3">
              The Imposter{impostors.length > 1 ? 's Were' : ' Was'}
            </p>
            {impostors.map((name, i) => (
              <div key={i} className="flex items-center gap-3 mb-2">
                <span className="text-2xl">😈</span>
                <span
                  className="text-2xl font-black"
                  style={{ color: '#ff4444', textShadow: '0 0 15px rgba(255,68,68,0.6)' }}
                >
                  {name}
                </span>
              </div>
            ))}
          </div>

          {/* Innocents */}
          <div
            className="rounded-2xl p-5"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            <p className="text-gray-500 text-xs font-semibold uppercase tracking-widest mb-3">The Innocents</p>
            <div className="flex flex-wrap gap-2">
              {innocents.map((name, i) => (
                <span
                  key={i}
                  className="px-3 py-1 rounded-full text-sm font-semibold"
                  style={{ background: 'rgba(0,212,255,0.1)', color: '#00d4ff', border: '1px solid rgba(0,212,255,0.2)' }}
                >
                  {name}
                </span>
              ))}
            </div>
          </div>

          {/* Category + word info */}
          <div
            className="rounded-xl p-4 flex items-center gap-3"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
          >
            <span className="text-lg">{game.category === 'Objects' ? '📦' : game.category === 'Locations' ? '🗺️' : '🍕'}</span>
            <div>
              <p className="text-gray-400 text-xs">Category: {game.category}</p>
              <p className="text-gray-400 text-xs">{game.players.length} players · {game.impostorIndices.length} imposter{game.impostorIndices.length > 1 ? 's' : ''}</p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="space-y-3 pt-2">
            <button
              onClick={handlePlayAgain}
              className="w-full py-4 rounded-2xl font-bold text-lg transition-all duration-200 active:scale-95"
              style={{
                background: 'linear-gradient(135deg, #00d4ff, #0099bb)',
                color: '#1a1a2e',
                boxShadow: '0 0 20px rgba(0,212,255,0.4)',
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
      )}
    </main>
  )
}
