---
id: WO-0110
title: "SOP-005 — AI Coding with AIEP"
phase: P1-Core
reviewLevel: L1
status: done
owner: claude-execution-lead
---

# WO-0110 — SOP-005 — AI Coding with AIEP

## Objective

Document the standard procedure for pairing an AI coding agent with AIEP:
implement → independent audit → human-gated deploy (the manual RFC-0002 loop).

## Scope

Documentation only. Adds SOP-005 and links it from the SOP index. No code change.

## Deliverables

  - docs/sop/SOP-005-ai-coding-with-aiep.md
  - docs/sop/INDEX.md (updated)

## Definition of Done

- [ ] SOP-005 present with procedure, prompt template, checklist and guardrails.
- [ ] Linked from the SOP index.
- [ ] Claude self review completed.
- [ ] `aiep validate` passes.

## ReviewLevel — L1

Documentation with no runtime or security surface; Claude self review is sufficient.

## Traceability

- Related: docs/rfc/RFC-0002-ai-coding-agent.md, docs/sop/SOP-002-review-execution.md
- Artifacts: .aiep/artifacts/WO-0110/
