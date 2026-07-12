# Claude Self Review — {{WO-ID}}

<!--
Phản chiếu artifact mà AIEP ghi tại
.aiep/artifacts/<WO-ID>/claude-self-review.md. Claude Code là Engineering Team
& Execution Lead; self review là giai đoạn đầu tiên bắt buộc của MỌI ReviewLevel
(L1–L4) trước khi bất kỳ reviewer downstream nào chạy.
-->

- **Work Order:** {{WO-ID}} — {{SHORT_TITLE}}
- **ReviewLevel:** {{L1|L2|L3|L4}}
- **Vai trò:** Engineering Team & Execution Lead (self review)
- **Số file thay đổi:** {{N}}

## Kiểm tra tự động

- [ ] Work Order có ReviewLevel
- [ ] Definition of Done đã được lập tài liệu
- [ ] Tất cả file thay đổi đều tồn tại trên đĩa
- [ ] Không có secret trong delta
- [ ] Change delta khác rỗng

## Kiểm tra thủ công

- [ ] Thay đổi đáp ứng Objective và Deliverables của Work Order.
- [ ] Mọi mục Definition of Done đều được xử lý.
- [ ] Tôn trọng scope — không đưa vào bề mặt thuộc Scope Lock v1.0 (v2.0).
- [ ] Không thêm runtime dependency mới (chỉ dùng Node built-ins).
- [ ] An toàn cross-platform (không giả định path/command đặc thù theo OS).
- [ ] Logic, edge case và xử lý lỗi đã được tự kiểm tra trước review downstream.
- [ ] ReviewLevel đúng với mức rủi ro (Codex/L4 không bị thổi phồng).

## Findings

<!-- Định dạng: - **<SEVERITY>** — <message>  (SEVERITY ∈ CRITICAL/HIGH/MEDIUM/LOW/INFO) -->
- **{{SEVERITY}}** — {{message}}
- **INFO** — Self review đã pass tất cả kiểm tra tự động.

## Ghi chú reviewer

{{Thay đổi được viết ra để đáp ứng Work Order được tham chiếu và Definition of Done
của nó. Ghi chú bất cứ điều gì các reviewer downstream nên tập trung vào, cùng mọi giả định.}}
