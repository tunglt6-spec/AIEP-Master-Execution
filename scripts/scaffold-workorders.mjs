#!/usr/bin/env node
// scripts/scaffold-workorders.mjs
// Idempotent scaffolder for AIEP v1.0 Work Orders. Generates one
// pmo/work-orders/<WO-ID>/work-order.md per definition below. Re-running only
// creates files that are missing (never overwrites human edits) unless --force.

import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const force = process.argv.includes('--force');

/** @type {Array<object>} */
const WORK_ORDERS = [
  // ---- Phase 0 — Foundation
  { id: 'WO-0001', title: 'Repository Skeleton', phase: 'P0-Foundation', reviewLevel: 'L1', status: 'done',
    objective: 'Establish the AIEP repository structure, git baseline and ignore rules.',
    deliverables: ['Directory skeleton (src, docs, pmo, library, templates, scripts, dashboard, .aiep)', '.gitignore', 'package.json', 'LICENSE'],
    rationale: 'Structural scaffolding only; no runtime or security surface. Claude self review is sufficient.' },
  { id: 'WO-0002', title: 'Documentation Framework', phase: 'P0-Foundation', reviewLevel: 'L1', status: 'done',
    objective: 'Create the documentation system layout (constitution, governance, ADR, RFC, SOP, design, release).',
    deliverables: ['docs/ tree', 'documentation index', 'doc conventions'],
    rationale: 'Documentation scaffolding, low risk.' },
  { id: 'WO-0003', title: 'Governance Framework', phase: 'P0-Foundation', reviewLevel: 'L2', status: 'done',
    objective: 'Author Constitution, Governance, Review Level Policy, Scope Lock and Architecture Freeze.',
    deliverables: ['CONSTITUTION.md', 'GOVERNANCE.md', 'REVIEW-LEVEL-POLICY.md', 'SCOPE-LOCK-v1.0.md', 'ARCHITECTURE-FREEZE-v1.0.md'],
    rationale: 'Governance underpins the whole platform; local dual review (DeepSeek+Qwen) guards consistency and correctness.' },
  { id: 'WO-0004', title: 'PMO Framework', phase: 'P0-Foundation', reviewLevel: 'L1', status: 'done',
    objective: 'Set up PMO structure: backlog, sprints, milestones, work orders, issues, risks, decisions.',
    deliverables: ['pmo/ tree', 'PRODUCT-BACKLOG.md', 'DECISION-LOG.md', 'RISK-REGISTER.md'],
    rationale: 'Planning artifacts, low technical risk.' },
  { id: 'WO-0005', title: 'Template Framework', phase: 'P0-Foundation', reviewLevel: 'L1', status: 'done',
    objective: 'Provide reusable templates for Work Orders, ADR, RFC, SOP and review artifacts.',
    deliverables: ['templates/ set'],
    rationale: 'Static templates, low risk.' },
  { id: 'WO-0006', title: 'Bootstrap Scripts', phase: 'P0-Foundation', reviewLevel: 'L2', status: 'done',
    objective: 'Cross-platform bootstrap/install scripts for the platform.',
    deliverables: ['scripts/bootstrap.ps1', 'scripts/bootstrap.sh', 'scripts/install.ps1', 'scripts/install.sh'],
    rationale: 'Scripts execute on user machines; dual local review checks correctness and basic safety.' },
  { id: 'WO-0007', title: 'PROJECT.md', phase: 'P0-Foundation', reviewLevel: 'L1', status: 'done',
    objective: 'Author the top-level PROJECT.md describing purpose, scope, architecture and usage.',
    deliverables: ['PROJECT.md'],
    rationale: 'Documentation, low risk.' },
  { id: 'WO-0008', title: 'Repository Validation', phase: 'P0-Foundation', reviewLevel: 'L2', status: 'done',
    objective: 'Implement `aiep validate` quality gates (docs, WO integrity, Codex guard, secrets, scope lock).',
    deliverables: ['src/cli/validate.js', 'src/core/secrets.js'],
    rationale: 'Validation is a correctness-critical gate; dual local review is warranted.' },

  // ---- Phase 1 — Core Platform
  { id: 'WO-0101', title: 'AIEP CLI Foundation', phase: 'P1-Core', reviewLevel: 'L2', status: 'done',
    objective: 'Build the CLI dispatcher and command surface (status, validate, review, artifacts, doctor, dashboard, package).',
    deliverables: ['bin/aiep.js', 'src/cli/index.js'],
    rationale: 'Primary user surface; correctness matters, dual local review applied.' },
  { id: 'WO-0102', title: 'Config & Paths Core', phase: 'P1-Core', reviewLevel: 'L1', status: 'done',
    objective: 'Central config loader and canonical path resolution.',
    deliverables: ['src/core/config.js', 'src/core/paths.js', '.aiep/config.json'],
    rationale: 'Foundational but simple; self review sufficient.' },
  { id: 'WO-0103', title: 'Frontmatter & Work Order Loader', phase: 'P1-Core', reviewLevel: 'L2', status: 'done',
    objective: 'Dependency-free frontmatter parser and Work Order discovery/validation.',
    deliverables: ['src/core/frontmatter.js', 'src/core/workorders.js'],
    rationale: 'Parsing logic with edge cases; dual local review guards correctness.' },
  { id: 'WO-0104', title: 'Git Delta Processing', phase: 'P1-Core', reviewLevel: 'L2', status: 'done',
    objective: 'Git helpers to focus reviews on the change delta (diff/changed files).',
    deliverables: ['src/core/gitdelta.js'],
    rationale: 'Shells out to git across platforms; dual local review checks robustness.' },
  { id: 'WO-0105', title: 'Review Matrix & Routing', phase: 'P1-Core', reviewLevel: 'L3', status: 'done',
    objective: 'Map ReviewLevel to reviewer pipeline and enforce the Codex L4 guard.',
    deliverables: ['src/core/reviewMatrix.js', 'src/reviewers/index.js'],
    rationale: 'Architecture-significant: it governs how all reviews route and how the Codex guard is enforced. Warrants design review (L3).' },
  { id: 'WO-0106', title: 'Artifact Management', phase: 'P1-Core', reviewLevel: 'L2', status: 'done',
    objective: 'Write and consolidate review artifacts (per-reviewer, summary, decision.json).',
    deliverables: ['src/reviewers/index.js', 'src/reviewers/findings.js'],
    rationale: 'Artifact integrity underpins governance; dual local review applied.' },
  { id: 'WO-0107', title: 'AI Engineering Library Foundation', phase: 'P1-Core', reviewLevel: 'L1', status: 'done',
    objective: 'Establish prompt, skill, MCP and knowledge libraries with seed reusable assets.',
    deliverables: ['library/prompts', 'library/skills', 'library/mcp', 'library/knowledge'],
    rationale: 'Reusable assets, low technical risk.' },

  // ---- Phase 2 — Operations
  { id: 'WO-0201', title: 'Ollama Local Reviewer Integration', phase: 'P2-Ops', reviewLevel: 'L3', status: 'done',
    objective: 'Integrate DeepSeek (code) and Qwen (technical) reviewers via the Ollama HTTP API with graceful degradation.',
    deliverables: ['src/reviewers/ollama.js'],
    rationale: 'Core AI integration affecting all L2+ reviews; design review ensures integration and degradation strategy are sound (L3).' },
  { id: 'WO-0202', title: 'Gemini Reviewer Integration', phase: 'P2-Ops', reviewLevel: 'L2', status: 'done',
    objective: 'Integrate Gemini design reviewer (L3+) via CLI with graceful degradation.',
    deliverables: ['src/reviewers/gemini.js', 'src/reviewers/cli-reviewer.js'],
    rationale: 'CLI integration with fallback; dual local review sufficient.' },
  { id: 'WO-0203', title: 'Codex L4 Guard', phase: 'P2-Ops', reviewLevel: 'L2', status: 'done',
    objective: 'Implement Codex auditor restricted to L4 with defence-in-depth guard.',
    deliverables: ['src/reviewers/codex.js'],
    rationale: 'Guard correctness is important but well-contained; dual local review verifies the restriction holds.' },
  { id: 'WO-0204', title: 'Review Workflow', phase: 'P2-Ops', reviewLevel: 'L3', status: 'done',
    objective: 'Wire the end-to-end `aiep review` workflow across the reviewer pipeline.',
    deliverables: ['src/cli/review.js'],
    rationale: 'Orchestrates the whole review contract; design review confirms alignment with the policy (L3).' },
  { id: 'WO-0205', title: 'Dashboard', phase: 'P2-Ops', reviewLevel: 'L2', status: 'done',
    objective: 'Build the light, modern dashboard reading real AIEP data across the ten required panels.',
    deliverables: ['dashboard/index.html', 'dashboard/app.js', 'dashboard/styles.css', 'src/dashboard/build.js', 'src/cli/dashboard.js'],
    rationale: 'User-facing surface reading live data; dual local review checks data wiring correctness.' },
  { id: 'WO-0206', title: 'Doctor & Status Commands', phase: 'P2-Ops', reviewLevel: 'L1', status: 'done',
    objective: 'Environment diagnostics and platform status reporting.',
    deliverables: ['src/cli/doctor.js', 'src/cli/status.js'],
    rationale: 'Read-only diagnostics, low risk.' },

  // ---- Phase 3 — Production Readiness
  { id: 'WO-0301', title: 'Installer & Packaging', phase: 'P3-Release', reviewLevel: 'L2', status: 'done',
    objective: 'Provide install scripts and `aiep package` release tarball preparation.',
    deliverables: ['src/cli/package.js', 'scripts/install.*'],
    rationale: 'Packaging affects distribution; dual local review verifies gate enforcement.' },
  { id: 'WO-0302', title: 'Release Validation & Quality Gates', phase: 'P3-Release', reviewLevel: 'L2', status: 'done',
    objective: 'Finalize quality gates and the release readiness checklist.',
    deliverables: ['docs/release/RELEASE-CHECKLIST.md', 'docs/release/QUALITY-GATES.md'],
    rationale: 'Release gating; dual local review applied.' },
  { id: 'WO-0303', title: 'Documentation Completion & Release Candidate', phase: 'P3-Release', reviewLevel: 'L2', status: 'done',
    objective: 'Complete documentation, CHANGELOG and assemble the Final Release Review Package.',
    deliverables: ['CHANGELOG.md', 'docs/release/RELEASE-NOTES-v1.0.md', 'docs/release/FINAL-RELEASE-REVIEW-PACKAGE.md'],
    rationale: 'Documentation completeness and release assembly; dual local review applied.' },
];

