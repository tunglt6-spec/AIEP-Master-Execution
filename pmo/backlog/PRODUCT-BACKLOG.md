# AIEP v1.0 Product Backlog

The backlog is normalized into 24 Work Orders across four phases. Each Work Order
carries exactly one ReviewLevel. Full detail lives in
`pmo/work-orders/<WO-ID>/work-order.md`.

## Phase 0 — Foundation

| WO | Title | Level |
|----|-------|-------|
| WO-0001 | Repository Skeleton | L1 |
| WO-0002 | Documentation Framework | L1 |
| WO-0003 | Governance Framework | L2 |
| WO-0004 | PMO Framework | L1 |
| WO-0005 | Template Framework | L1 |
| WO-0006 | Bootstrap Scripts | L2 |
| WO-0007 | PROJECT.md | L1 |
| WO-0008 | Repository Validation | L2 |

## Phase 1 — Core Platform

| WO | Title | Level |
|----|-------|-------|
| WO-0101 | AIEP CLI Foundation | L2 |
| WO-0102 | Config & Paths Core | L1 |
| WO-0103 | Frontmatter & Work Order Loader | L2 |
| WO-0104 | Git Delta Processing | L2 |
| WO-0105 | Review Matrix & Routing | L3 |
| WO-0106 | Artifact Management | L2 |
| WO-0107 | AI Engineering Library Foundation | L1 |

## Phase 2 — Operations

| WO | Title | Level |
|----|-------|-------|
| WO-0201 | Ollama Local Reviewer Integration | L3 |
| WO-0202 | Gemini Reviewer Integration | L2 |
| WO-0203 | Codex L4 Guard | L2 |
| WO-0204 | Review Workflow | L3 |
| WO-0205 | Dashboard | L2 |
| WO-0206 | Doctor & Status Commands | L1 |

## Phase 3 — Production Readiness

| WO | Title | Level |
|----|-------|-------|
| WO-0301 | Installer & Packaging | L2 |
| WO-0302 | Release Validation & Quality Gates | L2 |
| WO-0303 | Documentation Completion & Release Candidate | L2 |

## Review Level distribution

- L1: 8 · L2: 13 · L3: 3 · L4: 0

L4 is zero **by design**: no v1.0 Work Order met the high-risk bar that justifies
external Codex audit. See [Review Level Policy](../../docs/governance/REVIEW-LEVEL-POLICY.md).
