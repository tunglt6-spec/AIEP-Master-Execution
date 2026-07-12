import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseFrontmatter, coerceScalar, parseFrontmatterBody } from '../src/core/frontmatter.js';

test('coerceScalar handles types', () => {
  assert.equal(coerceScalar('42'), 42);
  assert.equal(coerceScalar('-3.5'), -3.5);
  assert.equal(coerceScalar('true'), true);
  assert.equal(coerceScalar('false'), false);
  assert.equal(coerceScalar('null'), null);
  assert.equal(coerceScalar('"quoted"'), 'quoted');
  assert.equal(coerceScalar("'q2'"), 'q2');
  assert.equal(coerceScalar('L2'), 'L2');
});

test('parses a full WO frontmatter block', () => {
  const doc = `---\nid: WO-0105\ntitle: "Review Matrix & Routing"\nreviewLevel: L3\nstatus: done\nphase: P1-Core\n---\n# Body\ncontent`;
  const { data, body, hasFrontmatter } = parseFrontmatter(doc);
  assert.equal(hasFrontmatter, true);
  assert.equal(data.id, 'WO-0105');
  assert.equal(data.title, 'Review Matrix & Routing');
  assert.equal(data.reviewLevel, 'L3');
  assert.equal(data.status, 'done');
  assert.match(body, /# Body/);
});

test('parses inline and block lists', () => {
  const inline = parseFrontmatterBody('tags: [a, b, "c d"]');
  assert.deepEqual(inline.tags, ['a', 'b', 'c d']);
  const block = parseFrontmatterBody('items:\n  - one\n  - two\n');
  assert.deepEqual(block.items, ['one', 'two']);
});

test('document without frontmatter returns body unchanged', () => {
  const { hasFrontmatter, body } = parseFrontmatter('no fence here');
  assert.equal(hasFrontmatter, false);
  assert.equal(body, 'no fence here');
});

test('tolerates CRLF line endings', () => {
  const doc = '---\r\nid: WO-1\r\nreviewLevel: L1\r\n---\r\nbody';
  const { data } = parseFrontmatter(doc);
  assert.equal(data.id, 'WO-1');
  assert.equal(data.reviewLevel, 'L1');
});
