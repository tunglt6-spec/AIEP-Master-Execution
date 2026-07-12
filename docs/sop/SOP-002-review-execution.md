# SOP-002 — Thực thi Review

- **Version:** 1.0
- **Owner:** Execution Lead
- **Last updated:** 2026-07-12

## Mục đích

Chuẩn hóa cách chạy `aiep review`, cách route reviewer theo ReviewLevel, cách
xử lý các reviewer backend bị suy giảm (degraded), và cách giải quyết finding CRITICAL/HIGH.

## Phạm vi

Áp dụng cho mọi lần review Work Order. Việc huy động Codex được đề cập trong SOP-003.

## Vai trò

- **Execution Lead** — chạy review, phân loại findings, ghi lại disposition.
- **Reviewers** — deepseek & qwen (DeepSeek/Qwen qua Ollama), gemini (CLI), codex (CLI, chỉ L4).

## Pipeline reviewer theo từng mức

- **L1** — claude
- **L2** — claude → deepseek → qwen
- **L3** — claude → deepseek → qwen → gemini
- **L4** — claude → deepseek → qwen → gemini → codex

Reviewer chạy theo thứ tự. Claude self review luôn chạy trước tiên. Mỗi reviewer ghi một
artifact vào `.aiep/artifacts/<WO-ID>/`:
`claude-self-review.md`, `deepseek-review.md`, `qwen-review.md`, `gemini-review.md`
(L3+), `codex-audit.md` (L4), cùng với `review-summary.md` (L2+) và `decision.json`.

## Quy trình

1. Đảm bảo các điều kiện tiên quyết cho mức mục tiêu: Ollama đang chạy tại endpoint đã cấu hình
   cho deepseek/qwen; `gemini` CLI có trên PATH cho L3+; `codex` CLI có trên PATH cho L4.
   Chạy `aiep doctor` để kiểm tra các backend.
2. Chạy review:
   - Một WO đơn: `aiep review <WO-ID>`
   - Tất cả WO chưa done: `aiep review`
   - Giới hạn diff theo một base ref khi cần: `aiep review <WO-ID> --base <ref>`
   - Đầu ra máy đọc được: thêm `--json`.
3. Đọc verdict trên console (`PASS` hoặc `CHANGES_REQUESTED`) và số lượng CRITICAL/HIGH.
4. Mở `.aiep/artifacts/<WO-ID>/review-summary.md` (hoặc `aiep artifacts <WO-ID>`) và
   review findings theo severity và theo trạng thái của từng reviewer.
5. Xử lý mọi reviewer bị degraded/error (xem bên dưới) kèm một disposition được ghi lại.
6. Giải quyết mọi finding CRITICAL và HIGH (xem bên dưới).
7. Chạy lại `aiep review <WO-ID>` cho tới khi verdict là `PASS`.

## Xử lý backend bị suy giảm

Một reviewer báo `degraded` khi backend của nó không khả dụng (ví dụ Ollama tắt, hoặc
`gemini`/`codex` không có trên PATH), hoặc báo `error` khi lời gọi của nó thất bại. Trong các trường hợp này:

- Reviewer ghi một artifact integration-decision; pipeline không âm thầm bỏ qua nó.
- Ưu tiên: cung cấp công cụ (khởi động Ollama / cài CLI) và chạy lại review.
- Nếu công cụ thực sự không thể cung cấp được, ghi một **disposition được ghi lại** trong
  `review-summary.md` (phần Disposition) giải thích lý do, và rủi ro tồn dư được chấp nhận.
- Một reviewer bị degraded không bao giờ biến một CRITICAL/HIGH thành pass — các finding chặn
  từ reviewer khác vẫn chặn.

## Giải quyết finding CRITICAL / HIGH

CRITICAL và HIGH là chặn (`verdict: CHANGES_REQUESTED`). Với mỗi finding:

1. Tái hiện/hiểu finding từ artifact của reviewer.
2. Sửa code, HOẶC ghi một disposition rõ ràng: accept-with-rationale, hoặc hoãn sang
   một Work Order mới (liên kết tới nó) — chỉ khi có lý do chính đáng và có người chịu trách nhiệm rủi ro.
3. Chạy lại `aiep review <WO-ID>`; xác nhận số lượng giảm và verdict trở thành `PASS`.
4. Các finding CRITICAL phải về không. Các finding HIGH phải được giải quyết hoặc disposition
   (chúng nổi lên như một cảnh báo `aiep validate` cho tới khi được xử lý).

## Checklist

- [ ] `aiep doctor` cho thấy các backend cần thiết cho ReviewLevel này.
- [ ] `aiep review <WO-ID>` đã chạy; pipeline đúng đã chạy cho mức đó.
- [ ] Đã review trạng thái mọi reviewer; các backend degraded/error đã được disposition.
- [ ] Không còn CRITICAL chưa giải quyết; mọi HIGH đã giải quyết hoặc disposition.
- [ ] Verdict `PASS` ở lần chạy cuối.
- [ ] Artifact và `decision.json` hiện diện dưới `.aiep/artifacts/<WO-ID>/`.

## References

- docs/sop/SOP-001-work-order-lifecycle.md
- docs/sop/SOP-003-codex-l4-audit.md
- templates/review-summary.template.md
- docs/governance/REVIEW-LEVEL-POLICY.md
