// deploy-trigger: 2026-03-04T20:40:25Z
import { fileURLToPath } from 'node:url'
import { resolve, dirname } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))

const appBackendPreset =
  process.env.APP_BACKEND_PRESET === 'managed-supabase' ? 'managed-supabase' : 'default'
const supabaseUrl = process.env.AUTH_AUTHORITY_URL || process.env.SUPABASE_URL || ''
const supabasePublishableKey =
  process.env.SUPABASE_PUBLISHABLE_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  process.env.SUPABASE_AUTH_ANON_KEY ||
  ''
const supabaseServiceRoleKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_AUTH_SERVICE_ROLE_KEY || ''
const configuredAuthBackend = process.env.AUTH_BACKEND
const authBackend =
  configuredAuthBackend === 'supabase' || configuredAuthBackend === 'local'
    ? configuredAuthBackend
    : supabaseUrl && supabasePublishableKey
      ? 'supabase'
      : 'local'
const authAuthorityUrl = supabaseUrl

const appOrmTablesEntry =
  process.env.NUXT_DATABASE_BACKEND === 'postgres'
    ? './server/database/pg-app-schema.ts'
    : './server/database/app-schema.ts'

function parseAuthProviders(value: string | undefined) {
  return (value || 'apple,email')
    .split(',')
    .map((provider) => provider.trim().toLowerCase())
    .filter((provider, index, providers) => provider && providers.indexOf(provider) === index)
}

const authProviders =
  authBackend === 'supabase' ? parseAuthProviders(process.env.AUTH_PROVIDERS) : ['email']
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  // Extend the published Narduk Nuxt Layer
  extends: ['@narduk-enterprises/narduk-nuxt-template-layer'],

  alias: {
    '#server/app-orm-tables': fileURLToPath(new URL(appOrmTablesEntry, import.meta.url)),
  },

  // nitro-cloudflare-dev proxies D1 bindings to the local dev server
  modules: ['nitro-cloudflare-dev'],

  nitro: {
    cloudflareDev: {
      configPath: resolve(__dirname, 'wrangler.json'),
    },
  },

  future: {
    compatibilityVersion: 4
  },

  runtimeConfig: {
    appBackendPreset,
    authBackend,
    authAuthorityUrl,
    authAnonKey: supabasePublishableKey,
    authServiceRoleKey: supabaseServiceRoleKey,
    authStorageKey: process.env.AUTH_STORAGE_KEY || 'web-auth',
    turnstileSecretKey: process.env.TURNSTILE_SECRET_KEY || '',
    supabaseUrl,
    supabasePublishableKey,
    supabaseServiceRoleKey,
    session: {
      password:
        process.env.NUXT_SESSION_PASSWORD ||
        (import.meta.dev ? 'clawdle-dev-session-secret-min-32-chars' : ''),
    },
    // Server-only (admin API routes)
    googleServiceAccountKey: process.env.GSC_SERVICE_ACCOUNT_JSON || '',
    posthogApiKey: process.env.POSTHOG_PERSONAL_API_KEY || '',
    gaPropertyId: process.env.GA_PROPERTY_ID || '',
    posthogProjectId: process.env.POSTHOG_PROJECT_ID || '',
    public: {
      appBackendPreset,
      authBackend,
      authAuthorityUrl,
      authLoginPath: '/login',
      authRegisterPath: '/register',
      authCallbackPath: '/auth/callback',
      authConfirmPath: '/auth/confirm',
      authResetPath: '/reset-password',
      authLogoutPath: '/logout',
      authRedirectPath: '/dashboard/',
      authProviders,
      authPublicSignup: process.env.AUTH_PUBLIC_SIGNUP !== 'false',
      authRequireMfa: process.env.AUTH_REQUIRE_MFA === 'true',
      authTurnstileSiteKey: process.env.TURNSTILE_SITE_KEY || '',
      supabaseUrl,
      supabasePublishableKey,
      appUrl: process.env.SITE_URL || 'https://clawdle.nard.uk',
      appName: process.env.APP_NAME || 'Clawdle',
      // Analytics
      posthogPublicKey: process.env.POSTHOG_PUBLIC_KEY || '',
      posthogHost: process.env.POSTHOG_HOST || 'https://us.i.posthog.com',
      gaMeasurementId: process.env.GA_MEASUREMENT_ID || '',
      posthogProjectId: process.env.POSTHOG_PROJECT_ID || '',
      // IndexNow
      indexNowKey: process.env.INDEXNOW_KEY || '',
    }
  },

  site: {
    url: process.env.SITE_URL || 'https://clawdle.nard.uk',
    name: 'Clawdle',
    description: 'A daily word puzzle game. Guess the 5-letter word in 6 tries with color-coded clues. Play today\'s Clawdle!',
    defaultLocale: 'en',
  },

  schemaOrg: {
    identity: {
      type: 'Organization',
      name: 'Clawdle',
      url: process.env.SITE_URL || 'https://clawdle.nard.uk',
      logo: '/favicon.svg',
    },
  },

  image: {
    cloudflare: {
      baseURL: process.env.SITE_URL || 'https://clawdle.nard.uk',
    },
  },
})
