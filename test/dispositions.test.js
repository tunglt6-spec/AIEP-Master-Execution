import { test } from 'node:test';
import assert from 'node:assert/strict';
import { resolveFindings } from '../src/core/dispositions.js';

const findings = [
  { severity: 'CRITICAL', message: 'loadConfig is not imported', reviewer: 'deepseek' },
  { severity: 'HIGH', message: 'unhandled edge case in parser', reviewer: 'qwen' },
  { severity: 'LOW', message: 'naming nit', reviewer: 'qwen' },
];

test('dismissed disposition resolves a matching CRITICAL', () => {
  const d = [{ reviewer: 'deepseek', severity: 'CRITICAL', matches: 'loadConfig', status: 'dismissed', rationale: 'false positive' }];
  const r = resolveFindings(findings, d);
  assert.equal(r.unresolvedCritical, 0);
  assert.equal(r.unresolvedHigh, 1);
  assert.equal(r.unresolvedBlocking, 1);
  assert.ok(r.findings[0].disposition);
  assert.equal(r.findings[0].disposition.status, 'dismissed');
});

test('no dispositions leaves blocking findings unresolved', () => {
  const r = resolveFindings(findings, []);
  assert.equal(r.unresolvedCritical, 1);
  assert.equal(r.unresolvedHigh, 1);
  assert.equal(r.unresolvedBlocking, 2);
});

test('disposition must match message substring', () => {
  const d = [{ severity: 'CRITICAL', matches: 'nonexistent', status: 'dismissed', rationale: 'x' }];
  const r = resolveFindings(findings, d);
  assert.equal(r.unresolvedCritical, 1);
});
