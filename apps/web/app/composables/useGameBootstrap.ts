import type { GameState } from '~/utils/word-game-logic'

export function useGameBootstrap(
  gameState: Ref<GameState>,
  board: Ref<string[][]>,
  currentRow: Ref<number>,
  currentCol: Ref<number>,
) {
  async function loadSession(sessionId: string) {
    try {
      const session = await $fetch(`/api/game/session/${sessionId}`)
      gameState.value.sessionId = session.sessionId
      gameState.value.guesses = session.guesses
      gameState.value.status = session.status as GameState['status']
      gameState.value.attempts = session.attempts
      gameState.value.answer = session.answer ?? null
      for (let i = 0; i < session.guesses.length; i++) {
        const guess = session.guesses[i]!
        for (let j = 0; j < 5; j++) board.value[i]![j] = guess.word[j]!
      }
      currentRow.value = session.guesses.length
      currentCol.value = 0
    } catch {
      gameState.value.status = 'in_progress'
    }
  }

  async function initGame() {
    const { data } = await useAsyncData('today', () => $fetch('/api/game/today'))
    if (!data.value) return
    gameState.value.puzzleNumber = data.value.puzzleNumber
    if (data.value.sessionId) {
      gameState.value.sessionId = data.value.sessionId
      await loadSession(data.value.sessionId)
    } else {
      gameState.value.status = 'in_progress'
    }
  }

  return { initGame }
}
