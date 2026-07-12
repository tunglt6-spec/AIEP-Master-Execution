# AIEP v1.2.0 — Release Notes

**Release type:** Minor feature release
**Date:** 2026-07-12

## Highlights

### `aiep plan "<idea>"` — turn an idea into a draft Work Order (WO-0109)

```bash
aiep plan "Add JWT-based authentication with refresh tokens to the REST API"
# → draft Work Order (title, objective, deliverables, suggested ReviewLevel)
#   status: backlog — for human review
```

`aiep plan` is the safe, in-scope front of the RFC-0002 loop. It uses a local
model (Ollama) to propose the Work Order fields and a suggested ReviewLevel, and
falls back to a template when the model is unavailable (`--no-ai`). Flags:
`--id WO-XXXX`, `--level L1..L4`, `--force`, `--json`.

**Boundary:** `aiep plan` writes only a planning document. It does **not**
generate source code, build, or deploy — it stays within the v1.0 Scope Lock.

### RFC-0002 — AIEP × AI coding agent (design, Proposed)

Documents how an AI coding agent plugs into AIEP for an "idea → code → audit →
deploy" loop, preserving reviewer independence and a mandatory human deploy gate.
The agent loop (`implement` / `loop` / `ship`) is **v2.0** and pending PO/ARB
approval — not shipped in this release.

## Quality

- 31 automated tests passing (5 new for `plan`).
- All 9 quality gates pass; no unresolved CRITICAL/HIGH.
- WO-0109 reviewed at L2 (Qwen degraded/dispositioned; a DeepSeek false positive
  verified and dismissed).

## Compatibility

- No breaking changes. All v1.0/v1.1 commands and behavior are unchanged.
- Codex guard, review routing and Scope Lock are unaffected.
