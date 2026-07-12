# Skills Index

Repeatable engineering procedures (SOPs) for AIEP v1.0. Each skill is a documented
routine that an engineer or agent follows the same way every time, so behavior stays
consistent and auditable.

| Skill | Purpose | Ties into |
|-------|---------|-----------|
| [review-routing.md](review-routing.md) | Route a Work Order to exactly the reviewers its `ReviewLevel` requires; enforce the Codex-at-L4-only guard. | `aiep review`, Review Level Policy |
| [git-delta-review.md](git-delta-review.md) | Scope every review to the change delta, not the whole tree. | All reviewer prompts |
| [graceful-degradation.md](graceful-degradation.md) | Handle unavailable reviewer backends with an explicit, recorded disposition. | `aiep doctor`, `decision.json` |
| [secret-hygiene.md](secret-hygiene.md) | Keep secrets out of the repo and artifacts; scan the delta; rotate on exposure. | DeepSeek basic-security lens |

## How skills relate

- **review-routing** decides *who* reviews; **git-delta-review** decides *what* they
  review; **graceful-degradation** decides what happens when a reviewer is *absent*.
- **secret-hygiene** is a standing precondition that applies to every WO regardless of
  review level, and a confirmed secret is always a blocking (CRITICAL) finding.
