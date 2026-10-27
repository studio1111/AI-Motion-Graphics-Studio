# Motion Graphics Toolchain Catalog

Last reviewed: 2026-10-27. Listing a tool here does not mean it is installed, free, configured or licensed for every use.

## Deterministic core
- Remotion: frame-accurate React composition; versions are pinned in `package.json`.
- FFmpeg/FFprobe: media processing and verification; CI explicitly installs FFmpeg.
- SVG/HTML/CSS/GSAP: precise typography, vector animation, charts, diagrams, labels and timing.
- Three.js/Blender: true 3D when the runtime and rendering budget justify it.
- Lottie/dotLottie and Rive: reusable assets when formats and runtime fit.
- Cavalry: procedural 2D motion application, separate from Agent Skills.

## Claude Code integration
- Claude project skills use `.claude/skills/<skill-name>/SKILL.md`, separate from `.agents/skills/`.
- Official skill overview: https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview
- Official prompt guidance: https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices
- Persistent instructions: `CLAUDE.md`; orchestration prompt: `prompts/CLAUDE_AUTONOMOUS_STUDIO_PROMPT.md`.
- Art direction: `docs/MOTION_STYLE_BIBLE.md`, `docs/STYLE_PRESET_CATALOG.md`, and `docs/MOTION_DESIGN_SYSTEM.md`.
- Official Remotion AI skills docs: https://www.remotion.dev/docs/ai/skills. The installer `npx skills add remotion-dev/skills` has not been run in this remote editing environment.

## Font candidates and license/source checks
- Vazirmatn Persian/Arabic project and license: https://github.com/rastikerdar/vazirmatn
- IBM Plex family and package: https://github.com/IBM/plex
- Google Fonts source and license guidance: https://developers.google.com/fonts/ and https://googlefonts.github.io/gf-guide/license-file.html
- Barlow Condensed source: https://github.com/google/fonts/tree/main/ofl/barlowcondensed

The font families listed in `docs/STYLE_PRESET_CATALOG.md` are candidates, not runtime-installed assets. Verify the actual file, version, license, weight and glyph coverage. Test Persian/Arabic connected shaping, RTL order, punctuation, numerals and mixed-script lines in real rendered frames. Never say a font is installed just because a style preset names it.

## Current style research
See `docs/REFERENCE_PATTERN_MATRIX.md` for a traceable synthesis of three recent secondary reports: 100 UI animation videos, 74 mixed-media B2B demos and 95 enterprise AI launch videos. All three came from the same publisher, may overlap and must not be summed into unique-view counts. Their raw data endpoints returned HTTP 410, so this repository uses article text, not the row-level datasets. These reports are software/enterprise-heavy and do not represent every motion-design genre.

The reports discuss changing emphasis on actual/captured interface footage, kinetic typography, live action, 2D/3D mix and light/dark style. Motionlab and Envato also discuss selective AI assistance, hybrids, tactile craft, organic minimalism, native vertical planning and story-led design. Treat findings as context-specific hypotheses, not universal quality rules.

## Optional AI media and speech
### fal
Catalog discovery surfaced video-generation, TTS and speech-to-text candidates. Check current schema, price, quota, output limits and usage terms before integration. Catalog discovery is not proof a model ran or is free.
- Pocket TTS remains the preferred local narration path only when installed and adequate.
- WhisperX remains the intended transcription route only when installed.
- Exact type, charts, labels, maps and data should be composited deterministically.

### Higgsfield
Discovery returned image-to-video candidates and marketing-motion routes. Verify current availability, schema, credits, output limits and rights before use.

## External repositories and licensing
- `frankxai/awesome-motion-design-agent-skills`: one upstream CC0 skill was adapted with attribution.
- `remotion-dev/skills`: official installer documented, but files were not vendored because the upstream license metadata was unclear and this remote editor cannot run installers.
- `haidrrrry/claude-remotion-skill` and `vibe-motion/skills` remain review candidates until licensing, scripts, dependencies, security and compatibility are checked.
- `Vincentwei1021/video-talkcraft` was not imported because its reported PolyForm Noncommercial 1.0.0 terms do not fit a potentially monetized project.
- Third-party skills that force affiliate promotion were not copied as project dependencies.

## Cost, rights and research status
Check live prices and quotas before generation. Keep credentials in secrets and track each generated asset's provenance. A generated asset does not itself establish commercial-use rights. TubeLab and TubeAlfred returned HTTP 402. The public catalog has 55 video candidates, mostly L0, and the 1,000-video visual study remains incomplete.


## Executable CLI
scripts/produce.mjs is the local orchestration entry point. It does not require additional npm packages beyond the existing Remotion project. Configured Firecrawl search and Claude generation require API keys and the explicit paid-provider opt-in. Pocket TTS is an optional local Python runtime, only invoked when installed and the requested language is supported. Technical QC uses FFprobe and FFmpeg, which the GitHub Actions workflow installs on its runner.


## Persian local speech

- `persian-speech` provides the `speech` CLI backed by Mana-Persian-Piper. Package/runtime license is MIT, and the Mana-TTS corpus is CC0 according to the current cards: https://pypi.org/project/persian-speech/1.1.3/, https://huggingface.co/MahtaFetrat/Mana-Persian-Piper, https://huggingface.co/datasets/MahtaFetrat/Mana-TTS.
- The model is downloaded when first used and is not vendored in Git.
- Pocket TTS is used for supported non-Persian languages only; official languages are listed at https://github.com/kyutai-labs/pocket-tts.