function render(wo) {
  const list = (arr) => arr.map((x) => `  - ${x}`).join('\n');
  return `---
id: ${wo.id}
title: "${wo.title}"
phase: ${wo.phase}
reviewLevel: ${wo.reviewLevel}
status: ${wo.status}
owner: claude-execution-lead
---

# ${wo.id} — ${wo.title}

## Objective

${wo.objective}

## Scope

In scope for AIEP v1.0 (${wo.phase}). Out-of-scope v2.0 features (multi-repo platform,
AI Council, Labs, multi-org, enterprise licensing) are excluded per Scope Lock v1.0.

## Deliverables

${list(wo.deliverables)}

## Definition of Done

- [ ] Deliverables implemented and present in the repository.
- [ ] Claude self review completed.
- [ ] Reviewers for ReviewLevel ${wo.reviewLevel} executed (or documented disposition recorded).
- [ ] No unresolved CRITICAL findings; HIGH findings resolved or dispositioned.
- [ ] \`aiep validate\` quality gates pass.
- [ ] Changes committed to git as a logical delivery unit.

## ReviewLevel — ${wo.reviewLevel}

${wo.rationale}

## Traceability

- Governance: docs/governance/REVIEW-LEVEL-POLICY.md
- Scope: docs/governance/SCOPE-LOCK-v1.0.md
- Artifacts: .aiep/artifacts/${wo.id}/
`;
}

let created = 0;
let skipped = 0;
for (const wo of WORK_ORDERS) {
  const dir = join(ROOT, 'pmo', 'work-orders', wo.id);
  const file = join(dir, 'work-order.md');
  if (existsSync(file) && !force) {
    skipped += 1;
    continue;
  }
  mkdirSync(dir, { recursive: true });
  writeFileSync(file, render(wo), 'utf8');
  created += 1;
}
console.log(`Scaffolded work orders: ${created} created, ${skipped} skipped (${WORK_ORDERS.length} total).`);
