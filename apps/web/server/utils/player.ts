import type { H3Event } from 'h3'

/**
 * Get or create an anonymous player ID from the `clawdle-player` cookie.
 * Uses a nanoid-style random string (no external dependency — Web Crypto API).
 */
export function getPlayerId(event: H3Event): string {
    const existing = getCookie(event, 'clawdle-player')
    if (existing) return existing

    const id = generateId()
    setCookie(event, 'clawdle-player', id, {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 365 * 2, // 2 years
        path: '/',
    })
    return id
}

/**
 * Generate a URL-safe random ID (21 chars) using Web Crypto API.
 * Compatible with Cloudflare Workers (no Node.js crypto).
 */
function generateId(size = 21): string {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-'
    const bytes = new Uint8Array(size)
    crypto.getRandomValues(bytes)
    let id = ''
    for (let i = 0; i < size; i++) {
        id += alphabet[bytes[i]! & 63]
    }
    return id
}
