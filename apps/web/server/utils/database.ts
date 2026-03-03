import type { H3Event } from 'h3'
import { drizzle, type DrizzleD1Database } from 'drizzle-orm/d1'
import * as schema from '#server/database/schema'

/**
 * App-level Drizzle instance that includes all Clawdle tables.
 *
 * Named `useAppDatabase` to avoid colliding with the layer's auto-imported
 * `useDatabase` which only knows about base layer tables.
 */
export function useAppDatabase(event: H3Event): DrizzleD1Database<typeof schema> {
    if (event.context._appDb) {
        return event.context._appDb
    }

    const d1 = (event.context.cloudflare?.env as { DB?: D1Database })?.DB
    if (!d1) {
        throw createError({
            statusCode: 500,
            message: 'D1 database binding not available. Ensure DB is configured in wrangler.json.',
        })
    }

    const db = drizzle(d1, { schema })
    event.context._appDb = db
    return db
}
