---
name: spec-ui
description: >-
  Lock or update the UI foundation slice of a whole-product spec: visual
  direction, theme policy, layout ownership, component patterns, state
  presentation, and responsive behavior. Use when build-spec needs UI
  foundation decisions resolved or when an existing UI plan needs a visual or
  layout re-lock.
---

# Spec UI

Use this skill to create or update the UI foundation lock for a whole-product
plan. This skill owns the minimum visual and layout truth needed to implement
routes consistently.

## When to use

- `build-spec` identified UI foundation drift or ambiguity
- The product needs theme, layout, or component-pattern decisions locked
- `UI_PLAN.md` is missing visual references, shell ownership, or state
  presentation rules

## When not to use

- The work is only audience, scope, or positioning; use
  [`spec-product`](../spec-product/SKILL.md)
- The work is only flow logic or accessibility behavior; use
  [`spec-ux`](../spec-ux/SKILL.md)
- The work is only runtime or contract planning; use
  [`spec-tech`](../spec-tech/SKILL.md)

## Grounding reads

Read the current UI truth before asking questions:

- `UI_PLAN.md` if it exists
- app-owned `app.config.ts` and layout files if they exist
- For Narduk template-based apps:
  - `docs/agents/workspace.md`
  - `docs/agents/engineering.md`
  - `layers/narduk-nuxt-layer/AGENTS.md`
  - `artifacts/starter-export-verify/UI_PLAN.md`
  - `tools/audit-fleet-themes.ts` when auditing an existing app's theme drift

## What this skill owns

- visual direction, references, and anti-goals
- theme policy: `ui.colors`, semantic tokens, color mode, contrast discipline
- layout ownership: landing, app, auth, blank, dashboard, admin, and
  `fullBleed` expectations
- component and module conventions for forms, cards, tables, lists, charts,
  modals, and CTAs
- state presentation for loading, empty, error, success, disabled, retry, and
  skeleton behavior
- responsive and layout ownership rules that prevent double framing

## Mockup rules

- If visual direction, layout ownership, or theme is still materially ambiguous
  after discovery, use [`imagegen`](/Users/narduk/.codex/skills/.system/imagegen/SKILL.md)
  to create concept references.
- Only require mockups for UI-heavy specs when they reduce real ambiguity.
- Skip mockups when an existing design system or established app shell already
  makes the answer clear.
- Save selected mockups under `artifacts/spec-mockups/<slug>/`.
- Record selected image paths and short prompt summaries under
  `Visual References / Mockups` in `UI_PLAN.md`.
- Generated mockups are concept references, not production assets.

If the work turns into open-ended brand or art-direction exploration, hand off
to a design-focused skill such as
[`generate-brand-identity`](../generate-brand-identity/SKILL.md) or
[`ui-ux-pro-max`](../ui-ux-pro-max/SKILL.md), then summarize the outcome back
into `UI_PLAN.md`.

## Workflow

1. Detect whether this is `create` or `update`.
2. Lock reuse of existing design systems before inventing new ones.
3. Lock the UI foundation before route-by-route UI details.
4. Decide explicitly whether mockups are required, skipped, or already
   satisfied by existing references.
5. Call out downstream impact on UX or tech when UI decisions force it.

## Interview rules

- Ask only questions that materially change UI foundation or layout ownership.
- Separate visual direction from product positioning and flow logic.
- Prefer semantic UI rules over one-off component styling notes.
- If a visual direction is vague, propose a recommended default and record it
  as an assumption.

## References

- Intake: [`references/intake.md`](references/intake.md)
- Lock checklist: [`references/lock-checklist.md`](references/lock-checklist.md)
- Artifact map: [`references/artifact-map.md`](references/artifact-map.md)

## Output format

```md
## Snapshot
- Surface:
- UI mode: create | update
- Existing system to reuse:
- Mockup requirement: required | skipped | already satisfied

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
