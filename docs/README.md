# Documentation System của AIEP

Documentation System là một trong năm product deliverable. Nó được
tổ chức như sau:

| Khu vực | Đường dẫn | Nội dung |
|------|------|----------|
| Constitution | `constitution/` | Các nguyên tắc bền vững |
| Governance | `governance/` | Governance, Review Level Policy, Scope Lock, Architecture Freeze |
| Design | `design/` | Đặc tả thiết kế, mô hình dữ liệu |
| ADR | `adr/` | Architecture Decision Records |
| RFC | `rfc/` | Requests for Comments |
| SOP | `sop/` | Standard Operating Procedures |
| Release | `release/` | Release checklist, quality gates, release notes, gói phát hành cuối |

## Thứ tự đọc cho người mới

1. [PROJECT.md](../PROJECT.md) — AIEP là gì và cách chạy.
1. [User Guide](USER-GUIDE.md) — hướng dẫn cài đặt & sử dụng chi tiết cho từng lệnh.
2. [Constitution](constitution/CONSTITUTION.md) — các nguyên tắc.
3. [Governance](governance/GOVERNANCE.md) — cách công việc luân chuyển.
4. [Review Level Policy](governance/REVIEW-LEVEL-POLICY.md) — L1–L4 và Codex guard.
5. [Design Specification](design/DESIGN-SPECIFICATION-v1.0.md) — kiến trúc.

## Quy ước

- Tài liệu ở dạng Markdown. Tài liệu governance và design được gắn phiên bản trong
  tiêu đề của chúng nơi chúng bị freeze (ví dụ `SCOPE-LOCK-v1.0.md`).
- Quyết định được ghi nhận dưới dạng ADR; đề xuất dưới dạng RFC; quy trình dưới dạng SOP.
- Mỗi thư mục con đều có một `INDEX.md` khi có nhiều tài liệu tồn tại.
