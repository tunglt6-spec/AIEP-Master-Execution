---
id: WO-0201
title: "Ollama Local Reviewer Integration"
phase: P2-Ops
reviewLevel: L3
status: done
owner: claude-execution-lead
---

# WO-0201 — Ollama Local Reviewer Integration

## Objective

Integrate DeepSeek (code) and Qwen (technical) reviewers via the Ollama HTTP API with graceful degradation.

## Scope

In scope for AIEP v1.0 (P2-Ops). Out-of-scope v2.0 features (multi-repo platform,
AI Council, Labs, multi-org, enterprise licensing) are excluded per Scope Lock v1.0.

## Deliverables

  - src/reviewers/ollama.js

## Definition of Done

- [ ] Deliverables implemented and present in the repository.
- [ ] Claude self review completed.
- [ ] Reviewers for ReviewLevel L3 executed (or documented disposition recorded).
- [ ] No unresolved CRITICAL findings; HIGH findings resolved or dispositioned.
- [ ] `aiep validate` quality gates pass.
- [ ] Changes committed to git as a logical delivery unit.

## ReviewLevel — L3

Core AI integration affecting all L2+ reviews; design review ensures integration and degradation strategy are sound (L3).

## Traceability

- Governance: docs/governance/REVIEW-LEVEL-POLICY.md
- Scope: docs/governance/SCOPE-LOCK-v1.0.md
- Artifacts: .aiep/artifacts/WO-0201/
