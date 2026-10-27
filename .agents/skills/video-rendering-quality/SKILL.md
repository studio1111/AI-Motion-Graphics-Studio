---
name: video-rendering-quality
description: Set up reproducible video rendering, FFmpeg finishing, color-safe exports, quality checks, and delivery packaging for motion graphics.
---

# Video Rendering and Quality

## Plan
- Confirm dimensions, aspect ratio, frame rate, duration, codec, pixel format, audio layout, alpha needs, and platform target.
- Use deterministic frame timing and keep a render manifest with tool versions and settings.
- Render a short representative section before the full sequence.
- Keep intermediate image sequences or mezzanine files when they materially improve reliability.

## Validate
- Check expected frame count and duration.
- Inspect first, middle, last, and high-motion frames.
- Detect black frames, frozen frames, dropped frames, clipping, flicker, text overflow, and audio sync errors.
- Probe final codec, frame rate, dimensions, audio streams, and color metadata.
- Re-open the final encoded file and confirm it plays.
- Keep generated media and caches out of Git unless specifically needed.

## FFmpeg
Use FFmpeg only after checking installed version and exact command options. Quote paths safely, avoid destructive overwrites unless explicitly intended, and write to a temporary output before replacing a deliverable. Official docs: https://ffmpeg.org/documentation.html
