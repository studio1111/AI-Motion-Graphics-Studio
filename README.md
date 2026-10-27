# AI Motion Graphics Studio

A curated agent skill and Claude Code prompt toolkit for professional motion graphics.

## Start here
- `CLAUDE.md`: persistent production instructions.
- `prompts/CLAUDE_AUTONOMOUS_STUDIO_PROMPT.md`: autonomous Claude production prompt.
- `docs/MOTION_STYLE_BIBLE.md`: twelve distinct style families.
- `docs/MOTION_DESIGN_SYSTEM.md`: typography, color, motion, pacing, sound and accessibility.
- `docs/AUTONOMOUS_PRODUCTION_PIPELINE.md`: target state machine and quality gates.
- `prompts/STYLE_RECIPE_LIBRARY.md`: fourteen motion style prompt recipes.
- `prompts/MOTION_GRAPHICS_MASTER_PROMPT.md`: general production master prompt.
- `prompts/REFERENCE_VIDEO_ANALYSIS_PROMPT.md`: public reference analysis.
- `docs/RESEARCH_AND_BENCHMARK_PLAN.md` and `research/REFERENCE_SEED_CATALOG.md`: evidence plan and starter sources.
- `docs/TOOLCHAIN_CATALOG.md`: installation, licensing and model caveats.

The repository has 26 general skills in `.agents/skills/` and five Claude Code project skills in `.claude/skills/`. The former “Why is the sky blue?” example was removed; the three-second `MotionDemo` is only a smoke test.

## Research status
The target of 1,000 unique video references is not complete. Firecrawl search returned a few seeds; TubeLab and TubeAlfred attempts returned HTTP 402 for insufficient credits. Current records are at metadata/article level only; no full-video reviews are claimed.

## Runtime status
The executable project remains a Remotion smoke test. Fully unattended topic-to-final-video production has not yet been verified. The GitHub Actions workflow has been updated to install FFmpeg/FFprobe, because a previous run rendered the MP4 but could not run ffprobe. Pocket TTS and WhisperX are preferred paths only when their runtimes are installed and tested. Cloud models can cost money; check live pricing, schemas and rights before use.
