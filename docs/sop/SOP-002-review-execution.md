# SOP-002 — Review Execution

- **Version:** 1.0
- **Owner:** Execution Lead
- **Last updated:** 2026-07-12

## Purpose

Standardize how `aiep review` is run, how reviewers are routed per ReviewLevel, how
degraded reviewer backends are handled, and how CRITICAL/HIGH findings are resolved.

## Scope

Applies to every Work Order review. Codex engagement is covered by SOP-003.

## Roles

- **Execution Lead** — runs the review, triages findings, records dispositions.
- **Reviewers** — deepseek & qwen (DeepSeek/Qwen via Ollama), gemini (CLI), codex (CLI, L4 only).

## Reviewer pipeline per level

- **L1** — claude
- **L2** — claude → deepseek → qwen
- **L3** — claude → deepseek → qwen → gemini
- **L4** — claude → deepseek → qwen → gemini → codex

Reviewers run in order. Claude self review always runs first. Each reviewer writes an
artifact into `.aiep/artifacts/<WO-ID>/`:
`claude-self-review.md`, `deepseek-review.md`, `qwen-review.md`, `gemini-review.md`
(L3+), `codex-audit.md` (L4), plus `review-summary.md` (L2+) and `decision.json`.

## Procedure

1. Ensure prerequisites for the target level: Ollama running at the configured
   endpoint for deepseek/qwen; `gemini` CLI on PATH for L3+; `codex` CLI on PATH for L4.
   Run `aiep doctor` to check backends.
2. Run the review:
   - Single WO: `aiep review <WO-ID>`
   - All non-done WOs: `aiep review`
   - Scope the diff against a base ref when needed: `aiep review <WO-ID> --base <ref>`
   - Machine-readable output: append `--json`.
3. Read the console verdict (`PASS` or `CHANGES_REQUESTED`) and the CRITICAL/HIGH counts.
4. Open `.aiep/artifacts/<WO-ID>/review-summary.md` (or `aiep artifacts <WO-ID>`) and
   review findings by severity and per-reviewer status.
5. Handle any degraded/error reviewer (see below) with a documented disposition.
6. Resolve every CRITICAL and HIGH finding (see below).
7. Re-run `aiep review <WO-ID>` until the verdict is `PASS`.

## Handling degraded backends

A reviewer reports `degraded` when its backend is unavailable (e.g. Ollama down, or
`gemini`/`codex` not on PATH), or `error` when its invocation fails. In these cases:

- The reviewer writes an integration-decision artifact; the pipeline does not silently skip it.
- Preferred: provision the tool (start Ollama / install the CLI) and re-run the review.
- If the tool genuinely cannot be provisioned, record a **documented disposition** in
  `review-summary.md` (Disposition section) explaining why, and the residual risk accepted.
- A degraded reviewer never converts a CRITICAL/HIGH into a pass — blocking findings
  from other reviewers still block.

## Resolving CRITICAL / HIGH findings

CRITICAL and HIGH are blocking (`verdict: CHANGES_REQUESTED`). For each:

1. Reproduce/understand the finding from the reviewer artifact.
2. Fix the code, OR record an explicit disposition: accept-with-rationale, or defer to
   a new Work Order (link it) — only where justified and risk-owned.
3. Re-run `aiep review <WO-ID>`; confirm the count drops and the verdict becomes `PASS`.
4. CRITICAL findings must reach zero. HIGH findings must be resolved or dispositioned
   (they surface as a `aiep validate` warning until addressed).

## Checklist

- [ ] `aiep doctor` shows the backends needed for this ReviewLevel.
- [ ] `aiep review <WO-ID>` executed; correct pipeline ran for the level.
- [ ] Every reviewer status reviewed; degraded/error backends dispositioned.
- [ ] Zero unresolved CRITICAL; all HIGH resolved or dispositioned.
- [ ] Verdict `PASS` on final run.
- [ ] Artifacts and `decision.json` present under `.aiep/artifacts/<WO-ID>/`.

## References

- docs/sop/SOP-001-work-order-lifecycle.md
- docs/sop/SOP-003-codex-l4-audit.md
- templates/review-summary.template.md
- docs/governance/REVIEW-LEVEL-POLICY.md
