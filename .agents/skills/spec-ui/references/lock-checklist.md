# Spec UI Lock Checklist

Lock these before marking the UI domain complete:

- visual direction, references, and anti-goals
- design-system reuse versus new direction
- `ui.colors`, semantic token discipline, and color-mode policy
- layout ownership and shell rules
- component and module conventions
- state presentation conventions
- responsive and layout ownership rules
- mockup requirement decided explicitly

Use mockups when all of these are true:

- the spec is UI-heavy
- material visual ambiguity remains after grounding
- the ambiguity would cause implementation drift

Skip mockups when any of these are true:

- the existing design system is already clear
- the change is mostly product or backend
- the repo already has sufficient visual references
