# AIEP Risk Register

Severity × likelihood scale: Low / Medium / High.

| ID | Risk | Likelihood | Impact | Mitigation | Status |
|----|------|-----------|--------|------------|--------|
| R-01 | Reviewer backend (Gemini/Codex CLI) unavailable in an environment | High | Medium | Graceful degradation with documented integration decision; doctor reports availability; not a hard block for L1–L3 | Mitigated |
| R-02 | DeepSeek/Qwen model not installed in Ollama | Medium | Medium | Availability probe + model fallback with recorded substitution; `ollama pull` documented in doctor output | Mitigated |
| R-03 | Frontmatter parser too permissive/strict for edge inputs | Medium | Medium | Controlled subset + unit tests; templates constrain input | Mitigated |
| R-04 | Codex accidentally invoked below L4 (token waste) | Low | High | Defence-in-depth guard (matrix + reviewer + router + validation) with tests | Mitigated |
| R-05 | Secret accidentally committed | Low | High | Secret scanner in self-review and `aiep validate`; `.gitignore` for env/keys | Mitigated |
| R-06 | Scope creep toward v2.0 features | Medium | Medium | Scope Lock v1.0 with directory tripwires enforced by validation | Mitigated |
| R-07 | Local model output not machine-parseable | Medium | Low | Structured `FINDING:` protocol with raw output preserved; parser is best-effort with fallback | Accepted |
| R-08 | Cross-platform path/shell differences | Medium | Medium | Node built-ins, path joins, `where`/`which` probing; tested on Windows | Mitigated |
