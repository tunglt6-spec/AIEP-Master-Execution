# Templates AIEP

Các template tái sử dụng, dùng được ngay cho AIEP v1.0. Sao chép một template, thay thế mọi
`{{PLACEHOLDER}}`, và xóa các comment hướng dẫn trước khi commit.

| Template | Mục đích |
| --- | --- |
| [work-order.template.md](./work-order.template.md) | Work Order với frontmatter chính xác mà AIEP parse (id, title, phase, reviewLevel, status, owner) cùng các phần thân bắt buộc. |
| [adr.template.md](./adr.template.md) | Architecture Decision Record — Status, Bối cảnh, Quyết định, Hệ quả, Phương án thay thế. |
| [rfc.template.md](./rfc.template.md) | Request for Comments — Tóm tắt, Động lực, Thiết kế, Nhược điểm, Phương án thay thế, Câu hỏi mở. |
| [sop.template.md](./sop.template.md) | Standard Operating Procedure — Mục đích, Phạm vi, Vai trò, Quy trình, Danh sách kiểm tra, Tham chiếu. |
| [review-summary.template.md](./review-summary.template.md) | Phản chiếu review summary do nền tảng sinh ra (trạng thái reviewer, finding theo severity, disposition). |
| [claude-self-review.template.md](./claude-self-review.template.md) | Danh sách kiểm tra Claude self-review, phản chiếu artifact self-review được sinh ra. |

## Quy ước

- Frontmatter là một tập con YAML phẳng, có kiểm soát — không có mapping lồng nhau. Đặt trong
  dấu ngoặc kép bất kỳ title nào chứa dấu `:`.
- `reviewLevel` ∈ `L1 | L2 | L3 | L4`; `status` ∈ `backlog | planned | in-progress | in-review | done | blocked`.
- Severity của finding: `CRITICAL, HIGH, MEDIUM, LOW, INFO` (CRITICAL/HIGH là blocking).
- Artifact review-summary và self-review thường được sinh ra bởi `aiep review`
  vào `.aiep/artifacts/<WO-ID>/`; các template ở đây mô tả cấu trúc của chúng và
  dùng cho disposition thủ công hoặc lập kế hoạch.

Xem thêm: [../docs/sop/INDEX.md](../docs/sop/INDEX.md) để biết các quy trình vận hành.
