# Changelog

All notable changes to AIEP are documented here. Format follows
[Keep a Changelog](https://keepachangelog.com/); versioning is
[SemVer](https://semver.org/).

## [1.1.0] — 2026-07-12

### Added

- **`aiep init [dir]`** — scaffold a working AIEP workspace into any project
  (WO-0108). Reuses the installed platform's config, dashboard frontend and
  templates; writes concise starter governance/PMO docs and a sample Work Order;
  idempotent (no overwrite without `--force`). `aiep validate` passes in a freshly
  initialized workspace. Addresses the v1.0 "no init" limitation.

### Notes

- Reviewed at L2 (Claude self review + DeepSeek; Qwen degraded on CPU timeout and
  recorded as a documented disposition). A DeepSeek false-positive CRITICAL was
  verified against source and tests, then dismissed. 26 tests passing.

## [1.0.0] — 2026-07-12

Initial release candidate. Full AIEP v1.0 scope across five product deliverables.

### Added

- **Core Repository & CLI** — zero-dependency Node.js ESM CLI (`aiep`) with
  commands: `status`, `validate`, `review`, `artifacts`, `doctor`, `dashboard`,
  `package`.
- **Review engine** — ReviewLevel policy (L1–L4), review matrix & routing,
  git-delta-focused review, per-reviewer artifacts, consolidated
  `review-summary.md` and `decision.json`.
- **Reviewer integrations** — Claude self review; DeepSeek (code) and Qwen
  (technical) local reviewers via the Ollama HTTP API; Gemini design reviewer and
  Codex auditor via CLI, all with graceful degradation.
- **Codex L4 guard** — Codex restricted to L4 with defence in depth (matrix,
  reviewer, router, validation) and unit tests; zero Codex usage in v1.0 by design.
- **Documentation System** — Constitution, Governance, Review Level Policy, Scope
  Lock v1.0, Architecture Freeze v1.0, ADR-0001..0003, RFC-0001, design
  specification & data model, SOP-001..004, release docs.
- **AI Engineering Library** — prompt, skill, MCP and knowledge libraries.
- **PMO** — product backlog, three sprints, milestones, 24 Work Orders, issues,
  risk register, decision log.
- **Dashboard** — light, modern, ten-panel dashboard reading live data via a
  built-in static server.
- **Quality gates & packaging** — `aiep validate`, `aiep package`, install and
  bootstrap scripts, release checklist and Final Release Review Package.
- **Tests** — `node:test` suites for the frontmatter parser, review matrix &
  Codex guard, Work Order loader, findings parser and validation.

### Notes

- Environment provisioning: DeepSeek (`deepseek-coder:1.3b`) and Qwen
  (`qwen3:8b`) available via Ollama. Gemini/Codex CLIs are optional; absent, their
  review steps are recorded as documented dispositions.
