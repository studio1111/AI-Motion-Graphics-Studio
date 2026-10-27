# Autonomous Production Pipeline

This file defines the desired run contract. It is not a claim that every stage is already implemented in executable code.

## State machine
1. INTAKE: normalize brief, audience, language, target runtime, format, exclusions and budget; record sensible defaults.
2. RESEARCH: source factual claims; distinguish evidence from metaphor; retain capture dates and confidence.
3. SCRIPT: define hook, viewer promise, progression, complication, synthesis and resolution; separate narration from screen copy.
4. STYLE_LOCK: pick one lead style and at most two accents; lock palette, type roles, grid, materials, camera, motion and sound motifs.
5. STORYBOARD: specify timing, staging, focal point, depth, action, transition, sound, assets and acceptance checks.
6. ASSET_PLAN: prefer existing/local/vector assets where practical; track source, creator, license, generation endpoint, prompt version, checksum and fallback.
7. VOICE_AND_TIMING: generate voice early if configured; measure actual duration and align scene beats/captions.
8. BUILD: implement reusable scene components; exact text/data must be deterministic.
9. PREVIEW: render a representative low-cost preview.
10. QC: inspect real frames and audio where available; verify media metadata and decode integrity.
11. REPAIR: target verified high-impact defects and rerun affected checks.
12. FINAL_RENDER: render requested quality and format.
13. FINAL_QC: repeat checks on the final artifact.
14. PACKAGE: deliver files, manifests, sources/rights ledger and QC summary.

Persist state after each stage; retry from the last valid output rather than regenerating completed or billable assets.

## Stage gates
**Research:** every nontrivial factual claim has a source or explicit uncertainty. Record claim, URL, source date, script location and confidence. Never present metaphor as fact.

**Narrative:** opening creates curiosity and promise; ending fulfills it. Spoken content fits a natural pace.

**Style:** style is topic-specific, coherent and distinguishable. Fonts actually exist in the runtime, and unavailable choices have a documented fallback.

**Storyboard:** each scene includes ID, time/frame range, purpose, narration, exact screen copy, mode, composition, camera, state change, transitions, sound cues, source/asset IDs, fallback and checks.

**Asset/rights:** never assume an unclear license permits commercial use. Keep provenance for stock, music, fonts and generated media.

**Render:** output exists and decodes. Confirm codec, dimensions, FPS, duration and expected audio. Inspect sample frames around major scene changes.

## Suggested scene manifest fields
`id`, `startFrame`, `endFrame`, `purpose`, `narrationText`, `screenCopy`, `visualStyle`, `composition`, `depthLayers`, `cameraPath`, `motionBeats`, `transitionIn`, `transitionOut`, `soundCues`, `assetRefs`, `sourceRefs`, `fallback`, `acceptanceChecks`.
Implement these as typed/validated data in code. This illustrative list is not runtime validation.

## Quality scoring
Score inspected evidence from 0–5: narrative clarity/payoff, visual specificity, composition/hierarchy, purposeful motion/pacing, typography/readability, sound/synchronization, factual accuracy/provenance, continuity, accessibility and technical export. Any critical failure blocks final status. As a starting policy, if weighted score is below 82/100, run one targeted repair and reassess. Limit automatic repair to two cycles, then report unresolved defects honestly.

## Fallback ladder
1. Configured/local deterministic animation.
2. Existing asset or original SVG/diagram component.
3. Licensed stock or approved user-provided media.
4. Configured generative endpoint after live schema, terms and pricing checks.
5. Simpler original treatment that preserves the information.
6. BLOCKED if none can preserve truth or required content.

Do not ask an image/video model to create exact typography. Keep it in the renderer.

## Idempotency and resiliency
Use stable run IDs, scene IDs, content hashes, model IDs, prompt versions and cache keys. Reuse valid outputs and completed asynchronous jobs; do not double-submit paid work. Retry transient errors with bounded backoff and fail fast on credential, schema, license, and budget errors.

## Delivery package
Where supported, include final MP4, preview, editable project/source, narration, screen-copy script, storyboard/scene manifest, claim/source ledger, asset license ledger, model/prompt manifest, and a QC report with PASS, FAIL, BLOCKED or NOT RUN.

## Implementation status
The repository currently has a Remotion smoke-test composition and GitHub Actions render checks. This state machine remains the target production contract until executable topic-to-final video runs and verified artifacts prove otherwise.
