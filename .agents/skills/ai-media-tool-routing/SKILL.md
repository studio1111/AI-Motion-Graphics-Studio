---
name: ai-media-tool-routing
description: Select and chain optional image, video, speech, transcription, and audio models for a motion-graphics pipeline while protecting quality, cost, and reproducibility.
---
# AI Media Tool Routing

## Principle
Use AI generation where it adds value, not as a substitute for deterministic layout, editing, or quality control. Model catalogs change; discover current endpoints and inspect their schemas and pricing before every new integration. A catalog entry does not mean the model is installed, free, or available in the user's account.

## Route by artifact
- Exact typography, labels, diagrams, charts, maps, and timed layout: use Remotion, SVG, HTML/CSS, GSAP, or other deterministic rendering. Add text after generative imagery.
- Visual development and keyframes: use an image-generation endpoint suited to composition and text needs; use reference/edit workflows to preserve recurring objects.
- Organic cinematic inserts: compare current text-to-video and image-to-video endpoints. Prefer image-to-video from an approved styleframe when continuity matters.
- Shot sequences: create a shot list and continuity anchors before generation. Generate shots independently when it improves control, then edit in the deterministic timeline.
- Narration: default to the project's preferred local Pocket TTS when installed and suitable. Measure its actual output duration and listen for pronunciation/quality. If it fails or quality is insufficient, use an explicitly configured alternative and check its terms and cost.
- Audio transcription: use the configured WhisperX workflow when installed; otherwise inspect current speech-to-text model catalog and schema. Preserve timestamps when available.
- Music and sound effects: use licensed or generated tracks, then mix and time them deterministically. Never assume a model's output grants unrestricted commercial rights.

## Current catalog observations
- fal model routing currently recommends MiniMax H3 Max for unnamed text-to-video tasks up to 15 seconds, with documented 480p/768p options. Use current schema and pricing, not this note alone.
- fal catalog also lists Seedance, Kling, Wan, and other video routes; use only after verifying the current request schema and availability.
- Higgsfield catalog search returned image-to-video options including Cinema Studio Video, Seedance 1.5 Pro, and Kling 2.6 Video, plus a Marketing Studio motion route. The text-only video query returned no matches in this search, so do not infer absence from the whole platform.
- fal speech-to-text catalog includes Whisper v3-based Wizper and general transcription endpoints. Selection should depend on language, timestamps, input size, and current schema.
- fal text-to-speech catalog includes multiple vendors, but remote TTS should remain optional. Do not silently switch from the local default.

## Workflow
1. Inspect current catalog and endpoint schema.
2. Check pricing, resolution, duration, aspect ratio, audio support, reference-image support, usage rights, and rate limits.
3. Create one small test asset before batch generation.
4. Keep prompts and model IDs in a versioned manifest; keep credentials in secrets.
5. Anchor recurring visual identity with approved images and repeat constraints in every shot prompt.
6. Retry transient errors with bounded backoff; never restart an already-running asynchronous job unnecessarily.
7. Inspect results for drift, artifacts, text hallucinations, motion defects, and continuity.
8. If a model fails, use a deterministic fallback and report the downgrade.
9. Cache asset metadata and checksums; do not commit large outputs or private media.

## Cost guardrail
Never launch bulk or long-duration generation without checking current pricing and budget. Prefer local deterministic animation for long-form sequences and reserve cloud generation for shots where it meaningfully improves the result.
## Status
Original routing skill based on current catalog discovery; integrations are optional and must be separately configured.
