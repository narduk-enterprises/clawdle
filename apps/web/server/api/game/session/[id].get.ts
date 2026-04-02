import { eq, and } from 'drizzle-orm'
import { gameSessions, words } from '#server/database/schema'

export default defineEventHandler(async (event) => {
  const sessionId = getRouterParam(event, 'id')
  if (!sessionId) {
    throw createError({ statusCode: 400, message: 'Session ID is required.' })
  }

  const db = useAppDatabase(event)
  const playerId = getPlayerId(event)

  const result = await db
    .select()
    .from(gameSessions)
    .where(and(eq(gameSessions.id, sessionId), eq(gameSessions.playerId, playerId)))
    .limit(1)

  const session = result[0]
  if (!session) {
    throw createError({ statusCode: 404, message: 'Session not found.' })
  }

  // Get the word for this session
  const wordResult = await db.select().from(words).where(eq(words.id, session.wordId)).limit(1)

  const word = wordResult[0]
  if (!word) {
    throw createError({ statusCode: 500, message: 'Word not found for session.' })
  }

  // Build feedback for all guesses
  const guesses: string[] = JSON.parse(session.guesses as string)
  const allFeedback = guesses.map((g) => ({
    word: g,
    feedback: computeFeedback(g, word.word),
  }))

  return {
    sessionId: session.id,
    guesses: allFeedback,
    status: session.status,
    attempts: Number(session.attempts),
    answer: session.status === 'lost' ? word.word : undefined,
  }
})
