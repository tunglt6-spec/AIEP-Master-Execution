# Changelog

All notable changes to AIEP are documented here. Format follows
[Keep a Changelog](https://keepachangelog.com/); versioning is
[SemVer](https://semver.org/).

## [1.5.1] — 2026-07-12

### Changed

- **Việt hóa nốt templates + docs/README** (WO-0115): 7 template (work-order, adr,
  rfc, sop, review-summary, claude-self-review, INDEX) và `docs/README.md`. Giữ
  nguyên placeholder `{{...}}`, frontmatter key/enum, code và thuật ngữ tiếng Anh.
  Hoàn tất Việt hóa toàn bộ tài liệu AIEP.

## [1.5.0] — 2026-07-12

### Changed

- **Việt hóa tài liệu (Nhóm 3)** — hoàn tất Việt hóa nhóm tài liệu còn lại (WO-0114):
  - SOP-001..004 + INDEX.
  - AI Engineering Library: README, prompts (giữ nguyên prompt body tiếng Anh),
    skills, knowledge, mcp README.
  - Release docs cũ: RELEASE-NOTES v1.0–v1.2, QUALITY-GATES, RELEASE-CHECKLIST,
    FINAL-RELEASE-REVIEW-PACKAGE.
  - PMO docs: README, backlog, risks, issues, milestones, decision log, 3 sprints.

### Notes

- Chỉ dịch nội dung; giữ nguyên frontmatter key, code/prompt block, .json
  descriptor, liên kết và thuật ngữ kỹ thuật tiếng Anh.
- Với bản này, **toàn bộ tài liệu chính của AIEP đã ở tiếng Việt** (Nhóm 1+2+3).
- Reviewed L1 (WO-0114). 31 tests pass, 9/9 gates.

## [1.4.0] — 2026-07-12

### Changed

- **Việt hóa tài liệu (Nhóm 1 + Nhóm 2)** theo yêu cầu Product Owner. Dịch sang
  tiếng Việt, giữ nguyên cấu trúc/liên kết/code/sơ đồ và thuật ngữ kỹ thuật:
  - Nhóm 1 (WO-0112): PROJECT.md, README.md, Constitution, Governance, Review
    Level Policy, Scope Lock v1.0, Architecture Freeze v1.0.
  - Nhóm 2 (WO-0113): Design Specification, Data Model, ADR-0001..0003,
    RFC-0001/0002, các INDEX.

### Notes

- Chỉ dịch nội dung — không thay đổi chính sách, thiết kế hay quyết định.
- Reviewed L1 (WO-0112, WO-0113). 31 tests pass, 9/9 gates.
- Tài liệu chưa dịch (SOP-001..004, Library, release docs cũ, một số PMO doc) sẽ
  dịch ở bản kế tiếp.

## [1.3.0] — 2026-07-12

### Changed

- **Dashboard giao diện tiếng Việt** (WO-0111) — toàn bộ nhãn hiển thị (tiêu đề
  panel, header bảng, badges, loading/footer) và ánh xạ giá trị dữ liệu
  (present/missing, verdict, status, deliverable, tài sản tri thức, item doctor)
  được Việt hóa tại thời điểm render. Dữ liệu gốc `dashboard.json` và CLI giữ
  nguyên; thuật ngữ kỹ thuật (ReviewLevel, L1–L4, severity, Scope Lock,
  Architecture Freeze) giữ tiếng Anh.

### Added

- **SOP-005 — Lập trình với AI kết hợp AIEP** (WO-0110, viết bằng tiếng Việt):
  quy trình implement → audit độc lập → human-gated deploy, kèm mẫu prompt.

### Notes

- Theo yêu cầu Product Owner: tài liệu & giao diện AIEP viết bằng tiếng Việt để
  kiểm soát/phê duyệt (giữ English cho command/tên file/config key/thuật ngữ).
- WO-0110/0111 reviewed (L1/L2); các false-positive của DeepSeek đã dispositioned.
  31 tests pass, 9/9 gates.

## [1.2.0] — 2026-07-12

### Added

- **`aiep plan "<idea>"`** — draft a Work Order from an idea (WO-0109, RFC-0002
  PoC). Uses a local model to propose title, objective, deliverables and a
  suggested ReviewLevel, with an offline template fallback. Writes only a
  planning document (`status: backlog`) for human review — **no code generation,
  no build, no deploy** (stays within the v1.0 Scope Lock).
- **RFC-0002** — design for AIEP × AI coding agent ("idea → code → audit →
  deploy") with reviewer-independence and human-deploy-gate guarantees. Status
  Proposed (the `implement`/`loop`/`ship` agent loop is v2.0, pending approval).
- `ollamaGenerate` helper for single-shot local-model generation.

### Notes

- Reviewed at L2 (Claude + DeepSeek; Qwen degraded on CPU timeout, dispositioned).
  A DeepSeek false-positive CRITICAL was verified against source and dismissed.
  31 tests passing.

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
