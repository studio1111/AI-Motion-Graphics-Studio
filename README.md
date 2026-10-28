# AI Motion Graphics Studio

A programmatic motion-graphics studio built on Remotion, with style presets, prompt/skill libraries, and an autonomous storyboard-to-render CLI.

## Start here
- `CLAUDE.md`: persistent project instructions.
- `docs/PRODUCTION_CLI.md`: real CLI workflow and configuration.
- `prompts/CLAUDE_AUTONOMOUS_STUDIO_PROMPT.md`: autonomous Claude production prompt.
- `prompts/MOTION_GRAPHICS_MASTER_PROMPT.md`: cross-role production director prompt.
- `prompts/PROFESSIONAL_PROMPT_PLAYBOOK.md`: original prompts for fourteen visual families, camera, motion, sound and repair.
- `research/references.jsonl` and `docs/REFERENCE_PROGRESS.json`: evidence-aware reference catalog and 1,000-video study progress. Run `npm run research:catalog` to refresh the report.
- `docs/REFERENCE_SOURCE_REGISTRY.md`: prioritized reference workflow led by Prompt Motion, plus ShotBook, Genery, Motion in Design, FilmGrab and Pinterest.
- `docs/MOTION_STYLE_BIBLE.md`: twelve motion-design families.
- `docs/STYLE_PRESET_CATALOG.md`: concrete palettes, font roles, motion, sound and anti-patterns.
- `docs/MOTION_DESIGN_SYSTEM.md`: craft, rhythm, typography, sound and accessibility rules.
- `docs/AUTONOMOUS_PRODUCTION_PIPELINE.md`: stages, gates, and implementation status.
- `prompts/STYLE_RECIPE_LIBRARY.md`: fourteen scene prompt recipes.
- `prompt-library/`: standalone, tool-agnostic prompt suite with 96 style recipes, six foundational and ten advanced master prompts, 15 scene templates, a 9-stage workflow pack, browser UI and copy-ready CLI.
- `docs/REFERENCE_PATTERN_MATRIX.md`: current article-level trend evidence and limitations.
- `prompt-library/REFERENCE_ANALYSIS_WORKBOOK.md`: repeatable evidence-aware rubric for analyzing reference pages and videos.
- `prompt-library/index.html`: browser interface to search/filter styles, compose a master prompt with a specialist/scene module, copy it, or download Markdown.
- `prompt-library/PERSIAN_QUICK_START.md`: راهنمای فارسی استفاده از کتابخانهٔ مستقل پرامپت‌ها.
- `prompt-library/PRODUCTION_WORKFLOW_PACK.md`: copy-ready prompts for story, storyboard, motion, typography, audio, rendering and quality repair.
- `prompt-library/ADVANCED_MASTER_PROMPTS.md`: ten detailed specialist directors for documentary, product, typography, data, T2V, I2V, audio, code, repair and QC.
- `prompt-library/SCENE_PROMPT_TEMPLATES.md`: 15 reusable shot-level prompt templates.
- `docs/PROMPT_MOTION_PATTERN_STUDY.md`: cross-tool motion patterns and honest evidence limits.
- `research/PROMPT_MOTION_SYNTHESIS_2026-10-28.md`: source-linked lessons from Prompt Motion research pages.
- `docs/RESEARCH_AND_BENCHMARK_PLAN.md` and `research/REFERENCE_SEED_CATALOG.md`: 1,000-reference study plan and initial candidates.
- `docs/TOOLCHAIN_CATALOG.md`: tool, license, model and cost caveats.
- `docs/PROFESSIONAL_PRODUCTION_INTEGRATIONS.md`: provider roles, end-to-end production gates, cost/rights safeguards, QC rubric and the 1,000-video reference-study evidence standard.
- `docs/AUDIO_PRODUCTION_PIPELINE.md`: Persian narration normalization, voice fades, smooth music ducking, two-pass loudness mastering, optional ACE-Step 1.5 API integration, and voice/model licensing notes.

## Portable prompt library

### Browser prompt builder

From the repository root, run `python -m http.server 8765`, then open `http://localhost:8765/prompt-library/` in a browser. The page loads the local recipe library, lets you search and filter styles, select an optional specialist master prompt and scene-level template, and copy or download the assembled prompt. If opened directly as a `file://` URL, browser fetch restrictions may block the data files, so serve the folder over HTTP.


