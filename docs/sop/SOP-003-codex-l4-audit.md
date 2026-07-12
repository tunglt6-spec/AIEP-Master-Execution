# SOP-003 — Codex L4 Audit

- **Version:** 1.0
- **Owner:** Execution Lead / ARB
- **Last updated:** 2026-07-12

## Purpose

Define exactly when and how Codex — the External Independent Auditor — is engaged, and
how the Codex Guard preserves tokens by restricting Codex to ReviewLevel L4 only.

## Scope

Codex is NOT a default reviewer. It is invoked only within the L4 pipeline
(claude → deepseek → qwen → gemini → codex) and never at L1/L2/L3. This SOP governs
that engagement and the guard that enforces it.

## Roles

- **Execution Lead** — justifies L4, runs the review, resolves the audit findings.
- **ARB / Chief Architect** — confirms the change genuinely warrants L4.
- **Codex** — external independent audit of critical correctness, security, architecture
  and release risk; writes `codex-audit.md`.

## When to engage Codex (L4 only)

Assign L4 (and therefore Codex) ONLY for genuinely high-risk change:

- Authentication or authorization.
- Critical security surface.
- Payment handling.
- Critical data migration.
- Core runtime with system-wide impact.
- Major production release.
- An unresolvable reviewer conflict at a lower level.

Do NOT inflate a Work Order to L4 merely to obtain more review depth. If none of the
above apply, the correct level is L1–L3 and Codex must not run.

## The Codex Guard (token preservation)

- Configured in `.aiep/config.json` under `codexGuard` (`enabled: true`, `allowedLevels: ["L4"]`).
- Enforced in depth: the review router filters Codex out of any non-L4 pipeline, and
  the Codex reviewer itself hard-refuses (throws a guard-violation) below L4.
- `aiep validate` fails if a `codex-audit.md` artifact is found under a non-L4 Work Order.
- Rationale: Codex is expensive; the guard prevents wasted external-audit tokens and
  keeps Codex reserved for high-risk work.

## Procedure

1. Confirm the Work Order meets an L4 trigger above; record the justification in the WO
   ReviewLevel rationale. Have ARB confirm for production-release or security changes.
2. Set `reviewLevel: L4` in the Work Order frontmatter.
3. Ensure the `codex` CLI is installed and on PATH (`aiep doctor`).
4. Run `aiep review <WO-ID>`. The full L4 pipeline runs; Codex runs last.
5. If `codex` is unavailable, the auditor degrades and writes an integration-decision
   artifact; record it as a documented disposition (per SOP-002) — do not downgrade the
   level to bypass the audit.
6. Read `.aiep/artifacts/<WO-ID>/codex-audit.md`; resolve all CRITICAL/HIGH findings and
   re-run until the verdict is `PASS`.

## Checklist

- [ ] L4 justified against a documented trigger; rationale recorded in the WO.
- [ ] `reviewLevel: L4` set (not inflated from a lower-risk change).
- [ ] `codex` CLI available, or degraded run recorded as a documented disposition.
- [ ] `codex-audit.md` produced and reviewed.
- [ ] No Codex artifact exists under any non-L4 Work Order (guard respected).
- [ ] All CRITICAL/HIGH from the audit resolved; verdict `PASS`.

## References

- docs/sop/SOP-002-review-execution.md
- docs/governance/REVIEW-LEVEL-POLICY.md
- .aiep/config.json (`codexGuard`)
