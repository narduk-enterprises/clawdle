---
name: spec-ux
description: >-
  Lock or update the UX slice of a whole-product spec: primary flows,
  route-state behavior, auth gating, accessibility commitments, support
  escalation, and feedback clarity. Use when build-spec needs flow or state
  decisions resolved or when an existing UI plan needs UX re-locking.
---

# Spec UX

Use this skill to create or update the UX lock for a whole-product plan. This
skill owns flows and route-state behavior that materially change implementation
shape.

## When to use

- `build-spec` identified flow, state, or accessibility drift
- Login, onboarding, callback, or returning-user behavior changed
- `UI_PLAN.md` is missing route-state behavior

## When not to use

- The work is only visual direction or theme; use
  [`spec-ui`](../spec-ui/SKILL.md)
- The work is only audience, positioning, or scope; use
  [`spec-product`](../spec-product/SKILL.md)
- The work is only runtime or contract planning; use
  [`spec-tech`](../spec-tech/SKILL.md)

## Grounding reads

Read the current flow truth before asking questions:

- `SPEC.md` and `UI_PLAN.md` if they exist
- Any auth or callback routes already present in the repo
- For Narduk template-based apps:
  - `artifacts/starter-export-verify/UI_PLAN.md`
  - `docs/agents/recipes.md` for auth and form patterns
  - `docs/agents/engineering.md` for layout and accessibility guardrails

## What this skill owns

- first-visit, onboarding, login, callback, and returning-user flows
- loading, empty, error, success, disabled, and retry behavior
- auth-protected route behavior and redirect expectations
- accessibility, reduced-motion, and feedback clarity commitments
- support or escalation paths that matter to the product

## Workflow

1. Detect whether this is `create` or `update`.
2. Lock the major flows first, then the route-state behavior they require.
3. Preserve unchanged flows explicitly on update passes.
4. Keep accessibility and motion decisions tied to real flows, not generic
   checklists.
5. Call out downstream impact on UI or tech when UX changes force it.

## Interview rules

- Ask only questions that materially change user flow, route-state behavior, or
  accessibility expectations.
- If a state is vague, propose a default behavior and mark it as an assumption.
- Separate user-flow decisions from visual-style preferences.
- If auth is external, separate upstream authority behavior from the app-local
  session experience.

## References

- Intake: [`references/intake.md`](references/intake.md)
- Lock checklist: [`references/lock-checklist.md`](references/lock-checklist.md)
- Artifact map: [`references/artifact-map.md`](references/artifact-map.md)

## Output format

```md
## Snapshot
- Flow set:
- Entry points:
- Critical states:
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
