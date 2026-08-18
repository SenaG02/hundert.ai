# polish-phase.skill.md

## Name

Polish Phase

## Purpose

Refine a screen from "functional" to "premium" through microcopy, alignment, spacing,
button hierarchy, considered states, and subtle motion: without redesigning what already works.

## When to use

- After a direction or implementation exists and has passed basic audits.
- When a complete screen needs premium feel without structural redesign.
- Before final review / production handoff.
- For micro-interactions, empty states, loading states, and error states.

## Procedure

1. **Design-system discovery**: Confirm the relevant `DESIGN.md`, tokens, components, and local
   conventions before polishing. Name drift as one of: missing token, one-off implementation, or
   conceptual/flow misalignment.
2. **Pre-polish triage**: Confirm the screen is functionally complete enough to polish. Separate
   functional blockers from cosmetic details and prioritize blockers first.
3. **Microcopy & alignment**: Tighten labels and helper text; fix optical alignment and spacing.
4. **Information architecture & flow**: Make sure the shape of the experience matches neighboring
   patterns: modal vs full-page, progressive disclosure, save behavior, empty/loading arrival, and
   terminology.
5. **Micro-interactions & feedback**: Add subtle hover, focus, and active states using motion tokens
   (duration + easing). Ensure states communicate clearly (success, loading, error).
6. **Empty, loading & error states**: Helpful empty states (not just "no data"); intentional loading
   (skeletons or clear progress); calm, actionable error states that never blame the user.
7. **Visual rhythm & button hierarchy**: Refine vertical rhythm; make primary/secondary actions
   unmistakable.
8. **Page-load orchestration**: Consider the sequence elements appear; use staggered reveals only
   when they improve perceived performance; avoid layout shift.
9. **Premium details**: Subtle elevation/depth where appropriate; thoughtful icon usage and
   alignment; consistent treatment of secondary actions and metadata.
10. **Final cleanup**: Remove orphan styles, one-off values that should be tokens, duplicate
    patterns, debug copy, and states that drift from the design system.

## Output contract

Deliver a "polished" version that feels one level above the previous iteration. Document the specific
polish techniques applied (e.g., "added 150ms ease-out hover on the primary button using motion
tokens"). Do not redesign the whole screen.

## Failure modes

- **Premature polish:** Applying micro-interactions before IA and hierarchy are solid. -> Recommend `ui-audit` first.
- **Polish on drift:** Decorating a screen that is off-system. -> Resolve token/component/flow drift
  first.
- **Over-animation:** Motion that distracts or feels gimmicky. -> Keep motion purposeful and minimal.
- **Ignoring reduced motion:** Not respecting `prefers-reduced-motion`. -> Always provide a reduced-motion alternative.
- **Scope creep:** Turning polish into a redesign. -> Refine, do not rebuild.

## Example invocation

```text
Run polish-phase on the approved hero. Refine microcopy, button hierarchy, and add subtle motion
with the motion tokens: keep the structure identical and list what you changed.
```
