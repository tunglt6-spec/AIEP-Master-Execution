// src/core/workorders.js
// Discovery, parsing and validation of Work Orders.
//
// A Work Order lives at pmo/work-orders/<WO-ID>/work-order.md and carries a
// frontmatter block that is the machine-readable source of truth.

import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { parseFrontmatter } from './frontmatter.js';

export const VALID_LEVELS = ['L1', 'L2', 'L3', 'L4'];
export const VALID_STATUSES = ['backlog', 'planned', 'in-progress', 'in-review', 'done', 'blocked'];
const REQUIRED_FIELDS = ['id', 'title', 'reviewLevel', 'status', 'phase'];

/**
 * Load a single Work Order directory.
 * @param {string} dir absolute path to the WO directory
 * @returns {{ id: string, dir: string, meta: object, body: string, errors: string[] }}
 */
export function loadWorkOrder(dir) {
  const file = join(dir, 'work-order.md');
  const errors = [];
  if (!existsSync(file)) {
    return { id: null, dir, meta: {}, body: '', errors: [`Missing work-order.md in ${dir}`] };
  }
  const { data, body } = parseFrontmatter(readFileSync(file, 'utf8'));
  for (const field of REQUIRED_FIELDS) {
    if (data[field] === undefined || data[field] === '') {
      errors.push(`Missing required frontmatter field "${field}"`);
    }
  }
  if (data.reviewLevel && !VALID_LEVELS.includes(data.reviewLevel)) {
    errors.push(`Invalid reviewLevel "${data.reviewLevel}" (must be one of ${VALID_LEVELS.join(', ')})`);
  }
  if (data.status && !VALID_STATUSES.includes(data.status)) {
    errors.push(`Invalid status "${data.status}" (must be one of ${VALID_STATUSES.join(', ')})`);
  }
  return { id: data.id || null, dir, meta: data, body, errors };
}

/**
 * Discover and load all Work Orders under the configured directory.
 * @param {string} workOrdersDir
 * @returns {Array} list of loaded work orders sorted by id
 */
export function loadAllWorkOrders(workOrdersDir) {
  if (!existsSync(workOrdersDir)) return [];
  const entries = readdirSync(workOrdersDir)
    .map((name) => join(workOrdersDir, name))
    .filter((p) => {
      try {
        return statSync(p).isDirectory();
      } catch {
        return false;
      }
    });
  const wos = entries.map(loadWorkOrder).filter((wo) => wo.id || wo.errors.length);
  wos.sort((a, b) => String(a.id).localeCompare(String(b.id)));
  return wos;
}

/**
 * Aggregate counts by review level and status for reporting/dashboard.
 * @param {Array} workOrders
 */
export function summarizeWorkOrders(workOrders) {
  const byLevel = { L1: 0, L2: 0, L3: 0, L4: 0 };
  const byStatus = {};
  const byPhase = {};
  for (const wo of workOrders) {
    const lvl = wo.meta.reviewLevel;
    if (byLevel[lvl] !== undefined) byLevel[lvl] += 1;
    const st = wo.meta.status || 'unknown';
    byStatus[st] = (byStatus[st] || 0) + 1;
    const ph = wo.meta.phase || 'unknown';
    byPhase[ph] = (byPhase[ph] || 0) + 1;
  }
  return { total: workOrders.length, byLevel, byStatus, byPhase };
}
