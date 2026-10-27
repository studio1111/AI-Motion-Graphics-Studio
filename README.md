# AI Motion Graphics Studio

A curated Agent Skills toolkit for advanced cinematic motion graphics and AI-assisted video production.

## What is included

The repository currently contains **19 local skill guides** under `.agents/skills/`. They are valid local `SKILL.md` instruction files for compatible agent clients; they are not a claim that every underlying application, plugin, or rendering engine has been installed.

### Creative direction and design
- `cinematic-motion-design`: art direction, visual hierarchy, pacing, transitions
- `cinematic-storyboarding`: storyboard, shot list, beat sheet, continuity
- `kinetic-typography`: animated titles and type-led sequences
- `logo-brand-animation`: logo reveals and brand stingers
- `ai-visual-development`: image/video prompts and visual continuity
- `cinematography-shot-design`: lens, lighting, blocking, camera choreography

### Animation and scene construction
- `remotion-video-production`: frame-based React video workflow
- `gsap-motion`: timeline-driven web/SVG animation
- `hyperframes-motion`: HTML/CSS timeline scene workflow, integration to verify
- `threejs-webgl-motion`: real-time 3D and WebGL scenes
- `blender-3d-animation`: 3D modeling/animation/render workflow
- `svg-lottie-animation`: vector and Lottie animation
- `animated-infographics`: charts and data storytelling

### Finishing and delivery
- `audio-sound-design`: voice, music, sound effects and mix planning
- `color-grading-compositing`: color management and visual finishing
- `subtitles-accessibility`: captions, readability, multilingual and RTL checks
- `video-rendering-quality`: export settings and technical QC
- `motion-review`: creative and technical review
- `production-pipeline`: end-to-end production orchestration

## Install the official Remotion skills

The local Remotion guide is a workflow overview. To install the complete official Remotion skill package, including its linked reference/rule files, run this in the project workspace:

```bash
npx skills add remotion-dev/skills
```

Upstream: https://github.com/remotion-dev/skills  
Official documentation: https://www.remotion.dev/docs/ai/skills

Check the installer's target and the resulting diff before accepting changes. This repository's remote editing connector does not run shell commands, so the official package command has **not** been executed here.

## Compatibility and dependencies

- Skills are stored in `.agents/skills/<skill-name>/SKILL.md`.
- The agent must support Agent Skills or be configured to read `.agents/skills/`.
- Remotion, Node.js, GSAP, Blender, Three.js, FFmpeg, browser automation, fonts, plugins, and AI media services are separate runtime dependencies.
- HyperFrames is listed as a workflow guide only; its canonical upstream, licensing, and executable integration must be verified before claiming it is installed.

## Safety, licensing, and quality
- Inspect upstream source, license, dependencies, and scripts before installing.
- Check commercial-use terms for Remotion and every external asset, font, plugin, music track, model, or service.
- Do not execute downloaded scripts blindly.
- Keep credentials, generated media, caches, and large render files out of Git.
- Test a minimal preview/render and inspect the exported file before calling a workflow production-ready.

## Current status

Local skill guides have been committed. Underlying tools are not installed by these markdown files, and no render has yet been executed in this repository. The next validation step is to install the official Remotion skill package in a checkout, then create and render a minimal sample composition.
