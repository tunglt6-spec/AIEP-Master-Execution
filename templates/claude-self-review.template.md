# Claude Self Review — {{WO-ID}}

<!--
Mirrors the artifact AIEP writes at
.aiep/artifacts/<WO-ID>/claude-self-review.md. Claude Code is the Engineering Team
& Execution Lead; the self review is the mandatory first stage of EVERY ReviewLevel
(L1–L4) before any downstream reviewer runs.
-->

- **Work Order:** {{WO-ID}} — {{SHORT_TITLE}}
- **ReviewLevel:** {{L1|L2|L3|L4}}
- **Role:** Engineering Team & Execution Lead (self review)
- **Changed files:** {{N}}

## Automated checks

- [ ] Work Order has ReviewLevel
- [ ] Definition of Done documented
- [ ] All changed files resolve on disk
- [ ] No secrets in delta
- [ ] Change delta is non-empty

## Manual checks

- [ ] Change satisfies the Work Order Objective and Deliverables.
- [ ] Every Definition of Done item is addressed.
- [ ] Scope respected — no Scope Lock v1.0 (v2.0) surface introduced.
- [ ] No new runtime dependency (Node built-ins only).
- [ ] Cross-platform safe (no OS-specific path/command assumptions).
- [ ] Logic, edge cases and error handling self-checked before downstream review.
- [ ] ReviewLevel is correct for the risk (Codex/L4 not inflated).

## Findings

<!-- Format: - **<SEVERITY>** — <message>  (SEVERITY ∈ CRITICAL/HIGH/MEDIUM/LOW/INFO) -->
- **{{SEVERITY}}** — {{message}}
- **INFO** — Self review passed all automated checks.

## Reviewer notes

{{The change was authored to satisfy the referenced Work Order and its Definition of
Done. Note anything downstream reviewers should focus on, plus any assumptions.}}
