# Spec Tech Lock Checklist

Lock these before marking the tech domain complete:

- runtime and deployment target
- preview and `/api/health` assumptions
- D1 versus Postgres or Hyperdrive choice
- auth backend and session ownership
- schema ownership and extension rules
- read, mutation, callback, webhook, and cron contract shape
- validation, auth, rate limiting, and side-effect expectations
- bindings and secrets policy
- observability and admin-access expectations
- external Narduk-hosted dependencies when relevant

On update passes:

- preserve unchanged technical truth explicitly
- record which contracts or boundaries changed
- call out required reruns in product, UX, or UI when technical constraints
  force them
