---
name: remotion-video-agent
description: Use when creating or editing Remotion videos, programmatic explainers, motion graphics, MP4 renders, GIF renders, social cutdowns, or React-authored video templates.
---

# Remotion Video Agent

## Workflow
1. Confirm composition format: aspect ratio, duration, FPS, destination, and voice/music requirements.
2. Break the video into scenes with frame ranges.
3. Build scenes as React components with deterministic timing.
4. Use Remotion helpers for interpolation, sequencing, audio, static files, and rendering.
5. Prefer MP4 for delivery. Use GIF only for previews or documentation.
6. Render and inspect before final delivery.

## Useful defaults
- 30 FPS for general video.
- 60 FPS only when motion quality requires it.
- 1080x1920 for vertical social.
- 1920x1080 for YouTube and landscape delivery.

## Quality checks
- No text is cut off.
- No unintended dead air or empty scene intervals.
- Motion supports the script.
- Assets are licensed or owned.
- Audio levels do not clip.
- GIF exports are size-conscious.

## Integration with this project
Use this skill together with motion-graphics-supervisor, story-driven-educational-documentary, motion-graphics-visual-systems, and motion-render-quality-gates. Prefer the project's existing Remotion version and composition setup; do not upgrade dependencies mid-production without inspecting the complete diff and rerunning validation.

## Upstream and license
Adapted from the CC0-licensed skill in frankxai/awesome-motion-design-agent-skills:
https://github.com/frankxai/awesome-motion-design-agent-skills/blob/main/skills/remotion-video-agent/SKILL.md
Upstream license: CC0 1.0 Universal, as present in the upstream LICENSE file. This local file includes project-specific integration guidance.
