# AI Engineering Library

The AI Engineering Library is one of the five product deliverables of **AIEP v1.0**
(AI Engineering Platform). It is the platform's curated, reusable knowledge base:
the place where every important piece of engineering work leaves behind an asset that
the next Work Order can pick up instead of re-inventing.

AIEP is a governance-driven platform that runs AI-assisted, multi-level code review,
tracks work through a PMO, and surfaces status on a dashboard. The library is what
keeps that machine from repeating itself.

## The four sections

| Section | Path | What it holds |
|---------|------|---------------|
| **Prompts** | `prompts/` | Reusable prompt templates that drive the reviewers (DeepSeek, Qwen, Gemini) and common authoring tasks (Work Orders, review summaries, ADRs). |
| **Skills** | `skills/` | Repeatable engineering procedures — SOPs an engineer or agent follows the same way every time (review routing, delta review, graceful degradation, secret hygiene). |
| **MCP** | `mcp/` | Model Context Protocol reference material: how MCP servers integrate with AIEP reviewers and knowledge, plus example server descriptors. |
| **Knowledge** | `knowledge/` | Knowledge-base articles explaining policy and practice (review levels, Codex token preservation, local review with Ollama, frontmatter, lessons learned). |

Each section carries an `INDEX.md` that lists its assets so they are discoverable.

## The Rule of Three

Important deliverables should yield three kinds of reusable asset:

1. **Code Asset** — something executable or configurable (a CLI behavior, a
   descriptor, a scanning pattern).
2. **Knowledge Asset** — an explanation of *why* and *how* (a KB article).
3. **Standard Asset** — a repeatable pattern, checklist, SOP, prompt, template, or
   lesson learned.

The library is where the Knowledge and Standard assets live, and where Code assets are
referenced and described. No filler — an asset is added only when it is genuinely
reusable by a future Work Order. If a piece of work does not produce a reusable asset,
nothing is forced into the library.

## How assets are reused

- A new Work Order at review level **L2+** pulls the matching reviewer prompt from
  `prompts/` instead of hand-writing instructions.
- The **review-routing** skill tells the platform which reviewers to run for a given
  `ReviewLevel`, keeping routing consistent with the Review Level Policy.
- Knowledge articles are linked from Work Orders and ADRs so decisions cite a stable
  source rather than tribal memory.
- MCP descriptors are copied and adapted when a reviewer or knowledge source needs a
  new context server.

## Consistency with the platform

Everything here is written to the frozen v1.0 facts: Node.js ESM with zero runtime
dependencies, Markdown + a controlled YAML frontmatter subset, `.aiep/config.json` for
config, and the reviewer roster of Claude, DeepSeek, Qwen, Gemini, and Codex. The
library never introduces commands, files, or features outside v1.0 scope.
