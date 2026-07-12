# AIEP v1.0.0 — Release Notes

**Release type:** Release Candidate (pending Product Owner & ARB final review)
**Date:** 2026-07-12

## Summary

AIEP v1.0 delivers a governance-driven AI engineering platform: a zero-dependency
Node.js CLI that runs AI-assisted multi-level code review (L1–L4), manages work
through a PMO, curates a reusable AI engineering library, and renders a live
dashboard.

## What's included (five product deliverables)

1. **Core Repository & CLI** — `aiep status | validate | review | artifacts |
   doctor | dashboard | package`.
2. **Documentation System** — constitution, governance, design spec + data model,
   ADRs, RFC, SOPs, release docs.
3. **AI Engineering Library** — prompts, skills, MCP descriptors, knowledge.
4. **PMO** — backlog, 3 sprints, milestones, 24 Work Orders, issues, risks,
   decisions.
5. **Dashboard** — ten live-data panels.

## Review model

- Review Levels L1–L4 with per-level reviewer pipelines.
- DeepSeek + Qwen local review via Ollama (real, dual local review).
- Gemini design review and Codex L4 audit via CLI, with graceful degradation.
- **Codex guard:** external audit only at L4; zero Codex usage in v1.0 by design.

## Quality

- 23 automated tests (`node:test`) — all passing.
- 8 quality gates via `aiep validate`.
- No unresolved CRITICAL/HIGH findings; no secrets committed; Scope Lock respected.

## Known limitations

- Local-model finding extraction is best-effort (structured `FINDING:` protocol);
  raw output is preserved.
- Gemini/Codex require their CLIs on PATH; otherwise their steps are documented
  dispositions.

## Upgrade / install

```bash
npm install -g .        # zero dependencies; offline-capable
aiep doctor && aiep status
```
