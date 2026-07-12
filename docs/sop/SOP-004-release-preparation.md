# SOP-004 — Chuẩn bị Phát hành

- **Version:** 1.0
- **Owner:** Execution Lead / PMO
- **Last updated:** 2026-07-12

## Mục đích

Định nghĩa các quality gates và các bước để chuẩn bị một bản phát hành AIEP v1.0, sử dụng
`aiep validate` và `aiep package`, để chỉ một trạng thái đã được quản trị đầy đủ và pass gate mới được đóng gói.

## Phạm vi

Áp dụng cho việc chuẩn bị một package AIEP phân phối được (npm tarball) cho v1.0. Phạm vi tính năng
bị đóng băng bởi Scope Lock v1.0 và Architecture Freeze v1.0; các bản phát hành không thêm bề mặt v2.0.

## Vai trò

- **Execution Lead** — chạy validation và packaging, sửa các gate thất bại.
- **PMO** — xác nhận tính đầy đủ của Work Order và tài liệu.

## Quality gates (`aiep validate`)

`aiep validate` chạy các gate này; bất kỳ FAIL nào làm lệnh thoát với mã khác không:

1. Các artifact governance/tài liệu bắt buộc hiện diện (PROJECT.md, README.md,
   CHANGELOG.md, Constitution, Governance, Review Level Policy, Scope Lock v1.0,
   Architecture Freeze v1.0, Product Backlog, Decision Log, Risk Register).
2. Mọi Work Order đúng định dạng và mỗi cái mang một ReviewLevel.
3. Codex guard — không Work Order L1/L2/L3 nào mang một `codex-audit.md`.
4. Các Work Order đã review có đủ artifact bắt buộc cho mức của chúng.
5. Không còn finding CRITICAL chưa giải quyết (FAIL); các finding HIGH nâng lên một WARN cho tới khi được disposition.
6. Không có secret nào bị commit (secret scan trên các file được track).
7. Scope Lock v1.0 được tôn trọng — không có thư mục v2.0 ngoài phạm vi nào hiện diện.

Cảnh báo không làm hỏng build; các FAIL thì có.

## Quy trình

1. Xác nhận mọi Work Order trong phạm vi đã `done` (hoặc được hoãn tường minh) — `aiep status`.
2. Build lại dữ liệu dashboard: `aiep dashboard --build`.
3. Chạy `aiep validate`; giải quyết mọi FAIL. Xử lý hoặc disposition các WARN (ví dụ finding HIGH).
4. Cập nhật `CHANGELOG.md` cho bản phát hành; xác nhận version `package.json`.
5. Dry-run package để kiểm tra nội dung: `aiep package --dry-run`.
6. Tạo tarball phát hành: `aiep package` (ghi vào `dist/`). Nó chạy lại các gate
   và từ chối đóng gói nếu bất kỳ gate nào FAIL trừ khi có `--force` — không dùng
   `--force` cho một bản phát hành thật.
7. Kiểm tra tarball trong `dist/` và lệnh cài đặt cục bộ được in ra; ghi nhận mức sẵn sàng
   phát hành (`READY`).
8. Commit các artifact phát hành và tag bản phát hành theo quy ước dự án.

## Checklist

- [ ] `aiep status` cho thấy các Work Order trong phạm vi đã `done` hoặc được hoãn tường minh.
- [ ] Đã chạy `aiep dashboard --build`; dữ liệu dashboard cập nhật.
- [ ] `aiep validate` — mọi gate PASS (các WARN đã được disposition).
- [ ] Không còn CRITICAL chưa giải quyết; HIGH đã giải quyết hoặc disposition.
- [ ] Secret scan sạch; Scope Lock v1.0 được tôn trọng.
- [ ] Đã cập nhật version `CHANGELOG.md` và `package.json`.
- [ ] Đã review nội dung của `aiep package --dry-run`.
- [ ] `aiep package` đã tạo một tarball trong `dist/` mà không cần `--force`.
- [ ] Bản phát hành đã được commit và tag.

## References

- docs/sop/SOP-001-work-order-lifecycle.md
- docs/sop/SOP-002-review-execution.md
- docs/governance/SCOPE-LOCK-v1.0.md
- docs/governance/ARCHITECTURE-FREEZE-v1.0.md
