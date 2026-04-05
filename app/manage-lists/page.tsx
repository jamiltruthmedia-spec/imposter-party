'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  getSavedLists,
  getActiveListId,
  renameList,
  deleteList,
  SavedList,
} from '@/lib/savedLists'

export default function ManageListsPage() {
  const router = useRouter()
  const [lists, setLists] = useState<SavedList[]>([])
  const [activeListId, setActiveListIdState] = useState<string | null>(null)
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null)
  const [renameId, setRenameId] = useState<string | null>(null)
  const [renameName, setRenameName] = useState('')
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)

  useEffect(() => {
    setLists(getSavedLists())
    setActiveListIdState(getActiveListId())
  }, [])

  const refresh = () => {
    setLists(getSavedLists())
    setActiveListIdState(getActiveListId())
  }

  const handleRenameStart = (list: SavedList) => {
    setMenuOpenId(null)
    setRenameId(list.id)
    setRenameName(list.name)
  }

  const handleRenameSave = () => {
    if (!renameId || !renameName.trim()) return
    renameList(renameId, renameName.trim())
    setRenameId(null)
    setRenameName('')
    refresh()
  }

  const handleDeleteConfirm = (id: string) => {
    setMenuOpenId(null)
    setDeleteConfirmId(id)
  }

  const handleDelete = () => {
    if (!deleteConfirmId) return
    deleteList(deleteConfirmId)
    setDeleteConfirmId(null)
    refresh()
  }

  const playerLabel = (count: number) =>
    count === 1 ? '1 player' : `${count} players`

  return (
    <main
      className="min-h-screen px-5 py-8"
      style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)' }}
      onClick={() => setMenuOpenId(null)}
    >
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => router.back()}
          className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 active:scale-95"
          style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)' }}
        >
          ←
        </button>
        <h1 className="text-2xl font-bold text-white">Manage lists...</h1>
      </div>

      {lists.length === 0 ? (
        <div className="text-center mt-20">
          <p className="text-5xl mb-4">📁</p>
          <p className="text-white font-semibold text-lg mb-2">No saved lists yet</p>
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>
            Go to Player Names and save a list to see it here.
          </p>
        </div>
      ) : (
        <div className="max-w-sm mx-auto space-y-3">
          {lists.map((list) => {
            const isActive = list.id === activeListId
            return (
              <div
                key={list.id}
                className="flex items-center gap-3 p-4 rounded-2xl relative"
                style={{
                  background: isActive ? 'rgba(139,92,246,0.12)' : 'rgba(255,255,255,0.04)',
                  border: isActive ? '1px solid rgba(139,92,246,0.45)' : '1px solid rgba(255,255,255,0.08)',
                  borderLeft: isActive ? '3px solid #a78bfa' : undefined,
                }}
              >
                {/* Folder icon */}
                <span className="text-2xl flex-shrink-0" style={{ color: '#a78bfa' }}>📁</span>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-white font-semibold text-sm truncate">{list.name}</p>
                    {isActive && (
                      <span
                        className="text-xs px-2 py-0.5 rounded-full font-semibold flex-shrink-0"
                        style={{ background: 'rgba(139,92,246,0.3)', color: '#c4b5fd' }}
                      >
                        Active
                      </span>
                    )}
                  </div>
                  <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>
                    👥 {playerLabel(list.players.length)}
                  </p>
                </div>

                {/* 3-dot menu button */}
                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setMenuOpenId(menuOpenId === list.id ? null : list.id)
                    }}
                    className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-150 active:scale-95 flex-shrink-0"
                    style={{
                      background: menuOpenId === list.id ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.06)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      color: 'rgba(255,255,255,0.7)',
                      fontSize: '18px',
                      letterSpacing: '1px',
                    }}
                  >
                    ⋮
                  </button>

                  {/* Dropdown menu */}
                  {menuOpenId === list.id && (
                    <div
                      className="absolute right-0 top-10 rounded-xl overflow-hidden z-10"
                      style={{
                        background: '#1e1e3a',
                        border: '1px solid rgba(255,255,255,0.12)',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                        minWidth: '130px',
                      }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={() => handleRenameStart(list)}
                        className="w-full px-4 py-3 text-left text-sm font-medium text-white transition-all duration-150"
                        style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.06)')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                      >
                        ✏️ Rename
                      </button>
                      <button
                        onClick={() => handleDeleteConfirm(list.id)}
                        className="w-full px-4 py-3 text-left text-sm font-medium transition-all duration-150"
                        style={{ color: '#ff6666' }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,68,68,0.08)')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Rename Modal */}
      {renameId && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-6"
          style={{ background: 'rgba(0,0,0,0.75)' }}
          onClick={() => setRenameId(null)}
        >
          <div
            className="w-full max-w-sm rounded-3xl p-6"
            style={{ background: '#1e1e3a', border: '1px solid rgba(255,255,255,0.12)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-white font-bold text-lg mb-5">Rename list</h2>
            <label className="block text-xs font-semibold mb-2" style={{ color: 'rgba(255,255,255,0.5)' }}>
              LIST NAME
            </label>
            <input
              type="text"
              value={renameName}
              onChange={(e) => setRenameName(e.target.value)}
              maxLength={30}
              autoFocus
              onKeyDown={(e) => e.key === 'Enter' && handleRenameSave()}
              className="w-full py-3 px-4 rounded-xl text-white outline-none mb-6"
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(139,92,246,0.4)',
                fontSize: '16px',
              }}
            />
            <div className="flex gap-3">
              <button
                onClick={() => setRenameId(null)}
                className="flex-1 py-3 rounded-xl font-semibold text-sm"
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  color: 'rgba(255,255,255,0.7)',
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleRenameSave}
                disabled={!renameName.trim()}
                className="flex-1 py-3 rounded-xl font-semibold text-sm"
                style={{
                  background: renameName.trim() ? 'linear-gradient(135deg, #8b5cf6, #7c3aed)' : 'rgba(139,92,246,0.2)',
                  border: '1px solid rgba(139,92,246,0.4)',
                  color: renameName.trim() ? 'white' : 'rgba(255,255,255,0.3)',
                  cursor: renameName.trim() ? 'pointer' : 'not-allowed',
                }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteConfirmId && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-6"
          style={{ background: 'rgba(0,0,0,0.75)' }}
          onClick={() => setDeleteConfirmId(null)}
        >
          <div
            className="w-full max-w-sm rounded-3xl p-6"
            style={{ background: '#1e1e3a', border: '1px solid rgba(255,255,255,0.12)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-white font-bold text-lg mb-2">Delete list?</h2>
            <p className="text-sm mb-6" style={{ color: 'rgba(255,255,255,0.5)' }}>
              &ldquo;{lists.find((l) => l.id === deleteConfirmId)?.name}&rdquo; will be permanently deleted.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-3 rounded-xl font-semibold text-sm"
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  color: 'rgba(255,255,255,0.7)',
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 py-3 rounded-xl font-semibold text-sm transition-all duration-150 active:scale-95"
                style={{
                  background: 'rgba(255,68,68,0.2)',
                  border: '1px solid rgba(255,68,68,0.4)',
                  color: '#ff6666',
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
