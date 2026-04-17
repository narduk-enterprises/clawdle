import {
  type GameState,
  computeKeyLetterStates,
  formatClawdleShareText,
  getMsUntilNextUtcCalendarDay,
} from '~/utils/word-game-logic'
import { postNewGameSession } from '~/utils/game-remote'

export function useGame() {
  const board = useState<string[][]>('game-board', () =>
    Array.from({ length: 6 }, () => Array(5).fill('')),
  )
  const currentRow = useState<number>('game-current-row', () => 0)
  const currentCol = useState<number>('game-current-col', () => 0)
  const gameState = useState<GameState>('game-state', () => ({
    sessionId: null,
    guesses: [],
    status: 'idle',
    attempts: 0,
    puzzleNumber: 0,
    answer: null,
  }))
  const isRevealing = useState<boolean>('game-revealing', () => false)
  const shakeRow = useState<number>('game-shake-row', () => -1)
  const bounceRow = useState<number>('game-bounce-row', () => -1)
  const settings = useSettings()
  const toast = useToast()
  const haptics = useHaptics()

  const { initGame } = useGameBootstrap(gameState, board, currentRow, currentCol)
  const { submitGuess } = useGameGuess(
    gameState,
    board,
    currentRow,
    currentCol,
    isRevealing,
    shakeRow,
    bounceRow,
    settings,
    toast,
    haptics,
  )

  function addLetter(letter: string) {
    if (gameState.value.status !== 'in_progress' && gameState.value.status !== 'idle') return
    if (gameState.value.status === 'idle') gameState.value.status = 'in_progress'
    if (currentCol.value >= 5 || isRevealing.value) return
    board.value[currentRow.value]![currentCol.value] = letter.toLowerCase()
    currentCol.value++
  }

  function removeLetter() {
    if (gameState.value.status !== 'in_progress' || currentCol.value <= 0 || isRevealing.value)
      return
    currentCol.value--
    board.value[currentRow.value]![currentCol.value] = ''
  }

  const keyStates = computed(() => computeKeyLetterStates(gameState.value.guesses))

  function getShareText(): string {
    return formatClawdleShareText(gameState.value)
  }

  function getNextPuzzleTime(): number {
    return getMsUntilNextUtcCalendarDay()
  }

  async function startNewGame() {
    try {
      const result = await postNewGameSession()
      gameState.value.sessionId = result.sessionId
      gameState.value.guesses = result.guesses
      gameState.value.status = result.status
      gameState.value.attempts = result.attempts
      gameState.value.answer = result.answer
      gameState.value.puzzleNumber = result.puzzleNumber
      board.value = Array.from({ length: 6 }, () => Array(5).fill(''))
      currentRow.value = 0
      currentCol.value = 0
    } catch {
      toast.add({ title: 'Failed to start a new game', color: 'error' })
    }
  }

  return {
    board,
    currentRow,
    currentCol,
    gameState,
    isRevealing,
    shakeRow,
    bounceRow,
    keyStates,
    getNextPuzzleTime,
    initGame,
    addLetter,
    removeLetter,
    submitGuess,
    getShareText,
    startNewGame,
  }
}
