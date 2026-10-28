# Professional Motion-Graphics Prompt Engineering Playbook

Version 1.0 · Original, reusable prompt patterns for the studio

This is a working prompt system, not a scrapbook of copied prompts. It distills transferable techniques from public guidance into original, editable recipes. It does not claim every recipe has been tested in every provider. Provider-specific instructions must be verified against the current model and service.

## 1. Universal director's prompt

Use this as the high-level instruction to an AI planner or human director. Replace every bracketed field with project facts. Do not pass this entire film-level prompt directly to a short-clip video model.

> You are the director and motion-design lead for an original [FORMAT] about [TOPIC], made for [AUDIENCE] to achieve [VIEWER OUTCOME]. Runtime: [DURATION]. Language: [LANGUAGE]. Frame: [ASPECT RATIO], [FPS]. Factuality: [RESEARCHED / EXPLANATORY / CONCEPTUAL]. Lead visual grammar: [STYLE]. The emotional arc is [OPENING STATE] to [COMPLICATION] to [REVEAL] to [PAYOFF]. Create a scene-by-scene plan where every scene advances the idea, reveals evidence, clarifies a relationship or creates a deliberate emotional beat. Lock the palette, type roles, grid, material language, light direction, depth, camera grammar, easing, transitions and sound motifs before detailed production. Keep exact text, charts, labels and factual diagrams in deterministic composition layers. Treat generated imagery as an illustrative plate unless its facts are independently verified. Include timing, narration, exact screen copy, start/end states, motion beats, audio cues, continuity rules, provenance and acceptance criteria for every scene. Do not invent statistics, citations, quotations, visual evidence, licenses or tool results. Make assumptions explicit, mark unknowns and use a bounded repair loop.

## 2. Six-layer prompt architecture

Keep prompts modular. A change to camera language should not silently rewrite the story or color system.

1. **Intent layer:** audience, purpose, topic, promise, tone, duration, platform and factuality.
2. **Story layer:** hook, question, stakes, progression, reveal, resolution and chapter handoffs.
3. **Art-direction layer:** style family, palette, typography, grid, composition, material, texture, lighting, depth and references.
4. **Shot/motion layer:** subject, one primary action, framing, camera path, motion beats, timing, start/end state and transition.
5. **Audio layer:** narration delivery, music arc, ambience, Foley, transition accents, silence and mix hierarchy.
6. **Validation layer:** factual/source checks, continuity, text readability, accessibility, provider limits, provenance and repair criteria.

For deterministic motion graphics, translate the shot plan into actual Remotion props and frame timings. Do not expect a text-to-video model to render exact typography, charts or a whole long film consistently.

## 3. Original shot-prompt formula

For text-to-video or generated b-roll, start with:

**[Shot size and angle] + [specific subject] + [one visible action] + [setting] + [one purposeful camera move with direction and speed] + [lighting] + [material/visual style] + [end state or reveal] + [continuity lock].**

Example, original and adaptable:

> Wide establishing shot of a rain-soaked elevated train line at blue hour. One train glides from frame left toward a distant station. The camera tracks slowly parallel to the train, keeping the platform geometry stable. Cool ambient sky light and warm window reflections define the palette. The shot settles as the train reaches the platform, leaving clean negative space in the upper-right for a separately composited title. Preserve architecture, direction of travel and light continuity.

Do not stack conflicting camera moves. Prefer one action and one primary camera move per short generated clip. Describe what should be visible and how it changes. Add detail only when it removes ambiguity. For image-to-video, preserve the supplied image's subject, composition, identity, palette and camera position, and describe only the intended motion plus constraints.

## 4. Style-family prompt recipes

Each recipe is an original scaffold. Fill the tokens from the approved brief and preset. A style is a coherent system, not a filter applied indiscriminately to every scene.

### A. Editorial kinetic typography
> Build [CLAIM] as a typographic argument on an asymmetric grid. Set [KEY PHRASE] in an oversized, high-contrast display face and reserve [ACCENT] for the word that changes the meaning. Reveal semantic phrases with a mask, tracking compression and a controlled stagger; transform one typographic form into a meaningful diagram element. Keep body copy aligned to a stable grid and hold the final claim long enough to read. Sound uses tactile paper/impact detail and one intentional silence before the reveal.

