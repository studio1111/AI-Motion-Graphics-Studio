# Sokhan Voice Engine — English-to-Persian Design

**Date:** 2026-11-12  
**Status:** User-approved; v1 implementation in progress (2026-11-12)  
**Repository:** studio1111/AI-Motion-Graphics-Studio  
**Branch:** design/sokhan-voice-engine

## 1. Goal and strict v1 scope

Build an independent, local-first English-to-Persian narration system inspired by the capabilities and product experience of HeyGen Voice Turbo, without integrating HeyGen, calling its APIs, copying proprietary weights/code, or requiring a paid provider.

**Version 1 supports exactly one language direction: English source text -> Persian translation -> natural Persian speech.** No other source or target languages are in scope. Other languages may be added only after the user approves the quality of this release.

The output is Persian narration and associated Persian captions for the existing Remotion production pipeline. The system must not claim parity with Voice Turbo until objective listening and benchmark evidence supports that claim.

## 2. Existing repository constraints

The current project is a Node.js/Remotion production system. scripts/produce.mjs currently routes Persian to the local persian-speech / Mana-Persian-Piper executable, supported non-Persian languages to Pocket TTS, and optionally exposes online Edge TTS. Existing modules already provide Persian text normalization, voice processing, audio mastering, narration timing, caption generation, and audio mixing.

Preserve these contracts:
- No narration request may silently produce a silent or partially narrated video.
- v1 accepts English source text and produces Persian text/audio only. Reject unsupported language directions with an actionable error.
- Persian must never be routed to a non-Persian voice.
- Actual synthesized duration must drive scene timing; speech must not be time-stretched or truncated to fit.
- Continue to use FFmpeg for enhancement/mastering and Remotion for deterministic final composition.
- No paid translation or speech API, no HeyGen integration, and no required cloud credentials.
- Existing production options remain backward compatible unless a separately approved migration changes them.

## 3. User workflow

1. User supplies English narration/script or an English-language production plan.
2. Source text is validated and segmented without losing scene boundaries, IDs, timing hints, citations, or speaker notes.
3. Local English-to-Persian translation creates Persian draft text.
4. A review/edit step exposes source English and Persian translation side by side. User can correct wording, names, technical terms, tone, and pronunciation before speech generation.
5. Persian text normalization and pronunciation processing run after edits.
6. Local Persian TTS generates scene-level WAV files.
7. Existing audio enhancement, mastering, captioning, timing, QC, and Remotion rendering run.
8. A manifest records source/target text hashes, translation model/revision, speech model/revision, license metadata, audio metrics, warnings, and QC status. Do not log private full narration text by default.

Translation and speech synthesis are separate stages. A user must be able to edit the translation without regenerating the source plan; the speech cache key must change when the Persian text or voice settings change.

## 4. Product scope

### 4.1 Local translation engine
- Python package interface for English-to-Persian translation, callable from Node.js through strict JSON over subprocess.
- Local model inference only. No text sent to external translation APIs.
- Preserve scene ordering, IDs, timestamps, markup boundaries, and source references.
- Support glossary entries for names, technical terms, product names, and preferred Persian equivalents.
- Add Persian editorial post-processing for natural word order, punctuation, half-space, numeral policy, and terminology consistency.
- Translation must never silently omit source sentences. Include segment-level status and source/target alignment.
- Provide a confidence/warning channel, not fabricated confidence scores. Flag ambiguous terms and untranslated fragments for review.
- Cache by source-text hash, model revision, glossary revision, and translation settings.

### 4.2 Persian speech engine
- Persian-only TTS adapter interface and local model runtime.
- Persian normalization, numeral/date/unit expansion, half-space handling, Arabic-character normalization, pronunciation lexicon, and optional phoneme/G2P preprocessing.
- Sentence-aware chunking with configurable context overlap and natural inter-chunk pauses.
- WAV output with explicit sample rate, channels, bit depth, duration, and metadata.
- Batch and incremental/streaming generation only where the selected backend genuinely supports it.
- Cache by normalized Persian text, model revision, voice identity, and generation controls.

### 4.3 Voice design and expressive controls
Expose a stable Persian voice-control schema: voice preset/reference, speaking rate, pitch where supported, energy/intensity, style/emotion where supported, pause durations, pronunciation overrides, and emphasis spans.

Every adapter must declare supported controls. Unsupported controls must be reported as unsupported rather than silently ignored. Where the backend lacks native emotion control, only apply bounded post-processing and do not describe it as model-generated emotion.

### 4.4 Voice reference and consent
- Support user-owned voice reference clips only where the selected model/license permits it.
- Require explicit local consent confirmation before creating or storing a cloned voice profile.
- Store consent metadata and a user-controlled deletion path; do not upload voice samples.
- Reject unauthorized imitation of real people.

### 4.5 Audio quality and synchronization
- Integrate current voice-processing and EBU R128 mastering modules instead of duplicating them.
- Add objective checks: non-empty audio, finite samples, clipping/peak ceiling, silence detection, duration bounds, sample-rate consistency, and decoder validation.
- Record synthesis latency, real-time factor, model/version, warnings, and per-scene timing.
- Add optional local forced alignment for Persian word/phrase-level caption timing; estimated captions remain explicitly marked as estimated until alignment is enabled and validated.
- Keep creative listening review separate from automated signal QC.

### 4.6 Local Voice Studio
Provide a local-only UI workflow for English input, Persian translation review/editing, Persian voice selection, auditioning, pronunciation glossary, expressive controls, and audio preview. Clearly show model/license/runtime status. Never expose a local API to arbitrary remote origins. Existing GitHub Pages remains static; local generation runs through the loopback service, not GitHub Pages or a public server.

