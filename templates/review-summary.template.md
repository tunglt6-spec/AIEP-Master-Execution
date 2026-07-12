# Review Summary — {{WO-ID}}

<!--
This mirrors the structure AIEP generates at
.aiep/artifacts/<WO-ID>/review-summary.md (written for L2+ Work Orders).
Do not hand-edit generated summaries; regenerate with `aiep review <WO-ID>`.
Use this template only when documenting a manual disposition alongside them.
-->

- **Title:** {{SHORT_TITLE}}
- **ReviewLevel:** {{L1|L2|L3|L4}}
- **Reviewers:** {{claude → deepseek → qwen → gemini → codex (per level)}}
- **Changed files:** {{N}}
- **Verdict:** {{PASS | CHANGES_REQUESTED}}

## Reviewer status

<!-- One line per reviewer. status ∈ completed | degraded | error -->
- claude: **{{completed}}**
- deepseek: **{{completed|degraded|error}}** ({{model}})
- qwen: **{{completed|degraded|error}}** ({{model}})
- gemini: **{{completed|degraded|error}}**
- codex: **{{completed|degraded|error}}**  <!-- L4 only -->

## Findings by severity

- CRITICAL: {{N}}
- HIGH: {{N}}
- MEDIUM: {{N}}
- LOW: {{N}}
- INFO: {{N}}

## All findings

<!-- Format: - **<SEVERITY>** [<reviewer>] — <message> -->
- **{{SEVERITY}}** [{{reviewer}}] — {{message}}
- (none)

## Disposition

{{If no unresolved CRITICAL/HIGH: "No unresolved CRITICAL/HIGH findings. Work Order
may proceed to Definition of Done." Otherwise list each blocking finding and its
resolution or documented disposition (fix, accept-with-rationale, or defer to a new
Work Order). A degraded reviewer backend must be recorded as a documented disposition,
not silently ignored.}}

> Note: If Codex was requested but blocked by the token-preservation guard (not L4),
> record that here.
