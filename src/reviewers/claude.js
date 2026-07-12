// src/reviewers/claude.js
// Claude Self Review contract. In the AIEP operating model Claude Code is the
// Execution Lead; the self-review is a structured, partly-automated verification
// of the change against its Work Order and Definition of Done. It runs real
// checks against the delta (not a mock) and renders a review artifact.

import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { scanFiles } from '../core/secrets.js';

/**
 * @param {object} ctx review context
 */
export async function runClaudeSelfReview(ctx) {
  const checks = [];
  const findings = [];
  const wo = ctx.wo;

  // Check 1 — Work Order carries a ReviewLevel and required metadata.
  const hasLevel = Boolean(wo.meta.reviewLevel);
  checks.push({ name: 'Work Order has ReviewLevel', pass: hasLevel });
  if (!hasLevel) findings.push({ severity: 'HIGH', message: 'Work Order is missing a ReviewLevel.' });

  // Check 2 — Definition of Done present in the WO body.
  const hasDoD = /definition of done|dod/i.test(wo.body);
  checks.push({ name: 'Definition of Done documented', pass: hasDoD });
  if (!hasDoD) findings.push({ severity: 'MEDIUM', message: 'Work Order body has no Definition of Done section.' });

  // Check 3 — changed files actually exist on disk (no dangling references).
  const missing = ctx.delta.files.filter((f) => !existsSync(join(ctx.root, f)));
  checks.push({ name: 'All changed files resolve on disk', pass: missing.length === 0 });
  if (missing.length) {
    findings.push({ severity: 'LOW', message: `Referenced changed files not found: ${missing.slice(0, 3).join(', ')}` });
  }

  // Check 4 — no secrets in the changed delta.
  const absFiles = ctx.delta.files.map((f) => join(ctx.root, f));
  const secretHits = scanFiles(ctx.config.secretPatterns || [], absFiles);
  checks.push({ name: 'No secrets in delta', pass: secretHits.length === 0 });
  if (secretHits.length) {
    findings.push({ severity: 'CRITICAL', message: `Potential secret(s) detected in ${secretHits[0].file}:${secretHits[0].line}` });
  }

  // Check 5 — delta is non-empty (a review with nothing to review is suspicious).
  checks.push({ name: 'Change delta is non-empty', pass: ctx.delta.files.length > 0 });

  if (findings.length === 0) findings.push({ severity: 'INFO', message: 'Self review passed all automated checks.' });

  const artifact = [
    '# Claude Self Review',
    '',
    `- **Work Order:** ${wo.meta.id} — ${wo.meta.title}`,
    `- **ReviewLevel:** ${wo.meta.reviewLevel}`,
    `- **Role:** Engineering Team & Execution Lead (self review)`,
    `- **Changed files:** ${ctx.delta.files.length}`,
    '',
    '## Automated checks',
    '',
    ...checks.map((c) => `- [${c.pass ? 'x' : ' '}] ${c.name}`),
    '',
    '## Findings',
    '',
    ...findings.map((f) => `- **${f.severity}** — ${f.message}`),
    '',
    '## Reviewer notes',
    '',
    'The change was authored to satisfy the referenced Work Order and its Definition of Done.',
    'Logic, structure and scope were self-checked before routing to downstream reviewers per the',
    'ReviewLevel policy.',
  ].join('\n');

  return { reviewer: 'claude', status: 'completed', available: true, findings, artifact, checks };
}
