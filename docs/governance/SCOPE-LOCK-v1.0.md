# Scope Lock v1.0

This document freezes the scope of AIEP v1.0. It is changeable only by the
Product Owner and ARB. `aiep validate` enforces the out-of-scope list by failing
if any forbidden surface appears in the repository.

## In scope — the five Product Deliverables

1. **Core Repository** — repository foundation, bootstrap, runtime foundation,
   source code, scripts, tools, validation, CLI.
2. **Documentation System** — constitution, governance, PROJECT.md, design
   specification, ADR, RFC, SOP, implementation package, work order, review
   package, release documentation, checklists.
3. **AI Engineering Library** — prompt library, skill library, MCP library,
   knowledge library, reusable engineering assets.
4. **PMO** — product backlog, sprint, milestone, release, issue, risk, decision
   log.
5. **Dashboard** — architecture status, sprint status, AI runtime status,
   knowledge assets, review status (and the other required panels).

## Explicitly OUT OF SCOPE for v1.0

The following must **not** be built in v1.0. Their presence fails validation:

- Multi-Repository Platform
- AI Council
- Labs Repository
- Multi-Organization support
- Enterprise License Manager
- Platinum Governance
- Full Compliance Platform
- Any AIEP v2.0 feature

Directory-level tripwires enforced by validation: `labs/`, `multi-org/`,
`multi-organization/`, `ai-council/`, `enterprise-license-manager/`.

## Boundary of authority

The Execution Lead operates only within the AIEP repository. It must not modify
other repositories (e.g. PickleFund), delete data outside AIEP, commit secrets,
incur cloud cost, purchase services, publish public production, or alter this
Scope Lock or the Architecture Freeze. Any such need is escalated as a hard
blocker.
