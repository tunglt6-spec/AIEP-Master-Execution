# Skill: Graceful Degradation of Reviewer Backends

**Type:** Repeatable engineering procedure (SOP)
**Goal:** When a reviewer backend is unavailable (Ollama not running, model not pulled,
network reviewer unreachable), never fail silently and never skip review invisibly.
Record an explicit, documented **disposition** so the decision remains auditable.

## Why

DeepSeek and Qwen run locally via Ollama; Gemini and Codex are external. Any of these
can be temporarily unavailable. A review that quietly drops a reviewer produces a false
"passed" and breaks the governance guarantee. Degradation must be visible.

## Dispositions (choose exactly one per unavailable reviewer)

| Disposition | Meaning | When appropriate |
|-------------|---------|------------------|
| `SKIPPED_UNAVAILABLE` | Backend could not be reached; review not performed. | Backend down and the WO is low-risk enough to proceed with a recorded gap. |
| `DEFERRED` | Review postponed; WO cannot pass until the reviewer runs. | Any L3/L4 design/audit step, or blocking-risk change. |
| `SUBSTITUTED` | A documented fallback reviewer ran in its place. | Only if an equivalent lens is available; must be named. |

Record the chosen disposition, the reason, and a timestamp in the reviewer's artifact
and in `decision.json`. Never invent findings for a reviewer that did not run.

## Procedure

1. **Probe before invoking.** Check the backend is reachable (e.g. Ollama responding,
   model present). Use `aiep doctor` to surface environment health.
2. **On unavailability, classify risk.** Read the WO `reviewLevel` and risk notes.
3. **Assign a disposition** from the table. For L4 or any blocking-risk change, prefer
   `DEFERRED` over `SKIPPED_UNAVAILABLE` — high-risk work must not pass with a gap.
4. **Write the disposition** into the expected artifact file (e.g. a `qwen-review.md`
   that states `disposition: SKIPPED_UNAVAILABLE` with the reason) so the artifact set
   for the level is still complete and honest.
5. **Reflect it in the summary.** `review-summary.md` lists any degraded reviewer and
   its disposition; a `DEFERRED` reviewer means the verdict cannot be PASSED.

## Definition of done

Every reviewer required by the WO's level has either a real review or a recorded
disposition. No reviewer is missing without explanation, and no missing reviewer is
counted as a pass.
