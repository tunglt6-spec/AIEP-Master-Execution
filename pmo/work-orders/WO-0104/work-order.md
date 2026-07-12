---
id: WO-0104
title: "Git Delta Processing"
phase: P1-Core
reviewLevel: L2
status: done
owner: claude-execution-lead
---

# WO-0104 — Git Delta Processing

## Objective

Git helpers to focus reviews on the change delta (diff/changed files).

## Scope

In scope for AIEP v1.0 (P1-Core). Out-of-scope v2.0 features (multi-repo platform,
AI Council, Labs, multi-org, enterprise licensing) are excluded per Scope Lock v1.0.

## Deliverables

  - src/core/gitdelta.js

## Definition of Done

- [ ] Deliverables implemented and present in the repository.
- [ ] Claude self review completed.
- [ ] Reviewers for ReviewLevel L2 executed (or documented disposition recorded).
- [ ] No unresolved CRITICAL findings; HIGH findings resolved or dispositioned.
- [ ] `aiep validate` quality gates pass.
- [ ] Changes committed to git as a logical delivery unit.

## ReviewLevel — L2

Shells out to git across platforms; dual local review checks robustness.

## Traceability

- Governance: docs/governance/REVIEW-LEVEL-POLICY.md
- Scope: docs/governance/SCOPE-LOCK-v1.0.md
- Artifacts: .aiep/artifacts/WO-0104/
