# eConstruct 2.0 Architecture & Rules

## Tech Stack
- React/Next.js (App Router)
- Tailwind CSS
- TypeScript
- framer-motion

## Constraints
1. **No Dark Mode**: The site must strictly be light mode. Disable any default dark mode settings in Tailwind.
2. **Mobile-First**: Ensure a 1-column stacking mobile layout with a hamburger navigation and tap-to-call functionality.
3. **Tone**: Authoritative, empathetic, and precise. Never use words like "cheap," "budget," or "affordable." Focus on ROI, speed, and premium quality.
4. **CTAs**: Every page must feature a consultation CTA section immediately above the footer.
5. **Aesthetics**: Premium Style. Glassmorphism (blur/translucency), fluid typography, WCAG 2.1 accessibility. 

## Design System (Global Tokens)
- **Background**: `#FFFFFF` (Clean White)
- **Secondary Background**: `#F8F6F2` (Warm Off-White)
- **Brand Dark**: `#1C1C1E` (Deep Charcoal)
- **Accent Gold**: `#B8963E` (Warm Brass/Champagne Gold)
- **Body Text**: `#6B6B6B` (Warm Gray)
- **Badge Navy**: `#1A2744` (Deep Navy)
- **Heading Font**: Playfair Display (Weight: 700)
- **Body Font**: Plus Jakarta Sans (Weights: 400/500/600)

## Directory Structure & Assets
- Images are expected to be available at the application's root/public folder or `/home/user/workspace/econstruct-site/images/`. We'll use Next.js standard `/public/assets` and references.
