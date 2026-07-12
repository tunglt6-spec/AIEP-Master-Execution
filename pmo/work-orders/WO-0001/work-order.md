---
id: WO-0001
title: "Repository Skeleton"
phase: P0-Foundation
reviewLevel: L1
status: done
owner: claude-execution-lead
---

# WO-0001 — Repository Skeleton

## Objective

Establish the AIEP repository structure, git baseline and ignore rules.

## Scope

In scope for AIEP v1.0 (P0-Foundation). Out-of-scope v2.0 features (multi-repo platform,
AI Council, Labs, multi-org, enterprise licensing) are excluded per Scope Lock v1.0.

## Deliverables

  - Directory skeleton (src, docs, pmo, library, templates, scripts, dashboard, .aiep)
  - .gitignore
  - package.json
  - LICENSE

## Definition of Done

- [ ] Deliverables implemented and present in the repository.
- [ ] Claude self review completed.
- [ ] Reviewers for ReviewLevel L1 executed (or documented disposition recorded).
- [ ] No unresolved CRITICAL findings; HIGH findings resolved or dispositioned.
- [ ] `aiep validate` quality gates pass.
- [ ] Changes committed to git as a logical delivery unit.

## ReviewLevel — L1

Structural scaffolding only; no runtime or security surface. Claude self review is sufficient.

## Traceability

- Governance: docs/governance/REVIEW-LEVEL-POLICY.md
- Scope: docs/governance/SCOPE-LOCK-v1.0.md
- Artifacts: .aiep/artifacts/WO-0001/
