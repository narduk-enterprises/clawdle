# Remediation And Escalation

Use this file after the audit evidence is gathered. The goal is to turn
findings into the smallest correct fix plan and to recognize when a defect
belongs upstream.

## Build The Remediation Plan

For each finding, provide:

- the concrete file or command evidence
- the local rule, convention, or spec it violates
- the smallest safe fix direction
- the exact validation command to rerun after the fix

Prefer behavior-level fixes over cosmetic cleanup.

## Common Finding Classes

### Layer Or Template Drift

Typical signals:

- local files duplicate shared-layer behavior
- app config overrides are compensating for upstream bugs
- synced or generated files have diverged

Fix direction:

- move app-specific changes into app-owned config or routes
- avoid patching shared behavior locally unless the repo intentionally owns the
  override
- if the bug likely affects multiple apps, escalate it upstream

### Guardrail And Plugin Violations

Typical signals:

- custom ESLint rule failures
- repo guardrail audit failures
- stale suppressions or exceptions

Fix direction:

- cite the specific rule id
- fix the source pattern instead of adding a new suppression
- if a suppression is still necessary, explain why the local exception is real

### Spec Drift

Typical signals:

- page behavior contradicts `UI_PLAN.md`
- API behavior contradicts `CONTRACT.md`
- the implementation no longer matches `SPEC.md`

Fix direction:

- identify whether the code or the doc is the stale source of truth
- when product behavior changed intentionally, update the docs first or in the
  same change
- when behavior drift is accidental, fix the code to match the locked docs

### Validation Gaps

Typical signals:

- repo declares important checks but they are not run in normal review flow
- missing or broken commands prevent confidence in the audit
- external dependencies or provisioning are required but undocumented

Fix direction:

- recommend the missing command or documentation change
- separate "could not run" from "failed"
- do not present skipped validation as a pass

## When To Escalate Upstream

Escalate when the problem is likely not app-local:

- defect is in the shared template layer
- defect is in shared ESLint or guardrail tooling
- defect likely affects multiple fleet apps
- fix requires provisioner or platform-host behavior to change

Useful adjacent skills:

- upstream template issues:
  `/Users/narduk/.agents/skills/narduk-template-issues/SKILL.md`
- platform host or preview operations:
  `/Users/narduk/.agents/skills/narduk-platform-quick-reference/SKILL.md`

## Skill Gap Notes

Use `Skill Gap Notes` sparingly. Add a note only when:

- the gap is Narduk-specific
- it showed up during the audit
- the upstream framework skills did not cover it well
- capturing it here would improve future audits

Do not use this section for generic Nuxt or Vue guidance.
