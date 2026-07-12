// src/core/config.js
// Loads and provides typed access to `.aiep/config.json`.

import { readFileSync } from 'node:fs';
import { findRepoRoot, repoPaths } from './paths.js';

let _cache = null;

/**
 * Load the AIEP config and resolved paths. Cached per process.
 * @param {string} [start] starting directory for repo-root resolution
 * @returns {{ root: string, paths: object, config: object }}
 */
export function loadConfig(start) {
  if (_cache && !start) return _cache;
  const root = findRepoRoot(start);
  const paths = repoPaths(root);
  let config;
  try {
    config = JSON.parse(readFileSync(paths.config, 'utf8'));
  } catch (err) {
    throw new Error(`Cannot read AIEP config at ${paths.config}: ${err.message}`);
  }
  const result = { root, paths, config };
  if (!start) _cache = result;
  return result;
}

/**
 * Return the ordered reviewer list for a given ReviewLevel.
 * @param {object} config
 * @param {string} level - one of L1..L4
 * @returns {string[]}
 */
export function reviewersForLevel(config, level) {
  const map = config.reviewLevels || {};
  if (!map[level]) {
    throw new Error(`Unknown ReviewLevel "${level}". Valid levels: ${Object.keys(map).join(', ')}`);
  }
  return map[level].slice();
}

/** Reset the cached config (used by tests). */
export function _resetConfigCache() {
  _cache = null;
}
