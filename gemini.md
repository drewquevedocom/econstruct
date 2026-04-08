# eConstruct Agent Workflow Summary

`docs/website-workflow-rules.md` is the canonical source of truth for website workflow and review standards in this repo.

## Agent Rules

- Follow the canonical workflow rules document before relying on older local assumptions.
- Reconcile proposed work against the current approved site state, not against stale "light-only" constraints.
- Preserve the approved dark above-the-fold direction, shared header behavior, and shared logo system unless the user explicitly changes them.
- Keep copy authoritative, empathetic, precise, and premium.
- Preserve or add a consultation-oriented CTA near the end of marketing pages.
- Use the review checklist in `docs/website-review-checklist.md` when closing meaningful website changes.

## Current Implementation Anchors

- Stack: Next.js App Router, TypeScript, Tailwind CSS, framer-motion.
- Mobile-first behavior is required.
- Shared patterns should be preferred over page-local reinventions.
- Critical brand UI should remain visible on first paint when possible.
