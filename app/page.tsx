'use client'

import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 py-12" style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)' }}>
      {/* Background decorative elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full opacity-5" style={{ background: '#00d4ff', filter: 'blur(80px)' }} />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full opacity-5" style={{ background: '#ff4444', filter: 'blur(60px)' }} />
      </div>

      {/* Logo / Title */}
      <div className="relative z-10 text-center mb-12">
        <div className="text-6xl mb-4 float">🕵️</div>
        <h1
          className="text-5xl font-black tracking-tight mb-2"
          style={{ color: '#00d4ff', textShadow: '0 0 30px rgba(0,212,255,0.8), 0 0 60px rgba(0,212,255,0.4)' }}
        >
          IMPOSTER
        </h1>
        <h2 className="text-5xl font-black tracking-tight text-white mb-4">
          PARTY
        </h2>
        <p className="text-gray-400 text-lg font-medium">
          The social deduction party game
        </p>
      </div>

      {/* How to play */}
      <div className="relative z-10 w-full max-w-sm mb-10 rounded-2xl p-5 space-y-3" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
        <p className="text-gray-300 font-semibold text-sm uppercase tracking-wider mb-3">How to Play</p>
        <div className="flex items-start gap-3">
          <span className="text-xl">👀</span>
          <p className="text-gray-300 text-sm">Each player secretly sees a word — or &quot;IMPOSTER&quot;</p>
        </div>
        <div className="flex items-start gap-3">
          <span className="text-xl">💬</span>
          <p className="text-gray-300 text-sm">Everyone gives a one-word clue about the word</p>
        </div>
        <div className="flex items-start gap-3">
          <span className="text-xl">🗳️</span>
          <p className="text-gray-300 text-sm">Vote on who&apos;s bluffing — catch the imposter!</p>
        </div>
      </div>

      {/* CTA Button */}
      <div className="relative z-10 w-full max-w-sm">
        <Link href="/setup">
          <button
            className="w-full py-5 rounded-2xl font-bold text-xl text-navy tracking-wide transition-all duration-200 active:scale-95"
            style={{
              background: 'linear-gradient(135deg, #00d4ff, #0099bb)',
              color: '#1a1a2e',
              boxShadow: '0 0 30px rgba(0,212,255,0.5), 0 4px 20px rgba(0,212,255,0.3)',
            }}
          >
            New Game 🎮
          </button>
        </Link>
      </div>

      <p className="relative z-10 text-gray-600 text-xs mt-8">Pass the phone. Find the imposter.</p>
    </main>
  )
}
