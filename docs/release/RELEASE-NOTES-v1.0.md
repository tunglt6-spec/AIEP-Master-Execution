# AIEP v1.0.0 — Ghi chú Phát hành

**Loại phát hành:** Release Candidate (đang chờ Product Owner & ARB rà soát cuối)
**Ngày:** 2026-07-12

## Tóm tắt

AIEP v1.0 cung cấp một nền tảng kỹ thuật AI vận hành theo governance: một CLI
Node.js không phụ thuộc gói (zero-dependency) chạy quy trình review mã do AI hỗ trợ
theo nhiều cấp (L1–L4), quản lý công việc thông qua PMO, tuyển chọn một thư viện
kỹ thuật AI tái sử dụng, và hiển thị một dashboard trực tiếp.

## Bao gồm những gì (năm deliverable sản phẩm)

1. **Core Repository & CLI** — `aiep status | validate | review | artifacts |
   doctor | dashboard | package`.
2. **Hệ thống Tài liệu** — hiến pháp (constitution), governance, đặc tả thiết kế +
   mô hình dữ liệu, các ADR, RFC, SOP, tài liệu release.
3. **Thư viện Kỹ thuật AI** — prompt, skill, MCP descriptor, tri thức.
4. **PMO** — backlog, 3 sprint, milestone, 24 Work Order, issue, risk, quyết định.
5. **Dashboard** — mười panel dữ liệu trực tiếp.

## Mô hình review

- Các Review Level L1–L4 với pipeline reviewer cho từng cấp.
- Review cục bộ DeepSeek + Qwen qua Ollama (review cục bộ kép, thực sự).
- Review thiết kế Gemini và audit L4 Codex qua CLI, có suy giảm nhẹ nhàng (graceful degradation).
- **Codex guard:** chỉ audit bên ngoài ở L4; không dùng Codex trong v1.0 theo thiết kế.

## Chất lượng

- 23 test tự động (`node:test`) — tất cả đều pass.
- 8 quality gate qua `aiep validate`.
- Không còn finding CRITICAL/HIGH chưa xử lý; không commit secret; Scope Lock được tôn trọng.

## Giới hạn đã biết

- Việc trích xuất finding từ model cục bộ là best-effort (theo giao thức có cấu trúc `FINDING:`);
  output thô được lưu giữ.
- Gemini/Codex cần có CLI trên PATH; nếu không, các bước của chúng là disposition được ghi lại thành tài liệu.

## Nâng cấp / cài đặt

```bash
npm install -g .        # zero dependencies; offline-capable
aiep doctor && aiep status
```
