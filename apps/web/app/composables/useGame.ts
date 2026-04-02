interface GuessFeedback {
  word: string
  feedback: Array<'correct' | 'present' | 'absent'>
}

interface GameState {
  sessionId: string | null
  guesses: GuessFeedback[]
  status: 'idle' | 'in_progress' | 'won' | 'lost'
  attempts: number
  puzzleNumber: number | string
  answer: string | null
}

export function useGame() {
  // ─── Reactive State ───────────────────────────────────
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

  // ─── Actions ──────────────────────────────────────────

  async function initGame() {
    const { data } = await useAsyncData('today', () => $fetch('/api/game/today'))
    if (!data.value) return

    gameState.value.puzzleNumber = data.value.puzzleNumber

    if (data.value.sessionId) {
      gameState.value.sessionId = data.value.sessionId
      // Load existing session
      await loadSession(data.value.sessionId)
    } else {
      gameState.value.status = 'in_progress'
    }
  }

  async function loadSession(sessionId: string) {
    try {
      const session = await $fetch(`/api/game/session/${sessionId}`)
      gameState.value.sessionId = session.sessionId
      gameState.value.guesses = session.guesses
      gameState.value.status = session.status as GameState['status']
      gameState.value.attempts = session.attempts
      gameState.value.answer = session.answer ?? null

      // Restore the board from guesses
      for (let i = 0; i < session.guesses.length; i++) {
        const guess = session.guesses[i]!
        for (let j = 0; j < 5; j++) {
          board.value[i]![j] = guess.word[j]!
        }
      }
      currentRow.value = session.guesses.length
      currentCol.value = 0
    } catch {
      // Session not found, start fresh
      gameState.value.status = 'in_progress'
    }
  }

  function addLetter(letter: string) {
    if (gameState.value.status !== 'in_progress' && gameState.value.status !== 'idle') return
    if (gameState.value.status === 'idle') gameState.value.status = 'in_progress'
    if (currentCol.value >= 5) return
    if (isRevealing.value) return

    board.value[currentRow.value]![currentCol.value] = letter.toLowerCase()
    currentCol.value++
  }

  function removeLetter() {
    if (gameState.value.status !== 'in_progress') return
    if (currentCol.value <= 0) return
    if (isRevealing.value) return

    currentCol.value--
    board.value[currentRow.value]![currentCol.value] = ''
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

    // Hard mode validation
    if (settings.hardMode.value && gameState.value.guesses.length > 0) {
      const violation = checkHardMode(guess)
      if (violation) {
        triggerShake()
        haptics.errorTap()
        toast.add({ title: violation, color: 'warning' })
        return
      }
    }

    try {
      isRevealing.value = true

      const result = await $fetch('/api/game/guess', {
        method: 'POST',
        body: { guess, sessionId: gameState.value.sessionId },
        headers: { 'X-Requested-With': 'XMLHttpRequest' },
      })

      gameState.value.sessionId = result.sessionId
      gameState.value.guesses = result.guesses
      gameState.value.status = result.status as GameState['status']
      gameState.value.attempts = result.attempts
      gameState.value.answer = result.answer ?? null

      // Wait for flip animation to complete
      await new Promise((resolve) => setTimeout(resolve, 1800))

      isRevealing.value = false

      if (result.status === 'won') {
        bounceRow.value = currentRow.value
        haptics.successTap()
        const messages = ['Genius!', 'Magnificent!', 'Impressive!', 'Splendid!', 'Great!', 'Phew!']
        toast.add({ title: messages[result.attempts - 1] ?? 'Nice!', color: 'success' })
        // Update stats
        await $fetch('/api/stats/update', {
          method: 'POST',
          body: { status: 'won', attempts: result.attempts },
          headers: { 'X-Requested-With': 'XMLHttpRequest' },
        })
      } else if (result.status === 'lost') {
        haptics.errorTap()
        toast.add({ title: result.answer?.toUpperCase() ?? 'Game over', color: 'error' })
        await $fetch('/api/stats/update', {
          method: 'POST',
          body: { status: 'lost', attempts: result.attempts },
          headers: { 'X-Requested-With': 'XMLHttpRequest' },
        })
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

  function triggerShake() {
    shakeRow.value = currentRow.value
    setTimeout(() => {
      shakeRow.value = -1
    }, 600)
  }

  function checkHardMode(guess: string): string | null {
    for (const prevGuess of gameState.value.guesses) {
      for (let i = 0; i < 5; i++) {
        if (prevGuess.feedback[i] === 'correct' && guess[i] !== prevGuess.word[i]) {
          return `${i + 1}${ordinalSuffix(i + 1)} letter must be ${prevGuess.word[i]!.toUpperCase()}`
        }
      }

      for (let i = 0; i < 5; i++) {
        if (prevGuess.feedback[i] === 'present' && !guess.includes(prevGuess.word[i]!)) {
          return `Guess must contain ${prevGuess.word[i]!.toUpperCase()}`
        }
      }
    }

    return null
  }

  function ordinalSuffix(n: number): string {
    const s = ['th', 'st', 'nd', 'rd']
    const v = n % 100
    return s[(v - 20) % 10] || s[v] || s[0]!
  }

  // ─── Key State Tracking ───────────────────────────────

  const keyStates = computed(() => {
    const states: Record<string, 'correct' | 'present' | 'absent'> = {}
    for (const guess of gameState.value.guesses) {
      for (let i = 0; i < 5; i++) {
        const letter = guess.word[i]!
        const feedback = guess.feedback[i]!
        const existing = states[letter]
        // Priority: correct > present > absent
        if (feedback === 'correct') {
          states[letter] = 'correct'
        } else if (feedback === 'present' && existing !== 'correct') {
          states[letter] = 'present'
        } else if (!existing) {
          states[letter] = 'absent'
        }
      }
    }
    return states
  })

  // ─── Share ────────────────────────────────────────────

  function getShareText(): string {
    const rows = gameState.value.guesses.map((g) =>
      g.feedback
        .map((f) => {
          if (f === 'correct') return '🟩'
          if (f === 'present') return '🟨'
          return '⬛'
        })
        .join(''),
    )

    const attemptsStr = gameState.value.status === 'won' ? `${gameState.value.attempts}/6` : 'X/6'

    return `Clawdle ${gameState.value.puzzleNumber} ${attemptsStr}\n\n${rows.join('\n')}`
  }

  // ─── Countdown ────────────────────────────────────────

  function getNextPuzzleTime(): number {
    const now = new Date()
    const tomorrow = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1),
    )
    return tomorrow.getTime() - now.getTime()
  }

  // ─── Play Again ───────────────────────────────────────

  async function startNewGame() {
    try {
      const result = await $fetch<{
        sessionId: string
        guesses: GuessFeedback[]
        status: GameState['status']
        attempts: number
        answer: string | null
        puzzleNumber: number | string
      }>('/api/game/new', {
        method: 'POST',
        headers: { 'X-Requested-With': 'XMLHttpRequest' },
      })

      gameState.value.sessionId = result.sessionId
      gameState.value.guesses = result.guesses
      gameState.value.status = result.status
      gameState.value.attempts = result.attempts
      gameState.value.answer = result.answer
      gameState.value.puzzleNumber = result.puzzleNumber

      // Reset board
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
