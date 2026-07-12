import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, mkdtempSync, rmSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { initProject } from '../src/cli/init.js';

const BIN = resolve(dirname(fileURLToPath(import.meta.url)), '..', 'bin', 'aiep.js');

function withTempDir(fn) {
  const dir = mkdtempSync(join(tmpdir(), 'aiep-init-'));
  try {
    return fn(dir);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

test('init scaffolds a valid workspace', () => {
  withTempDir((dir) => {
    const res = initProject(dir);
    assert.ok(res.created.includes('.aiep/config.json'));
    for (const f of [
      '.aiep/config.json', 'PROJECT.md', 'README.md', 'CHANGELOG.md',
      'docs/constitution/CONSTITUTION.md', 'docs/governance/GOVERNANCE.md',
      'docs/governance/REVIEW-LEVEL-POLICY.md', 'docs/governance/SCOPE-LOCK-v1.0.md',
      'docs/governance/ARCHITECTURE-FREEZE-v1.0.md', 'pmo/backlog/PRODUCT-BACKLOG.md',
      'pmo/decisions/DECISION-LOG.md', 'pmo/risks/RISK-REGISTER.md',
      'pmo/work-orders/WO-0001/work-order.md',
    ]) {
      assert.ok(existsSync(join(dir, f)), `expected ${f} to exist`);
    }
  });
});

test('init is idempotent (no overwrite without --force)', () => {
  withTempDir((dir) => {
    const first = initProject(dir);
    assert.ok(first.created.length > 0);
    const second = initProject(dir);
    assert.equal(second.created.length, 0, 'second run should create nothing');
    assert.ok(second.skipped.length > 0, 'second run should skip existing files');
  });
});

test('aiep validate passes in an init-ed workspace', () => {
  withTempDir((dir) => {
    initProject(dir);
    // Run the real CLI validate inside the scaffolded workspace.
    const out = execFileSync('node', [BIN, 'validate', '--json'], { cwd: dir, encoding: 'utf8' });
    const result = JSON.parse(out);
    assert.equal(result.ok, true, `validate should pass; failed checks: ${JSON.stringify(result.checks.filter((c) => c.status === 'fail'))}`);
  });
});
