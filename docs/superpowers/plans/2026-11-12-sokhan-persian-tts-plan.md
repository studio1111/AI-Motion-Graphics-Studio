# Sokhan Persian TTS Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox syntax for tracking.

**Goal:** Implement a local Persian-only neural speech engine with validated WAV output and expressive controls.

**Architecture:** Python runtime with adapter capability discovery, chunked generation, local cache, and strict JSON CLI. The existing Node pipeline consumes WAV artifacts and retains FFmpeg mastering and Remotion rendering.

**Tech Stack:** Python 3.11+, pytest, existing Persian Speech/Mana-Persian-Piper compatibility baseline, FFmpeg, Node.js 20.

**Spec:** docs/superpowers/specs/2026-11-12-sokhan-voice-engine-design.md

## Global Constraints

- v1 target speech language is Persian only; translation input is English.
- No paid translation or speech API, no HeyGen integration, and no required cloud credentials.
- Persian must never be routed to a non-Persian voice.
- Actual synthesized duration must drive scene timing; speech must not be time-stretched or truncated to fit.
- No restricted or unclear-license model weights may be bundled.
- CPU-capable baseline is required; GPU acceleration is optional.
- Voice reference cloning requires permitted model licensing and explicit local consent.

## Review Focus

- Empty or malformed Persian text must fail before invoking a model.
- Backend errors or one failed chunk must not return a successful partial WAV.
- Unsupported pitch/emotion controls must be reported as unsupported, not silently ignored.
- Cache keys must change when voice, model revision, text, or controls change.
- Invalid audio headers, silence-only files, clipping, and truncated WAV output must fail QC.

---

### Task 1: TTS request contracts and capabilities

**Files:**
- Create: `sokhan/src/sokhan/tts/contracts.py`
- Create: `sokhan/src/sokhan/tts/capabilities.py`
- Create: `sokhan/tests/tts/test_contracts.py`

**Interfaces:**
- `TTSRequest(text: str, language: str, voice_id: str, controls: VoiceControls, output_path: str)`
- `VoiceControls(rate, pitch, energy, emotion, pauses, emphasis, pronunciation)`
- `TTSResult(status, output_path, sample_rate, channels, duration_seconds, model_id, model_revision, warnings)`
- Adapter capabilities explicitly list supported languages and controls.

- [ ] Test fa-only request acceptance and rejection of en/de/etc.
- [ ] Test unsupported controls are surfaced in warnings/errors.
- [ ] Test path traversal and output path confinement.
- [ ] Implement typed contracts and validation.
- [ ] Run focused tests and confirm PASS.

### Task 2: Model adapter and Persian compatibility backend

**Files:**
- Create: `sokhan/src/sokhan/tts/base.py`
- Create: `sokhan/src/sokhan/tts/registry.py`
- Create: `sokhan/src/sokhan/tts/persian_speech.py`
- Create: `sokhan/tests/tts/test_adapter.py`

**Interfaces:**
- `TTSAdapter.capabilities() -> TTSCapabilities`
- `TTSAdapter.synthesize(request: TTSRequest) -> TTSResult`
- Backend command execution uses argv arrays, bounded timeout, controlled environment, and no shell interpolation.

- [ ] Test fake adapter capabilities, process timeout, missing executable, non-zero exit, and missing output.
- [ ] Verify exact Mana-Persian-Piper code and model-weight licenses before making it the default.
- [ ] Implement adapter around the existing local executable only if its CLI and license are verified; otherwise mark backend BLOCKED and keep existing production path unchanged.
- [ ] Run adapter tests and confirm PASS.

### Task 3: Chunking, caching, and audio QC

**Files:**
- Create: `sokhan/src/sokhan/tts/chunking.py`
- Create: `sokhan/src/sokhan/tts/cache.py`
- Create: `sokhan/src/sokhan/tts/audio_qc.py`
- Create: `sokhan/tests/tts/test_chunking.py`
- Create: `sokhan/tests/tts/test_cache.py`
- Create: `sokhan/tests/tts/test_audio_qc.py`

**Interfaces:**
- `split_persian_text(text: str, max_chars: int, overlap_chars: int = 0) -> list[str]`
- `build_tts_cache_key(request: TTSRequest, model_revision: str) -> str`
- `validate_wav(path: Path, min_duration_seconds: float = 0.05) -> AudioQCResult`

- [ ] Test punctuation-aware chunk boundaries and preservation of every source character except documented normalization.
- [ ] Test cache invalidation by text, voice, model revision, and controls.
- [ ] Test valid WAV, empty file, truncated file, silence, invalid sample rate, and peak limit.
- [ ] Implement chunk concatenation with measured pauses; never time-stretch or truncate speech.
- [ ] Run focused tests and confirm PASS.

### Task 4: Voice controls and provenance

**Files:**
- Create: `sokhan/src/sokhan/tts/prosody.py`
- Create: `sokhan/src/sokhan/tts/provenance.py`
- Create: `sokhan/tests/tts/test_prosody.py`
- Create: `sokhan/tests/tts/test_provenance.py`

- [ ] Test bounded rate/pitch/energy values and unsupported emotion flags.
- [ ] Test pronunciation overrides and per-scene model provenance.
- [ ] Implement only controls supported by the active backend; use FFmpeg post-processing only for bounded signal-level adjustments.
- [ ] Run tests and confirm PASS.

### Task 5: TTS CLI and local smoke test

**Files:**
- Create: `sokhan/src/sokhan/tts/cli.py`
- Create: `sokhan/tests/tts/test_cli.py`
- Create: `sokhan/scripts/smoke_persian_tts.py`

- [ ] Test strict JSON input/output and non-zero exit on partial synthesis.
- [ ] Test the smoke command validates actual WAV metadata and signal QC.
- [ ] Implement CLI and smoke runner; do not download model weights during CI.
- [ ] Run Python tests and, when a licensed model is installed, run the real Persian phrase/paragraph smoke test.
