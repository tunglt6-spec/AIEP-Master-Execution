# SOP-005 — AI Coding with AIEP (implement → independent audit)

## Purpose

Define how to pair an **AI coding agent** (e.g. Claude Code) with AIEP so that
code produced by AI is **independently audited** and **human-gated** before it is
accepted or deployed. This is the manual, in-scope version of the RFC-0002 loop.

## Scope

Applies to any project initialized with `aiep init`. Covers the flow: idea →
Claude Code implements → AIEP audits (`aiep review`, `aiep validate`) → human
reviews findings → deploy. It does **not** cover autonomous deployment (see
RFC-0002 for the v2.0 agent loop, which remains Proposed).

## Roles

| Role | Who | Responsibility |
|------|-----|----------------|
| Author | AI coding agent (Claude Code) | Implements the change; runs the AIEP audit commands |
| Independent reviewers | DeepSeek, Qwen, (Gemini L3, Codex L4) | Audit the diff — **different models from the author** |
| Approver | You (human) | Review findings, approve/reject dispositions, gate deploy |

## Prerequisites

- Project initialized: `aiep init` (has `.aiep/config.json`, `pmo/work-orders/`).
- AIEP CLI available (`npm install -g @tunglt6/aiep`) or run via `node bin/aiep.js`.
- For real local audit: Ollama running with the configured models (`aiep doctor`).
- A Work Order for the change (create with `aiep plan "<idea>"` if needed).

## Key principle

> The agent that WRITES the code must not be the sole judge of it.

The AIEP audit uses **independent models** (minimum L2). The human approves
dispositions and gates deploy. Never let the coding agent silently dismiss its
own CRITICAL/HIGH findings, and never auto-deploy.

## Procedure

1. **Frame the work.** Create/point to a Work Order and confirm its `reviewLevel`
   (`aiep plan "<idea>"` proposes one; refine it).
2. **Implement.** The AI coding agent writes the change.
3. **Commit the delta.** `git add …` then `git commit` (so the audit has a clean,
   focused diff to review).
4. **Audit.** Run `aiep review <WO-ID> --last` — routes to the reviewers for the
   Work Order's ReviewLevel and writes artifacts under `.aiep/artifacts/<WO-ID>/`.
5. **Gate.** Run `aiep validate` (quality gates).
6. **Human review.** Inspect `aiep artifacts <WO-ID>` / `review-summary.md`.
   - Real finding → fix the code, re-run step 4.
   - False positive → record a documented disposition
     (`.aiep/artifacts/<WO-ID>/dispositions.json`) — **you** approve it.
7. **Deploy (human-gated).** Only after gates pass and you approve:
   merge / `npm publish` / `gh release create`.

## Prompt template (paste to the AI coding agent)

```
Task: <your idea>.

After implementing, audit with AIEP and report — do NOT skip:
1. Ensure a Work Order exists (use `aiep plan "<summary>"` if not); tell me the WO-ID and ReviewLevel.
2. git add + commit the change.
3. Run: aiep review <WO-ID> --last
4. Run: aiep validate
5. Show me the findings (aiep artifacts <WO-ID>) and STOP for my review.
   - Do NOT dismiss any CRITICAL/HIGH finding on your own code.
   - Do NOT deploy / merge / publish without my explicit approval.
```

## Checklist

- [ ] Work Order exists with a correct ReviewLevel (≥ L2 for real code).
- [ ] Change committed before audit (focused diff).
- [ ] `aiep review <WO-ID> --last` run; artifacts present.
- [ ] `aiep validate` passes (or failures understood).
- [ ] CRITICAL/HIGH findings fixed, or dispositioned **with human approval**.
- [ ] Deploy performed only after explicit human approval.

## Notes & pitfalls

- Small local models produce false positives — verify against source before
  dismissing (see SOP-002).
- Qwen on CPU may time out on large diffs → degraded/documented disposition; keep
  diffs focused or tune `AIEP_OLLAMA_NUM_PREDICT` / `AIEP_OLLAMA_TIMEOUT_MS`.
- Auditing an uncommitted, empty, or whole-repo delta reduces review quality —
  always commit the specific change and use `--last`.

## References

- [SOP-001 Work Order Lifecycle](./SOP-001-work-order-lifecycle.md)
- [SOP-002 Review Execution](./SOP-002-review-execution.md)
- [Review Level Policy](../governance/REVIEW-LEVEL-POLICY.md)
- [RFC-0002 AI Coding Agent](../rfc/RFC-0002-ai-coding-agent.md)
- [User Guide](../USER-GUIDE.md)
