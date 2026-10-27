---
name: gsap-motion
description: Implement precise web-based motion with GSAP timelines, staggered sequences, SVG animation, and scroll-driven scenes. Use for browser-based motion prototypes, not as a replacement for a video renderer.
---

# GSAP Motion

## Implementation
- Verify the current GSAP package/API and licensing for the intended use before adding dependencies.
- Build one timeline per coherent sequence and use labels for semantic beats.
- Prefer explicit durations, easing, and stagger values over scattered independent animations.
- Animate transform and opacity where possible; profile expensive filters and layout-triggering properties.
- Scope selectors to the component and clean up timelines/listeners when the component unmounts.
- Respect reduced-motion preferences and provide a non-animated state.
- For video output, ensure the rendering path can deterministically seek to a specific time; do not assume ordinary browser playback timing is frame-accurate.

## Review
Check responsive layout, interrupted/reversed timelines, repeatability, console errors, and performance. Link to official docs: https://gsap.com/docs/
