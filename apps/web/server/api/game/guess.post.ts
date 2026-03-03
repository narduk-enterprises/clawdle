import { eq, and } from 'drizzle-orm'
import { z } from 'zod'
import { gameSessions } from '#server/database/schema'

const guessSchema = z.object({
    guess: z.string().length(5).transform(val => val.toLowerCase()),
    sessionId: z.string().nullish(),
})

export default defineEventHandler(async (event) => {
    await enforceRateLimit(event, 'guess', 30, 60_000) // 30 guesses per minute

    const body = await readBody(event)
    const parsed = guessSchema.safeParse(body)
    if (!parsed.success) {
        throw createError({ statusCode: 400, message: 'Invalid guess. Must be exactly 5 letters.' })
    }

    const { guess, sessionId } = parsed.data
    const db = useAppDatabase(event)
    const playerId = getPlayerId(event)

    // Validate the guess is a real word
    const valid = await isValidWord(event, guess)
    if (!valid) {
        throw createError({ statusCode: 422, message: 'Not a valid word.' })
    }

    // Get today's word
    const todayWord = await getTodaysWord(event)
    if (!todayWord) {
        throw createError({ statusCode: 404, message: 'No puzzle available for today.' })
    }

    // Get or create session
    let session: typeof gameSessions.$inferSelect | undefined

    if (sessionId) {
        const result = await db
            .select()
            .from(gameSessions)
            .where(
                and(
                    eq(gameSessions.id, sessionId),
                    eq(gameSessions.playerId, playerId),
                ),
            )
            .limit(1)
        session = result[0]
    }

    if (!session) {
        // Check if player already has a session for today's word
        const existing = await db
            .select()
            .from(gameSessions)
            .where(
                and(
                    eq(gameSessions.playerId, playerId),
                    eq(gameSessions.wordId, todayWord.id),
                ),
            )
            .limit(1)

        if (existing[0]) {
            session = existing[0]
        }
    }

    if (session && (session.status === 'won' || session.status === 'lost')) {
        throw createError({ statusCode: 400, message: 'Game already completed.' })
    }

    // Compute feedback
    const feedback = computeFeedback(guess, todayWord.word)
    const isCorrect = feedback.every(f => f === 'correct')

    if (!session) {
        // Create new session
        const newId = generateSessionId()
        const guesses = [guess]
        const attempts = 1
        const status = isCorrect ? 'won' : (attempts >= 6 ? 'lost' : 'in_progress')

        await db.insert(gameSessions).values({
            id: newId,
            playerId,
            wordId: todayWord.id,
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
            answer: status === 'lost' ? todayWord.word : undefined,
        }
    }

    // Update existing session
    const existingGuesses: string[] = JSON.parse(session.guesses as string)
    existingGuesses.push(guess)
    const attempts = existingGuesses.length
    const status = isCorrect ? 'won' : (attempts >= 6 ? 'lost' : 'in_progress')

    await db
        .update(gameSessions)
        .set({
            guesses: JSON.stringify(existingGuesses),
            attempts,
            status,
            completedAt: status !== 'in_progress' ? new Date().toISOString() : null,
        })
        .where(eq(gameSessions.id, session.id))

    // Build full feedback for all guesses
    const allFeedback = existingGuesses.map(g => ({
        word: g,
        feedback: computeFeedback(g, todayWord.word),
    }))

    return {
        sessionId: session.id,
        guesses: allFeedback,
        status,
        attempts,
        answer: status === 'lost' ? todayWord.word : undefined,
    }
})

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
