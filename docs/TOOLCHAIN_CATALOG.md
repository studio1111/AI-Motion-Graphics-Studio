# Motion Graphics Toolchain Catalog

Last reviewed: 2026-10-27. Listing a tool does not mean it is installed, free, configured or licensed for every use.

## Deterministic core
- Remotion: frame-accurate React composition; versions are pinned in `package.json`.
- FFmpeg/FFprobe: media processing and verification. CI explicitly installs FFmpeg after the runner initially lacked ffprobe.
- SVG/HTML/CSS/GSAP: precise typography, vector animation, charts, diagrams, labels and timing.
- Three.js/Blender: true 3D when runtime and budget justify it.
- Lottie/dotLottie and Rive: reusable animation assets when formats/runtime fit.
- Cavalry: procedural 2D motion application, separate from Agent Skills.

## Claude Code integration
- Claude project skills use `.claude/skills/<skill-name>/SKILL.md`, separate from `.agents/skills/`.
- Official skill overview: https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview
- Official prompting guide: https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices
- Persistent instructions are in `CLAUDE.md`; orchestration prompt: `prompts/CLAUDE_AUTONOMOUS_STUDIO_PROMPT.md`.
- Official Remotion skills docs: https://www.remotion.dev/docs/ai/skills. The installer `npx skills add remotion-dev/skills` has not been run here.

## Current style research
See `docs/REFERENCE_PATTERN_MATRIX.md` for a traceable synthesis of three recent secondary reports: 100 UI animation videos, 74 mixed-media B2B demos and 95 enterprise AI launch videos. They were all published by the same research vendor, may overlap, and cannot be added into a unique-view count. Their source article data endpoints returned HTTP 410, so this repository used the reports' article text rather than importing raw rows. The findings concern software/enterprise content and must not be generalized to every kind of motion graphics.

The 2026 reports highlight selective AI assistance, 2D/3D hybrids, tactile/organic style, native vertical planning and story-led motion. For the enterprise samples, real/captured UI often became more prominent while full-video kinetic typography and 3D decreased in some periods. These are context-dependent patterns, not universal quality rules.

## Optional AI media and speech
### fal
Discovery surfaced video, TTS and speech-to-text candidates. Check current schema, billing, rate limits, output specs and terms before every integration. A catalogue entry is not proof the model ran or is free.
- Pocket TTS is the preferred local narration path only when installed and suitable.
- WhisperX is the intended transcription route only when installed; preserve timestamps/confidence where available.
- Exact type, charts, labels, maps and data should be composited deterministically.

### Higgsfield
Discovery returned image-to-video candidates and a marketing-motion route. Verify current availability, schema, credits, output limits and rights before use.

## External repositories and licensing
- `frankxai/awesome-motion-design-agent-skills`: one upstream CC0 skill adapted with attribution.
- `remotion-dev/skills`: official installer documented, but files were not vendored because repository license metadata was unclear and the remote editor cannot run installers.
- `haidrrrry/claude-remotion-skill` and `vibe-motion/skills` appeared in search; inspect license, scripts, dependency footprint, security and compatibility before importing.
- `Vincentwei1021/video-talkcraft` was not imported because its reported PolyForm Noncommercial 1.0.0 terms do not fit a project that may be monetized.
- Some third-party video skills force affiliate promotion; that is not an appropriate production dependency.

## Cost and evidence
Check live pricing and quota. Keep credentials in secrets and record generated asset provenance. Tool availability does not establish commercial-use rights. TubeLab and TubeAlfred attempts returned HTTP 402, the public catalog has 55 candidate video URLs mostly at L0, and the 1,000-video study remains incomplete.