Use the built-in prompt library with any AI assistant or creative tool:

    npm run prompts:list
    npm run prompts:search -- typography
    npm run prompts:show -- kinetic-type
    npm run prompts:show -- product-launch --format json
    npm run prompts:master
    npm run prompts:export -- --category product-ui

The `show` command combines the universal master prompt with the selected style recipe. The `export` command creates a self-contained Markdown or JSON bundle, optionally filtered by style category, for transfer into another AI environment. It provides instructions only; available generation, browsing, voice and rendering capabilities depend on the AI/tools you use.

## Use a style recipe in the production engine

List available recipe IDs with `npm run prompts:list`, then let the storyboarding pipeline use one of the 96 recipes:

```sh
npm run produce -- --topic "An idea worth explaining" --language en --duration 30 --style auto --prompt-recipe motion-design-showreel --plan-only
```

The selected recipe is recorded in the run's brief, storyboard, manifest, and QC report. With configured AI storyboard generation, its motion, typography, palette, sound, story-beat and anti-pattern directions are passed to the planner. The local fallback maps the recipe category to a supported preset and explicitly reports that advanced recipe-specific effects are not fully implemented by the fallback renderer.

## Running the production engine

Local install and validation:

    npm install
    npx remotion browser ensure
    npm run validate

Build and render a 90-second video (the CLI accepts 5 seconds to 60 minutes; long-form rendering requires a valid topic-specific storyboard):

    npm run produce -- --topic "Why do cities get warmer?" --language en --duration 90 --style auto --aspect-ratio 16:9

Set `--language` to `fa`, `en`, `de`, `es`, `fr`, `it`, `pt` or `nl`. The local fallback provides a localized eight-scene conceptual template for each of these languages; it does not invent factual statistics and is not a researched script. To generate a topic-specific storyboard with configured services, set ANTHROPIC_API_KEY and/or FIRECRAWL_API_KEY, then explicitly pass --allow-paid-ai. This switch can incur provider charges. Secrets alone do not enable those APIs.

GitHub Actions has a production workflow: open Actions, choose Produce Motion Graphics Video, enter the topic and format, keep paid AI disabled unless authorized, then run the workflow. Generated video and manifests are uploaded as a short-lived artifact.

## Runtime status and limitations

The repository includes a data-driven MotionVideo composition with eleven layout modes, a local production CLI, optional Firecrawl research, optional Claude storyboard generation, a privacy-preserving local Persian Piper voice plus an explicitly selected online Edge neural voice profile, Pocket TTS for supported languages, a richer procedural score or optional self-hosted ACE-Step 1.5 soundtrack, speech-aware music ducking, per-clip speech restoration, two-pass EBU R128 audio mastering, captions/SRT, Remotion rendering and FFprobe/FFmpeg technical checks. GitHub Actions runs the production tests and renders both the generic smoke test and the data-driven composition.

Technical QC verifies the media stream, full-file decode, sampled-frame extraction and a non-silent audio peak. It does not prove creative quality or sound-mix quality. Reports intentionally leave human visual review and audio listening as NOT_RUN. Font names are candidates, not proof the font files exist. Official Pocket TTS does not list Persian; it will not silently substitute an unrelated-language voice. Full 1,000-video visual analysis is still incomplete; the reference set contains candidates and article-level evidence, not a claim of 1,000 videos watched.

The former “Why is the sky blue?” example remains removed. MotionDemo is smoke-test infrastructure only.


## Local narration engines

The production workflow can now generate Persian/Farsi narration locally via `persian-speech` / Mana-Persian-Piper, and uses Pocket TTS for supported non-Persian languages. The Persian package lists its runtime/model distribution as MIT and its Mana-TTS corpus as CC0: [package](https://pypi.org/project/persian-speech/1.1.3/), [voice model](https://huggingface.co/MahtaFetrat/Mana-Persian-Piper), [dataset card](https://huggingface.co/datasets/MahtaFetrat/Mana-TTS). First synthesis downloads model weights; no weights are committed to the repository. The `generate_voice` option is enabled by default in the production workflow. WhisperX remains a future transcription route, not an installed dependency.


### Topic-aware local storyboards
When paid research/LLM access is not enabled, the local fallback now includes dedicated eight-scene conceptual storylines for city heat, artificial intelligence and solar energy in English and Persian. These are deliberately marked `conceptual_topic_template` and identify where real-world claims need sources; they are not a substitute for a researched factual script.
