# AIEP v1.2.0 — Ghi chú Phát hành

**Loại phát hành:** Phát hành tính năng nhỏ (minor)
**Ngày:** 2026-07-12

## Điểm nổi bật

### `aiep plan "<idea>"` — biến một ý tưởng thành Work Order nháp (WO-0109)

```bash
aiep plan "Add JWT-based authentication with refresh tokens to the REST API"
# → draft Work Order (title, objective, deliverables, suggested ReviewLevel)
#   status: backlog — for human review
```

`aiep plan` là phần đầu an toàn, trong phạm vi (in-scope) của vòng lặp RFC-0002. Nó dùng một
model cục bộ (Ollama) để đề xuất các trường của Work Order và một ReviewLevel gợi ý, và
lùi về (fallback) một template khi model không khả dụng (`--no-ai`). Các cờ:
`--id WO-XXXX`, `--level L1..L4`, `--force`, `--json`.

**Ranh giới:** `aiep plan` chỉ ghi ra một tài liệu lập kế hoạch. Nó **không**
sinh mã nguồn, build, hay deploy — nó nằm trong Scope Lock v1.0.

### RFC-0002 — AIEP × AI coding agent (thiết kế, Proposed)

Ghi lại cách một AI coding agent gắn vào AIEP để tạo vòng lặp "idea → code → audit →
deploy", giữ tính độc lập của reviewer và một cổng deploy bắt buộc do con người thực hiện.
Vòng lặp agent (`implement` / `loop` / `ship`) là **v2.0** và đang chờ PO/ARB
phê duyệt — không được phát hành trong bản này.

## Chất lượng

- 31 test tự động pass (5 test mới cho `plan`).
- Cả 9 quality gate đều pass; không còn CRITICAL/HIGH chưa xử lý.
- WO-0109 được review ở L2 (Qwen suy giảm/được dispositioned; một false positive của
  DeepSeek đã được đối chiếu và bác bỏ).

## Tương thích

- Không có thay đổi phá vỡ (breaking change). Mọi lệnh và hành vi của v1.0/v1.1 giữ nguyên.
- Codex guard, định tuyến review và Scope Lock không bị ảnh hưởng.
