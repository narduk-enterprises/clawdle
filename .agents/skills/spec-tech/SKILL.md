---
name: spec-tech
description: >-
  Lock or update the technical slice of a whole-product spec: runtime, data
  backend, auth model, session ownership, contract surface, bindings, secrets,
  deployment, previews, and observability. Use when build-spec needs platform
  or contract decisions resolved or when an existing plan needs a tech re-lock.
---

# Spec Tech

Use this skill to create or update the technical lock for a whole-product plan.
This skill owns runtime, auth, data, deployment, and contract truth.

## When to use

- `build-spec` identified runtime, auth, data, or contract drift
- The product needs D1 versus Postgres, local versus shared auth, or preview
  and deployment assumptions locked
- `CONTRACT.md` is missing or too vague to guide implementation

## When not to use

- The work is only product positioning or scope; use
  [`spec-product`](../spec-product/SKILL.md)
- The work is only flows and route-state behavior; use
  [`spec-ux`](../spec-ux/SKILL.md)
- The work is only UI foundation; use [`spec-ui`](../spec-ui/SKILL.md)

## Grounding reads

Read the current technical truth before asking questions:

- `SPEC.md` and `CONTRACT.md` if they exist
- `nuxt.config.ts`, `wrangler.json`, and server helpers already in the repo
- For Narduk template-based apps:
  - `docs/agents/engineering.md`
  - `docs/agents/operations.md`
  - `layers/narduk-nuxt-layer/server/utils/mutation.ts`
  - `artifacts/starter-export-verify/CONTRACT.md`
- If the app depends on Narduk-hosted auth, previews, or self-hosted services:
  - the companion `narduk-infrastructure` repo `README.md`
  - `narduk-infrastructure/docs/current-state.md`

## What this skill owns

- runtime and deployment target
- D1 versus Postgres or Hyperdrive data backend
- local, managed Supabase, or shared-authority auth model
- upstream authority session versus app-local sealed session
- schema ownership and app-owned extensions
- read, mutation, callback, webhook, and cron contract shape
- bindings, secrets, previews, observability, and external dependencies

## Workflow

1. Detect whether this is `create` or `update`.
2. Ground in runtime and deployment truth before discussing contracts.
3. Lock auth and data ownership before endpoint details.
4. Preserve unchanged technical decisions explicitly on update passes.
5. Call out downstream impact on product, UX, or UI when technical constraints
   limit them.

## Interview rules

- Ask only questions that materially change runtime, auth, data, deploy, or
  contract behavior.
- Separate product intent from technical ownership.
- Do not invent Node-only or framework-external assumptions in Narduk apps.
- If a technical choice is unclear, propose a recommended default and mark it
  as an assumption.

## References

- Intake: [`references/intake.md`](references/intake.md)
- Lock checklist: [`references/lock-checklist.md`](references/lock-checklist.md)
- Artifact map: [`references/artifact-map.md`](references/artifact-map.md)

## Output format

```md
## Snapshot
- Runtime:
- Auth model:
- Data backend:
- Mode: create | update

## Locked Decisions
- ...

## Assumptions
- ...

## Open Questions
- ...

## Artifact Impact
- `SPEC.md`:
- `UI_PLAN.md`:
- `CONTRACT.md`:
```
