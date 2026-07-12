// src/reviewers/codex.js
// Codex External Independent Auditor — RESTRICTED to ReviewLevel L4.
// This module refuses to run at any level below L4 (defence in depth: the
// router also enforces the guard). Codex is never a default reviewer.

import { assertReviewerAllowed } from '../core/reviewMatrix.js';
import { runCliReviewer, degraded } from './cli-reviewer.js';

export async function runCodexReviewer(ctx) {
  // Hard guard — throws unless the level permits Codex (L4 only).
  assertReviewerAllowed(ctx.config, 'codex', ctx.level);

  const spec = ctx.config.reviewers.codex;
  const result = await runCliReviewer('codex', ctx, {
    argsBuilder: (prompt) => ['exec', prompt],
  });
  // Codex artifacts are named codex-audit.md by the router; annotate the role.
  if (result.status === 'degraded') {
    return degraded('codex', spec, ctx,
      result.note + ' Codex is only ever consulted at L4; this L4 audit is recorded as a documented disposition.');
  }
  return result;
}
