---
name: hyperframes-motion
description: Plan HTML/CSS/GSAP-based video scenes and timeline-driven motion graphics with a deterministic browser-rendering pipeline.
---

# HyperFrames Motion Workflow

## Upstream verification
Before adopting HyperFrames, confirm its canonical repository, current install instructions, supported timeline schema, renderer, and license. Do not assume a package name or command based only on a mention in a blog post.

## Scene workflow
- Break the video into scenes with explicit start/end times and aspect ratio.
- Build accessible, well-structured HTML and style it with design tokens.
- Drive animation from the renderer's timeline or frame clock; ordinary infinite CSS animations may not seek deterministically.
- Use SVG for crisp vector shapes and typography when appropriate.
- Preload fonts and media; do not let late asset loading change frame output.
- Keep visual transitions consistent and test scene boundaries for flashes or gaps.
- Verify the export with a real render and inspect frame timing, audio sync, and final encoding.

## Use cases
Explainers, kinetic typography, product promos, UI walkthroughs, title cards, and layered graphic scenes.

This skill describes a safe workflow; it does not install HyperFrames or assert a tested integration.
