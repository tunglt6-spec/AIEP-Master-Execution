# Prompt: Review Summary Synthesis

**Title:** Review Summary Synthesis
**Purpose:** Synthesize the per-reviewer artifacts of a Work Order into a single
`review-summary.md` and a clear pass/block disposition.
**When to use:** After all reviewers for the Work Order's level have produced their
artifacts (L2+). Produces `.aiep/artifacts/<WO-ID>/review-summary.md` and feeds the
`decision.json` outcome.

## Prompt body

```text
Synthesize the reviewer findings for Work Order {{WO_ID}} into one review summary.

Inputs (only the artifacts that exist for this review level):
- Claude self-review:
{{CLAUDE_SELF_REVIEW}}
- DeepSeek code review:
{{DEEPSEEK_REVIEW}}
- Qwen technical review:
{{QWEN_REVIEW}}
- Gemini design review (L3+ only):
{{GEMINI_REVIEW}}
- Codex audit (L4 only):
{{CODEX_AUDIT}}

Produce:
1. Verdict line: BLOCKED or PASSED.
   - BLOCKED if ANY finding is CRITICAL or HIGH (these are blocking severities).
   - PASSED only if the worst severity across all reviewers is MEDIUM or lower.
2. Blocking findings — list every CRITICAL/HIGH finding with reviewer, location, and the
   required fix. If none, write "None."
3. Non-blocking findings — MEDIUM/LOW/INFO grouped by reviewer, kept brief.
4. Conflicts — where reviewers disagree; note if this alone would justify escalation to L4.
5. Recommended action — merge, revise-and-resubmit, or escalate.

Rules:
- Do not soften or drop a CRITICAL/HIGH finding to reach PASSED.
- Attribute every finding to its source reviewer.
- Keep the summary shorter than the combined inputs; do not restate full reviews.
```

## Variables

| Variable | Meaning |
|----------|---------|
| `{{WO_ID}}` | Work Order identifier. |
| `{{CLAUDE_SELF_REVIEW}}` | Contents of `claude-self-review.md`. |
| `{{DEEPSEEK_REVIEW}}` | Contents of `deepseek-review.md`. |
| `{{QWEN_REVIEW}}` | Contents of `qwen-review.md`. |
| `{{GEMINI_REVIEW}}` | Contents of `gemini-review.md` (L3+). |
| `{{CODEX_AUDIT}}` | Contents of `codex-audit.md` (L4). |

## Expected output

A concise `review-summary.md` with a single unambiguous verdict (BLOCKED/PASSED) driven
strictly by the blocking-severity rule, a blocking-findings list, and a recommended
action. This summary is the human- and PMO-readable roll-up that backs `decision.json`.
