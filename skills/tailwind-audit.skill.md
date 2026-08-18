# tailwind-audit.skill.md

## Name

Tailwind Audit

## Purpose

Keep generated Tailwind code aligned to the token system and maintainable: catching arbitrary values,
duplicated utility sprawl, fragile breakpoints, and monolithic components before implementation is
finalized.

## When to use

- Only when actual code (Tailwind classes) has been generated or exists.
- After `design-system-guardian` has been applied.
- Before finalizing implementation.

## Procedure

1. **Arbitrary values**: Flag any `arbitrary-[...]` classes that could be replaced by design tokens.
   Recommend moving repeated arbitrary values into the token config.
2. **Class duplication & sprawl**: Identify repeated long class strings that should be extracted into
   components or variants. Detect CSS bloat from over-using utilities.
3. **Token violations**: Confirm colors, spacing, typography, and radius come from the token system.
   Flag hard-coded hex, off-scale pixel values, or non-token colors.
4. **Fragile breakpoints & layout**: Identify brittle layouts (excessive `flex`/`grid` hacks,
   negative margins) and responsive classes added as afterthoughts.
5. **Unnecessary wrappers & monolithic components**: Flag redundant wrapper elements and components
   that should be decomposed.
6. **Readability & maintainability**: Suggest component extraction when a block of classes is hard to
   reason about; keep a consistent class order (layout -> spacing -> typography -> visual).

## Output contract

List specific issues with file/line references when possible, plus concrete recommendations tied to
tokens or component patterns. Do not rewrite the entire codebase in one response.

## Failure modes

- **Style nitpicking without token grounding:** Complaining about class order with no design-system link. -> Connect feedback to tokens or maintainability.
- **Over-refactoring:** Massive refactors when small fixes suffice. -> Prioritize high-impact, low-effort fixes.
- **Ignoring responsive classes:** Auditing desktop only. -> Review mobile breakpoint usage explicitly.

## Example invocation

```text
Run tailwind-audit on this component file. List arbitrary values and token violations with line
numbers and the corrected classes: prioritize the high-impact ones.
```
