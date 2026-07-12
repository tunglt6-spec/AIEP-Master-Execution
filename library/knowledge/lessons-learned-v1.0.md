# Lessons Learned — AIEP v1.0

A living record of what worked, what hurt, and what we would do the same way again while
building AIEP v1.0. Lessons learned are a first-class **Standard Asset** under the Rule of
Three; capturing them is how the platform avoids repeating its own mistakes.

## What worked

- **Zero runtime dependencies.** Building the core on Node.js built-ins only kept the
  install trivial, the attack surface small, and cross-platform behavior predictable. New
  dependencies were treated as a HIGH finding by the technical reviewer, which held the
  line.
- **One review level per Work Order.** A single `reviewLevel` made routing deterministic
  and the dashboard easy to aggregate. No ambiguity about which reviewers should run.
- **Non-overlapping reviewer lenses.** Giving DeepSeek correctness and Qwen quality
  produced clean, de-duplicated review summaries. The synthesis step got noticeably easier.
- **Delta-scoped review.** Focusing reviewers on the change delta cut noise dramatically
  and made findings actionable.
- **Local review via Ollama.** Running DeepSeek and Qwen locally kept the common L2 path
  fast, private, and cheap.

## What hurt (and the fix)

- **Level inflation toward L4.** Early on there was a pull to mark work L4 "to be safe,"
  which spent the external auditor and slowed delivery. Fix: the explicit CODEX GUARD and
  a documented high-risk criteria list. When in doubt between L3 and L4, default to L3.
- **Silent reviewer skips.** A backend being down could quietly drop a reviewer and
  produce a false pass. Fix: the graceful-degradation skill with explicit dispositions
  recorded in artifacts and `decision.json`.
- **Frontmatter drift.** Ad-hoc keys crept in and occasionally dropped Work Orders from
  the dashboard. Fix: a controlled key set and validation (`aiep validate`).
- **Scope creep temptation.** v2.0-shaped ideas (AI Council, multi-repo, Labs) kept
  appearing in reviews. Fix: the Scope Lock, enforced as a CRITICAL finding by the Gemini
  design reviewer.

## What we would keep

- The five-deliverable scope discipline (Core, Docs, Library, PMO, Dashboard) and the hard
  Scope Lock against v2.0 features.
- The Rule of Three as an authoring habit: every important WO leaves a Code, Knowledge,
  and Standard asset — no filler.
- `aiep doctor` as the pre-flight check before relying on local review.

## Carry-forward reminders

1. Author at the lowest correct review level; justify any L4.
2. Never let a missing reviewer count as a pass.
3. Keep secrets out of committed content and artifacts; rotate on exposure.
4. Turn each notable decision into an ADR and each notable outcome into a lesson here.
