import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, mkdtempSync, rmSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { parsePlanResponse, renderWorkOrder, nextWorkOrderId, planWorkOrder } from '../src/cli/plan.js';
import { initProject } from '../src/cli/init.js';
import { parseFrontmatter } from '../src/core/frontmatter.js';
import { loadWorkOrder, VALID_LEVELS, VALID_STATUSES } from '../src/core/workorders.js';

async function withTempDir(fn) {
  const dir = mkdtempSync(join(tmpdir(), 'aiep-plan-'));
  try {
    return await fn(dir); // await so the finally cleanup does not race async callbacks
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

test('parsePlanResponse extracts labelled fields', () => {
  const text = [
    'TITLE: Add CSV export',
    'LEVEL: L2',
    'RATIONALE: normal code change',
    'OBJECTIVE: Let users export the revenue report as CSV.',
    'DELIVERABLES:',
    '- export button',
    '- csv serializer',
    '',
  ].join('\n');
  const f = parsePlanResponse(text);
  assert.equal(f.title, 'Add CSV export');
  assert.equal(f.level, 'L2');
  assert.deepEqual(f.deliverables, ['export button', 'csv serializer']);
});

test('renderWorkOrder produces valid, parseable frontmatter', () => {
  const md = renderWorkOrder({ id: 'WO-0500', level: 'L2', idea: 'Do a thing', deliverables: ['x'] });
  const { data } = parseFrontmatter(md);
  assert.equal(data.id, 'WO-0500');
  assert.ok(VALID_LEVELS.includes(data.reviewLevel));
  assert.ok(VALID_STATUSES.includes(data.status));
  assert.equal(data.status, 'backlog');
});

test('nextWorkOrderId increments the max', () => {
  withTempDir((dir) => {
    initProject(dir); // creates WO-0001
    assert.equal(nextWorkOrderId(join(dir, 'pmo', 'work-orders')), 'WO-0002');
  });
});

test('planWorkOrder (offline, --no-ai) writes a valid draft WO', async () => {
  await withTempDir(async (dir) => {
    initProject(dir);
    const res = await planWorkOrder({ idea: 'Add rate limiting to the API', useAi: false, cwd: dir });
    assert.equal(res.id, 'WO-0002');
    assert.equal(res.usedAi, false);
    const woPath = join(dir, 'pmo', 'work-orders', 'WO-0002', 'work-order.md');
    assert.ok(existsSync(woPath));
    const wo = loadWorkOrder(join(dir, 'pmo', 'work-orders', 'WO-0002'));
    assert.equal(wo.errors.length, 0, `WO should be valid: ${wo.errors.join('; ')}`);
    assert.match(readFileSync(woPath, 'utf8'), /Add rate limiting to the API/);
  });
});

test('planWorkOrder refuses to overwrite without --force', async () => {
  await withTempDir(async (dir) => {
    initProject(dir);
    await planWorkOrder({ idea: 'first', id: 'WO-0500', useAi: false, cwd: dir });
    await assert.rejects(
      () => planWorkOrder({ idea: 'second', id: 'WO-0500', useAi: false, cwd: dir }),
      /already exists/
    );
  });
});
