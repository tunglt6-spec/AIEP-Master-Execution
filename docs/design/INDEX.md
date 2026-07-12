---
title: "AIEP v1.0 — Design Documentation Index"
---

# AIEP v1.0 — Design Documentation

Design specifications for the AI Engineering Platform (AIEP) v1.0. These documents are
frozen under **Architecture Freeze v1.0** and scoped by **Scope Lock v1.0**.

## Documents

| Document | Description |
| --- | --- |
| [DESIGN-SPECIFICATION-v1.0.md](./DESIGN-SPECIFICATION-v1.0.md) | Main design spec: goals & non-goals, the five product deliverables, high-level architecture, module responsibilities, review pipeline data flow, the Codex guard, error handling & graceful degradation, and security considerations. |
| [DATA-MODEL.md](./DATA-MODEL.md) | Data contracts: the Work Order frontmatter schema, the `decision.json` review-outcome schema, and the `dashboard.json` aggregated-state shape. |

## Related

- Review Level Policy RFC: [../rfc/RFC-0001-review-level-policy.md](../rfc/RFC-0001-review-level-policy.md)
- Governance (referenced by quality gates): `docs/governance/` — Constitution, Governance,
  Review Level Policy, Scope Lock v1.0, Architecture Freeze v1.0.

## Source map (for readers cross-referencing code)

- CLI dispatcher: `bin/aiep.js` → `src/cli/index.js`
- Commands: `src/cli/{status,validate,review,artifacts,doctor,dashboard,package}.js`
- Core: `src/core/{paths,config,frontmatter,workorders,gitdelta,reviewMatrix,secrets,logger}.js`
- Reviewers: `src/reviewers/{index,claude,ollama,cli-reviewer,gemini,codex,findings}.js`
- Dashboard build: `src/dashboard/build.js`
- Config: `.aiep/config.json`
