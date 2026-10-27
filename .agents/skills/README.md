# Agent Skills Index

Skills are stored in `.agents/skills/<skill-name>/SKILL.md`. The repository currently contains 26 local skill guides. These are agent instructions, not proof that every external application or service is installed.

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
- `remotion-video-agent` (adapted from upstream CC0 skill; attribution retained)
- `gsap-motion`
- `hyperframes-motion` (workflow guide; upstream integration not yet verified)
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

## Master prompts and research
- `prompts/MOTION_GRAPHICS_MASTER_PROMPT.md`: full production-team prompt
- `prompts/REFERENCE_VIDEO_ANALYSIS_PROMPT.md`: timestamped reference craft analysis
- `docs/RESEARCH_AND_BENCHMARK_PLAN.md`: 1,000-video research target, sampling quotas, evidence levels, and completion criteria
- `docs/TOOLCHAIN_CATALOG.md`: deterministic tools, optional AI media routes, and installation caveats

## Official Remotion skill package
Source: https://github.com/remotion-dev/skills  
Install complete official package from a working checkout with:

```bash
npx skills add remotion-dev/skills
```

The local Remotion guides are not a substitute for all upstream reference files. The command has not been executed from the remote GitHub editor. The upstream repository has no declared license in GitHub repository metadata, so its files are not copied into this repository.

## Validation status
- [x] Added six original production/routing skills and two master prompts.
- [x] Added one upstream CC0 Remotion skill with attribution.
- [x] Added toolchain catalog and documented 1,000-video research plan.
- [ ] Run skill validator and inspect CI results after the index update.
- [ ] Inspect representative rendered frames and confirm visual output.
- [ ] Complete the 1,000-video research study; current TubeLab research provider returned HTTP 402.

Do not mark an underlying tool as installed merely because a local skill guide describes it. A committed workflow is not equivalent to a passing CI run.
