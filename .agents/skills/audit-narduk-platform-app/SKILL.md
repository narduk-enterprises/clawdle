---
name: audit-narduk-platform-app
description: Review-first audit workflow for Narduk platform Nuxt apps that use the shared template layer, Nuxt UI, Vue 3, Cloudflare Workers, and spec-driven delivery. Use when Codex needs to audit a fleet app for shared-layer or template drift, guardrail or validation failures, Nuxt 4 or Vue best-practice regressions, SSR or security issues, `SPEC.md`/`UI_PLAN.md`/`CONTRACT.md` alignment, or to prepare a findings-first PR review with a concrete remediation plan.
---

# Audit Narduk Platform App

Use this skill to audit a Narduk fleet app before proposing fixes. Gather repo
truth, run the available machine checks first, then report findings with a
concrete remediation plan. Do not duplicate generic Nuxt or Vue guidance here;
load the upstream skills only when the audit needs them.

## Trigger Examples

Use this skill for requests like:

- "Audit this Narduk platform app."
- "Check this fleet app for template drift."
- "Review this Nuxt app against our shared layer and guardrails."
- "Prepare a findings-first PR review for this Narduk app."

## First Reads

Read these files in order:

1. [references/audit-workflow.md](references/audit-workflow.md)
2. [references/narduk-platform-conventions.md](references/narduk-platform-conventions.md)
3. [references/remediation-and-escalation.md](references/remediation-and-escalation.md) when turning findings into fixes or deciding whether an issue belongs upstream

Load upstream skills only when needed:

- Nuxt 4 app guidance:
  `/Users/narduk/.agents/skills/nuxt/SKILL.md`
- Broad Nuxt API reference when the agent needs a deeper Nuxt topic not covered
  above:
  `/Users/narduk/.codex/skills/nuxt/SKILL.md`
- Nuxt 4 SSR, route rules, hydration, and data-fetching review:
  `/Users/narduk/.agents/skills/nuxt-patterns/SKILL.md`
- Nuxt UI review:
  `/Users/narduk/.agents/skills/nuxt-ui/SKILL.md`
- Nuxt layer precedence and override behavior:
  `/Users/narduk/.agents/skills/nuxt-layers/SKILL.md`
- Vue component and composable guidance:
  `/Users/narduk/.agents/skills/vue-best-practices/SKILL.md`
  `/Users/narduk/.agents/skills/vue/SKILL.md`
- VueUse composable checks:
  `/Users/narduk/.agents/skills/vueuse/SKILL.md`

## Workflow

### 1. Confirm the repo fits this skill

Look for several of these signals before continuing:

- Nuxt app under `apps/web` or an equivalent app package
- `nuxt.config.ts` extending
  `@narduk-enterprises/narduk-nuxt-template-layer*`
- `SPEC.md`, `UI_PLAN.md`, and `CONTRACT.md`
- Cloudflare, D1, Drizzle, or Narduk platform scripts/config
- Repo or app commands such as `guardrails:repo`, `validate`, `lint`,
  `typecheck`, or `quality:check`

If the repo only partially matches, continue with explicit assumptions instead
of failing early.

### 2. Ground the repo before judging it

Inspect the current app surface before making claims:

- root `package.json`
- app `package.json`
- `apps/web/nuxt.config.ts`
- `apps/web/app/app.config.ts`
- app ESLint config and any app-owned overrides
- `tools/check-guardrails.ts`, `tools/guardrails/*`, or equivalent repo checks
- `docs/agents/engineering.md` when present
- `SPEC.md`, `UI_PLAN.md`, and `CONTRACT.md`

Detect which checks exist before running them. Prefer narrow, non-mutating
validation over broad fixers.

### 3. Run machine checks first

Run the available read-only or non-mutating checks before the manual review.
Prefer the narrowest commands that still prove the point.

Typical order:

1. `pnpm run guardrails:repo`
2. app `lint`
3. app `typecheck`
4. relevant `test:unit`
5. repo or app `validate` if it exists and the environment is available

Treat missing dependencies, absent external layers, or unavailable provisioning
as findings or validation gaps, not silent blockers.

### 4. Review in this priority order

1. Layer and template drift
2. Security and SSR safety
3. Data-fetching and store patterns
4. Nuxt UI and framework API misuse
5. SEO, schema, and spec alignment
6. Validation gaps and missing automation

Use the references in this skill for Narduk-specific expectations. Use the
upstream Nuxt or Vue skills only for the generic framework rule behind a
finding.

### 5. Return findings in a fixed format

Always structure the response in this order:

1. `Stack Detection and Assumptions`
2. `Machine Checks`
3. `Findings`
4. `Remediation Plan`
5. `Skill Gap Notes`

Rules for the output:

- Put findings before any summary.
- Order findings by severity.
- Cite concrete files and commands.
- Name the key files inspected in `Stack Detection and Assumptions`,
  especially `nuxt.config.ts`, `app.config.ts`, and the spec artifacts when
  they exist.
- Separate observed repo facts from framework inference.
- If no findings are discovered, say that explicitly and call out residual risk
  or checks you could not run.

### 6. Default to review-first behavior

This skill is audit-plus-plan by default. Do not edit code unless the user
explicitly asks for implementation after the audit. When asked to fix issues
later, reuse the findings and remediation plan from this audit instead of
restarting from scratch.

## When To Add Narduk-Specific Guidance Back Into This Skill

Add new guidance here only when all of these are true:

- the rule or workflow is specific to Narduk platform apps
- it shows up repeatedly across audits
- the upstream Nuxt or Vue skills do not already cover it well
- recording it here will make the next audit materially better

Good additions:

- shared-layer ownership boundaries
- repo guardrail command order
- fleet-specific CSRF, mutation, or store expectations
- spec-to-code alignment rules unique to Narduk apps
- escalation rules for upstream template or layer defects

Do not copy generic Nuxt, Vue, or Nuxt UI documentation into this skill.
