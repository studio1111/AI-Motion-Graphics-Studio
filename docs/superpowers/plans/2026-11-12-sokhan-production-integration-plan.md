# Sokhan Production Integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox syntax for tracking.

**Goal:** Integrate the English-to-Persian translation and Persian TTS engines into the Remotion producer with reviewable translations, reliable audio timing, and a local Voice Studio.

**Architecture:** Node.js remains the production orchestrator and invokes the Python Sokhan CLI through safe subprocess argument arrays. Translation and TTS are independent stages; existing FFmpeg, captions, manifests, QC, and Remotion modules remain authoritative.

**Tech Stack:** Node.js 20, existing Remotion 4.0.539, Python 3.11+, FFmpeg, existing Node test runner.

**Spec:** docs/superpowers/specs/2026-11-12-sokhan-voice-engine-design.md

## Global Constraints

- v1 supports exactly English source text to Persian translation and Persian speech.
- No paid translation or speech API, no HeyGen integration, and no required cloud credentials.
- Preserve existing production behavior for unrelated modes and existing options.
- Actual synthesized duration must drive scene timing; speech must not be time-stretched or truncated to fit.
- No narration request may silently produce a silent or partially narrated video.
- Python is not required for plan-only or voice-off runs.
- Local API binds to loopback only and rejects untrusted origins.

## Review Focus

- Existing --language and --voice defaults must not accidentally convert all current plans into English input or break existing Persian-only runs.
- A failed translation or missing scene WAV must stop production before rendering.
- Long-running Python child processes must time out, terminate cleanly, and preserve bounded diagnostics.
- Translation edits must invalidate only affected translation/audio cache entries.
- Static GitHub Pages must never be treated as a trusted origin for a local privileged generation API.

---

### Task 1: Node subprocess adapter

**Files:**
- Create: `src/production/sokhan-client.mjs`
- Create: `tests/sokhan-client.test.mjs`
- Modify: `scripts/produce.mjs`

**Interfaces:**
- `runSokhan(command: string, request: object, options: { pythonPath?: string, timeoutMs?: number, cwd?: string }) -> Promise<object>`
- Use `spawn` with argv arrays; validate JSON response schema and ensure all returned paths stay inside the run directory.

- [ ] Test successful JSON response, malformed JSON, non-zero exit, timeout, output path traversal, and missing executable using a fake Python child.
- [ ] Run focused Node tests and confirm failure before implementation.
- [ ] Implement adapter with bounded stdout/stderr and safe process termination.
- [ ] Run tests and confirm PASS.

### Task 2: English-to-Persian orchestration and editable translation artifacts

**Files:**
- Create: `src/production/translation-pipeline.mjs`
- Create: `tests/translation-pipeline.test.mjs`
- Modify: `scripts/produce.mjs`
- Modify: `src/production/manifest.mjs` if present; otherwise extend the existing manifest construction at its current owner.

**Interfaces:**
- `translateStoryboardToPersian(storyboard, { runSokhan, glossaryPath, outputDir }) -> Promise<{ translatedStoryboard, translationManifest, warnings }>`
- Preserve scene IDs, source refs, frame ranges, and scene ordering.
- Write editable `translation.en-fa.json` and `narration.fa.txt` artifacts.

- [ ] Test source-target alignment, scene preservation, and no omitted source narration.
- [ ] Test translation failure blocks TTS and render.
- [ ] Test translation text edit changes downstream TTS cache key.
- [ ] Implement orchestration without changing unrelated existing language modes.
- [ ] Run focused tests and existing production tests.

### Task 3: Persian audio integration and timing

**Files:**
- Create: `src/production/sokhan-voice.mjs`
- Create: `tests/sokhan-voice.test.mjs`
- Modify: `scripts/produce.mjs`
- Reuse: `src/production/voice-processing.mjs`, `audio-mastering.mjs`, `narration-timing.mjs`, `captions.mjs`

**Interfaces:**
- `synthesizePersianScenes(translatedStoryboard, { runSokhan, outputDir, voiceControls }) -> Promise<{ sceneAudio, totalDurationFrames, provenance, warnings }>`
- Scene audio duration is read from validated WAV metadata and used for timing.
- Missing or partial scene output is a hard failure.

- [ ] Test all-scenes-success and one-scene-failure behavior.
- [ ] Test duration-to-frame conversion and no truncation/time-stretch.
- [ ] Test Persian captions use edited Persian translation and retain scene alignment.
- [ ] Implement audio integration by reusing existing mastering and mixing functions.
- [ ] Run focused tests and full npm test.

### Task 4: CLI flags, workflow inputs, and manifests

**Files:**
- Modify: `scripts/produce.mjs`
- Modify: `.github/workflows/produce-video.yml`
- Modify: `tests/production.test.mjs`
- Modify: `README.md`

- [ ] Test an explicit English-to-Persian mode and reject unsupported directions.
- [ ] Test that plan-only and voice-off do not require Python or download models.
- [ ] Add explicit workflow input for English source -> Persian output; do not add other languages in v1.
- [ ] Record source/target language, translation model/revision, TTS model/revision, cache status, timings, and QC gates in manifest.
- [ ] Run npm test and workflow YAML validation.

### Task 5: Local Voice Studio and loopback API

**Files:**
- Create: `sokhan/src/sokhan/server.py`
- Create: `sokhan/tests/test_server.py`
- Create or modify: local UI files under `site/` only after checking existing site routing and build conventions.
- Create: `docs/SOKHAN_VOICE_STUDIO.md`

- [ ] Test loopback-only binding, origin rejection, request-size limits, path traversal, and unavailable model responses.
- [ ] Implement minimal local API for translation preview/edit and Persian speech audition; do not expose it through GitHub Pages.
- [ ] Build local UI using existing site components and no new framework unless required.
- [ ] Run server tests and local UI build/test.

### Task 6: End-to-end acceptance

**Files:**
- Create: `tests/sokhan-e2e.test.mjs`
- Create: `sokhan/evaluation/acceptance-checklist.md`
- Update: `README.md`

- [ ] Use a fixed English test script with names, technical terms, idioms, and numbers.
- [ ] Verify Persian draft can be edited before synthesis.
- [ ] Verify Persian WAV, captions, manifest, audio mastering, and rendered Remotion output.
- [ ] Run full `npm run validate`, Python tests, and real-model smoke tests when model weights are available.
- [ ] Record every release gate as PASS, FAIL, BLOCKED, or NOT RUN; request user listening/review before proposing additional languages.
