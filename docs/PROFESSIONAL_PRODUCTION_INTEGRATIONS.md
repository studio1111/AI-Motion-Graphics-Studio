# Professional Production Integration Architecture

Status: implementation contract and integration plan, not a claim that every provider is connected.

## Goal
Produce original, polished, platform-ready motion graphics through a repeatable pipeline. Remotion is the deterministic composition and final-render authority. External creative services are optional asset or draft providers; they must not silently replace the core renderer, invent research, or become mandatory for local builds.

## Provider roles

| Tool | Appropriate role | Boundary / integration gate |
|---|---|---|
| Remotion | Frame-accurate composition, exact text, diagrams, charts, captions, transitions, final MP4 | Core renderer; pin versions and test real output |
| FFmpeg / FFprobe | Audio mix, transcode, decode checks, media metadata, frame extraction | Required technical QC |
| Firecrawl | Source discovery and evidence collection | Optional; explicit opt-in, preserve URL/title/date and claim-to-source mapping |
| TubeLab | Find reference videos, channel patterns and outlier examples | Research only; store video IDs, metadata and observed pattern. Never infer quality from views alone |
| Cavalry (Cav) | Author procedural motion assets and reusable animation elements | Separate authoring tool, not assumed installed in CI; export portable assets and record provenance |
| Higgsfield | Generate image/video plates or stylized shots | Optional; schema, cost, rights and output checks before use |
| Image-to-Video tools | Add controlled motion to approved stills | Keep source image and prompt; inspect temporal consistency and artifacts |
| MotionVid | Generate draft scenes or a complete alternative cut | Treat as a provider-rendered draft; review before importing/using |
| InVideo | Research, draft, assemble or edit provider-side video projects | Do not assume its workspace/timeline is available to the CLI |
| HeyGen | Presenter/avatar scenes, narration, translation or lip-sync when requested | Consent and voice/identity rights are mandatory; do not use for impersonation |
| AI Voiceover by ManyMotions | Optional narrated MP3 generation | Prepare and show credits before generation; never spend credits without user authorization |
| AhaMotion | Concept-explainer drafts for educational topics | Treat as a draft/visual reference, not automatically as the final Remotion composition |
| Supabase | Optional job metadata, run state, provider job IDs and asset provenance | Not required for local production. No secrets or large media in database rows; use least-privilege policies |
| Claude / storyboard model | Topic-specific script and scene planning | Explicit paid-provider opt-in; validate output against a schema and fact-check sourced claims |

A tool being named in this table does not mean it is installed, authenticated, free, enabled or wired into the repository. Check its actual connection, capabilities, current price/credits, license and supported output formats before calling it.

## End-to-end production contract
1. **Intake:** validate topic, audience, language, duration, platform/aspect ratio, tone, factuality level, budget ceiling and prohibited content. Save the normalized brief.
2. **Research:** distinguish verified claims, estimates, opinions and metaphors. Store source URL, title, publisher, date, retrieval time and the claims supported. If research is unavailable, label the film conceptual rather than presenting invented facts.
3. **Narrative:** write a specific hook, clear promise, progressive explanation, visual reveal and satisfying conclusion. Keep narration separate from concise screen copy.
4. **Art direction:** select one lead style and at most two accents. Lock palette, typography roles, grids, textures, lighting, depth, transitions, motion curves and audio grammar before scene production.
5. **Storyboard:** each scene must declare purpose, start/end frames, narration, exact on-screen text, layout, visual metaphor, focal point, layers, camera path, motion beats, transition, sound cues, asset references, fallback and acceptance checks.
6. **Asset generation:** prefer deterministic vector diagrams and exact UI/text for information. Use generated footage as source plates only where it adds meaning. Track provider, prompt, model, asset ID, rights/license and fallback.
7. **Voice and timing:** generate or import narration before final timing. Measure actual audio duration; align scenes and captions to speech, never truncate speech to fit an arbitrary target. Use local voice when available and supported.
8. **Build:** compose scenes from reusable Remotion components. Use deterministic data and exact text; do not rasterize essential labels into AI imagery.
9. **Preview:** render a low-resolution or representative-frame preview first when possible. Check pacing, typography, visual continuity, topic specificity and whether every scene advances the story.
10. **Repair:** fix verified high-impact issues, then rerun affected tests and render checks. Limit automatic repair cycles and report unresolved defects.
11. **Final render:** render requested dimensions, FPS, codec and audio format.
12. **Final QC:** confirm file exists, decodes, matches requested dimensions/FPS/duration, contains expected audio/captions, has no clipped text or missing assets, and inspect representative frames plus listen to audio when playback is available.
13. **Package:** include MP4, SRT/VTT when applicable, storyboard, brief, source ledger, asset provenance, QC report and known limitations.

