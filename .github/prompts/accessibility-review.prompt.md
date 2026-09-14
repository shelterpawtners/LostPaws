# Accessibility Review

Read current `main`, `AGENTS.md`, `docs/AI-CONTROLLER.md`, and the active
Issue/PR. Use only the relevant accessibility/domain guidance.

Perform a bounded accessibility pass on the currently implemented active-phase screens.

Do not redesign product behavior.

Check and fix:

- keyboard navigation
- focus visibility/order
- form labels/descriptions
- error associations
- semantic headings
- dialog/menu semantics
- status communicated by more than color
- contrast using existing design tokens
- responsive text/controls
- QR/camera flows with non-camera fallback
- reduced-motion behavior where animations exist

Run lint, typecheck, relevant tests, and build.

Update progress if an accessibility gate is completed and create a descriptive commit.
