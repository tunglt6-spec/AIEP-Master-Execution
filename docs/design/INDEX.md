---
title: "AIEP v1.0 — Mục lục Tài liệu Thiết kế"
---

# AIEP v1.0 — Tài liệu Thiết kế

Các đặc tả thiết kế cho AI Engineering Platform (AIEP) v1.0. Những tài liệu này được
đóng băng theo **Architecture Freeze v1.0** và giới hạn phạm vi theo **Scope Lock v1.0**.

## Tài liệu

| Tài liệu | Mô tả |
| --- | --- |
| [DESIGN-SPECIFICATION-v1.0.md](./DESIGN-SPECIFICATION-v1.0.md) | Đặc tả thiết kế chính: mục tiêu & phi mục tiêu, năm deliverable sản phẩm, kiến trúc tổng quan, trách nhiệm các module, luồng dữ liệu pipeline review, Codex guard, xử lý lỗi & suy giảm mượt (graceful degradation), và các cân nhắc bảo mật. |
| [DATA-MODEL.md](./DATA-MODEL.md) | Các hợp đồng dữ liệu: schema frontmatter của Work Order, schema kết quả review `decision.json`, và cấu trúc trạng thái tổng hợp `dashboard.json`. |

## Liên quan

- RFC Review Level Policy: [../rfc/RFC-0001-review-level-policy.md](../rfc/RFC-0001-review-level-policy.md)
- Governance (được quality gates tham chiếu): `docs/governance/` — Constitution, Governance,
  Review Level Policy, Scope Lock v1.0, Architecture Freeze v1.0.

## Bản đồ nguồn (dành cho người đọc đối chiếu chéo với code)

- CLI dispatcher: `bin/aiep.js` → `src/cli/index.js`
- Commands: `src/cli/{status,validate,review,artifacts,doctor,dashboard,package}.js`
- Core: `src/core/{paths,config,frontmatter,workorders,gitdelta,reviewMatrix,secrets,logger}.js`
- Reviewers: `src/reviewers/{index,claude,ollama,cli-reviewer,gemini,codex,findings}.js`
- Dashboard build: `src/dashboard/build.js`
- Config: `.aiep/config.json`
