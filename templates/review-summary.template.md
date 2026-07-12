# Review Summary — {{WO-ID}}

<!--
Phần này phản chiếu cấu trúc mà AIEP sinh ra tại
.aiep/artifacts/<WO-ID>/review-summary.md (được ghi cho Work Order L2+).
Không chỉnh sửa tay các summary được sinh ra; hãy tạo lại bằng `aiep review <WO-ID>`.
Chỉ dùng template này khi lập tài liệu cho một disposition thủ công đi kèm.
-->

- **Title:** {{SHORT_TITLE}}
- **ReviewLevel:** {{L1|L2|L3|L4}}
- **Reviewers:** {{claude → deepseek → qwen → gemini → codex (per level)}}
- **Số file thay đổi:** {{N}}
- **Kết luận:** {{PASS | CHANGES_REQUESTED}}

## Trạng thái reviewer

<!-- Mỗi reviewer một dòng. status ∈ completed | degraded | error -->
- claude: **{{completed}}**
- deepseek: **{{completed|degraded|error}}** ({{model}})
- qwen: **{{completed|degraded|error}}** ({{model}})
- gemini: **{{completed|degraded|error}}**
- codex: **{{completed|degraded|error}}**  <!-- chỉ L4 -->

## Findings theo severity

- CRITICAL: {{N}}
- HIGH: {{N}}
- MEDIUM: {{N}}
- LOW: {{N}}
- INFO: {{N}}

## Toàn bộ findings

<!-- Định dạng: - **<SEVERITY>** [<reviewer>] — <message> -->
- **{{SEVERITY}}** [{{reviewer}}] — {{message}}
- (không có)

## Disposition

{{Nếu không còn CRITICAL/HIGH chưa giải quyết: "Không còn CRITICAL/HIGH finding chưa
giải quyết. Work Order có thể tiến tới Definition of Done." Ngược lại, liệt kê từng
blocking finding cùng cách giải quyết hoặc disposition đã lập tài liệu (fix,
accept-with-rationale, hoặc defer sang một Work Order mới). Một reviewer backend bị
degraded phải được ghi nhận như một disposition đã lập tài liệu, không được âm thầm bỏ qua.}}

> Lưu ý: Nếu Codex được yêu cầu nhưng bị chặn bởi guard bảo toàn token (không phải L4),
> hãy ghi nhận điều đó ở đây.
