'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import CategorySelector from '@/components/CategorySelector'
import { Category } from '@/lib/game'

export default function SetupPage() {
  const router = useRouter()
  const [playerCount, setPlayerCount] = useState(5)
  const [impostorCount, setImpostorCount] = useState(1)
  const [category, setCategory] = useState<Category>('Objects')
  const [impostorMode, setImpostorMode] = useState<'fixed' | 'random'>('fixed')
  const [neverFirst, setNeverFirst] = useState(false)

  const maxImpostors = Math.min(12, playerCount - 1)

  const handlePlayerCountChange = (val: number) => {
    const clamped = Math.max(3, Math.min(100, val))
    setPlayerCount(clamped)
    if (impostorCount >= clamped) {
      setImpostorCount(Math.max(1, clamped - 1))
    }
  }

  const handleStart = () => {
    const params = new URLSearchParams({
      players: playerCount.toString(),
      impostors: impostorCount.toString(),
      impostorMode,
      neverFirst: neverFirst.toString(),
      category,
    })
    router.push(`/names?${params.toString()}`)
  }

  // Build array of valid imposter counts 1..maxImpostors
  const impostorOptions = Array.from({ length: maxImpostors }, (_, i) => i + 1)

  return (
    <main className="min-h-screen px-6 py-8" style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)' }}>
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/">
          <button
            className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 active:scale-95"
            style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)' }}
          >
            ←
          </button>
        </Link>
        <h1 className="text-2xl font-bold text-white">Game Setup</h1>
      </div>

      <div className="space-y-6 max-w-sm mx-auto">
        {/* Player Count */}
        <div className="rounded-2xl p-5" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="flex items-center justify-between mb-4">
            <p className="text-white font-bold">Players</p>
            <span className="text-2xl font-black" style={{ color: '#00d4ff' }}>
              {playerCount}
            </span>
          </div>
          {/* Number input with +/- for large range */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => handlePlayerCountChange(playerCount - 1)}
              disabled={playerCount <= 3}
              className="w-12 h-12 rounded-xl font-bold text-xl transition-all duration-200 active:scale-95 flex-shrink-0"
              style={{
                background: playerCount <= 3 ? 'rgba(255,255,255,0.03)' : 'rgba(0,212,255,0.15)',
                border: '1px solid rgba(0,212,255,0.3)',
                color: playerCount <= 3 ? 'rgba(255,255,255,0.2)' : '#00d4ff',
                cursor: playerCount <= 3 ? 'not-allowed' : 'pointer',
              }}
            >
              −
            </button>
            <input
              type="number"
              min={3}
              max={100}
              value={playerCount}
              onChange={(e) => handlePlayerCountChange(parseInt(e.target.value) || 3)}
              className="flex-1 text-center py-3 rounded-xl font-bold text-xl text-white outline-none"
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(0,212,255,0.3)',
                fontSize: '20px',
              }}
            />
            <button
              onClick={() => handlePlayerCountChange(playerCount + 1)}
              disabled={playerCount >= 100}
              className="w-12 h-12 rounded-xl font-bold text-xl transition-all duration-200 active:scale-95 flex-shrink-0"
              style={{
                background: playerCount >= 100 ? 'rgba(255,255,255,0.03)' : 'rgba(0,212,255,0.15)',
                border: '1px solid rgba(0,212,255,0.3)',
                color: playerCount >= 100 ? 'rgba(255,255,255,0.2)' : '#00d4ff',
                cursor: playerCount >= 100 ? 'not-allowed' : 'pointer',
              }}
            >
              +
            </button>
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-gray-500 text-xs">Min: 3</span>
            <span className="text-gray-500 text-xs">Max: 100</span>
          </div>
        </div>

        {/* Imposter Mode Toggle */}
        <div className="rounded-2xl p-5" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <p className="text-white font-bold mb-3">Imposter Mode</p>
          <div className="flex gap-2">
            {(['fixed', 'random'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setImpostorMode(mode)}
                className="flex-1 py-3 rounded-xl font-semibold text-sm transition-all duration-200 active:scale-95 capitalize"
                style={{
                  background: impostorMode === mode ? 'rgba(255,68,68,0.2)' : 'rgba(255,255,255,0.06)',
                  border: impostorMode === mode ? '2px solid #ff4444' : '2px solid rgba(255,255,255,0.08)',
                  color: impostorMode === mode ? '#ff4444' : 'rgba(255,255,255,0.7)',
                  boxShadow: impostorMode === mode ? '0 0 15px rgba(255,68,68,0.3)' : 'none',
                }}
              >
                {mode === 'fixed' ? '🎯 Fixed' : '🎲 Random'}
              </button>
            ))}
          </div>
          {impostorMode === 'random' && (
            <p className="text-xs mt-2" style={{ color: 'rgba(255,255,255,0.4)' }}>
              App picks a random imposter count each game
            </p>
          )}
        </div>

        {/* Imposter Count (only shown in fixed mode) */}
        {impostorMode === 'fixed' && (
          <div className="rounded-2xl p-5" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="flex items-center justify-between mb-4">
              <p className="text-white font-bold">Imposters</p>
              <span className="text-2xl font-black" style={{ color: '#ff4444' }}>
                {impostorCount}
              </span>
            </div>
            {maxImpostors <= 6 ? (
              // Button grid for small counts
              <div className="grid grid-cols-3 gap-3">
                {impostorOptions.map((count) => {
                  const isSelected = impostorCount === count
                  return (
                    <button
                      key={count}
                      onClick={() => setImpostorCount(count)}
                      className="py-3 rounded-xl font-bold text-lg transition-all duration-200 active:scale-95"
                      style={{
                        background: isSelected ? 'rgba(255, 68, 68, 0.2)' : 'rgba(255,255,255,0.06)',
                        border: isSelected ? '2px solid #ff4444' : '2px solid rgba(255,255,255,0.08)',
                        color: isSelected ? '#ff4444' : 'white',
                        boxShadow: isSelected ? '0 0 15px rgba(255,68,68,0.3)' : 'none',
                      }}
                    >
                      {count}
                    </button>
                  )
                })}
              </div>
            ) : (
              // Slider for larger counts
              <>
                <input
                  type="range"
                  min={1}
                  max={maxImpostors}
                  value={impostorCount}
                  onChange={(e) => setImpostorCount(parseInt(e.target.value))}
                  className="w-full h-2 rounded-full appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #ff4444 ${((impostorCount - 1) / (maxImpostors - 1)) * 100}%, rgba(255,255,255,0.15) ${((impostorCount - 1) / (maxImpostors - 1)) * 100}%)`,
                  }}
                />
                <div className="flex justify-between mt-1">
                  <span className="text-gray-500 text-xs">1</span>
                  <span className="text-gray-500 text-xs">{maxImpostors}</span>
                </div>
              </>
            )}
          </div>
        )}

        {/* Never Goes First Toggle */}
        <div className="rounded-2xl p-5" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="flex items-center justify-between">
            <div className="flex-1 mr-4">
              <p className="text-white font-bold text-sm">Imposter Never Goes First</p>
              <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>
                Shuffles order so imposter hears a clue before giving one
              </p>
            </div>
            <button
              onClick={() => setNeverFirst(!neverFirst)}
              className="relative w-14 h-7 rounded-full transition-all duration-200 flex-shrink-0"
              style={{
                background: neverFirst ? 'rgba(255,68,68,0.6)' : 'rgba(255,255,255,0.1)',
                border: neverFirst ? '1px solid #ff4444' : '1px solid rgba(255,255,255,0.2)',
              }}
            >
              <span
                className="absolute top-1 w-5 h-5 rounded-full transition-all duration-200"
                style={{
                  background: neverFirst ? '#ff4444' : 'rgba(255,255,255,0.5)',
                  left: neverFirst ? 'calc(100% - 1.5rem)' : '0.25rem',
                  boxShadow: neverFirst ? '0 0 8px rgba(255,68,68,0.6)' : 'none',
                }}
              />
            </button>
          </div>
        </div>

        {/* Category */}
        <div className="rounded-2xl p-5" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <p className="text-white font-bold mb-4">Category</p>
          <CategorySelector selected={category} onChange={setCategory} />
        </div>

        {/* Start Button */}
        <button
          onClick={handleStart}
          className="w-full py-5 rounded-2xl font-bold text-xl tracking-wide transition-all duration-200 active:scale-95"
          style={{
            background: 'linear-gradient(135deg, #00d4ff, #0099bb)',
            color: '#1a1a2e',
            boxShadow: '0 0 30px rgba(0,212,255,0.5), 0 4px 20px rgba(0,212,255,0.3)',
          }}
        >
          Next: Enter Names →
        </button>
      </div>

      <style jsx>{`
        input[type='range']::-webkit-slider-thumb {
          appearance: none;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: #ff4444;
          cursor: pointer;
          box-shadow: 0 0 10px rgba(255, 68, 68, 0.6);
          border: 2px solid white;
        }
        input[type='range']::-moz-range-thumb {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: #ff4444;
          cursor: pointer;
          box-shadow: 0 0 10px rgba(255, 68, 68, 0.6);
          border: 2px solid white;
        }
        input[type='number']::-webkit-inner-spin-button,
        input[type='number']::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        input[type='number'] {
          -moz-appearance: textfield;
        }
      `}</style>
    </main>
  )
}
