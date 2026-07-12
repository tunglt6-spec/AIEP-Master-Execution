# Prompt: Soạn thảo AIEP Work Order

**Title:** AIEP Work Order Authoring
**Purpose:** Soạn một AIEP Work Order (WO) đúng định dạng — đơn vị mà PMO theo dõi và
review pipeline tiêu thụ — với một review level đúng và được biện minh.
**When to use:** Khi bắt đầu bất kỳ đơn vị công việc kỹ thuật mới nào sẽ đi qua
AIEP review. Tạo ra một tài liệu WO với frontmatter và phần thân sẵn sàng cho `aiep validate`.

## Prompt body

```text
Draft an AIEP Work Order for the task below. Output a single Markdown document with a
YAML frontmatter block followed by the body.

Task description: {{TASK_DESCRIPTION}}
Proposed scope of change: {{SCOPE_OF_CHANGE}}
Risk notes (auth/security/payment/data/runtime?): {{RISK_NOTES}}

Frontmatter (controlled subset only):
---
id: {{WO_ID}}
title: <concise imperative title>
status: draft
reviewLevel: <L1 | L2 | L3 | L4>
owner: <engineer>
deliverable: <Core Repository | Documentation System | AI Engineering Library | PMO | Dashboard>
---

Choose reviewLevel using the Review Level Policy:
- L1 (claude only): trivial, low-risk, isolated change.
- L2 (claude -> deepseek -> qwen): normal code change needing correctness + quality review.
- L3 (adds gemini): change with design/architecture/integration impact.
- L4 (adds codex): ONLY genuinely high-risk — auth, authz, critical security, payment,
  critical data migration, core runtime with system-wide impact, major production
  release, or unresolvable reviewer conflict.
CODEX GUARD: do not inflate a WO to L4 just to get more review. Justify L4 explicitly.

Body sections:
1. Context — why this work exists.
2. Objective — the outcome, testable.
3. In scope / Out of scope — bullet lists (respect v1.0 Scope Lock).
4. Acceptance criteria — checklist.
5. Review level justification — one sentence tying the chosen level to the policy.
6. Rule of Three — the Code / Knowledge / Standard asset this WO will produce (or "none" with reason).
```

## Variables

| Variable | Ý nghĩa |
|----------|---------|
| `{{WO_ID}}` | Định danh Work Order được gán. |
| `{{TASK_DESCRIPTION}}` | Mô tả bằng ngôn ngữ thông thường về tác vụ. |
| `{{SCOPE_OF_CHANGE}}` | Các file/module dự kiến thay đổi. |
| `{{RISK_NOTES}}` | Bất kỳ chiều rủi ro cao nào có thể biện minh cho L4. |

## Expected output

Một tài liệu WO Markdown hoàn chỉnh: frontmatter hợp lệ (chỉ các key có kiểm soát), một phần thân với
sáu phần, và một biện minh review-level tường minh. Một WO đúng định dạng sẽ pass
`aiep validate` và cung cấp cho PMO và dashboard các trường mà chúng theo dõi.
