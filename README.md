# AI Motion Graphics Studio

A curated agent-skill and Claude Code prompt toolkit for professional motion graphics.

## Start here
- `CLAUDE.md`: persistent production instructions.
- `prompts/CLAUDE_AUTONOMOUS_STUDIO_PROMPT.md`: autonomous Claude production prompt.
- `docs/MOTION_STYLE_BIBLE.md`: twelve distinct style families.
- `docs/STYLE_PRESET_CATALOG.md`: twelve concrete presets with palette tokens, font-role candidates, motion grammar, pacing, sound and anti-patterns.
- `docs/MOTION_DESIGN_SYSTEM.md`: typography, color, motion, pacing, sound and accessibility.
- `docs/AUTONOMOUS_PRODUCTION_PIPELINE.md`: target production state machine and quality gates.
- `prompts/STYLE_RECIPE_LIBRARY.md`: fourteen scene-prompt recipes and modifiers.
- `docs/REFERENCE_PATTERN_MATRIX.md`: 2026 article-level findings and evidence limitations.
- `prompts/MOTION_GRAPHICS_MASTER_PROMPT.md`: general production master prompt.
- `prompts/REFERENCE_VIDEO_ANALYSIS_PROMPT.md`: reference analysis template.
- `docs/RESEARCH_AND_BENCHMARK_PLAN.md` and `research/REFERENCE_SEED_CATALOG.md`: benchmark target and public video candidates.
- `docs/TOOLCHAIN_CATALOG.md`: tool, license, model and cost notes.

The repository contains 26 general skills under `.agents/skills/` and five Claude Code project skills under `.claude/skills/`. The former “Why is the sky blue?” example remains removed. The three-second `MotionDemo` is technical smoke-test infrastructure only.

## Research status
The catalog has 55 public video candidates, mainly metadata-only. Three recent article-level studies describe 100 UI animation videos, 74 B2B tech demos and 95 enterprise AI launches. They come from one publisher, may overlap and are not counted as videos reviewed by this project. Their linked raw datasets returned HTTP 410. TubeLab and TubeAlfred attempts returned HTTP 402. The 1,000-video visual study is **not complete**, and no full-video reviews are claimed.

## Runtime status
The executable project remains a Remotion smoke-test pipeline. Fully unattended topic-to-final-video generation is not yet verified. The latest confirmed Actions run validated both skill catalogs, rendered the smoke-test MP4, installed FFmpeg/FFprobe, verified the MP4 metadata and uploaded an artifact.

Pocket TTS and WhisperX are target/preferred routes only when their actual runtimes are installed and tested. Cloud providers may incur charges; confirm current pricing, schemas, limits and usage rights before use.
