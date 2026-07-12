#!/usr/bin/env node
// AIEP CLI entry point.
import { main } from '../src/cli/index.js';

main(process.argv.slice(2)).catch((err) => {
  console.error(`\x1b[31m✗ aiep: ${err.message}\x1b[0m`);
  process.exitCode = 1;
});
