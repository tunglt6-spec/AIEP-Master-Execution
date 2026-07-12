# Codex Token Preservation

Codex is AIEP's **External Independent Auditor** — a scarce, high-value reviewer that is
deliberately kept out of the default pipeline. This article explains why we preserve
Codex capacity and how the policy enforces it.

## Why preserve it

- Codex is an *external* auditor, not a local model. Its independence is what makes an
  L4 audit meaningful: it has not participated in the earlier review stages.
- Running Codex on routine work erodes that signal. If everything is "audited," an audit
  stops meaning "this is high-risk and got independent scrutiny."
- External invocations cost budget and time. Reserving them for genuine L4 work keeps the
  auditor available when it truly matters.

## The rule that preserves it

The **CODEX GUARD**: Codex runs **only at L4**, never at L1/L2/L3, and Work Orders must
not be inflated to L4 to obtain extra review. L4 is limited to genuinely high-risk
changes (auth, authz, critical security, payment, critical data migration, core runtime
with system-wide impact, major production release, or an unresolvable reviewer conflict).

Because Codex is the *last* reviewer in the L4 pipeline
(claude → deepseek → qwen → gemini → codex), the earlier reviewers act as filters: most
defects are caught and fixed before the audit, so the audit itself stays focused and
short.

## Practices that keep Codex invocations lean

1. **Right-level first.** Author Work Orders at the lowest correct level using the
   review-routing skill; only true high-risk work reaches L4.
2. **Resolve blocking findings before the audit.** Clear CRITICAL/HIGH findings from
   DeepSeek, Qwen, and Gemini first, so Codex reviews a clean, converged change rather
   than a work-in-progress.
3. **Scope to the delta.** Apply the git-delta-review skill so the audit context is the
   change, not the whole repository.
4. **Redact secrets.** Never send credentials to an external reviewer (see
   secret-hygiene); this protects both security and clean audit input.
5. **Batch nothing artificially.** Do not bundle unrelated changes into one L4 WO to
   "save" an audit; that defeats delta-scoped review.

## Anti-pattern

Escalating to L4 "to be safe" on a change that is not high-risk. This spends the auditor,
delays the WO, and — over time — trains the team to treat L4 as routine. When in doubt
between L3 and L4, default to L3 unless a listed high-risk criterion clearly applies.
