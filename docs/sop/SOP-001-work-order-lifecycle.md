# SOP-001 — Vòng đời Work Order

- **Version:** 1.0
- **Owner:** PMO / Execution Lead
- **Last updated:** 2026-07-12

## Mục đích

Định nghĩa cách một Work Order (WO) di chuyển từ `backlog` đến `done` trong AIEP v1.0, bao gồm
cách gán ReviewLevel cho nó, để mọi đơn vị thay đổi đều được theo dõi, được review ở đúng
độ sâu, và có thể truy vết.

## Phạm vi

Tất cả Work Order nằm dưới `pmo/work-orders/<WO-ID>/work-order.md`. Mỗi WO mang đúng
một ReviewLevel. Các tính năng ngoài phạm vi (Scope Lock v1.0) thuộc v2.0 không bao giờ được biến
thành Work Order.

## Vai trò

- **Execution Lead (Claude Code)** — soạn WO, triển khai, chạy self review.
- **PMO** — sở hữu backlog, độ chính xác của status, và khả năng truy vết.
- **Reviewers** — deepseek, qwen, gemini, codex, được huy động theo ReviewLevel.

## Mô hình trạng thái

`backlog → planned → in-progress → in-review → done`, với `blocked` có thể đạt tới từ
bất kỳ trạng thái đang hoạt động nào. Đây là các giá trị `status` hợp lệ duy nhất.

## Gán ReviewLevel

Gán mức thấp nhất mà vẫn bao phủ rủi ro một cách trung thực:

- **L1** — thay đổi cấu trúc/scaffolding, tài liệu, không có bề mặt runtime hay bảo mật.
- **L2** — thay đổi code thông thường có logic; reviewer nội bộ bổ sung kiểm tra tính đúng đắn/chất lượng.
- **L3** — thay đổi cắt ngang (cross-cutting) về thiết kế hoặc chạm tới kiến trúc; bổ sung Gemini design review.
- **L4** — chỉ dành cho thay đổi thực sự rủi ro cao: auth/authz, bảo mật trọng yếu, thanh toán,
  migration dữ liệu trọng yếu, core runtime có tác động toàn hệ thống, một bản phát hành production lớn, hoặc
  một xung đột reviewer không thể giải quyết. L4 là mức DUY NHẤT huy động Codex.

Không thổi phồng một WO lên L4 để "được review nhiều hơn". Xem SOP-003 về Codex guard.

## Quy trình

1. **Create** — tạo WO từ `templates/work-order.template.md`; điền frontmatter
   (`id, title, phase, reviewLevel, status, owner`) và các phần thân. Đặt `status: backlog`.
2. **Plan** — tinh chỉnh Objective, Scope, Deliverables và Definition of Done; đặt
   `status: planned`. Ghi lại lý do gán ReviewLevel trong phần thân.
3. **Implement** — đặt `status: in-progress`; soạn thay đổi thành một đơn vị logic.
   Áp dụng Rule of Three khi deliverable có thể tái sử dụng (Code + Knowledge + Standard asset).
4. **Self review** — chạy `aiep review <WO-ID>`; Claude self review luôn chạy trước ở mọi mức.
5. **Route reviewers** — pipeline chạy tự động theo ReviewLevel (xem SOP-002).
   Đặt `status: in-review`.
6. **Resolve findings** — sửa hoặc ghi lại disposition cho mọi finding CRITICAL/HIGH
   (SOP-002). Chạy lại `aiep review <WO-ID>` cho tới khi verdict là `PASS`.
7. **Validate** — chạy `aiep validate`; tất cả quality gates phải pass.
8. **Commit** thay đổi như một đơn vị bàn giao logic; đặt `status: done`.
9. **Block/unblock** — nếu không thể tiến triển, đặt `status: blocked` và ghi lý do
   trong phần thân WO; quay lại trạng thái đang hoạt động trước đó khi đã gỡ vướng.

## Checklist

- [ ] Frontmatter đầy đủ và hợp lệ (gate `aiep validate` pass).
- [ ] Đúng một ReviewLevel, kèm lý do trong phần thân.
- [ ] Definition of Done được đáp ứng đầy đủ.
- [ ] Verdict của `aiep review <WO-ID>` là `PASS` (không còn CRITICAL/HIGH chưa giải quyết).
- [ ] Artifact hiện diện dưới `.aiep/artifacts/<WO-ID>/`.
- [ ] Các gate `aiep validate` pass.
- [ ] Thay đổi đã commit; `status: done`.

## References

- templates/work-order.template.md
- docs/sop/SOP-002-review-execution.md
- docs/sop/SOP-003-codex-l4-audit.md
- docs/governance/REVIEW-LEVEL-POLICY.md
- docs/governance/SCOPE-LOCK-v1.0.md
