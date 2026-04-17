---
name: build-spec
description: >-
  Orchestrate the product, UX, UI, and technical lock decisions required to
  create or update SPEC.md, UI_PLAN.md, and CONTRACT.md before design or
  implementation. Use when planning a new site or app, updating an existing
  spec, revising a UI plan, or re-locking runtime and contract assumptions.
  Triggers on "build spec", "write the spec", "update spec", "revise UI plan",
  "re-lock tech plan", "scope this site", "new site planning", "discovery",
  "requirements", and "lock the spec". Defaults to a silent full-intake
  questionnaire, then follows up only on true blockers.
---

# Build Spec

Use this skill as the orchestrator for whole-product planning. The goal is not
to answer every domain question directly. The goal is to ground in repo and
platform truth, run the right domain lock passes, resolve conflicts, and leave
behind a decision-complete planning set.

## When to use

- A new site, app, landing page, or marketing surface is being planned
- Existing `SPEC.md`, `UI_PLAN.md`, or `CONTRACT.md` drifted and need a
  controlled update pass
- The user wants help figuring out which decisions still need to be locked
- Scope is drifting because routes, flows, design, runtime, or contract rules
  are unclear
- If the work is only a scoped feature inside an existing product, prefer
  [`build-feature`](../build-feature/SKILL.md) instead

## When not to use

- A narrow bugfix, refactor, or implementation task that does not change
  product truth
- A single feature inside an already locked product surface; use
  [`build-feature`](../build-feature/SKILL.md)
- Deep brand exploration or visual experimentation with no intent to lock the
  result into `UI_PLAN.md`

## What good looks like

By the end of the workflow:

- `SPEC.md` carries product truth, high-level flows, trust, scope, and major
  technical boundaries clearly
- `UI_PLAN.md` carries UI foundation, visual references or mockups when needed,
  layouts, routes, and state behavior
- `CONTRACT.md` captures required reads, mutations, callbacks, webhooks, cron,
  validation, auth, and side effects, or explicitly says none
- Each domain ends the pass with a visible status: `locked`, `assumed`,
  `open blocker`, or `unchanged`
- Open questions are isolated instead of leaking into implementation

## Domain order

Run domain passes in this order:

1. [`spec-product`](../spec-product/SKILL.md)
2. [`spec-ux`](../spec-ux/SKILL.md)
3. [`spec-ui`](../spec-ui/SKILL.md)
4. [`spec-tech`](../spec-tech/SKILL.md)

Each domain should emit the same internal shape:

- `Snapshot`
- `Locked Decisions`
- `Assumptions`
- `Open Questions`
- `Artifact Impact`

## Workflow

1. Start with a one-screen summary of the product or change request.
2. Ground in the repo, current planning files, template docs, and infra docs
   before asking questions.
3. Decide whether this is a `create` pass, an `update` pass, or a mixed pass.
4. Use the master intake in [`full-intake.md`](references/full-intake.md) to
   determine which domains need active work.
5. Run the active domain passes in order and keep the others explicitly marked
   `unchanged`.
6. Resolve cross-domain conflicts:
   - product owns scope, audience, and launch success
   - UX owns flows, route-state behavior, and accessibility commitments
   - UI owns visual foundation, layout ownership, and component patterns
   - tech owns runtime, auth, data, contract, and deployment truth
7. Synthesize the domain outputs into:
   - `SPEC.md`
   - `UI_PLAN.md`
   - `CONTRACT.md`
8. End the pass with domain status plus:
   - locked decisions
   - assumptions to confirm
   - open blockers only

## Questioning mode

Default behavior:

- silently use an all-at-once intake
- do not ask the user which questioning mode they want
- avoid many tiny rounds when one coherent questionnaire will do
- follow up only on unresolved blockers

Override behavior:

- if the user explicitly asks for one-by-one questions, do that
- if the user explicitly asks for batched questions, do that
- if the product surface is too broad for one clean intake, split the intake
  into a few larger grouped batches rather than many small rounds

## Intake design

The master intake should identify:

- whether this is a new plan or an update to an existing locked plan
- which domains changed: product, UX, UI, tech
- which decisions are already locked and should remain unchanged
- which blockers would materially change scope, IA, design, runtime, or
  contract behavior

Use [`full-intake.md`](references/full-intake.md) for the master intake, then
delegate domain-specific detail to the subskills rather than bloating the
orchestrator.

## Interview rules

- Default to one complete questionnaire instead of many small batches.
- After the master intake, only ask follow-up questions that materially change
  the product, route model, UI foundation, architecture, or contract.
- Prefer high-leverage questions that collapse multiple downstream decisions.
- If the user gives vague answers, propose a recommended default and record it
  as an assumption in the affected domain.
- Do not let one domain silently overwrite another. Re-run downstream domains
  when upstream changes invalidate them.

## Repo-specific guardrails

- Lock files in this order: `SPEC.md`, then `UI_PLAN.md`, then `CONTRACT.md`.
- If a file is marked `LOCKED` but the user explicitly wants to revisit it,
  reopen it intentionally and record the new status instead of editing around
  the lock silently.
- Ground in repo truth first:
  current planning files, app config, layer/layout rules, runtime config, and
  preview or deployment contracts.
- For Narduk template-based apps, read the workspace and engineering docs,
  starter verification artifacts, and layer layout guidance before deciding
  what needs to be locked.
- If Narduk-hosted auth, previews, or self-hosted services matter, read the
  current-state infra runbook before locking external dependencies.
- Every page still needs `useSeo(...)` and a Schema.org helper; capture page
  intent and metadata expectations during planning.
- Mutations must use shared wrappers and validated bodies; capture that reality
  in `CONTRACT.md`.
- Downstream apps run on Cloudflare Workers and Drizzle ORM. Do not spec
  Node-only server assumptions.
- Reuse existing layer, auth, data, SEO, and UI primitives before inventing
  new ones.
- `spec-ui` may use `imagegen` only when mockups reduce material ambiguity.
  Mockups are concept references, not production assets.

## References

- Orchestrator intake: [`full-intake.md`](references/full-intake.md)
- Domain routing and completion test:
  [`decision-checklist.md`](references/decision-checklist.md)
- Artifact synthesis: [`artifact-map.md`](references/artifact-map.md)
- Product locks: [`spec-product`](../spec-product/SKILL.md)
- UX locks: [`spec-ux`](../spec-ux/SKILL.md)
- UI locks: [`spec-ui`](../spec-ui/SKILL.md)
- Tech locks: [`spec-tech`](../spec-tech/SKILL.md)

## Output format

Use this shape during the conversation:

```md
## Snapshot
- Product:
- Mode: create | update | mixed
- Domains in play:
- Recommended scope cut:

## Domain Status
- Product: locked | assumed | open blocker | unchanged
- UX: locked | assumed | open blocker | unchanged
- UI: locked | assumed | open blocker | unchanged
- Tech: locked | assumed | open blocker | unchanged

## Locked Decisions
- ...

## Assumptions To Confirm
- ...

## Open Questions
- ...

## Next Questions
1. ...
2. ...

## Artifact Plan
- `SPEC.md`:
- `UI_PLAN.md`:
- `CONTRACT.md`:
```

When the user is ready, convert the decisions into the three planning files
and remove `DRAFT` only when blockers are resolved or explicitly accepted.
