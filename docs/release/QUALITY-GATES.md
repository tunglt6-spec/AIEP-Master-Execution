# AIEP Quality Gates

The quality gates are enforced by `aiep validate` (see `src/cli/validate.js`).
A release candidate must pass every FAIL-level gate; WARN-level gates require a
documented disposition.

| # | Gate | Level | What it checks |
|---|------|-------|----------------|
| 1 | Required documents present | FAIL | PROJECT/README/CHANGELOG + Constitution, Governance, Review Level Policy, Scope Lock, Architecture Freeze, Product Backlog, Decision Log, Risk Register |
| 2 | Work Orders present & valid | FAIL | Every WO parses and carries a valid `reviewLevel` and required fields |
| 3 | Codex guard | FAIL | No `codex-audit.md` artifact at any non-L4 Work Order |
| 4 | Artifact completeness | FAIL | Reviewed WOs contain the artifacts required by their level |
| 5 | No unresolved CRITICAL | FAIL | Sum of CRITICAL findings across `decision.json` is zero |
| 6 | No unresolved HIGH | WARN | HIGH findings require a documented disposition |
| 7 | No secrets committed | FAIL | Secret scan across tracked files is clean |
| 8 | Scope Lock respected | FAIL | No out-of-scope v2.0 surfaces present |

## Running

```bash
aiep validate          # human-readable
aiep validate --json   # machine-readable; exit code 1 on any FAIL
```

## Interpreting results

- **All FAIL gates pass** → the repository meets release readiness for gates.
- **WARN present** → allowed to release only with a recorded disposition in the
  Decision Log or the relevant Work Order.
