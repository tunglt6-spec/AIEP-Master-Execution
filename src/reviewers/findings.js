// src/reviewers/findings.js
// Parse structured findings from free-form reviewer output.
// Reviewers are asked to emit lines of the form:
//   FINDING: <SEVERITY> - <description>

const SEVERITIES = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'INFO'];

/**
 * Extract findings from reviewer text.
 * @param {string} text
 * @returns {Array<{ severity: string, message: string }>}
 */
export function extractFindings(text) {
  if (!text) return [];
  const findings = [];
  for (const line of text.split(/\r?\n/)) {
    const m = line.match(/FINDING:\s*(CRITICAL|HIGH|MEDIUM|LOW|INFO)\s*[-:]\s*(.+)$/i);
    if (m) {
      findings.push({ severity: m[1].toUpperCase(), message: m[2].trim() });
    }
  }
  return findings;
}

/** Count findings by severity. */
export function countBySeverity(findings) {
  const counts = Object.fromEntries(SEVERITIES.map((s) => [s, 0]));
  for (const f of findings) {
    if (counts[f.severity] !== undefined) counts[f.severity] += 1;
  }
  return counts;
}

/** True if there are unresolved blocking findings (CRITICAL/HIGH). */
export function hasBlocking(findings, blocking = ['CRITICAL', 'HIGH']) {
  return findings.some((f) => blocking.includes(f.severity));
}

export { SEVERITIES };
