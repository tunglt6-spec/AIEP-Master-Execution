// src/core/reviewMatrix.js
// The Review Matrix maps a Work Order's ReviewLevel to the ordered set of
// reviewers that must run, and enforces the Codex token-preservation guard.
//
// Codex is NEVER a default reviewer. It may only be invoked at ReviewLevel L4.

import { reviewersForLevel } from './config.js';

export const ARTIFACT_FILES = {
  claude: 'claude-self-review.md',
  deepseek: 'deepseek-review.md',
  qwen: 'qwen-review.md',
  gemini: 'gemini-review.md',
  codex: 'codex-audit.md',
};

/**
 * Resolve the reviewer pipeline for a level, applying the Codex guard.
 * @param {object} config the AIEP config
 * @param {string} level L1..L4
 * @returns {{ level: string, reviewers: string[], requiresCodex: boolean }}
 */
export function resolvePipeline(config, level) {
  const reviewers = reviewersForLevel(config, level);
  const requiresCodex = reviewers.includes('codex');
  return { level, reviewers, requiresCodex };
}

/**
 * The Codex guard: return true only when Codex is permitted for this level.
 * This is the single authority the router and validator both consult.
 * @param {object} config
 * @param {string} level
 */
export function codexAllowed(config, level) {
  const guard = config.codexGuard || { allowedLevels: ['L4'] };
  if (guard.enabled === false) return false;
  return (guard.allowedLevels || ['L4']).includes(level);
}

/**
 * Assert that a planned invocation of a reviewer at a level is legal.
 * Throws if the Codex guard would be violated. Used defensively by the router.
 * @param {object} config
 * @param {string} reviewer
 * @param {string} level
 */
export function assertReviewerAllowed(config, reviewer, level) {
  if (reviewer === 'codex' && !codexAllowed(config, level)) {
    throw new Error(
      `Codex guard violation: Codex may only run at L4, refused at ${level}. ` +
        'Codex is an external auditor reserved for genuinely high-risk changes.'
    );
  }
  return true;
}

/**
 * Expected artifact filenames for a level (used by validation).
 * @param {object} config
 * @param {string} level
 * @returns {string[]}
 */
export function expectedArtifacts(config, level) {
  const reviewers = reviewersForLevel(config, level);
  const files = reviewers.map((r) => ARTIFACT_FILES[r]).filter(Boolean);
  // L2+ also carry a consolidated review summary.
  if (level !== 'L1') files.push('review-summary.md');
  return files;
}
