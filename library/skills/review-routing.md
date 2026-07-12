# Skill: Review Routing by Review Level

**Type:** Repeatable engineering procedure (SOP)
**Owner surface:** `aiep review [WO-ID]` (CLI), driven by `src/reviewers/*`.
**Goal:** Given a Work Order's `reviewLevel`, run exactly the right reviewers in the
right order — no more, no less — and never invoke Codex outside L4.

## Inputs

- A validated Work Order with a single `reviewLevel` in `{L1, L2, L3, L4}`.
- Reviewer backends available per the environment (see `graceful-degradation`).

## Procedure

1. Read `reviewLevel` from the WO frontmatter.
2. Route to the fixed pipeline for that level:

   | Level | Pipeline (in order) | Summary produced? |
   |-------|---------------------|-------------------|
   | L1 | claude | no |
   | L2 | claude → deepseek → qwen | yes |
   | L3 | claude → deepseek → qwen → gemini | yes |
   | L4 | claude → deepseek → qwen → gemini → codex | yes |

3. Run reviewers sequentially. Write each artifact to `.aiep/artifacts/<WO-ID>/`:
   `claude-self-review.md`, `deepseek-review.md`, `qwen-review.md`,
   `gemini-review.md` (L3+), `codex-audit.md` (L4).
4. For L2+, synthesize `review-summary.md` (see the review-summary-synthesis prompt).
5. Record the outcome in `decision.json`.

## CODEX GUARD (mandatory)

- Codex is the **External Independent Auditor** and is invoked **only at L4**.
- Never run Codex at L1, L2, or L3.
- Do not inflate a WO to L4 merely to get more review. L4 is reserved for genuinely
  high-risk changes: auth, authz, critical security, payment, critical data migration,
  core runtime with system-wide impact, major production release, or an unresolvable
  reviewer conflict.

## Failure / edge handling

- If `reviewLevel` is missing or not in the set, fail validation — do not guess a level.
- If a required reviewer backend is unavailable, apply the `graceful-degradation` skill
  and record a documented disposition rather than silently skipping.

## Definition of done

The artifacts present in `.aiep/artifacts/<WO-ID>/` exactly match the level's pipeline,
and `decision.json` reflects the aggregated blocking status.
