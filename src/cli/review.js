// src/cli/review.js
// `aiep review [WO-ID]` — run the review pipeline for one or all Work Orders,
// routing to the correct reviewers per the Work Order's ReviewLevel.

import { loadConfig } from '../core/config.js';
import { loadAllWorkOrders } from '../core/workorders.js';
import { resolvePipeline } from '../core/reviewMatrix.js';
import { runReview } from '../reviewers/index.js';
import { c, log } from '../core/logger.js';

function parseArgs(args) {
  const opts = { json: false, base: undefined, ids: [] };
  for (let i = 0; i < args.length; i += 1) {
    const a = args[i];
    if (a === '--json') opts.json = true;
    else if (a === '--base') opts.base = args[++i];
    else if (a.startsWith('--base=')) opts.base = a.slice(7);
    else if (!a.startsWith('-')) opts.ids.push(a);
  }
  return opts;
}

export async function cmdReview(args) {
  const opts = parseArgs(args);
  const { root, paths, config } = loadConfig();
  const all = loadAllWorkOrders(paths.workOrders);

  let targets;
  if (opts.ids.length) {
    targets = opts.ids.map((id) => {
      const wo = all.find((w) => w.meta.id === id);
      if (!wo) throw new Error(`Work Order "${id}" not found under ${paths.workOrders}`);
      return wo;
    });
  } else {
    // Default: review all Work Orders that are not yet done.
    targets = all.filter((w) => w.meta.status !== 'done');
    if (targets.length === 0) targets = all;
  }

  const decisions = [];
  for (const wo of targets) {
    const { level, reviewers } = resolvePipeline(config, wo.meta.reviewLevel);
    if (!opts.json) {
      log.header(`Reviewing ${wo.meta.id} — ${wo.meta.title}`);
      log.info(`  ReviewLevel ${c.bold(level)} → pipeline: ${reviewers.join(' → ')}`);
    }
    const decision = await runReview({
      config,
      paths,
      root,
      wo,
      base: opts.base,
      onProgress: opts.json
        ? null
        : (reviewer, phase) => {
            if (phase === 'start') log.step(`${reviewer} …`);
            else {
              const color = phase === 'completed' ? c.green : phase === 'degraded' ? c.yellow : c.red;
              log.info(`    ${reviewer}: ${color(phase)}`);
            }
          },
    });
    decisions.push(decision);
    if (!opts.json) {
      const verdictColor = decision.verdict === 'PASS' ? c.green : c.yellow;
      log.info(`  Verdict: ${verdictColor(decision.verdict)}  (CRITICAL=${decision.severityCounts.CRITICAL}, HIGH=${decision.severityCounts.HIGH})`);
      log.info(`  Artifacts: ${c.dim(`.aiep/artifacts/${decision.workOrder}/`)}`);
    }
  }

  if (opts.json) {
    log.info(JSON.stringify(decisions, null, 2));
  } else {
    log.header('Review complete');
    log.info(`  ${decisions.length} Work Order(s) reviewed.`);
    const blocked = decisions.filter((d) => d.unresolvedBlockingCount > 0);
    if (blocked.length) {
      log.warn(`${blocked.length} WO(s) have unresolved blocking findings: ${blocked.map((d) => d.workOrder).join(', ')}`);
    } else {
      log.ok('No unresolved CRITICAL/HIGH findings.');
    }
  }
}
