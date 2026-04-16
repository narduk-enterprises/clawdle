# Spec Tech Artifact Map

`spec-tech` writes into `SPEC.md` and `CONTRACT.md`.

## `SPEC.md`

Put these here:

- runtime target
- auth and data ownership boundaries
- major deploy, preview, and external dependency assumptions
- non-functional technical constraints that affect scope

## `CONTRACT.md`

This is the canonical home for:

- reads and mutations
- callbacks, webhooks, and cron
- request and response shape notes
- validation, auth, rate limiting, and side effects
- session exchange and auth callback behavior

## `UI_PLAN.md`

Only add tech material here when route behavior depends on it, for example
protected-route gating, auth callback routes, or upload/search dependencies.
