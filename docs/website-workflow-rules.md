# eConstruct Website Workflow Rules

## Summary

This document is the canonical workflow spec for website work in this repo. It reconciles the prior local rules baseline with the current approved site state.

Use this document as the source of truth for planning, implementation, review, and launch. If another local instruction file conflicts with this document, this document wins.

## Imported Baseline Rules Reconciliation

The prior baseline came from the existing local architecture/rules file and is treated as the practical proxy for the attached PDF source during this pass.

| Imported rule | Decision | Reconciled rule |
| --- | --- | --- |
| React/Next.js App Router, Tailwind CSS, TypeScript, framer-motion | Adopt | Keep the current stack and continue building site features in the existing Next.js app structure. |
| Site must strictly be light mode | Adapt | The site is primarily light-surface, but approved dark sections are allowed and already part of the live direction. Dark above-the-fold treatments, dark heroes, dark footers, and dark content bands are valid when they improve hierarchy and brand presence. |
| Mobile-first with one-column mobile layout, hamburger nav, tap-to-call | Adopt | Mobile-first remains required. New pages must stack cleanly on small screens, keep touch targets usable, preserve the mobile menu pattern, and retain tap-to-call access where relevant. |
| Tone must be authoritative, empathetic, and precise | Adopt | Keep the current premium, confident, service-oriented voice. Avoid bargain language such as `cheap`, `budget`, or `affordable`. Emphasize quality, speed, trust, and ROI. |
| Every page must feature a consultation CTA immediately above the footer | Adapt | Every marketing page must end with a strong consultation CTA before the footer or use the shared pre-footer CTA pattern already established in the repo. Equivalent shared CTA implementations are acceptable. |
| Premium style, glassmorphism, fluid typography, WCAG 2.1 accessibility | Adopt | Maintain a premium visual system with intentional use of blur, layered surfaces, strong typography, and accessible contrast, focus, and semantics. Effects are optional; quality and legibility are mandatory. |
| Global tokens: white/off-white base, charcoal, gold, warm gray, navy, Playfair Display, Plus Jakarta Sans | Adapt | Keep the existing brand token family as the default palette and typography base, while allowing approved additions already used in the live site, including dark cinematic hero treatments and white logo variants on dark surfaces. |
| Images should live under public assets | Adopt | Keep assets in `public/` using stable, production-safe paths. Reuse shared assets and avoid scattering one-off files without a clear naming convention. |

## Brand and Design Rules

- Build for a premium residential construction audience. The site should feel precise, expensive, calm, and trustworthy.
- Preserve current approved site direction before reintroducing older visual constraints. The current dark hero and dark logo usage are intentional and should not be "corrected" back to a fully light-only site.
- Use the shared brand palette and typography unless a page has an approved reason to extend it.
- Avoid generic SaaS styling, noisy gradients, novelty animations, and decorative effects that reduce clarity.
- Motion should support hierarchy and polish, not gate visibility or delay important brand/UI elements.
- Logos, CTAs, and high-value trust elements must be visible on first paint whenever technically feasible.

## Copy and Content Rules

- Write with authority, empathy, and specificity.
- Position eConstruct around premium quality, speed, execution, resilience, and ROI.
- Avoid soft, filler-heavy copy and avoid discount-oriented language.
- Keep claims concrete. If a metric, timeline, or capability is presented, it should be supportable by existing site content or approved source material.
- Prefer page copy that helps a homeowner or high-intent client make a decision quickly: what eConstruct does, why it is credible, what the next step is.
- Every major marketing page must end in a consultation-oriented next step.

## Page Composition Rules

- New marketing pages should follow the existing page rhythm unless there is a strong approved reason to diverge: clear hero, proof/benefits, service or process detail, trust/portfolio content, and consultation CTA.
- Mobile-first composition is mandatory. Start with a strong small-screen stack, then scale up.
- Header behavior must preserve mobile navigation and tap-to-call behavior already present in the shared header pattern.
- Footer behavior must preserve the pre-footer consultation CTA pattern or an approved equivalent.
- Shared components should be preferred over page-local reinventions when an existing component already solves the pattern.

## Implementation Rules

- Explore first. Confirm the current implementation shape before making changes.
- Produce a decision-complete plan for substantial work before coding when the task is ambiguous, multi-step, or product-sensitive.
- Reconcile against the live repo, not against stale assumptions from older docs.
- Favor updates to shared components, tokens, and patterns when the change is meant to standardize the site.
- Keep agent-facing instructions concise and derivative. This document is the canonical source of truth.
- Avoid introducing new dependencies, patterns, or page-level abstractions unless they clearly improve maintainability or unlock a needed capability.

## QA and Review Rules

- Verify responsive behavior on mobile and desktop layouts.
- Confirm first-paint behavior for key brand and navigation elements when touching the header, hero, or logo.
- Review copy for tone consistency, specificity, and CTA clarity.
- Review accessibility basics on every meaningful UI change: contrast, keyboard access, semantic structure, focus visibility, and reduced-motion compatibility where animation is added.
- Validate that page endings still drive to consultation and do not strand the user.

## Launch Rules

- Before considering a website change complete, check implementation against the review checklist in `docs/website-review-checklist.md`.
- Prefer focused verification for touched areas at minimum: lint or static checks where applicable, route rendering, and manual UI confirmation of changed states.
- If a new rule conflicts with the approved live direction, record the exception here instead of silently overriding current product decisions.

## Standard Workflow

1. Explore the relevant components, routes, content, and current patterns.
2. Clarify user intent and success criteria.
3. Write a decision-complete plan for any non-trivial change.
4. Implement with preference for shared patterns and repo consistency.
5. Verify the changed behavior technically and visually.
6. Review against the checklist before closing the task.

## Current Site Exceptions

- Dark above-the-fold presentation is approved and should remain available.
- The shared header uses a dark translucent shell over the hero and is the correct current pattern.
- The logo system supports dark-surface usage and a first-paint-visible animated header variant; this is approved behavior, not a deviation to remove.
