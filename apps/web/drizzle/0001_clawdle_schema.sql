-- Clawdle game tables
-- Migration: 0001_clawdle_schema.sql

CREATE TABLE IF NOT EXISTS `words` (
  `id` integer PRIMARY KEY AUTOINCREMENT,
  `word` text NOT NULL,
  `date_used` text
);

CREATE UNIQUE INDEX IF NOT EXISTS `words_word_unique` ON `words` (`word`);
CREATE UNIQUE INDEX IF NOT EXISTS `words_date_used_unique` ON `words` (`date_used`);

CREATE TABLE IF NOT EXISTS `game_sessions` (
  `id` text PRIMARY KEY NOT NULL,
  `player_id` text NOT NULL,
  `word_id` integer NOT NULL REFERENCES `words`(`id`),
  `guesses` text NOT NULL DEFAULT '[]',
  `status` text NOT NULL DEFAULT 'in_progress',
  `attempts` integer NOT NULL DEFAULT 0,
  `completed_at` text,
  `created_at` text NOT NULL
);

CREATE INDEX IF NOT EXISTS `game_sessions_player_id_idx` ON `game_sessions` (`player_id`);

CREATE TABLE IF NOT EXISTS `player_stats` (
  `id` text PRIMARY KEY NOT NULL,
  `player_id` text NOT NULL,
  `games_played` integer NOT NULL DEFAULT 0,
  `games_won` integer NOT NULL DEFAULT 0,
  `current_streak` integer NOT NULL DEFAULT 0,
  `max_streak` integer NOT NULL DEFAULT 0,
  `guess_distribution` text NOT NULL DEFAULT '{"1":0,"2":0,"3":0,"4":0,"5":0,"6":0}',
  `last_played_date` text
);

CREATE UNIQUE INDEX IF NOT EXISTS `player_stats_player_id_unique` ON `player_stats` (`player_id`);
