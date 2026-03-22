'use client'

import { useState, useEffect } from 'react'
import {
  getSavedLists,
  getSavedListsData,
  saveNewList,
  setActiveListId,
  SavedList,
} from '@/lib/savedLists'

interface Props {
  isOpen: boolean
  onClose: () => void
  currentPlayers: string[]
  activeListId: string | null
  onLoadList: (list: SavedList) => void
  onSelectUnsaved: () => void
  onManageLists: () => void
  onListSaved: (list: SavedList) => void
}

export default function SavedListsSheet({
  isOpen,
  onClose,
  currentPlayers,
  activeListId,
  onLoadList,
  onSelectUnsaved,
  onManageLists,
  onListSaved,
}: Props) {
  const [lists, setLists] = useState<SavedList[]>([])
  const [showSaveModal, setShowSaveModal] = useState(false)
  const [listName, setListName] = useState('')

  useEffect(() => {
    if (isOpen) {
      setLists(getSavedLists())
    }
  }, [isOpen])

  const handleSave = () => {
    const trimmed = listName.trim()
    if (!trimmed) return
    const saved = saveNewList(trimmed, currentPlayers.filter((p) => p.trim()))
    setLists(getSavedLists())
    setListName('')
    setShowSaveModal(false)
    onListSaved(saved)
  }

  const handleLoadList = (list: SavedList) => {
    setActiveListId(list.id)
    onLoadList(list)
    onClose()
  }

  const handleUnsaved = () => {
    setActiveListId(null)
    onSelectUnsaved()
    onClose()
  }

  const playerLabel = (count: number) =>
    count === 1 ? '1 player' : `${count} players`

  if (!isOpen && !showSaveModal) return null

  return (
    <>
      {/* Bottom Sheet Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 flex flex-col justify-end"
          style={{ background: 'rgba(0,0,0,0.6)' }}
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose()
          }}
        >
          <div
            className="w-full rounded-t-3xl pb-8 pt-5 px-5"
            style={{
              background: '#1e1e3a',
              border: '1px solid rgba(255,255,255,0.08)',
              maxHeight: '80vh',
              overflowY: 'auto',
              animation: 'slideUp 0.25s ease-out',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Handle bar */}
            <div className="flex justify-center mb-4">
              <div className="w-10 h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.2)' }} />
            </div>

            <h2 className="text-white font-bold text-xl mb-5">Saved Lists</h2>

            {/* Unsaved Game option */}
            <button
              onClick={handleUnsaved}
              className="w-full flex items-center gap-3 p-4 rounded-2xl mb-2 transition-all duration-150 active:scale-95 text-left"
              style={{
                background: activeListId === null ? 'rgba(139,92,246,0.15)' : 'rgba(255,255,255,0.04)',
                border: activeListId === null ? '1px solid rgba(139,92,246,0.5)' : '1px solid rgba(255,255,255,0.08)',
              }}
            >
              <span className="text-2xl">🎮</span>
              <div className="flex-1">
                <p className="text-white font-semibold text-sm">Unsaved Game</p>
                <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>
                  Quick game without saving
                </p>
              </div>
              {activeListId === null && (
                <span className="text-lg" style={{ color: '#a78bfa' }}>✓</span>
              )}
            </button>

            {/* Saved lists */}
            {lists.map((list) => {
              const isActive = activeListId === list.id
              return (
                <button
                  key={list.id}
                  onClick={() => handleLoadList(list)}
                  className="w-full flex items-center gap-3 p-4 rounded-2xl mb-2 transition-all duration-150 active:scale-95 text-left"
                  style={{
                    background: isActive ? 'rgba(139,92,246,0.15)' : 'rgba(255,255,255,0.04)',
                    border: isActive ? '1px solid rgba(139,92,246,0.5)' : '1px solid rgba(255,255,255,0.08)',
                    borderLeft: isActive ? '3px solid #a78bfa' : '1px solid rgba(255,255,255,0.08)',
                  }}
                >
                  <span className="text-xl" style={{ color: '#a78bfa' }}>📁</span>
                  <div className="flex-1">
                    <p className="text-white font-semibold text-sm">{list.name}</p>
                    <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>
                      {playerLabel(list.players.length)}
                    </p>
                  </div>
                  {isActive && (
                    <span className="text-lg" style={{ color: '#a78bfa' }}>✓</span>
                  )}
                </button>
              )
            })}

            {/* Divider */}
            <div className="my-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }} />

            {/* Save as new list */}
            <button
              onClick={() => setShowSaveModal(true)}
              className="w-full flex items-center gap-3 p-4 rounded-2xl mb-2 transition-all duration-150 active:scale-95"
              style={{
                background: 'rgba(139,92,246,0.1)',
                border: '1px solid rgba(139,92,246,0.25)',
              }}
            >
              <span className="text-xl" style={{ color: '#a78bfa' }}>⊕</span>
              <span className="font-semibold text-sm" style={{ color: '#a78bfa' }}>
                Save as new list...
              </span>
            </button>

            {/* Manage lists */}
            <button
              onClick={() => { onClose(); onManageLists() }}
              className="w-full flex items-center gap-3 p-4 rounded-2xl transition-all duration-150 active:scale-95"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              <span className="text-xl">📁</span>
              <span className="font-semibold text-sm text-white">Manage lists...</span>
            </button>
          </div>
        </div>
      )}

      {/* Save as New List Modal */}
      {showSaveModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-6"
          style={{ background: 'rgba(0,0,0,0.75)' }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowSaveModal(false)
          }}
        >
          <div
            className="w-full max-w-sm rounded-3xl p-6"
            style={{
              background: '#1e1e3a',
              border: '1px solid rgba(255,255,255,0.12)',
            }}
          >
            <h2 className="text-white font-bold text-lg mb-1">Save as a new list...</h2>
            <p className="text-xs mb-5" style={{ color: 'rgba(255,255,255,0.4)' }}>
              Saves {currentPlayers.filter((p) => p.trim()).length || currentPlayers.length} players to a named list
            </p>

            <label className="block text-xs font-semibold mb-2" style={{ color: 'rgba(255,255,255,0.5)' }}>
              LIST NAME
            </label>
            <input
              type="text"
              value={listName}
              onChange={(e) => setListName(e.target.value)}
              placeholder="Enter list name"
              maxLength={30}
              autoFocus
              onKeyDown={(e) => e.key === 'Enter' && handleSave()}
              className="w-full py-3 px-4 rounded-xl text-white outline-none mb-6"
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(139,92,246,0.4)',
                fontSize: '16px',
              }}
            />

            <div className="flex gap-3">
              <button
                onClick={() => { setShowSaveModal(false); setListName('') }}
                className="flex-1 py-3 rounded-xl font-semibold text-sm transition-all duration-150 active:scale-95"
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  color: 'rgba(255,255,255,0.7)',
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!listName.trim()}
                className="flex-1 py-3 rounded-xl font-semibold text-sm transition-all duration-150 active:scale-95"
                style={{
                  background: listName.trim() ? 'linear-gradient(135deg, #8b5cf6, #7c3aed)' : 'rgba(139,92,246,0.2)',
                  border: '1px solid rgba(139,92,246,0.4)',
                  color: listName.trim() ? 'white' : 'rgba(255,255,255,0.3)',
                  cursor: listName.trim() ? 'pointer' : 'not-allowed',
                }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
      `}</style>
    </>
  )
}
