# ui-audit.skill.md

## Name

UI Audit

## Purpose

Review a screen for visual hierarchy, composition, clarity, and information architecture so problems
are caught before polish or code, and feedback is specific and actionable rather than "it looks nice".

## When to use

- After initial visual generation or major layout work.
- Before moving to polish or code implementation.
- When reviewing an existing screen for quality and consistency.

## Procedure

1. **Hierarchy & scanning**: Is the primary information and action visible within 3 seconds? Do size,
   weight, and color create clear hierarchy? Is the CTA hierarchy unambiguous? Use the squint test:
   primary, secondary, and groupings should remain legible with detail blurred.
2. **Spacing & rhythm**: Is spacing consistent with the token scale? Is there breathing room between
   sections? Are margins and padding intentional, not arbitrary? Related items should be tight;
   unrelated groups need stronger separation.
3. **Typography**: Are sizes, weights, and line heights from the token scale? Is text readable and
   well-leaded? Are headings and body properly differentiated?
4. **Composition & layout**: Does the layout feel balanced and intentional? Are elements aligned
   consistently (or deliberately broken for emphasis)? Is there visual noise? Use flex for 1D,
   grid for 2D, and avoid card grids when spacing/dividers would communicate the grouping better.
5. **Density & clarity**: Is information density appropriate for the audience and device?
6. **Information architecture**: Does grouping and order match user priorities?
7. **States**: Are empty, loading, and error states designed, not just the happy path?
8. **System consistency**: Does this screen feel like it belongs with the others?
9. **Responsive implications**: Note whether the layout has a credible mobile/tablet adaptation
   path; do not leave mobile problems for final review only.

## Output contract

Produce a structured audit with: what is working well; specific issues found (with location);
recommended fixes (tied to tokens or `DESIGN.md` principles). Do not rewrite the entire screen unless
explicitly asked.

## Failure modes

- **Superficial audit:** Only "it looks nice". -> Tie every note to hierarchy, spacing, typography, or system consistency.
- **Over-correction:** Rewriting large parts when targeted fixes suffice. -> Audit + targeted recommendations only.
- **Ignoring mobile implications:** Auditing desktop only. -> Note mobile considerations even here.
- **Card reflex:** Treating every group as a card. -> Prefer hierarchy through spacing, type, and
  dividers unless the item is truly distinct/actionable.

## Example invocation

```text
Run ui-audit on this dashboard. Report what works, the specific issues with locations, and fixes
tied to the tokens: do not redesign it.
```
