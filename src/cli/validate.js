// src/cli/validate.js
// Repository & governance validation — the AIEP quality gates.
// Exit code is non-zero if any gate FAILs (warnings do not fail the build).

import { existsSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { loadConfig } from '../core/config.js';
import { loadAllWorkOrders } from '../core/workorders.js';
import { expectedArtifacts, codexAllowed, ARTIFACT_FILES } from '../core/reviewMatrix.js';
import { scanFiles } from '../core/secrets.js';
import { isGitRepo } from '../core/gitdelta.js';
import { loadResolvedDecision } from '../core/dispositions.js';
import { execFileSync } from 'node:child_process';
import { c, log } from '../core/logger.js';

function listTrackedFiles(root) {
  // Prefer git ls-files (respects .gitignore); fall back to a recursive walk.
  if (isGitRepo(root)) {
    try {
      const out = execFileSync('git', ['ls-files'], { cwd: root, encoding: 'utf8' });
      return out.split(/\r?\n/).filter(Boolean).map((f) => join(root, f));
    } catch {
      /* fall through */
    }
  }
  const files = [];
  const skip = new Set(['node_modules', '.git', 'dist']);
  const walk = (dir) => {
    for (const name of readdirSync(dir)) {
      if (skip.has(name)) continue;
      const p = join(dir, name);
      const st = statSync(p);
      if (st.isDirectory()) walk(p);
      else files.push(p);
    }
  };
  walk(root);
  return files;
}

export function runValidation() {
  const { root, paths, config } = loadConfig();
  const checks = [];
  const add = (name, status, detail = '') => checks.push({ name, status, detail });

  // ---- Gate 1: required governance & documentation artifacts exist.
  const required = [
    ['PROJECT.md', join(root, 'PROJECT.md')],
    ['README.md', join(root, 'README.md')],
    ['CHANGELOG.md', join(root, 'CHANGELOG.md')],
    ['Constitution', join(paths.docs, 'constitution', 'CONSTITUTION.md')],
    ['Governance', join(paths.docs, 'governance', 'GOVERNANCE.md')],
    ['Review Level Policy', join(paths.docs, 'governance', 'REVIEW-LEVEL-POLICY.md')],
    ['Scope Lock v1.0', join(paths.docs, 'governance', 'SCOPE-LOCK-v1.0.md')],
    ['Architecture Freeze v1.0', join(paths.docs, 'governance', 'ARCHITECTURE-FREEZE-v1.0.md')],
    ['Product Backlog', join(paths.pmo, 'backlog', 'PRODUCT-BACKLOG.md')],
    ['Decision Log', join(paths.pmo, 'decisions', 'DECISION-LOG.md')],
    ['Risk Register', join(paths.pmo, 'risks', 'RISK-REGISTER.md')],
  ];
  const missingDocs = required.filter(([, p]) => !existsSync(p)).map(([n]) => n);
  add('Required documents present', missingDocs.length ? 'fail' : 'pass',
    missingDocs.length ? `Missing: ${missingDocs.join(', ')}` : `${required.length} documents present`);

  // ---- Gate 2: Work Orders well-formed and every one carries a ReviewLevel.
  const workOrders = loadAllWorkOrders(paths.workOrders);
  const woErrors = workOrders.filter((w) => w.errors.length);
  add('Work Orders present', workOrders.length ? 'pass' : 'fail',
    workOrders.length ? `${workOrders.length} work orders` : 'No work orders found');
  add('All Work Orders valid & have ReviewLevel', woErrors.length ? 'fail' : 'pass',
    woErrors.length ? woErrors.map((w) => `${w.id || w.dir}: ${w.errors[0]}`).join('; ') : 'All valid');

  // ---- Gate 3: Codex guard — no L1/L2/L3 Work Order carries a codex artifact.
  const codexViolations = [];
  for (const wo of workOrders) {
    const dir = join(paths.artifacts, wo.meta.id || '');
    const codexArtifact = join(dir, ARTIFACT_FILES.codex);
    if (existsSync(codexArtifact) && !codexAllowed(config, wo.meta.reviewLevel)) {
      codexViolations.push(wo.meta.id);
    }
  }
  add('Codex guard (no Codex below L4)', codexViolations.length ? 'fail' : 'pass',
    codexViolations.length ? `Codex artifact found at non-L4 WOs: ${codexViolations.join(', ')}` : 'No violations');

  // ---- Gate 4: artifact completeness for reviewed Work Orders.
  const artifactGaps = [];
  for (const wo of workOrders) {
    const dir = join(paths.artifacts, wo.meta.id || '');
    if (!existsSync(dir)) continue; // not yet reviewed — not a failure here
    const expected = expectedArtifacts(config, wo.meta.reviewLevel);
    const missing = expected.filter((f) => !existsSync(join(dir, f)));
    if (missing.length) artifactGaps.push(`${wo.meta.id}: ${missing.join(', ')}`);
  }
  add('Reviewed WOs have required artifacts', artifactGaps.length ? 'fail' : 'pass',
    artifactGaps.length ? artifactGaps.join('; ') : 'Complete (for reviewed WOs)');

  // ---- Gate 5: no unresolved CRITICAL/HIGH findings across decisions.
  // Counts are post-disposition: findings with a documented disposition are
  // treated as resolved.
  let critical = 0;
  let high = 0;
  for (const wo of workOrders) {
    const dir = join(paths.artifacts, wo.meta.id || '');
    const d = loadResolvedDecision(dir);
    if (!d) continue;
    critical += d.unresolvedCritical ?? (d.severityCounts?.CRITICAL || 0);
    high += d.unresolvedHigh ?? (d.severityCounts?.HIGH || 0);
  }
  add('No unresolved CRITICAL findings', critical ? 'fail' : 'pass', critical ? `${critical} CRITICAL` : 'none');
  add('No unresolved HIGH findings', high ? 'warn' : 'pass',
    high ? `${high} HIGH — require documented disposition` : 'none');

  // ---- Gate 6: secret scan across tracked files.
  const secretHits = scanFiles(config.secretPatterns || [], listTrackedFiles(root));
  add('No secrets committed', secretHits.length ? 'fail' : 'pass',
    secretHits.length ? `${secretHits.length} potential secret(s), first at ${relative(root, secretHits[0].file)}:${secretHits[0].line}` : 'clean');

  // ---- Gate 7: Scope Lock — forbidden v2.0 surfaces absent.
  const forbidden = ['labs', 'multi-org', 'multi-organization', 'ai-council', 'enterprise-license-manager'];
  const scopeViolations = forbidden.filter((d) => existsSync(join(root, d)));
  add('Scope Lock v1.0 respected', scopeViolations.length ? 'fail' : 'pass',
    scopeViolations.length ? `Out-of-scope dirs present: ${scopeViolations.join(', ')}` : 'No out-of-scope surfaces');

  const failed = checks.filter((c2) => c2.status === 'fail');
  const warned = checks.filter((c2) => c2.status === 'warn');
  return { checks, failed: failed.length, warned: warned.length, ok: failed.length === 0 };
}

export async function cmdValidate(args) {
  const json = args.includes('--json');
  const result = runValidation();
  if (json) {
    log.info(JSON.stringify(result, null, 2));
    process.exitCode = result.ok ? 0 : 1;
    return;
  }
  log.header('AIEP Validation — Quality Gates');
  for (const ch of result.checks) {
    const mark = ch.status === 'pass' ? c.green('PASS') : ch.status === 'warn' ? c.yellow('WARN') : c.red('FAIL');
    log.info(`  [${mark}] ${ch.name}${ch.detail ? c.dim(` — ${ch.detail}`) : ''}`);
  }
  log.info('');
  if (result.ok) {
    log.ok(`All gates passed (${result.warned} warning(s)).`);
  } else {
    log.err(`${result.failed} gate(s) failed, ${result.warned} warning(s).`);
    process.exitCode = 1;
  }
}
