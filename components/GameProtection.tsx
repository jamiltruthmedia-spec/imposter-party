'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

interface GameProtectionProps {
  isActive: boolean
  onAttemptLeave?: () => void
}

/**
 * GameProtection — mobile safety features for active gameplay.
 *
 * When isActive=true:
 *  - Prevents accidental refresh / tab close (beforeunload)
 *  - Traps back button (history.pushState + popstate)
 *  - Requests Wake Lock to keep screen on
 *  - Shows "Game in Progress" banner
 *
 * When isActive=false: all protections are released.
 */
export default function GameProtection({ isActive, onAttemptLeave }: GameProtectionProps) {
  const wakeLockRef = useRef<WakeLockSentinel | null>(null)
  const [wakeLockActive, setWakeLockActive] = useState(false)

  // ── Wake Lock ──────────────────────────────────────────────────────────────
  const requestWakeLock = useCallback(async () => {
    if (!('wakeLock' in navigator)) return
    try {
      wakeLockRef.current = await (navigator as Navigator & { wakeLock: { request: (type: string) => Promise<WakeLockSentinel> } }).wakeLock.request('screen')
      setWakeLockActive(true)

      // Re-acquire if the lock is released (e.g. tab hidden then visible again)
      wakeLockRef.current.addEventListener('release', () => {
        setWakeLockActive(false)
      })
    } catch {
      // Wake Lock not supported or denied — silent fail, not critical
    }
  }, [])

  const releaseWakeLock = useCallback(async () => {
    if (wakeLockRef.current) {
      try {
        await wakeLockRef.current.release()
      } catch {
        // ignore
      }
      wakeLockRef.current = null
      setWakeLockActive(false)
    }
  }, [])

  // Re-acquire wake lock when tab becomes visible again
  useEffect(() => {
    if (!isActive) return

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && isActive) {
        requestWakeLock()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [isActive, requestWakeLock])

  // ── Main protection setup / teardown ──────────────────────────────────────
  useEffect(() => {
    if (!isActive) {
      releaseWakeLock()
      return
    }

    // Start wake lock
    requestWakeLock()

    // Prevent accidental refresh / close
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault()
      e.returnValue = 'Game in progress! Are you sure you want to leave?'
      return e.returnValue
    }

    // Trap back button
    // Push a dummy state so the first "back" just hits this state, not the previous page
    history.pushState({ gameProtection: true }, '')

    const handlePopState = (e: PopStateEvent) => {
      if (isActive) {
        // Push another dummy state to re-trap the button
        history.pushState({ gameProtection: true }, '')
        // Notify parent so it can show a modal / confirmation
        onAttemptLeave?.()
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    window.addEventListener('popstate', handlePopState)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
      window.removeEventListener('popstate', handlePopState)
      releaseWakeLock()
    }
  }, [isActive, onAttemptLeave, requestWakeLock, releaseWakeLock])

  if (!isActive) return null

  return (
    <div
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center gap-2 py-1.5 px-4"
      style={{
        background: 'rgba(0,0,0,0.6)',
        backdropFilter: 'blur(8px)',
        fontSize: '11px',
        color: 'rgba(255,255,255,0.5)',
        letterSpacing: '0.05em',
        userSelect: 'none',
        WebkitUserSelect: 'none',
      }}
    >
      <span
        className="game-in-progress-dot"
        style={{
          display: 'inline-block',
          width: 6,
          height: 6,
          borderRadius: '50%',
          background: '#00d4ff',
          flexShrink: 0,
        }}
      />
      <span>GAME IN PROGRESS</span>
      {wakeLockActive && (
        <span style={{ marginLeft: 4, opacity: 0.4 }}>· 🔒</span>
      )}
    </div>
  )
}
