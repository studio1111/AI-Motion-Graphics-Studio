# Sokhan Voice Engine — Design Specification

**Date:** 2026-11-12  
**Status:** Proposed — awaiting design approval  
**Repository:** studio1111/AI-Motion-Graphics-Studio  
**Branch:** design/sokhan-voice-engine

## 1. Goal

Build an independent, local-first neural speech platform inspired by the capabilities and product experience of HeyGen Voice Turbo, without integrating HeyGen, calling its APIs, copying proprietary weights/code, or requiring a paid provider.

The engine must become the default optional narration backend for the existing Remotion production pipeline while remaining independently usable through a CLI and a local API. The project must not claim parity with Voice Turbo until objective listening and benchmark evidence supports that claim.

## 2. Existing repository constraints

The current project is a Node.js/Remotion production system. scripts/produce.mjs currently routes Persian to the local persian-speech / Mana-Persian-Piper executable, supported non-Persian languages to Pocket TTS, and optionally exposes online Edge TTS. Existing modules already provide Persian text normalization, voice processing, audio mastering, narration timing, caption generation, and audio mixing.

Preserve these contracts:
- No narration request may silently produce a silent or partially narrated video.
- Persian must never be routed to a non-Persian voice.
- Actual synthesized duration must drive scene timing; speech must not be time-stretched or truncated to fit.
- Continue to use FFmpeg for enhancement/mastering and Remotion for deterministic final composition.
- Paid API access remains opt-in and unrelated to this engine. Sokhan itself must run without paid API keys.
- Keep existing --voice auto, off, pocket-tts, persian-speech, and edge-tts behavior backward compatible during migration.

## 3. Product scope

### 3.1 Sokhan Core
- A versioned Python package and command-line interface, invoked by the existing Node.js production pipeline through a strict JSON request/response contract.
- Optional loopback-only HTTP API for local UI and streaming clients; it is not exposed to the public internet by default.
- Provider-neutral model adapter interface with capability discovery, health checks, deterministic configuration, bounded timeouts, and structured errors.
- Model registry that records exact repository, revision, file hashes, model/code licenses, supported languages, runtime requirements, and whether voice cloning is permitted.
- Local model cache with explicit directory configuration, integrity verification, safe resume, and no automatic unbounded downloads.

### 3.2 Speech generation
- Persian-first path with dedicated Persian normalization, numeral/date/unit expansion, half-space handling, Arabic-character normalization, pronunciation lexicon, and optional phoneme/G2P preprocessing.
- Multilingual adapters for languages actually supported by each installed model; never infer language support from a model name.
- Sentence-aware chunking with configurable context overlap and natural inter-chunk pauses.
- WAV output with explicit sample rate, channels, bit depth, duration, and metadata.
- Batch and incremental/streaming generation where the selected backend genuinely supports it.
- Reproducible cache keys from normalized text, language, model revision, voice identity, and generation controls.

### 3.3 Voice design and expressive controls
Expose a stable control schema: voice preset/reference, speaking rate, pitch where supported, energy/intensity, style/emotion where supported, pause durations, pronunciation overrides, and emphasis spans.

Every adapter must declare supported controls. Unsupported controls must be reported as unsupported rather than silently ignored. Where the backend lacks native emotion control, only apply bounded post-processing and do not describe it as model-generated emotion.

### 3.4 Voice reference and consent
- Support user-owned voice reference clips only where the selected model/license permits it.
- Require an explicit local consent confirmation before creating or storing a cloned voice profile.
- Store consent metadata and a user-controlled deletion path; do not upload voice samples.
- Reject requests to imitate a real person without authorization and prevent the feature from being marketed as identity verification.

### 3.5 Audio quality and synchronization
- Integrate the current voice-processing and EBU R128 mastering modules instead of duplicating them.
- Add objective checks: non-empty audio, finite samples, clipping/peak ceiling, silence detection, duration bounds, sample-rate consistency, and decoder validation.
- Record synthesis latency, real-time factor, model/version, warnings, and per-scene timing.
- Add optional local forced alignment for word/phrase-level caption timing; current estimated captions remain explicitly marked as estimated until alignment is enabled and validated.
- Keep creative listening review separate from automated signal QC.

### 3.6 Local Voice Studio
Provide a local-only UI workflow for selecting language/voice, auditioning presets, editing pronunciation, adjusting expressive controls, and previewing generated audio. It must clearly show model/license/runtime status and never expose a local API to arbitrary remote origins. The existing GitHub Pages site remains static; local generation must be routed through the loopback service, not through GitHub Pages or a public server.

## 4. Model and licensing policy

