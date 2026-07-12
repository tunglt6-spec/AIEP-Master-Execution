---
id: {{WO-ID}}
title: "{{SHORT_TITLE}}"
phase: {{PHASE}}
reviewLevel: {{L1|L2|L3|L4}}
status: {{backlog|planned|in-progress|in-review|done|blocked}}
owner: {{OWNER}}
---

# {{WO-ID}} — {{SHORT_TITLE}}

<!--
Frontmatter là nguồn chân lý (source of truth) đọc được bằng máy, do AIEP parse.
Các trường bắt buộc: id, title, phase, reviewLevel, status, owner.
  reviewLevel ∈ L1 | L2 | L3 | L4
  status     ∈ backlog | planned | in-progress | in-review | done | blocked
Giữ frontmatter phẳng (không mapping lồng nhau). Đặt title trong ngoặc kép nếu chứa ':'.
-->

## Mục tiêu

{{ONE_OR_TWO_SENTENCES_STATING_THE_OUTCOME_THIS_WORK_ORDER_DELIVERS}}

## Phạm vi

Trong phạm vi AIEP v1.0 ({{PHASE}}): {{WHAT_IS_INCLUDED}}.
Ngoài phạm vi theo Scope Lock v1.0 (nền tảng multi-repo, AI Council, Labs, multi-org,
enterprise license manager, mọi tính năng v2.0): {{EXPLICIT_EXCLUSIONS_IF_ANY}}.

## Deliverables

- {{DELIVERABLE_1}}
- {{DELIVERABLE_2}}
- {{DELIVERABLE_3}}

<!-- Rule of Three: ưu tiên tạo ra một Code Asset, một Knowledge Asset và một Standard
     Asset khi deliverable thực sự có thể tái sử dụng. -->

## Definition of Done

- [ ] Deliverables đã được triển khai và hiện diện trong repository.
- [ ] Claude self review đã hoàn thành.
- [ ] Các reviewer cho ReviewLevel {{L1|L2|L3|L4}} đã chạy (hoặc đã ghi nhận disposition đã lập tài liệu).
- [ ] Không còn CRITICAL finding chưa giải quyết; HIGH finding đã được giải quyết hoặc dispositioned.
- [ ] `aiep validate` quality gates pass.
- [ ] Thay đổi đã được commit vào git như một đơn vị bàn giao hợp lý.

## ReviewLevel — {{L1|L2|L3|L4}}

Lý do: {{WHY_THIS_LEVEL}}.

<!--
Pipeline theo từng level:
  L1  claude
  L2  claude → deepseek → qwen
  L3  claude → deepseek → qwen → gemini
  L4  claude → deepseek → qwen → gemini → codex
Codex Guard: L4 dành riêng cho thay đổi thực sự rủi ro cao (auth/authz, bảo mật quan
trọng, thanh toán, di trú dữ liệu quan trọng, core runtime có tác động toàn hệ thống,
phát hành production lớn, hoặc xung đột reviewer không thể giải quyết). KHÔNG thổi phồng lên L4.
-->

## Traceability

- Governance: docs/governance/REVIEW-LEVEL-POLICY.md
- Scope: docs/governance/SCOPE-LOCK-v1.0.md
- Artifacts: .aiep/artifacts/{{WO-ID}}/
- Related: {{LINKS_TO_ADR_RFC_OR_UPSTREAM_WOs}}
