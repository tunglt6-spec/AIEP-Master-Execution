# AIEP v1.0.0 — Final Release Review Package

This package assembles the evidence for Product Owner & ARB final review.

## 1. Identity

| Field | Value |
|-------|-------|
| Product | AIEP — AI Engineering Platform |
| Version | 1.0.0 (Release Candidate) |
| Branch | `feature/aiep-v1.0-implementation` |
| Runtime | Node.js >= 18, ESM, zero runtime dependencies |
| Scope Lock | v1.0 |
| Architecture Freeze | v1.0 |

## 2. Product deliverables (all present)

1. **Core Repository & CLI** — `bin/`, `src/core/`, `src/reviewers/`, `src/cli/`,
   `src/dashboard/`.
2. **Documentation System** — `docs/constitution|governance|design|adr|rfc|sop|release`.
3. **AI Engineering Library** — `library/prompts|skills|mcp|knowledge`.
4. **PMO** — `pmo/backlog|sprints|milestones|work-orders|issues|risks|decisions`.
5. **Dashboard** — `dashboard/` (ten live-data panels).

## 3. Work Orders

24 Work Orders across 4 phases. ReviewLevel distribution: **L1 = 8, L2 = 13,
L3 = 3, L4 = 0**. See `pmo/backlog/PRODUCT-BACKLOG.md`.

## 4. Review model & Codex usage

- Review Levels L1–L4 route to reviewer pipelines (ADR-0002).
- **Codex usage: 0** — no Work Order met the L4 high-risk bar (ADR-0003). The
  Codex L4 guard is enforced in code and verified by unit tests without spending
  Codex tokens.
- Real local review demonstrated on **WO-0204 (L3)**: Claude + DeepSeek + Qwen ran
  for real via Ollama; Gemini degraded gracefully (CLI not installed). One
  DeepSeek false positive was verified against source and given a documented
  disposition (`.aiep/artifacts/WO-0204/dispositions.json`).

## 5. Quality gates (`aiep validate`)

All 9 gates PASS, 0 warnings: required docs, WO validity + ReviewLevel, Codex
guard, artifact completeness, no unresolved CRITICAL, no unresolved HIGH (post-
disposition), no secrets, Scope Lock.

## 6. Tests

`npm test` — **23 tests, all passing** (`node:test`): frontmatter parser, review
matrix & Codex guard, WO loader, findings parser, dispositions, validation.

## 7. Packaging

`aiep package` produces `dist/tunglt6-aiep-1.0.0.tgz`. Install: `npm install -g
./dist/tunglt6-aiep-1.0.0.tgz`.

## 8. Artifacts index (review evidence)

- `.aiep/artifacts/WO-0204/` — claude-self-review, deepseek-review, qwen-review,
  gemini-review, review-summary, decision.json, dispositions.json.

## 9. Files for ARB final review (priority)

- `docs/constitution/CONSTITUTION.md`
- `docs/governance/REVIEW-LEVEL-POLICY.md`, `SCOPE-LOCK-v1.0.md`, `ARCHITECTURE-FREEZE-v1.0.md`
- `docs/adr/ADR-0001..0003`
- `docs/design/DESIGN-SPECIFICATION-v1.0.md`, `DATA-MODEL.md`
- `docs/rfc/RFC-0001-review-level-policy.md`
- `src/core/reviewMatrix.js`, `src/reviewers/index.js` (routing + guard)

## 10. Known limitations

- Local-model finding extraction is best-effort (structured `FINDING:` protocol);
  raw output preserved.
- Gemini/Codex require their CLIs on PATH; otherwise their steps are documented
  dispositions.
- qwen3:8b review latency on CPU is minutes-per-WO; `AIEP_OLLAMA_NUM_PREDICT` and
  `AIEP_OLLAMA_TIMEOUT_MS` tune it.

## 11. Verdict

**READY FOR PRODUCT OWNER & ARB FINAL REVIEW.**
