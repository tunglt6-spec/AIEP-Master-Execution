# Prompt: Review Summary Synthesis

**Title:** Review Summary Synthesis
**Purpose:** Tổng hợp các artifact theo từng reviewer của một Work Order thành một
`review-summary.md` duy nhất và một disposition pass/block rõ ràng.
**When to use:** Sau khi tất cả reviewer cho mức của Work Order đã tạo ra
artifact của chúng (L2+). Tạo ra `.aiep/artifacts/<WO-ID>/review-summary.md` và cung cấp
đầu vào cho kết quả `decision.json`.

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

| Variable | Ý nghĩa |
|----------|---------|
| `{{WO_ID}}` | Định danh Work Order. |
| `{{CLAUDE_SELF_REVIEW}}` | Nội dung của `claude-self-review.md`. |
| `{{DEEPSEEK_REVIEW}}` | Nội dung của `deepseek-review.md`. |
| `{{QWEN_REVIEW}}` | Nội dung của `qwen-review.md`. |
| `{{GEMINI_REVIEW}}` | Nội dung của `gemini-review.md` (L3+). |
| `{{CODEX_AUDIT}}` | Nội dung của `codex-audit.md` (L4). |

## Expected output

Một `review-summary.md` súc tích với một verdict duy nhất, rõ ràng (BLOCKED/PASSED) được điều khiển
nghiêm ngặt bởi quy tắc blocking-severity, một danh sách blocking-findings, và một recommended
action. Bản tổng hợp này là bản roll-up mà con người và PMO đọc được, làm nền cho `decision.json`.
