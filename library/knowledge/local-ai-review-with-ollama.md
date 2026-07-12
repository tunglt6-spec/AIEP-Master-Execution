# Local AI Review with Ollama

AIEP runs two of its reviewers **locally** through **Ollama**: DeepSeek (Code Reviewer)
and Qwen (Technical Reviewer). Local review keeps the correctness and quality lenses fast,
private, and offline-capable — the change delta never leaves the machine for these stages.

## Which reviewers are local

| Reviewer | Role | Runs via |
|----------|------|----------|
| DeepSeek | Local Code Reviewer — correctness, runtime, edge cases, basic security, error handling | Ollama (local) |
| Qwen | Local Technical Reviewer — maintainability, dead code, duplication, performance, architecture, structure | Ollama (local) |

Gemini and Codex are **not** local — they are external reviewers used at L3 and L4
respectively.

## Why local

- **Privacy** — the delta for L2 correctness/quality review stays on the machine.
- **Cost** — no per-call external spend for the two most frequently run reviewers.
- **Availability** — reviews can run offline once the models are pulled.

## Prerequisites

1. Ollama installed and its service running.
2. The DeepSeek and Qwen models pulled locally.
3. AIEP configured to reach the local Ollama endpoint (configuration lives in
   `.aiep/config.json`; no secrets belong there — see the secret-hygiene skill).

## Verifying the environment

Use the platform's health check before relying on local review:

```text
aiep doctor
```

`aiep doctor` surfaces environment health so you can confirm the local backends are
reachable before running `aiep review`.

## When a local backend is unavailable

If Ollama is not running or a model is not pulled, do **not** silently skip the reviewer.
Apply the **graceful-degradation** skill: assign a documented disposition
(`SKIPPED_UNAVAILABLE`, `DEFERRED`, or `SUBSTITUTED`), record it in the reviewer artifact
and `decision.json`, and remember that a `DEFERRED` reviewer means the WO cannot pass.

## How local review fits the pipeline

At L2+ the order is claude → **deepseek** → **qwen** (→ gemini at L3 → codex at L4).
DeepSeek and Qwen therefore act as the first line of external-to-Claude scrutiny and, at
higher levels, as filters that clean up the change before the more expensive Gemini and
Codex stages. Each writes its own artifact: `deepseek-review.md` and `qwen-review.md`.

## Keeping the lenses non-overlapping

DeepSeek owns *correctness*; Qwen owns *quality/structure*. Keeping the prompts scoped
(see `prompts/code-review-deepseek.md` and `prompts/code-review-qwen.md`) avoids duplicate
findings and makes the review summary cleaner.
