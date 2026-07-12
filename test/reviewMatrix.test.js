import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  resolvePipeline,
  codexAllowed,
  assertReviewerAllowed,
  expectedArtifacts,
} from '../src/core/reviewMatrix.js';

// Minimal config mirroring .aiep/config.json for the parts under test.
const config = {
  reviewLevels: {
    L1: ['claude'],
    L2: ['claude', 'deepseek', 'qwen'],
    L3: ['claude', 'deepseek', 'qwen', 'gemini'],
    L4: ['claude', 'deepseek', 'qwen', 'gemini', 'codex'],
  },
  codexGuard: { enabled: true, allowedLevels: ['L4'] },
};

test('pipelines resolve per level', () => {
  assert.deepEqual(resolvePipeline(config, 'L1').reviewers, ['claude']);
  assert.deepEqual(resolvePipeline(config, 'L2').reviewers, ['claude', 'deepseek', 'qwen']);
  assert.deepEqual(resolvePipeline(config, 'L3').reviewers, ['claude', 'deepseek', 'qwen', 'gemini']);
  assert.equal(resolvePipeline(config, 'L4').requiresCodex, true);
});

test('CODEX GUARD: codex disallowed at L1/L2/L3, allowed only at L4', () => {
  assert.equal(codexAllowed(config, 'L1'), false);
  assert.equal(codexAllowed(config, 'L2'), false);
  assert.equal(codexAllowed(config, 'L3'), false);
  assert.equal(codexAllowed(config, 'L4'), true);
});

test('assertReviewerAllowed throws for codex below L4', () => {
  for (const lvl of ['L1', 'L2', 'L3']) {
    assert.throws(() => assertReviewerAllowed(config, 'codex', lvl), /Codex guard violation/);
  }
  assert.doesNotThrow(() => assertReviewerAllowed(config, 'codex', 'L4'));
  // Non-codex reviewers are always allowed.
  assert.doesNotThrow(() => assertReviewerAllowed(config, 'qwen', 'L2'));
});

test('guard disabled config still keeps codex off unless enabled', () => {
  const off = { ...config, codexGuard: { enabled: false, allowedLevels: ['L4'] } };
  assert.equal(codexAllowed(off, 'L4'), false);
});

test('expected artifacts per level', () => {
  assert.deepEqual(expectedArtifacts(config, 'L1'), ['claude-self-review.md']);
  assert.deepEqual(expectedArtifacts(config, 'L2'), [
    'claude-self-review.md', 'deepseek-review.md', 'qwen-review.md', 'review-summary.md',
  ]);
  assert.ok(expectedArtifacts(config, 'L4').includes('codex-audit.md'));
});

test('unknown level throws', () => {
  assert.throws(() => resolvePipeline(config, 'L9'), /Unknown ReviewLevel/);
});
