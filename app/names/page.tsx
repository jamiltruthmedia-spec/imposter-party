'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createGame, saveGame, Category } from '@/lib/game'

function NamesContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const playerCount = parseInt(searchParams.get('players') || '5')
  const impostorCount = parseInt(searchParams.get('impostors') || '1')
  const category = (searchParams.get('category') || 'Objects') as Category

  const [names, setNames] = useState<string[]>(
    Array.from({ length: playerCount }, (_, i) => '')
  )

  const updateName = (index: number, value: string) => {
    const updated = [...names]
    updated[index] = value
    setNames(updated)
  }

  const getPlayerName = (index: number) =>
    names[index].trim() || `Player ${index + 1}`

  const handleStart = () => {
    const players = Array.from({ length: playerCount }, (_, i) => getPlayerName(i))
    const game = createGame(players, impostorCount, category)
    saveGame(game)
    router.push('/play')
  }

  return (
    <main className="min-h-screen px-6 py-8" style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)' }}>
      {/* Header */}
      <div className="flex items-center gap-4 mb-2">
        <Link href={`/setup`}>
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

      {/* Game info pill */}
      <div className="flex gap-2 mb-6 flex-wrap">
        <span className="px-3 py-1 rounded-full text-xs font-semibold" style={{ background: 'rgba(0,212,255,0.15)', color: '#00d4ff', border: '1px solid rgba(0,212,255,0.3)' }}>
          {playerCount} players
        </span>
        <span className="px-3 py-1 rounded-full text-xs font-semibold" style={{ background: 'rgba(255,68,68,0.15)', color: '#ff6666', border: '1px solid rgba(255,68,68,0.3)' }}>
          {impostorCount} imposter{impostorCount > 1 ? 's' : ''}
        </span>
        <span className="px-3 py-1 rounded-full text-xs font-semibold" style={{ background: 'rgba(255,255,255,0.08)', color: '#aaa', border: '1px solid rgba(255,255,255,0.12)' }}>
          {category}
        </span>
      </div>

      <div className="space-y-3 max-w-sm mx-auto mb-6">
        {Array.from({ length: playerCount }, (_, i) => (
          <div key={i} className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
              style={{ background: 'rgba(0,212,255,0.15)', color: '#00d4ff', border: '1px solid rgba(0,212,255,0.3)' }}
            >
              {i + 1}
            </div>
            <input
              type="text"
              value={names[i]}
              onChange={(e) => updateName(i, e.target.value)}
              placeholder={`Player ${i + 1}`}
              maxLength={20}
              className="flex-1 py-3 px-4 rounded-xl text-white font-medium outline-none transition-all duration-200"
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)',
                fontSize: '16px', // prevents mobile zoom
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
          </div>
        ))}
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
