---
title: "AIEP v1.0 — Design Specification"
status: Frozen (Architecture Freeze v1.0)
audience: Engineering, Architecture Review Board
---

# AIEP v1.0 — Design Specification

AIEP (AI Engineering Platform) is a governance-driven engineering platform that runs
AI-assisted, multi-level code review, tracks delivery through a lightweight PMO, curates
a reusable AI engineering library, and surfaces platform state in a static dashboard.

This document is the authoritative design reference for v1.0. It is scoped by the
**Scope Lock v1.0** and **Architecture Freeze v1.0** governance documents: the module
boundaries and data contracts described here are frozen for the v1.0 line.

---

## 1. Goals & Non-Goals

### 1.1 Goals

- **Governed review, not vibes.** Every Work Order carries exactly one ReviewLevel
  (L1–L4) that deterministically resolves which reviewers must run.
- **Local-first, zero-dependency.** The platform runs on Node.js (>=18) ESM using only
  Node built-ins. No runtime `dependencies` are declared in `package.json`. It is
  cross-platform (Windows / macOS / Linux).
- **Token discipline.** Reviews operate on the git change delta, not the whole tree, and
  the expensive external auditor (Codex) is reserved for L4 only via a hard guard.
- **Graceful degradation.** A missing local model or CLI never crashes a review; it is
  recorded as a documented integration decision and the pipeline continues.
- **Auditable artifacts.** Every review writes durable per-reviewer Markdown plus a
  machine-readable `decision.json` under `.aiep/artifacts/<WO-ID>/`.
- **No secrets committed.** Secret scanning runs both on the review delta and as a
  release quality gate.

### 1.2 Non-Goals (Scope Lock v1.0 — never built in this line)

Multi-repo platform, AI Council, Labs repo, multi-org, enterprise license manager,
platinum governance, full compliance platform, and any v2.0 feature. The `validate`
command actively fails if out-of-scope surfaces (e.g. `labs/`, `multi-org/`,
`ai-council/`) appear in the repository.

---

## 2. The Five Product Deliverables (entire v1.0 scope)

1. **Core Repository** — the `aiep` CLI, core modules and reviewers (`src/`, `bin/`).
2. **Documentation System** — governance, constitution, ADRs, SOPs under `docs/`.
3. **AI Engineering Library** — reusable prompts, skills, MCP configs, knowledge under `library/`.
4. **PMO** — Work Orders, backlog, decisions, risks, sprints under `pmo/`.
5. **Dashboard** — a static HTML/CSS/JS view of live platform state under `dashboard/`.

The **Rule of Three** governs deliverable quality: an important deliverable should yield
a Code Asset, a Knowledge Asset, and a Standard Asset (pattern / checklist / SOP / prompt
/ template / lesson-learned) — only genuinely reusable assets, no filler.

---

## 3. High-Level Architecture

