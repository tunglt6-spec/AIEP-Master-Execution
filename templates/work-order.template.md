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
Frontmatter is the machine-readable source of truth parsed by AIEP.
Required fields: id, title, phase, reviewLevel, status, owner.
  reviewLevel ∈ L1 | L2 | L3 | L4
  status     ∈ backlog | planned | in-progress | in-review | done | blocked
Keep frontmatter flat (no nested mappings). Quote titles that contain ':'.
-->

## Objective

{{ONE_OR_TWO_SENTENCES_STATING_THE_OUTCOME_THIS_WORK_ORDER_DELIVERS}}

## Scope

In scope for AIEP v1.0 ({{PHASE}}): {{WHAT_IS_INCLUDED}}.
Out of scope per Scope Lock v1.0 (multi-repo platform, AI Council, Labs, multi-org,
enterprise license manager, any v2.0 feature): {{EXPLICIT_EXCLUSIONS_IF_ANY}}.

## Deliverables

- {{DELIVERABLE_1}}
- {{DELIVERABLE_2}}
- {{DELIVERABLE_3}}

<!-- Rule of Three: prefer yielding a Code Asset, a Knowledge Asset and a Standard
     Asset where the deliverable is genuinely reusable. -->

## Definition of Done

- [ ] Deliverables implemented and present in the repository.
- [ ] Claude self review completed.
- [ ] Reviewers for ReviewLevel {{L1|L2|L3|L4}} executed (or documented disposition recorded).
- [ ] No unresolved CRITICAL findings; HIGH findings resolved or dispositioned.
- [ ] `aiep validate` quality gates pass.
- [ ] Changes committed to git as a logical delivery unit.

## ReviewLevel — {{L1|L2|L3|L4}}

Rationale: {{WHY_THIS_LEVEL}}.

<!--
Pipeline per level:
  L1  claude
  L2  claude → deepseek → qwen
  L3  claude → deepseek → qwen → gemini
  L4  claude → deepseek → qwen → gemini → codex
Codex Guard: L4 is reserved for genuinely high-risk change (auth/authz, critical
security, payment, critical data migration, core runtime with system-wide impact,
major production release, or unresolvable reviewer conflict). Do NOT inflate to L4.
-->

## Traceability

- Governance: docs/governance/REVIEW-LEVEL-POLICY.md
- Scope: docs/governance/SCOPE-LOCK-v1.0.md
- Artifacts: .aiep/artifacts/{{WO-ID}}/
- Related: {{LINKS_TO_ADR_RFC_OR_UPSTREAM_WOs}}
