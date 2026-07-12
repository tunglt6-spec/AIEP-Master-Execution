// src/core/secrets.js
// Lightweight secret scanner used by the doctor/validate quality gates.
// It scans tracked text files for high-signal credential patterns.

import { readFileSync } from 'node:fs';

// Files/paths that are allowed to contain the literal *patterns* (the scanner's
// own definitions, docs describing the patterns) — excluded to avoid self-flagging.
const ALLOWLIST = [/\.aiep[\\/]config\.json$/, /src[\\/]core[\\/]secrets\.js$/, /secret/i];

const BINARY_EXT = /\.(png|jpg|jpeg|gif|webp|ico|pdf|zip|gz|tgz|exe|dll|woff2?|ttf|mp4|mp3)$/i;

/**
 * Compile a config pattern into a RegExp. Supports a leading inline `(?i)`
 * case-insensitive flag (which JavaScript RegExp does not accept natively) by
 * translating it to the `i` flag.
 * @param {string} p
 */
export function compilePattern(p) {
  const m = p.match(/^\(\?([a-z]+)\)(.*)$/s);
  if (m) return new RegExp(m[2], m[1]);
  return new RegExp(p);
}

/**
 * Scan a list of files for secrets.
 * @param {string[]} patterns regex source strings from config
 * @param {string[]} files absolute file paths to scan
 * @returns {Array<{ file: string, line: number, pattern: string }>}
 */
export function scanFiles(patterns, files) {
  const compiled = patterns.map(compilePattern);
  const findings = [];
  for (const file of files) {
    if (BINARY_EXT.test(file)) continue;
    if (ALLOWLIST.some((rx) => rx.test(file))) continue;
    let content;
    try {
      content = readFileSync(file, 'utf8');
    } catch {
      continue;
    }
    const lines = content.split(/\r?\n/);
    lines.forEach((line, idx) => {
      for (const rx of compiled) {
        if (rx.test(line)) {
          findings.push({ file, line: idx + 1, pattern: rx.source.slice(0, 40) });
          break;
        }
      }
    });
  }
  return findings;
}
