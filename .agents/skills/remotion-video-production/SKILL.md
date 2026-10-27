---
name: remotion-video-production
description: Build frame-accurate, repeatable videos with React and Remotion, including compositions, transitions, animated text, media, audio, captions, and render validation.
---

# Remotion Video Production

## Upstream
Official Remotion agent skills: https://github.com/remotion-dev/skills
Official docs: https://www.remotion.dev/docs/ai/skills

For the complete official skill set and its referenced rule files, install it in the consuming workspace using `npx skills add remotion-dev/skills`. This local skill is a workflow guide, not a byte-for-byte copy of the upstream distribution.

## Workflow
1. Inspect the existing project and preserve user changes.
2. If no project exists, use the official creation workflow and verify package compatibility.
3. Define composition ID, dimensions, FPS, duration, props, and asset locations explicitly.
4. Use frame/time-based APIs such as `useCurrentFrame()` and `useVideoConfig()`; do not rely on wall-clock CSS animation for render timing.
5. Use interpolation/spring helpers with intentional easing and clamp ranges when appropriate.
6. Sequence scenes and transitions so their frame counts and overlaps produce the intended total duration.
7. Use supported media components and static asset helpers; wait for asynchronous assets before rendering.
8. Start the Studio preview and inspect it before editing or rendering where the environment allows.
9. Render only when requested, then inspect the exported file and verify duration, dimensions, FPS, audio, and representative frames.

## Quality rules
- Avoid unnecessary per-frame React work and expensive effects.
- Keep fonts, images, audio, and video paths reproducible.
- Avoid invalid frame math, negative durations, missing assets, and unbounded interpolation.
- Check text fit, RTL shaping, caption timing, and visual continuity.
- Verify current Remotion licensing and commercial-use terms before deployment.
