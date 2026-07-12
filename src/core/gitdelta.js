// src/core/gitdelta.js
// Git delta helpers. Reviews focus on the changed surface (git diff) rather than
// the whole codebase, to reduce reviewer context and token usage.

import { execFileSync } from 'node:child_process';

function git(args, cwd) {
  try {
    return execFileSync('git', args, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
  } catch (err) {
    const out = (err.stderr || err.stdout || err.message || '').toString();
    const e = new Error(`git ${args.join(' ')} failed: ${out.trim()}`);
    e.gitFailed = true;
    throw e;
  }
}

/** @returns {boolean} whether cwd is inside a git work tree */
export function isGitRepo(cwd) {
  try {
    return git(['rev-parse', '--is-inside-work-tree'], cwd).trim() === 'true';
  } catch {
    return false;
  }
}

/** @returns {string} current branch name (or 'DETACHED') */
export function currentBranch(cwd) {
  try {
    const b = git(['rev-parse', '--abbrev-ref', 'HEAD'], cwd).trim();
    return b === 'HEAD' ? 'DETACHED' : b;
  } catch {
    return 'UNKNOWN';
  }
}

/** @returns {string} short HEAD commit hash, or '' if no commits yet */
export function headCommit(cwd) {
  try {
    return git(['rev-parse', '--short', 'HEAD'], cwd).trim();
  } catch {
    return '';
  }
}

/**
 * Return the list of changed file paths for review, relative to a base ref.
 * Falls back gracefully: if base is unavailable, uses working-tree changes.
 * @param {string} cwd
 * @param {string} [base] git ref to diff against (default: staged + unstaged + untracked)
 * @returns {string[]}
 */
export function changedFiles(cwd, base) {
  if (!isGitRepo(cwd)) return [];
  const files = new Set();
  try {
    if (base) {
      for (const f of git(['diff', '--name-only', base, '--'], cwd).split(/\r?\n/)) {
        if (f.trim()) files.add(f.trim());
      }
    } else {
      // Tracked changes (staged + unstaged) plus untracked files.
      for (const f of git(['diff', '--name-only', 'HEAD', '--'], cwd).split(/\r?\n/)) {
        if (f.trim()) files.add(f.trim());
      }
      for (const f of git(['ls-files', '--others', '--exclude-standard'], cwd).split(/\r?\n/)) {
        if (f.trim()) files.add(f.trim());
      }
    }
  } catch {
    // No HEAD yet (fresh repo) — list all tracked + untracked as the delta.
    try {
      for (const f of git(['ls-files'], cwd).split(/\r?\n/)) if (f.trim()) files.add(f.trim());
      for (const f of git(['ls-files', '--others', '--exclude-standard'], cwd).split(/\r?\n/)) {
        if (f.trim()) files.add(f.trim());
      }
    } catch {
      /* ignore */
    }
  }
  return [...files];
}

/**
 * Return a unified diff string for the given base (or working tree).
 * @param {string} cwd
 * @param {string} [base]
 * @param {number} [maxBytes] truncate to keep reviewer context bounded
 */
export function diffText(cwd, base, maxBytes = 60000) {
  if (!isGitRepo(cwd)) return '';
  let out = '';
  try {
    out = base ? git(['diff', base, '--'], cwd) : git(['diff', 'HEAD', '--'], cwd);
  } catch {
    out = '';
  }
  if (out.length > maxBytes) {
    out = `${out.slice(0, maxBytes)}\n\n[... diff truncated at ${maxBytes} bytes for review focus ...]`;
  }
  return out;
}
