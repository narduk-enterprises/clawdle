# Nuxt 4 Layers Reference

Source: [Nuxt docs, Getting Started > Layers](https://nuxt.com/docs/4.x/getting-started/layers)

Use this reference when you need the official Nuxt layer model while creating or debugging a layer.

## What Layers Are For

Nuxt layers let one app extend another app-shaped code surface. They are useful for:

- shared design systems or branded themes
- reusable app scaffolds and presets
- splitting a large app into base and specialized surfaces
- sharing Nuxt code across repositories without copy-paste

## Choosing a Layer Source

### Local project layers

Use a `layers/` directory inside the project when the reusable code belongs to the same repository.

```text
app/
layers/
  01-base/
  02-theme/
nuxt.config.ts
```

Nuxt auto-registers these layers.

- Auto-registration exists in modern Nuxt and is documented as available from Nuxt `v3.12.0`.
- Named aliases such as `#layers/theme` are documented as available from Nuxt `v3.16.0`.

### External or out-of-tree layers

Use `extends` in `nuxt.config.ts` when the layer:

- lives in another local path
- is published as an npm package
- is pulled from a remote git source

```ts
export default defineNuxtConfig({
  extends: ['../base', '@acme/theme'],
})
```

For remote git layers, the docs also show:

- private GitHub auth via `['github:owner/repo', { auth: process.env.GITHUB_TOKEN }]`
- alias metadata overrides via `meta.name`

Nuxt documents remote layer resolution through `unjs/c12` and `unjs/giget`.

## Priority Rules

From highest priority to lowest priority:

1. The current project
2. Auto-registered local layers under `~/layers`
3. Layers listed in `extends`

Within those groups:

- Local `~/layers` are resolved in reverse alphabetical order, so later names win.
- `extends` entries are resolved from first to last, so earlier entries win.

This means folder naming matters for local layers. Numeric prefixes make the order obvious.

```text
layers/
  01-base/
  02-theme/
  03-admin/
```

## Aliases for Local Layers

Local auto-registered layers expose named aliases derived from the layer folder name.

Examples:

- `layers/theme` -> `#layers/theme`
- `layers/01-base` -> `#layers/01-base`

Use these aliases when you need to import directly from a local layer's `srcDir`.

## Practical Decision Rules

- Use `layers/` for repo-local composition.
- Use `extends` for versioned reuse across repositories.
- Put the most generic defaults in the lowest-priority layer.
- Put the most specialized overrides in the highest-priority layer.
- Override only the files that need to differ instead of copying large directory trees.

## Debugging Checklist

When a layer override behaves unexpectedly:

1. Check whether the file exists in the app itself. App files win.
2. Check whether the conflicting layer came from `layers/` or `extends`.
3. Check local layer folder names. Reverse alphabetical order controls priority.
4. Check `extends` order. The first entry has higher priority than the second.
5. Confirm you are editing the actual overridden file path, not a similarly named file elsewhere.

## Scope Note

This reference is intentionally narrow and tracks the official Nuxt layers getting-started guidance. For deeper package publishing, authoring conventions, or advanced Nuxt architecture, combine this skill with the general `nuxt` or `nuxt-modules` skills and re-check the latest Nuxt docs when behavior is version-sensitive.
