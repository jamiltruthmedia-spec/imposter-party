import wordsData from '@/data/words.json'

export type Category = 'Objects' | 'Locations' | 'Foods'

export interface GameState {
  players: string[]
  impostorIndices: number[]
  word: string
  category: Category
  currentPlayerIndex: number
  revealedPlayers: boolean[]
  neverFirst: boolean
}

export function getCategories(): Category[] {
  return ['Objects', 'Locations', 'Foods']
}

export function getRandomWord(category: Category): string {
  const words = wordsData[category]
  return words[Math.floor(Math.random() * words.length)]
}

export function createGame(
  players: string[],
  impostorCount: number,
  category: Category,
  neverFirst: boolean = false
): GameState {
  const word = getRandomWord(category)

  // Shuffle player order
  const shuffledPlayers = [...players].sort(() => Math.random() - 0.5)

  // Assign first N players as impostors
  const impostorIndices = Array.from({ length: impostorCount }, (_, i) => i)

  // If neverFirst: ensure index 0 is NOT an imposter by swapping if needed
  if (neverFirst && impostorIndices.includes(0) && shuffledPlayers.length > impostorCount) {
    const swapIdx = impostorCount
    const temp = shuffledPlayers[0]
    shuffledPlayers[0] = shuffledPlayers[swapIdx]
    shuffledPlayers[swapIdx] = temp
    impostorIndices.shift()
    impostorIndices.push(swapIdx)
  }

  return {
    players: shuffledPlayers,
    impostorIndices,
    word,
    category,
    currentPlayerIndex: 0,
    revealedPlayers: shuffledPlayers.map(() => false),
    neverFirst,
  }
}

export function isImpostor(state: GameState, playerIndex: number): boolean {
  return state.impostorIndices.includes(playerIndex)
}

export function getCurrentPlayer(state: GameState): string {
  return state.players[state.currentPlayerIndex]
}

export function markPlayerRevealed(state: GameState, playerIndex: number): GameState {
  const newRevealed = [...state.revealedPlayers]
  newRevealed[playerIndex] = true
  return {
    ...state,
    revealedPlayers: newRevealed,
    currentPlayerIndex: playerIndex + 1, // keep compat
  }
}

export function advancePlayer(state: GameState): GameState {
  const nextIndex = state.currentPlayerIndex + 1
  const newRevealed = [...state.revealedPlayers]
  newRevealed[state.currentPlayerIndex] = true

  return {
    ...state,
    currentPlayerIndex: nextIndex,
    revealedPlayers: newRevealed,
  }
}

export function isGameComplete(state: GameState): boolean {
  return state.revealedPlayers.every((r) => r)
}

const GAME_KEY = 'imposterPartyGame'
const AUTOSAVE_KEY = 'imposter-party-state'

export function saveGame(state: GameState): void {
  if (typeof window !== 'undefined') {
    const json = JSON.stringify(state)
    localStorage.setItem(GAME_KEY, json)
    localStorage.setItem(AUTOSAVE_KEY, json)
  }
}

export function loadGame(): GameState | null {
  if (typeof window === 'undefined') return null
  try {
    const data = localStorage.getItem(GAME_KEY)
    if (!data) return null
    return JSON.parse(data) as GameState
  } catch {
    return null
  }
}

export function getSavedGame(): GameState | null {
  if (typeof window === 'undefined') return null
  try {
    const data = localStorage.getItem(AUTOSAVE_KEY)
    if (!data) return null
    const state = JSON.parse(data) as GameState
    if (isGameComplete(state)) return null
    return state
  } catch {
    return null
  }
}

export function clearGame(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(GAME_KEY)
    localStorage.removeItem(AUTOSAVE_KEY)
  }
}
