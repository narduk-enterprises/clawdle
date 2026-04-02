import { eq, and } from 'drizzle-orm'
import { gameSessions } from '#server/database/schema'

export default defineEventHandler(async (event) => {
  const db = useAppDatabase(event)
  const playerId = getPlayerId(event)
  const today = new Date().toISOString().split('T')[0]!

  // Get today's word
  const todayWord = await getTodaysWord(event)
  if (!todayWord) {
    throw createError({ statusCode: 404, message: 'No puzzle available for today.' })
  }

  // Calculate puzzle number (days since first puzzle)
  const firstDate = new Date('2026-03-03')
  const currentDate = new Date(today)
  const puzzleNumber =
    Math.floor((currentDate.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24)) + 1

  // Check if player already has a session for today
  const existingSession = await db
    .select()
    .from(gameSessions)
    .where(and(eq(gameSessions.playerId, playerId), eq(gameSessions.wordId, todayWord.id)))
    .limit(1)

  const session = existingSession[0]

  return {
    puzzleNumber,
    hasPlayed: session?.status !== undefined && session.status !== 'in_progress',
    sessionId: session?.id ?? null,
    status: session?.status ?? null,
    attempts: session ? Number(session.attempts) : 0,
  }
})
