# Portable Motion Graphics Prompt Library

A standalone, tool-agnostic prompt kit for text AI assistants, image/video generation tools and code-based motion renderers. The library gives a model creative direction and a repeatable production workflow; it does not grant capabilities or activate provider integrations.

## Contents
- `MASTER_PROMPT.md`: universal end-to-end motion-graphics director.
- `MASTER_PROMPT_PACK.md`: six foundational specialist master prompts.
- `ADVANCED_MASTER_PROMPTS.md`: ten specialist prompts for long-form films, brand identity, kinetic typography, data, text-to-video, image-to-video, sound, code rendering, revision and QC.
- `SCENE_PROMPT_TEMPLATES.md`: 15 modular scene templates, including motion-only prompts, transition design, data visualization, product UI, evidence cards, continuity handoffs and deterministic rendering.
- `prompts.json`: 77 structured style recipes used by the CLI.
- `CATALOG.md`: browse the style families.
- `HOW_TO_USE.md`: practical workflow and adaptation guidance.
- `../scripts/prompt-library.mjs`: copy-ready text and JSON output.
- `../docs/PROMPT_MOTION_PATTERN_STUDY.md`: evidence-aware reference study and original production adaptations.

## Fast use

```sh
npm run prompts:list
npm run prompts:search -- typography
npm run prompts:show -- kinetic-type
npm run prompts:show -- motion-design-showreel
npm run prompts:show -- product-launch --format json
npm run prompts:master
```

The `show` command composes the universal master prompt with a selected style recipe. You can copy the output into another AI or creative tool. For specialized tasks, copy the relevant section from `ADVANCED_MASTER_PROMPTS.md`, then add one of the scene templates as appropriate.

## Recommended workflow

1. Define the audience, one-sentence promise, platform, runtime and factual constraints.
2. Select one lead style recipe and at most two complementary influences.
3. Ask for a timed storyboard before generating; each shot must have a purpose, an action, a camera path, a transition, exact text and a sound cue.
4. Generate one representative shot first. Keep subject, product geometry, palette, lighting and typography consistent.
5. Iterate one or two variables at a time. Diagnose the actual failure rather than adding adjectives at random.
6. Put essential text, logos, chart labels and subtitles into a deterministic compositor when possible.
7. Render and inspect proof frames, full duration, audio and captions before calling the result finished.

## Cross-tool boundaries

- **Text/chat AI:** concept, research plan, script, shot list, prompts, edit decision list and QA rubric.
- **Image model:** one designed keyframe or asset per prompt.
- **Text-to-video model:** one clear subject action and camera move with temporal progression.
- **Image-to-video model:** preserve the supplied image's fixed composition and direct only the intended motion.
- **Code renderer:** translate approved beats into frame ranges, layers, easing, transitions, sound and validation.
- **Voice/music tools:** supply an approved script or music brief separately and confirm the tool is actually available.

A model may not support every requested operation. Never claim the library produced a render, watched a source video, enabled a paid feature or installed a third-party skill. Provider capabilities, licenses, costs and limits must be checked separately.

## Research integrity

Reference entries record what was actually inspected. A source-page review is not a full-video review. Do not mark a clip as watched or timestamp-analyzed unless that review happened. Extract high-level techniques and develop original visual sequences; do not copy full creator prompts, shots, music, logos or assets without permission. Do not scrape Pinterest or bulk-download/redistribute FilmGrab frames.

## Recipe schema

Every recipe has a stable ID, category, duration, visual language, motion grammar, typography, color system, sound design, story beats, anti-patterns and adaptation notes. The prompts are production instructions, not guarantees that every model or renderer will support every effect.
