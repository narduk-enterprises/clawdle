import { eq, and } from 'drizzle-orm'
import { z } from 'zod'
import { definePublicMutation, withValidatedBody } from '#layer/server/utils/mutation'
import { gameSessions, words } from '#server/database/schema'

const guessSchema = z.object({
  guess: z
    .string()
    .length(5)
    .transform((val) => val.toLowerCase()),
  sessionId: z.string().nullish(),
})

const GUESS_RATE: { namespace: string; maxRequests: number; windowMs: number } = {
  namespace: 'clawdle-guess',
  maxRequests: 30,
  windowMs: 60_000,
}

export default definePublicMutation(
  {
    rateLimit: GUESS_RATE,
    parseBody: withValidatedBody(guessSchema.parse),
  },
  async ({ event, body }) => {
    const { guess, sessionId } = body
    const db = useAppDatabase(event)
    const playerId = getPlayerId(event)

    const valid = await isValidWord(event, guess)
    if (!valid) {
      throw createError({ statusCode: 422, message: 'Not a valid word.' })
    }

    let session: typeof gameSessions.$inferSelect | undefined
    let answerWordObj: { id: number; word: string } | null = null

    if (sessionId) {
      const result = await db
        .select()
        .from(gameSessions)
        .where(and(eq(gameSessions.id, sessionId), eq(gameSessions.playerId, playerId)))
        .limit(1)
      session = result[0]
    }

    if (session) {
      const wordRow = await db.select().from(words).where(eq(words.id, session.wordId)).limit(1)
      if (wordRow[0]) {
        answerWordObj = { id: wordRow[0].id, word: wordRow[0].word }
      }
    }

    if (!answerWordObj) {
      const todayWord = await getTodaysWord(event)
      if (!todayWord) {
        throw createError({ statusCode: 404, message: 'No puzzle available for today.' })
      }
      answerWordObj = { id: todayWord.id, word: todayWord.word }

      if (!session) {
        const existing = await db
          .select()
          .from(gameSessions)
          .where(and(eq(gameSessions.playerId, playerId), eq(gameSessions.wordId, todayWord.id)))
          .limit(1)

        if (existing[0]) {
          session = existing[0]
        }
      }
    }

    if (session && (session.status === 'won' || session.status === 'lost')) {
      throw createError({ statusCode: 400, message: 'Game already completed.' })
    }

    const feedback = computeFeedback(guess, answerWordObj.word)
    const isCorrect = feedback.every((f) => f === 'correct')

    if (!session) {
      const newId = generateSessionId()
      const guesses = [guess]
      const attempts = 1
      const status = isCorrect ? 'won' : attempts >= 6 ? 'lost' : 'in_progress'

      await db.insert(gameSessions).values({
        id: newId,
        playerId,
        wordId: answerWordObj.id,
        guesses: JSON.stringify(guesses),
        status,
        attempts,
        completedAt: status !== 'in_progress' ? new Date().toISOString() : null,
        createdAt: new Date().toISOString(),
      })

      return {
        sessionId: newId,
        guesses: [{ word: guess, feedback }],
        status,
        attempts,
        answer: status === 'lost' ? answerWordObj.word : undefined,
      }
    }

    const existingGuesses: string[] = JSON.parse(session.guesses as string)
    existingGuesses.push(guess)
    const attempts = existingGuesses.length
    const status = isCorrect ? 'won' : attempts >= 6 ? 'lost' : 'in_progress'

    await db
      .update(gameSessions)
      .set({
        guesses: JSON.stringify(existingGuesses),
        attempts,
        status,
        completedAt: status !== 'in_progress' ? new Date().toISOString() : null,
      })
      .where(eq(gameSessions.id, session.id))

    const allFeedback = existingGuesses.map((g) => ({
      word: g,
      feedback: computeFeedback(g, answerWordObj!.word),
    }))

    return {
      sessionId: session.id,
      guesses: allFeedback,
      status,
      attempts,
      answer: status === 'lost' ? answerWordObj!.word : undefined,
    }
  },
)

function generateSessionId(size = 21): string {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-'
  const bytes = new Uint8Array(size)
  crypto.getRandomValues(bytes)
  let id = ''
  for (let i = 0; i < size; i++) {
    id += alphabet[bytes[i]! & 63]
  }
  return id
}
