# ADR-0003 — Codex L4-Only Guard (Bảo toàn Token)

- **Trạng thái:** Accepted
- **Ngày:** 2026-07-12
- **Người quyết định:** Execution Lead (phê chuẩn theo Architecture Freeze v1.0)

## Bối cảnh

Codex là External Independent Auditor. Năng lực/token của nó là tài nguyên review khan
hiếm nhất trên nền tảng. Nếu không được quản trị, sẽ rất dễ nảy sinh cám dỗ định tuyến mọi
thứ qua Codex "cho chắc", làm cạn kiệt ngân sách và làm chậm việc giao hàng.

## Quyết định

Codex chỉ được gọi **duy nhất** ở ReviewLevel L4, được thực thi với cơ chế phòng thủ theo
chiều sâu (defence in depth):

1. **Nguồn chân lý duy nhất** — `codexAllowed(config, level)` trong
   `src/core/reviewMatrix.js`, được hậu thuẫn bởi `config.codexGuard.allowedLevels = ["L4"]`.
2. **Từ chối ở cấp reviewer** — `src/reviewers/codex.js` gọi
   `assertReviewerAllowed` và ném lỗi (throws) nếu bị gọi dưới L4.
3. **Lọc ở router** — review router loại bỏ Codex khỏi bất kỳ pipeline không phải L4 nào.
4. **Quality gate** — `aiep validate` thất bại nếu tồn tại một artifact `codex-audit.md`
   ở một Work Order không phải L4.

Các Work Order không được nâng lên L4 chỉ để tăng độ sâu review. L4 được dành riêng cho
những thay đổi thực sự rủi ro cao (auth, bảo mật, thanh toán, di trú dữ liệu quan trọng,
tác động toàn hệ thống ở core-runtime, phát hành lớn, xung đột reviewer không thể giải
quyết).

## Hệ quả

- Token của Codex được bảo toàn; việc giao hàng không bị bóp nghẽn bởi những audit không
  cần thiết.
- Guard có thể kiểm thử được mà không tốn token — các unit test khẳng định rằng Codex bị
  cấm ở L1–L3 và được phép ở L4.
- Với AIEP v1.0, không có Work Order nào đạt ngưỡng L4, nên mức sử dụng Codex bằng không
  theo thiết kế.

## Các phương án đã cân nhắc

- **Chỉ dựa vào chính sách tự giác (honour-system):** dựa vào kỷ luật; không có thực thi —
  bị bác bỏ.
- **Codex trên mọi L3+:** vẫn quá rộng so với ngân sách token — bị bác bỏ.
