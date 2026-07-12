# MCP Library

This section documents how **Model Context Protocol (MCP)** servers can supply context to
AIEP reviewers and knowledge processes, and provides reference server descriptors.

> **Reference material.** The descriptors in this folder (`filesystem-server.json`,
> `git-server.json`) are *reference descriptors* — illustrative shapes you copy and adapt.
> They are not a shipped runtime integration of AIEP v1.0. AIEP v1.0 core remains
> Node.js ESM with zero runtime dependencies; MCP usage sits at the tooling edge, not in
> the frozen core.

## What MCP is, briefly

MCP is a protocol that lets an AI client connect to external **servers** that expose
context (resources) and actions (tools) over a defined transport (commonly `stdio` or
HTTP/SSE). A client asks a server what it can do (capabilities) and then reads resources
or calls tools through a uniform interface.

## How MCP fits AIEP

MCP servers give reviewers and knowledge tasks *scoped, structured* access to context
instead of ad-hoc file reads:

- **Reviewers** — A filesystem or git MCP server can hand a reviewer exactly the change
  delta and the surrounding file context for a Work Order, reinforcing the
  `git-delta-review` skill. The reviewer sees the delta through a controlled capability
  rather than the whole disk.
- **Knowledge** — An MCP server can expose the AI Engineering Library (prompts, skills,
  knowledge articles) as read-only resources, so an assistant can pull the right asset
  by name when authoring a WO or synthesizing a review.
- **Boundaries** — MCP access should be least-privilege and read-only wherever possible.
  A server that can write or delete must be scoped narrowly and is subject to the same
  `secret-hygiene` rules (never expose credentials through a resource).

## Descriptor shape

Each reference descriptor uses these fields:

| Field | Meaning |
|-------|---------|
| `name` | Stable identifier for the server. |
| `description` | What context/actions it provides. |
| `transport` | How the client connects (`stdio`, `http`, `sse`). |
| `capabilities` | Declared `resources` and `tools` the server exposes. |
| `notes` | Reference-only caveats and scope. |

## Files

- [filesystem-server.json](filesystem-server.json) — read-scoped access to Work Order
  files and library assets.
- [git-server.json](git-server.json) — read-scoped access to repository history and the
  change delta for a Work Order.
