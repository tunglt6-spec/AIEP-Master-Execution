# Frontmatter Conventions

AIEP stores its data as **Markdown with a small, controlled YAML frontmatter subset**.
Frontmatter is not free-form: only a known set of keys is used, so that `aiep validate`,
the PMO, and the dashboard can read documents reliably. This article defines the
conventions.

## What frontmatter is

A YAML block delimited by `---` at the very top of a Markdown file:

```yaml
---
id: WO-0142
title: Add delta-scoped review context
status: draft
reviewLevel: L2
owner: hoantk
deliverable: Core Repository
---
```

The body of the document follows the closing `---`.

## Controlled key set

Keep to a small, predictable vocabulary. Common keys:

| Key | Applies to | Values / notes |
|-----|-----------|----------------|
| `id` | all | Stable identifier (e.g. `WO-0142`, `ADR-0007`). |
| `title` | all | Short, concise title. |
| `status` | WO, ADR | e.g. `draft`, `in-review`, `blocked`, `done` (WO); `proposed`, `accepted`, `superseded` (ADR). |
| `reviewLevel` | WO | Exactly one of `L1`, `L2`, `L3`, `L4`. |
| `owner` | WO | Responsible engineer. |
| `deliverable` | WO | One of the five: Core Repository, Documentation System, AI Engineering Library, PMO, Dashboard. |
| `date` | ADR, articles | ISO date. |
| `relatedWO` | ADR | The Work Order that drove the decision. |

## Rules

1. **Frontmatter first.** The block must be the first content in the file, opened and
   closed with `---`.
2. **Controlled keys only.** Do not introduce ad-hoc keys; unknown keys defeat validation
   and dashboard aggregation. If a new key is genuinely needed, record the decision in an
   ADR first.
3. **Single-valued `reviewLevel`.** Exactly one level per Work Order — never a list or a
   range.
4. **Stable `id`.** Never reuse or renumber an `id`; other documents and artifacts
   reference it.
5. **JSON stays JSON.** Configuration (`.aiep/config.json`) and machine outputs
   (`decision.json`, `dashboard/data/dashboard.json`) are JSON, not frontmatter. Do not
   mix the two.
6. **No secrets.** Frontmatter is committed content — never place credentials in it (see
   secret-hygiene).

## Why the discipline matters

The controlled subset is the contract between human-authored Markdown and the automated
parts of AIEP (validation, PMO tracking, dashboard). A stray key or a malformed block can
silently drop a Work Order from a view. Consistency here is what lets zero-dependency Node
parsing stay simple and reliable across Windows, macOS, and Linux.
