---
id: WO-0008
title: "Repository Validation"
phase: P0-Foundation
reviewLevel: L2
status: done
owner: claude-execution-lead
---

# WO-0008 — Repository Validation

## Objective

Implement `aiep validate` quality gates (docs, WO integrity, Codex guard, secrets, scope lock).

## Scope

In scope for AIEP v1.0 (P0-Foundation). Out-of-scope v2.0 features (multi-repo platform,
AI Council, Labs, multi-org, enterprise licensing) are excluded per Scope Lock v1.0.

## Deliverables

  - src/cli/validate.js
  - src/core/secrets.js

## Definition of Done

- [ ] Deliverables implemented and present in the repository.
- [ ] Claude self review completed.
- [ ] Reviewers for ReviewLevel L2 executed (or documented disposition recorded).
- [ ] No unresolved CRITICAL findings; HIGH findings resolved or dispositioned.
- [ ] `aiep validate` quality gates pass.
- [ ] Changes committed to git as a logical delivery unit.

## ReviewLevel — L2

Validation is a correctness-critical gate; dual local review is warranted.

## Traceability

- Governance: docs/governance/REVIEW-LEVEL-POLICY.md
- Scope: docs/governance/SCOPE-LOCK-v1.0.md
- Artifacts: .aiep/artifacts/WO-0008/
