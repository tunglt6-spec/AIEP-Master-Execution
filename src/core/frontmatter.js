// src/core/frontmatter.js
// A small, dependency-free parser for the controlled YAML frontmatter subset
// used by AIEP Work Orders and documents. It intentionally supports only the
// constructs AIEP templates emit — it is NOT a general YAML parser.
//
// Supported:
//   key: scalar            (string / int / float / bool / null)
//   key: "quoted string"   (single or double quotes)
//   key: [a, b, c]         (inline flow list of scalars)
//   key:                   (followed by block list)
//     - item
//     - item
//
// Nested mappings are not supported (by design — WO frontmatter is flat).

/**
 * Coerce a raw scalar token to a JS value.
 * @param {string} raw
 */
export function coerceScalar(raw) {
  const s = raw.trim();
  if (s === '') return '';
  // Quoted strings — strip the matching quotes, no escape processing needed for our format.
  if ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'"))) {
    return s.slice(1, -1);
  }
  if (s === 'true') return true;
  if (s === 'false') return false;
  if (s === 'null' || s === '~') return null;
  if (/^-?\d+$/.test(s)) return Number.parseInt(s, 10);
  if (/^-?\d+\.\d+$/.test(s)) return Number.parseFloat(s);
  return s;
}

function parseInlineList(raw) {
  const inner = raw.trim().slice(1, -1).trim();
  if (inner === '') return [];
  // Split on commas not inside quotes.
  const parts = [];
  let buf = '';
  let quote = null;
  for (const ch of inner) {
    if (quote) {
      if (ch === quote) quote = null;
      buf += ch;
    } else if (ch === '"' || ch === "'") {
      quote = ch;
      buf += ch;
    } else if (ch === ',') {
      parts.push(buf);
      buf = '';
    } else {
      buf += ch;
    }
  }
  if (buf.trim() !== '') parts.push(buf);
  return parts.map((p) => coerceScalar(p));
}

/**
 * Parse a frontmatter body (the text between the `---` fences).
 * @param {string} body
 * @returns {Record<string, any>}
 */
export function parseFrontmatterBody(body) {
  const data = {};
  const lines = body.split(/\r?\n/);
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (line.trim() === '' || line.trim().startsWith('#')) {
      i += 1;
      continue;
    }
    const m = line.match(/^([A-Za-z0-9_\-]+):\s?(.*)$/);
    if (!m) {
      i += 1;
      continue;
    }
    const key = m[1];
    const rest = m[2];
    if (rest.trim() === '') {
      // Possible block list on subsequent indented lines.
      const list = [];
      let j = i + 1;
      while (j < lines.length && /^\s*-\s+/.test(lines[j])) {
        list.push(coerceScalar(lines[j].replace(/^\s*-\s+/, '')));
        j += 1;
      }
      if (list.length > 0) {
        data[key] = list;
        i = j;
        continue;
      }
      data[key] = '';
      i += 1;
      continue;
    }
    if (rest.trim().startsWith('[') && rest.trim().endsWith(']')) {
      data[key] = parseInlineList(rest);
      i += 1;
      continue;
    }
    data[key] = coerceScalar(rest);
    i += 1;
  }
  return data;
}

/**
 * Parse a full document with optional `---` frontmatter fence.
 * @param {string} content
 * @returns {{ data: Record<string, any>, body: string, hasFrontmatter: boolean }}
 */
export function parseFrontmatter(content) {
  const normalized = content.replace(/^﻿/, '');
  const match = normalized.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) {
    return { data: {}, body: normalized, hasFrontmatter: false };
  }
  return {
    data: parseFrontmatterBody(match[1]),
    body: match[2] || '',
    hasFrontmatter: true,
  };
}
