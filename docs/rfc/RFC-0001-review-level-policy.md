---
rfc: 0001
title: "Review Level Policy (L1–L4) and the Codex-L4-only Token-Preservation Guard"
status: Accepted
audience: Engineering, Architecture Review Board
supersedes: none
---

# RFC-0001 — Review Level Policy (L1–L4) and the Codex-L4-only Guard

## Summary

AIEP assigns every Work Order exactly one **ReviewLevel** (`L1`–`L4`) that deterministically
resolves which reviewers must run over that Work Order's change delta. Higher levels add
reviewers; the most expensive reviewer, the external **Codex** auditor, is reserved for
**L4 only** and enforced by a multi-layer **Codex guard**. This RFC records the policy, its
justification, the enforcement mechanism, its graceful degradation behaviour, and the
alternatives considered.

## Motivation

AI-assisted review is valuable but not free: local models cost wall-clock time, and the
external auditor costs tokens and money. Two failure modes must be avoided:

1. **Under-review** — high-risk changes (auth, payments, data migrations, core runtime)
   shipping with only a self-review.
2. **Over-review / grade inflation** — routine changes routed through every reviewer, and
   in particular Work Orders inflated to L4 "just to be safe", burning the auditor budget
   and eroding the signal that L4 is supposed to carry.

A single, declarative level per Work Order makes the review surface predictable, auditable
and cheap to reason about, while a hard guard keeps the expensive tier honest.

## Detailed design

### The AI operating model (reviewers)

| Reviewer | Role | Backend | Focus |
| --- | --- | --- | --- |
| ChatGPT / ARB | Chief Architect & Final Architecture Review | — | Architecture Review Board authority |
| Claude Code | Engineering Team & Execution Lead (self review) | in-process checks | WO compliance, Definition of Done, self-consistency |
| DeepSeek | Local Code Reviewer | Ollama (`deepseek-coder:1.3b`) | logic bug, runtime error, edge case, basic security, error handling, correctness |
| Qwen | Local Technical Reviewer | Ollama (`qwen3:8b`) | maintainability, dead code, duplication, performance, architecture consistency, structure |
| Gemini | Design Reviewer | `gemini` CLI | design consistency, architecture alignment, DS/scope compliance, integration risk |
| Codex | External Independent Auditor (**not a default reviewer**) | `codex` CLI | critical correctness, security, architecture/release risk, high-impact defects |

### The Review Matrix

Each level runs an ordered, cumulative pipeline:

| Level | Pipeline | Typical use |
| --- | --- | --- |
| **L1** | `claude` | Trivial / low-risk changes, docs, comments. |
| **L2** | `claude → deepseek → qwen` | Standard code changes; local dual review. |
| **L3** | `claude → deepseek → qwen → gemini` | Architecture-significant or design-sensitive changes. |
| **L4** | `claude → deepseek → qwen → gemini → codex` | Genuinely high-risk changes only. |

The matrix is data, declared in `.aiep/config.json` under `reviewLevels`, and resolved by
`reviewMatrix.resolvePipeline(config, level)`.

### The Codex guard

Codex may be invoked **only at L4**. This is enforced at four independent points
(defence-in-depth):

1. **Config** — `codexGuard.allowedLevels: ["L4"]` and `reviewers.codex.restrictedToLevel: "L4"`.
2. **Router** — `runReview` filters Codex from the effective pipeline unless
   `codexAllowed(config, level)`; it records `codexGuard.guardBlockedCodex` in `decision.json`.
3. **Reviewer** — `runCodexReviewer` calls `assertReviewerAllowed(config, 'codex', level)`,
   which **throws** for any level below L4, so Codex cannot run even if invoked directly.
4. **Quality gate** — `aiep validate` **fails** if a `codex-audit.md` artifact exists under
   any non-L4 Work Order, and `aiep doctor` asserts the guard resolves to L4-only.

**L4 admission criteria.** Reserve L4 for: authentication/authorization, critical security,
payment, critical data migration, core runtime with system-wide impact, major production
release, or an unresolvable reviewer conflict. Work Orders must **not** be inflated to L4
solely to obtain more review.

### Degradation

Levels declare *intent*; the environment may be incomplete. When a local model or a CLI
reviewer is unavailable, that reviewer returns **`degraded`** status with a documented
integration decision instead of blocking the pipeline (see `ollama.js`, `cli-reviewer.js`).
The consolidated `review-summary.md` and `decision.json` reflect the degraded status, and
`aiep doctor` reports what is missing. Reviews therefore always complete and remain
auditable; provisioning gaps are surfaced, not silently ignored.

**Blocking semantics.** Findings of severity `CRITICAL` or `HIGH` are blocking. The verdict
is `PASS` only when `unresolvedBlockingCount === 0`, otherwise `CHANGES_REQUESTED`. In the
release gates, an unresolved CRITICAL fails the build; an unresolved HIGH warns and requires
a documented disposition.

## Drawbacks

- **Author judgment required.** Choosing the level is a human decision that can be gamed
  (inflation) or under-called; the guard mitigates the most expensive case (L4) but not the
  L2/L3 boundary.
- **Cumulative latency.** L4 runs five reviewers serially; wall-clock time grows with level.
- **Degraded reviews can look like passes.** A `degraded` reviewer produces no findings, so
  an operator must read reviewer statuses, not just the verdict.
- **Coarse granularity.** Four levels cannot capture every risk nuance; some changes sit
  awkwardly between L2 and L3.

## Alternatives considered

1. **Always run all reviewers.** Rejected: wastes the token budget on trivial changes and
   destroys the meaning of an L4 audit.
2. **Codex on demand at any level (a flag).** Rejected: reintroduces the inflation problem
   the guard exists to prevent; a per-invocation flag is harder to audit than a per-WO level.
3. **Continuous risk score instead of discrete levels.** Rejected for v1.0: harder to
   declare, review and validate deterministically; discrete levels map cleanly to a fixed
   artifact set and a simple guard.
4. **Parallel reviewer execution.** Deferred: would reduce latency but complicates
   ordered artifact writing and progress reporting; revisit post-v1.0.

## Adoption / rollout

- The policy is active in v1.0 and encoded in `.aiep/config.json`; no migration is needed.
- Every Work Order already carries a `reviewLevel`; `validate` fails any that do not.
- Authors run `aiep review <WO-ID>`; CI/release runs `aiep validate` (and `aiep package`),
  which enforce the guard and the finding gates.
- `aiep doctor` is the pre-flight check for reviewer backends and guard sanity.

## Open questions

- Should the L2↔L3 boundary get explicit, checklist-style admission criteria (as L4 has)?
- Should unresolved HIGH findings escalate a Work Order's next review to a higher level?
- Should `degraded` reviewer coverage below a threshold downgrade the verdict from `PASS`
  to an explicit `PASS (degraded)` rather than surfacing only in reviewer statuses?
- Should parallel reviewer execution be adopted to cut L4 latency (see Alternatives #4)?
