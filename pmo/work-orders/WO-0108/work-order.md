---
id: WO-0108
title: "Project Initialization (aiep init)"
phase: P1-Core
reviewLevel: L2
status: done
owner: claude-execution-lead
---

# WO-0108 — Project Initialization (aiep init)

## Objective

Add an `aiep init` command that scaffolds a working AIEP workspace into any
project directory, so AIEP can govern projects other than its own repository.

## Scope

Post-v1.0 enhancement requested by the Product Owner. Idempotent scaffolding of
the minimal structure required for `aiep doctor|status|validate|review|dashboard`
to work in a fresh project: `.aiep/config.json`, starter governance/PMO docs, a
sample Work Order, and the dashboard frontend. Does not change the Codex guard,
review routing or Scope Lock.

## Deliverables

  - src/cli/init.js
  - `aiep init` registered in the CLI dispatcher
  - test/init.test.js
  - USER-GUIDE section for `aiep init`

## Definition of Done

- [ ] `aiep init [dir]` creates a workspace where `aiep validate` passes.
- [ ] Idempotent: re-running never overwrites existing files (unless `--force`).
- [ ] Claude self review completed; DeepSeek + Qwen (L2) executed or dispositioned.
- [ ] No unresolved CRITICAL/HIGH findings.
- [ ] `aiep validate` quality gates pass; tests pass.
- [ ] Committed as a logical delivery unit.

## ReviewLevel — L2

New CLI command that writes files into arbitrary directories — moderate risk
(filesystem side effects). Dual local review (DeepSeek + Qwen) checks correctness
and safety (no overwrite, path handling).

## Traceability

- Governance: docs/governance/REVIEW-LEVEL-POLICY.md
- Known limitation addressed: PROJECT.md / USER-GUIDE §7 (no init in v1.0)
- Artifacts: .aiep/artifacts/WO-0108/
