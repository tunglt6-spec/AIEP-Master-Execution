# RFC-0002 — AIEP × AI Coding Agent ("Idea → Code → Audit → Deploy")

- **Status:** Proposed (v2.0 candidate — does NOT open v2.0 scope by itself)
- **Date:** 2026-07-12
- **Author:** Execution Lead
- **Related:** ADR-0002 (Review Levels), ADR-0003 (Codex guard), WO-0109

## Summary

Integrate an external **AI coding agent** (the "hands" that writes code) with
AIEP (the governance + audit + release layer) so that a single loop can go from
an idea to a reviewed, gated, human-approved deployment. AIEP does not itself
generate code today; this RFC defines how an agent plugs in without weakening
AIEP's independence and human-gating guarantees.

## Motivation

AIEP v1.x audits and governs changes but relies on a human (or a separate tool)
to author code. Teams increasingly use AI coding agents. Pairing them yields a
tight "idea → code → audit → deploy" loop **while keeping the reviewer
independent from the author** — the core safety property that makes AI-written
code trustworthy.

## Core principle (non-negotiable)

> The agent that WRITES code must never be the sole judge of that code.

AI writes; **different** AIs audit (DeepSeek/Qwen/Gemini/Codex); **humans gate
deploy**. This preserves ADR-0002/0003 and the platform's audit guarantees.

## Detailed design

### Roles

| Component | Role | Provider |
|-----------|------|----------|
| Coding Agent | Generate code from a Work Order | Claude Code / Cursor / Aider (via adapter) |
| AIEP Review | Independent multi-model audit (L1–L4) | DeepSeek, Qwen, Gemini, Codex |
| AIEP Gates | Quality gates, secret scan, scope lock | `aiep validate` |
| Orchestrator | code → review → fix loop | new `aiep` verbs |
| Human | Approve WO; gate deploy | two mandatory gates |

### Flow

```
idea → aiep plan → [HUMAN GATE #1: approve WO] → aiep implement (agent, isolated worktree)
     → aiep review (independent reviewers) → findings? → agent fixes → re-review  [bounded loop]
     → aiep validate → [HUMAN GATE #2: approve deploy] → aiep ship
```

### New surface (v2.0)

| Verb | Purpose |
|------|---------|
| `aiep plan "<idea>"` | Agent drafts a Work Order (suggests ReviewLevel). *Shipped as a PoC in WO-0109 — see below.* |
| `aiep implement <WO>` | Agent writes code in an **isolated git worktree/branch**. |
| `aiep loop <WO>` | Orchestrate implement → review → fix → validate (capped iterations, token budget). |
| `aiep ship <WO>` | After gates + human approval: merge / publish / release. |

### Agent adapter contract

AIEP must not hard-code one agent. Config (`.aiep/config.json`):

```json
"codingAgent": {
  "type": "cli",
  "command": "claude",
  "model": "claude-opus-4-8",
  "workdir": "worktree",
  "maxIterations": 3,
  "tokenBudget": 500000
}
```

Interface every adapter implements:
- **Input:** Work Order spec + repo context + (on fix) findings from `decision.json`.
- **Output:** a commit/diff + a self-report (JSON).

### Guardrails

1. **Isolation** — agent works in a dedicated worktree/branch; never writes `main`.
2. **Reviewer independence** — reviewers differ from the coding agent; AI-written
   code is never L1 self-review-only (minimum L2).
3. **Human deploy gate** — publish/merge/prod always require human approval; never
   autonomous.
4. **Codex L4 guard** unchanged — only genuinely high-risk changes reach Codex.
5. **Caps & budget** — bounded loop iterations and token budget.
6. **Provenance** — every step recorded as artifacts (git + `.aiep/artifacts/`).

## PoC delivered in this RFC (in-scope, v1.x)

`aiep plan "<idea>"` (see `src/cli/plan.js`) drafts a **Work Order only**:
- Uses a local model (Ollama, reusing the reviewer backend) to propose title,
  objective, deliverables and a suggested ReviewLevel + rationale.
- Falls back to a template (offline) when the model is unavailable.
- Writes `pmo/work-orders/<WO-ID>/work-order.md` with `status: backlog` for human
  review. **It does not generate source code, build, or deploy.**

This proves the "idea → structured Work Order" front of the loop without crossing
the v1.0 Scope Lock.

## Drawbacks

- Small local models produce false positives/low-quality drafts → human review
  stays mandatory (drafts are `backlog`, not auto-approved).
- Added latency/cost per loop iteration.
- Full agent loop (`implement`/`loop`/`ship`) is genuine v2.0 scope.

## Alternatives considered

- **Let the coding agent self-review** — rejected; violates the core principle.
- **Single vendor lock-in** — rejected; the adapter contract keeps agents pluggable.
- **Autonomous deploy** — rejected; conflicts with the human-gate safety model.

## Adoption / rollout

1. (Now, v1.x) `aiep plan` PoC — WO-0109.
2. (v2.0) `aiep implement` + adapter contract behind a feature flag.
3. (v2.0) `aiep loop` orchestrator with caps.
4. (v2.0) `aiep ship` with mandatory human gate.

## Open questions

- Worktree lifecycle and cleanup policy.
- How findings are best serialized back to arbitrary agents.
- Budget accounting across agent + reviewers.
- Whether `implement` should target a PR rather than a local branch by default.
