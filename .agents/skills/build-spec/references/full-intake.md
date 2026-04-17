# Build Spec Full Intake

Use this when the user wants one consolidated questionnaire. The goal is not to
collect every domain-level detail here. The goal is to identify:

- whether the pass is `create`, `update`, or mixed
- which domains need active work
- which decisions are already locked and should stay unchanged
- which blockers deserve deeper follow-up in the domain skills

Trim the intake to the product in front of you.

## Change framing

- Are we creating a new planning set or updating an existing one?
- Which existing files or decisions should be treated as already locked?
- What changed since the last spec pass?
- Which domains are in play: product, UX, UI, tech?

## Product truth

- What are we building?
- Who is it for?
- What is the primary conversion or success action?
- What is in scope for launch?
- What is explicitly out of scope?
- What would count as launch success?

## UX and route shape

- What public, authenticated, admin, or operator route groups must exist?
- What is the first-visit path?
- What is the primary onboarding or conversion flow?
- What does returning usage look like?
- Which failures, retries, or support escalations materially matter?

## UI foundation

- Is there an existing brand, design system, or app shell we must reuse?
- What should the product feel like visually?
- Which layouts or navigation patterns are expected?
- Which device priorities matter most?
- Is the UI direction already clear enough to skip mockups?

## Technical boundaries

- What auth model applies: local, shared authority, managed Supabase, or other?
- What core entities, integrations, or external systems are required?
- Are live streams, jobs, webhooks, queues, or admin tooling part of launch?
- What deployment, preview, host, or observability constraints are real?
- Are there external Narduk-hosted dependencies that need to be treated as
  fixed constraints?

## Acceptance

- What must be true before the plan can be considered locked?
- Which unresolved items are acceptable assumptions?
- Which unresolved items are true blockers?
