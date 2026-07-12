# Architecture Freeze v1.0

The following architectural decisions are frozen for v1.0. They may be changed
only by the Product Owner and ARB. The rationale for each is recorded in the ADRs
(`docs/adr/`).

## Frozen decisions

1. **Runtime: Node.js (>= 18), ESM, zero runtime dependencies.**
   The platform uses only Node built-ins. This guarantees offline install, fast
   startup, a small supply-chain surface, and one runtime for CLI + dashboard +
   packaging. See ADR-0001.

2. **Data format: Markdown + a controlled YAML frontmatter subset; JSON for
   config and machine artifacts.**
   Work Orders are Markdown with frontmatter parsed by a small in-house parser.
   `.aiep/config.json` and `decision.json` are JSON. See ADR-0001.

3. **Layered module architecture.**
   `bin/aiep.js` → `src/cli/*` (commands) → `src/core/*` (config, paths,
   frontmatter, workorders, gitdelta, reviewMatrix, secrets) and
   `src/reviewers/*` (claude, ollama, cli-reviewer, gemini, codex, findings,
   router). The dashboard is built by `src/dashboard/build.js` and served
   statically.

4. **Review routing by ReviewLevel with the Codex L4 guard.**
   The `reviewLevels` map in config is the routing source of truth; the Codex
   guard restricts Codex to L4. See ADR-0002 and ADR-0003.

5. **Reviewer backends are pluggable and degrade gracefully.**
   Local reviewers use the Ollama HTTP API; Gemini and Codex are CLI-backed. Any
   unavailable backend yields a documented integration decision, never a fake
   pass.

6. **Artifacts are the unit of review evidence.**
   Every reviewed Work Order writes per-reviewer artifacts, a `review-summary.md`
   (L2+) and a `decision.json` under `.aiep/artifacts/<WO-ID>/`.

7. **Dashboard reads live data only.**
   `dashboard/data/dashboard.json` is generated from real repository state; no
   demo numbers are presented as production data.

## Non-frozen (implementation detail, may evolve within v1.0)

- Exact CLI output formatting and colours.
- Additional reviewer focus keywords.
- Dashboard visual styling (within the "light, modern, professional" direction).
- Additional library assets and templates.
