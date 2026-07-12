# ADR-0003 — Codex L4-Only Guard (Token Preservation)

- **Status:** Accepted
- **Date:** 2026-07-12
- **Deciders:** Execution Lead (ratified under Architecture Freeze v1.0)

## Context

Codex is the External Independent Auditor. Its capacity/tokens are the scarcest
review resource on the platform. Left ungoverned, it would be tempting to route
everything through Codex "to be safe", exhausting the budget and slowing delivery.

## Decision

Codex is invoked **only** at ReviewLevel L4, enforced with defence in depth:

1. **Single source of truth** — `codexAllowed(config, level)` in
   `src/core/reviewMatrix.js`, backed by `config.codexGuard.allowedLevels = ["L4"]`.
2. **Reviewer-level refusal** — `src/reviewers/codex.js` calls
   `assertReviewerAllowed` and throws if invoked below L4.
3. **Router filtering** — the review router drops Codex from any non-L4 pipeline.
4. **Validation gate** — `aiep validate` fails if a `codex-audit.md` artifact
   exists at a non-L4 Work Order.

Work Orders are not raised to L4 solely to increase review depth. L4 is reserved
for genuinely high-risk changes (auth, security, payment, critical migration,
core-runtime/system-wide impact, major release, unresolvable reviewer conflict).

## Consequences

- Codex tokens are preserved; delivery is not throttled by unnecessary audits.
- The guard is testable without spending tokens — unit tests assert that Codex is
  disallowed at L1–L3 and allowed at L4.
- For AIEP v1.0, no Work Order met the L4 bar, so Codex usage is zero by design.

## Alternatives considered

- **Honour-system policy only:** relies on discipline; no enforcement — rejected.
- **Codex on all L3+:** still too broad for the token budget — rejected.
