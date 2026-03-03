import { eq } from 'drizzle-orm'
import { playerStats } from '#server/database/schema'

export default defineEventHandler(async (event) => {
    const db = useAppDatabase(event)
    const playerId = getPlayerId(event)

    const result = await db
        .select()
        .from(playerStats)
        .where(eq(playerStats.playerId, playerId))
        .limit(1)

    const stats = result[0]
    if (!stats) {
        return {
            gamesPlayed: 0,
            gamesWon: 0,
            currentStreak: 0,
            maxStreak: 0,
            winPercentage: 0,
            guessDistribution: { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0, '6': 0 },
        }
    }

    const gamesPlayed = Number(stats.gamesPlayed)
    const gamesWon = Number(stats.gamesWon)

    return {
        gamesPlayed,
        gamesWon,
        currentStreak: Number(stats.currentStreak),
        maxStreak: Number(stats.maxStreak),
        winPercentage: gamesPlayed > 0 ? Math.round((gamesWon / gamesPlayed) * 100) : 0,
        guessDistribution: JSON.parse(stats.guessDistribution as string),
    }
})