```
                          ┌──────────────────────────┐
   $ aiep <cmd> [opts] ──▶ │  bin/aiep.js (entry)      │
                          │  → src/cli/index.js        │  CLI DISPATCHER
                          │    (COMMANDS map + help)   │
                          └────────────┬───────────────┘
              ┌───────────┬────────────┼────────────┬───────────┬──────────┐
              ▼           ▼            ▼            ▼           ▼          ▼
           status     validate      review      artifacts    doctor   dashboard / package
              │           │            │            │           │          │
              ▼           ▼            ▼            ▼           ▼          ▼
   ┌───────────────────────────────────────────────────────────────────────────┐
   │ CORE MODULES (src/core/)                                                    │
   │  paths ─ config ─ frontmatter ─ workorders ─ gitdelta ─ reviewMatrix ─      │
   │  secrets ─ logger                                                           │
   └───────────────────────────────┬───────────────────────────────────────────┘
                                    │ resolvePipeline(level) + change delta
                                    ▼
   ┌───────────────────────────────────────────────────────────────────────────┐
   │ REVIEW ROUTER (src/reviewers/index.js)                                      │
   │   for each reviewer in pipeline → dispatch → collect findings               │
   │                                                                             │
   │   claude(self) ─▶ deepseek(ollama) ─▶ qwen(ollama) ─▶ gemini(cli) ─▶ codex  │
   │        L1            L2 ───────────────┘     L3 ────────┘      L4 (guarded)  │
   └───────────────────────────────┬───────────────────────────────────────────┘
                                    ▼
   ┌───────────────────────────────────────────────────────────────────────────┐
   │ ARTIFACTS  .aiep/artifacts/<WO-ID>/                                         │
   │   claude-self-review.md, deepseek-review.md, qwen-review.md,                │
   │   gemini-review.md (L3+), codex-audit.md (L4), review-summary.md (L2+),     │
   │   decision.json                                                             │
   └───────────────────────────────────────────────────────────────────────────┘

   DASHBOARD PATH:
     aiep dashboard [--build] ─▶ src/dashboard/build.js
        aggregates: work orders + decision.json + validate + doctor + git
        writes: dashboard/data/dashboard.json
     aiep dashboard (serve)   ─▶ built-in node:http static server @ 127.0.0.1:4173
        serves dashboard/ (static HTML/CSS/JS reads dashboard.json)
```

---

## 4. Module Responsibilities

### 4.1 Core (`src/core/`)

| Module | Responsibility |
| --- | --- |
| `paths.js` | Resolve the repo root by walking up to the nearest `.aiep/config.json`; build the canonical path map (`artifacts`, `workOrders`, `docs`, `library`, `dashboard`, …). |
| `config.js` | Load and cache `.aiep/config.json`; expose `reviewersForLevel(config, level)`. |
| `frontmatter.js` | Dependency-free parser for a **controlled** flat YAML frontmatter subset (scalars, quoted strings, inline `[a,b]` and block lists). Not a general YAML parser by design. |
| `workorders.js` | Discover, parse and validate Work Orders; enforce required fields and valid `reviewLevel`/`status`; aggregate summaries by level/status/phase. |
| `gitdelta.js` | Compute the review surface: `changedFiles()` and a size-bounded `diffText()` (truncated at 60 KB) relative to a base ref, with graceful fallbacks for fresh/non-git trees. |
| `reviewMatrix.js` | Map ReviewLevel → ordered reviewer pipeline; own the **Codex guard** (`codexAllowed`, `assertReviewerAllowed`); compute expected artifact filenames. |
| `secrets.js` | Scan text files for high-signal credential patterns; allowlist self-referential files; skip binaries. |
| `logger.js` | Minimal ANSI logger, auto-disabled on non-TTY or `NO_COLOR`. |

### 4.2 Reviewers (`src/reviewers/`)

| Module | Responsibility |
| --- | --- |
| `index.js` | The **review router**: resolves the pipeline, runs each reviewer, catches per-reviewer errors, writes artifacts, consolidates findings, and emits `decision.json` + `review-summary.md`. |
| `claude.js` | Claude self-review (Execution Lead). Runs real automated checks against the delta: ReviewLevel present, Definition of Done present, changed files resolve on disk, no secrets in delta, non-empty delta. |
| `ollama.js` | Local reviewers (**DeepSeek** = code reviewer, **Qwen** = technical reviewer) via the Ollama HTTP API. Probes reachability, substitutes an installed model if the configured one is missing (recorded as an integration decision), times out safely. |
| `cli-reviewer.js` | Shared CLI-backed reviewer engine: probe binary on PATH, invoke with a focused prompt over the delta, parse findings, or degrade with a documented disposition. |
| `gemini.js` | Design Reviewer (L3+), a thin `cli-reviewer` wrapper (`gemini -p <prompt>`). |
| `codex.js` | External Independent Auditor (L4 only). Calls `assertReviewerAllowed` as defence-in-depth before invoking `codex exec <prompt>`. |
| `findings.js` | Parse `FINDING: <SEVERITY> - <desc>` lines from reviewer output; count by severity; detect blocking findings. |

