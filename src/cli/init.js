// src/cli/init.js
// `aiep init [dir] [--force]` — scaffold a working AIEP workspace into a project.
//
// It reuses the installed platform's own assets (config, dashboard frontend,
// templates) and writes concise starter governance/PMO documents plus a sample
// Work Order, so that `aiep validate` passes out of the box. Idempotent: it
// never overwrites an existing file unless --force is given.

import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { basename, dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { c, log } from '../core/logger.js';

const PKG_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');

function starterDocs(projectName) {
  const stub = (title, note) =>
    `# ${title}\n\n> Starter document created by \`aiep init\` for **${projectName}**. Replace this with your project's real content.\n\n${note}\n`;
  return {
    'PROJECT.md': stub(`${projectName}`, 'Describe the project purpose, scope and how to run it.'),
    'README.md': `# ${projectName}\n\nGoverned with [AIEP](https://www.npmjs.com/package/@tunglt6/aiep). Run \`aiep status\` and \`aiep validate\`.\n`,
    'CHANGELOG.md': '# Changelog\n\n## [Unreleased]\n\n- Project initialized with `aiep init`.\n',
    'docs/constitution/CONSTITUTION.md': stub('Constitution', 'The enduring principles of this project.'),
    'docs/governance/GOVERNANCE.md': stub('Governance', 'How work is authorized, executed, reviewed and released.'),
    'docs/governance/REVIEW-LEVEL-POLICY.md': stub('Review Level Policy', 'L1–L4 pipelines and the Codex L4-only guard. See `.aiep/config.json`.'),
    'docs/governance/SCOPE-LOCK-v1.0.md': stub('Scope Lock v1.0', 'What is in and out of scope for this release.'),
    'docs/governance/ARCHITECTURE-FREEZE-v1.0.md': stub('Architecture Freeze v1.0', 'Frozen technical decisions for this release.'),
    'pmo/backlog/PRODUCT-BACKLOG.md': stub('Product Backlog', 'List your Work Orders here. Each WO has exactly one ReviewLevel (L1–L4).'),
    'pmo/decisions/DECISION-LOG.md': stub('Decision Log', '| # | Date | Decision | Rationale |\n|---|------|----------|-----------|'),
    'pmo/risks/RISK-REGISTER.md': stub('Risk Register', '| ID | Risk | Likelihood | Impact | Mitigation | Status |\n|----|------|-----------|--------|------------|--------|'),
  };
}

function sampleWorkOrder() {
  return `---
id: WO-0001
title: "Sample Work Order"
phase: P0
reviewLevel: L1
status: planned
owner: your-name
---

# WO-0001 — Sample Work Order

## Objective

Describe the first piece of work. Delete this sample and create your own.

## Deliverables

  - (list deliverables)

## Definition of Done

- [ ] Deliverables implemented.
- [ ] Reviewers for ReviewLevel L1 executed.
- [ ] \`aiep validate\` passes.

## ReviewLevel — L1

Low-risk starter Work Order; Claude self review is sufficient.
`;
}

const GITIGNORE = `node_modules/
.aiep/cache/
dashboard/data/
dist/
*.log
.env
.env.*
*.key
*.pem
`;

/**
 * Scaffold an AIEP workspace.
 * @param {string} targetDir absolute or relative target directory
 * @param {{ force?: boolean }} [opts]
 * @returns {{ target: string, created: string[], skipped: string[] }}
 */
export function initProject(targetDir, opts = {}) {
  const target = resolve(targetDir || process.cwd());
  const force = Boolean(opts.force);
  const projectName = basename(target) || 'aiep-project';
  const created = [];
  const skipped = [];

  mkdirSync(target, { recursive: true });

  const writeFile = (rel, content) => {
    const dest = join(target, rel);
    if (existsSync(dest) && !force) {
      skipped.push(rel);
      return;
    }
    mkdirSync(dirname(dest), { recursive: true });
    writeFileSync(dest, content, 'utf8');
    created.push(rel);
  };

  const copyFrom = (rel, srcRel = rel) => {
    const src = join(PKG_ROOT, srcRel);
    const dest = join(target, rel);
    if (!existsSync(src)) return; // asset not present in this install — skip silently
    if (existsSync(dest) && !force) {
      skipped.push(rel);
      return;
    }
    mkdirSync(dirname(dest), { recursive: true });
    copyFileSync(src, dest);
    created.push(rel);
  };

  // 1. Platform config: reuse the installed default, retarget the project name.
  const cfgDest = join(target, '.aiep', 'config.json');
  if (existsSync(cfgDest) && !force) {
    skipped.push('.aiep/config.json');
  } else {
    let cfg;
    try {
      cfg = JSON.parse(readFileSync(join(PKG_ROOT, '.aiep', 'config.json'), 'utf8'));
    } catch {
      cfg = null;
    }
    if (cfg) {
      cfg.platform = {
        ...(cfg.platform || {}),
        name: projectName,
        displayName: projectName,
        version: '0.1.0',
      };
      mkdirSync(dirname(cfgDest), { recursive: true });
      writeFileSync(cfgDest, `${JSON.stringify(cfg, null, 2)}\n`, 'utf8');
      created.push('.aiep/config.json');
    }
  }

  // 2. Dashboard frontend (static) — copied from the platform package.
  copyFrom('dashboard/index.html');
  copyFrom('dashboard/app.js');
  copyFrom('dashboard/styles.css');

  // 3. Templates — copied from the platform package (best-effort per file).
  for (const t of [
    'work-order.template.md', 'adr.template.md', 'rfc.template.md',
    'sop.template.md', 'review-summary.template.md', 'claude-self-review.template.md',
    'INDEX.md',
  ]) {
    copyFrom(join('templates', t));
  }

  // 4. Starter docs + PMO + sample WO + .gitignore.
  for (const [rel, content] of Object.entries(starterDocs(projectName))) writeFile(rel, content);
  writeFile(join('pmo', 'work-orders', 'WO-0001', 'work-order.md'), sampleWorkOrder());
  writeFile('.gitignore', GITIGNORE);

  return { target, created, skipped };
}

export async function cmdInit(args) {
  const force = args.includes('--force');
  const json = args.includes('--json');
  const targetArg = args.find((a) => !a.startsWith('-'));
  const target = targetArg || '.';

  const result = initProject(target, { force });

  if (json) {
    log.info(JSON.stringify(result, null, 2));
    return;
  }

  log.header(`AIEP init — ${result.target}`);
  log.ok(`${result.created.length} file(s) created${result.skipped.length ? `, ${result.skipped.length} skipped (already exist)` : ''}.`);
  for (const f of result.created) log.info(`  ${c.green('+')} ${f}`);
  if (result.skipped.length) {
    log.info(c.dim(`  skipped: ${result.skipped.slice(0, 8).join(', ')}${result.skipped.length > 8 ? ' …' : ''}`));
  }
  log.header('Next steps');
  log.info(`  cd ${result.target === process.cwd() ? '.' : JSON.stringify(result.target)}`);
  log.info('  aiep doctor        # check environment & reviewer backends');
  log.info('  aiep status        # see the sample Work Order');
  log.info('  aiep validate      # run the quality gates (should pass)');
  log.info('  aiep review WO-0001 --last');
  log.info('  aiep dashboard     # open the live dashboard');
  if (result.created.length === 0) {
    log.warn('Nothing created — already initialized. Use --force to overwrite starter files.');
  }
}
