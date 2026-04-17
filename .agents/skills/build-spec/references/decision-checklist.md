# Build Spec Decision Checklist

Use this as the orchestrator lock matrix. Its job is to decide which domain
skills need work, in what order, and when the planning set is ready to lock.

## 1. Product domain

Run [`spec-product`](../../spec-product/SKILL.md) when any of these changed:

- audience, trust, or value proposition
- in-scope / out-of-scope boundaries
- launch success or primary conversion
- route groups or major content model
- discoverability, indexing posture, or domain-sensitive compliance rules

Product should finish with:

- product definition and audience locked
- route groups and content ownership locked
- launch success and phase-2 cuts visible

## 2. UX domain

Run [`spec-ux`](../../spec-ux/SKILL.md) when any of these changed:

- first-visit, onboarding, login, callback, or returning flows
- loading, empty, error, success, or retry behavior
- auth gating or redirect expectations
- accessibility, reduced-motion, or support escalation expectations
- route-state behavior that changes implementation shape

UX should finish with:

- major flows locked
- route-state behavior locked
- accessibility and feedback expectations locked

## 3. UI domain

Run [`spec-ui`](../../spec-ui/SKILL.md) when any of these changed:

- visual direction or brand fit
- theme policy, token strategy, or color-mode expectations
- shell ownership, layout patterns, or navigation framing
- component families or state presentation patterns
- responsive priorities or layout ownership

UI should finish with:

- UI foundation locked
- mockup requirement decided explicitly
- layout ownership clear enough to prevent double-framed pages

## 4. Tech domain

Run [`spec-tech`](../../spec-tech/SKILL.md) when any of these changed:

- runtime or deployment target
- D1 versus Postgres or Hyperdrive assumptions
- auth backend or session ownership
- contract surface, validation, or mutation classification
- preview, secrets, observability, or external Narduk-hosted dependencies

Tech should finish with:

- runtime and data boundaries locked
- auth and session model locked
- contract surface locked or explicitly empty

## 5. Conflict rules

- Product wins on scope, audience, and launch truth.
- UX wins on flow shape, route states, and accessibility behavior.
- UI wins on visual foundation, layout ownership, and component conventions.
- Tech wins on runtime, auth, data, deployment, and contract truth.
- If an upstream domain changes a downstream assumption, rerun the downstream
  domain instead of quietly patching around the conflict.

## 6. Completion test

The planning set is ready to lock when:

- each domain is marked `locked`, `assumed`, `open blocker`, or `unchanged`
- `SPEC.md` can explain the launch scope without follow-up clarification
- `UI_PLAN.md` can guide layout, routes, and states without design guesswork
- `CONTRACT.md` can guide implementation without hidden runtime or validation
  assumptions
- remaining open questions are small enough that they will not change scope,
  IA, UI foundation, runtime, or contract shape
