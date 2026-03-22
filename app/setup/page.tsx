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

  const handleStart = () => {
    const params = new URLSearchParams({
      players: playerCount.toString(),
      impostors: impostorCount.toString(),
      category,
    })
    router.push(`/names?${params.toString()}`)
  }

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
            <span
              className="text-2xl font-black"
              style={{ color: '#00d4ff' }}
            >
              {playerCount}
            </span>
          </div>
          <input
            type="range"
            min={3}
            max={15}
            value={playerCount}
            onChange={(e) => {
              const newCount = parseInt(e.target.value)
              setPlayerCount(newCount)
              // Make sure impostors don't exceed players - 1
              if (impostorCount >= newCount) {
                setImpostorCount(Math.max(1, newCount - 1))
              }
            }}
            className="w-full h-2 rounded-full appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, #00d4ff ${((playerCount - 3) / 12) * 100}%, rgba(255,255,255,0.15) ${((playerCount - 3) / 12) * 100}%)`,
            }}
          />
          <div className="flex justify-between mt-1">
            <span className="text-gray-500 text-xs">3</span>
            <span className="text-gray-500 text-xs">15</span>
          </div>
        </div>

        {/* Imposter Count */}
        <div className="rounded-2xl p-5" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <p className="text-white font-bold mb-4">Imposters</p>
          <div className="grid grid-cols-3 gap-3">
            {[1, 2, 3].map((count) => {
              const isDisabled = count >= playerCount
              const isSelected = impostorCount === count && !isDisabled
              return (
                <button
                  key={count}
                  disabled={isDisabled}
                  onClick={() => setImpostorCount(count)}
                  className="py-3 rounded-xl font-bold text-lg transition-all duration-200 active:scale-95"
                  style={{
                    background: isSelected
                      ? 'rgba(255, 68, 68, 0.2)'
                      : 'rgba(255,255,255,0.06)',
                    border: isSelected
                      ? '2px solid #ff4444'
                      : '2px solid rgba(255,255,255,0.08)',
                    color: isDisabled ? 'rgba(255,255,255,0.2)' : isSelected ? '#ff4444' : 'white',
                    boxShadow: isSelected ? '0 0 15px rgba(255,68,68,0.3)' : 'none',
                    cursor: isDisabled ? 'not-allowed' : 'pointer',
                  }}
                >
                  {count}
                </button>
              )
            })}
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
          background: #00d4ff;
          cursor: pointer;
          box-shadow: 0 0 10px rgba(0, 212, 255, 0.6);
          border: 2px solid white;
        }
        input[type='range']::-moz-range-thumb {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: #00d4ff;
          cursor: pointer;
          box-shadow: 0 0 10px rgba(0, 212, 255, 0.6);
          border: 2px solid white;
        }
      `}</style>
    </main>
  )
}
