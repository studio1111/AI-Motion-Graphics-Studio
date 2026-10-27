---
name: threejs-webgl-motion
description: Plan and implement real-time 3D scenes and WebGL motion graphics using Three.js or React Three Fiber, including camera choreography, materials, particles, and post-processing.
---

# Three.js / WebGL Motion

## Scene plan
- Define scene scale, camera lens/FOV, key subject, background, lighting model, and animation duration.
- Use a small number of purposeful lights and a consistent material response.
- Separate scene, camera, lighting, materials, animation, and post-processing into maintainable modules.
- Animate from absolute time or deterministic frame state when rendering video.
- Choose geometry and particle counts with a target-device performance budget.

## Cinematic checklist
- Compose with foreground, subject, and background depth.
- Use a motivated camera path with easing and controlled acceleration.
- Keep motion blur and bloom restrained; protect highlight detail.
- Use physically plausible scale and light unless the art direction intentionally stylizes them.
- Handle color management, tone mapping, shadows, and transparent output deliberately.
- Provide fallbacks for unsupported WebGL and clean up GPU resources.

## Render validation
Inspect silhouettes, temporal flicker, clipping, aliasing, color shifts, and performance at the target resolution. Official documentation: https://threejs.org/docs/
