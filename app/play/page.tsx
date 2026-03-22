'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Card from '@/components/Card'
import GameProtection from '@/components/GameProtection'
import FullscreenButton from '@/components/FullscreenButton'
import { loadGame, saveGame, clearGame, isImpostor, advancePlayer, isGameComplete, GameState } from '@/lib/game'

type Stage = 'pass' | 'revealed' | 'hidden'

export default function PlayPage() {
  const router = useRouter()
  const [game, setGame] = useState<GameState | null>(null)
  const [stage, setStage] = useState<Stage>('pass')
  const [isRevealed, setIsRevealed] = useState(false)
  const [showLeaveModal, setShowLeaveModal] = useState(false)

  useEffect(() => {
    const g = loadGame()
    if (!g) {
      router.replace('/')
      return
    }
    setGame(g)
  }, [router])

  const handleAttemptLeave = useCallback(() => {
    setShowLeaveModal(true)
  }, [])

  const handleConfirmLeave = () => {
    clearGame()
    setShowLeaveModal(false)
    router.replace('/')
  }

  const handleCancelLeave = () => {
    setShowLeaveModal(false)
  }

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

    const updated = advancePlayer(game)
    saveGame(updated)

    if (isGameComplete(updated)) {
      clearGame() // normal completion — clear auto-save
      router.push('/results')
      return
    }

    setGame(updated)
    setStage('pass')
    setIsRevealed(false)
  }

  return (
    <>
      {/* Mobile protection — active throughout gameplay */}
      <GameProtection isActive={true} onAttemptLeave={handleAttemptLeave} />

      {/* Leave-game confirmation modal */}
      {showLeaveModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-6"
          style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)' }}
        >
          <div
            className="w-full max-w-sm rounded-3xl p-7 text-center"
            style={{ background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.12)' }}
          >
            <div className="text-4xl mb-4">⚠️</div>
            <h2 className="text-xl font-black text-white mb-2">Quit Game?</h2>
            <p className="text-gray-400 text-sm mb-6">
              The current game will be lost. Everyone loses their roles.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleCancelLeave}
                className="flex-1 py-3 rounded-xl font-bold text-base transition-all duration-200 active:scale-95"
                style={{
                  background: 'rgba(0,212,255,0.15)',
                  border: '1px solid rgba(0,212,255,0.3)',
                  color: '#00d4ff',
                }}
              >
                Keep Playing
              </button>
              <button
                onClick={handleConfirmLeave}
                className="flex-1 py-3 rounded-xl font-bold text-base transition-all duration-200 active:scale-95"
                style={{
                  background: 'rgba(255,68,68,0.15)',
                  border: '1px solid rgba(255,68,68,0.3)',
                  color: '#ff6666',
                }}
              >
                Quit
              </button>
            </div>
          </div>
        </div>
      )}

      <main
        className="min-h-screen flex flex-col px-6 pb-8"
        style={{
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
          paddingTop: '2.5rem', // offset for the "Game in Progress" banner
        }}
      >
        {/* Progress bar + fullscreen toggle */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-400 text-sm font-medium">Progress</span>
            <div className="flex items-center gap-2">
              <span className="text-gray-400 text-sm font-medium">{progress}</span>
              <FullscreenButton />
            </div>
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

            {!isRevealed && (
              <div className="text-center py-4">
                <p className="text-gray-500 text-sm">Tap the card to reveal your role</p>
              </div>
            )}

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
    </>
  )
}
