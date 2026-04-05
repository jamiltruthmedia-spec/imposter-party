'use client'

import { useState, useEffect, useCallback } from 'react'

export default function FullscreenButton() {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [supported, setSupported] = useState(false)

  useEffect(() => {
    setSupported(!!document.documentElement.requestFullscreen)

    const handleChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }
    document.addEventListener('fullscreenchange', handleChange)
    return () => document.removeEventListener('fullscreenchange', handleChange)
  }, [])

  const toggle = useCallback(async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen()
      } else {
        await document.exitFullscreen()
      }
    } catch {
      // Not supported or denied — silent fail
    }
  }, [])

  if (!supported) return null

  return (
    <button
      onClick={toggle}
      title={isFullscreen ? 'Exit fullscreen' : 'Go fullscreen'}
      className="transition-all duration-200 active:scale-95"
      style={{
        width: 36,
        height: 36,
        borderRadius: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(255,255,255,0.08)',
        border: '1px solid rgba(255,255,255,0.12)',
        color: 'rgba(255,255,255,0.6)',
        fontSize: 16,
        cursor: 'pointer',
        flexShrink: 0,
      }}
    >
      {isFullscreen ? '✕' : '⛶'}
    </button>
  )
}
