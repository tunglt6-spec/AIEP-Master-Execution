# Prompts Index

Reusable prompt templates for AIEP v1.0. Each template has a fixed structure: title,
purpose, when-to-use, a fenced prompt body, variables, and expected output.

| Prompt | Drives / Produces | Applies at |
|--------|-------------------|------------|
| [code-review-deepseek.md](code-review-deepseek.md) | DeepSeek Local Code Reviewer — correctness, runtime, edge cases, basic security, error handling | L2+ |
| [code-review-qwen.md](code-review-qwen.md) | Qwen Local Technical Reviewer — maintainability, dead code, duplication, performance, architecture, structure | L2+ |
| [design-review-gemini.md](design-review-gemini.md) | Gemini Design Reviewer — design consistency, architecture alignment, scope compliance, integration risk | L3+ |
| [work-order-authoring.md](work-order-authoring.md) | A well-formed Work Order with a justified review level | Any new WO |
| [review-summary-synthesis.md](review-summary-synthesis.md) | `review-summary.md` and pass/block disposition | L2+ |
| [adr-drafting.md](adr-drafting.md) | An Architecture Decision Record | Decision-bearing WOs |

## Usage notes

- Reviewer prompts write to `.aiep/artifacts/<WO-ID>/` (`deepseek-review.md`,
  `qwen-review.md`, `gemini-review.md`).
- All prompts require the reviewer to use the AIEP severity set:
  CRITICAL, HIGH, MEDIUM, LOW, INFO — where CRITICAL and HIGH are blocking.
- Reviewer prompts are non-overlapping by design: DeepSeek owns correctness, Qwen owns
  quality/structure, Gemini owns design/scope. This keeps `review-summary-synthesis`
  free of duplicate findings.
