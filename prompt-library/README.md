# Portable Motion Graphics Prompt Library

A standalone copy-and-paste prompt kit for any text AI assistant or creative/video tool. It is not locked to one model. The library contains **100 structured style recipes**, six foundational master prompts, ten advanced specialist master prompts, 15 shot-level templates and a nine-stage production workflow pack.

## What's inside

- `MASTER_PROMPT.md`: universal production director.
- `MASTER_PROMPT_PACK.md`: six foundational master prompts.
- `ADVANCED_MASTER_PROMPTS.md`: ten specialist masters for long-form films, brand identity, typography, data, text-to-video, image-to-video, sound/editing, code-based motion, prompt repair and final QC.
- `SCENE_PROMPT_TEMPLATES.md`: 15 modular shot templates, including continuity, transitions, evidence cards, data displays, image-to-video and deterministic rendering.
- `PRODUCTION_WORKFLOW_PACK.md`: nine sequential stage prompts, designed to coordinate work across an AI assistant and the actual tools available.
- `REFERENCE_ANALYSIS_WORKBOOK.md`: reusable evidence-level rubric and timing/observation matrix for studying references.
- `prompts.json`: 100 structured recipes for scripts and the CLI.
- `CATALOG.md`: detailed, human-readable index for every recipe.
- `index.html`: browser-based search, filter, prompt composition, copy and Markdown-download interface.
- `HOW_TO_USE.md`: cross-tool instructions.
- `../docs/PROMPT_MOTION_PATTERN_STUDY.md` and `../research/PROMPT_MOTION_SYNTHESIS_2026-10-28.md`: reference findings and limitations.
- `../scripts/prompt-library.mjs`: search, show and export commands.

## Persian quick start

For Persian step-by-step instructions, see [PERSIAN_QUICK_START.md](PERSIAN_QUICK_START.md).

## Browser interface

From the repository root, run `python -m http.server 8765` and open `http://localhost:8765/prompt-library/`. Search or filter the catalog, select one recipe, optionally add a specialist master prompt and a scene template, then copy the full prompt or download it as Markdown. The page uses local files and does not call an AI API. It must be served over HTTP rather than opened directly as `file://` because it fetches local prompt files.

## Fast use

```sh
npm run prompts:list
npm run prompts:search -- typography
npm run prompts:show -- motion-design-showreel
npm run prompts:show -- product-launch --format json
npm run prompts:export -- --category product-ui
npm run prompts:master
```

The `show` command composes the universal master prompt with the chosen recipe. The `export` command produces a portable bundle of prompts selected by category. You may copy the result to ChatGPT, Claude, Gemini or another capable assistant. The prompt itself does not create access to generation services, media, paid tools or APIs.

## Use a selected recipe in production

```sh
npm run produce -- --topic "A concept-led motion design showreel" --language en --duration 30 --prompt-recipe motion-design-showreel --plan-only --voice off
```

The production engine records the exact recipe in its artifacts and maps the recipe category to an implemented Remotion style preset when `--style auto` is used. A configured AI storyboard generator receives the selected recipe's motion, typography, palette, story-beat and anti-pattern guidance. The local fallback does not implement all 100 recipes' unique motion instructions; the manifest/QC report states that limitation rather than pretending the advanced effects were rendered.

## Recommended workflow

1. Define audience, purpose, runtime, aspect ratio, language and factual constraints.
2. Select one primary recipe, plus at most two supporting techniques.
3. Use the matching specialist master and request a timed storyboard before generating shots.
4. Specify one main action and one camera move per generative shot; for image-to-video, lock the original frame's identity/composition and describe only intended motion.
5. Render a representative proof, inspect actual frames and audio, then refine one or two verified defects at a time.
6. Place critical text, logos, citations, chart labels and captions with deterministic composition whenever possible.
7. Validate the final file and keep unreviewed visual/audio gates marked as NOT_RUN.

## Cross-tool boundaries

- **Text/chat AI:** research plan, script, storyboard, shot prompts, edit decision list and QC.
- **Image model:** keyframes and visual assets.
- **Text-to-video model:** a single shot with a specific action, camera path and temporal progression.
- **Image-to-video model:** controlled movement based on an input frame and explicit continuity locks.
- **Code renderer:** frame-indexed keyframes, layout, easing, transitions, typography and deterministic export.
- **Voice/music tools:** approved script or musical brief, pronunciation and mix requirements.

Use only capabilities actually available. Do not claim a render, video watch, paid tool call, repository audit or external skill installation unless that task occurred and was verified.

## Evidence and rights

Study source pages, prompts, videos and skills at the level actually available. A page description or sampled playback is not a full watch. Never inflate evidence levels. Extract high-level motion craft and build original treatments instead of copying creator prompts, shots, music, marks or assets without permission. Respect each site's terms; do not automate Pinterest scraping or bulk-copy/re-distribute FilmGrab frames.
