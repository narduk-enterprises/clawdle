# Spec Tech Intake

Use this intake to lock runtime, data, auth, and contract decisions.

## Runtime and deploy

- Where does the app run?
- What preview and deploy path is real?
- Are there host, domain, or external service constraints?

## Data and auth

- Is the data backend D1 or Postgres via Hyperdrive?
- What auth model applies: local, managed Supabase, shared authority, or other?
- Who owns the session: upstream authority, app-local session, or both?
- Which schema is layer-owned versus app-owned?

## Contract surface

- Which reads, mutations, callbacks, webhooks, or cron surfaces are required?
- Which routes need validation, auth, rate limiting, or side-effect notes?
- Are uploads, search, analytics, or admin actions part of launch?

## Bindings and operations

- Which bindings matter: `DB`, `KV`, `HYPERDRIVE`, or others?
- What observability or admin-access expectations are real?
- Which secrets or external dependencies are required?
