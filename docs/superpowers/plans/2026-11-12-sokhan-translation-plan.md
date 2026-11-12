# Sokhan English-to-Persian Translation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox syntax for tracking.

**Goal:** Implement a local-only English-to-Persian translation subsystem that preserves Remotion scene identity and exposes editable Persian output.

**Architecture:** Python translation package with a strict JSON CLI contract; Node.js remains the orchestrator. Translation adapters are license-gated and injected behind a narrow interface. No network translation APIs are used.

**Tech Stack:** Python 3.11+, pytest, Node.js 20, existing Node test runner.

**Spec:** docs/superpowers/specs/2026-11-12-sokhan-voice-engine-design.md

## Global Constraints

- v1 supports exactly English source text to Persian target text.
- No paid translation or speech API, no HeyGen integration, and no required cloud credentials.
- Preserve scene ordering, IDs, timestamps, markup boundaries, source references, and speaker notes.
- Translation must never silently omit source sentences.
- Do not bundle restricted or unclear-license model weights.
- Python is not required for plan-only or voice-off runs.
- Existing production options remain backward compatible unless separately approved.

## Review Focus

- Empty or whitespace-only source segments must return explicit validation errors, not disappear.
- Mixed English/Persian names and technical terms must be preserved or glossary-translated deterministically.
- Very long scenes must be segmented without losing order or scene IDs.
- Ambiguous or untranslated fragments must be surfaced as warnings, not hidden behind fabricated confidence scores.
- Malformed model output or partial JSON must fail closed without producing a successful translation manifest.

---

### Task 1: Translation contract and schema

**Files:**
- Create: `sokhan/pyproject.toml`
- Create: `sokhan/src/sokhan/__init__.py`
- Create: `sokhan/src/sokhan/contracts.py`
- Create: `sokhan/tests/test_contracts.py`

**Interfaces:**
- Produces `TranslationRequest`, `SceneSegment`, `TranslationResult`, `TranslatedSegment`, and `TranslationWarning` typed data models.
- Request fields: schema_version, source_language="en", target_language="fa", segments[], glossary{}.
- Result fields: schema_version, status, source_language, target_language, model_id, model_revision, segments[], warnings[].

- [ ] Write failing tests for accepted English-to-Persian request and preservation of scene_id, order, start_frame, end_frame, and source_refs.
- [ ] Test rejection of unsupported language pairs, missing IDs, invalid frame ranges, empty source, and oversized segments.
- [ ] Run `python -m pytest sokhan/tests/test_contracts.py -q`; expect failures before implementation.
- [ ] Implement Pydantic-free dataclasses/stdlib validation unless existing repo conventions require a dependency; avoid adding runtime dependencies for contracts.
- [ ] Run the focused tests and confirm PASS.

### Task 2: Glossary and Persian editorial normalization

**Files:**
- Create: `sokhan/src/sokhan/glossary.py`
- Create: `sokhan/src/sokhan/persian_text.py`
- Create: `sokhan/tests/test_glossary.py`
- Create: `sokhan/tests/test_persian_text.py`
- Reuse: `src/production/narration.mjs` behavior as reference; do not duplicate Node logic blindly.

**Interfaces:**
- `apply_glossary(text: str, glossary: dict[str, str]) -> str`
- `normalize_persian_translation(text: str) -> str`
- Preserve original English names if no glossary rule exists.

- [ ] Test terminology replacement with case-insensitive English keys and stable Persian values.
- [ ] Test Arabic Yeh/Kaf normalization, punctuation, ZWNJ, repeated whitespace, and mixed Latin tokens.
- [ ] Implement deterministic glossary application and Persian editorial normalization.
- [ ] Run focused tests and confirm PASS.

### Task 3: Local translation adapter and model registry

**Files:**
- Create: `sokhan/src/sokhan/adapters/base.py`
- Create: `sokhan/src/sokhan/adapters/registry.py`
- Create: `sokhan/src/sokhan/adapters/local_transformers.py`
- Create: `sokhan/src/sokhan/model_registry.json`
- Create: `sokhan/tests/test_translation_adapter.py`
- Create: `sokhan/tests/fixtures/translation_cases.json`

**Interfaces:**
- `TranslationAdapter.capabilities() -> AdapterCapabilities`
- `TranslationAdapter.translate(segments: list[SceneSegment], glossary: dict[str, str]) -> list[TranslatedSegment]`
- `ModelRegistry.resolve(model_id: str) -> ModelRecord`
- `ModelRecord` includes immutable revision, model-weight license, source URL, checksum policy, supported task, and hardware notes.

- [ ] Test adapter capability rejection for any task other than en-to-fa.
- [ ] Test fake adapter output alignment, missing segment detection, and malformed response rejection.
- [ ] Verify candidate model card and weight license before registering a concrete default; do not assume license from repository code.
- [ ] Implement lazy local model loading and explicit cache directory; never download weights during CI tests.
- [ ] Run adapter tests with fake model; mark real-model smoke test BLOCKED until a verified model is installed.

### Task 4: Translation CLI, caching, and fixtures

**Files:**
- Create: `sokhan/src/sokhan/cli.py`
- Create: `sokhan/src/sokhan/cache.py`
- Create: `sokhan/tests/test_cli.py`
- Create: `sokhan/tests/test_cache.py`
- Create: `sokhan/tests/fixtures/english_to_persian.json`

**Interfaces:**
- `python -m sokhan translate --input request.json --output result.json`
- Cache identity: source segment text + model revision + glossary revision + normalization/config version.
- CLI returns non-zero on any missing/partial segment or model failure.

- [ ] Test JSON stdin/file request parsing and schema validation.
- [ ] Test cache hit/miss and invalidation when source text, glossary, or model revision changes.
- [ ] Test no partial success when one of multiple scenes fails.
- [ ] Implement CLI and atomic result writes.
- [ ] Run all Python translation tests and existing `npm test`.

### Task 5: Translation evaluation

**Files:**
- Create: `sokhan/evaluation/en-fa-reference-set.json`
- Create: `sokhan/evaluation/README.md`
- Create: `sokhan/tests/test_evaluation_coverage.py`

- [ ] Add reviewed evaluation cases for names, technical language, idioms, numbers, punctuation, long sentences, and mixed-script input.
- [ ] Test each fixture produces a non-empty Persian result for every source segment.
- [ ] Document human review rubric and prohibit self-reported model confidence as a substitute for evaluation.
- [ ] Run test suite; publish evaluation status as NOT RUN until real model outputs are reviewed by a Persian speaker.
