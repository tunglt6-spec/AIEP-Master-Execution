<!-- PR title: AIEP v1.0.0 — AI Engineering Platform (Release Candidate) -->
<!-- PR base: main  •  head: feature/aiep-v1.0-implementation -->

## Tổng quan

Triển khai hoàn chỉnh **AIEP v1.0 (AI Engineering Platform)** từ repository trống đến
trạng thái release candidate: một CLI Node.js **zero-dependency** quản trị công việc
bằng Work Order, chạy **AI code review đa cấp (L1–L4)**, lưu evidence, và hiển thị
dashboard dữ liệu thật. Phạm vi đúng theo **Scope Lock v1.0** — 5 product deliverable,
không mở rộng v2.0.

## Nội dung chính (5 Product Deliverables)

- **Core Repository & CLI** — `aiep status | validate | review | artifacts | doctor | dashboard | package`
- **Documentation System** — Constitution, Governance, Review Level Policy, Scope Lock,
  Architecture Freeze, ADR-0001..0003, RFC-0001, Design Spec + Data Model, SOP-001..004,
  release docs, User Guide
- **AI Engineering Library** — prompts (6), skills (4), MCP (2 descriptors), knowledge (5)
- **PMO** — backlog, 3 sprints, milestones, **24 Work Orders**, issues, risk register, decision log
- **Dashboard** — 10 panel light/modern đọc dữ liệu thật

## Mô hình review & Codex usage

| Level | Pipeline |
|-------|----------|
| L1 | claude |
| L2 | claude → deepseek → qwen |
| L3 | claude → deepseek → qwen → gemini |
| L4 | claude → deepseek → qwen → gemini → codex |

- Phân bố ReviewLevel: **L1=8, L2=13, L3=3, L4=0** (không nâng cấp giả để tăng mức review).
- **Codex usage = 0.** Không WO nào đạt ngưỡng L4. **Codex Guard** (chỉ L4) thực thi 4 lớp
  (config → reviewMatrix → codex.js → validate) và được kiểm chứng bằng unit test — bảo đảm
  guard mà không tốn token Codex.
- **DeepSeek + Qwen** chạy review thật qua Ollama; **Gemini/Codex** dùng graceful degradation
  (CLI vắng → documented integration decision, không hard block cho L1–L3).

## Bằng chứng chất lượng

- ✅ `aiep validate` — **9/9 quality gate PASS, 0 warning**
- ✅ `npm test` — **23/23 tests PASS** (`node:test`)
- ✅ `aiep package` — tạo `dist/aiep-1.0.0.tgz`
- ✅ Dashboard render đã xác minh trên browser

## Review evidence & disposition

Đã chạy review thật trên **WO-0105 (L3)** và **WO-0204 (L3)**: Claude + DeepSeek + Qwen
chạy thật, Gemini degraded. DeepSeek (model 1.3B) tạo 2 **false positive CRITICAL**; cả hai
đã được **xác minh với source** và ghi **documented disposition (dismissed)** — minh hoạ đúng
quy trình finding → verify → disposition. Net: **0 unresolved CRITICAL/HIGH**.

## Cách chạy & kiểm tra

```bash
npm install -g .        # zero-dependency, offline được
aiep doctor             # kiểm tra môi trường & reviewer backends
aiep validate           # 9/9 gates
npm test                # 23/23
aiep dashboard          # http://127.0.0.1:4173
```

Chi tiết: `docs/USER-GUIDE.md`.

## Phạm vi & ranh giới

- Không có secret trong repo (secret scanner quét toàn bộ tracked files, gate PASS).
- Không phát sinh chi phí cloud (model DeepSeek pull local).
- Không tự merge `main`, không deploy production — dành cho ARB/PO quyết định.

## Known limitations

- Trích xuất finding từ local model là best-effort (giao thức `FINDING:`), raw output luôn lưu.
- Gemini/Codex cần CLI trên PATH; nếu vắng → documented disposition.
- Latency qwen3:8b trên CPU vài phút/WO; tinh chỉnh bằng `AIEP_OLLAMA_NUM_PREDICT` / `AIEP_OLLAMA_TIMEOUT_MS`.

## Checklist cho reviewer (ARB/PO)

- [ ] Governance: `docs/constitution/CONSTITUTION.md`, `docs/governance/*`
- [ ] Review routing & Codex guard: `src/core/reviewMatrix.js`, `src/reviewers/index.js`, `src/reviewers/codex.js`
- [ ] Design: `docs/design/DESIGN-SPECIFICATION-v1.0.md`, `DATA-MODEL.md`; RFC: `docs/rfc/RFC-0001-*`
- [ ] Quality gates: `src/cli/validate.js` + `docs/release/QUALITY-GATES.md`
- [ ] Final Release Review Package: `docs/release/FINAL-RELEASE-REVIEW-PACKAGE.md`

**Verdict:** READY FOR PRODUCT OWNER & ARB FINAL REVIEW.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
