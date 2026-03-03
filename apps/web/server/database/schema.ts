/**
 * App-specific database schema.
 *
 * Re-exports the layer's base tables (users, sessions, todos) so that
 * drizzle-kit can discover them from this workspace. Clawdle-specific
 * tables are defined below.
 */
import { sqliteTable, text, integer, uniqueIndex, index } from 'drizzle-orm/sqlite-core'

export * from '#layer/server/database/schema'

// ─── Words ──────────────────────────────────────────────────
export const words = sqliteTable('words', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  word: text('word', { length: 5 }).notNull().unique(),
  dateUsed: text('date_used'), // ISO date (YYYY-MM-DD), nullable, unique when set
}, (table) => [
  uniqueIndex('words_date_used_unique').on(table.dateUsed),
])

// ─── Game Sessions ──────────────────────────────────────────
export const gameSessions = sqliteTable('game_sessions', {
  id: text('id').primaryKey(), // nanoid
  playerId: text('player_id').notNull(),
  wordId: integer('word_id').notNull().references(() => words.id),
  guesses: text('guesses').notNull().default('[]'), // JSON array of guessed words
  status: text('status').notNull().default('in_progress'), // in_progress | won | lost
  attempts: integer('attempts').notNull().default(0),
  completedAt: text('completed_at'), // ISO datetime, nullable
  createdAt: text('created_at').notNull().$defaultFn(() => new Date().toISOString()),
}, (table) => [
  index('game_sessions_player_id_idx').on(table.playerId),
])

// ─── Player Stats ───────────────────────────────────────────
export const playerStats = sqliteTable('player_stats', {
  id: text('id').primaryKey(), // nanoid
  playerId: text('player_id').notNull().unique(),
  gamesPlayed: integer('games_played').notNull().default(0),
  gamesWon: integer('games_won').notNull().default(0),
  currentStreak: integer('current_streak').notNull().default(0),
  maxStreak: integer('max_streak').notNull().default(0),
  guessDistribution: text('guess_distribution').notNull().default('{"1":0,"2":0,"3":0,"4":0,"5":0,"6":0}'), // JSON
  lastPlayedDate: text('last_played_date'), // ISO date, nullable
}, (table) => [
  uniqueIndex('player_stats_player_id_unique').on(table.playerId),
])

// ─── Type helpers ───────────────────────────────────────────
export type Word = typeof words.$inferSelect
export type GameSession = typeof gameSessions.$inferSelect
export type PlayerStat = typeof playerStats.$inferSelect