No model is bundled or downloaded merely because it appears in a search result. Before adoption, record and review:
1. code license and model-weight license separately;
2. training-data and voice-reference terms where published;
3. commercial/non-commercial restrictions and attribution requirements;
4. language support and Persian script vs phoneme input requirements;
5. model size, CPU/GPU requirements, quantization and measured latency;
6. reproducible quality results on a fixed Persian and multilingual evaluation set.

Initial candidate evaluation (not an automatic selection):
- Keep the existing Persian Speech / Mana-Persian-Piper runtime as a compatibility baseline until its exact code and weight licenses are revalidated.
- Evaluate F5-TTS and other permissively licensed multilingual models for languages they demonstrably support; do not assume Persian support.
- Evaluate Persian-specific candidates only after their weight licenses and G2P dependencies are checked. In particular, a Persian Pocket-TTS v2 distribution with a CC-BY-NC license must not be selected as the default if commercial use is a possible project requirement.
- Do not bundle restricted or unclear-license weights. Provide a documented adapter interface so a user may add a legally compatible local model.
- A small CPU-capable baseline is required; GPU acceleration is an optional performance path, not a mandatory paid service.

## 5. Architecture

Remotion Production CLI (Node.js)
  -> Sokhan adapter (strict JSON over subprocess / optional localhost HTTP)
     -> Sokhan Core (Python)
        -> Persian text frontend (normalization, numbers, G2P, lexicon)
        -> Language and capability router
        -> Model adapters (local only)
        -> Voice profile / consent registry
        -> Chunk scheduler + cache
        -> Streaming / batch output
        -> Telemetry + structured diagnostics
     -> WAV outputs + per-scene timing + provenance
  -> Existing FFmpeg enhancement / mastering / QC
  -> Existing Remotion composition + caption rendering

The Node adapter must validate every response and output path, use argument arrays (never shell interpolation), enforce timeouts, and reject missing or partial scene outputs. Python must not be required for plan-only or voice-off runs.

## 6. Delivery phases

### Phase A — Foundation
- Add design-approved architecture, package layout, config schema, model registry schema, capability contract, CLI/API contracts, and test fixtures.
- Add dependency and license audit; no heavyweight model download in CI.
- Add tests for normalization, routing, cache identity, model capability validation, safe paths, consent gates, timeout/error mapping, and JSON contracts.

### Phase B — Working local engine
- Implement the Python runtime and at least one verified local Persian backend plus one verified multilingual backend.
- Add chunked generation, output validation, caching, structured provenance, and CPU-first execution.
- Provide a repeatable smoke test that synthesizes a short phrase and validates the WAV.

### Phase C — Production integration
- Add the Node adapter and --voice sokhan / auto routing without breaking existing engine selections.
- Use actual WAV duration in scene timing and preserve the no-silent-output release gate.
- Add per-scene voice status and model provenance to manifests/QC reports.

### Phase D — Local Voice Studio
- Add the loopback service and local UI, audition flow, voice profiles, pronunciation dictionary, and expressive controls.
- Harden CORS, origin checks, path validation, request limits, and local API access.

### Phase E — Advanced quality
- Evaluate expressive models and voice-reference cloning where licenses permit.
- Add optional forced alignment and richer prosody controls.
- Benchmark against a fixed reference set and publish measured quality/latency limitations.

## 7. Quality gates

- Unit tests: all deterministic contracts and failure paths.
- Integration tests: fake adapter plus at least one installed real model smoke test.
- Audio tests: decode, duration, sample rate, finite samples, peak/clipping, silence and cache determinism.
- Persian evaluation: native-script input, Arabic/Persian character variants, half-space, numbers, punctuation, mixed Latin terms, long paragraphs, and proper names.
- Pipeline test: a short Persian Remotion render with verified voice, captions, manifest and QC report.
- Security tests: path traversal, malformed JSON, oversized requests, untrusted origins, unsafe voice references, and secret leakage.
- Performance report: cold start, warm synthesis, real-time factor, memory footprint, CPU baseline and optional GPU results.
- All release gates must be marked PASS, FAIL, BLOCKED or NOT RUN. No claim of Voice Turbo equivalence without listening tests and transparent comparison methodology.

## 8. Non-goals

- Calling HeyGen or any paid TTS API.
- Copying proprietary model weights, source code, or private voice assets.
- Guaranteeing the same quality as a proprietary commercial service.
- Uploading user text, voice references, or generated audio to third-party providers.
- Replacing Remotion, FFmpeg, or the existing production pipeline.
- Making a public multi-tenant voice-cloning service.

## 9. Open design decision

The implementation should begin with the local-first Python runtime and Node adapter, with Persian as the first-class language and multilingual support added only through verified adapters. Model choice is evidence- and license-gated, not hardcoded from marketing claims.
