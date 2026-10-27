---
name: production-pipeline
description: Coordinate an end-to-end motion graphics project from brief and assets through animation, audio, rendering, QA, and delivery.
---

# Production Pipeline

## Stages
1. Brief and acceptance criteria
2. Creative direction and storyboard
3. Asset inventory and rights check
4. Style frames and animatic
5. Animation and scene assembly
6. Sound and music
7. Preview review
8. Final render and encoding
9. Technical and creative QA
10. Packaging and delivery

## Production controls
- Track scene status, dependencies, render attempts, and known issues.
- Keep source files, fonts, plugins, and asset licenses documented.
- Use preview proxies or low-resolution renders for iteration.
- Do not start an expensive final render until the preview is approved.
- Never overwrite source media; use explicit output paths.
- Keep secrets, caches, and generated binaries out of version control.
- Report exact completed checks, not assumptions.

## Definition of done
The final file exists, opens, has expected dimensions/frame rate/duration/audio, passes representative-frame inspection, and is accompanied by reproducible project/source files where requested.
