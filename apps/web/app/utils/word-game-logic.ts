export interface GuessFeedback {
  word: string
  feedback: Array<'correct' | 'present' | 'absent'>
}

export interface GameState {
  sessionId: string | null
  guesses: GuessFeedback[]
  status: 'idle' | 'in_progress' | 'won' | 'lost'
  attempts: number
  puzzleNumber: number | string
  answer: string | null
}

function ordinalSuffix(n: number): string {
  const s = ['th', 'st', 'nd', 'rd']
  const v = n % 100
  return s[(v - 20) % 10] || s[v] || s[0]!
}

export function evaluateHardModeGuess(guesses: GuessFeedback[], guess: string): string | null {
  for (const prevGuess of guesses) {
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

export function computeKeyLetterStates(
  guesses: GuessFeedback[],
): Record<string, 'correct' | 'present' | 'absent'> {
  const states: Record<string, 'correct' | 'present' | 'absent'> = {}
  for (const guess of guesses) {
    for (let i = 0; i < 5; i++) {
      const letter = guess.word[i]!
      const feedback = guess.feedback[i]!
      const existing = states[letter]
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
}

export function formatClawdleShareText(gameState: GameState): string {
  const rows = gameState.guesses.map((g) =>
    g.feedback
      .map((f) => {
        if (f === 'correct') return '🟩'
        if (f === 'present') return '🟨'
        return '⬛'
      })
      .join(''),
  )

  const attemptsStr = gameState.status === 'won' ? `${gameState.attempts}/6` : 'X/6'

  return `Clawdle ${gameState.puzzleNumber} ${attemptsStr}\n\n${rows.join('\n')}`
}

export function getMsUntilNextUtcCalendarDay(now: Date = new Date()): number {
  const tomorrow = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1))
  return tomorrow.getTime() - now.getTime()
}