### B. Data journalism and infographics
> Explain [QUESTION] using only [VERIFIED DATASET]. Show source, date, unit, baseline, scale and uncertainty. Reveal one comparison at a time, animate marks from their correct values, and attach callouts to the data they describe. Use stable category colors and readable labels. Camera motion must never distort the comparison. If the dataset is absent, produce a clearly labeled conceptual diagram, not fake numbers.

### C. Scientific 2D / 2.5D
> Explain [MECHANISM] through cause, process and effect. Start in context, move to a clean cutaway, trace [VERIFIED PATH], reveal [COMPONENT RELATIONSHIP], then return to the whole system. Give each layer a stable material and semantic color. Use controlled parallax only to separate depth. Keep labels anchored to the correct component. Distinguish real structure from metaphor and do not invent mechanisms.

### D. Cinematic documentary
> Open on [SPECIFIC EVIDENCE OR DETAIL], then widen to [CONTEXT]. Build tension through framing, motivated movement, lighting direction and deliberate holds, not generic effects. Connect evidence with a motivated match cut to [MAP / OBJECT / TIMELINE]. Keep the palette disciplined and record the source of archival imagery. Atmosphere supports the voice and drops away when a key fact lands.

### E. Archival / tactile collage
> Assemble [STORY BEAT] from verified or licensed material, original paper-like shapes and annotation marks. Establish foreground, midground and background layers, then reveal a relationship by sliding, masking or registering the pieces into place. Preserve readable evidence and label reconstructions. Use controlled imperfections, not random jitter. Never fabricate a document, photograph, date stamp or historical artifact.

### F. Premium 3D product / technology
> Reveal [PRODUCT OR MECHANISM] from a specific macro detail. Maintain stable geometry, scale, material identity and logo integrity. Use a single purposeful orbit or dolly path to reveal [FUNCTIONAL FEATURE], with a key light and rim light motivated by the material. Keep reflections and depth of field controlled. Composite exact labels after rendering the clean plate. End in a composed hero state.

### G. Character-led 2D / shape animation
> Teach [CONCEPT] through an original character or abstract shape with a memorable silhouette. Preserve proportions, rig, props and screen direction. Stage anticipation, a readable action pose, follow-through and a settled explanatory pose. Let secondary motion support the main action. Tie Foley to meaningful contact, and pause while the concept is being explained. Avoid recognizable protected characters or designs.

### H. Swiss / modular information design
> Organize [PROCESS] on a precise grid with [BASE] and semantic accents. Show relationships through alignment, connection, reordering and progressive disclosure rather than flying cards. Keep hierarchy consistent while allowing the grid to evolve with the logic of the explanation. Use restrained easing, precise typography and deliberate negative space. Every module must communicate a distinct relationship.

### I. Generative / procedural abstraction
> Represent [SYSTEM RELATIONSHIP] using a deterministic rule: [RULE]. Begin with a sparse field, increase complexity as [NARRATIVE FACTOR] changes, then simplify to reveal [INSIGHT]. Seed all randomness for reproducibility. Keep a stable focal anchor and a legible mapping from visual behavior to concept. Sound follows important state changes. No visual noise without explanatory purpose.

### J. Geographic / historical timeline
> Anchor [EVENT OR ROUTE] to a sourced map and dated timeline. Establish orientation and scale before movement. Trace [VERIFIED ROUTE] while revealing dates and locations in sequence; connect place, artifact and year through motivated match cuts. Mark disputed boundaries and uncertainty. Do not animate a route or border that implies an unsupported causal claim.

### K. Vertical / social-native
> Start on [VISUAL CONTRADICTION OR RESULT] in the first beat. Keep one dominant subject and one central message in a 9:16 safe area. Alternate high-energy reveals with brief reading holds. Use large captions, strong contrast and clear hierarchy. Reserve platform UI zones. The ending must pay off the opening or provide a specific next insight, not merely fade out.

