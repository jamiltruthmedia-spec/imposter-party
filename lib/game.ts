import wordsData from '@/data/words.json'

export type Category = 'Objects' | 'Locations' | 'Foods'

export interface GameState {
  players: string[]
  impostorIndices: number[]
  word: string
  category: Category
  currentPlayerIndex: number
  revealedPlayers: boolean[]
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
    // Find first non-imposter index to swap with position 0
    let swapIdx = impostorCount // first non-imposter
    // Swap player at position 0 with player at swapIdx
    const temp = shuffledPlayers[0]
    shuffledPlayers[0] = shuffledPlayers[swapIdx]
    shuffledPlayers[swapIdx] = temp
    // impostorIndices remain the same (1..impostorCount) so index 0 is now a non-imposter
  }

  return {
    players: shuffledPlayers,
    impostorIndices,
    word,
    category,
    currentPlayerIndex: 0,
    revealedPlayers: shuffledPlayers.map(() => false),
  }
}

export function isImpostor(state: GameState, playerIndex: number): boolean {
  return state.impostorIndices.includes(playerIndex)
}

export function getCurrentPlayer(state: GameState): string {
  return state.players[state.currentPlayerIndex]
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
  return state.currentPlayerIndex >= state.players.length
}

const GAME_KEY = 'imposterPartyGame'
const AUTOSAVE_KEY = 'imposter-party-state'

export function saveGame(state: GameState): void {
  if (typeof window !== 'undefined') {
    const json = JSON.stringify(state)
    localStorage.setItem(GAME_KEY, json)
    // Also keep the auto-save key in sync (used for resume detection)
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

/**
 * Check whether there is an in-progress (not-yet-complete) game saved.
 * Returns the game state if resumable, null otherwise.
 */
export function getSavedGame(): GameState | null {
  if (typeof window === 'undefined') return null
  try {
    const data = localStorage.getItem(AUTOSAVE_KEY)
    if (!data) return null
    const state = JSON.parse(data) as GameState
    // Only offer resume if the game isn't complete
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
