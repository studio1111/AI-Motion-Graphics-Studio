# AI Motion Graphics Studio

A curated agent-skill and Claude Code prompt toolkit for professional motion graphics.

## Start here
- `CLAUDE.md`: persistent production instructions.
- `prompts/CLAUDE_AUTONOMOUS_STUDIO_PROMPT.md`: autonomous Claude production prompt.
- `docs/MOTION_STYLE_BIBLE.md`: twelve distinct style families.
- `docs/MOTION_DESIGN_SYSTEM.md`: typography, color, motion, pacing, sound and accessibility.
- `docs/AUTONOMOUS_PRODUCTION_PIPELINE.md`: target state machine and quality gates.
- `prompts/STYLE_RECIPE_LIBRARY.md`: fourteen motion style prompt recipes.
- `docs/REFERENCE_PATTERN_MATRIX.md`: current 2026 reports, derived production rules and evidence limitations.
- `prompts/MOTION_GRAPHICS_MASTER_PROMPT.md`: general production master prompt.
- `prompts/REFERENCE_VIDEO_ANALYSIS_PROMPT.md`: reference analysis template.
- `docs/RESEARCH_AND_BENCHMARK_PLAN.md` and `research/REFERENCE_SEED_CATALOG.md`: 1,000-video target and source candidates.
- `docs/TOOLCHAIN_CATALOG.md`: installation, licensing, AI provider and cost caveats.

The repository has 26 general skills under `.agents/skills/` and five Claude Code project skills under `.claude/skills/`. The “Why is the sky blue?” sample was removed; the three-second `MotionDemo` is technical smoke-test infrastructure only.

## Research status
The catalog currently has 55 public video candidates, mostly metadata-only. Three recent external reports from one publisher describe 100 UI animation videos, 74 B2B tech demos and 95 enterprise AI launches. These article-level reports may overlap and are not counted as unique videos reviewed by this project. Their linked raw datasets returned HTTP 410. TubeLab and TubeAlfred searches returned HTTP 402 for insufficient credits. The 1,000-video study is **not complete**, and no full-video review is claimed.

## Runtime status
The executable project is a Remotion smoke test with a GitHub Actions validation/render pipeline. Fully unattended topic-to-final-video production is not yet verified. The workflow installs FFmpeg/FFprobe explicitly after an earlier run rendered the MP4 but could not run ffprobe. Pocket TTS and WhisperX are preferred/target routes only when the actual runtimes are installed and tested. Cloud models can cost money; confirm current pricing, schemas and rights before use.
