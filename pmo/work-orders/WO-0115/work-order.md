---
id: WO-0115
title: "Việt hóa templates + docs/README (patch)"
phase: P0-Foundation
reviewLevel: L1
status: done
owner: claude-execution-lead
---

# WO-0115 — Việt hóa templates + docs/README (patch)

## Mục tiêu

Hoàn tất "sạch tuyệt đối": dịch nốt các template và index tài liệu sang tiếng
Việt, giữ nguyên placeholder, frontmatter key/enum, code và thuật ngữ tiếng Anh.

## Phạm vi

Chỉ dịch prose + heading. Giữ nguyên: marker {{PLACEHOLDER}}; frontmatter key và
giá trị enum (L1–L4, status); code/inline code; liên kết.

## Deliverables

  - templates/INDEX.md, work-order/adr/rfc/sop/review-summary/claude-self-review templates
  - docs/README.md

## Definition of Done

- [ ] 8 file dịch tiếng Việt, giữ placeholder/frontmatter/code/liên kết nguyên vẹn.
- [ ] Claude self review (L1); `aiep validate` pass.

## ReviewLevel — L1

Dịch tài liệu/template, không đổi bề mặt runtime; self review đủ.

## Traceability

- Directive: D-11; nối tiếp WO-0112/0113/0114
- Artifacts: .aiep/artifacts/WO-0115/
