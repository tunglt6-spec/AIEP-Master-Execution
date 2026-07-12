---
id: WO-0109
title: "AI Coding Agent RFC + aiep plan PoC"
phase: P1-Core
reviewLevel: L2
status: done
owner: claude-execution-lead
---

# WO-0109 — AI Coding Agent RFC + `aiep plan` PoC

## Objective

Document the AIEP × AI-coding-agent integration as RFC-0002, and ship a safe,
in-scope proof of concept: `aiep plan "<idea>"` that drafts a Work Order from an
idea using a local model — no code generation, no deploy.

## Scope

- RFC-0002: design only (v2.0 proposal; does not open v2.0 scope).
- `aiep plan` PoC: creates a **draft Work Order** markdown for human review. It
  MUST NOT write source code, run builds, or deploy. Fully within v1.x boundaries.

## Deliverables

  - docs/rfc/RFC-0002-ai-coding-agent.md (+ rfc INDEX update)
  - src/cli/plan.js  (aiep plan)
  - ollamaGenerate helper in src/reviewers/ollama.js
  - test/plan.test.js
  - USER-GUIDE note

## Definition of Done

- [ ] `aiep plan "<idea>"` writes a valid draft Work Order (status: backlog).
- [ ] Works offline (template fallback when Ollama unavailable).
- [ ] Never overwrites an existing Work Order (unless --force).
- [ ] Claude self review + DeepSeek + Qwen (L2) executed or dispositioned.
- [ ] No unresolved CRITICAL/HIGH; `aiep validate` passes; tests pass.

## ReviewLevel — L2

New CLI command with filesystem side effects and a model call, but tightly
scoped (only writes a planning document). Dual local review is appropriate.

## Traceability

- Design: docs/rfc/RFC-0002-ai-coding-agent.md
- Boundary: no code-gen / no deploy (Scope Lock v1.0 respected)
- Artifacts: .aiep/artifacts/WO-0109/
