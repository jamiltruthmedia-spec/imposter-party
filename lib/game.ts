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
  category: Category
): GameState {
  const word = getRandomWord(category)

  // Shuffle player indices and pick first N as impostors
  const indices = players.map((_, i) => i)
  const shuffled = indices.sort(() => Math.random() - 0.5)
  const impostorIndices = shuffled.slice(0, impostorCount)

  return {
    players,
    impostorIndices,
    word,
    category,
    currentPlayerIndex: 0,
    revealedPlayers: players.map(() => false),
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

export function saveGame(state: GameState): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('imposterPartyGame', JSON.stringify(state))
  }
}

export function loadGame(): GameState | null {
  if (typeof window === 'undefined') return null
  try {
    const data = localStorage.getItem('imposterPartyGame')
    if (!data) return null
    return JSON.parse(data) as GameState
  } catch {
    return null
  }
}

export function clearGame(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('imposterPartyGame')
  }
}
