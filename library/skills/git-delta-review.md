# Skill: Git Delta Review

**Type:** Repeatable engineering procedure (SOP)
**Goal:** Focus every reviewer on the *change delta* for a Work Order, not the whole
repository, so reviews are precise, fast, and free of noise from unrelated code.

## Why

Reviewing an entire tree per Work Order buries real findings under commentary on code
that did not change, wastes reviewer capacity, and produces summaries that are hard to
act on. AIEP reviews are scoped to what the WO actually changed.

## Inputs

- The Work Order and its associated branch or staged changes.
- A merge base / comparison point for the change.

## Procedure

1. **Establish the delta.** Determine the set of changed files and hunks for the WO
   relative to its base. Prefer the smallest correct comparison (staged changes, or the
   branch against its base).
2. **Bound the review context.** Provide reviewers the diff plus only the minimal
   surrounding context needed to understand each hunk (function/module the hunk lives
   in). Do not paste unrelated files.
3. **Instruct scope explicitly.** Every reviewer prompt states "Review ONLY the change
   delta" (the DeepSeek/Qwen/Gemini prompts already do this).
4. **Allow deliberate widening.** If a change in the delta implies a defect in adjacent
   unchanged code (e.g. a caller now passing a wrong argument), a reviewer may reference
   that code — but must tie the finding back to the delta.
5. **Attribute findings to delta locations.** Each finding cites a file and line/region
   inside (or directly implicated by) the delta.

## Anti-patterns to avoid

- Reviewing pre-existing code unrelated to the WO ("while we're here" scope creep).
- Re-flagging long-standing issues the WO did not touch (open a separate WO instead).
- Feeding reviewers the whole repository as context.

## Definition of done

Reviewer artifacts reference only delta locations (or delta-implicated code), and the
review summary is legible because it is bounded to what the WO changed.