### L. Live action with graphic annotations
> Treat [APPROVED FOOTAGE] as the evidence anchor. Add only overlays that can be registered to the actual scene: [CALLOUT / MASK / ROUTE / MEASUREMENT]. Preserve real-world context, perspective and motion. State the source and meaning of every measurement. Transition from footage to a simplified diagram only when the diagram explains a real relationship. Never add invented telemetry or false annotations.

### M. Minimal / premium typography
> Express [IDEA] with [DISPLAY TYPE ROLE], deliberate negative space and a two-tone palette plus one signal accent. Use a small number of precise position, scale or tracking changes. Give the key phrase a long readable hold. Let sound be sparse and meaningful. Do not substitute generic luxury imagery for a specific idea.

### N. Mixed-media future craft
> Combine [PHOTOGRAPHIC OR 3D PLATE] with [VECTOR OR HANDMADE LAYER] under one repeatable compositing rule. Clearly distinguish evidence from metaphor. Match light direction, perspective, grain and palette. Use one transition that explains the concept. Keep exact text, labels and data separate from generated imagery.

## 5. Motion-direction vocabulary

Choose motion by narrative function, not by decoration.

- **Reveal:** mask wipe, occlusion reveal, line trace, aperture, light sweep.
- **Explain a system:** assembly, exploded view, path tracing, state transition, synchronized callout.
- **Compare:** aligned split screen, shared-scale morph, baseline growth, before/after with fixed camera.
- **Move through space:** dolly, tracking, pan, tilt, crane, orbit or parallax. State direction, speed and target.
- **Emphasize type:** word/phrase stagger, tracking squeeze, baseline shift, crop reveal, shape morph.
- **Create weight:** anticipation, acceleration, overshoot, settle, follow-through and contact.
- **Bridge scenes:** match cut, spatial wipe, shape correspondence, sound bridge, map-to-object transition.
- **Create calm:** static camera, slow light change, long hold, quiet ambience or intentional silence.

For each animation specify start state, trigger, duration, easing, peak, end state and hold. Avoid chaining many large moves into one shot. Remotion timings should be frame-based and deterministic; use springs or easing only where they serve the action.

## 6. Sound-design prompt

> Design the audio around [NARRATIVE ARC]. Narration is the intelligibility anchor, with [VOICE CHARACTER, PACE AND PRONUNCIATION NOTES]. Music starts [ENERGY], evolves at [STORY TURN], peaks at [REVEAL] and resolves by [ENDING]. Use [INSTRUMENT/TIMBRE] as a recurring motif. Add Foley only for visible material or action; add transition cues only at motivated changes. Leave [SILENCE OR LOW-DENSITY WINDOW] before [IMPORTANT LINE]. Duck music under speech and avoid clipping, abrupt level jumps, repetitive whooshes or unlicensed tracks. Record the actual voice engine, music source and rights/provenance.

## 7. Negative prompt and repair instructions

A negative prompt should name visible or audible failure modes, not a long generic pile of adjectives. Adapt per model and test whether that model honors negative constraints.

**Visual continuity guardrail:** unstable identity, changing product geometry, inconsistent wardrobe/props, shifting architecture, mismatched light direction, broken perspective, warped hands or labels, unintended camera shake, flicker, jitter, ghosting, texture crawl, accidental cuts, unreadable text baked into footage, and decorative detail that competes with the focal point.

**Motion guardrail:** conflicting camera paths, multiple simultaneous primary actions, unmotivated orbit, perpetual zoom, random easing, no anticipation or settle, excessive overshoot, abrupt end-state changes, and motion that hides labels.

**Editorial guardrail:** fabricated statistics, source-free quotes, invented maps/borders, fake UI, misleading chart axes, tiny captions, text collisions, unverified archival evidence, unlicensed characters/logos/music, and factual labels placed over the wrong object.

**Audio guardrail:** narration masking, clipping, abrupt loudness jumps, excessive transition effects, repetitive impacts, unsupported voice imitation, and unverified music rights.

**Repair prompt:** “The observed defect is [SPECIFIC DEFECT] at [TIMECODE / SCENE]. Preserve [WHAT ALREADY WORKS]. Change only [ONE OR TWO VARIABLES]. The required result is [OBSERVABLE CONDITION]. Keep [CONTINUITY LOCKS]. Re-render this scene and compare against [ACCEPTANCE TEST].”

