---
id: WO-0114
title: "Việt hóa tài liệu Nhóm 3 (SOP + Library + Release + PMO)"
phase: P0-Foundation
reviewLevel: L1
status: done
owner: claude-execution-lead
---

# WO-0114 — Việt hóa tài liệu Nhóm 3 (SOP + Library + Release + PMO)

## Mục tiêu

Hoàn tất Việt hóa nhóm tài liệu còn lại: SOP-001..004, AI Engineering Library
(prompts/skills/knowledge/mcp README), release docs cũ, và PMO docs. Giữ nguyên
cấu trúc, frontmatter key, code/prompt block và thuật ngữ kỹ thuật tiếng Anh.

## Phạm vi

Chỉ dịch prose + heading. Không đổi nội dung chính sách/kế hoạch. Giữ nguyên:
frontmatter key và giá trị id/status/phase; nội dung prompt trong code block
(operational, gửi cho model); file .json descriptor của MCP (dữ liệu).

## Deliverables

  - docs/sop/SOP-001..004 + INDEX
  - library/README + prompts + skills + knowledge + mcp/README
  - docs/release/RELEASE-NOTES-v1.0..v1.2, QUALITY-GATES, RELEASE-CHECKLIST, FINAL-RELEASE-REVIEW-PACKAGE
  - pmo/README, backlog, risks, issues, milestones, decisions, sprints

## Definition of Done

- [ ] Các file .md nhóm 3 dịch sang tiếng Việt, giữ cấu trúc/liên kết/frontmatter.
- [ ] Prompt block và .json descriptor giữ nguyên.
- [ ] Claude self review (L1); `aiep validate` pass.

## ReviewLevel — L1

Dịch tài liệu, không đổi bề mặt runtime; self review đủ.

## Traceability

- Directive: D-11, memory docs-in-vietnamese; nối tiếp WO-0112, WO-0113
- Artifacts: .aiep/artifacts/WO-0114/
