# AIEP Decision Log

Chronological record of material decisions. Architecture decisions also have an
ADR under `docs/adr/`.

| # | Date | Decision | Rationale | Ref |
|---|------|----------|-----------|-----|
| D-01 | 2026-07-12 | Runtime = Node.js ESM, zero runtime dependencies | Offline install, small supply-chain surface, one runtime for CLI+dashboard+packaging | ADR-0001 |
| D-02 | 2026-07-12 | Adopt L1–L4 review levels with per-level reviewer pipelines | Review effort proportional to risk; machine-readable routing | ADR-0002 |
| D-03 | 2026-07-12 | Codex restricted to L4 (defence-in-depth guard) | Preserve scarce external-audit tokens; avoid throttling delivery | ADR-0003 |
| D-04 | 2026-07-12 | Work Orders = Markdown + controlled frontmatter; artifacts + decision.json in JSON | Human-readable planning, machine-readable evidence | ADR-0001 |
| D-05 | 2026-07-12 | Reviewer backends pluggable with graceful degradation (integration decisions) | Honest reporting when backends absent; never fake a pass | Review Level Policy |
| D-06 | 2026-07-12 | Dashboard reads only live generated data | No demo numbers presented as production data | Architecture Freeze v1.0 |
| D-07 | 2026-07-12 | Pull `deepseek-coder:1.3b` locally to enable real dual local review | Ollama had only `qwen3:8b`; a small DeepSeek model enables genuine L2/L3 local code review at no cloud cost | Doctor / R-02 |
| D-08 | 2026-07-12 | No v1.0 Work Order assigned L4 | None met the high-risk bar; do not inflate levels to raise review depth | Review Level Policy |
| D-09 | 2026-07-12 | Add `aiep init` (WO-0108) after v1.0 at Product Owner request | Enables AIEP to govern any project, not just its own repo; addresses the documented v1.0 limitation. Reviewed L2 (DeepSeek completed, Qwen degraded/dispositioned); a DeepSeek false-positive CRITICAL was verified against source + tests and dismissed | WO-0108 |
| D-10 | 2026-07-12 | RFC-0002 (AI coding agent) + `aiep plan` PoC (WO-0109) | Document the idea→code→audit→deploy integration (v2.0 candidate) and ship the in-scope front (idea→draft Work Order) without crossing Scope Lock (no code-gen/deploy). Reviewed L2; DeepSeek false-positive CRITICAL (error handling) dismissed after source verification; Qwen degraded/dispositioned | RFC-0002, WO-0109 |
| D-11 | 2026-07-12 | Tài liệu & giao diện AIEP viết bằng tiếng Việt (theo yêu cầu PO) | PO cần đọc/duyệt; SOP-005 viết lại tiếng Việt (WO-0110), dashboard Việt hóa (WO-0111). Giữ English cho command/tên file/config key/thuật ngữ. Tài liệu tiếng Anh cũ dịch dần theo ưu tiên. Đồng thời dọn WO-0500 (rác do test-race, đã sửa withTempDir) | WO-0110, WO-0111 |
