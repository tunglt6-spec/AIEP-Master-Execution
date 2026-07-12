---
id: WO-0102
title: "Config & Paths Core"
phase: P1-Core
reviewLevel: L1
status: done
owner: claude-execution-lead
---

# WO-0102 — Config & Paths Core

## Objective

Central config loader and canonical path resolution.

## Scope

In scope for AIEP v1.0 (P1-Core). Out-of-scope v2.0 features (multi-repo platform,
AI Council, Labs, multi-org, enterprise licensing) are excluded per Scope Lock v1.0.

## Deliverables

  - src/core/config.js
  - src/core/paths.js
  - .aiep/config.json

## Definition of Done

- [ ] Deliverables implemented and present in the repository.
- [ ] Claude self review completed.
- [ ] Reviewers for ReviewLevel L1 executed (or documented disposition recorded).
- [ ] No unresolved CRITICAL findings; HIGH findings resolved or dispositioned.
- [ ] `aiep validate` quality gates pass.
- [ ] Changes committed to git as a logical delivery unit.

## ReviewLevel — L1

Foundational but simple; self review sufficient.

## Traceability

- Governance: docs/governance/REVIEW-LEVEL-POLICY.md
- Scope: docs/governance/SCOPE-LOCK-v1.0.md
- Artifacts: .aiep/artifacts/WO-0102/
