// src/cli/dashboard.js
// `aiep dashboard [--build] [--port N] [--no-serve]`
// Builds real dashboard data, then (unless --build/--no-serve) serves the
// static dashboard over a local HTTP server.

import { createServer } from 'node:http';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { extname, join, normalize } from 'node:path';
import { loadConfig } from '../core/config.js';
import { buildDashboardData } from '../dashboard/build.js';
import { c, log } from '../core/logger.js';

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
};

function parseArgs(args) {
  const opts = { build: false, serve: true, port: 4173 };
  for (let i = 0; i < args.length; i += 1) {
    const a = args[i];
    if (a === '--build') { opts.build = true; opts.serve = false; }
    else if (a === '--no-serve') opts.serve = false;
    else if (a === '--port') opts.port = Number(args[++i]);
    else if (a.startsWith('--port=')) opts.port = Number(a.slice(7));
  }
  return opts;
}

function serve(rootDir, port) {
  const server = createServer((req, res) => {
    let urlPath = decodeURIComponent((req.url || '/').split('?')[0]);
    if (urlPath === '/') urlPath = '/index.html';
    const filePath = normalize(join(rootDir, urlPath));
    if (!filePath.startsWith(rootDir)) {
      res.writeHead(403);
      res.end('Forbidden');
      return;
    }
    if (!existsSync(filePath) || !statSync(filePath).isFile()) {
      res.writeHead(404);
      res.end('Not found');
      return;
    }
    res.writeHead(200, { 'Content-Type': MIME[extname(filePath)] || 'application/octet-stream' });
    res.end(readFileSync(filePath));
  });
  return new Promise((resolve) => {
    server.listen(port, '127.0.0.1', () => resolve(server));
  });
}

export async function cmdDashboard(args) {
  const opts = parseArgs(args);
  const { paths } = loadConfig();

  log.step('Building dashboard data from live AIEP state …');
  const { data, outPath } = await buildDashboardData();
  log.ok(`Dashboard data written: ${c.dim(outPath.replace(paths.root + '\\', '').replace(paths.root + '/', ''))}`);
  log.info(`  Work Orders: ${data.workOrders.summary.total}  •  Gates passed: ${data.releaseReadiness.gatesPassed}  •  Release ready: ${data.releaseReadiness.ok ? c.green('yes') : c.yellow('no')}`);

  if (!opts.serve) {
    log.info('');
    log.info(`Open the dashboard by serving the ${c.cyan('dashboard/')} folder, e.g.:`);
    log.info(`  ${c.dim('aiep dashboard        # build + serve at http://127.0.0.1:4173')}`);
    return;
  }

  const server = await serve(paths.dashboard, opts.port);
  const url = `http://127.0.0.1:${opts.port}/`;
  log.header('AIEP Dashboard is running');
  log.info(`  ${c.bold(url)}`);
  log.info(c.dim('  Press Ctrl+C to stop.'));
  // Keep process alive; clean shutdown on SIGINT.
  process.on('SIGINT', () => {
    server.close(() => process.exit(0));
  });
}
