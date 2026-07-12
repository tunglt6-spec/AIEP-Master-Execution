# Prompt: Architecture Decision Record (ADR) Drafting

**Title:** Architecture Decision Record Drafting
**Purpose:** Draft a clear, durable ADR that captures an architectural decision, its
context, the options considered, and the consequences.
**When to use:** When a Work Order makes a decision worth remembering — a choice that
future engineers should not silently reverse (module boundaries, data format, a
zero-dependency trade-off, a reviewer-routing rule). Often the "Standard Asset" a WO
produces under the Rule of Three.

## Prompt body

```text
Draft an Architecture Decision Record for the decision below. Output Markdown with a
YAML frontmatter block, then the body.

Decision topic: {{DECISION_TOPIC}}
Driving Work Order: {{WO_ID}}
Options considered: {{OPTIONS}}
Chosen option: {{CHOSEN_OPTION}}
Constraints in play: {{CONSTRAINTS}}

Frontmatter:
---
id: {{ADR_ID}}
title: <short decision title>
status: proposed
date: {{DATE}}
relatedWO: {{WO_ID}}
---

Body sections:
1. Context — the forces and constraints (include relevant v1.0 facts: Node.js ESM, zero
   runtime dependencies, cross-platform, Markdown+YAML data, .aiep/config.json).
2. Decision — the chosen option, stated as an active directive ("We will ...").
3. Options considered — each option with pros/cons, including the chosen one.
4. Consequences — positive and negative results, and what becomes harder.
5. Compliance — confirm the decision stays inside v1.0 Scope Lock.

Rules:
- State the decision plainly; avoid hedging.
- Record rejected options honestly so the trade-off is auditable.
- If the decision touches an out-of-scope v2.0 area, stop and flag it instead of drafting.
```

## Variables

| Variable | Meaning |
|----------|---------|
| `{{ADR_ID}}` | ADR identifier (e.g. `ADR-0007`). |
| `{{DECISION_TOPIC}}` | What is being decided. |
| `{{WO_ID}}` | Work Order that drove the decision. |
| `{{OPTIONS}}` | Options that were considered. |
| `{{CHOSEN_OPTION}}` | The option selected. |
| `{{CONSTRAINTS}}` | Constraints shaping the decision. |
| `{{DATE}}` | Decision date. |

## Expected output

A complete ADR document with valid frontmatter and the five body sections. The record is
self-contained: a reader who was not present can understand the context, the choice, and
why the alternatives were rejected, without consulting other sources.
