# AIEP v1.5.0 — Ghi chú Phát hành

**Loại phát hành:** Minor (Việt hóa tài liệu — Nhóm 3, hoàn tất)
**Ngày:** 2026-07-12

## Điểm nổi bật

Hoàn tất Việt hóa nhóm tài liệu còn lại (WO-0114). Với bản 1.5.0, **toàn bộ tài
liệu chính của AIEP đã ở tiếng Việt** (Nhóm 1 + Nhóm 2 + Nhóm 3).

### Nhóm 3 đã dịch trong bản này

- **SOP:** SOP-001..004 + INDEX (SOP-005 đã tiếng Việt từ trước).
- **AI Engineering Library:** README; prompts (INDEX + 6 prompt); skills (INDEX +
  4 skill); knowledge (INDEX + 5 bài); mcp README.
- **Release docs cũ:** RELEASE-NOTES v1.0–v1.2, QUALITY-GATES, RELEASE-CHECKLIST,
  FINAL-RELEASE-REVIEW-PACKAGE.
- **PMO docs:** README, PRODUCT-BACKLOG, RISK-REGISTER, ISSUES, MILESTONES,
  DECISION-LOG, 3 sprint.

## Nguyên tắc dịch

- **Chỉ dịch** — không thay đổi nội dung, số liệu, chính sách hay kế hoạch.
- Giữ nguyên: cấu trúc Markdown, bảng, liên kết, code block, **prompt body**
  (tiếng Anh, vì là nội dung gửi cho model), **frontmatter key** và giá trị
  id/status/phase, file `.json` descriptor của MCP (dữ liệu).
- Giữ nguyên thuật ngữ kỹ thuật tiếng Anh: `ReviewLevel`, `L1–L4`, severity, tên
  reviewer, `Scope Lock`, `Architecture Freeze`, `Codex guard`, CLI command, tên
  file, config key.

## Chất lượng

- 31 test tự động PASS; 9/9 quality gates PASS.
- WO-0114 review L1 (Claude self review) → PASS.

## Tương thích

- Không thay đổi phá vỡ. Mọi command và hành vi CLI giữ nguyên.
- Codex guard, review routing và Scope Lock không đổi.
