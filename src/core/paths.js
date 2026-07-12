// src/core/paths.js
// Resolves the AIEP repository root and canonical paths.
// The repo root is the nearest ancestor directory containing a `.aiep/config.json`.

import { existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * Find the AIEP repository root by walking up from a starting directory
 * until a `.aiep/config.json` is found.
 * @param {string} [start] - directory to start searching from (defaults to cwd)
 * @returns {string} absolute path to repo root
 */
export function findRepoRoot(start = process.cwd()) {
  let dir = resolve(start);
  // Walk up the tree looking for the AIEP marker file.
  // eslint-disable-next-line no-constant-condition
  while (true) {
    if (existsSync(join(dir, '.aiep', 'config.json'))) return dir;
    const parent = dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  // Fallback: assume the package root two levels above this file (src/core -> root).
  return resolve(__dirname, '..', '..');
}

/**
 * Build the canonical path map for a given repo root.
 * @param {string} root
 */
export function repoPaths(root) {
  return {
    root,
    aiep: join(root, '.aiep'),
    config: join(root, '.aiep', 'config.json'),
    artifacts: join(root, '.aiep', 'artifacts'),
    cache: join(root, '.aiep', 'cache'),
    workOrders: join(root, 'pmo', 'work-orders'),
    pmo: join(root, 'pmo'),
    docs: join(root, 'docs'),
    library: join(root, 'library'),
    dashboard: join(root, 'dashboard'),
    dashboardData: join(root, 'dashboard', 'data'),
    templates: join(root, 'templates'),
  };
}
