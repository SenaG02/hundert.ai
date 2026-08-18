# brief-framing.skill.md

## Name

Brief Framing

## Purpose

Prevent Claude Design from inventing a generic product, audience, brand voice, or implementation
path before the project has enough context. This skill turns an unclear request into a compact
design brief and classifies the surface before visual work begins.

## When to use

- At the start of a new Claude Design Web project.
- Before generating a new design system, landing page, app shell, dashboard, deck, or major flow.
- When `DESIGN.md`, the active token CSS, or the product/audience context is missing or too thin.
- When the user provides references but has not said what should be obeyed, avoided, or transformed.

## Procedure

1. **Classify the surface**: Decide whether the current work is primarily:
   - `brand`: marketing, landing, editorial, portfolio, campaign, venue, launch, public site.
   - `product`: app UI, dashboard, admin, tool, settings, workflow, form-heavy interface.
   - `system`: component library, tokens, templates, starter kit, documentation.
2. **Name the job**: State the product, audience, primary user goal, and first surface to design.
3. **Separate references from directives**: Identify what reference material should be copied,
   translated, avoided, or used only as inspiration.
4. **Capture anti-references**: List aesthetic or UX directions the project should not drift into.
5. **Choose the canvas mode**: Static HTML/CSS/browser JS inside Claude Design Web; Astro/Vite/Next
   only as later handoff targets.
6. **Ask only blocking questions**: If the brief is incomplete, ask the few questions that materially
   change the design. Do not ask questions that can be safely inferred.
7. **Write a compact brief**: Produce the minimal context needed for the next skill to act.

## Output contract

Produce:

- Surface register: `brand`, `product`, or `system`.
- First surface to create.
- Audience and primary job-to-be-done.
- References to obey / avoid / translate.
- Token or brand gaps.
- Blocking questions, if any.
- Recommended next skill.

Do not generate the visual design in the same response when blocking context is missing.

## Failure modes

- **Designing from the seed/reference page:** Treating bootstrap docs as visual inspiration. -> Use
  them for governance only.
- **Over-interviewing:** Asking a long questionnaire before action. -> Ask only questions that change
  the outcome.
- **Assuming a framework too early:** Starting with Next/Vite/Astro inside the canvas. -> Keep the
  first artifact static.
- **Generic audience:** Saying "modern users" or "businesses" without a concrete use context. -> Name
  the real audience and task.

## Example invocation

```text
Run brief-framing before creating this design system. Classify the surface, list what is still
missing, and ask only the blocking questions before any visual work.
```
