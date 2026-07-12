---
id: WO-0111
title: "Việt hóa giao diện Dashboard"
phase: P2-Ops
reviewLevel: L2
status: done
owner: claude-execution-lead
---

# WO-0111 — Việt hóa giao diện Dashboard

## Mục tiêu

Việt hóa toàn bộ nhãn hiển thị của dashboard để Product Owner dễ quản trị và theo
dõi, giữ nguyên tiếng Anh cho thuật ngữ kỹ thuật (ReviewLevel, L1–L4, severity,
Scope Lock, Architecture Freeze, tên model/CLI).

## Phạm vi

Chỉ thay đổi tầng hiển thị (frontend): tiêu đề panel, nhãn tĩnh, header bảng, và
ánh xạ giá trị dữ liệu (present/missing, verdict, status, tên deliverable, nhãn
tài sản tri thức). Dữ liệu gốc (`dashboard.json`) và CLI giữ nguyên tiếng Anh —
dịch tại thời điểm render.

## Deliverables

  - dashboard/app.js (từ điển dịch + render tiếng Việt)
  - dashboard/index.html (tiêu đề, loading, footer)

## Definition of Done

- [ ] Mọi nhãn tĩnh trên dashboard hiển thị tiếng Việt.
- [ ] Thuật ngữ kỹ thuật giữ tiếng Anh.
- [ ] Claude self review + DeepSeek + Qwen (L2) thực thi hoặc dispositioned.
- [ ] Không còn CRITICAL/HIGH tồn đọng; `aiep validate` pass.

## ReviewLevel — L2

Thay đổi frontend hướng người dùng; dual local review kiểm tra tính đúng đắn của
việc ánh xạ dữ liệu và không phá vỡ logic render.

## Traceability

- Liên quan: WO-0205 (Dashboard)
- Artifacts: .aiep/artifacts/WO-0111/
