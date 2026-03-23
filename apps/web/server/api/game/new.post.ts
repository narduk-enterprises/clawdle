import { eq } from 'drizzle-orm'
import { definePublicMutation } from '#layer/server/utils/mutation'
import { gameSessions, words } from '#server/database/schema'
import { VALID_WORDS } from '#server/utils/dictionary'
import { getPlayerId } from '#server/utils/player'

const NEW_GAME_RATE: { namespace: string; maxRequests: number; windowMs: number } = {
  namespace: 'clawdle-new-game',
  maxRequests: 60,
  windowMs: 60_000,
}

export default definePublicMutation(
  {
    rateLimit: NEW_GAME_RATE,
  },
  async ({ event }) => {
    const db = useAppDatabase(event)
    const playerId = getPlayerId(event)

    const allWords = Array.from(VALID_WORDS)
    const randomWord = allWords[Math.floor(Math.random() * allWords.length)]!

    let wordRecord = await db
      .select()
      .from(words)
      .where(eq(words.word, randomWord))
      .limit(1)
      .then((res) => res[0])

    if (!wordRecord) {
      const result = await db
        .insert(words)
        .values({
          word: randomWord,
          dateUsed: null,
        })
        .returning()
      wordRecord = result[0]
    }

    const newId = generateSessionId()
    await db.insert(gameSessions).values({
      id: newId,
      playerId,
      wordId: wordRecord!.id,
      guesses: '[]',
      status: 'in_progress',
      attempts: 0,
      createdAt: new Date().toISOString(),
    })

    return {
      sessionId: newId,
      puzzleNumber: 'Random',
      status: 'in_progress',
      attempts: 0,
      guesses: [],
      answer: null,
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
