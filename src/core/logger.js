// src/core/logger.js
// Minimal dependency-free logger with ANSI colours (auto-disabled when not a TTY
// or when NO_COLOR is set). Keeps CLI output clean and consistent.

const useColor = process.stdout.isTTY && !process.env.NO_COLOR;

const codes = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m',
};

function paint(color, s) {
  if (!useColor) return s;
  return `${codes[color] || ''}${s}${codes.reset}`;
}

export const c = {
  bold: (s) => paint('bold', s),
  dim: (s) => paint('dim', s),
  red: (s) => paint('red', s),
  green: (s) => paint('green', s),
  yellow: (s) => paint('yellow', s),
  blue: (s) => paint('blue', s),
  magenta: (s) => paint('magenta', s),
  cyan: (s) => paint('cyan', s),
  gray: (s) => paint('gray', s),
};

export const log = {
  info: (msg) => console.log(msg),
  ok: (msg) => console.log(`${paint('green', '✓')} ${msg}`),
  warn: (msg) => console.log(`${paint('yellow', '!')} ${msg}`),
  err: (msg) => console.error(`${paint('red', '✗')} ${msg}`),
  step: (msg) => console.log(`${paint('cyan', '→')} ${msg}`),
  header: (msg) => console.log(`\n${paint('bold', paint('blue', msg))}`),
  raw: (msg) => process.stdout.write(msg),
};

export const symbols = {
  L1: paint('gray', 'L1'),
  L2: paint('cyan', 'L2'),
  L3: paint('blue', 'L3'),
  L4: paint('magenta', 'L4'),
};
