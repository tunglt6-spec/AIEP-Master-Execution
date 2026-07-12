// src/cli/package.js
// `aiep package [--dry-run] [--force]`
// Verifies the quality gates, then prepares a distributable npm tarball.
// Refuses to package if any gate fails, unless --force is given.

import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { loadConfig } from '../core/config.js';
import { runValidation } from './validate.js';
import { c, log } from '../core/logger.js';

export async function cmdPackage(args) {
  const dryRun = args.includes('--dry-run');
  const force = args.includes('--force');
  const { root, config } = loadConfig();

  log.header('AIEP Package — release preparation');
  log.step('Running quality gates …');
  const validation = runValidation();
  for (const ch of validation.checks) {
    const mark = ch.status === 'pass' ? c.green('PASS') : ch.status === 'warn' ? c.yellow('WARN') : c.red('FAIL');
    log.info(`  [${mark}] ${ch.name}`);
  }

  if (!validation.ok && !force) {
    log.err(`${validation.failed} gate(s) failed. Fix them or pass --force to package anyway.`);
    process.exitCode = 1;
    return;
  }

  const distDir = join(root, 'dist');
  mkdirSync(distDir, { recursive: true });

  if (dryRun) {
    log.step('Dry run — computing package contents …');
    try {
      const out = execFileSync('npm', ['pack', '--dry-run'], { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
      log.info(out.trim());
    } catch (err) {
      log.warn(`npm pack --dry-run reported: ${(err.message || '').split('\n')[0]}`);
    }
    log.ok(`Dry run complete for ${config.platform.name} v${config.platform.version}.`);
    return;
  }

  log.step('Creating package tarball …');
  try {
    execFileSync('npm', ['pack', '--pack-destination', 'dist'], { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
  } catch (err) {
    log.err(`npm pack failed: ${(err.message || '').split('\n')[0]}`);
    process.exitCode = 1;
    return;
  }

  const tarballs = existsSync(distDir) ? readdirSync(distDir).filter((f) => f.endsWith('.tgz')) : [];
  if (tarballs.length) {
    log.ok(`Package created: ${c.cyan(join('dist', tarballs[tarballs.length - 1]))}`);
    log.info(`  Install locally: ${c.dim(`npm install -g ./dist/${tarballs[tarballs.length - 1]}`)}`);
  } else {
    log.warn('npm pack ran but no tarball was found in dist/.');
  }
  log.info(`  Release readiness: ${validation.ok ? c.green('READY') : c.yellow('FORCED (gates failed)')}`);
}
