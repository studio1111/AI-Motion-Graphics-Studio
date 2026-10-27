# Agent Skills Index

Skills are stored in `.agents/skills/<skill-name>/SKILL.md`. The repository currently contains 19 local skill guides.

## Creative direction and design
- `cinematic-motion-design`
- `cinematic-storyboarding`
- `kinetic-typography`
- `logo-brand-animation`
- `ai-visual-development`
- `cinematography-shot-design`

## Animation and scene construction
- `remotion-video-production`
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

## Official Remotion skill package

Source: https://github.com/remotion-dev/skills  
Install complete official package from a checkout with:

```bash
npx skills add remotion-dev/skills
```

The local `remotion-video-production` guide is not a substitute for all upstream reference files. The command has not been executed from the remote GitHub editor.

## Validation status
- [x] Verified official Remotion skills source and current skill tree.
- [x] Confirmed the upstream repository does not declare a license in GitHub repository metadata; upstream files are not copied into this repo.
- [x] Added a pinned Remotion sample composition and automated skill-structure validator.
- [x] Added GitHub Actions jobs to validate skill files and render/inspect a sample MP4.
- [ ] Wait for the first CI run to finish and inspect its result/artifact.
- [ ] Inspect representative rendered frames and confirm visual output.

Do not mark an underlying tool as installed merely because a local skill guide describes it. CI configuration being committed is not equivalent to a passing CI run.