## 8. Duration and chapter planning

Runtime does not dictate a fixed scene count. Plan around meaning, measured speech, visual complexity and reading time.

| Runtime band | Story shape | Production guidance |
|---|---|---|
| 5–15 seconds | Hook, one idea, payoff | One dominant visual action; avoid exposition overload |
| 15–60 seconds | Hook, development, payoff | 3–6 purposeful beats; vary reveals and holds |
| 1–3 minutes | Question, explanation, turn, resolution | 6–12 scenes as a starting hypothesis, then adjust to actual content |
| 3–10 minutes | Chapters and evidence progression | Recur to visual motifs, vary density, recap before complex turns |
| 10–30 minutes | Chapter arc plus global arc | Chapter opens, section-specific reveal, short recap and handoff |
| 30–60 minutes | Multi-chapter documentary / lesson | Separate renderable chapters, manifest checkpoints, continuity ledger, voice-first timing and chapter-level QC |

These are planning heuristics, not hard scene-count rules. A quiet scene can be long if it carries information or emotion; a complex diagram may need more time than narration alone suggests. For long-form jobs, checkpoint outputs, reuse completed assets, avoid regenerating valid work and account for memory, storage, API quotas and workflow timeouts before rendering.

## 9. Provider-specific adaptation checklist

Before sending a prompt to a model or service, verify:

- Whether the task is text-to-video, image-to-video, text-to-image, voice, avatar, 3D or deterministic composition.
- Maximum clip length, aspect ratios, resolution, supported languages and whether audio is generated.
- Whether camera controls exist outside the prompt. Avoid issuing conflicting directions in two places.
- Whether exact text is reliable. If not, composite text separately.
- Whether a reference image should be preserved or transformed, and whether identity/voice consent is present where needed.
- Cost per attempt, credit availability, latency, rate limits, retries, output format and retention.
- Terms, rights, provenance and whether user-supplied assets can be processed.
- How the result will be validated before it enters the final timeline.

A provider name in a plan is not evidence of an active integration. Record “not connected”, “not tested” or “blocked” honestly.

## 10. Reference methods and source policy

The following public guides inform the general method in this playbook. They are not copied as a prompt collection and do not establish that any specific prompt was run successfully here.

- Runway, [Text-to-Video Prompting Guide](https://help.runwayml.com/hc/en-us/articles/42460036199443-Text-to-Video-Prompting-Guide): separate visual description from motion description and refine in iterations.
- Runway, [AI Camera Prompts](https://runway.com/resources/ai-camera-prompts): specify shot size, angle, movement, speed, subject/action and what the move reveals.
- Adobe Firefly, [Effective Video Prompts](https://helpx.adobe.com/uk/firefly/web/work-with-audio-and-video/work-with-video/writing-effective-text-prompts-for-video-generation.html): make subject/action, style, camera and temporal behavior explicit.
- Remotion, [Timing and Trimming](https://www.remotion.dev/docs/timing): model timeline placement and duration deterministically.
- Remotion, [Animating Properties](https://www.remotion.dev/docs/animating-properties): use explicit frame ranges and controlled easing.

Collect techniques, not entire proprietary prompt text. Keep attribution in the research notes, do not scrape behind access controls, do not bypass service limits, and do not copy a creator's distinctive finished work. A reference entry must identify its evidence level. Metadata and an article are not equivalent to a watched video or timestamped visual analysis.

## 11. Scene acceptance contract

Every scene should be rejected or repaired if any critical condition fails:

- The scene has one clear purpose and advances the narrative.
- The main action, camera move and final state are unambiguous.
- The visual matches the topic and approved art direction.
- Exact text is separately composited, readable and language-correct.
- Narration and caption timing are aligned to actual audio where available.
- Charts, maps, dates, claims and quotes have traceable sources or are explicitly labeled conceptual.
- Recurring subjects, props, light, palette, screen direction and geography remain continuous.
- Audio supports the scene without masking the voice.
- Assets have provenance and the planned fallback is viable.
- Render and creative-review status are separately reported as PASS, FAIL, BLOCKED or NOT_RUN.
