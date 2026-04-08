# Website Review Checklist

Use this checklist for any meaningful website change before considering it complete.

## Planning

- The goal and success criteria are clear.
- The current implementation was inspected before edits.
- The chosen approach matches the existing site direction and shared patterns.
- If the change is substantial, a decision-complete plan exists.

## Implementation

- Shared components or tokens were reused where appropriate.
- The change does not silently conflict with `docs/website-workflow-rules.md`.
- Mobile-first layout behavior was considered from the start.
- Any new animation does not hide critical UI on first paint.

## Visual QA

- The page looks intentional on desktop and mobile.
- Spacing, typography, and color hierarchy match the premium brand direction.
- Effects such as blur, glow, gradients, and motion support the design instead of overwhelming it.
- Dark sections, if used, feel deliberate and consistent with the approved live site.

## Copy QA

- Copy is authoritative, empathetic, and precise.
- Copy avoids bargain-language terms such as `cheap`, `budget`, and `affordable`.
- Claims are specific and supportable.
- The page clearly drives the user toward a consultation or equivalent high-intent next step.

## Responsive and Accessibility QA

- Mobile navigation and tap targets remain usable.
- Touch, keyboard, and focus states still work.
- Contrast is acceptable for the changed UI.
- Reduced-motion expectations are respected where animation is present.
- Images, icons, and media still have appropriate accessibility treatment.

## Verification

- Relevant lint or static checks were run when practical.
- The changed route or component still renders successfully.
- First-paint-critical UI was spot-checked if header, hero, CTA, or logo behavior changed.
- The footer or pre-footer consultation CTA pattern is still present on marketing pages.

## Launch Readiness

- Any intentional exception to the workflow rules is documented.
- The final change summary states what changed, what was verified, and any remaining risks.
