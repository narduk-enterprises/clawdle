---
name: nuxt-layers
description: Use when creating, extending, or debugging Nuxt 4 layers. Covers local `layers/` auto-registration, `nuxt.config.ts` `extends`, named `#layers/*` aliases, override priority, and choosing between project-local layers and external layer packages or repos.
license: MIT
---

# Nuxt Layers

## Overview

Use this skill when the task is about Nuxt layer composition rather than normal app feature work. It helps decide whether code should live in the app, a local `layers/` directory, or an external layer referenced with `extends`, and it explains the override order when multiple layers define the same files.

## Use This Skill When

- adding or reorganizing a local Nuxt layer under `layers/`
- editing `nuxt.config.ts` `extends`
- publishing or consuming a reusable theme, preset, or shared app surface as a layer
- debugging why one layer's component, composable, config, or page overrides another
- splitting a large Nuxt app into base, theme, feature, or admin layers

## Quick Workflow

1. Decide the layer source:
   - Use `~/layers` when the layer belongs to the current repository.
   - Use `extends` when the layer lives outside the repo, in npm, or in a remote git source.
2. Check priority before changing code:
   - The project wins over every layer.
   - Auto-registered local layers win over `extends` layers.
   - Among local layers, later alphabetical names have higher priority.
   - In `extends`, earlier entries have higher priority than later ones.
3. Make local priority explicit:
   - Use folder names such as `layers/01-base`, `layers/02-theme`, `layers/03-admin` when order matters.
4. Use layer aliases intentionally:
   - Local layers expose `#layers/<layer-name>` aliases from their `srcDir`.
5. Read [references/nuxt-layers.md](references/nuxt-layers.md) when you need the official Nuxt 4 layer rules and examples.

## Guardrails

- Prefer layers for reusable structure, shared UI, shared config, or cross-app capabilities, not one-off app logic.
- Do not assume `extends` order behaves like a normal merge stack; the first `extends` entry has the strongest priority.
- Do not forget that auto-scanned local layers outrank `extends` layers.
- Keep layer names intentional so override order is visible from the directory list.
- When debugging, inspect both layer order and the exact file path being overridden before patching code.

## Quick Examples

```ts
export default defineNuxtConfig({
  extends: ['../base', '@acme/theme'],
})
```

In this example, `../base` has higher priority than `@acme/theme` because it appears first.

```text
layers/
  01-base/
  02-theme/
  03-admin/
```

In this example, `03-admin` can override files from `02-theme`, and `02-theme` can override `01-base`.

## Related Skills

- Use `nuxt` for general Nuxt 4 app, routing, server, and config guidance.
- Use `nuxt-modules` when the task is about published Nuxt modules rather than layers.
- Use `vue-best-practices` and `vue` for component internals inside a layer.
