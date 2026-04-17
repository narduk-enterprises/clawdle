# Build Spec Artifact Map

Use this reference when turning the four domain outputs into the three planning
files. Keep each decision in one home instead of duplicating it everywhere.

## Lock order

1. `SPEC.md`
2. `UI_PLAN.md`
3. `CONTRACT.md`

If `SPEC.md` is still vague, do not pretend the later files are ready.

## Domain-to-artifact map

- `spec-product`
  Primary home: `SPEC.md`
  Secondary home: `UI_PLAN.md` only when route groups need naming context
- `spec-ux`
  Primary home: `SPEC.md` for major flows
  Secondary home: `UI_PLAN.md` for route and state behavior
- `spec-ui`
  Primary home: `UI_PLAN.md`
  Secondary home: `SPEC.md` only for high-level design constraints that affect
  scope
- `spec-tech`
  Primary home: `CONTRACT.md`
  Secondary home: `SPEC.md` for runtime, auth, data, and deployment
  boundaries

## What belongs in `SPEC.md`

`SPEC.md` is product truth. It should answer:

- What are we building?
- Who is it for?
- What is in scope at launch?
- What is explicitly out of scope?
- What are the primary user flows?
- What conceptual entities exist?
- What pages or route groups must exist?
- What non-functional constraints matter?
- What test acceptance criteria define MVP?

Good `SPEC.md` material:

- Audience definition
- Value proposition
- Primary conversion event
- Route list at a product level
- Major UX flows at a product level
- Runtime architecture boundaries such as external auth authority, queue or
  backlog choice, live versus historical data split, storage roles, runtime
  target, and data backend
- Content ownership and launch dependencies
- Trust, legal, or domain disclaimers
- Success criteria and phase-2 cuts

Do not overload `SPEC.md` with endpoint-level API details or route-by-route UI
component notes.

When the runtime topology becomes concrete enough to name real services,
hostnames, or storage locations, create or update a supporting
`docs/architecture.md` and link it from `SPEC.md` or `README.md` instead of
letting those details live only in chat.

## What belongs in `UI_PLAN.md`

`UI_PLAN.md` turns the product into a concrete surface map. It should have two
layers:

1. `UI Foundation Lock`
2. `Route and State Map`

The `UI Foundation Lock` is the home for:

- visual direction, references, and anti-goals
- theme policy and token discipline
- layout ownership and shell rules
- component and module conventions
- responsive, motion, and accessibility presentation rules
- `Visual References / Mockups` when mockups were generated

For each route or route group in the `Route and State Map`, capture:

- Purpose of the route
- Primary components or sections
- Required CTAs
- Loading state
- Empty state
- Error state
- Auth or role gating
- SEO or schema notes if the route has special requirements

Good `UI_PLAN.md` material:

- UI foundation lock
- visual references or mockups when required
- sitemap
- navigation and footer decisions
- shared layout decisions
- reusable modules
- route-specific states

Do not turn `UI_PLAN.md` into a design system manifesto. Keep it tied to
routes, user outcomes, and the minimum UI foundation needed to implement them.

## What belongs in `CONTRACT.md`

`CONTRACT.md` captures system behavior that the UI depends on.

Document:

- Endpoint or action name
- Method and path
- Who can call it
- Request payload
- Response shape
- Validation expectations
- Error cases
- Side effects or integrations
- Session exchange and auth callback behavior when relevant

Include:

- Lead capture submissions
- Read endpoints that materially shape the UI
- Contact forms
- Auth callbacks
- Admin mutations
- Webhooks
- Cron
- Search endpoints
- Analytics events that need explicit implementation

If the site truly has no custom server behavior, state that explicitly
instead of leaving the file blank.

## Completion test

The planning set is ready to lock when:

- Another engineer can explain the launch scope without asking basic
  clarification questions
- A designer can map every required route, state, and UI foundation rule
- An implementer knows which APIs, forms, auth flows, and integrations must
  exist
- Deferred work is visible and intentional
- The remaining open questions are small enough that they will not change
  architecture, IA, UI foundation, or contract behavior
