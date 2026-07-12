# SOP-004 — Release Preparation

- **Version:** 1.0
- **Owner:** Execution Lead / PMO
- **Last updated:** 2026-07-12

## Purpose

Define the quality gates and steps to prepare an AIEP v1.0 release, using
`aiep validate` and `aiep package`, so only a fully-governed, gate-passing state is packaged.

## Scope

Applies to preparing a distributable AIEP package (npm tarball) for v1.0. Feature scope
is frozen by Scope Lock v1.0 and Architecture Freeze v1.0; releases add no v2.0 surface.

## Roles

- **Execution Lead** — runs validation and packaging, fixes gate failures.
- **PMO** — confirms Work Order and documentation completeness.

## Quality gates (`aiep validate`)

`aiep validate` runs these gates; any FAIL makes the command exit non-zero:

1. Required governance/documentation artifacts present (PROJECT.md, README.md,
   CHANGELOG.md, Constitution, Governance, Review Level Policy, Scope Lock v1.0,
   Architecture Freeze v1.0, Product Backlog, Decision Log, Risk Register).
2. All Work Orders well-formed and each carries a ReviewLevel.
3. Codex guard — no L1/L2/L3 Work Order carries a `codex-audit.md`.
4. Reviewed Work Orders have their required artifacts for their level.
5. No unresolved CRITICAL findings (FAIL); HIGH findings raise a WARN until dispositioned.
6. No secrets committed (secret scan over tracked files).
7. Scope Lock v1.0 respected — no out-of-scope v2.0 directories present.

Warnings do not fail the build; FAILs do.

## Procedure

1. Confirm all in-scope Work Orders are `done` (or explicitly deferred) — `aiep status`.
2. Rebuild the dashboard data: `aiep dashboard --build`.
3. Run `aiep validate`; resolve every FAIL. Address or disposition WARNs (e.g. HIGH findings).
4. Update `CHANGELOG.md` for the release; confirm `package.json` version.
5. Dry-run the package to inspect contents: `aiep package --dry-run`.
6. Produce the release tarball: `aiep package` (writes to `dist/`). It re-runs the gates
   and refuses to package if any gate FAILs unless `--force` is given — do not use
   `--force` for a real release.
7. Verify the tarball in `dist/` and the printed local install command; capture release
   readiness (`READY`).
8. Commit release artifacts and tag the release per project convention.

## Checklist

- [ ] `aiep status` shows in-scope Work Orders `done` or explicitly deferred.
- [ ] `aiep dashboard --build` run; dashboard data current.
- [ ] `aiep validate` — all gates PASS (WARNs dispositioned).
- [ ] Zero unresolved CRITICAL; HIGH resolved or dispositioned.
- [ ] Secret scan clean; Scope Lock v1.0 respected.
- [ ] `CHANGELOG.md` and `package.json` version updated.
- [ ] `aiep package --dry-run` contents reviewed.
- [ ] `aiep package` produced a tarball in `dist/` without `--force`.
- [ ] Release committed and tagged.

## References

- docs/sop/SOP-001-work-order-lifecycle.md
- docs/sop/SOP-002-review-execution.md
- docs/governance/SCOPE-LOCK-v1.0.md
- docs/governance/ARCHITECTURE-FREEZE-v1.0.md
