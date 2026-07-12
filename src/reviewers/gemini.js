// src/reviewers/gemini.js
// Gemini Design Reviewer (ReviewLevel L3+). CLI-backed with graceful degradation.

import { runCliReviewer } from './cli-reviewer.js';

export async function runGeminiReviewer(ctx) {
  return runCliReviewer('gemini', ctx, {
    argsBuilder: (prompt) => ['-p', prompt],
  });
}
