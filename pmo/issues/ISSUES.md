# AIEP Issues

Tracked issues for v1.0. Resolved issues are kept for audit.

| ID | Title | Severity | Status | Resolution |
|----|-------|----------|--------|------------|
| I-01 | Ollama had no DeepSeek model, only qwen3:8b | Medium | Resolved | Pulled `deepseek-coder:1.3b`; doctor now reports both models installed (D-07) |
| I-02 | Gemini & Codex CLIs not installed in the build environment | Low | Open (by-design disposition) | Graceful degradation records integration decisions; not blocking for L1–L3; provision to enable full L3/L4 |
| I-03 | Fresh repo has no HEAD, so `aiep status` showed branch UNKNOWN | Low | Resolved | Resolves after the first commit; git helpers handle the unborn-branch case |

## Known limitations (v1.0)

- Local-model finding extraction is best-effort (structured `FINDING:` lines);
  raw output is always preserved in the artifact.
- Gemini/Codex require their CLIs on PATH; absent, their steps are documented
  dispositions.
