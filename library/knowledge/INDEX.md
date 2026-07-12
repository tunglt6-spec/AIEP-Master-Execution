# Knowledge Index

Knowledge-base articles for AIEP v1.0 — the "why" and "how" behind the platform's policy
and practice. These are the Knowledge Assets of the Rule of Three.

| Article | Answers |
|---------|---------|
| [review-level-policy-explained.md](review-level-policy-explained.md) | What L1–L4 mean, which reviewers run at each, and how to pick a level. |
| [codex-token-preservation.md](codex-token-preservation.md) | Why Codex is L4-only and how to keep external-auditor invocations lean. |
| [local-ai-review-with-ollama.md](local-ai-review-with-ollama.md) | How DeepSeek and Qwen run locally via Ollama, and what to do when a backend is down. |
| [frontmatter-conventions.md](frontmatter-conventions.md) | The controlled YAML frontmatter subset and the rules that keep validation reliable. |
| [lessons-learned-v1.0.md](lessons-learned-v1.0.md) | What worked, what hurt, and what to carry forward from v1.0. |

## Related assets

- Policy is operationalized by the `skills/review-routing.md` SOP.
- Reviewer behavior is driven by the templates in `prompts/`.
- Environment health is checked with `aiep doctor` before relying on local review.
