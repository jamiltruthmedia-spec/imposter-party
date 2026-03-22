'use client'

interface CardProps {
  isImpostor: boolean
  word: string
  isRevealed: boolean
  onTap: () => void
}

export default function Card({ isImpostor, word, isRevealed, onTap }: CardProps) {
  return (
    <div
      className="card-container w-full"
      style={{ height: '320px' }}
      onClick={onTap}
    >
      <div className={`card-inner w-full h-full ${isRevealed ? 'flipped' : ''}`}>
        {/* Front: Hidden card */}
        <div
          className="card-front rounded-3xl flex flex-col items-center justify-center cursor-pointer pulse-cyan"
          style={{
            background: 'linear-gradient(135deg, #16213e 0%, #0f3460 100%)',
            border: '2px solid rgba(0, 212, 255, 0.3)',
          }}
        >
          <div className="text-5xl mb-4">🔒</div>
          <p className="text-gray-300 font-bold text-lg tracking-wider">TAP TO REVEAL</p>
          <p className="text-gray-500 text-sm mt-2">Make sure no one&apos;s looking!</p>
        </div>

        {/* Back: Revealed card */}
        <div
          className="card-back rounded-3xl flex flex-col items-center justify-center cursor-pointer"
          style={{
            background: isImpostor
              ? 'linear-gradient(135deg, #2d0000 0%, #4a0000 100%)'
              : 'linear-gradient(135deg, #001a2d 0%, #002d4a 100%)',
            border: isImpostor
              ? '2px solid rgba(255, 68, 68, 0.6)'
              : '2px solid rgba(0, 212, 255, 0.6)',
            boxShadow: isImpostor
              ? '0 0 30px rgba(255,68,68,0.3), inset 0 0 30px rgba(255,68,68,0.05)'
              : '0 0 30px rgba(0,212,255,0.3), inset 0 0 30px rgba(0,212,255,0.05)',
          }}
        >
          {isImpostor ? (
            <>
              <div className="text-5xl mb-3">😈</div>
              <p
                className="text-4xl font-black tracking-widest mb-3"
                style={{ color: '#ff4444', textShadow: '0 0 20px rgba(255,68,68,0.8)' }}
              >
                IMPOSTER
              </p>
              <div
                className="px-4 py-2 rounded-full text-sm font-semibold"
                style={{ background: 'rgba(255,68,68,0.15)', color: '#ff8888', border: '1px solid rgba(255,68,68,0.3)' }}
              >
                Blend in and survive!
              </div>
            </>
          ) : (
            <>
              <p className="text-gray-400 text-sm font-semibold tracking-widest uppercase mb-2">Secret Word</p>
              <p
                className="text-4xl font-black tracking-wide text-center px-4 mb-3 capitalize"
                style={{ color: '#00d4ff', textShadow: '0 0 20px rgba(0,212,255,0.8)' }}
              >
                {word}
              </p>
              <div
                className="px-4 py-2 rounded-full text-sm font-semibold"
                style={{ background: 'rgba(0,212,255,0.1)', color: '#00d4ff', border: '1px solid rgba(0,212,255,0.3)' }}
              >
                You know the word!
              </div>
            </>
          )}
          <p className="text-gray-600 text-xs mt-6">Tap to hide</p>
        </div>
      </div>
    </div>
  )
}
