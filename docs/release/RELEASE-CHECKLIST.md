# AIEP Release Checklist (v1.0)

Use this checklist to promote a release candidate. Tick every item.

## Build & test

- [ ] `npm test` — all suites pass.
- [ ] `node bin/aiep.js doctor` — environment reviewed (degraded backends noted).
- [ ] `node bin/aiep.js validate` — all FAIL gates pass; WARN dispositioned.

## Review evidence

- [ ] Every non-trivial Work Order has a ReviewLevel.
- [ ] Reviewed Work Orders have their required artifacts under `.aiep/artifacts/`.
- [ ] No unresolved CRITICAL findings.
- [ ] HIGH findings resolved or dispositioned in the Decision Log / Work Order.
- [ ] Codex guard verified (no Codex below L4; unit tests green).

## Documentation

- [ ] PROJECT.md, README.md, CHANGELOG.md current.
- [ ] Governance suite present and consistent (Constitution, Governance, Review
      Level Policy, Scope Lock, Architecture Freeze).
- [ ] Design specification and data model current.
- [ ] Release notes written.

## PMO

- [ ] Backlog, sprints, milestones and risks reflect actual state.
- [ ] Decision Log updated with release decisions.

## Packaging

- [ ] `node bin/aiep.js package --dry-run` reviewed.
- [ ] `node bin/aiep.js package` produces a tarball in `dist/`.
- [ ] Local install verified: `npm install -g ./dist/aiep-1.0.0.tgz`.

## Sign-off

- [ ] Final Release Review Package assembled (`FINAL-RELEASE-REVIEW-PACKAGE.md`).
- [ ] Submitted to Product Owner & ARB for final review.
