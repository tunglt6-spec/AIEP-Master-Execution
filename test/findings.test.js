import { test } from 'node:test';
import assert from 'node:assert/strict';
import { extractFindings, countBySeverity, hasBlocking } from '../src/reviewers/findings.js';

test('extracts FINDING lines with severities', () => {
  const text = [
    'Some preamble.',
    'FINDING: CRITICAL - null deref in parse()',
    'FINDING: LOW - naming nit',
    'finding: high - case-insensitive match',
    'not a finding line',
  ].join('\n');
  const f = extractFindings(text);
  assert.equal(f.length, 3);
  assert.equal(f[0].severity, 'CRITICAL');
  assert.equal(f[2].severity, 'HIGH');
});

test('countBySeverity and hasBlocking', () => {
  const f = [{ severity: 'HIGH', message: 'x' }, { severity: 'LOW', message: 'y' }];
  const counts = countBySeverity(f);
  assert.equal(counts.HIGH, 1);
  assert.equal(counts.LOW, 1);
  assert.equal(counts.CRITICAL, 0);
  assert.equal(hasBlocking(f), true);
  assert.equal(hasBlocking([{ severity: 'INFO', message: 'z' }]), false);
});

test('empty text yields no findings', () => {
  assert.deepEqual(extractFindings(''), []);
});
