# AIEP — AI Engineering Platform (v1.0)

AIEP is a governance-driven engineering platform that runs **AI-assisted,
multi-level code review**, tracks work through a **PMO**, curates a reusable **AI
engineering library**, and surfaces everything in a **dashboard** — all from a
single zero-dependency Node.js CLI.

## Why

AI can write and review code quickly, but ungoverned it produces changes that are
hard to audit and reviewers that are hard to trust. AIEP makes the process
**governed, auditable and repeatable**: every material change is a Work Order,
reviewed at a level proportional to its risk (L1–L4), leaving durable evidence.

## The five product deliverables

1. **Core Repository** — CLI, review engine, validation, scripts, tools.
2. **Documentation System** — constitution, governance, design, ADR/RFC/SOP, release.
3. **AI Engineering Library** — prompts, skills, MCP descriptors, knowledge.
4. **PMO** — backlog, sprints, milestones, work orders, issues, risks, decisions.
5. **Dashboard** — ten live-data panels for architecture, sprints, reviews and health.

## Architecture (frozen — Architecture Freeze v1.0)

- **Runtime:** Node.js (>= 18), ESM, **zero runtime dependencies** (built-ins only).
- **Layers:** `bin/aiep.js` → `src/cli/*` → `src/core/*` (+ `src/reviewers/*`).
- **Data:** Markdown + controlled YAML frontmatter; JSON config & artifacts.
- **Dashboard:** static HTML/CSS/JS reading generated `dashboard/data/dashboard.json`.

See [docs/design/DESIGN-SPECIFICATION-v1.0.md](docs/design/DESIGN-SPECIFICATION-v1.0.md).

## AI operating model & Review Levels

| Level | Reviewer pipeline |
|-------|-------------------|
| L1 | Claude (self review) |
| L2 | Claude → DeepSeek → Qwen |
| L3 | Claude → DeepSeek → Qwen → Gemini |
| L4 | Claude → DeepSeek → Qwen → Gemini → **Codex** |

- DeepSeek & Qwen run **locally via Ollama**; Gemini & Codex are CLI-backed.
- **Codex is invoked only at L4** (token-preservation guard, enforced in code and
  validation). See [Review Level Policy](docs/governance/REVIEW-LEVEL-POLICY.md).
- Missing backends degrade gracefully with a documented integration decision —
  never a fake pass.

## Install

```bash
# From the repository (zero dependencies — no network needed)
npm install -g .
# or run directly
node bin/aiep.js <command>
```

Cross-platform install helpers: `scripts/install.ps1` (Windows) and
`scripts/install.sh` (macOS/Linux).

## Usage

```bash
aiep status                 # platform, work-order, review & release status
aiep validate               # run the quality gates
aiep doctor                 # diagnose environment & reviewer backends
aiep review WO-0105         # review one Work Order per its ReviewLevel
aiep review                 # review all non-done Work Orders
aiep artifacts WO-0105      # inspect a Work Order's review evidence
aiep dashboard              # build live data + serve the dashboard
aiep package                # verify gates & prepare the release tarball
```

## Repository layout

```
.aiep/            config.json + artifacts/<WO-ID>/ (review evidence)
bin/              aiep.js (CLI entry)
src/core/         config, paths, frontmatter, workorders, gitdelta, reviewMatrix, secrets
src/reviewers/    claude, ollama, cli-reviewer, gemini, codex, findings, router
src/cli/          status, validate, review, artifacts, doctor, dashboard, package
src/dashboard/    build.js (live data generator)
dashboard/        index.html, styles.css, app.js
docs/             constitution, governance, design, adr, rfc, sop, release
pmo/              backlog, sprints, milestones, work-orders, issues, risks, decisions
library/          prompts, skills, mcp, knowledge
templates/        work-order, adr, rfc, sop, review templates
scripts/          bootstrap & install (ps1/sh), scaffold-workorders.mjs
test/             node:test suites
```

## Governance

Start with the [Constitution](docs/constitution/CONSTITUTION.md), then
[Governance](docs/governance/GOVERNANCE.md), the
[Review Level Policy](docs/governance/REVIEW-LEVEL-POLICY.md), the
[Scope Lock v1.0](docs/governance/SCOPE-LOCK-v1.0.md) and the
[Architecture Freeze v1.0](docs/governance/ARCHITECTURE-FREEZE-v1.0.md).

## Status

AIEP v1.0.0 — **release candidate** pending Product Owner & ARB final review.
