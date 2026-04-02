import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { definePublicMutation, withValidatedBody } from '#layer/server/utils/mutation'
import { playerStats } from '#server/database/schema'

const updateSchema = z.object({
  status: z.enum(['won', 'lost']),
  attempts: z.number().int().min(1).max(6),
})

const STATS_RATE: { namespace: string; maxRequests: number; windowMs: number } = {
  namespace: 'clawdle-stats-update',
  maxRequests: 10,
  windowMs: 60_000,
}

export default definePublicMutation(
  {
    rateLimit: STATS_RATE,
    parseBody: withValidatedBody(updateSchema.parse),
  },
  async ({ event, body }) => {
    const { status, attempts } = body
    const db = useAppDatabase(event)
    const playerId = getPlayerId(event)
    const today = new Date().toISOString().split('T')[0]!

    const existing = await db
      .select()
      .from(playerStats)
      .where(eq(playerStats.playerId, playerId))
      .limit(1)

    const stats = existing[0]

    if (!stats) {
      const distribution: Record<string, number> = {
        '1': 0,
        '2': 0,
        '3': 0,
        '4': 0,
        '5': 0,
        '6': 0,
      }
      if (status === 'won') {
        distribution[String(attempts)] = 1
      }

      const newId = generateStatsId()
      await db.insert(playerStats).values({
        id: newId,
        playerId,
        gamesPlayed: 1,
        gamesWon: status === 'won' ? 1 : 0,
        currentStreak: status === 'won' ? 1 : 0,
        maxStreak: status === 'won' ? 1 : 0,
        guessDistribution: JSON.stringify(distribution),
        lastPlayedDate: today,
      })

      return { success: true }
    }

    if (stats.lastPlayedDate === today) {
      return { success: true, message: 'Already recorded for today.' }
    }

    const gamesPlayed = Number(stats.gamesPlayed) + 1
    const gamesWon = Number(stats.gamesWon) + (status === 'won' ? 1 : 0)
    const currentStreak = status === 'won' ? Number(stats.currentStreak) + 1 : 0
    const maxStreak = Math.max(Number(stats.maxStreak), currentStreak)

    const distribution = JSON.parse(stats.guessDistribution as string) as Record<string, number>
    if (status === 'won') {
      distribution[String(attempts)] = (distribution[String(attempts)] || 0) + 1
    }

    await db
      .update(playerStats)
      .set({
        gamesPlayed,
        gamesWon,
        currentStreak,
        maxStreak,
        guessDistribution: JSON.stringify(distribution),
        lastPlayedDate: today,
      })
      .where(eq(playerStats.id, stats.id))

    return { success: true }
  },
)

function generateStatsId(size = 21): string {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-'
  const bytes = new Uint8Array(size)
  crypto.getRandomValues(bytes)
  let id = ''
  for (let i = 0; i < size; i++) {
    id += alphabet[bytes[i]! & 63]
  }
  return id
}
