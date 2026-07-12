# AIEP Documentation System

The documentation system is one of the five product deliverables. It is
organized as:

| Area | Path | Contents |
|------|------|----------|
| Constitution | `constitution/` | Enduring principles |
| Governance | `governance/` | Governance, Review Level Policy, Scope Lock, Architecture Freeze |
| Design | `design/` | Design specification, data model |
| ADR | `adr/` | Architecture Decision Records |
| RFC | `rfc/` | Requests for Comments |
| SOP | `sop/` | Standard Operating Procedures |
| Release | `release/` | Release checklist, quality gates, release notes, final package |

## Reading order for newcomers

1. [PROJECT.md](../PROJECT.md) — what AIEP is and how to run it.
1. [User Guide](USER-GUIDE.md) — detailed install & usage for every command.
2. [Constitution](constitution/CONSTITUTION.md) — the principles.
3. [Governance](governance/GOVERNANCE.md) — how work flows.
4. [Review Level Policy](governance/REVIEW-LEVEL-POLICY.md) — L1–L4 and the Codex guard.
5. [Design Specification](design/DESIGN-SPECIFICATION-v1.0.md) — the architecture.

## Conventions

- Documents are Markdown. Governance and design docs are versioned in their title
  where they are frozen (e.g. `SCOPE-LOCK-v1.0.md`).
- Decisions are recorded as ADRs; proposals as RFCs; procedures as SOPs.
- Every subdirectory has an `INDEX.md` where multiple documents exist.