## 5. Model and licensing policy

No model is bundled or downloaded merely because it appears in a search result. Before adoption, record and review:
1. code license and model-weight license separately;
2. training-data and voice-reference terms where published;
3. commercial/non-commercial restrictions and attribution requirements;
4. English-to-Persian translation quality and Persian TTS script/phoneme requirements;
5. model size, CPU/GPU requirements, quantization and measured latency;
6. reproducible quality results on a fixed English-to-Persian translation set and Persian speech evaluation set.

Candidate selection is evidence- and license-gated:
- Keep existing Persian Speech / Mana-Persian-Piper as a compatibility baseline until exact code and weight licenses are revalidated.
- Evaluate local English-to-Persian translation candidates only after confirming model-weight license, quality, inference dependencies, and hardware requirements. Do not assume a research model's license permits commercial use.
- Evaluate Persian TTS candidates separately from translation models. A Persian Pocket-TTS v2 distribution with a CC-BY-NC license must not be the default if commercial use may be required.
- Do not bundle restricted or unclear-license weights. Allow users to install a legally compatible model into the documented adapter interface.
- CPU-capable baseline is required; GPU acceleration is optional, not a paid service.
- No model is declared selected until the repository includes a model card record with source, immutable revision, license, checksum, supported task, and benchmark.

## 6. Architecture

Remotion Production CLI (Node.js)
  -> Sokhan adapter (strict JSON over subprocess / optional localhost HTTP)
     -> Sokhan Core (Python)
        -> English input validator + scene-preserving segmenter
        -> Local English-to-Persian translation adapter
        -> Glossary + Persian editorial normalization
        -> Human review/edit boundary
        -> Persian-only capability router
        -> Local Persian TTS model adapter
        -> Voice profile / consent registry
        -> Chunk scheduler + separate translation/audio caches
        -> Telemetry + structured diagnostics
     -> Persian text + WAV outputs + per-scene alignment + provenance
  -> Existing FFmpeg enhancement / mastering / QC
  -> Existing Remotion composition + Persian captions

The Node adapter must validate every response and output path, use argument arrays (never shell interpolation), enforce timeouts, and reject missing or partial scene outputs. Python is not required for plan-only or voice-off runs. No public API or cloud endpoint is required.

## 7. Delivery phases

### Phase A — Foundation
- Add the approved architecture, package layout, configuration schema, model registry, capability contract, CLI/API contract, and fixtures.
- Add separate translation and TTS dependency/license audits; no heavyweight model download in CI.
- Add tests for language-direction rejection, scene preservation, glossary application, cache identity, model capability validation, safe paths, consent gates, timeout/error mapping, and JSON contracts.

### Phase B — English-to-Persian translation
- Implement local translation runtime and one verified English-to-Persian model.
- Preserve scene IDs/order and provide source-target segment alignment.
- Add glossary, translation review/edit workflow, and regression fixtures for technical terms, names, idioms, long sentences, numbers, and mixed-script terms.
- Validate translation quality with human-reviewed reference examples before integrating speech.

### Phase C — Persian speech engine
- Implement local Persian TTS runtime and one verified model.
- Add chunked generation, WAV validation, caching, structured provenance, and CPU-first execution.
- Provide repeatable Persian phrase and paragraph smoke tests.

### Phase D — Production integration
- Add Node adapter and explicit English-to-Persian pipeline option.
- Use actual WAV duration in scene timing and preserve the no-silent-output release gate.
- Add per-scene translation/TTS status and model provenance to manifests/QC reports.
- Render and inspect a complete short Persian Remotion video.

### Phase E — Local Voice Studio and advanced quality
- Add loopback service and local UI for English input, Persian review, pronunciation glossary, voice audition, and expressive controls.
- Harden CORS, origin checks, path validation, request limits, and local API access.
- Evaluate voice-reference cloning only if model licenses and consent controls permit.
- Add optional forced alignment and benchmark quality, latency, and memory usage.

## 8. Quality gates

- Translation tests: no lost segments, stable scene IDs, glossary consistency, names/technical terms, punctuation, idioms, long text, and explicit handling of ambiguous translations.
- Persian text tests: Arabic/Persian character variants, half-space, numbers, punctuation, mixed Latin terms, and proper names.
- Audio tests: decoder validation, duration, sample rate, finite samples, peak/clipping, silence, and cache determinism.
- Integration: a short English source script must produce editable Persian text, valid Persian narration, captions, manifest, and a Remotion render.
- Security: path traversal, malformed JSON, oversized requests, untrusted origins, unsafe voice references, and secret leakage.
- Performance: cold start, warm translation, warm synthesis, real-time factor, memory footprint, CPU baseline and optional GPU results.
- Every gate is PASS, FAIL, BLOCKED, or NOT RUN. No claim of Voice Turbo equivalence without listening tests and transparent comparison methodology.

## 9. Explicit v1 non-goals

- Any language direction other than English-to-Persian.
- Multilingual TTS or translation routing.
- Calling HeyGen or any paid translation/TTS API.
- Copying proprietary model weights, source code, or private voice assets.
- Guaranteeing identical quality to a proprietary commercial service.
- Uploading user text, voice references, or generated audio to third-party providers.
- Replacing Remotion, FFmpeg, or the existing production pipeline.
- Making a public multi-tenant voice-cloning service.

## 10. Release acceptance

The user reviews a fixed evaluation set of English source segments and Persian translations, then listens to the generated Persian narration in the rendered video. Only after the user accepts translation quality, pronunciation, naturalness, and synchronization may additional languages be proposed.
