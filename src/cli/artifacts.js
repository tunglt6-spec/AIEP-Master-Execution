// src/cli/artifacts.js
// `aiep artifacts <WO-ID>` — list and summarise review artifacts for a WO.

import { existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { loadConfig } from '../core/config.js';
import { loadResolvedDecision } from '../core/dispositions.js';
import { c, log } from '../core/logger.js';

export async function cmdArtifacts(args) {
  const json = args.includes('--json');
  const id = args.find((a) => !a.startsWith('-'));
  if (!id) throw new Error('Usage: aiep artifacts <WO-ID>');

  const { paths } = loadConfig();
  const dir = join(paths.artifacts, id);
  if (!existsSync(dir)) {
    if (json) {
      log.info(JSON.stringify({ workOrder: id, exists: false, artifacts: [] }, null, 2));
    } else {
      log.warn(`No artifacts for ${id}. Run: aiep review ${id}`);
    }
    return;
  }

  const files = readdirSync(dir).sort();
  const decision = loadResolvedDecision(dir);

  if (json) {
    log.info(JSON.stringify({ workOrder: id, exists: true, artifacts: files, decision }, null, 2));
    return;
  }

  log.header(`Artifacts for ${id}`);
  log.info(`  Location: ${c.dim(`.aiep/artifacts/${id}/`)}`);
  for (const f of files) log.info(`  • ${f}`);
  if (decision) {
    log.header('Decision');
    log.info(`  ReviewLevel: ${c.bold(decision.reviewLevel)}   Reviewers: ${decision.reviewers.join(' → ')}`);
    log.info(`  Verdict: ${decision.verdict === 'PASS' ? c.green(decision.verdict) : c.yellow(decision.verdict)}${decision.dispositions?.length ? c.dim(' (post-disposition)') : ''}`);
    log.info(`  Severity found: ${Object.entries(decision.severityCounts).map(([k, v]) => `${k}=${v}`).join('  ')}`);
    log.info(`  Unresolved blocking: CRITICAL=${decision.unresolvedCritical ?? '?'} HIGH=${decision.unresolvedHigh ?? '?'}`);
    if (decision.dispositions?.length) log.info(`  Dispositions: ${decision.dispositions.length} recorded`);
    if (decision.reviewerStatuses) {
      log.info(`  Reviewer status: ${decision.reviewerStatuses.map((r) => `${r.reviewer}=${r.status}`).join('  ')}`);
    }
  }
}
