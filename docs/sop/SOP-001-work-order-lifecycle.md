# SOP-001 — Work Order Lifecycle

- **Version:** 1.0
- **Owner:** PMO / Execution Lead
- **Last updated:** 2026-07-12

## Purpose

Define how a Work Order (WO) moves from `backlog` to `done` in AIEP v1.0, including
how its ReviewLevel is assigned, so every unit of change is tracked, reviewed at the
correct depth, and traceable.

## Scope

All Work Orders under `pmo/work-orders/<WO-ID>/work-order.md`. Each WO carries exactly
one ReviewLevel. Out-of-scope (Scope Lock v1.0) v2.0 features must never be turned
into Work Orders.

## Roles

- **Execution Lead (Claude Code)** — authors the WO, implements, runs self review.
- **PMO** — owns backlog, status accuracy, and traceability.
- **Reviewers** — deepseek, qwen, gemini, codex, engaged per ReviewLevel.

## Status model

`backlog → planned → in-progress → in-review → done`, with `blocked` reachable from
any active state. These are the only valid `status` values.

## ReviewLevel assignment

Assign the lowest level that honestly covers the risk:

- **L1** — structural/scaffolding, docs, no runtime or security surface.
- **L2** — normal code change with logic; local reviewers add correctness/quality.
- **L3** — cross-cutting design or architecture-touching change; adds Gemini design review.
- **L4** — genuinely high-risk only: auth/authz, critical security, payment, critical
  data migration, core runtime with system-wide impact, major production release, or
  an unresolvable reviewer conflict. L4 is the ONLY level that invokes Codex.

Do not inflate a WO to L4 to "get more review". See SOP-003 for the Codex guard.

## Procedure

1. **Create** the WO from `templates/work-order.template.md`; fill frontmatter
   (`id, title, phase, reviewLevel, status, owner`) and body sections. Set `status: backlog`.
2. **Plan** — refine Objective, Scope, Deliverables and Definition of Done; set
   `status: planned`. Record the ReviewLevel rationale in the body.
3. **Implement** — set `status: in-progress`; author the change as a logical unit.
   Apply the Rule of Three where the deliverable is reusable (Code + Knowledge + Standard asset).
4. **Self review** — run `aiep review <WO-ID>`; Claude self review runs first at every level.
5. **Route reviewers** — the pipeline runs automatically per ReviewLevel (see SOP-002).
   Set `status: in-review`.
6. **Resolve findings** — fix or document a disposition for every CRITICAL/HIGH finding
   (SOP-002). Re-run `aiep review <WO-ID>` until the verdict is `PASS`.
7. **Validate** — run `aiep validate`; all quality gates must pass.
8. **Commit** the change as one logical delivery unit; set `status: done`.
9. **Block/unblock** — if progress is not possible, set `status: blocked` and record why
   in the WO body; return to the prior active state once cleared.

## Checklist

- [ ] Frontmatter complete and valid (`aiep validate` gate passes).
- [ ] Exactly one ReviewLevel, with rationale in the body.
- [ ] Definition of Done fully addressed.
- [ ] `aiep review <WO-ID>` verdict is `PASS` (no unresolved CRITICAL/HIGH).
- [ ] Artifacts present under `.aiep/artifacts/<WO-ID>/`.
- [ ] `aiep validate` gates pass.
- [ ] Change committed; `status: done`.

## References

- templates/work-order.template.md
- docs/sop/SOP-002-review-execution.md
- docs/sop/SOP-003-codex-l4-audit.md
- docs/governance/REVIEW-LEVEL-POLICY.md
- docs/governance/SCOPE-LOCK-v1.0.md
