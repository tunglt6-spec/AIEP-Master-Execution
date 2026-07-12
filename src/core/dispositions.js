// src/core/dispositions.js
// Findings disposition mechanism. A reviewer finding (especially a CRITICAL/HIGH)
// may be a false positive or may be fixed after review. The Execution Lead records
// a documented disposition in `.aiep/artifacts/<WO-ID>/dispositions.json`, which is
// applied when computing unresolved blocking counts. This implements the policy
// requirement that blocking findings be "resolved or given a documented disposition".
//
// dispositions.json shape:
// {
//   "dispositions": [
//     {
//       "reviewer": "deepseek",         // optional match constraint
//       "severity": "CRITICAL",          // optional match constraint
//       "matches": "loadConfig",         // required substring of the finding message
//       "status": "dismissed",           // "dismissed" (false positive) | "fixed"
//       "rationale": "…",                // required justification
//       "by": "claude-execution-lead",
//       "date": "2026-07-12"
//     }
//   ]
// }

import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

export function loadDispositions(artifactDir) {
  const f = join(artifactDir, 'dispositions.json');
  if (!existsSync(f)) return [];
  try {
    const data = JSON.parse(readFileSync(f, 'utf8'));
    return Array.isArray(data.dispositions) ? data.dispositions : [];
  } catch {
    return [];
  }
}

/** Does a disposition match a finding? */
function matches(d, finding) {
  if (d.reviewer && d.reviewer !== finding.reviewer) return false;
  if (d.severity && d.severity !== finding.severity) return false;
  if (!d.matches) return false;
  return String(finding.message || '').includes(d.matches);
}

/**
 * Annotate findings with any matching disposition and compute unresolved counts.
 * A blocking finding (CRITICAL/HIGH) is "unresolved" only if no disposition matches.
 * @param {Array} findings findings with { severity, message, reviewer }
 * @param {Array} dispositions
 * @param {string[]} blocking severities considered blocking
 */
export function resolveFindings(findings, dispositions, blocking = ['CRITICAL', 'HIGH']) {
  const annotated = findings.map((f) => {
    const d = dispositions.find((x) => matches(x, f));
    return d ? { ...f, disposition: { status: d.status, rationale: d.rationale, by: d.by, date: d.date } } : { ...f };
  });
  const unresolved = annotated.filter((f) => blocking.includes(f.severity) && !f.disposition);
  return {
    findings: annotated,
    unresolvedCritical: unresolved.filter((f) => f.severity === 'CRITICAL').length,
    unresolvedHigh: unresolved.filter((f) => f.severity === 'HIGH').length,
    unresolvedBlocking: unresolved.length,
    dispositions,
  };
}

/**
 * Load a Work Order's decision.json and apply dispositions, returning the decision
 * augmented with post-disposition unresolved counts. Returns null if no decision.
 * @param {string} artifactDir
 */
export function loadResolvedDecision(artifactDir) {
  const f = join(artifactDir, 'decision.json');
  if (!existsSync(f)) return null;
  let decision;
  try {
    decision = JSON.parse(readFileSync(f, 'utf8'));
  } catch {
    return null;
  }
  const dispositions = loadDispositions(artifactDir);
  const resolved = resolveFindings(decision.findings || [], dispositions);
  return {
    ...decision,
    findings: resolved.findings,
    dispositions,
    unresolvedCritical: resolved.unresolvedCritical,
    unresolvedHigh: resolved.unresolvedHigh,
    unresolvedBlockingCount: resolved.unresolvedBlocking,
    verdict: resolved.unresolvedBlocking === 0 ? 'PASS' : 'CHANGES_REQUESTED',
  };
}
