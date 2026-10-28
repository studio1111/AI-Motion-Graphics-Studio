# Autonomous Production Pipeline

This is the target run contract, not proof every stage is implemented.

## State machine
1. INTAKE: normalize brief, language, runtime, platform, exclusions and budget; record defaults.
2. RESEARCH: source claims; separate facts from metaphors; record source/date/confidence.
3. SCRIPT: hook, viewer promise, progression, reveal, synthesis and resolution; separate narration from screen copy.
4. STYLE_LOCK: one lead style plus at most two accents; lock palette, type roles, grid, materials, camera, motion and sound.
5. STORYBOARD: per-scene timing, purpose, focal point, composition, state changes, transitions, sound, assets and checks.
6. ASSET_PLAN: choose deterministic/local, licensed, user-supplied, generated or 3D assets; record license/provenance/fallback.
7. VOICE_AND_TIMING: create voice early if configured; measure duration and align visuals/captions.
8. BUILD: reusable scene components; exact text/data deterministic.
9. PREVIEW: representative low-cost render.
10. QC: inspect real frames/audio when available and verify media metadata.
11. REPAIR: fix verified high-impact defects and rerun affected tests.
12. FINAL_RENDER: render requested quality.
13. FINAL_QC: repeat checks on final artifact.
14. PACKAGE: deliver project, manifests, source/rights ledger and report where supported.

Persist state so a transient failure resumes from valid artifacts instead of repeating costly generation.

## Stage gates
Research claims need sources or explicit uncertainty. Narrative must fulfill its opening promise at natural speaking pace. Style must be distinct and available in runtime. Storyboard scenes include ID, timing, purpose, narration, exact screen copy, mode, composition, camera, state changes, transitions, cues, sources, fallback and acceptance checks. Never assume unclear licenses permit commercial use. Final render must exist, decode, match requested properties and pass sampled-frame/audio inspection where available.

## Scene manifest fields
`id`, `startFrame`, `endFrame`, `purpose`, `narrationText`, `screenCopy`, `visualStyle`, `composition`, `depthLayers`, `cameraPath`, `motionBeats`, `transitionIn`, `transitionOut`, `soundCues`, `assetRefs`, `sourceRefs`, `fallback`, `acceptanceChecks`. Validate these in code; this illustrative list is not a runtime validator.

## Review and repairs
Score observed evidence 0–5 for story/payoff, art direction, composition, motion, typography, audio, factual accuracy/provenance, continuity, accessibility and technical integrity. Critical failures block release. Below 82/100 can trigger a targeted repair as a heuristic, not a guarantee. Limit automatic repair to two cycles; report unresolved defects.

## Fallback ladder
1. Configured deterministic/local component.
2. Existing asset or original vector/diagram.
3. Licensed stock or approved user asset.
4. Configured generative endpoint after live schema/rights/price checks.
5. Simpler original scene preserving meaning.
6. BLOCKED if truth or required content cannot be preserved.

Use stable run/scene IDs, hashes and prompt/model versions. Reuse valid outputs. Retry transient errors with bounded backoff and fail fast on auth/schema/license/budget issues.

## Delivery
Where supported, include MP4/preview, editable source, narration, on-screen copy, storyboard/manifest, claim/source ledger, asset-license ledger, model/prompt manifest and QC marked PASS/FAIL/BLOCKED/NOT RUN.

## Implementation status
Only the smoke-test renderer and validation workflow are currently verified in principle. Do not claim unattended topic-to-final-video generation until executable runs and real artifacts prove it.


## Current executable implementation
The CLI at scripts/produce.mjs implements intake/defaults, style routing, a deterministic local storyboard fallback, optional Firecrawl discovery and Claude scene-plan generation after explicit paid-service opt-in, frame allocation, optional Pocket TTS for supported languages, procedural ambient audio, SRT creation, Remotion rendering, FFprobe checks, FFmpeg decoding and frame-sample extraction. The output folder includes the brief, source record, storyboard, timed storyboard, props, narration text, captions, manifest, QC report and MP4 when successful.

## Verified limits
- When narration is requested, production now blocks before rendering if the selected local voice engine is missing, unsupported, or fails any scene. It writes `voice-status.json` and a `VOICE_GENERATION_FAILED` QC report instead of silently shipping a music-only or partially narrated result. Music-only output remains available through the explicit `--voice off` option.
- A local fallback creates a conceptual template and explicitly warns that topic-specific factual research was not performed.
- Firecrawl search results are candidates, not automatically verified claims. Claude is instructed not to invent data and source references are filtered against supplied/retrieved URLs.
- Official Pocket TTS has no Persian model in its current published language list; the pipeline reports unsupported language instead of using a mismatched voice.
- Technical probes and frame extraction run automatically, but creative visual review and audio listening remain NOT_RUN. Font names in a preset do not confirm font files exist.
- Run the repository CI before claiming implementation verified. The 1,000-video study remains incomplete.
