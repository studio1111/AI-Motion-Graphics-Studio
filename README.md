# AI Motion Graphics Studio

A curated Agent Skills toolkit for advanced cinematic motion graphics and AI-assisted video production, focused on educational and documentary storytelling with the least practical user intervention.

## What is included

The repository contains **26 local skill guides** under `.agents/skills/`. These are original workflow instructions plus one attributed CC0 upstream skill; they are not a claim that every underlying application, plugin, or rendering engine has been installed.

### Creative direction and design
- `cinematic-motion-design`: art direction, hierarchy, pacing, transitions
- `cinematic-storyboarding`: storyboard, shot list, beat sheet, continuity
- `kinetic-typography`: animated titles and type-led sequences
- `logo-brand-animation`: logo reveals and brand stingers
- `ai-visual-development`: image/video prompts and visual continuity
- `cinematography-shot-design`: lens, lighting, blocking, camera choreography
- `motion-graphics-supervisor`: end-to-end production orchestration and review
- `story-driven-educational-documentary`: evidence-led documentary storytelling
- `motion-graphics-visual-systems`: visual grammar, scene variety, and transitions

### Animation and scene construction
- `remotion-video-production`: existing project workflow
- `remotion-video-agent`: adapted from an upstream CC0 skill with attribution
- `gsap-motion`: timeline-driven web/SVG animation
- `hyperframes-motion`: HTML/CSS timeline workflow, integration to verify
- `threejs-webgl-motion`: real-time 3D and WebGL scenes
- `blender-3d-animation`: 3D modeling/animation/render workflow
- `svg-lottie-animation`: vector and Lottie animation
- `animated-infographics`: charts and data storytelling

### Finishing, routing, and delivery
- `audio-sound-design`: voice, music, sound effects and mix planning
- `color-grading-compositing`: color management and visual finishing
- `subtitles-accessibility`: captions, readability, multilingual and RTL checks
- `video-rendering-quality`: export settings and technical QC
- `motion-review`: creative and technical review
- `production-pipeline`: end-to-end production orchestration
- `audio-first-narration-and-sound`: narration timing, music, mix, and captions
- `motion-render-quality-gates`: project, render, frame, audio, and delivery checks
- `ai-media-tool-routing`: schema-checked routing for optional video, speech, transcription, and audio models

## Master prompts, research, and toolchain catalog

- `prompts/MOTION_GRAPHICS_MASTER_PROMPT.md`: comprehensive production-team prompt.
- `prompts/REFERENCE_VIDEO_ANALYSIS_PROMPT.md`: timestamped craft-analysis template for public reference videos.
- `docs/RESEARCH_AND_BENCHMARK_PLAN.md`: stratified 1,000-video research plan with evidence levels and completion criteria.
- `docs/TOOLCHAIN_CATALOG.md`: core deterministic stack and optional AI model routes.

The research plan is not a claim that 1,000 videos have already been reviewed. The initial TubeLab research request returned HTTP 402, so the empirical study remains pending.

## Official Remotion skill package

The local Remotion guide is a workflow overview. To install the complete official Remotion skill package, including linked reference/rule files, run this in a working checkout:

```bash
npx skills add remotion-dev/skills
```

Upstream: https://github.com/remotion-dev/skills  
Official documentation: https://www.remotion.dev/docs/ai/skills

Inspect the installer's target and resulting diff before accepting changes. The remote GitHub editing connector cannot run shell commands, so the official package command has not been executed here. The upstream repository has no declared license in its GitHub metadata, so its files are not vendored into this repository.

## Compatibility and dependencies

- Skills are stored in `.agents/skills/<skill-name>/SKILL.md`.
- The agent must support Agent Skills or be configured to read `.agents/skills/`.
- Remotion, Node.js, GSAP, Blender, Three.js, FFmpeg, browser automation, fonts, plugins, and AI media services are separate runtime dependencies.
- HyperFrames remains a workflow guide only; its canonical upstream, licensing, and executable integration must be verified before claiming it is installed.
- Pocket TTS is the preferred local narration route when installed and suitable; WhisperX is the intended transcription route when installed. Confirm actual installation in a working checkout.
- Free/open-source and local tools should be preferred where they meet the quality bar. Cloud AI media endpoints can incur usage charges and must be checked before use.

## Executable smoke test and CI validation

The repository retains a 3-second generic studio bumper as a minimal Remotion smoke test. The former “Why is the sky blue?” sample composition and source file have been removed, as requested; the remaining bumper is infrastructure validation, not a production sample.

- `src/index.ts` and `src/root.tsx` define `MotionDemo` (1920×1080, 30 fps, 3 seconds).
- `package.json` pins Remotion CLI/runtime to `4.0.539` and React to `19.1.0`.
- `scripts/validate-skills.mjs` checks skill frontmatter, directory/name consistency, unique names, and index coverage.
- `.github/workflows/validate-motion-studio.yml` validates skills and renders an MP4 on pushes, pull requests, and manual dispatch.

A successful commit or file upload is not proof that the render passed. Inspect the latest Actions run and its `motion-studio-smoke-render` artifact before treating the runtime as verified.
