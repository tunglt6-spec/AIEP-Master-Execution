# Prompt: Soạn thảo Architecture Decision Record (ADR)

**Title:** Architecture Decision Record Drafting
**Purpose:** Soạn một ADR rõ ràng, bền vững, ghi lại một quyết định kiến trúc, bối cảnh của nó,
các phương án đã cân nhắc, và các hệ quả.
**When to use:** Khi một Work Order đưa ra một quyết định đáng ghi nhớ — một lựa chọn mà
các kỹ sư tương lai không nên âm thầm đảo ngược (ranh giới module, định dạng dữ liệu, một
đánh đổi zero-dependency, một quy tắc reviewer-routing). Thường là "Standard Asset" mà một WO
tạo ra theo Rule of Three.

## Prompt body

```text
Draft an Architecture Decision Record for the decision below. Output Markdown with a
YAML frontmatter block, then the body.

Decision topic: {{DECISION_TOPIC}}
Driving Work Order: {{WO_ID}}
Options considered: {{OPTIONS}}
Chosen option: {{CHOSEN_OPTION}}
Constraints in play: {{CONSTRAINTS}}

Frontmatter:
---
id: {{ADR_ID}}
title: <short decision title>
status: proposed
date: {{DATE}}
relatedWO: {{WO_ID}}
---

Body sections:
1. Context — the forces and constraints (include relevant v1.0 facts: Node.js ESM, zero
   runtime dependencies, cross-platform, Markdown+YAML data, .aiep/config.json).
2. Decision — the chosen option, stated as an active directive ("We will ...").
3. Options considered — each option with pros/cons, including the chosen one.
4. Consequences — positive and negative results, and what becomes harder.
5. Compliance — confirm the decision stays inside v1.0 Scope Lock.

Rules:
- State the decision plainly; avoid hedging.
- Record rejected options honestly so the trade-off is auditable.
- If the decision touches an out-of-scope v2.0 area, stop and flag it instead of drafting.
```

## Variables

| Variable | Ý nghĩa |
|----------|---------|
| `{{ADR_ID}}` | Định danh ADR (ví dụ `ADR-0007`). |
| `{{DECISION_TOPIC}}` | Điều đang được quyết định. |
| `{{WO_ID}}` | Work Order đã dẫn dắt quyết định. |
| `{{OPTIONS}}` | Các phương án đã được cân nhắc. |
| `{{CHOSEN_OPTION}}` | Phương án được chọn. |
| `{{CONSTRAINTS}}` | Các ràng buộc định hình quyết định. |
| `{{DATE}}` | Ngày quyết định. |

## Expected output

Một tài liệu ADR hoàn chỉnh với frontmatter hợp lệ và năm phần thân. Bản ghi này
tự chứa (self-contained): một người đọc không có mặt lúc đó vẫn hiểu được bối cảnh, lựa chọn, và
vì sao các phương án thay thế bị bác bỏ, mà không cần tham chiếu nguồn khác.
