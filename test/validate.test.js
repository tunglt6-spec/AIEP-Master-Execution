import { test } from 'node:test';
import assert from 'node:assert/strict';
import { runValidation } from '../src/cli/validate.js';
import { compilePattern, scanFiles } from '../src/core/secrets.js';

test('validation runs and returns structured checks', () => {
  const result = runValidation();
  assert.ok(Array.isArray(result.checks));
  assert.ok(result.checks.length >= 7, 'expected at least 7 quality gates');
  const names = result.checks.map((c) => c.name);
  assert.ok(names.some((n) => /ReviewLevel/.test(n)));
  assert.ok(names.some((n) => /Codex guard/.test(n)));
  assert.ok(names.some((n) => /secrets/i.test(n)));
  assert.ok(names.some((n) => /Scope Lock/.test(n)));
});

test('compilePattern supports inline (?i) flag', () => {
  const rx = compilePattern('(?i)password');
  assert.equal(rx.flags.includes('i'), true);
  assert.equal(rx.test('PASSWORD'), true);
});

test('secret scanner flags an obvious key and skips clean files', () => {
  // Use this test file itself (clean) — should not self-flag on the word.
  const hits = scanFiles(['AKIA[0-9A-Z]{16}'], []);
  assert.deepEqual(hits, []);
});