### 4.3 CLI commands (`src/cli/`, 7 commands)

- `status` — platform, Work Order, review and release summary (`--json`).
- `validate` — repository & governance quality gates; non-zero exit on any FAIL.
- `review [WO-ID]` — run the review pipeline for one WO or all not-yet-done WOs (`--base <ref>`, `--json`).
- `artifacts <WO-ID>` — list artifacts and summarise the decision for a WO.
- `doctor` — diagnose Node/git, config, Ollama + model availability, CLI reviewers, and Codex-guard sanity.
- `dashboard [--build]` — build `dashboard.json`; serve `dashboard/` over the built-in static server unless `--build`/`--no-serve`.
- `package [--dry-run]` — run quality gates then prepare an npm tarball; refuses on failing gates unless `--force`.

### 4.4 Dashboard build (`src/dashboard/build.js`)

Aggregates **real** state — Work Order summaries, each WO's `decision.json`, `validate`
gate results, `doctor` probes, git branch/commit, deliverable presence, and library asset
counts — into `dashboard/data/dashboard.json`. No demo data is fabricated.

---

## 5. Review Pipeline Data Flow

1. **Resolve** — `cmdReview` loads config and Work Orders, then `resolvePipeline(config, level)`
   returns the ordered reviewer list for the WO's `reviewLevel`.
2. **Guard** — the router filters Codex out of the pipeline unless `codexAllowed(config, level)`
   is true (L4). `guardBlockedCodex` records whether Codex was requested but blocked.
3. **Delta** — `changedFiles(root, base)` and `diffText(root, base)` build the review
   context. Reviews focus on the change surface to bound reviewer tokens.
4. **Dispatch** — each reviewer runs in order. `claude` → `deepseek`/`qwen` (Ollama) →
   `gemini` (CLI) → `codex` (CLI, L4). Any thrown error is caught and converted into a
   single HIGH finding, so one failing reviewer never aborts the pipeline.
5. **Persist** — each reviewer's Markdown artifact is written immediately.
6. **Consolidate** — findings are flattened (tagged with `reviewer`), counted by severity,
   and unresolved blocking findings (CRITICAL/HIGH) are tallied.
7. **Decide** — `decision.json` is written; `verdict` is `PASS` when there are no
   unresolved blocking findings, otherwise `CHANGES_REQUESTED`. `review-summary.md` is
   written for L2+.

---

## 6. Artifact / `decision.json` Schema

`decision.json` is the machine-readable outcome consumed by `status`, `artifacts`,
`validate` and the dashboard. See `DATA-MODEL.md` for the full field reference. Shape:

```json
{
  "workOrder": "WO-0105",
  "title": "Review Matrix & Routing",
  "reviewLevel": "L3",
  "reviewers": ["claude", "deepseek", "qwen", "gemini"],
  "codexGuard": { "requiresCodex": false, "codexAllowed": false, "guardBlockedCodex": false },
  "delta": { "changedFiles": 2, "files": ["src/core/reviewMatrix.js", "src/reviewers/index.js"] },
  "severityCounts": { "CRITICAL": 0, "HIGH": 0, "MEDIUM": 1, "LOW": 0, "INFO": 3 },
  "findings": [ { "severity": "MEDIUM", "message": "...", "reviewer": "qwen" } ],
  "unresolvedBlockingCount": 0,
  "reviewerStatuses": [ { "reviewer": "claude", "status": "completed", "model": null } ],
  "verdict": "PASS"
}
```

Artifacts per WO at `.aiep/artifacts/<WO-ID>/`: `claude-self-review.md`,
`deepseek-review.md`, `qwen-review.md`, `gemini-review.md` (L3+), `codex-audit.md` (L4),
`review-summary.md` (L2+), and `decision.json`.

---

## 7. The Codex Guard

