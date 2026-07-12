---
id: WO-0112
title: "Việt hóa tài liệu Nhóm 1 (Governance + PROJECT/README)"
phase: P0-Foundation
reviewLevel: L1
status: done
owner: claude-execution-lead
---

# WO-0112 — Việt hóa tài liệu Nhóm 1 (Governance + PROJECT/README)

## Mục tiêu

Dịch sang tiếng Việt nhóm tài liệu ưu tiên cao nhất để Product Owner đọc và phê
duyệt, giữ nguyên cấu trúc, liên kết, code block và thuật ngữ kỹ thuật tiếng Anh.

## Phạm vi

Dịch nội dung (prose + heading) của 7 file; **không** thay đổi chính sách hay ý
nghĩa (chỉ dịch). Giữ nguyên: tên file, đường dẫn, CLI command, config key, code
block, ReviewLevel/L1–L4, tên reviewer, severity, và thuật ngữ định danh
(Scope Lock, Architecture Freeze, Codex guard, Work Order, quality gates,
artifact, disposition, finding, deliverable).

## Deliverables

  - PROJECT.md
  - README.md
  - docs/constitution/CONSTITUTION.md
  - docs/governance/GOVERNANCE.md
  - docs/governance/REVIEW-LEVEL-POLICY.md
  - docs/governance/SCOPE-LOCK-v1.0.md
  - docs/governance/ARCHITECTURE-FREEZE-v1.0.md

## Definition of Done

- [ ] 7 file dịch sang tiếng Việt, giữ cấu trúc/liên kết/code nguyên vẹn.
- [ ] Thuật ngữ kỹ thuật giữ tiếng Anh.
- [ ] Claude self review (L1) hoàn tất.
- [ ] `aiep validate` pass (required docs vẫn đủ).

## ReviewLevel — L1

Dịch tài liệu, không thay đổi chính sách hay bề mặt runtime; Claude self review
là đủ.

## Traceability

- Directive: D-11 (tài liệu tiếng Việt), memory docs-in-vietnamese
- Artifacts: .aiep/artifacts/WO-0112/
