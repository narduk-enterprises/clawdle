---
name: spec-product
description: >-
  Lock or update the product-truth slice of a whole-product spec: audience,
  value proposition, scope, route groups, content ownership, trust,
  discoverability, and launch success. Use when build-spec needs product
  decisions resolved or when an existing SPEC.md needs a product-only revision.
---

# Spec Product

Use this skill to create or update the product lock for a whole-product plan.
This skill owns the truth that should live primarily in `SPEC.md`.

## When to use

- `build-spec` identified product drift or missing product truth
- `SPEC.md` is thin, contradictory, or stale
- The user is changing audience, scope, route groups, positioning, or launch
  success

## When not to use

- The work is only a UI polish pass; use [`spec-ui`](../spec-ui/SKILL.md)
- The work is only flow and state behavior; use
  [`spec-ux`](../spec-ux/SKILL.md)
- The work is only runtime, contract, or data boundary planning; use
  [`spec-tech`](../spec-tech/SKILL.md)

## Grounding reads

Read the current product truth before asking questions:

- `SPEC.md` if it exists
- repo `README.md` and any provision metadata if present
- For Narduk template-based apps:
  - `artifacts/starter-export-verify/SPEC.md`
  - `apps/web/nuxt.config.ts`

If runtime or infra constraints may limit scope, wait for
[`spec-tech`](../spec-tech/SKILL.md) to confirm those boundaries instead of
guessing.

## What this skill owns

- product definition and positioning
- audience, trust, and domain-sensitive constraints
- primary conversion and launch success
- in-scope and out-of-scope boundaries
- route groups and content ownership
- SEO and indexing posture at a product level

## Workflow

1. Detect whether this is `create` or `update`.
2. Lock product truth first; do not debate implementation details here.
3. Preserve unchanged product decisions explicitly on update passes.
4. Push for explicit scope cuts, trust constraints, and launch criteria.
5. Call out downstream impact on UX, UI, or tech when product changes force it.

## Interview rules

- Ask only product questions that materially change scope or positioning.
- If the user is vague, propose a recommended default and mark it as an
  assumption.
- Separate audience and trust decisions from UI style preferences.
- If the product operates in a sensitive domain, surface claims, disclaimers,
  moderation, or legal copy needs early.

## References

- Intake: [`references/intake.md`](references/intake.md)
- Lock checklist: [`references/lock-checklist.md`](references/lock-checklist.md)
- Artifact map: [`references/artifact-map.md`](references/artifact-map.md)

## Output format

```md
## Snapshot
- Product:
- Audience:
- Primary conversion:
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
