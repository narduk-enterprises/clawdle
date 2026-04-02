import type { H3Event } from 'h3'
import { eq } from 'drizzle-orm'
import { words } from '#server/database/schema'
import { VALID_WORDS } from './dictionary'

/**
 * Get today's word entry based on current UTC date.
 * Returns the word row or null if no word is assigned for today.
 */
export async function getTodaysWord(event: H3Event) {
  const db = useAppDatabase(event)
  const today = new Date().toISOString().split('T')[0]!

  const result = await db.select().from(words).where(eq(words.dateUsed, today)).limit(1)

  return result[0] ?? null
}

/**
 * Check if a guess is a valid word.
 * Uses the in-memory dictionary (~12,970 words) for fast O(1) lookups.
 * Falls back to the DB if needed (e.g. for custom words added later).
 */
export async function isValidWord(event: H3Event, guess: string): Promise<boolean> {
  const normalized = guess.toLowerCase()

  // Fast in-memory check against the comprehensive dictionary
  if (VALID_WORDS.has(normalized)) return true

  // Fallback: check DB for any custom words added outside the dictionary
  const db = useAppDatabase(event)
  const result = await db
    .select({ id: words.id })
    .from(words)
    .where(eq(words.word, normalized))
    .limit(1)

  return result.length > 0
}

/**
 * Compute letter-by-letter feedback for a guess against the answer.
 * Returns an array of 5 states: 'correct' | 'present' | 'absent'
 *
 * Uses the standard Wordle algorithm:
 * 1. First pass: mark exact matches (green)
 * 2. Second pass: mark present letters (yellow) considering remaining counts
 */
export function computeFeedback(
  guess: string,
  answer: string,
): Array<'correct' | 'present' | 'absent'> {
  const result: Array<'correct' | 'present' | 'absent'> = Array(5).fill('absent')
  const answerChars = answer.split('')
  const guessChars = guess.split('')
  const remaining: Record<string, number> = {}

  // First pass: mark correct positions
  for (let i = 0; i < 5; i++) {
    if (guessChars[i] === answerChars[i]) {
      result[i] = 'correct'
    } else {
      // Count remaining answer letters for second pass
      remaining[answerChars[i]!] = (remaining[answerChars[i]!] || 0) + 1
    }
  }

  // Second pass: mark present letters
  for (let i = 0; i < 5; i++) {
    if (result[i] === 'correct') continue
    const letter = guessChars[i]!
    if (remaining[letter] && remaining[letter] > 0) {
      result[i] = 'present'
      remaining[letter]--
    }
  }

  return result
}
