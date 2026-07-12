// src/dashboard/build.js
// Aggregates real AIEP state into dashboard/data/dashboard.json for the
// static dashboard to consume. No demo data is fabricated — every number is
// derived from the repository, artifacts, config and live backend probes.

import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { loadConfig } from '../core/config.js';
import { loadAllWorkOrders, summarizeWorkOrders } from '../core/workorders.js';
import { currentBranch, headCommit, isGitRepo } from '../core/gitdelta.js';
import { runValidation } from '../cli/validate.js';
import { runDoctor } from '../cli/doctor.js';
import { parseFrontmatter } from '../core/frontmatter.js';

function countFiles(dir, exts) {
  if (!existsSync(dir)) return 0;
  let n = 0;
  const walk = (d) => {
    for (const name of readdirSync(d)) {
      const p = join(d, name);
      const st = statSync(p);
      if (st.isDirectory()) walk(p);
      else if (!exts || exts.some((e) => name.endsWith(e))) n += 1;
    }
  };
  walk(dir);
  return n;
}

function loadSprints(pmoDir) {
  const dir = join(pmoDir, 'sprints');
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => f.endsWith('.md'))
    .map((f) => {
      const { data } = parseFrontmatter(readFileSync(join(dir, f), 'utf8'));
      return {
        id: data.id || f.replace('.md', ''),
        name: data.name || data.title || f,
        status: data.status || 'unknown',
        goal: data.goal || '',
      };
    });
}

export async function buildDashboardData() {
  const { root, paths, config } = loadConfig();
  const workOrders = loadAllWorkOrders(paths.workOrders);
  const summary = summarizeWorkOrders(workOrders);

  // Per-WO review state from decision.json.
  const reviewRows = [];
  const findings = [];
  let critical = 0;
  let high = 0;
  let medium = 0;
  let low = 0;
  let info = 0;
  for (const wo of workOrders) {
    const dPath = join(paths.artifacts, wo.meta.id || '', 'decision.json');
    let decision = null;
    if (existsSync(dPath)) {
      try {
        decision = JSON.parse(readFileSync(dPath, 'utf8'));
      } catch {
        /* ignore */
      }
    }
    reviewRows.push({
      id: wo.meta.id,
      title: wo.meta.title,
      phase: wo.meta.phase,
      reviewLevel: wo.meta.reviewLevel,
      status: wo.meta.status,
      verdict: decision ? decision.verdict : 'not-reviewed',
      reviewers: decision ? decision.reviewers : config.reviewLevels[wo.meta.reviewLevel] || [],
    });
    if (decision) {
      critical += decision.severityCounts?.CRITICAL || 0;
      high += decision.severityCounts?.HIGH || 0;
      medium += decision.severityCounts?.MEDIUM || 0;
      low += decision.severityCounts?.LOW || 0;
      info += decision.severityCounts?.INFO || 0;
      for (const f of decision.findings || []) findings.push({ wo: wo.meta.id, ...f });
    }
  }

  const validation = runValidation();
  const doctor = await runDoctor();

  const data = {
    generatedAt: new Date().toISOString(),
    platform: config.platform,
    git: { isRepo: isGitRepo(root), branch: currentBranch(root), commit: headCommit(root) },
    architecture: {
      freeze: config.platform.architectureFreeze,
      scopeLock: config.platform.scopeLock,
      deliverables: [
        { name: 'Core Repository', present: existsSync(join(root, 'src')) },
        { name: 'Documentation System', present: existsSync(paths.docs) },
        { name: 'AI Engineering Library', present: existsSync(paths.library) },
        { name: 'PMO', present: existsSync(paths.pmo) },
        { name: 'Dashboard', present: existsSync(paths.dashboard) },
      ],
    },
    sprints: loadSprints(paths.pmo),
    workOrders: { summary, rows: reviewRows },
    reviewLevelDistribution: summary.byLevel,
    reviewers: doctor.items
      .filter((i) => /Ollama|model|Gemini|Codex/.test(i.name))
      .map((i) => ({ name: i.name, ok: i.ok, detail: i.detail })),
    findings: {
      counts: { CRITICAL: critical, HIGH: high, MEDIUM: medium, LOW: low, INFO: info },
      items: findings,
    },
    knowledgeAssets: {
      prompts: countFiles(join(paths.library, 'prompts'), ['.md']),
      skills: countFiles(join(paths.library, 'skills'), ['.md']),
      mcp: countFiles(join(paths.library, 'mcp'), ['.md', '.json']),
      knowledge: countFiles(join(paths.library, 'knowledge'), ['.md']),
      adrs: countFiles(join(paths.docs, 'adr'), ['.md']),
      sops: countFiles(join(paths.docs, 'sop'), ['.md']),
      templates: countFiles(paths.templates, ['.md']),
    },
    releaseReadiness: {
      gatesPassed: validation.checks.filter((c) => c.status === 'pass').length,
      gatesFailed: validation.failed,
      gatesWarned: validation.warned,
      ok: validation.ok,
      checks: validation.checks,
    },
    systemHealth: doctor.items.map((i) => ({ name: i.name, ok: i.ok, detail: i.detail })),
  };

  mkdirSync(paths.dashboardData, { recursive: true });
  writeFileSync(join(paths.dashboardData, 'dashboard.json'), `${JSON.stringify(data, null, 2)}\n`, 'utf8');
  return { data, outPath: join(paths.dashboardData, 'dashboard.json') };
}
