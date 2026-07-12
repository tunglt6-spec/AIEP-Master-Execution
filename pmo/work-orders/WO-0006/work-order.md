---
id: WO-0006
title: "Bootstrap Scripts"
phase: P0-Foundation
reviewLevel: L2
status: done
owner: claude-execution-lead
---

# WO-0006 — Bootstrap Scripts

## Objective

Cross-platform bootstrap/install scripts for the platform.

## Scope

In scope for AIEP v1.0 (P0-Foundation). Out-of-scope v2.0 features (multi-repo platform,
AI Council, Labs, multi-org, enterprise licensing) are excluded per Scope Lock v1.0.

## Deliverables

  - scripts/bootstrap.ps1
  - scripts/bootstrap.sh
  - scripts/install.ps1
  - scripts/install.sh

## Definition of Done

- [ ] Deliverables implemented and present in the repository.
- [ ] Claude self review completed.
- [ ] Reviewers for ReviewLevel L2 executed (or documented disposition recorded).
- [ ] No unresolved CRITICAL findings; HIGH findings resolved or dispositioned.
- [ ] `aiep validate` quality gates pass.
- [ ] Changes committed to git as a logical delivery unit.

## ReviewLevel — L2

Scripts execute on user machines; dual local review checks correctness and basic safety.

## Traceability

- Governance: docs/governance/REVIEW-LEVEL-POLICY.md
- Scope: docs/governance/SCOPE-LOCK-v1.0.md
- Artifacts: .aiep/artifacts/WO-0006/
