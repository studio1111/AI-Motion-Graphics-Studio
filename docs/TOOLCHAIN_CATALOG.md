# Motion Graphics Toolchain Catalog

Last reviewed: 2026-10-27. This is a routing reference, not a claim that all tools are installed or configured.

## Core deterministic pipeline
- Remotion: programmatic React-based video composition and frame-accurate rendering. Existing repository dependency is pinned in package.json.
- FFmpeg/FFprobe: audio/video processing and technical validation. Runtime availability must be checked on the actual runner.
- SVG/HTML/CSS/GSAP: exact typography, vector animation, charts, diagrams, and timeline-driven motion.
- Three.js: browser-based 3D and WebGL scenes.
- Blender: offline 3D modeling, animation, camera, lighting, and rendering.
- Lottie/dotLottie and Rive: reusable vector/interactivity assets; only use where export/runtime requirements fit.
- Cavalry: promising procedural 2D motion-design application; it is a separate desktop application and is not installed by adding an Agent Skill.

## AI media catalog observations
### fal
Live catalog recommendation for unnamed text-to-video tasks returned MiniMax H3 Max as the recommended starting point for short shots (up to 15 seconds, 480p/768p in the catalog guidance). Other listed candidates included Seedance, Kling, Wan, and FLUX video variants. Endpoint schemas and pricing must be checked at execution time. This is not evidence that any model was run or that use is free.

The current speech-to-text catalog included:
- fal optimized Whisper v3 (Wizper)
- general speech-to-text endpoints
- ElevenLabs Scribe V2
The current TTS catalog included Eleven v4, MiniMax Speech 2.8 HD, Gemini Flash TTS, and Qwen TTS routes. Keep these as optional fallbacks, not automatic substitutions for the project's preferred local Pocket TTS.

### Higgsfield
Current model discovery returned image-to-video options including Cinema Studio Video, Seedance 1.5 Pro, and Kling 2.6 Video. Cinema Studio Video exposes genre, quality mode, audio, speed-ramp, and optional multi-shot controls. The marketing motion route supports multiple video styles, but should be used only when the deliverable fits its product/marketing focus. Catalog output is not an installed runtime.

### Transcription
The project's intended path for extracting speech from source video is WhisperX when installed. Preserve transcript timestamps, speaker information when available, and confidence/uncertainty. Do not infer exact spoken words from visuals alone.

## Public project candidates found during web discovery
- frankxai/awesome-motion-design-agent-skills: https://github.com/frankxai/awesome-motion-design-agent-skills
- Remotion official skills: https://github.com/remotion-dev/skills
- Motion: https://github.com/motiondivision/motion
- Rive WebAssembly runtime: https://github.com/rive-app/rive-wasm
- dotLottie web: https://github.com/LottieFiles/dotlottie-web
- Agent Skills standard: https://github.com/agentskills/agentskills
- Public motion-graphics repository topic: https://github.com/topics/motion-graphics
- Cavalry: https://cavalry.studio/en/

These are candidates for evaluation, not automatically imported code. Before installation, inspect canonical upstream, license, maintenance, dependency footprint, scripts, compatibility, and whether it duplicates existing project functionality. The remote GitHub editor cannot run arbitrary shell installers, so executable dependencies need installation and validation in a working checkout or CI.

## Research provider limitation
The initial TubeLab searches returned HTTP 402. Therefore, the 1,000-video reference study remains pending and is tracked in docs/RESEARCH_AND_BENCHMARK_PLAN.md. Do not describe search-result snippets as having watched or analyzed the complete videos.

## Supabase decision
No Supabase database was created. A database is unnecessary for the initial local skill/prompt toolkit; introducing a hosted service before a concrete persistent research-data need would add configuration and possible cost without improving the current render pipeline.
