---
id: WO-0105
title: "Review Matrix & Routing"
phase: P1-Core
reviewLevel: L3
status: done
owner: claude-execution-lead
---

# WO-0105 — Review Matrix & Routing

## Objective

Map ReviewLevel to reviewer pipeline and enforce the Codex L4 guard.

## Scope

In scope for AIEP v1.0 (P1-Core). Out-of-scope v2.0 features (multi-repo platform,
AI Council, Labs, multi-org, enterprise licensing) are excluded per Scope Lock v1.0.

## Deliverables

  - src/core/reviewMatrix.js
  - src/reviewers/index.js

## Definition of Done

- [ ] Deliverables implemented and present in the repository.
- [ ] Claude self review completed.
- [ ] Reviewers for ReviewLevel L3 executed (or documented disposition recorded).
- [ ] No unresolved CRITICAL findings; HIGH findings resolved or dispositioned.
- [ ] `aiep validate` quality gates pass.
- [ ] Changes committed to git as a logical delivery unit.

## ReviewLevel — L3

Architecture-significant: it governs how all reviews route and how the Codex guard is enforced. Warrants design review (L3).

## Traceability

- Governance: docs/governance/REVIEW-LEVEL-POLICY.md
- Scope: docs/governance/SCOPE-LOCK-v1.0.md
- Artifacts: .aiep/artifacts/WO-0105/
