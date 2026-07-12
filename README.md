# AIEP — AI Engineering Platform

[![version](https://img.shields.io/badge/version-1.0.0-3b5bdb)](CHANGELOG.md)
[![runtime](https://img.shields.io/badge/node-%3E%3D18-2f9e44)](package.json)
[![deps](https://img.shields.io/badge/dependencies-0-2f9e44)](package.json)

A governance-driven engineering platform with **AI-assisted multi-level code
review** (L1–L4), a **PMO**, a reusable **AI engineering library**, and a live
**dashboard** — delivered as a single **zero-dependency** Node.js CLI.

```bash
node bin/aiep.js doctor      # check your environment
node bin/aiep.js status      # see platform status
node bin/aiep.js review      # run AI review on your Work Orders
node bin/aiep.js dashboard   # open the live dashboard
```

## Highlights

- **Review Levels L1–L4** map each Work Order to an ordered reviewer pipeline.
- **Local AI review** with DeepSeek + Qwen via Ollama; **Gemini** design review
  and **Codex** external audit are CLI-backed.
- **Codex guard:** the external auditor runs **only at L4** — enforced in code and
  by the quality gates to preserve scarce tokens.
- **Graceful degradation:** an unavailable backend produces a documented
  integration decision, never a fake pass.
- **Quality gates** (`aiep validate`): docs present, Work Orders valid, Codex
  guard, artifact completeness, no unresolved CRITICAL, no secrets, scope lock.
- **Zero dependencies:** Node built-ins only — installs and runs offline.

## Documentation

- [PROJECT.md](PROJECT.md) — overview, install, usage, layout.
- [Documentation index](docs/README.md).
- [Review Level Policy](docs/governance/REVIEW-LEVEL-POLICY.md).
- [Design Specification](docs/design/DESIGN-SPECIFICATION-v1.0.md).

## Development

```bash
npm test              # run the node:test suites
npm run validate      # quality gates
npm run dashboard     # build dashboard data
```

## License

MIT — see [LICENSE](LICENSE).
