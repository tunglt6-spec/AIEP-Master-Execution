# SOP-003 — Codex L4 Audit

- **Version:** 1.0
- **Owner:** Execution Lead / ARB
- **Last updated:** 2026-07-12

## Mục đích

Định nghĩa chính xác khi nào và bằng cách nào Codex — External Independent Auditor — được huy động, và
cách Codex Guard bảo tồn token bằng cách giới hạn Codex chỉ ở ReviewLevel L4.

## Phạm vi

Codex KHÔNG phải là reviewer mặc định. Nó chỉ được gọi trong pipeline L4
(claude → deepseek → qwen → gemini → codex) và không bao giờ ở L1/L2/L3. SOP này chi phối
việc huy động đó và guard thực thi nó.

## Vai trò

- **Execution Lead** — biện minh cho L4, chạy review, giải quyết các finding của audit.
- **ARB / Chief Architect** — xác nhận thay đổi thực sự xứng đáng với L4.
- **Codex** — audit độc lập từ bên ngoài về tính đúng đắn trọng yếu, bảo mật, kiến trúc
  và rủi ro phát hành; ghi `codex-audit.md`.

## Khi nào huy động Codex (chỉ L4)

Gán L4 (và do đó là Codex) CHỈ cho thay đổi thực sự rủi ro cao:

- Authentication hoặc authorization.
- Bề mặt bảo mật trọng yếu.
- Xử lý thanh toán.
- Migration dữ liệu trọng yếu.
- Core runtime có tác động toàn hệ thống.
- Một bản phát hành production lớn.
- Một xung đột reviewer không thể giải quyết ở mức thấp hơn.

KHÔNG thổi phồng một Work Order lên L4 chỉ để có thêm độ sâu review. Nếu không có điều nào
ở trên áp dụng, mức đúng là L1–L3 và Codex không được chạy.

## Codex Guard (bảo tồn token)

- Cấu hình trong `.aiep/config.json` dưới `codexGuard` (`enabled: true`, `allowedLevels: ["L4"]`).
- Thực thi theo chiều sâu: review router lọc Codex ra khỏi mọi pipeline không phải L4, và
  bản thân Codex reviewer từ chối cứng (throw một guard-violation) dưới L4.
- `aiep validate` thất bại nếu tìm thấy một artifact `codex-audit.md` dưới một Work Order không phải L4.
- Lý do: Codex đắt đỏ; guard ngăn lãng phí token external-audit và
  giữ Codex dành riêng cho công việc rủi ro cao.

## Quy trình

1. Xác nhận Work Order đáp ứng một trigger L4 ở trên; ghi lại lý do biện minh trong phần
   ReviewLevel rationale của WO. Có ARB xác nhận cho các thay đổi phát hành production hoặc bảo mật.
2. Đặt `reviewLevel: L4` trong frontmatter của Work Order.
3. Đảm bảo `codex` CLI đã được cài và có trên PATH (`aiep doctor`).
4. Chạy `aiep review <WO-ID>`. Toàn bộ pipeline L4 chạy; Codex chạy sau cùng.
5. Nếu `codex` không khả dụng, auditor bị degrade và ghi một artifact integration-decision;
   ghi lại nó như một disposition được ghi lại (theo SOP-002) — không hạ mức để
   né audit.
6. Đọc `.aiep/artifacts/<WO-ID>/codex-audit.md`; giải quyết mọi finding CRITICAL/HIGH và
   chạy lại cho tới khi verdict là `PASS`.

## Checklist

- [ ] L4 được biện minh dựa trên một trigger được ghi lại; lý do được ghi trong WO.
- [ ] `reviewLevel: L4` đã được đặt (không thổi phồng từ một thay đổi rủi ro thấp hơn).
- [ ] `codex` CLI khả dụng, hoặc lần chạy degraded được ghi lại như một disposition được ghi lại.
- [ ] `codex-audit.md` đã được tạo và review.
- [ ] Không tồn tại artifact Codex nào dưới bất kỳ Work Order không phải L4 nào (guard được tôn trọng).
- [ ] Mọi CRITICAL/HIGH từ audit đã được giải quyết; verdict `PASS`.

## References

- docs/sop/SOP-002-review-execution.md
- docs/governance/REVIEW-LEVEL-POLICY.md
- .aiep/config.json (`codexGuard`)
