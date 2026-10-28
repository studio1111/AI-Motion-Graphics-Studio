# Prompt Motion Pattern Study and Production Transfer
**Research date:** 2026-10-28  
**Primary source:** [Prompt Motion](https://prompt-motion.com/)  
**Scope:** public entry pages and article text were inspected. This is not a claim of continuous playback or frame-by-frame analysis of every referenced video.

## 1. Main lesson from the collection

Prompt Motion presents prompt-led videos and reusable skills across product UI, phone, charts, diagrams, kinetic type, shapes, particles, characters, photos, music and code. Its article [AI motion graphics prompts: what 230 real examples show](https://prompt-motion.com/blog/ai-motion-graphics-prompts) reports 233 entries from 216 creators over September 23 to October 8, 2026, with prompts included for 230. The article reports a median prompt length of 26 words, with the middle half between 18 and 36 words. Product UI and kinetic type were the most common listed categories in the sample. It also says a 26-word showreel prompt was reused in 33 entries, whose reception varied widely.

**Transferable conclusion:** prompt length is not a reliable proxy for quality. A short prompt can be a strong starting point, but a production-grade workflow still needs a concept, constraints, timed beats, composition, motion specifics, source assets, iteration and verification. The project should use detailed structured recipes for direction, not assume that one mega-prompt guarantees a great result.

## 2. Example: one object morphs through a UI system

Source: [Shape morphing through UI states](https://prompt-motion.com/twoclipping-5cba86), credited on Prompt Motion to @twoclipping; the page identifies Opus 5.5 and HTML + Playwright as the named model/stack.

### What the published page documents
- One persistent shape changes across several interface states rather than cutting between unrelated scenes.
- State transitions are tied to a beat grid; the example specifies a 120 BPM track and a seven-bar structure.
- Direct manipulation is described for cursor-driven controls.
- Spring motion is implemented as a deterministic function of time, rather than relying on browser timers and hidden state.
- The build notes include sound analysis, per-beat proof frames, subframe rendering/motion blur, and a loop whose ending matches its beginning.
- The page explicitly calls out text overlap within morphing containers, blurred text under camera scaling and non-matching loop endpoints as pitfalls.

### Studio adaptation
Use a stable “object identity” across a short sequence: shape → control → chart → title, with one transformation motivated by the story at each step. Store each state as a named beat with start/end times and explicit easing. Use deterministic time-based animation for code renders, and validate a contact sheet of beat frames before full rendering. For the loop case, compare both position and velocity at the boundaries. This is an original adaptation; the source prompt itself is not copied into the library.

**Evidence limit:** this repository previously logged a short sampled playback of this 29-second example at several approximate timestamps, not a full uninterrupted watch. That entry remains L1 and is not marked “watched” or timestamp-analyzed.

## 3. Example: concept-led showreel and reusable prompt

Source: [The showreel prompt](https://prompt-motion.com/templates/showreel), written by Prompt Motion. The page describes an improved version built around one declared concept; transitions grow from the previous scene; typeface and palette are limited; multiple techniques are connected; beat timing, coded audio, deterministic time functions and proof-frame inspection are called out. It also states that a short generic prompt was reused across multiple creator outputs.

### Studio adaptation
For a short studio reel, start with a single sentence naming the core idea, then build five purposeful beats: hook, kinetic type, shape morph, dimensional or data/UI moment, final title. Connect them through a shared shape, movement direction or palette. Avoid a “bag of effects.” Limit the palette and font system intentionally, but don't impose the showreel constraints automatically on documentaries, data explainers or brand-specific work. The recipe `motion-design-showreel` encodes this as a reusable original recipe.

## 4. Example: product film as a repeatable skill

Source: [Reddit marketing tool launch video](https://prompt-motion.com/anthonyriera-9b1b2a), attributed to Anthony Riera. The entry describes a Claude Code skill that learns a product design system, interviews about the film, and builds/renders a launch or landing-page video using real product components, logo and music, with Remotion named as the stack.

### Studio adaptation
A credible product film pipeline should first inspect approved product inputs, ask only essential brief questions, storyboard real value propositions and then use real screenshots/components. Use a proof render to detect false UI states or invented features. A link to a skill repository is a research lead, not proof that the repository has been audited, installed or activated. This project has not installed that third-party skill.

## 5. Additional page-level examples: timing, sound, and connected motion

These are further source-page analyses, not claims of continuous video playback.

### Photo print app launch film
Source: [Photo print app launch film](https://prompt-motion.com/twoclipping-221cab), attributed to @twoclipping. The entry's build notes describe loading source footage in a seekable form, waiting for the media-seek completion before drawing frames, placing original/licensed sound effects at measured transient peaks, starting music on the downbeat, and checking each beat frame before full export. It documents browser/video gotchas such as text swapping inside a morphing mask and a shape flood that must scale beyond all frame corners to avoid a visible edge.

**Studio adaptation:** create an audio/visual event sheet with exact event time, visible state change, sound cue and acceptable transition range. If the renderer uses decoded footage, verify deterministic frame seeking before export. Build a beat contact sheet and inspect frame-difference spikes or single-frame pops. Protect critical copy with its own layer/mask, separate from the morphing object.

### Orange dot motion system
Source: [Orange dot motion system](https://prompt-motion.com/ultimaxbt-bbebf5), attributed to @ultimaxbt. The public page tags kinetic type, shapes and music and names HTML as the stack. The linked video has not been continuously reviewed here.

**Studio adaptation:** use a single persistent motif that changes state across typography, a graph, a control and a halftone field. Reuse the same underlying motion curve for coupled objects that are meant to feel connected, so a visual marker and its chart don't imply different physical timing. Validate exact start/end positions and velocity for loop closure.

### The “less AI-made” pattern
Source: [Why AI motion graphics look AI-made, and the prompt lines that fix it](https://prompt-motion.com/blog/make-ai-motion-graphics-look-less-ai). The article expands on connected shape grammar, consistent accent color, deterministic time functions, beat synchronization, proof-frame review and avoiding disconnected decorative effects.

**Studio adaptation:** the anti-pattern checklist should be specific to the chosen style, not a universal ban list. For a concept-led showreel, suppress unmotivated glows, shake and crossfades when they weaken continuity; for a different brief, use an effect only if it carries meaning. Keep the character or motif's position, motion, color and typography relationships explicit across state changes.

### Evidence boundaries
Prompt Motion's public pages can contain the exact prompt and build notes, but page text alone does not prove every movement or sound was present in the linked clip. These examples remain page-level evidence unless the video is actually reviewed. Never copy the creator's complete prompt into the studio library without explicit reuse permission; this report records transferable methods and original adaptations only.

## 6. Cross-check with official video prompting guidance

The [Runway prompting guide](https://academy.runwayml.com/guides/prompting-guide) distinguishes visible subject/environment/composition from motion and timing. For image-to-video it recommends emphasizing what changes, including camera movement and temporal progression, while allowing the input image to anchor the static appearance. It recommends starting with a clear/simple instruction and iterating, and describes sequential prompting through ordered events or timestamps.

The [OpenAI Sora prompting guide](https://developers.openai.com/cookbook/examples/sora/sora2_prompting_guide/) similarly emphasizes clear framing and action, and notes that movement is easier to control when a shot has one main camera move and one subject action with concrete timed beats.

### Combined project rules
1. Separate the fixed visual state from the intended motion, especially for image-to-video.
2. Specify a shot's single primary action and primary camera move before secondary details.
3. Use observable temporal events: start → main change → settle, with timestamps when useful and supported.
4. Keep identity, geometry, palette and light direction in a shared continuity block.
5. Iterate one or two variables at a time; do not fix a bad result by piling on adjectives.
6. Render proof frames or sample clips before a full export.
7. Treat automatic captions, audio analysis, exact frame inspection and code rendering as separate capabilities; enable them only when they are genuinely available.
8. Record the exact source, the review performed and its evidence level. Do not upgrade source-page inspection to full-video analysis.

## 7. Production changes mapped to this study

- `prompt-library/prompts.json`: expands the selectable collection to 77 structured, reusable recipes.
- `prompt-library/ADVANCED_MASTER_PROMPTS.md`: specialist prompts for long-form narrative, brand films, typography, data, T2V, I2V, sound, code rendering, revision and QC.
- `prompt-library/SCENE_PROMPT_TEMPLATES.md`: shot-level templates that operationalize temporal progression, continuity, evidence and repair.
- `tests/prompt-library.test.mjs`: ensures recipe count and domain coverage are not accidentally reduced.
- `docs/REFERENCE_SOURCE_REGISTRY.md` and `research/references.jsonl`: remain the source attribution and evidence tracking system.

## 8. What remains unproven

This study reviewed public page/article text and previously logged sampled playback of one reference. It does not claim to have watched all 230-plus examples or to have benchmarked multiple video models in an automated render lab. The prompt library is now broader, but it still needs measured render comparisons across chosen tools, aspect ratios and runtimes before quality improvement can be expressed numerically. No paid API or third-party skill is implicitly activated.
