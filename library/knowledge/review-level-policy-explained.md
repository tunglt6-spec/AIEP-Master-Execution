# Review Level Policy, Explained

Every AIEP Work Order carries exactly one **Review Level** (L1–L4). The level decides
which reviewers run and in what order. This article explains the policy and how to pick
the right level.

## The levels

| Level | Reviewer pipeline | Intent |
|-------|-------------------|--------|
| **L1** | claude | Trivial, isolated, low-risk change. Claude self-review only. |
| **L2** | claude → deepseek → qwen | Normal code change needing correctness + quality review. |
| **L3** | claude → deepseek → qwen → gemini | Change with design/architecture/integration impact. |
| **L4** | claude → deepseek → qwen → gemini → codex | Genuinely high-risk change. |

Each reviewer owns a distinct lens:

- **Claude** — Engineering Team & Execution Lead; performs the self review.
- **DeepSeek** (local, via Ollama) — Code Reviewer: logic bugs, runtime errors, edge
  cases, basic security, error handling, correctness.
- **Qwen** (local, via Ollama) — Technical Reviewer: maintainability, dead code,
  duplication, performance, architecture consistency, structure.
- **Gemini** — Design Reviewer: design consistency, architecture alignment, DS/scope
  compliance, integration risk.
- **Codex** — External Independent Auditor. **Not** a default reviewer.

## The CODEX GUARD

Codex is invoked **only at L4** — never at L1, L2, or L3. Do **not** inflate a Work
Order to L4 just to obtain more scrutiny. L4 is reserved for changes that are genuinely
high-risk:

- authentication or authorization
- critical security
- payment
- critical data migration
- core runtime with system-wide impact
- major production release
- an unresolvable reviewer conflict

If none of these apply, the correct level is L3 or below. Over-leveling wastes the
independent auditor and dilutes the signal of a true L4.

## Choosing a level (quick heuristic)

1. Does it touch a high-risk area in the list above, or is there a reviewer deadlock?
   → **L4**.
2. Otherwise, does it change design, cross module boundaries, or affect another
   deliverable? → **L3**.
3. Otherwise, is it a normal code change? → **L2**.
4. Otherwise, is it trivial and isolated? → **L1**.

## Severities and blocking

All reviewers report findings using the severity set **CRITICAL, HIGH, MEDIUM, LOW,
INFO**. CRITICAL and HIGH are **blocking**: a Work Order with any open CRITICAL/HIGH
finding cannot pass, regardless of level.

## Artifacts produced

At `.aiep/artifacts/<WO-ID>/`: `claude-self-review.md`, `deepseek-review.md`,
`qwen-review.md`, `gemini-review.md` (L3+), `codex-audit.md` (L4),
`review-summary.md` (L2+), and `decision.json`.
