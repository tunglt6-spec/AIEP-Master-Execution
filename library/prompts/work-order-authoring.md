# Prompt: AIEP Work Order Authoring

**Title:** AIEP Work Order Authoring
**Purpose:** Draft a well-formed AIEP Work Order (WO) — the unit the PMO tracks and the
review pipeline consumes — with a correct, justified review level.
**When to use:** When starting any new unit of engineering work that will pass through
AIEP review. Produces a WO document with frontmatter and body ready for `aiep validate`.

## Prompt body

```text
Draft an AIEP Work Order for the task below. Output a single Markdown document with a
YAML frontmatter block followed by the body.

Task description: {{TASK_DESCRIPTION}}
Proposed scope of change: {{SCOPE_OF_CHANGE}}
Risk notes (auth/security/payment/data/runtime?): {{RISK_NOTES}}

Frontmatter (controlled subset only):
---
id: {{WO_ID}}
title: <concise imperative title>
status: draft
reviewLevel: <L1 | L2 | L3 | L4>
owner: <engineer>
deliverable: <Core Repository | Documentation System | AI Engineering Library | PMO | Dashboard>
---

Choose reviewLevel using the Review Level Policy:
- L1 (claude only): trivial, low-risk, isolated change.
- L2 (claude -> deepseek -> qwen): normal code change needing correctness + quality review.
- L3 (adds gemini): change with design/architecture/integration impact.
- L4 (adds codex): ONLY genuinely high-risk — auth, authz, critical security, payment,
  critical data migration, core runtime with system-wide impact, major production
  release, or unresolvable reviewer conflict.
CODEX GUARD: do not inflate a WO to L4 just to get more review. Justify L4 explicitly.

Body sections:
1. Context — why this work exists.
2. Objective — the outcome, testable.
3. In scope / Out of scope — bullet lists (respect v1.0 Scope Lock).
4. Acceptance criteria — checklist.
5. Review level justification — one sentence tying the chosen level to the policy.
6. Rule of Three — the Code / Knowledge / Standard asset this WO will produce (or "none" with reason).
```

## Variables

| Variable | Meaning |
|----------|---------|
| `{{WO_ID}}` | Assigned Work Order identifier. |
| `{{TASK_DESCRIPTION}}` | Plain-language description of the task. |
| `{{SCOPE_OF_CHANGE}}` | Files/modules expected to change. |
| `{{RISK_NOTES}}` | Any high-risk dimensions that could justify L4. |

## Expected output

A complete WO Markdown document: valid frontmatter (controlled keys only), a body with
the six sections, and an explicit review-level justification. A well-formed WO passes
`aiep validate` and gives the PMO and dashboard the fields they track.
