# Audit Workflow

Use this file to drive the audit in a consistent order. The goal is to replace
guesswork with repo evidence.

## 1. Detect the app surface

Start by locating the smallest set of files that define the stack:

- root `package.json`
- app package such as `apps/web/package.json`
- `apps/web/nuxt.config.ts`
- `apps/web/app/app.config.ts`
- app ESLint config
- `SPEC.md`, `UI_PLAN.md`, `CONTRACT.md`
- `tools/check-guardrails.ts` and `tools/guardrails/*` when present

Useful discovery commands:

```bash
rg --files -g 'package.json' -g 'nuxt.config.*' -g 'app.config.*' -g 'eslint*.mjs' -g 'SPEC.md' -g 'UI_PLAN.md' -g 'CONTRACT.md'
rg -n "guardrails:repo|quality:check|validate|typecheck|test:unit|test:e2e" package.json apps/**/package.json
```

## 2. Confirm Narduk-specific traits

Look for several of these signals:

- shared layer in `extends`, typically
  `@narduk-enterprises/narduk-nuxt-template-layer-core`
- app-owned `app.config.ts` and `nuxt.config.ts`
- custom repo guardrails
- custom ESLint plugins for Nuxt, Nuxt UI, or Vue best practices
- Cloudflare, D1, Drizzle, or platform validation scripts

If only some are present, keep going and state the assumptions.

## 3. Discover commands before running them

Audit commands must be discovered from the repo instead of assumed. Prefer the
narrowest commands that exist.

Priority order:

1. `pnpm run guardrails:repo`
2. app `lint`
3. app `typecheck`
4. app `test:unit`
5. repo or app `validate`

If there are only broader monorepo commands, note the tradeoff and run the
least expensive command that still validates the audit claim.

## 4. Run checks first

Run machine checks before manual review so the audit begins with hard signals.

Typical examples:

```bash
pnpm run guardrails:repo
pnpm --filter web lint
pnpm --filter web typecheck
pnpm --filter web test:unit
pnpm run validate
```

Rules:

- Do not run `--fix` commands during the audit.
- If provisioning or dependencies are missing, record that as a validation gap.
- If an external layer package is missing, note the limitation and continue with
  the local repo evidence.

## 5. Perform the manual review passes

Review in this order:

1. Layer or template drift
2. Security and SSR safety
3. Data-fetching and store behavior
4. Nuxt UI or framework API misuse
5. SEO, schema, and spec alignment
6. Validation coverage gaps

For each finding, capture:

- the file or command evidence
- the behavior or risk
- the relevant local convention or rule id
- the recommended fix direction

## 6. Produce the fixed output contract

Return the audit in exactly these sections:

1. `Stack Detection and Assumptions`
2. `Machine Checks`
3. `Findings`
4. `Remediation Plan`
5. `Skill Gap Notes`

In `Stack Detection and Assumptions`, explicitly name the core files inspected,
including `nuxt.config.ts`, `app.config.ts`, and `SPEC.md` / `UI_PLAN.md` /
`CONTRACT.md` when they exist.

Inside `Findings`, keep the structure findings-first:

- severity
- file or command reference
- issue
- why it matters
- recommended change

If there are no findings, say that directly and list the remaining risks or
skipped checks.
