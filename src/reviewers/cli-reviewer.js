// src/reviewers/cli-reviewer.js
// Shared implementation for CLI-backed reviewers (Gemini design review,
// Codex L4 audit). Probes for the CLI binary; if present, invokes it with a
// focused prompt over the change delta; otherwise records an integration
// decision and degrades gracefully.

import { execFileSync } from 'node:child_process';
import { extractFindings } from './findings.js';

/** Return true if a command is resolvable on PATH. */
export function commandAvailable(command) {
  const probe = process.platform === 'win32' ? ['where', command] : ['which', command];
  try {
    execFileSync(probe[0], [probe[1]], { stdio: ['ignore', 'pipe', 'ignore'] });
    return true;
  } catch {
    return false;
  }
}

function buildPrompt(reviewerName, spec, ctx) {
  const focus = (spec.focus || []).join(', ');
  return [
    `You are ${reviewerName}, the "${spec.role}" for the AIEP platform.`,
    `Review the change delta for Work Order ${ctx.wo.meta.id}: ${ctx.wo.meta.title}.`,
    `Focus: ${focus}.`,
    'Changed files:',
    ...ctx.delta.files.map((f) => `- ${f}`),
    '',
    'Unified diff follows:',
    ctx.delta.diff || '(no diff)',
    '',
    'Emit findings as lines "FINDING: <SEVERITY> - <desc>" (SEVERITY in CRITICAL/HIGH/MEDIUM/LOW/INFO),',
    'then a short summary.',
  ].join('\n');
}

/**
 * Run a CLI-backed reviewer.
 * @param {string} reviewerName
 * @param {object} ctx
 * @param {object} [opts] { argsBuilder?: (prompt)=>string[] }
 */
export async function runCliReviewer(reviewerName, ctx, opts = {}) {
  const spec = ctx.config.reviewers[reviewerName];
  const command = spec.command || reviewerName;

  if (!commandAvailable(command)) {
    return degraded(reviewerName, spec, ctx,
      `The "${command}" CLI is not installed or not on PATH in this environment.`);
  }

  const prompt = buildPrompt(reviewerName, spec, ctx);
  const args = opts.argsBuilder ? opts.argsBuilder(prompt) : ['-p', prompt];
  let out = '';
  try {
    out = execFileSync(command, args, {
      encoding: 'utf8',
      timeout: Number(process.env.AIEP_CLI_TIMEOUT_MS || 180000),
      stdio: ['ignore', 'pipe', 'pipe'],
    });
  } catch (err) {
    return degraded(reviewerName, spec, ctx, `"${command}" invocation failed: ${(err.message || '').split('\n')[0]}`);
  }

  const findings = extractFindings(out);
  const artifact = [
    `# ${reviewerName} review`,
    '',
    `- **Work Order:** ${ctx.wo.meta.id} — ${ctx.wo.meta.title}`,
    `- **Reviewer role:** ${spec.role}`,
    `- **Backend:** ${command} CLI`,
    `- **Status:** completed`,
    '',
    '## Findings',
    '',
    ...(findings.length ? findings.map((f) => `- **${f.severity}** — ${f.message}`) : ['_No structured findings parsed._']),
    '',
    '## Raw reviewer output',
    '',
    '```',
    out.trim() || '(empty)',
    '```',
  ].join('\n');

  return { reviewer: reviewerName, status: 'completed', available: true, findings, artifact };
}

export function degraded(reviewerName, spec, ctx, reason) {
  const artifact = [
    `# ${reviewerName} review — DEGRADED (integration decision)`,
    '',
    `- **Work Order:** ${ctx.wo.meta.id}`,
    `- **Reviewer role:** ${spec.role}`,
    `- **Backend:** ${spec.command || reviewerName} CLI`,
    `- **Status:** DEGRADED — tool unavailable`,
    '',
    '## Integration decision',
    '',
    reason,
    '',
    'Recorded as a documented disposition per AIEP Review Execution policy. Provision the tool and',
    're-run `aiep review <WO-ID>` to obtain a full review.',
  ].join('\n');
  return { reviewer: reviewerName, status: 'degraded', available: false, findings: [], artifact, note: reason };
}
