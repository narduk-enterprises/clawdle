import type { GameState, GuessFeedback } from '~/utils/word-game-logic'

const xhr = { headers: { 'X-Requested-With': 'XMLHttpRequest' as const } }

export async function postGameGuess(guess: string, sessionId: string | null) {
  return await $fetch<{
    sessionId: string
    guesses: GuessFeedback[]
    status: GameState['status']
    attempts: number
    answer: string | null
  }>('/api/game/guess', {
    method: 'POST',
    body: { guess, sessionId },
    ...xhr,
  })
}

export async function postStatsUpdate(status: 'won' | 'lost', attempts: number) {
  await $fetch('/api/stats/update', {
    method: 'POST',
    body: { status, attempts },
    ...xhr,
  })
}

export async function postNewGameSession() {
  return await $fetch<{
    sessionId: string
    guesses: GuessFeedback[]
    status: GameState['status']
    attempts: number
    answer: string | null
    puzzleNumber: number | string
  }>('/api/game/new', {
    method: 'POST',
    ...xhr,
  })
}
