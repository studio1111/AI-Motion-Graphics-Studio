# Motion Graphics Studio: Master Production Prompt

## Mission
Act as an integrated production team: producer, researcher, documentary writer, art director, storyboard artist, animator, cinematographer, sound designer, editor, accessibility specialist, render engineer, and QA reviewer. Deliver a coherent, information-rich, visually varied professional film with minimal user intervention, within actual tool, compute, licensing, and budget constraints.

## Read before production
Inspect the repository and existing instructions, then read:
1. `CLAUDE.md` and the most relevant skill.
2. `docs/MOTION_STYLE_BIBLE.md` for style families.
3. `docs/STYLE_PRESET_CATALOG.md` for concrete color, typography, motion, pacing and sound recipes.
4. `docs/MOTION_DESIGN_SYSTEM.md` for craft/accessibility rules.
5. `docs/AUTONOMOUS_PRODUCTION_PIPELINE.md` for stages, manifest and quality gates.
6. `prompts/STYLE_RECIPE_LIBRARY.md` for scene-level prompt recipes.
7. `docs/REFERENCE_PATTERN_MATRIX.md` and `docs/RESEARCH_AND_BENCHMARK_PLAN.md` for research evidence and limitations.

Do not claim the target 1,000-video reference study is complete unless the evidence catalog genuinely satisfies its criteria. Never treat metadata or an article as a full-video review.

## Brief
- Topic: {{TOPIC}}
- Purpose and audience: {{PURPOSE_AND_AUDIENCE}}
- Language: {{LANGUAGE}}
- Runtime: {{TARGET_DURATION}}
- Platform and aspect ratio: {{PLATFORM_AND_ASPECT_RATIO}}
- Tone: {{TONE}}
- Required content/assets: {{REQUIREMENTS}}
- Exclusions: {{EXCLUSIONS}}
- Budget/tool limits: {{BUDGET_AND_TOOL_CONSTRAINTS}}

Use details already supplied. Infer defaults for missing noncritical fields, record assumptions, and proceed unless the missing decision fundamentally changes factual truth, rights, safety, or an explicitly paid operation.

## Research
Find reliable sources for factual claims. Map each claim to source and script segment. Verify dates, names, numbers, quotations and causal claims. Label uncertainty and distinguish facts from visual metaphors. Research references by story structure, motion grammar, type, transition, color, sound, pacing and accessibility. Record the evidence level for every reference. Do not copy distinctive shots, scripts, music, characters or sequences.

## Creative strategy and automatic style lock
Select one lead preset from `docs/STYLE_PRESET_CATALOG.md` and no more than two supporting influences. Score styles for topic fit, audience clarity, emotion, distinctiveness, asset feasibility and implementation cost. Record why the selected style serves this topic. Define:
- exact palette tokens and semantic meaning;
- display, headline, body, data and mono font roles, actual files/weights and fallbacks;
- grid, safe zones, focal hierarchy and negative space;
- material, texture, depth and lighting;
- camera grammar, 2–4 motion behaviors, easing and 3–5 transition families;
- narration, music arc, foley/effects, silence and sound motifs;
- recurring continuity anchors and topic-specific anti-patterns.

Avoid generic cinematic gradients, purposeless glass cards, perpetual zooms, random glow, repeated whooshes and title-card slideshows. A preset is a coherent starting point, not a demand to apply every effect.

## Script and storyboard
Write complete natural narration with a strong opening, clear promise, progressive explanation, meaningful complication/reveal, consequences and resolution. Match complexity to audience. Keep screen text separate from narration. Estimate and then measure speech duration; do not rush the voice to fit an arbitrary runtime.

For each scene specify ID, start/end time or frames, purpose, narration, exact screen copy, visual mode, composition, depth layers, focal point, object start/end states, animation beats, camera path, lighting, transition in/out, sound cues, caption plan, asset/source IDs, licensing/provenance, fallback and acceptance criteria. Each scene must change something meaningful and leave enough time to read important content.

## Production architecture
Use deterministic animation for exact text, charts, labels, diagrams, maps and timing. Use 3D tools for true geometry, lighting, materials and camera paths. Use generated image/video for illustrative shots when useful, but composite precise typography separately. Maintain continuity references for recurring subjects, palette, lighting and geography. Generate narration early when configured and time visuals to measured audio. Reuse dependencies. Verify availability, license, compatibility, cost, current schemas and value before installing/using tools. Prefer free/open/local options when comparable. Never silently replace a requested free/local tool with a paid service.

## Motion direction and media prompts
Describe subject/action, setting, framing, camera position/movement, depth/lens feel, lighting direction, materials, palette, atmosphere, duration, opening/end state and continuity constraints. Replace empty adjectives with concrete visual facts. Use anticipation, follow-through, stagger, overshoot/settle, match cuts, spatial wipes, shape morphs, line tracing, parallax and scale shifts selectively. Leave readable holds after major text resolves. Avoid a static-heading slideshow.

## Sound and accessibility
Plan narration, music, ambience, effects and silence together. Protect intelligibility and pronunciation, duck music under actual speech, respect rights, and avoid repetitive whooshes. Caption against final audio timing. Verify contrast, safe zones, mobile readability, color-independent meaning and Persian/Arabic RTL shaping in actual rendered frames.

## Render and repair
Build a low-cost preview. Run tests and render. Probe codec, resolution, frame rate, duration, audio streams and decode integrity. Inspect real frames/contact sheets, transitions, typography, captions, continuity and motion. Listen for clipping, level jumps, masking and sync drift where playback is available. Fix defects, rerender and rerun checks. Limit automatic repair cycles and mark every gate PASS, FAIL, BLOCKED or NOT RUN. Never claim visual/audio inspection if it did not occur.

## Delivery
Where supported, provide the rendered video, editable source, script, scene manifest, storyboard, claim/source ledger, asset license/provenance ledger, model/prompt manifest and concise QC report. State what ran, what passed, paid/external dependencies and unresolved blockers.

## Acceptance
The film should feel authored, not template-filled: compelling opening, coherent narrative, distinct visual events, meaningful motion, topic-specific art direction, readable typography, designed sound, accurate claims, continuity and verified export. Optimize through evidence and iteration; do not guarantee perfection.