# Review Level Policy (v1.0)

Every Work Order **must** carry exactly one `reviewLevel`: `L1`, `L2`, `L3` or `L4`.
The level determines the reviewer pipeline. This policy is enforced in code by
`src/core/reviewMatrix.js` and validated by `aiep validate`.

## The Review Matrix

| Level | Pipeline | Use for |
|-------|----------|---------|
| **L1** | Claude self review | Structural, documentation, low-risk scaffolding |
| **L2** | Claude → DeepSeek → Qwen | Standard code with logic/maintainability surface |
| **L3** | Claude → DeepSeek → Qwen → Gemini | Architecture-significant or integration-heavy change |
| **L4** | Claude → DeepSeek → Qwen → Gemini → Codex | Genuinely high-risk change (see below) |

Reviewers run **in order**. Each produces an artifact under
`.aiep/artifacts/<WO-ID>/`.

## Reviewer focus

- **Claude (self review):** Work Order compliance, Definition of Done, no secrets
  in the delta, self-consistency.
- **DeepSeek (local code reviewer):** logic bugs, runtime errors, edge cases,
  basic security, error handling, correctness.
- **Qwen (local technical reviewer):** maintainability, dead code, duplication,
  performance, architecture consistency, code structure.
- **Gemini (design reviewer):** design consistency, architecture alignment, design
  spec compliance, scope compliance, integration risk.
- **Codex (external auditor, L4 only):** critical correctness, security,
  architecture risk, release risk, high-impact defects.

## The Codex Guard (token preservation)

Codex is **never** a default reviewer. It is invoked **only** at L4.

- Codex MUST NOT be called for L1, L2 or L3.
- The guard is enforced in three places (defence in depth):
  1. The review matrix (`codexAllowed`) — the single source of truth.
  2. The Codex reviewer module (`assertReviewerAllowed`) — refuses to run below L4.
  3. `aiep validate` — fails if a Codex artifact appears at a non-L4 Work Order.
- Do **not** raise a Work Order to L4 merely to increase the review depth.

### When L4 (and therefore Codex) is justified

- Authentication / authorization.
- Critical security surface.
- Payment flows.
- Critical data migration.
- Core runtime with system-wide impact.
- Major production release.
- Reviewer conflict that cannot otherwise be resolved.

For AIEP v1.0 itself, no Work Order met the L4 bar; Codex usage is therefore zero
by design. The guard is verified by unit tests rather than by spending Codex
tokens.

## Findings & dispositions

Findings are classified `CRITICAL`, `HIGH`, `MEDIUM`, `LOW`, `INFO`.
`CRITICAL` and `HIGH` are **blocking**: they must be fixed or given a documented
disposition before a Work Order reaches Definition of Done.

## Graceful degradation

If a required reviewer backend is unavailable (e.g. Gemini CLI not installed),
the platform records an **integration decision** artifact and continues. This is
a documented disposition, not a silent skip, and not a hard block — the missing
backend is an environment provisioning concern, not a defect in the change. A
hard block is raised only when a required reviewer cannot run **and** no valid
method exists to complete the Review Contract.
