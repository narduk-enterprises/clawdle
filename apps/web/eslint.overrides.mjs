// Necessary: the Nuxt UI rule normalizes tag names to PascalCase, so native <ul> becomes "UL"
// and is flagged as an unknown component. additionalComponents allows this false positive.
export default [
  {
    files: ['**/*.vue'],
    rules: { 'narduk/no-unknown-nuxt-ui-component': ['error', { additionalComponents: ['UL'] }] },
  },
]
