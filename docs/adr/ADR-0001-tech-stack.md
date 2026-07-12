# ADR-0001 — Technology Stack

- **Status:** Accepted
- **Date:** 2026-07-12
- **Deciders:** Execution Lead (ratified under Architecture Freeze v1.0)

## Context

AIEP must ship a CLI, a review engine, validation, a dashboard and a packaging
path. It should install and run offline, be cross-platform (the primary
environment is Windows), start fast, and present a minimal supply-chain surface
for a governance/security-adjacent tool.

## Decision

Use **Node.js (>= 18) with ESM and zero runtime dependencies** — Node built-ins
only (`node:fs`, `node:path`, `node:child_process`, `node:http`, global
`fetch`, `node:test`).

- CLI parsing, HTTP (dashboard server + Ollama client), git access and file I/O
  are all covered by built-ins.
- Data is **Markdown + a controlled YAML frontmatter subset**; config and machine
  artifacts are **JSON**. A small in-house frontmatter parser avoids a YAML
  dependency.
- Tests use the built-in `node:test` runner.

## Consequences

**Positive**

- Offline install; `npm install` requires no network (no dependencies).
- Small attack surface and no dependency drift.
- One runtime for CLI, dashboard and packaging.
- Fast startup, trivial packaging via `npm pack`.

**Negative / trade-offs**

- The in-house frontmatter parser supports only a controlled subset (mitigated by
  unit tests and template-controlled input).
- No third-party CLI/UX libraries; formatting is hand-rolled (acceptable for the
  scope).

## Alternatives considered

- **Python + Click + Rich:** excellent CLI ergonomics, but a second runtime for
  the dashboard and a heavier dependency story.
- **Node + heavy deps (commander, chalk, yaml, express):** faster to write, but
  larger supply-chain surface and offline-install friction — rejected for a
  governance tool.
