---
id: WO-0204
title: "Review Workflow"
phase: P2-Ops
reviewLevel: L3
status: done
owner: claude-execution-lead
---

# WO-0204 — Review Workflow

## Objective

Wire the end-to-end `aiep review` workflow across the reviewer pipeline.

## Scope

In scope for AIEP v1.0 (P2-Ops). Out-of-scope v2.0 features (multi-repo platform,
AI Council, Labs, multi-org, enterprise licensing) are excluded per Scope Lock v1.0.

## Deliverables

  - src/cli/review.js

## Definition of Done

- [ ] Deliverables implemented and present in the repository.
- [ ] Claude self review completed.
- [ ] Reviewers for ReviewLevel L3 executed (or documented disposition recorded).
- [ ] No unresolved CRITICAL findings; HIGH findings resolved or dispositioned.
- [ ] `aiep validate` quality gates pass.
- [ ] Changes committed to git as a logical delivery unit.

## ReviewLevel — L3

Orchestrates the whole review contract; design review confirms alignment with the policy (L3).

## Traceability

- Governance: docs/governance/REVIEW-LEVEL-POLICY.md
- Scope: docs/governance/SCOPE-LOCK-v1.0.md
- Artifacts: .aiep/artifacts/WO-0204/
