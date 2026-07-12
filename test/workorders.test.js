import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadAllWorkOrders, summarizeWorkOrders, VALID_LEVELS } from '../src/core/workorders.js';
import { loadConfig } from '../src/core/config.js';

test('loads the repository work orders and every one has a valid ReviewLevel', () => {
  const { paths } = loadConfig();
  const wos = loadAllWorkOrders(paths.workOrders);
  assert.ok(wos.length >= 20, `expected >=20 work orders, got ${wos.length}`);
  for (const wo of wos) {
    assert.equal(wo.errors.length, 0, `${wo.id} has errors: ${wo.errors.join('; ')}`);
    assert.ok(VALID_LEVELS.includes(wo.meta.reviewLevel), `${wo.id} bad level ${wo.meta.reviewLevel}`);
  }
});

test('summary aggregates by level and status', () => {
  const { paths } = loadConfig();
  const wos = loadAllWorkOrders(paths.workOrders);
  const s = summarizeWorkOrders(wos);
  assert.equal(s.total, wos.length);
  const levelSum = s.byLevel.L1 + s.byLevel.L2 + s.byLevel.L3 + s.byLevel.L4;
  assert.equal(levelSum, wos.length);
});

test('no work order is inflated to L4 in v1.0', () => {
  const { paths } = loadConfig();
  const s = summarizeWorkOrders(loadAllWorkOrders(paths.workOrders));
  assert.equal(s.byLevel.L4, 0, 'v1.0 should have zero L4 work orders by design');
});
