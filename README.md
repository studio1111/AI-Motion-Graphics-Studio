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

## Executable sample and CI validation

The Remotion project includes a 3-second smoke demo, a 90-second Persian science explainer, and a new 65-second Persian paper-cut film for side-by-side comparison:

- `AiCapabilitiesFilm` in `src/ai-capabilities.tsx` is a 65-second Persian paper-cut collage about AI capabilities, limitations, and human creativity. It uses layered paper shapes, cutout-style illustrations, animated typography, moving scraps, scene-specific palettes, and transitions. It is a visual-first comparison render: it does not yet include spoken narration or a music track, and uses procedural vector artwork rather than generated photographic footage.
- `SkyBlueFilm` in `src/sky-blue.tsx` explains why the sky looks blue and why sunsets turn warm, using animated Persian typography, a shifting color palette, moving light rays, atmospheric particles, and an original synthesized ambient score. The sample is text-led and does not yet include spoken narration or AI-generated photorealistic footage.
- Render it from a working checkout with `npx remotion render src/index.ts SkyBlueFilm out/why-is-the-sky-blue.mp4 --codec=h264`.
- `package.json` pins Remotion CLI/runtime to `4.0.539` and React to `19.1.0`.
- `src/index.ts` and `src/root.tsx` define the `MotionDemo` composition (1920×1080, 30 fps, 3 seconds).
- `scripts/validate-skills.mjs` checks skill frontmatter, directory/name consistency, unique names, and index coverage.
- `.github/workflows/validate-motion-studio.yml` runs the skill validator and renders an MP4 on pushes, pull requests, and manual dispatch. The render is uploaded as a short-lived workflow artifact.

The workflow has been added and GitHub Actions is running it. A successful commit or file upload is not proof that the render passed; check the Actions run and its `motion-studio-smoke-render` artifact before treating the runtime as verified.

The official Remotion skill repository is linked above, but it has no declared repository license in its GitHub metadata. To avoid redistributing upstream files without clear terms, this repository does not vendor its full skill tree. The 19 local guides remain original workflow guides, and the official package can be installed in a working checkout using `npx skills add remotion-dev/skills` after reviewing its current terms.