## Creative quality rubric
Score observed evidence from 0 to 5 in each category; do not mark a category reviewed unless the actual artifact was inspected.
- Narrative hook and payoff
- Topic-specific art direction
- Composition and visual hierarchy
- Motion quality, easing, anticipation and follow-through
- Typography and reading time
- Transitions and continuity
- Sound mix, voice clarity and meaningful effects
- Factual accuracy and source provenance
- Accessibility, captions, contrast and safe margins
- Technical integrity and requested format

Use a weighted score only as a triage heuristic. Critical factual, consent, rights, corruption or readability failures block delivery regardless of total score. Distinguish automated technical checks from human visual/audio review.

## Provider adapter contract
Any provider adapter added to the CLI should implement these concepts without leaking provider-specific payloads into scene components:
- capabilities: supported task types, languages, durations, aspect ratios and output formats.
- estimate: expected cost/credits, latency and required inputs before generation.
- submit: idempotent request with a persisted run ID and sanitized prompt/input metadata.
- poll: bounded status polling with timeout, retry policy and explicit terminal failure.
- collect: download or import outputs into a per-run asset directory; validate MIME type, size and media decode.
- provenance: provider, model/version, job ID, prompt hash, source assets, license/consent evidence and timestamp.
- fallback: deterministic local scene, approved asset, or a clear BLOCKED result.

Use bounded retries with exponential backoff for transient errors only. Do not retry authentication, policy, invalid-schema, quota or billing errors blindly. Do not log API keys, signed URLs or private voice/avatar data. Do not auto-spend paid credits: require explicit opt-in and enforce the configured budget before submission.

## Persistence and reliability
Persist a versioned run manifest after each completed stage. A retry should reuse valid artifacts, not regenerate narration or footage unnecessarily. If Supabase is configured, store only run metadata, state transitions, asset references and sanitized error summaries. Keep media in an appropriate object store or run artifact, not as large database blobs. Enforce owner-scoped row-level security, service-role secrets only in server-side environments, and retention/cleanup policies. Local filesystem manifests must remain a valid fallback.

## Reference study: 1,000 videos
Do not claim the study is complete until actual reference records and review evidence exist. For every reference store video ID/URL, creator/channel, publication date, duration, language, genre, format, observed scene patterns, typography, color, motion, transitions, sound, narrative structure, evidence level and reviewer confidence. Separate metadata-only records from transcript review, sampled-frame review and full watch-through. Include diverse genres and counterexamples; avoid counting duplicate uploads as separate references. Use views as discovery signals, not proof of craft quality. Respect platform terms and copyright: analyze patterns, do not copy a creator's footage, script or distinctive protected assets.

## Definition of done
A release is complete only when:
- automated validation and tests pass;
- the requested MP4 exists and passes media checks;
- representative frames and audio have been reviewed, or clearly marked NOT RUN;
- captions and text pass language-specific layout checks, including Persian RTL when requested;
- source and asset provenance is packaged;
- paid-provider use, missing credentials, unavailable models and unresolved defects are disclosed;
- no external service is described as integrated unless a real end-to-end test proves it.