---
title: "AIEP v1.0 — Data Model"
status: Frozen (Architecture Freeze v1.0)
---

# AIEP v1.0 — Data Model

This document specifies the three core data contracts of the platform:

1. the **Work Order** frontmatter schema (author-facing source of truth),
2. the **`decision.json`** schema (review outcome), and
3. the **`dashboard.json`** shape (aggregated platform state).

All Markdown documents use a controlled, flat YAML frontmatter subset parsed by
`src/core/frontmatter.js` (scalars, quoted strings, inline `[a, b]` lists, and block
`- item` lists). Nested mappings are intentionally unsupported.

---

## 1. Work Order Frontmatter

A Work Order lives at `pmo/work-orders/<WO-ID>/work-order.md`. Its frontmatter block is
the machine-readable source of truth; the body carries objective, scope, deliverables and
Definition of Done.

### 1.1 Fields

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `id` | string | yes | Work Order identifier, e.g. `WO-0105`. Also the artifact directory name. |
| `title` | string | yes | Human-readable title (quote if it contains special characters). |
| `reviewLevel` | enum | yes | One of `L1`, `L2`, `L3`, `L4`. Determines the reviewer pipeline. |
| `status` | enum | yes | One of `backlog`, `planned`, `in-progress`, `in-review`, `done`, `blocked`. |
| `phase` | string | yes | Delivery phase label, e.g. `P1-Core`. |
| `owner` | string | no | Owning role, e.g. `claude-execution-lead`. |

Validation (`src/core/workorders.js`): the required set is `id, title, reviewLevel,
status, phase`. An invalid `reviewLevel` or `status` is reported as a load error and
fails the `validate` "All Work Orders valid & have ReviewLevel" gate.

### 1.2 Example

```yaml
---
id: WO-0105
title: "Review Matrix & Routing"
phase: P1-Core
reviewLevel: L3
status: done
owner: claude-execution-lead
---
```

### 1.3 Body conventions

The body should contain an **Objective**, **Scope** (referencing Scope Lock v1.0),
**Deliverables**, and a **Definition of Done** section. The Claude self-review checks for
a Definition of Done heading (`definition of done` / `dod`) and emits a MEDIUM finding if
it is absent.

---

## 2. `decision.json`

Written by the review router to `.aiep/artifacts/<WO-ID>/decision.json`. It is the
canonical, machine-readable review outcome consumed by `status`, `artifacts`, `validate`
and the dashboard build.

### 2.1 Fields

| Field | Type | Description |
| --- | --- | --- |
| `workOrder` | string | The WO id (`wo.meta.id`). |
| `title` | string | The WO title. |
| `reviewLevel` | enum | `L1`–`L4` — the level under which the review ran. |
| `reviewers` | string[] | The **effective** ordered pipeline actually run (Codex removed unless L4). |
| `codexGuard` | object | `{ requiresCodex, codexAllowed, guardBlockedCodex }` (all boolean). `guardBlockedCodex` is true when the level's pipeline included Codex but the guard blocked it. |
| `delta` | object | `{ changedFiles: number, files: string[] }` — the reviewed change surface. |
| `severityCounts` | object | Integer counts keyed by `CRITICAL, HIGH, MEDIUM, LOW, INFO`. |
| `findings` | object[] | Flattened findings; each `{ severity, message, reviewer }`. |
| `unresolvedBlockingCount` | number | Count of findings whose severity is in the blocking set (`CRITICAL`, `HIGH`). |
| `reviewerStatuses` | object[] | Per-reviewer `{ reviewer, status, model }`. `status` ∈ `completed` \| `degraded` \| `error`; `model` is the Ollama model used or `null`. |
| `verdict` | enum | `PASS` when `unresolvedBlockingCount === 0`, else `CHANGES_REQUESTED`. |

### 2.2 Severity model

Severities: `CRITICAL, HIGH, MEDIUM, LOW, INFO`. **Blocking** severities are `CRITICAL`
and `HIGH`. Findings are parsed from reviewer output lines of the exact form
`FINDING: <SEVERITY> - <description>`.

### 2.3 Example

```json
{
  "workOrder": "WO-0105",
  "title": "Review Matrix & Routing",
  "reviewLevel": "L3",
  "reviewers": ["claude", "deepseek", "qwen", "gemini"],
  "codexGuard": { "requiresCodex": false, "codexAllowed": false, "guardBlockedCodex": false },
  "delta": {
    "changedFiles": 2,
    "files": ["src/core/reviewMatrix.js", "src/reviewers/index.js"]
  },
  "severityCounts": { "CRITICAL": 0, "HIGH": 0, "MEDIUM": 1, "LOW": 0, "INFO": 3 },
  "findings": [
    { "severity": "MEDIUM", "message": "Extract duplicated guard check into a helper.", "reviewer": "qwen" }
  ],
  "unresolvedBlockingCount": 0,
  "reviewerStatuses": [
    { "reviewer": "claude", "status": "completed", "model": null },
    { "reviewer": "deepseek", "status": "degraded", "model": null },
    { "reviewer": "qwen", "status": "degraded", "model": null },
    { "reviewer": "gemini", "status": "degraded", "model": null }
  ],
  "verdict": "PASS"
}
```

---

## 3. `dashboard.json`

Written by `src/dashboard/build.js` to `dashboard/data/dashboard.json`. Every value is
derived from live repository state — Work Orders, per-WO `decision.json`, the `validate`
gates, `doctor` probes and git. No demo data is fabricated.

### 3.1 Top-level shape

| Field | Type | Description |
| --- | --- | --- |
| `generatedAt` | string | ISO timestamp of the build. |
| `platform` | object | Echo of `config.platform` (`name`, `displayName`, `version`, `scopeLock`, `architectureFreeze`). |
| `git` | object | `{ isRepo, branch, commit }`. |
| `architecture` | object | `{ freeze, scopeLock, deliverables: [{ name, present }] }` for the five deliverables. |
| `sprints` | object[] | `{ id, name, status, goal }` from `pmo/sprints/*.md` (empty if none). |
| `workOrders` | object | `{ summary, rows }` — see below. |
| `reviewLevelDistribution` | object | Counts `{ L1, L2, L3, L4 }`. |
| `reviewers` | object[] | Reviewer/backend health filtered from `doctor` (`{ name, ok, detail }`). |
| `findings` | object | `{ counts: {CRITICAL,HIGH,MEDIUM,LOW,INFO}, items: [{ wo, severity, message, reviewer }] }`. |
| `knowledgeAssets` | object | File counts: `prompts, skills, mcp, knowledge, adrs, sops, templates`. |
| `releaseReadiness` | object | `{ gatesPassed, gatesFailed, gatesWarned, ok, checks }` from `validate`. |
| `systemHealth` | object[] | Full `doctor` items (`{ name, ok, detail }`). |

### 3.2 `workOrders`

- `summary` — `{ total, byLevel: {L1..L4}, byStatus: {…}, byPhase: {…} }`.
- `rows` — one entry per WO: `{ id, title, phase, reviewLevel, status, verdict, reviewers }`,
  where `verdict` is taken from that WO's `decision.json` or `"not-reviewed"` if absent,
  and `reviewers` falls back to the configured pipeline for the level when unreviewed.

### 3.3 Consumption

The static dashboard (`dashboard/index.html` + assets) fetches `data/dashboard.json` and
renders it client-side. It is served by the built-in `node:http` static server
(`aiep dashboard`) bound to `127.0.0.1:4173`, or by any static file server.
