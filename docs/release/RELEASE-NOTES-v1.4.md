# AIEP v1.4.0 — Ghi chú Phát hành

**Loại phát hành:** Minor (Việt hóa tài liệu — Nhóm 1 + Nhóm 2)
**Ngày:** 2026-07-12

## Điểm nổi bật

Theo yêu cầu của Product Owner, tài liệu AIEP được dịch sang tiếng Việt để dễ đọc
và phê duyệt. Bản 1.4.0 gộp hai nhóm tài liệu đã dịch:

### Nhóm 1 — Governance + PROJECT/README (WO-0112)

- PROJECT.md, README.md
- Constitution (Hiến chương AIEP), Governance (Quản trị AIEP)
- Review Level Policy (Chính sách Review Level)
- Scope Lock v1.0, Architecture Freeze v1.0

### Nhóm 2 — Design + ADR + RFC (WO-0113)

- Design Specification (Đặc tả Thiết kế), Data Model (Mô hình Dữ liệu)
- ADR-0001..0003
- RFC-0001 (Review Level Policy), RFC-0002 (AI Coding Agent)
- Các INDEX của design/adr/rfc

## Nguyên tắc dịch

- **Chỉ dịch** — không thay đổi chính sách, thiết kế hay quyết định.
- Giữ nguyên: cấu trúc Markdown, bảng, liên kết tương đối, code/JSON block, sơ đồ
  ASCII; và thuật ngữ kỹ thuật tiếng Anh (`ReviewLevel`, `L1–L4`, severity, tên
  reviewer, `Scope Lock`, `Architecture Freeze`, `Codex guard`, CLI command,
  tên file, config key).

## Chất lượng

- 31 test tự động PASS; 9/9 quality gates PASS.
- WO-0112 và WO-0113 review L1 (Claude self review) → PASS.

## Tương thích

- Không thay đổi phá vỡ. Mọi command và hành vi CLI giữ nguyên.
- Còn lại (bản sau): SOP-001..004, Library (prompts/skills/knowledge/mcp),
  release docs cũ, một số PMO doc.
