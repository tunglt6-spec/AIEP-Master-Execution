# AIEP Constitution

> The Constitution states the enduring principles of the AI Engineering Platform.
> It sits above all other documents. Where a lower document conflicts with the
> Constitution, the Constitution prevails.

## 1. Purpose

AIEP exists to make AI-assisted software engineering **governed, auditable and
repeatable**. Every material change is planned as a Work Order, reviewed at a
level proportional to its risk, and leaves a durable evidence trail.

## 2. Principles

1. **Git is the single source of truth.** State is derived from the repository,
   not from memory or ad-hoc notes.
2. **Every change has a Work Order, and every Work Order has exactly one
   ReviewLevel (L1–L4).** No change of substance bypasses this.
3. **Review is proportional to risk.** Low-risk work is not over-reviewed;
   high-risk work is not under-reviewed. Review levels are not inflated to look
   thorough.
4. **Codex is a scarce resource.** The external auditor is engaged only at L4,
   only for genuinely high-risk changes. Token preservation is a first-class
   concern.
5. **Evidence over assertion.** Reviews produce artifacts. A claim of "reviewed"
   without an artifact is not accepted.
6. **Graceful degradation, honest reporting.** When a reviewer backend is
   unavailable, the platform records a documented disposition and continues; it
   never fakes a passing review.
7. **No secrets in the repository.** Credentials, tokens and keys are never
   committed. This is enforced automatically.
8. **Scope discipline.** v1.0 delivers exactly five product deliverables. Out-of-
   scope features are refused, not quietly built.
9. **Reuse by default (Rule of Three).** Significant work yields a code asset, a
   knowledge asset and a standard asset where reuse is real.
10. **Least astonishment.** Tools do what they say. No mock command reports
    success for a capability that does not exist.

## 3. The Five Product Deliverables (v1.0)

1. Core Repository — bootstrap, runtime, source, scripts, tools, validation, CLI.
2. Documentation System — constitution, governance, design, ADR/RFC/SOP, release.
3. AI Engineering Library — prompts, skills, MCP, knowledge, reusable assets.
4. PMO — backlog, sprints, milestones, releases, issues, risks, decisions.
5. Dashboard — architecture, sprint, runtime, knowledge and review status.

## 4. Roles (AI Operating Model)

| Role | Actor | Mandate |
|------|-------|---------|
| Chief Architect / ARB | ChatGPT | Final architecture review |
| Execution Lead | Claude Code | Engineering & self review |
| Local Code Reviewer | DeepSeek (Ollama) | Correctness, bugs, edge cases |
| Local Technical Reviewer | Qwen (Ollama) | Maintainability, structure |
| Design Reviewer | Gemini | Design & scope alignment |
| External Auditor | Codex | L4-only critical audit |

## 5. Amendment

The Constitution and the Architecture Freeze / Scope Lock for v1.0 may only be
changed by the Product Owner and ARB. The Execution Lead may not alter them
unilaterally; a request to do so is escalated as a hard blocker.
