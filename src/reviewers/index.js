// src/reviewers/index.js
// Review router. Given a Work Order, resolves the reviewer pipeline from its
// ReviewLevel, runs each reviewer (enforcing the Codex guard), writes per-
// reviewer artifacts, and produces a consolidated review-summary.md and
// decision.json under .aiep/artifacts/<WO-ID>/.

import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { resolvePipeline, codexAllowed, ARTIFACT_FILES } from '../core/reviewMatrix.js';
import { changedFiles, diffText } from '../core/gitdelta.js';
import { countBySeverity } from './findings.js';
import { runClaudeSelfReview } from './claude.js';
import { runOllamaReviewer } from './ollama.js';
import { runGeminiReviewer } from './gemini.js';
import { runCodexReviewer } from './codex.js';

async function dispatch(reviewer, ctx) {
  switch (reviewer) {
    case 'claude':
      return runClaudeSelfReview(ctx);
    case 'deepseek':
    case 'qwen':
      return runOllamaReviewer(reviewer, ctx);
    case 'gemini':
      return runGeminiReviewer(ctx);
    case 'codex':
      return runCodexReviewer(ctx);
    default:
      throw new Error(`Unknown reviewer "${reviewer}"`);
  }
}

/**
 * Run the full review pipeline for a Work Order.
 * @param {object} args { config, paths, root, wo, base?, onProgress? }
 * @returns {Promise<object>} the decision object
 */
export async function runReview({ config, paths, root, wo, base, onProgress }) {
  const level = wo.meta.reviewLevel;
  const { reviewers, requiresCodex } = resolvePipeline(config, level);

  // Codex guard: it must never appear outside L4. If it somehow does, drop it.
  const effectiveReviewers = reviewers.filter((r) => r !== 'codex' || codexAllowed(config, level));
  const guardBlockedCodex = requiresCodex && !codexAllowed(config, level);

  const files = changedFiles(root, base);
  const diff = diffText(root, base);
  const ctx = { config, paths, root, wo, level, delta: { files, diff } };

  const artifactDir = join(paths.artifacts, wo.meta.id);
  mkdirSync(artifactDir, { recursive: true });

  const results = [];
  for (const reviewer of effectiveReviewers) {
    if (onProgress) onProgress(reviewer, 'start');
    let result;
    try {
      result = await dispatch(reviewer, ctx);
    } catch (err) {
      result = {
        reviewer,
        status: 'error',
        available: false,
        findings: [{ severity: 'HIGH', message: `Reviewer error: ${err.message}` }],
        artifact: `# ${reviewer} review — ERROR\n\n${err.message}\n`,
      };
    }
    const fileName = ARTIFACT_FILES[reviewer] || `${reviewer}-review.md`;
    writeFileSync(join(artifactDir, fileName), `${result.artifact}\n`, 'utf8');
    results.push(result);
    if (onProgress) onProgress(reviewer, result.status);
  }

  // Consolidate.
  const allFindings = results.flatMap((r) =>
    (r.findings || []).map((f) => ({ ...f, reviewer: r.reviewer }))
  );
  const severityCounts = countBySeverity(allFindings);
  const blocking = (config.blockingSeverities || ['CRITICAL', 'HIGH']);
  const unresolvedBlocking = allFindings.filter((f) => blocking.includes(f.severity));

  const decision = {
    workOrder: wo.meta.id,
    title: wo.meta.title,
    reviewLevel: level,
    reviewers: effectiveReviewers,
    codexGuard: {
      requiresCodex,
      codexAllowed: codexAllowed(config, level),
      guardBlockedCodex,
    },
    delta: { changedFiles: files.length, files },
    severityCounts,
    findings: allFindings,
    unresolvedBlockingCount: unresolvedBlocking.length,
    reviewerStatuses: results.map((r) => ({ reviewer: r.reviewer, status: r.status, model: r.model || null })),
    verdict: unresolvedBlocking.length === 0 ? 'PASS' : 'CHANGES_REQUESTED',
  };

  writeFileSync(join(artifactDir, 'decision.json'), `${JSON.stringify(decision, null, 2)}\n`, 'utf8');

  // review-summary.md for L2+ (and harmless for L1).
  if (level !== 'L1') {
    writeFileSync(join(artifactDir, 'review-summary.md'), renderSummary(decision, results), 'utf8');
  }

  return decision;
}

function renderSummary(decision, results) {
  const lines = [
    `# Review Summary — ${decision.workOrder}`,
    '',
    `- **Title:** ${decision.title}`,
    `- **ReviewLevel:** ${decision.reviewLevel}`,
    `- **Reviewers:** ${decision.reviewers.join(' → ')}`,
    `- **Changed files:** ${decision.delta.changedFiles}`,
    `- **Verdict:** ${decision.verdict}`,
    '',
    '## Reviewer status',
    '',
    ...results.map((r) => `- ${r.reviewer}: **${r.status}**${r.model ? ` (${r.model})` : ''}${r.note ? ` — ${r.note}` : ''}`),
    '',
    '## Findings by severity',
    '',
    ...Object.entries(decision.severityCounts).map(([sev, n]) => `- ${sev}: ${n}`),
    '',
    '## All findings',
    '',
    ...(decision.findings.length
      ? decision.findings.map((f) => `- **${f.severity}** [${f.reviewer}] — ${f.message}`)
      : ['- (none)']),
    '',
    '## Disposition',
    '',
    decision.unresolvedBlockingCount === 0
      ? 'No unresolved CRITICAL/HIGH findings. Work Order may proceed to Definition of Done.'
      : `There are ${decision.unresolvedBlockingCount} unresolved blocking finding(s). These must be fixed or given a documented disposition before completion.`,
    '',
    ...(decision.codexGuard.guardBlockedCodex
      ? ['> Note: Codex was requested but blocked by the token-preservation guard (not L4).']
      : []),
  ];
  return `${lines.join('\n')}\n`;
}
