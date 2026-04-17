import { type GameState, evaluateHardModeGuess } from '~/utils/word-game-logic'
import { postGameGuess, postStatsUpdate } from '~/utils/game-remote'

export function useGameGuess(
  gameState: Ref<GameState>,
  board: Ref<string[][]>,
  currentRow: Ref<number>,
  currentCol: Ref<number>,
  isRevealing: Ref<boolean>,
  shakeRow: Ref<number>,
  bounceRow: Ref<number>,
  settings: ReturnType<typeof useSettings>,
  toast: ReturnType<typeof useToast>,
  haptics: ReturnType<typeof useHaptics>,
) {
  function triggerShake() {
    shakeRow.value = currentRow.value
    setTimeout(() => {
      shakeRow.value = -1
    }, 600)
  }

  async function submitGuess() {
    if (gameState.value.status !== 'in_progress') return
    if (currentCol.value < 5) {
      toast.add({ title: 'Not enough letters' })
      haptics.errorTap()
      triggerShake()
      return
    }
    if (isRevealing.value) return
    const guess = board.value[currentRow.value]!.join('')
    if (settings.hardMode.value && gameState.value.guesses.length > 0) {
      const violation = evaluateHardModeGuess(gameState.value.guesses, guess)
      if (violation) {
        triggerShake()
        haptics.errorTap()
        toast.add({ title: violation, color: 'warning' })
        return
      }
    }
    try {
      isRevealing.value = true
      const result = await postGameGuess(guess, gameState.value.sessionId)
      gameState.value.sessionId = result.sessionId
      gameState.value.guesses = result.guesses
      gameState.value.status = result.status as GameState['status']
      gameState.value.attempts = result.attempts
      gameState.value.answer = result.answer ?? null
      await new Promise((resolve) => setTimeout(resolve, 1800))
      isRevealing.value = false
      if (result.status === 'won') {
        bounceRow.value = currentRow.value
        haptics.successTap()
        const messages = ['Genius!', 'Magnificent!', 'Impressive!', 'Splendid!', 'Great!', 'Phew!']
        toast.add({ title: messages[result.attempts - 1] ?? 'Nice!', color: 'success' })
        await postStatsUpdate('won', result.attempts)
      } else if (result.status === 'lost') {
        haptics.errorTap()
        toast.add({ title: result.answer?.toUpperCase() ?? 'Game over', color: 'error' })
        await postStatsUpdate('lost', result.attempts)
      }
      currentRow.value++
      currentCol.value = 0
    } catch (error: unknown) {
      isRevealing.value = false
      const err = error as { data?: { message?: string } }
      if (err.data?.message === 'Not a valid word.') {
        triggerShake()
        haptics.errorTap()
        toast.add({ title: 'Not in word list', color: 'error' })
      } else if (err.data?.message) {
        toast.add({ title: err.data.message, color: 'error' })
      }
    }
  }

  return { submitGuess }
}
