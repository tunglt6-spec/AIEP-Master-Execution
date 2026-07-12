// src/cli/status.js
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { loadConfig } from '../core/config.js';
import { loadAllWorkOrders, summarizeWorkOrders } from '../core/workorders.js';
import { currentBranch, headCommit, isGitRepo } from '../core/gitdelta.js';
import { c, log, symbols } from '../core/logger.js';

/** Read a WO's decision.json if present. */
function readDecision(paths, id) {
  const f = join(paths.artifacts, id, 'decision.json');
  if (!existsSync(f)) return null;
  try {
    return JSON.parse(readFileSync(f, 'utf8'));
  } catch {
    return null;
  }
}

export function gatherStatus() {
  const { root, paths, config } = loadConfig();
  const workOrders = loadAllWorkOrders(paths.workOrders);
  const summary = summarizeWorkOrders(workOrders);

  const reviewed = [];
  let unresolvedBlocking = 0;
  for (const wo of workOrders) {
    const d = readDecision(paths, wo.meta.id);
    if (d) {
      reviewed.push({ id: wo.meta.id, verdict: d.verdict, blocking: d.unresolvedBlockingCount });
      unresolvedBlocking += d.unresolvedBlockingCount || 0;
    }
  }

  return {
    platform: config.platform,
    git: {
      isRepo: isGitRepo(root),
      branch: currentBranch(root),
      commit: headCommit(root),
    },
    workOrders: summary,
    review: {
      reviewedCount: reviewed.length,
      passCount: reviewed.filter((r) => r.verdict === 'PASS').length,
      changesRequested: reviewed.filter((r) => r.verdict === 'CHANGES_REQUESTED').length,
      unresolvedBlocking,
    },
    releaseReadiness: {
      allWorkOrdersHaveLevel: workOrders.every((w) => w.meta.reviewLevel),
      noUnresolvedBlocking: unresolvedBlocking === 0,
    },
  };
}

export async function cmdStatus(args) {
  const json = args.includes('--json');
  const s = gatherStatus();
  if (json) {
    log.info(JSON.stringify(s, null, 2));
    return;
  }

  log.header(`${s.platform.displayName} (${s.platform.name}) v${s.platform.version}`);
  log.info(`${c.dim('Scope Lock:')} ${s.platform.scopeLock}   ${c.dim('Architecture Freeze:')} ${s.platform.architectureFreeze}`);

  log.header('Git');
  log.info(`  Branch: ${c.cyan(s.git.branch)}   Commit: ${c.cyan(s.git.commit || '(none)')}`);

  log.header('Work Orders');
  log.info(`  Total: ${c.bold(String(s.workOrders.total))}`);
  log.info(`  By ReviewLevel: ${symbols.L1} ${s.workOrders.byLevel.L1}  ${symbols.L2} ${s.workOrders.byLevel.L2}  ${symbols.L3} ${s.workOrders.byLevel.L3}  ${symbols.L4} ${s.workOrders.byLevel.L4}`);
  log.info(`  By status: ${Object.entries(s.workOrders.byStatus).map(([k, v]) => `${k}=${v}`).join('  ')}`);

  log.header('Review');
  log.info(`  Reviewed: ${s.review.reviewedCount}   Pass: ${c.green(String(s.review.passCount))}   Changes requested: ${s.review.changesRequested ? c.yellow(String(s.review.changesRequested)) : '0'}`);
  log.info(`  Unresolved CRITICAL/HIGH: ${s.review.unresolvedBlocking ? c.red(String(s.review.unresolvedBlocking)) : c.green('0')}`);

  log.header('Release readiness');
  const ok = s.releaseReadiness.allWorkOrdersHaveLevel && s.releaseReadiness.noUnresolvedBlocking;
  log.info(`  All WOs have ReviewLevel: ${s.releaseReadiness.allWorkOrdersHaveLevel ? c.green('yes') : c.red('no')}`);
  log.info(`  No unresolved blocking findings: ${s.releaseReadiness.noUnresolvedBlocking ? c.green('yes') : c.red('no')}`);
  log.info(`  Overall: ${ok ? c.green('READY (run `aiep validate` for full gates)') : c.yellow('NOT READY')}`);
}
