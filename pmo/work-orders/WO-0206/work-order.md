---
id: WO-0206
title: "Doctor & Status Commands"
phase: P2-Ops
reviewLevel: L1
status: done
owner: claude-execution-lead
---

# WO-0206 — Doctor & Status Commands

## Objective

Environment diagnostics and platform status reporting.

## Scope

In scope for AIEP v1.0 (P2-Ops). Out-of-scope v2.0 features (multi-repo platform,
AI Council, Labs, multi-org, enterprise licensing) are excluded per Scope Lock v1.0.

## Deliverables

  - src/cli/doctor.js
  - src/cli/status.js

## Definition of Done

- [ ] Deliverables implemented and present in the repository.
- [ ] Claude self review completed.
- [ ] Reviewers for ReviewLevel L1 executed (or documented disposition recorded).
- [ ] No unresolved CRITICAL findings; HIGH findings resolved or dispositioned.
- [ ] `aiep validate` quality gates pass.
- [ ] Changes committed to git as a logical delivery unit.

## ReviewLevel — L1

Read-only diagnostics, low risk.

## Traceability

- Governance: docs/governance/REVIEW-LEVEL-POLICY.md
- Scope: docs/governance/SCOPE-LOCK-v1.0.md
- Artifacts: .aiep/artifacts/WO-0206/
