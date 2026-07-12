// src/cli/doctor.js
// `aiep doctor` — diagnose the environment, config and reviewer backends.

import { execFileSync } from 'node:child_process';
import { loadConfig } from '../core/config.js';
import { isGitRepo } from '../core/gitdelta.js';
import { probeOllama } from '../reviewers/ollama.js';
import { commandAvailable } from '../reviewers/cli-reviewer.js';
import { codexAllowed } from '../core/reviewMatrix.js';
import { c, log } from '../core/logger.js';

function nodeVersionOk() {
  const major = Number(process.versions.node.split('.')[0]);
  return major >= 18;
}

export async function runDoctor() {
  const { root, config } = loadConfig();
  const items = [];
  const add = (name, ok, detail) => items.push({ name, ok, detail });

  add('Node.js >= 18', nodeVersionOk(), `found v${process.versions.node}`);

  let gitVersion = '';
  try {
    gitVersion = execFileSync('git', ['--version'], { encoding: 'utf8' }).trim();
  } catch {
    /* ignore */
  }
  add('git available', Boolean(gitVersion), gitVersion || 'not found');
  add('inside git work tree', isGitRepo(root), root);
  add('AIEP config loaded', Boolean(config.platform), `v${config.platform?.version}`);

  // Local reviewers via Ollama.
  const endpoint = config.reviewers?.deepseek?.endpoint || 'http://127.0.0.1:11434';
  const probe = await probeOllama(endpoint);
  add('Ollama reachable', probe.reachable, probe.reachable ? `${probe.models.length} model(s): ${probe.models.join(', ')}` : (probe.error || 'not reachable'));

  const wantDeepseek = config.reviewers?.deepseek?.model;
  const wantQwen = config.reviewers?.qwen?.model;
  const has = (m) => probe.models.some((x) => x === m || x.split(':')[0] === String(m).split(':')[0]);
  add(`DeepSeek model (${wantDeepseek})`, probe.reachable && has(wantDeepseek), probe.reachable ? (has(wantDeepseek) ? 'installed' : 'NOT installed — degraded review') : 'ollama down');
  add(`Qwen model (${wantQwen})`, probe.reachable && has(wantQwen), probe.reachable ? (has(wantQwen) ? 'installed' : 'NOT installed — degraded review') : 'ollama down');

  // CLI reviewers.
  add('Gemini CLI', commandAvailable(config.reviewers?.gemini?.command || 'gemini'), 'design reviewer (L3+)');
  add('Codex CLI', commandAvailable(config.reviewers?.codex?.command || 'codex'), 'external auditor (L4 only)');

  // Codex guard sanity.
  const guardOk = !codexAllowed(config, 'L1') && !codexAllowed(config, 'L2') && !codexAllowed(config, 'L3') && codexAllowed(config, 'L4');
  add('Codex guard (L4 only)', guardOk, guardOk ? 'enforced' : 'MISCONFIGURED');

  return { items };
}

export async function cmdDoctor(args) {
  const json = args.includes('--json');
  const result = await runDoctor();
  if (json) {
    log.info(JSON.stringify(result, null, 2));
    return;
  }
  log.header('AIEP Doctor');
  for (const it of result.items) {
    const mark = it.ok ? c.green('ok ') : c.yellow('!! ');
    log.info(`  [${mark}] ${it.name}${it.detail ? c.dim(` — ${it.detail}`) : ''}`);
  }
  log.info('');
  const degraded = result.items.filter((i) => !i.ok);
  if (degraded.length === 0) {
    log.ok('Environment fully provisioned.');
  } else {
    log.warn(`${degraded.length} item(s) degraded. Reviews will run with documented dispositions where backends are missing.`);
  }
}
