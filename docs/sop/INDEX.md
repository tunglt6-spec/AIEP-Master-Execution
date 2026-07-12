# AIEP Standard Operating Procedures

Operating procedures for AIEP v1.0. Each SOP is authoritative for its area and cites
the exact CLI commands, artifacts and governance documents involved.

| SOP | Title | Covers |
| --- | --- | --- |
| [SOP-001](./SOP-001-work-order-lifecycle.md) | Work Order Lifecycle | Backlog → done, status model, ReviewLevel assignment. |
| [SOP-002](./SOP-002-review-execution.md) | Review Execution | Running `aiep review`, reviewer pipeline per level, degraded-backend dispositions, resolving CRITICAL/HIGH. |
| [SOP-003](./SOP-003-codex-l4-audit.md) | Codex L4 Audit | When/how Codex is engaged (L4 only), the Codex Guard, token preservation. |
| [SOP-004](./SOP-004-release-preparation.md) | Release Preparation | Quality gates, `aiep validate`, `aiep package`, release checklist. |
| [SOP-005](./SOP-005-ai-coding-with-aiep.md) | AI Coding with AIEP | AI agent implements → independent AIEP audit → human-gated deploy (manual RFC-0002 loop). |

## Conventions used across SOPs

- **ReviewLevels:** L1 claude · L2 +deepseek,qwen · L3 +gemini · L4 +codex.
- **Codex Guard:** Codex runs at L4 only; never inflate a Work Order to L4.
- **Severities:** CRITICAL, HIGH, MEDIUM, LOW, INFO — CRITICAL/HIGH are blocking.
- **Artifacts:** `.aiep/artifacts/<WO-ID>/` (per-reviewer files, `review-summary.md`, `decision.json`).
- **Templates:** see [../../templates/INDEX.md](../../templates/INDEX.md).
