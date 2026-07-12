# Skill: Secret Hygiene

**Type:** Repeatable engineering procedure (SOP)
**Goal:** Never commit secrets (API keys, tokens, passwords, private keys, connection
strings) to the repository or into artifacts, and catch them before they land.

## Why

AIEP curates a reusable library and produces artifacts under `.aiep/artifacts/`. A leaked
credential in any of these spreads and is expensive to rotate. Secret hygiene is a
standing precondition of every review, and basic secret detection is part of the
correctness lens (DeepSeek "basic security").

## Rules

1. **No secrets in source, config, docs, or artifacts.** `.aiep/config.json` holds
   configuration, not credentials. Real secrets belong in the environment or a local,
   git-ignored file — never committed.
2. **No secrets in reviewer inputs/outputs.** When constructing a diff for review, do not
   include real credential values; redact before sending to any external reviewer
   (Gemini, Codex).
3. **Rotate, don't just delete.** If a secret was committed, treat it as compromised:
   rotate the credential; removing the file is not enough because history retains it.

## Scanning patterns

Scan added/changed lines in the delta for high-signal patterns. Examples (adapt as
needed; these are detection heuristics, not a guarantee):

```text
# Generic assignment of a secret-like value
(?i)(api[_-]?key|secret|token|passwd|password|client[_-]?secret)\s*[:=]\s*['"][^'"]{8,}['"]

# Private key blocks
-----BEGIN (RSA|EC|OPENSSH|PGP|DSA)? ?PRIVATE KEY-----

# Cloud/provider key shapes (illustrative)
AKIA[0-9A-Z]{16}                      # AWS access key id
gh[pousr]_[A-Za-z0-9]{20,}            # GitHub token
xox[baprs]-[A-Za-z0-9-]{10,}          # Slack token

# High-entropy long hex/base64 literals assigned to a variable
(?i)(key|token|secret)\s*[:=]\s*['"][A-Za-z0-9+/=_-]{32,}['"]
```

## Procedure

1. Before staging, scan the delta with the patterns above.
2. If a match is a real secret: remove it, move it to the environment / git-ignored
   config, and rotate the credential.
3. If it is a false positive (a sample, a public value): confirm and, where useful,
   annotate so future scans understand the exception.
4. A confirmed secret in a change is a **CRITICAL** (blocking) finding — the WO cannot
   pass until it is remediated and the credential rotated.

## Definition of done

The delta contains no live credentials, any prior exposure has been rotated, and the
scanning step is part of the pre-commit / pre-review routine.
