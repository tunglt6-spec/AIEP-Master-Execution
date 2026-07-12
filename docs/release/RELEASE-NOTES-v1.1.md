# AIEP v1.1.0 — Release Notes

**Release type:** Minor feature release
**Date:** 2026-07-12

## Highlights

### `aiep init` — use AIEP on any project (WO-0108)

```bash
npm install -g @tunglt6/aiep
cd /your/project
aiep init            # scaffold a working AIEP workspace
aiep validate        # 9/9 gates pass out of the box
```

`aiep init [dir]` scaffolds a complete, valid AIEP workspace into any directory:

- `.aiep/config.json` (reviewers, review levels L1–L4, Codex guard — reused from
  the installed package with the project name retargeted).
- Dashboard frontend and templates copied from the package.
- Concise starter governance/PMO documents (Constitution, Governance, Review
  Level Policy, Scope Lock, Architecture Freeze, Product Backlog, Decision Log,
  Risk Register) plus PROJECT/README/CHANGELOG.
- A sample Work Order (`WO-0001`) and a `.gitignore`.

It is **idempotent** — existing files are never overwritten unless `--force` is
given.

## Quality

- 26 automated tests passing (3 new for `init`, including one that runs the real
  `aiep validate` inside a freshly scaffolded workspace).
- All 9 quality gates pass; no unresolved CRITICAL/HIGH findings.

## Review

- WO-0108 reviewed at **L2**: Claude self review + real DeepSeek review; Qwen
  degraded (CPU timeout on the larger delta) recorded as a documented
  disposition. A DeepSeek false-positive CRITICAL was verified against source and
  dismissed.

## Compatibility

- No breaking changes. All v1.0 commands and behavior are unchanged.
- Codex guard, review routing and Scope Lock are unaffected.
