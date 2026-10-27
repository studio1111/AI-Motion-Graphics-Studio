---
name: blender-3d-animation
description: Plan Blender-based 3D motion graphics, product visualization, procedural animation, lighting, compositing, and deterministic rendering.
---

# Blender 3D Animation

## Production workflow
1. Confirm Blender version, target engine (Eevee or Cycles), resolution, frame rate, duration, and output format.
2. Block camera, subject, scale, and timing before detailing.
3. Use procedural/modular geometry and named collections for scenes that need revisions.
4. Set keyframes and interpolation deliberately; use constraints/drivers only when they simplify control.
5. Establish color management and lighting before final materials.
6. Render low-cost previews before full-resolution frames.
7. Check render bounds, missing textures, fonts, caches, and external assets before batch rendering.
8. Composite and encode through a documented finishing pipeline.

## Quality and safety
- Keep scene files and dependencies reproducible.
- Do not overwrite source assets or existing renders without confirmation.
- Avoid expensive simulations until a low-resolution test proves the setup.
- Validate frame ranges, output paths, and disk capacity before batch jobs.
- Document Blender version and render settings. Official manual: https://docs.blender.org/manual/
