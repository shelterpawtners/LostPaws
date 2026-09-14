# Historical prompts

This directory retains prior implementation prompts as traceable execution
evidence. They are **not** current work instructions.

## Use today

Start with current GitHub `main`, `AGENTS.md`, `docs/AI-CONTROLLER.md`, and the
active GitHub Issue/PR. Read `docs/engineering/AI-RELEASE-STATE.md` only when a
completion or workflow contract requires machine state.

`CHATGPT-SESSION-BOOTSTRAP.md` is the sole retained reusable session adapter;
it follows the current authority chain. Every other prompt in this directory is
historical and must not be executed without a newer active Issue/PR explicitly
adopting it.

## Disposition

- Phase 2 checkpoint, QA, and automation prompts: retained historical evidence;
  Phase 2 is complete.
- Guardian/partner/admin blocker prompts: retained evidence of resolved or
  superseded work; do not restart their named branches.
- Dated overnight and Vercel sprint briefs: retained planning evidence;
  their deployment and ownership instructions are superseded by current `main`
  and the controller.

Do not move or delete these records until their inbound references and any
unique durable knowledge have been separately audited.
