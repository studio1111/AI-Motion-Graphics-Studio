# Motion Graphics Toolchain Catalog

Last reviewed: 2026-10-27. Listing a tool here does not mean it is installed, free, configured, or licensed for every use.

## Deterministic core
- Remotion: frame-accurate React composition; versions are pinned in `package.json`.
- FFmpeg/FFprobe: media processing and verification. CI must explicitly install FFmpeg; an earlier run rendered MP4 but failed because ffprobe was unavailable.
- SVG/HTML/CSS/GSAP: exact text, vector animation, charts, diagrams, labels, and timing.
- Three.js/Blender: true 3D when runtime and rendering budget justify it.
- Lottie/dotLottie and Rive: reusable animation assets when formats/runtime fit.
- Cavalry: procedural 2D motion application, separate from the Agent Skills workflow.

## Claude Code integration
- Claude project skills use `.claude/skills/<skill-name>/SKILL.md`, separate from the general `.agents/skills/` catalogue.
- Official skills overview: https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview
- Official prompting guide: https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices
- Persistent instructions: `CLAUDE.md`; orchestration prompt: `prompts/CLAUDE_AUTONOMOUS_STUDIO_PROMPT.md`.
- Official Remotion skill installation docs: https://www.remotion.dev/docs/ai/skills. The command `npx skills add remotion-dev/skills` has not been run from this remote editing environment.

## Emerging 2026 creative signals
A current industry article discusses hybrid AI-assisted workflows, tactile craft, mixed media, 2D/3D combinations, flexible platform formats, and story-led design: https://elements.envato.com/learn/motion-design-trends. Treat these as hypotheses, not universally proven laws. Reference seeds and evidence levels live in `research/REFERENCE_SEED_CATALOG.md`.

## Optional AI and speech services
### fal
Catalog discovery surfaced image/video, text-to-video, speech-to-text, and TTS candidates. Before integrating a model, inspect its live schema, price, limits, output specifications, and terms. Discovery is not proof it ran or is free.
- Prefer Pocket TTS for local narration when actually installed and suitable.
- Prefer WhisperX for transcription when actually installed; preserve timestamps and confidence where available.
- Composite exact typography, charts, maps, labels, and data deterministically.

### Higgsfield
Discovery returned image-to-video model candidates and a marketing-motion route. Verify current schema, availability, credits, output limits, and rights before use. Search does not establish runtime installation.

## External projects and licensing
- `frankxai/awesome-motion-design-agent-skills`: one upstream CC0 skill adapted with attribution.
- `remotion-dev/skills`: official installer documented, but files were not vendored because repository license metadata was unclear and the remote editor cannot run installers.
- `haidrrrry/claude-remotion-skill` and `vibe-motion/skills` appeared in search; review licensing, scripts, dependencies, security and compatibility before importing.
- `Vincentwei1021/video-talkcraft` was not imported because its reported PolyForm Noncommercial 1.0.0 terms do not fit a potentially monetized project.
- Unrelated third-party video skills may force affiliate promotions; those are not appropriate production dependencies and were not copied.

## Cost, rights and research status
Check live price/quota before generation. Keep credentials in secrets and track asset provenance. A generated asset does not automatically grant commercial-use rights. TubeLab and TubeAlfred attempts returned HTTP 402 for insufficient credits; Firecrawl supplied a starter set, but the 1,000-video study remains pending.