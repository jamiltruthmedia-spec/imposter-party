'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import GameProtection from '@/components/GameProtection'
import FullscreenButton from '@/components/FullscreenButton'
import { loadGame, saveGame, clearGame, isImpostor, GameState } from '@/lib/game'

type Phase = 'grid' | 'reveal' | 'voting'

export default function PlayPage() {
  const router = useRouter()
  const [game, setGame] = useState<GameState | null>(null)
  const [phase, setPhase] = useState<Phase>('grid')
  const [activePlayer, setActivePlayer] = useState<number | null>(null)
  const [cardRevealed, setCardRevealed] = useState(false)
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

  // Player taps their card on the grid
  const handlePlayerTap = (index: number) => {
    if (!game) return
    if (game.revealedPlayers[index]) return // already done
    setActivePlayer(index)
    setCardRevealed(false)
    setPhase('reveal')
  }

  // Got it! — mark player as revealed, return to grid
  const handleGotIt = () => {
    if (!game || activePlayer === null) return
    const newRevealed = [...game.revealedPlayers]
    newRevealed[activePlayer] = true
    const updated: GameState = { ...game, revealedPlayers: newRevealed }
    saveGame(updated)
    setGame(updated)
    setActivePlayer(null)
    setCardRevealed(false)

    // Check if ALL players have revealed
    if (newRevealed.every((r) => r)) {
      setPhase('voting')
    } else {
      setPhase('grid')
    }
  }

  // Reveal Results — go to results (game data stays in localStorage for results page to read)
  const handleRevealResults = () => {
    if (!game) return
    router.push('/results')
  }

  if (!game) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#1a1a2e' }}>
        <div className="text-white text-lg">Loading game...</div>
      </div>
    )
  }

  const revealedCount = game.revealedPlayers.filter(Boolean).length
  const totalPlayers = game.players.length

  // Determine starting player for discussion (neverFirst = imposter cannot be first)
  const startingPlayerIndex = game.neverFirst
    ? game.players.findIndex((_, i) => !isImpostor(game, i))
    : 0
  const startingPlayerName = game.players[startingPlayerIndex < 0 ? 0 : startingPlayerIndex]

  return (
    <>
      <GameProtection isActive={true} onAttemptLeave={handleAttemptLeave} />

      {/* Leave confirmation modal */}
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

      {/* ═══ PHASE: PLAYER GRID ═══ */}
      {phase === 'grid' && (
        <main
          className="min-h-screen flex flex-col px-5 pb-8"
          style={{
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
            paddingTop: '2.5rem',
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-2xl font-black text-white">Players</h1>
            <FullscreenButton />
          </div>
          <p className="text-gray-400 text-sm mb-1">
            Tap your name to reveal your word, then pass the device to the next player.
          </p>
          <p className="text-gray-500 text-xs mb-5">
            {revealedCount} of {totalPlayers} revealed
          </p>

          {/* Player grid — 2 columns */}
          <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto w-full">
            {game.players.map((name, i) => {
              const done = game.revealedPlayers[i]
              const initial = name.charAt(0).toUpperCase()
              return (
                <button
                  key={i}
                  onClick={() => handlePlayerTap(i)}
                  disabled={done}
                  className="flex flex-col items-center py-5 px-3 rounded-2xl transition-all duration-200 active:scale-95"
                  style={{
                    background: done ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.05)',
                    border: done
                      ? '1px solid rgba(255,255,255,0.07)'
                      : '1px solid rgba(139,92,246,0.3)',
                    boxShadow: done ? 'none' : '0 0 12px rgba(139,92,246,0.15)',
                    cursor: done ? 'default' : 'pointer',
                    opacity: done ? 0.45 : 1,
                  }}
                >
                  {/* Avatar circle */}
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center text-xl font-black mb-3"
                    style={{
                      background: done
                        ? 'rgba(255,255,255,0.08)'
                        : 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
                      color: done ? 'rgba(255,255,255,0.3)' : 'white',
                      boxShadow: done ? 'none' : '0 0 16px rgba(139,92,246,0.5)',
                    }}
                  >
                    {done ? '✓' : initial}
                  </div>
                  <span
                    className="text-sm font-bold text-center leading-tight"
                    style={{ color: done ? 'rgba(255,255,255,0.3)' : 'white' }}
                  >
                    {name}
                  </span>
                  {done && (
                    <span className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.25)' }}>
                      Done
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </main>
      )}

      {/* ═══ PHASE: WORD REVEAL ═══ */}
      {phase === 'reveal' && activePlayer !== null && (
        <WordRevealScreen
          game={game}
          playerIndex={activePlayer}
          cardRevealed={cardRevealed}
          onReveal={() => setCardRevealed(true)}
          onGotIt={handleGotIt}
        />
      )}

      {/* ═══ PHASE: VOTING ═══ */}
      {phase === 'voting' && (
        <VotingScreen
          startingPlayer={startingPlayerName}
          onRevealResults={handleRevealResults}
        />
      )}
    </>
  )
}

/* ─────────────────────────────────────────
   Word Reveal Sub-Screen
───────────────────────────────────────── */
function WordRevealScreen({
  game,
  playerIndex,
  cardRevealed,
  onReveal,
  onGotIt,
}: {
  game: GameState
  playerIndex: number
  cardRevealed: boolean
  onReveal: () => void
  onGotIt: () => void
}) {
  const playerName = game.players[playerIndex]
  const playerIsImpostor = isImpostor(game, playerIndex)

  // Other impostor names (for teammate display)
  const otherImpostors = game.impostorIndices
    .filter((i) => i !== playerIndex)
    .map((i) => game.players[i])

  return (
    <main
      className="min-h-screen flex flex-col px-6 pb-8 items-center"
      style={{
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
        paddingTop: '3rem',
      }}
    >
      {/* Header */}
      <div className="text-center mb-8 w-full max-w-sm">
        <p className="text-gray-400 text-base mb-1">The word for</p>
        <h2 className="text-3xl font-black text-white">{playerName}</h2>
      </div>

      {/* Card */}
      <div className="w-full max-w-sm mb-6">
        {!cardRevealed ? (
          /* Hidden state — sparkle animation */
          <button
            onClick={onReveal}
            className="w-full rounded-3xl flex flex-col items-center justify-center transition-all duration-300 active:scale-95"
            style={{
              background: 'linear-gradient(135deg, rgba(139,92,246,0.2), rgba(109,40,217,0.15))',
              border: '2px dashed rgba(139,92,246,0.5)',
              boxShadow: '0 0 30px rgba(139,92,246,0.25)',
              minHeight: '200px',
            }}
          >
            <div className="text-5xl mb-3 sparkle-anim">✨</div>
            <p className="text-gray-300 font-semibold text-lg">👆 Tap the box to reveal</p>
          </button>
        ) : playerIsImpostor ? (
          /* Imposter revealed */
          <div
            className="w-full rounded-3xl flex flex-col items-center justify-center p-8"
            style={{
              background: 'rgba(255,40,40,0.1)',
              border: '2px solid rgba(255,68,68,0.6)',
              boxShadow: '0 0 30px rgba(255,68,68,0.3)',
              minHeight: '200px',
            }}
          >
            <p
              className="text-5xl font-black mb-2"
              style={{ color: '#ff4444', textShadow: '0 0 20px rgba(255,68,68,0.8)' }}
            >
              Imposter
            </p>
            <p className="text-red-400 text-sm opacity-70">You don&apos;t know the word</p>
          </div>
        ) : (
          /* Civilian revealed */
          <div
            className="w-full rounded-3xl flex flex-col items-center justify-center p-8"
            style={{
              background: 'rgba(0,212,255,0.08)',
              border: '2px solid rgba(0,212,255,0.5)',
              boxShadow: '0 0 30px rgba(0,212,255,0.25)',
              minHeight: '200px',
            }}
          >
            <p
              className="text-5xl font-black capitalize"
              style={{ color: '#00d4ff', textShadow: '0 0 20px rgba(0,212,255,0.8)' }}
            >
              {game.word}
            </p>
          </div>
        )}
      </div>

      {/* Imposter teammates section */}
      {cardRevealed && playerIsImpostor && otherImpostors.length > 0 && (
        <div
          className="w-full max-w-sm rounded-2xl p-4 mb-6"
          style={{
            background: 'rgba(180,0,0,0.15)',
            border: '1px solid rgba(255,68,68,0.3)',
          }}
        >
          <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#ff6666' }}>
            👥 Your Teammates
          </p>
          {otherImpostors.map((name, i) => (
            <p key={i} className="font-bold" style={{ color: '#ff9999' }}>
              {name}
            </p>
          ))}
        </div>
      )}

      {/* Got it button */}
      {cardRevealed && (
        <div className="w-full max-w-sm">
          <button
            onClick={onGotIt}
            className="w-full py-4 rounded-2xl font-bold text-lg transition-all duration-200 active:scale-95"
            style={{
              background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
              color: 'white',
              boxShadow: '0 0 20px rgba(139,92,246,0.5)',
            }}
          >
            Got it!
          </button>
        </div>
      )}

      <style jsx>{`
        @keyframes sparkle {
          0%, 100% { transform: scale(1) rotate(0deg); opacity: 1; }
          25% { transform: scale(1.2) rotate(-10deg); opacity: 0.8; }
          50% { transform: scale(0.9) rotate(10deg); opacity: 1; }
          75% { transform: scale(1.15) rotate(-5deg); opacity: 0.9; }
        }
        .sparkle-anim {
          animation: sparkle 2s ease-in-out infinite;
        }
      `}</style>
    </main>
  )
}

/* ─────────────────────────────────────────
   Voting Phase Sub-Screen
───────────────────────────────────────── */
function VotingScreen({
  startingPlayer,
  onRevealResults,
}: {
  startingPlayer: string
  onRevealResults: () => void
}) {
  const steps = [
    {
      num: 1,
      title: 'Starting Player',
      desc: `${startingPlayer} starts the round`,
      color: '#3b82f6',
      bg: 'rgba(59,130,246,0.1)',
      border: 'rgba(59,130,246,0.3)',
      icon: '🎯',
    },
    {
      num: 2,
      title: 'Group Discussion',
      desc: 'Go clockwise',
      color: '#8b5cf6',
      bg: 'rgba(139,92,246,0.1)',
      border: 'rgba(139,92,246,0.3)',
      icon: '🔄',
    },
    {
      num: 3,
      title: 'Vote Time',
      desc: 'Each player says a word related to the secret. Go around two or three times.',
      color: '#f97316',
      bg: 'rgba(249,115,22,0.1)',
      border: 'rgba(249,115,22,0.3)',
      icon: '💬',
    },
    {
      num: 4,
      title: 'Reveal Phase',
      desc: 'Vote for the player you think is the imposter, then tap to reveal the results.',
      color: '#ef4444',
      bg: 'rgba(239,68,68,0.1)',
      border: 'rgba(239,68,68,0.3)',
      icon: '🗳️',
    },
  ]

  return (
    <main
      className="min-h-screen flex flex-col px-5 pb-8"
      style={{
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
        paddingTop: '3rem',
      }}
    >
      {/* Header */}
      <div className="text-center mb-2">
        <div className="text-4xl mb-3">🗳️</div>
        <h1 className="text-3xl font-black text-white mb-1">Voting Phase</h1>
        <p className="text-gray-400 text-sm">Time to discuss and vote for the imposter!</p>
      </div>

      {/* How to Vote */}
      <div className="mt-6 mb-6 max-w-sm mx-auto w-full">
        <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">How to Vote</p>
        <div className="space-y-3">
          {steps.map((step) => (
            <div
              key={step.num}
              className="flex items-start gap-3 p-4 rounded-2xl"
              style={{
                background: step.bg,
                border: `1px solid ${step.border}`,
              }}
            >
              {/* Number badge */}
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-black flex-shrink-0 mt-0.5"
                style={{ background: step.color, color: 'white' }}
              >
                {step.num}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">{step.icon}</span>
                  <p className="font-bold text-sm text-white">{step.title}</p>
                </div>
                <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Reveal Results button */}
      <div className="max-w-sm mx-auto w-full mt-auto">
        <button
          onClick={onRevealResults}
          className="w-full py-5 rounded-2xl font-bold text-xl tracking-wide transition-all duration-200 active:scale-95"
          style={{
            background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
            color: 'white',
            boxShadow: '0 0 30px rgba(139,92,246,0.5)',
          }}
        >
          Reveal Results 🎭
        </button>
      </div>
    </main>
  )
}
