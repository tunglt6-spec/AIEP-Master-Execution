# ADR-0002 — Review Level Policy (L1–L4)

- **Status:** Accepted
- **Date:** 2026-07-12
- **Deciders:** Execution Lead (ratified under Architecture Freeze v1.0)

## Context

AIEP must apply review effort proportional to risk. Too little review lets
defects through; too much wastes reviewer capacity (especially scarce external
audit capacity). Multiple AI reviewers with distinct strengths are available.

## Decision

Adopt four review levels, each mapping to an ordered reviewer pipeline:

| Level | Pipeline |
|-------|----------|
| L1 | claude |
| L2 | claude → deepseek → qwen |
| L3 | claude → deepseek → qwen → gemini |
| L4 | claude → deepseek → qwen → gemini → codex |

The mapping lives in `.aiep/config.json` (`reviewLevels`) and is resolved by
`src/core/reviewMatrix.js`. Reviewers run in order and each writes an artifact.
Findings use CRITICAL/HIGH/MEDIUM/LOW/INFO; CRITICAL/HIGH are blocking.

## Consequences

- A single, machine-readable routing table drives `aiep review`, validation and
  the dashboard.
- Adding or reordering reviewers is a config change, not a code change.
- Levels are assigned by risk, not by desire for thoroughness; inflation is
  discouraged by policy and not rewarded by the process.

## Alternatives considered

- **Single mandatory pipeline for all changes:** simple but wasteful and slow.
- **Free-form reviewer choice per WO:** flexible but unauditable and inconsistent.
