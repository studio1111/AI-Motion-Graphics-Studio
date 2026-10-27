# Agent Skills Index

26 general skill guides live in `.agents/skills/<name>/SKILL.md`. Skills are instructions, not proof their underlying programs are installed.

## Creative direction and design
- `cinematic-motion-design`
- `cinematic-storyboarding`
- `kinetic-typography`
- `logo-brand-animation`
- `ai-visual-development`
- `cinematography-shot-design`
- `motion-graphics-supervisor`
- `story-driven-educational-documentary`
- `motion-graphics-visual-systems`

## Animation and scene construction
- `remotion-video-production`
- `remotion-video-agent` (adapted from upstream CC0 skill with attribution)
- `gsap-motion`
- `hyperframes-motion` (guide only, integration unverified)
- `threejs-webgl-motion`
- `blender-3d-animation`
- `svg-lottie-animation`
- `animated-infographics`

## Finishing and delivery
- `audio-sound-design`
- `color-grading-compositing`
- `subtitles-accessibility`
- `video-rendering-quality`
- `motion-review`
- `production-pipeline`
- `audio-first-narration-and-sound`
- `motion-render-quality-gates`
- `ai-media-tool-routing`

## Production docs
- `prompts/MOTION_GRAPHICS_MASTER_PROMPT.md`
- `prompts/CLAUDE_AUTONOMOUS_STUDIO_PROMPT.md`
- `prompts/REFERENCE_VIDEO_ANALYSIS_PROMPT.md`
- `prompts/STYLE_RECIPE_LIBRARY.md`
- `docs/MOTION_STYLE_BIBLE.md`
- `docs/MOTION_DESIGN_SYSTEM.md`
- `docs/AUTONOMOUS_PRODUCTION_PIPELINE.md`
- `docs/RESEARCH_AND_BENCHMARK_PLAN.md`
- `research/REFERENCE_SEED_CATALOG.md`
- `docs/TOOLCHAIN_CATALOG.md`

Claude Code-specific skills are under `.claude/skills/`, with a separate index in `.claude/skills/README.md`.

The complete official Remotion package is documented at https://www.remotion.dev/docs/ai/skills; the remote editor did not run `npx skills add remotion-dev/skills`. The upstream repository's licensing metadata was unclear, so its files were not copied.

Current status: the 1,000-video study remains incomplete; current seed links contain metadata/article-level evidence only. The updated CI workflow must pass before runtime checks can be described as verified.
