// Saved Player Lists — localStorage management

export interface SavedList {
  id: string
  name: string
  players: string[]
  createdAt: number
}

export interface SavedListsData {
  lists: SavedList[]
  activeListId: string | null // currently selected list
  lastPlayers: string[] // always save last used players
}

const STORAGE_KEY = 'imposter-party-lists'

const DEFAULT_DATA: SavedListsData = {
  lists: [],
  activeListId: null,
  lastPlayers: [],
}

export function getSavedListsData(): SavedListsData {
  if (typeof window === 'undefined') return DEFAULT_DATA
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT_DATA
    return JSON.parse(raw) as SavedListsData
  } catch {
    return DEFAULT_DATA
  }
}

export function saveSavedListsData(data: SavedListsData): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export function saveLastPlayers(players: string[]): void {
  const data = getSavedListsData()
  saveSavedListsData({ ...data, lastPlayers: players })
}

export function getLastPlayers(): string[] {
  return getSavedListsData().lastPlayers
}

export function getActiveListId(): string | null {
  return getSavedListsData().activeListId
}

export function setActiveListId(id: string | null): void {
  const data = getSavedListsData()
  saveSavedListsData({ ...data, activeListId: id })
}

export function getSavedLists(): SavedList[] {
  return getSavedListsData().lists
}

export function getSavedListById(id: string): SavedList | undefined {
  return getSavedListsData().lists.find((l) => l.id === id)
}

export function saveNewList(name: string, players: string[]): SavedList {
  const data = getSavedListsData()
  const newList: SavedList = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2),
    name,
    players,
    createdAt: Date.now(),
  }
  saveSavedListsData({
    ...data,
    lists: [...data.lists, newList],
    activeListId: newList.id,
  })
  return newList
}

export function renameList(id: string, newName: string): void {
  const data = getSavedListsData()
  saveSavedListsData({
    ...data,
    lists: data.lists.map((l) => (l.id === id ? { ...l, name: newName } : l)),
  })
}

export function deleteList(id: string): void {
  const data = getSavedListsData()
  saveSavedListsData({
    ...data,
    lists: data.lists.filter((l) => l.id !== id),
    activeListId: data.activeListId === id ? null : data.activeListId,
  })
}
