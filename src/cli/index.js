// src/cli/index.js
// AIEP CLI dispatcher. Routes subcommands to their implementations.

import { c, log } from '../core/logger.js';
import { cmdStatus } from './status.js';
import { cmdValidate } from './validate.js';
import { cmdReview } from './review.js';
import { cmdArtifacts } from './artifacts.js';
import { cmdDoctor } from './doctor.js';
import { cmdDashboard } from './dashboard.js';
import { cmdPackage } from './package.js';

const VERSION = '1.0.0';

const COMMANDS = {
  status: { fn: cmdStatus, help: 'Show platform, work-order, review and release status' },
  validate: { fn: cmdValidate, help: 'Run repository & governance validation (quality gates)' },
  review: { fn: cmdReview, help: 'Run the review pipeline for a Work Order per its ReviewLevel' },
  artifacts: { fn: cmdArtifacts, help: 'Show review artifacts for a Work Order' },
  doctor: { fn: cmdDoctor, help: 'Diagnose environment, reviewer backends and config' },
  dashboard: { fn: cmdDashboard, help: 'Build dashboard data and print how to open it' },
  package: { fn: cmdPackage, help: 'Verify and prepare a release package' },
};

function printHelp() {
  log.info(`${c.bold('AIEP')} — AI Engineering Platform CLI ${c.dim(`v${VERSION}`)}`);
  log.info('');
  log.info(`${c.bold('Usage:')} aiep <command> [options]`);
  log.info('');
  log.info(c.bold('Commands:'));
  for (const [name, meta] of Object.entries(COMMANDS)) {
    log.info(`  ${c.cyan(name.padEnd(11))} ${meta.help}`);
  }
  log.info('');
  log.info(c.bold('Examples:'));
  log.info('  aiep status');
  log.info('  aiep validate');
  log.info('  aiep review WO-0105');
  log.info('  aiep review            ' + c.dim('# review all non-done Work Orders'));
  log.info('  aiep artifacts WO-0105');
  log.info('  aiep doctor');
  log.info('  aiep dashboard --build');
  log.info('  aiep package');
  log.info('');
  log.info('Global: --help, --version, --json (where supported)');
}

/**
 * @param {string[]} argv arguments (already sliced past node + script)
 */
export async function main(argv) {
  const [cmd, ...rest] = argv;

  if (!cmd || cmd === '--help' || cmd === '-h' || cmd === 'help') {
    printHelp();
    return;
  }
  if (cmd === '--version' || cmd === '-v' || cmd === 'version') {
    log.info(VERSION);
    return;
  }

  const entry = COMMANDS[cmd];
  if (!entry) {
    log.err(`Unknown command "${cmd}". Run "aiep --help".`);
    process.exitCode = 1;
    return;
  }

  await entry.fn(rest);
}