Codex is the **External Independent Auditor** and is **never a default reviewer**. It may
run only at ReviewLevel **L4**. The guard is enforced at three independent layers
(defence-in-depth):

1. **Configuration** — `.aiep/config.json` declares `codexGuard.allowedLevels: ["L4"]`,
   and `reviewers.codex.restrictedToLevel: "L4"`.
2. **Router** — `runReview` filters Codex from the effective pipeline whenever
   `codexAllowed(config, level)` is false, setting `guardBlockedCodex` in the decision.
3. **Reviewer** — `runCodexReviewer` calls `assertReviewerAllowed(config, 'codex', level)`,
   which **throws** below L4, so Codex cannot be invoked even if called directly.

A fourth, offline check lives in the quality gates: `validate` fails if a `codex-audit.md`
artifact exists for any non-L4 Work Order, and `doctor` verifies the guard is `L4`-only.

Rationale: L4 reviewers are token-expensive and reserved for genuinely high-risk changes
(auth/authz, critical security, payment, critical data migration, core runtime with
system-wide impact, major production release, or unresolvable reviewer conflict). Work
Orders must not be inflated to L4 merely to obtain more review. See `RFC-0001`.

---

## 8. Error Handling & Graceful Degradation

- **Top-level.** `bin/aiep.js` catches any rejected command, prints `✗ aiep: <message>`,
  and sets a non-zero exit code. Unknown commands print guidance and exit non-zero.
- **Per-reviewer isolation.** The router wraps each `dispatch` in try/catch; a thrown
  error becomes a HIGH finding and an `error`-status artifact — the remaining reviewers
  still run.
- **Backend unavailability (integration decisions).** When Ollama is unreachable, the
  configured model is missing (with no fallback), or a CLI reviewer is absent from PATH,
  the reviewer returns **`degraded`** status with a documented disposition rather than a
  hard block. Provisioning gaps are treated as environment concerns, not code defects.
- **Timeouts.** Ollama generation and CLI reviewers are bounded (defaults 180 s; Ollama
  reachability probe 4 s), tunable via `AIEP_OLLAMA_TIMEOUT_MS` / `AIEP_CLI_TIMEOUT_MS`.
- **Git fallbacks.** `gitdelta` degrades cleanly for non-git trees and fresh repos with
  no HEAD, returning an empty or full-tree delta rather than erroring.
- **Gate severity.** In `validate`, FAILs set a non-zero exit; unresolved HIGH findings
  are a WARN (require documented disposition) and do not by themselves fail the build.

---

## 9. Security Considerations

- **Secret scanning.** `secrets.js` scans text files against high-signal patterns
  (API/secret keys, `Authorization: Bearer`, AWS `AKIA…`, GitHub `gh*_…`, `sk-…`, Google
  `AIza…`, PEM private keys). It runs both inside the Claude self-review (over the delta —
  a hit is a CRITICAL finding) and as the `validate` "No secrets committed" gate (a FAIL).
- **No secrets committed.** Binary files are skipped; the scanner's own definition file
  and `.aiep/config.json` are allowlisted to avoid self-flagging.
- **Static server hardening.** The dashboard server binds to `127.0.0.1` only, normalises
  request paths, and refuses any path that escapes the served `dashboard/` root (403).
- **Bounded external I/O.** Reviewer prompts carry only the size-limited diff; all
  external process and HTTP calls are time-boxed.
- **Least surface.** Zero runtime dependencies removes third-party supply-chain risk for
  the v1.0 line.

---

## 10. Frozen Constraints (Architecture Freeze v1.0)

- Node.js ESM, built-ins only, zero runtime dependencies.
- CLI entry `bin/aiep.js` → `src/cli/*`; core in `src/core/*`; reviewers in `src/reviewers/*`.
- Data is Markdown + controlled flat YAML frontmatter; config is JSON.
- The ReviewLevel matrix (L1–L4) and the Codex-L4-only guard are fixed contracts.
- Any change to these boundaries is a v2.0 concern and out of scope for v1.0.
