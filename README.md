# AI Motion Graphics Studio

A programmatic motion-graphics studio built on Remotion, with style presets, prompt/skill libraries, and an autonomous storyboard-to-render CLI.

## Start here
- `CLAUDE.md`: persistent project instructions.
- `docs/PRODUCTION_CLI.md`: real CLI workflow and configuration.
- `prompts/CLAUDE_AUTONOMOUS_STUDIO_PROMPT.md`: autonomous Claude production prompt.
- `prompts/MOTION_GRAPHICS_MASTER_PROMPT.md`: cross-role production director prompt.
- `prompts/PROFESSIONAL_PROMPT_PLAYBOOK.md`: original prompts for fourteen visual families, camera, motion, sound and repair.
- `docs/MOTION_STYLE_BIBLE.md`: twelve motion-design families.
- `docs/STYLE_PRESET_CATALOG.md`: concrete palettes, font roles, motion, sound and anti-patterns.
- `docs/MOTION_DESIGN_SYSTEM.md`: craft, rhythm, typography, sound and accessibility rules.
- `docs/AUTONOMOUS_PRODUCTION_PIPELINE.md`: stages, gates, and implementation status.
- `prompts/STYLE_RECIPE_LIBRARY.md`: fourteen scene prompt recipes.
- `docs/REFERENCE_PATTERN_MATRIX.md`: current article-level trend evidence and limitations.
- `docs/RESEARCH_AND_BENCHMARK_PLAN.md` and `research/REFERENCE_SEED_CATALOG.md`: 1,000-reference study plan and initial candidates.
- `docs/TOOLCHAIN_CATALOG.md`: tool, license, model and cost caveats.
- `docs/PROFESSIONAL_PRODUCTION_INTEGRATIONS.md`: provider roles, end-to-end production gates, cost/rights safeguards, QC rubric and the 1,000-video reference-study evidence standard.

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

The repository includes a data-driven MotionVideo composition with eleven layout modes, a local production CLI, optional Firecrawl research, optional Claude storyboard generation, optional Pocket TTS for its supported languages, a procedural music score with scene-synchronized transition sound cues, captions/SRT, Remotion rendering and FFprobe/FFmpeg technical checks. GitHub Actions runs the production tests and renders both the generic smoke test and the data-driven composition.

Technical QC verifies the media stream, full-file decode, sampled-frame extraction and a non-silent audio peak. It does not prove creative quality or sound-mix quality. Reports intentionally leave human visual review and audio listening as NOT_RUN. Font names are candidates, not proof the font files exist. Official Pocket TTS does not list Persian; it will not silently substitute an unrelated-language voice. Full 1,000-video visual analysis is still incomplete; the reference set contains candidates and article-level evidence, not a claim of 1,000 videos watched.

The former “Why is the sky blue?” example remains removed. MotionDemo is smoke-test infrastructure only.


## Local narration engines

The production workflow can now generate Persian/Farsi narration locally via `persian-speech` / Mana-Persian-Piper, and uses Pocket TTS for supported non-Persian languages. The Persian package lists its runtime/model distribution as MIT and its Mana-TTS corpus as CC0: [package](https://pypi.org/project/persian-speech/1.1.3/), [voice model](https://huggingface.co/MahtaFetrat/Mana-Persian-Piper), [dataset card](https://huggingface.co/datasets/MahtaFetrat/Mana-TTS). First synthesis downloads model weights; no weights are committed to the repository. The `generate_voice` option is enabled by default in the production workflow. WhisperX remains a future transcription route, not an installed dependency.


### Topic-aware local storyboards
When paid research/LLM access is not enabled, the local fallback now includes dedicated eight-scene conceptual storylines for city heat, artificial intelligence and solar energy in English and Persian. These are deliberately marked `conceptual_topic_template` and identify where real-world claims need sources; they are not a substitute for a researched factual script.
