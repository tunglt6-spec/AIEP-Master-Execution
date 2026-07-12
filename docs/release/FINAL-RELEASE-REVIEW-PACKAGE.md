# AIEP v1.0.0 — Final Release Review Package

Gói này tập hợp bằng chứng cho việc rà soát cuối của Product Owner & ARB.

## 1. Định danh

| Trường | Giá trị |
|-------|-------|
| Sản phẩm | AIEP — AI Engineering Platform |
| Phiên bản | 1.0.0 (Release Candidate) |
| Nhánh | `feature/aiep-v1.0-implementation` |
| Runtime | Node.js >= 18, ESM, zero runtime dependencies |
| Scope Lock | v1.0 |
| Architecture Freeze | v1.0 |

## 2. Deliverable sản phẩm (đều đầy đủ)

1. **Core Repository & CLI** — `bin/`, `src/core/`, `src/reviewers/`, `src/cli/`,
   `src/dashboard/`.
2. **Hệ thống Tài liệu** — `docs/constitution|governance|design|adr|rfc|sop|release`.
3. **Thư viện Kỹ thuật AI** — `library/prompts|skills|mcp|knowledge`.
4. **PMO** — `pmo/backlog|sprints|milestones|work-orders|issues|risks|decisions`.
5. **Dashboard** — `dashboard/` (mười panel dữ liệu trực tiếp).

## 3. Work Orders

24 Work Order trên 4 phase. Phân bố ReviewLevel: **L1 = 8, L2 = 13,
L3 = 3, L4 = 0**. Xem `pmo/backlog/PRODUCT-BACKLOG.md`.

## 4. Mô hình review & việc sử dụng Codex

- Các Review Level L1–L4 định tuyến tới các pipeline reviewer (ADR-0002).
- **Sử dụng Codex: 0** — không Work Order nào đạt ngưỡng rủi ro cao L4 (ADR-0003).
  Codex L4 guard được thực thi trong mã và được xác minh bằng unit test mà không tiêu
  tốn token Codex.
- Review cục bộ thật được minh chứng trên **WO-0204 (L3)**: Claude + DeepSeek + Qwen chạy
  thật qua Ollama; Gemini suy giảm nhẹ nhàng (CLI chưa cài). Một false positive của
  DeepSeek đã được đối chiếu với mã nguồn và được cấp một disposition có tài liệu
  (`.aiep/artifacts/WO-0204/dispositions.json`).

## 5. Quality gate (`aiep validate`)

Cả 9 gate PASS, 0 cảnh báo: tài liệu bắt buộc, tính hợp lệ WO + ReviewLevel, Codex
guard, tính đầy đủ artifact, không còn CRITICAL chưa xử lý, không còn HIGH chưa xử lý (sau
disposition), không có secret, Scope Lock.

## 6. Tests

`npm test` — **23 test, tất cả đều pass** (`node:test`): frontmatter parser, review
matrix & Codex guard, WO loader, findings parser, disposition, validation.

## 7. Đóng gói (Packaging)

`aiep package` tạo ra `dist/tunglt6-aiep-1.0.0.tgz`. Cài đặt: `npm install -g
./dist/tunglt6-aiep-1.0.0.tgz`.

## 8. Chỉ mục artifact (bằng chứng review)

- `.aiep/artifacts/WO-0204/` — claude-self-review, deepseek-review, qwen-review,
  gemini-review, review-summary, decision.json, dispositions.json.

## 9. Tệp cho ARB rà soát cuối (theo ưu tiên)

- `docs/constitution/CONSTITUTION.md`
- `docs/governance/REVIEW-LEVEL-POLICY.md`, `SCOPE-LOCK-v1.0.md`, `ARCHITECTURE-FREEZE-v1.0.md`
- `docs/adr/ADR-0001..0003`
- `docs/design/DESIGN-SPECIFICATION-v1.0.md`, `DATA-MODEL.md`
- `docs/rfc/RFC-0001-review-level-policy.md`
- `src/core/reviewMatrix.js`, `src/reviewers/index.js` (định tuyến + guard)

## 10. Giới hạn đã biết

- Việc trích xuất finding từ model cục bộ là best-effort (theo giao thức có cấu trúc `FINDING:`);
  output thô được lưu giữ.
- Gemini/Codex cần có CLI trên PATH; nếu không, các bước của chúng là disposition được ghi lại thành tài liệu.
- Độ trễ review qwen3:8b trên CPU là vài phút mỗi WO; `AIEP_OLLAMA_NUM_PREDICT` và
  `AIEP_OLLAMA_TIMEOUT_MS` dùng để tinh chỉnh.

## 11. Kết luận

**SẴN SÀNG CHO PRODUCT OWNER & ARB RÀ SOÁT CUỐI.**
