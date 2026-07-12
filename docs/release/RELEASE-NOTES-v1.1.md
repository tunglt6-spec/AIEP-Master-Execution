# AIEP v1.1.0 — Ghi chú Phát hành

**Loại phát hành:** Phát hành tính năng nhỏ (minor)
**Ngày:** 2026-07-12

## Điểm nổi bật

### `aiep init` — dùng AIEP trên bất kỳ dự án nào (WO-0108)

```bash
npm install -g @tunglt6/aiep
cd /your/project
aiep init            # scaffold a working AIEP workspace
aiep validate        # 9/9 gates pass out of the box
```

`aiep init [dir]` khởi tạo (scaffold) một workspace AIEP hoàn chỉnh và hợp lệ vào bất kỳ thư mục nào:

- `.aiep/config.json` (reviewer, các review level L1–L4, Codex guard — tái sử dụng từ
  gói đã cài đặt với tên dự án được trỏ lại).
- Frontend dashboard và các template được sao chép từ gói.
- Các tài liệu governance/PMO khởi đầu ngắn gọn (Constitution, Governance, Review
  Level Policy, Scope Lock, Architecture Freeze, Product Backlog, Decision Log,
  Risk Register) cùng với PROJECT/README/CHANGELOG.
- Một Work Order mẫu (`WO-0001`) và một tệp `.gitignore`.

Lệnh này có tính **idempotent** — các tệp đang tồn tại không bao giờ bị ghi đè trừ khi
truyền cờ `--force`.

## Chất lượng

- 26 test tự động pass (3 test mới cho `init`, bao gồm một test chạy `aiep validate`
  thật bên trong một workspace vừa được scaffold).
- Cả 9 quality gate đều pass; không còn finding CRITICAL/HIGH chưa xử lý.

## Review

- WO-0108 được review ở mức **L2**: Claude self review + DeepSeek review thật; Qwen
  suy giảm (CPU timeout trên delta lớn hơn) được ghi lại thành một disposition có tài
  liệu. Một CRITICAL false-positive của DeepSeek đã được đối chiếu với mã nguồn và bị bác bỏ.

## Tương thích

- Không có thay đổi phá vỡ (breaking change). Mọi lệnh và hành vi của v1.0 giữ nguyên.
- Codex guard, định tuyến review và Scope Lock không bị ảnh hưởng.
