# Spec UX Artifact Map

`spec-ux` writes into both `SPEC.md` and `UI_PLAN.md`.

## `SPEC.md`

Put these here:

- high-level user flows
- auth and access behavior at a product level
- accessibility commitments that materially affect the product

## `UI_PLAN.md`

Put these here:

- route-by-route loading, empty, error, success, and retry behavior
- auth gating and redirect expectations per route group
- support and escalation touchpoints tied to routes

## `CONTRACT.md`

Only write UX-driven items here when the flow requires explicit server actions,
session exchange, callbacks, or validation behavior.
