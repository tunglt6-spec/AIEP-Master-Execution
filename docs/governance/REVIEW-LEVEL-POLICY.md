# Chính sách Review Level (v1.0)

Mọi Work Order **bắt buộc** phải mang đúng một `reviewLevel`: `L1`, `L2`, `L3` hoặc `L4`.
Level này quyết định reviewer pipeline. Chính sách này được thực thi trong code bởi
`src/core/reviewMatrix.js` và được validate bởi `aiep validate`.

## Review Matrix

| Level | Pipeline | Dùng cho |
|-------|----------|---------|
| **L1** | Claude self review | Scaffolding có tính cấu trúc, tài liệu, rủi ro thấp |
| **L2** | Claude → DeepSeek → Qwen | Code tiêu chuẩn có bề mặt logic/khả năng bảo trì |
| **L3** | Claude → DeepSeek → Qwen → Gemini | Thay đổi quan trọng về architecture hoặc nặng về tích hợp |
| **L4** | Claude → DeepSeek → Qwen → Gemini → Codex | Thay đổi thực sự rủi ro cao (xem bên dưới) |

Các reviewer chạy **theo thứ tự**. Mỗi reviewer tạo ra một artifact dưới
`.aiep/artifacts/<WO-ID>/`.

## Trọng tâm của reviewer

- **Claude (self review):** tuân thủ Work Order, Definition of Done, không có secret
  trong delta, tính nhất quán nội tại.
- **DeepSeek (local code reviewer):** bug logic, lỗi runtime, edge case,
  bảo mật cơ bản, xử lý lỗi, tính đúng đắn.
- **Qwen (local technical reviewer):** khả năng bảo trì, dead code, trùng lặp,
  hiệu năng, sự nhất quán về architecture, cấu trúc code.
- **Gemini (design reviewer):** sự nhất quán về design, căn chỉnh với architecture, tuân thủ
  design spec, tuân thủ phạm vi, rủi ro tích hợp.
- **Codex (external auditor, chỉ L4):** tính đúng đắn trọng yếu, bảo mật,
  rủi ro architecture, rủi ro phát hành, các khiếm khuyết tác động cao.

## Codex Guard (bảo toàn token)

Codex **không bao giờ** là một reviewer mặc định. Nó chỉ được gọi **duy nhất** ở L4.

- Codex KHÔNG ĐƯỢC gọi cho L1, L2 hoặc L3.
- Guard được thực thi ở ba nơi (phòng thủ theo chiều sâu):
  1. Review matrix (`codexAllowed`) — nguồn chân lý duy nhất.
  2. Module reviewer Codex (`assertReviewerAllowed`) — từ chối chạy dưới L4.
  3. `aiep validate` — fail nếu một artifact Codex xuất hiện ở một Work Order non-L4.
- **Không** nâng một Work Order lên L4 chỉ để tăng độ sâu review.

### Khi nào L4 (và do đó Codex) là chính đáng

- Authentication / authorization.
- Bề mặt bảo mật trọng yếu.
- Luồng thanh toán (payment flows).
- Di trú dữ liệu trọng yếu (critical data migration).
- Core runtime có tác động trên toàn hệ thống.
- Phát hành production lớn.
- Xung đột giữa các reviewer không thể giải quyết bằng cách khác.

Với chính bản thân AIEP v1.0, không Work Order nào đạt ngưỡng L4; do đó việc sử dụng Codex bằng
không theo thiết kế. Guard được kiểm chứng bằng unit test thay vì bằng việc tiêu tốn token Codex.

## Findings & dispositions

Findings được phân loại `CRITICAL`, `HIGH`, `MEDIUM`, `LOW`, `INFO`.
`CRITICAL` và `HIGH` là **chặn (blocking)**: chúng phải được sửa hoặc được đưa ra một disposition
được ghi chép trước khi một Work Order đạt tới Definition of Done.

## Suy giảm nhẹ nhàng (graceful degradation)

Nếu một reviewer backend bắt buộc không khả dụng (ví dụ Gemini CLI chưa được cài đặt),
nền tảng ghi lại một artifact **integration decision** và tiếp tục. Đây là
một disposition được ghi chép, không phải một lần bỏ qua âm thầm, và không phải một blocker cứng — backend bị thiếu
là một mối quan tâm về cung cấp môi trường, không phải một khiếm khuyết trong thay đổi. Một
blocker cứng chỉ được nêu ra khi một reviewer bắt buộc không thể chạy **và** không có phương thức
hợp lệ nào tồn tại để hoàn thành Review Contract.
