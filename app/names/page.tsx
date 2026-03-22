'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createGame, saveGame, Category } from '@/lib/game'

function NamesContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const initialPlayerCount = parseInt(searchParams.get('players') || '5')
  const impostorCountParam = parseInt(searchParams.get('impostors') || '1')
  const impostorMode = searchParams.get('impostorMode') || 'fixed'
  const neverFirst = searchParams.get('neverFirst') === 'true'
  const category = (searchParams.get('category') || 'Objects') as Category

  const [names, setNames] = useState<string[]>(
    Array.from({ length: initialPlayerCount }, () => '')
  )

  const playerCount = names.length

  // Derived: actual imposter count (resolved at game start if random)
  const maxImpostors = Math.min(12, playerCount - 1)
  const displayImpostorCount =
    impostorMode === 'random' ? '?' : Math.min(impostorCountParam, maxImpostors)

  const updateName = (index: number, value: string) => {
    const updated = [...names]
    updated[index] = value
    setNames(updated)
  }

  const addPlayer = () => {
    if (names.length < 100) {
      setNames([...names, ''])
    }
  }

  const removePlayer = (index: number) => {
    if (names.length <= 3) return
    setNames(names.filter((_, i) => i !== index))
  }

  const getPlayerName = (index: number) =>
    names[index].trim() || `Player ${index + 1}`

  const handleStart = () => {
    const players = Array.from({ length: playerCount }, (_, i) => getPlayerName(i))

    // Resolve imposter count
    let resolvedImpostorCount: number
    if (impostorMode === 'random') {
      const maxRandom = Math.min(12, Math.floor(players.length / 2), players.length - 1)
      resolvedImpostorCount = Math.max(1, Math.floor(Math.random() * maxRandom) + 1)
    } else {
      resolvedImpostorCount = Math.min(impostorCountParam, maxImpostors)
    }

    const game = createGame(players, resolvedImpostorCount, category, neverFirst)
    saveGame(game)
    router.push('/play')
  }

  return (
    <main className="min-h-screen px-6 py-8" style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)' }}>
      {/* Header */}
      <div className="flex items-center gap-4 mb-2">
        <Link href="/setup">
          <button
            className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 active:scale-95"
            style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)' }}
          >
            ←
          </button>
        </Link>
        <h1 className="text-2xl font-bold text-white">Player Names</h1>
      </div>
      <p className="text-gray-500 text-sm mb-6 ml-14">Optional — leave blank for default names</p>

      {/* Game info pills */}
      <div className="flex gap-2 mb-6 flex-wrap">
        <span className="px-3 py-1 rounded-full text-xs font-semibold" style={{ background: 'rgba(0,212,255,0.15)', color: '#00d4ff', border: '1px solid rgba(0,212,255,0.3)' }}>
          {playerCount} players
        </span>
        <span className="px-3 py-1 rounded-full text-xs font-semibold" style={{ background: 'rgba(255,68,68,0.15)', color: '#ff6666', border: '1px solid rgba(255,68,68,0.3)' }}>
          {impostorMode === 'random' ? '🎲 random imposters' : `${displayImpostorCount} imposter${typeof displayImpostorCount === 'number' && displayImpostorCount > 1 ? 's' : ''}`}
        </span>
        {neverFirst && (
          <span className="px-3 py-1 rounded-full text-xs font-semibold" style={{ background: 'rgba(255,68,68,0.1)', color: '#ff9999', border: '1px solid rgba(255,68,68,0.2)' }}>
            🚫 no first imposter
          </span>
        )}
        <span className="px-3 py-1 rounded-full text-xs font-semibold" style={{ background: 'rgba(255,255,255,0.08)', color: '#aaa', border: '1px solid rgba(255,255,255,0.12)' }}>
          {category}
        </span>
      </div>

      <div className="space-y-3 max-w-sm mx-auto mb-4">
        {names.map((name, i) => (
          <div key={i} className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
              style={{ background: 'rgba(0,212,255,0.15)', color: '#00d4ff', border: '1px solid rgba(0,212,255,0.3)' }}
            >
              {i + 1}
            </div>
            <input
              type="text"
              value={name}
              onChange={(e) => updateName(i, e.target.value)}
              placeholder={`Player ${i + 1}`}
              maxLength={20}
              className="flex-1 py-3 px-4 rounded-xl text-white font-medium outline-none transition-all duration-200"
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)',
                fontSize: '16px',
              }}
              onFocus={(e) => {
                e.target.style.border = '1px solid rgba(0,212,255,0.5)'
                e.target.style.boxShadow = '0 0 10px rgba(0,212,255,0.2)'
              }}
              onBlur={(e) => {
                e.target.style.border = '1px solid rgba(255,255,255,0.1)'
                e.target.style.boxShadow = 'none'
              }}
            />
            {/* Remove button (X) — only show if > 3 players */}
            <button
              onClick={() => removePlayer(i)}
              disabled={names.length <= 3}
              className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 transition-all duration-200 active:scale-95"
              style={{
                background: names.length <= 3 ? 'rgba(255,255,255,0.03)' : 'rgba(255,68,68,0.15)',
                border: names.length <= 3 ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(255,68,68,0.3)',
                color: names.length <= 3 ? 'rgba(255,255,255,0.15)' : '#ff6666',
                cursor: names.length <= 3 ? 'not-allowed' : 'pointer',
              }}
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      {/* Add / Remove buttons */}
      <div className="flex gap-3 max-w-sm mx-auto mb-6">
        <button
          onClick={addPlayer}
          disabled={names.length >= 100}
          className="flex-1 py-3 rounded-xl font-semibold text-sm transition-all duration-200 active:scale-95"
          style={{
            background: names.length >= 100 ? 'rgba(255,255,255,0.03)' : 'rgba(139,92,246,0.2)',
            border: names.length >= 100 ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(139,92,246,0.4)',
            color: names.length >= 100 ? 'rgba(255,255,255,0.2)' : '#a78bfa',
            cursor: names.length >= 100 ? 'not-allowed' : 'pointer',
          }}
        >
          + Add Player
        </button>
        <button
          onClick={() => removePlayer(names.length - 1)}
          disabled={names.length <= 3}
          className="flex-1 py-3 rounded-xl font-semibold text-sm transition-all duration-200 active:scale-95"
          style={{
            background: names.length <= 3 ? 'rgba(255,255,255,0.03)' : 'rgba(255,68,68,0.15)',
            border: names.length <= 3 ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(255,68,68,0.3)',
            color: names.length <= 3 ? 'rgba(255,255,255,0.2)' : '#ff6666',
            cursor: names.length <= 3 ? 'not-allowed' : 'pointer',
          }}
        >
          − Remove Last
        </button>
      </div>

      <div className="max-w-sm mx-auto">
        <button
          onClick={handleStart}
          className="w-full py-5 rounded-2xl font-bold text-xl tracking-wide transition-all duration-200 active:scale-95"
          style={{
            background: 'linear-gradient(135deg, #00d4ff, #0099bb)',
            color: '#1a1a2e',
            boxShadow: '0 0 30px rgba(0,212,255,0.5), 0 4px 20px rgba(0,212,255,0.3)',
          }}
        >
          Start Playing! 🎮
        </button>
      </div>
    </main>
  )
}

export default function NamesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#1a1a2e' }}>
        <div className="text-white">Loading...</div>
      </div>
    }>
      <NamesContent />
    </Suspense>
  )
}
