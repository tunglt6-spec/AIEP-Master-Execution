# AIEP Governance

Governance defines *how* work is authorized, executed, reviewed and released.
It operationalizes the [Constitution](../constitution/CONSTITUTION.md).

## 1. Governance documents

| Document | Purpose |
|----------|---------|
| [Constitution](../constitution/CONSTITUTION.md) | Enduring principles |
| [Review Level Policy](REVIEW-LEVEL-POLICY.md) | L1–L4 pipeline & Codex guard |
| [Scope Lock v1.0](SCOPE-LOCK-v1.0.md) | What is in / out of scope |
| [Architecture Freeze v1.0](ARCHITECTURE-FREEZE-v1.0.md) | Frozen technical decisions |
| ADRs (`docs/adr/`) | Recorded architecture decisions |
| SOPs (`docs/sop/`) | Repeatable operating procedures |

## 2. The delivery lifecycle

```
Backlog → Work Order (assign ReviewLevel) → Implement → Claude self review
      → Test → Validate → Route review by ReviewLevel → Collect artifacts
      → Fix findings → Re-test/Re-validate → Document → Commit → Update PMO
      → Next Work Order
```

Each Work Order lives at `pmo/work-orders/<WO-ID>/work-order.md` and progresses
through the statuses `backlog → planned → in-progress → in-review → done`
(`blocked` where applicable).

## 3. Definition of Done

A Work Order is Done when:

- Deliverables exist in the repository.
- Claude self review is complete.
- Reviewers for its ReviewLevel have run (or a documented disposition exists).
- No unresolved CRITICAL findings; HIGH findings resolved or dispositioned.
- `aiep validate` quality gates pass.
- Changes are committed as a logical delivery unit.

## 4. Quality gates (enforced by `aiep validate`)

1. Required governance & documentation artifacts present.
2. All Work Orders well-formed and carry a ReviewLevel.
3. Codex guard: no Codex artifact at any non-L4 Work Order.
4. Reviewed Work Orders have their required artifacts.
5. No unresolved CRITICAL findings (HIGH raises a warning requiring disposition).
6. No secrets committed.
7. Scope Lock respected (no out-of-scope surfaces).

## 5. Decision-making & escalation

- Engineering and architecture-implementation decisions are made by the Execution
  Lead and recorded in ADRs and the Decision Log.
- Changes to the Constitution, Scope Lock or Architecture Freeze, and any need for
  secrets, spend, destructive action outside AIEP, or a business decision the repo
  cannot ground, are **hard blockers** escalated to the Product Owner.

## 6. Evidence & audit

The `.aiep/artifacts/` tree plus git history constitute the audit record. The
dashboard and `aiep status` summarize it; `aiep artifacts <WO-ID>` inspects a
single Work Order's evidence.
