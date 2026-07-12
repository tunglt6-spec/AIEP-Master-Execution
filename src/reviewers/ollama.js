// src/reviewers/ollama.js
// Local reviewer backend driven by Ollama (DeepSeek = code reviewer,
// Qwen = technical reviewer). Talks to the Ollama HTTP API. Degrades
// gracefully with a documented integration decision when the backend or the
// configured model is unavailable.

import { extractFindings } from './findings.js';

async function withTimeout(promise, ms, onTimeoutMessage) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), ms);
  try {
    return await promise(ctrl.signal);
  } catch (err) {
    if (ctrl.signal.aborted) throw new Error(onTimeoutMessage || `timed out after ${ms}ms`);
    throw err;
  } finally {
    clearTimeout(t);
  }
}

/** Probe Ollama for reachability and installed models. */
export async function probeOllama(endpoint) {
  try {
    const res = await withTimeout(
      (signal) => fetch(`${endpoint}/api/tags`, { signal }),
      4000,
      'Ollama not reachable'
    );
    if (!res.ok) return { reachable: false, models: [] };
    const data = await res.json();
    const models = (data.models || []).map((m) => m.name);
    return { reachable: true, models };
  } catch (err) {
    return { reachable: false, models: [], error: err.message };
  }
}

function buildPrompt(reviewerName, spec, ctx) {
  const focus = (spec.focus || []).join(', ');
  const fileList = ctx.delta.files.length
    ? ctx.delta.files.map((f) => `  - ${f}`).join('\n')
    : '  (no changed files detected)';
  return [
    `You are ${reviewerName} acting as the "${spec.role}" for the AIEP platform.`,
    `Review ONLY the change delta below for Work Order ${ctx.wo.meta.id}: ${ctx.wo.meta.title}.`,
    `Your review focus areas: ${focus}.`,
    '',
    'Changed files:',
    fileList,
    '',
    'Unified diff (may be truncated):',
    '```diff',
    ctx.delta.diff || '(no textual diff available)',
    '```',
    '',
    'Respond in Markdown. For every issue use a line of the exact form:',
    'FINDING: <SEVERITY> - <short description>',
    'where <SEVERITY> is one of CRITICAL, HIGH, MEDIUM, LOW, INFO.',
    'If you find no issues, write exactly: FINDING: INFO - No blocking issues found.',
    'Then add a short "Summary" paragraph. Be concise and specific to the diff.',
  ].join('\n');
}

/**
 * Run a single Ollama-backed reviewer.
 * @param {string} reviewerName 'deepseek' | 'qwen'
 * @param {object} ctx review context
 */
export async function runOllamaReviewer(reviewerName, ctx) {
  const spec = ctx.config.reviewers[reviewerName];
  const endpoint = spec.endpoint || 'http://127.0.0.1:11434';
  const probe = await probeOllama(endpoint);

  if (!probe.reachable) {
    return degraded(reviewerName, spec, ctx,
      `Ollama backend at ${endpoint} is not reachable. Start Ollama with \`ollama serve\` and install the model with \`ollama pull ${spec.model}\`.`);
  }

  // Resolve the model: prefer the configured one, else fall back to any installed
  // model, recording the substitution as an integration decision.
  let model = spec.model;
  let substitution = null;
  const has = (name) => probe.models.some((m) => m === name || m.split(':')[0] === name.split(':')[0]);
  if (!has(model)) {
    const fallback = probe.models[0];
    if (!fallback) {
      return degraded(reviewerName, spec, ctx,
        `No Ollama models installed. Install with \`ollama pull ${spec.model}\`.`);
    }
    substitution = `Configured model "${spec.model}" not installed; used available model "${fallback}" and recorded this integration decision.`;
    model = fallback;
  }

  const prompt = buildPrompt(reviewerName, spec, ctx);
  let responseText = '';
  try {
    const numPredict = Number(process.env.AIEP_OLLAMA_NUM_PREDICT || 512);
    const res = await withTimeout(
      (signal) =>
        fetch(`${endpoint}/api/generate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model,
            prompt,
            stream: false,
            // `think: false` disables chain-of-thought on reasoning models (e.g.
            // qwen3), which otherwise emit long hidden reasoning and can overrun
            // the timeout on CPU. `num_predict` bounds output length for speed.
            think: false,
            options: { temperature: 0.1, num_predict: numPredict },
          }),
          signal,
        }),
      Number(process.env.AIEP_OLLAMA_TIMEOUT_MS || 300000),
      'Ollama generation timed out'
    );
    if (!res.ok) {
      return degraded(reviewerName, spec, ctx, `Ollama returned HTTP ${res.status}.`);
    }
    const data = await res.json();
    responseText = (data.response || '').trim();
  } catch (err) {
    return degraded(reviewerName, spec, ctx, `Ollama generation failed: ${err.message}`);
  }

  const findings = extractFindings(responseText);
  const artifact = renderArtifact(reviewerName, spec, ctx, model, substitution, responseText, findings);
  return {
    reviewer: reviewerName,
    status: 'completed',
    available: true,
    model,
    substitution,
    findings,
    artifact,
  };
}

function degraded(reviewerName, spec, ctx, reason) {
  const artifact = [
    `# ${reviewerName} review — DEGRADED (integration decision)`,
    '',
    `- **Work Order:** ${ctx.wo.meta.id}`,
    `- **Reviewer role:** ${spec.role}`,
    `- **Backend:** ollama (${spec.model})`,
    `- **Status:** DEGRADED — backend/model unavailable in this environment`,
    '',
    '## Integration decision',
    '',
    reason,
    '',
    'Per the AIEP Review Execution policy (self-configure safely, record the decision, continue),',
    'this reviewer step is recorded as a documented disposition rather than a hard block, because',
    'the local model backend is an environment provisioning concern, not a defect in the change.',
    '',
    '## Effect on the Review Contract',
    '',
    'No findings could be produced by this reviewer. The consolidated review summary reflects this',
    'degraded status. To obtain a full review, provision the model and re-run `aiep review <WO-ID>`.',
  ].join('\n');
  return {
    reviewer: reviewerName,
    status: 'degraded',
    available: false,
    findings: [],
    artifact,
    note: reason,
  };
}

function renderArtifact(reviewerName, spec, ctx, model, substitution, responseText, findings) {
  const lines = [
    `# ${reviewerName} review`,
    '',
    `- **Work Order:** ${ctx.wo.meta.id} — ${ctx.wo.meta.title}`,
    `- **Reviewer role:** ${spec.role}`,
    `- **Backend:** ollama / ${model}`,
    `- **Focus:** ${(spec.focus || []).join(', ')}`,
    `- **Changed files:** ${ctx.delta.files.length}`,
    `- **Status:** completed`,
  ];
  if (substitution) lines.push('', `> Integration decision: ${substitution}`);
  lines.push('', '## Findings', '');
  if (findings.length === 0) {
    lines.push('_No structured findings parsed from the model output; see raw review below._');
  } else {
    for (const f of findings) lines.push(`- **${f.severity}** — ${f.message}`);
  }
  lines.push('', '## Raw reviewer output', '', '```', responseText || '(empty)', '```');
  return lines.join('\n');
}
