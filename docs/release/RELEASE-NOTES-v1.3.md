# AIEP v1.3.0 — Ghi chú Phát hành

**Loại phát hành:** Minor (giao diện + tài liệu tiếng Việt)
**Ngày:** 2026-07-12

## Điểm nổi bật

### Dashboard giao diện tiếng Việt (WO-0111)

Toàn bộ nhãn hiển thị của dashboard được Việt hóa để dễ quản trị và theo dõi:
tiêu đề 10 panel, header bảng, badges, thông báo loading/footer, và ánh xạ giá
trị dữ liệu (present/missing, verdict, status, tên deliverable, nhãn tài sản tri
thức, item chẩn đoán).

- Dữ liệu gốc `dashboard.json` và output CLI **giữ nguyên** — chỉ dịch tại thời
  điểm render (frontend).
- Thuật ngữ kỹ thuật giữ tiếng Anh: `ReviewLevel`, `L1–L4`, severity
  (`CRITICAL/HIGH/…`), `Scope Lock`, `Architecture Freeze`, tên model/CLI.

### SOP-005 — Lập trình với AI kết hợp AIEP (WO-0110)

Quy trình chuẩn (tiếng Việt) để phối hợp AI coding agent với AIEP: triển khai →
audit độc lập (`aiep review`/`aiep validate`) → con người duyệt findings và gác
cổng deploy. Kèm mẫu prompt dán trực tiếp cho agent.

## Bối cảnh

Theo yêu cầu của Product Owner, tài liệu và giao diện AIEP được viết bằng tiếng
Việt để kiểm soát và phê duyệt. Thuật ngữ kỹ thuật, command, tên file và config
key giữ nguyên tiếng Anh.

## Chất lượng

- 31 test tự động PASS; 9/9 quality gates PASS.
- WO-0110 (L1) và WO-0111 (L2) đã review; các false-positive của DeepSeek được
  xác minh với source và dispositioned; Qwen degraded/dispositioned.

## Tương thích

- Không thay đổi phá vỡ (breaking). Mọi command và hành vi CLI của 1.0–1.2 giữ nguyên.
- Codex guard, review routing và Scope Lock không đổi.
