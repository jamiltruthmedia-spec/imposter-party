'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Card from '@/components/Card'
import { loadGame, saveGame, isImpostor, advancePlayer, isGameComplete, GameState } from '@/lib/game'

type Stage = 'pass' | 'revealed' | 'hidden'

export default function PlayPage() {
  const router = useRouter()
  const [game, setGame] = useState<GameState | null>(null)
  const [stage, setStage] = useState<Stage>('pass')
  const [isRevealed, setIsRevealed] = useState(false)

  useEffect(() => {
    const g = loadGame()
    if (!g) {
      router.replace('/')
      return
    }
    setGame(g)
  }, [router])

  if (!game) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#1a1a2e' }}>
        <div className="text-white text-lg">Loading game...</div>
      </div>
    )
  }

  const currentPlayer = game.players[game.currentPlayerIndex]
  const playerIsImpostor = isImpostor(game, game.currentPlayerIndex)
  const progress = `${game.currentPlayerIndex + 1} of ${game.players.length}`

  const handleCardTap = () => {
    if (stage === 'pass') return
    if (!isRevealed) {
      setIsRevealed(true)
      setStage('revealed')
    } else {
      setIsRevealed(false)
      setStage('hidden')
    }
  }

  const handleReady = () => {
    if (stage !== 'hidden' && stage !== 'revealed') return

    // Advance to next player
    const updated = advancePlayer(game)
    saveGame(updated)

    if (isGameComplete(updated)) {
      router.push('/results')
      return
    }

    setGame(updated)
    setStage('pass')
    setIsRevealed(false)
  }

  return (
    <main
      className="min-h-screen flex flex-col px-6 py-8"
      style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)' }}
    >
      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-400 text-sm font-medium">Progress</span>
          <span className="text-gray-400 text-sm font-medium">{progress}</span>
        </div>
        <div className="w-full rounded-full h-2" style={{ background: 'rgba(255,255,255,0.1)' }}>
          <div
            className="h-2 rounded-full transition-all duration-500"
            style={{
              width: `${(game.currentPlayerIndex / game.players.length) * 100}%`,
              background: 'linear-gradient(to right, #00d4ff, #0099bb)',
              boxShadow: '0 0 8px rgba(0,212,255,0.5)',
            }}
          />
        </div>
      </div>

      {/* Pass screen */}
      {stage === 'pass' && (
        <div className="flex-1 flex flex-col items-center justify-center text-center">
          <div className="text-6xl mb-6 float">📱</div>
          <p className="text-gray-400 text-lg mb-2">Pass the phone to</p>
          <h2
            className="text-4xl font-black mb-2"
            style={{ color: '#00d4ff', textShadow: '0 0 20px rgba(0,212,255,0.6)' }}
          >
            {currentPlayer}
          </h2>
          <p className="text-gray-500 text-sm mb-12">Make sure no one else is watching!</p>

          <button
            onClick={() => setStage('revealed')}
            className="w-full max-w-sm py-5 rounded-2xl font-bold text-xl transition-all duration-200 active:scale-95"
            style={{
              background: 'linear-gradient(135deg, #00d4ff, #0099bb)',
              color: '#1a1a2e',
              boxShadow: '0 0 30px rgba(0,212,255,0.5)',
            }}
          >
            I have the phone →
          </button>
        </div>
      )}

      {/* Reveal stage */}
      {(stage === 'revealed' || stage === 'hidden') && (
        <div className="flex-1 flex flex-col">
          <div className="text-center mb-6">
            <p className="text-gray-400 text-sm">
              {currentPlayer}&apos;s card
            </p>
          </div>

          {/* Card */}
          <div className="flex-1 flex items-center justify-center">
            <div className="w-full max-w-sm">
              <Card
                isImpostor={playerIsImpostor}
                word={game.word}
                isRevealed={isRevealed}
                onTap={handleCardTap}
              />
            </div>
          </div>

          {/* Tap hint */}
          {!isRevealed && (
            <div className="text-center py-4">
              <p className="text-gray-500 text-sm">Tap the card to reveal your role</p>
            </div>
          )}

          {/* Continue button — only show after reveal */}
          {isRevealed && (
            <div className="mt-4">
              <p className="text-center text-gray-500 text-sm mb-3">
                Tap card to hide, then pass the phone
              </p>
              <button
                onClick={handleReady}
                className="w-full py-4 rounded-2xl font-bold text-lg transition-all duration-200 active:scale-95"
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  color: 'white',
                }}
              >
                {game.currentPlayerIndex + 1 < game.players.length
                  ? `Pass to ${game.players[game.currentPlayerIndex + 1]} →`
                  : 'All done — See Results →'}
              </button>
            </div>
          )}
        </div>
      )}
    </main>
  )
}
