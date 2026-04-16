# Narduk Platform Conventions

This file captures the local delta that should not be re-derived from generic
Nuxt or Vue documentation every time.

## Platform Baseline

Assume the default fleet baseline unless repo evidence disproves it:

- Nuxt 4
- Nuxt UI 4
- Vue 3 with Composition API and `<script setup lang="ts">`
- Cloudflare Workers runtime
- D1 and Drizzle for the primary database path
- stateless request handling across worker isolates
- spec-driven delivery via `SPEC.md`, `UI_PLAN.md`, and `CONTRACT.md`

When the repo diverges from this baseline, call that out explicitly instead of
forcing the assumption.

## Shared Layer Ownership

Common ownership split:

- shared behavior comes from an external Narduk template layer through
  `extends`
- app repos own `nuxt.config.ts`, `app.config.ts`, app routes, app composables,
  app components, and any explicit app overrides
- shared lint or guardrail behavior may come from upstream packages or local
  shims that wrap them

Audit implications:

- unexpected local reimplementation of layer-owned behavior is often drift
- missing external layer packages are findings or limitations, not reasons to
  skip the audit
- package-name renames in the shared layer can leave stale hard-coded paths in
  validation scripts, migration commands, or docs; check for legacy
  `.../narduk-nuxt-template-layer/...` references when the repo now uses
  `.../narduk-nuxt-template-layer-core/...`
- use the Nuxt layers skill for generic precedence rules; keep only the Narduk
  ownership model here

## Repo Guardrails

Prefer repo-defined guardrails before subjective review. Common signals:

- `pnpm run guardrails:repo`
- `tools/check-guardrails.ts`
- `tools/guardrails/*`
- `docs/agents/engineering.md`
- custom ESLint plugins or configs under `packages/eslint-config`

Important rule families commonly enforced in Narduk apps:

- Nuxt guardrails:
  `no-raw-fetch`, `no-raw-fetch-in-stores`, `no-ssr-dom-access`,
  `valid-useAsyncData`, `valid-useFetch`, `plugin-suffix-for-browser-apis`,
  `require-csrf-header-on-mutations`, `no-fetch-create-bypass`,
  `require-use-seo-on-pages`, `require-schema-on-pages`
- Nuxt UI checks:
  deprecated props or slots, unknown props, invalid variant values, `prefer-uform`
- Vue best-practice checks:
  `require-script-setup`, typed props and emits, composable naming and hook
  safety, no DOM access in composables without client guards

Prefer fixing the underlying issue over adding suppressions. If suppressions are
already present, inspect whether they are stale or unjustified.

## Security And SSR Expectations

Look for these recurring Narduk conventions:

- browser-only APIs stay behind client guards, lifecycle hooks, or client-only
  plugin/component boundaries
- setup code should not use raw `$fetch` when SSR-safe `useFetch` or
  `useAsyncData` is expected
- stores should use the app's SSR-safe fetch path rather than bypassing auth or
  cookie forwarding
- mutation flows should carry the required CSRF contract when the repo enforces
  one
- server code should stay stateless and avoid request-handling patterns that
  assume Node-only behavior

## Spec-Driven Alignment

`SPEC.md`, `UI_PLAN.md`, and `CONTRACT.md` are part of the audit surface, not
background docs.

Check whether:

- routes and page behavior match the intended information architecture
- API or mutation behavior matches `CONTRACT.md`
- page-level SEO or schema expectations described by repo guardrails or product
  docs are actually implemented
- recent implementation notes contradict the living spec

If the code and docs disagree, report which side appears stale and what should
be reconciled first.
