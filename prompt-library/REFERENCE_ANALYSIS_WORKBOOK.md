# Reference Analysis Workbook for Any AI Assistant

This file is a reusable inspection protocol. Copy it into any assistant along with a public reference URL, screenshot sequence, transcript or legally accessible video. Keep observations separate from guesses and turn references into original production rules.

## 1. Evidence levels

- **L0, discovery only:** title, search result, thumbnail or link. May establish that a candidate exists, not what it does.
- **L1, source-page review:** source page, prompt, description or article reviewed, but the full video was not directly watched. Record text-derived claims only.
- **L2, direct video review:** video was watched directly from beginning to end at a useful viewing size. Record the access method and any playback limitation.
- **L3, timestamped breakdown:** direct video review plus timestamps for meaningful visual, narrative, camera, transition or sound changes. Use screenshots only when the source and use rights permit it.

Never use “watched” merely because a video embed, thumbnail, transcript or summary exists. A sampled review remains sampled and must not be reported as a full watch. A still image cannot prove motion, timing or sound.

## 2. Source card

For every candidate capture the stable ID, canonical source URL, title, creator and capture date; entry type; format and intended audience when stated; model/tool/stack explicitly named by the source; evidence level and exactly what was inspected; licence and reuse restrictions or “not verified”; category, relevance score and next action. When a tool is not stated, use “unknown” rather than inferring that the project has it installed.

## 3. Video breakdown table

For L2/L3, create one row per meaningful shot or state change, not every arbitrary second:

| Time in/out | Story function | Composition and camera | Visual system | Motion/transition | Typography | Sound/music | Readability | Confidence |
|---|---|---|---|---|---|---|---|---|
| 00:00-00:02 | Hook | Scale, angle, negative space | Palette, texture, subject | Entry curve, direction, continuity | Hierarchy and rough density | Beat, transient, ambience | Mobile size and safe area | Observed or inferred |

Record duration and whether playback was continuous, sampled or interrupted. Timecodes must match the source; never invent missing timing.

## 4. Craft questions

### Story and pacing
- What does the viewer know at the opening, middle and end?
- Is there a single visual thesis or a pile of unrelated effects?
- Where are the hook, setup, escalation, payoff and final hold?
- Which moments accelerate, and which intentionally let the viewer read or think?

### Composition and camera
- What owns the frame, and what supports it?
- How are negative space, scale, depth, perspective and focal hierarchy used?
- What motivates a camera move? What new information does it reveal?
- Which elements remain spatially anchored during a transition?

### Motion grammar
- Describe easing, anticipation, overshoot, settling, inertia, overlap and follow-through.
- Is the motion event-driven, beat-driven, voice-driven or continuous?
- Do connected elements share the same causal movement model?
- Are transitions based on shared shapes or positions, or arbitrary effects?
- If a loop is intended, do the first and last frame, cursor position and velocity match?

### Type, color and materials
- Identify type roles, text density, line length, alignment and hold duration.
- Record the palette, contrast hierarchy and semantic color mapping.
- Identify materials and lighting directions, but do not claim physical accuracy without evidence.
- Note where a text container or camera movement causes blur, crop or illegibility.

### Audio
- Separate music, voice, ambience and effects.
- Identify where the soundtrack changes structure and which visual events match measurable transients.
- Note voice intelligibility, ducking, loudness jumps, silence and the final tail.
- If no audio was heard directly, mark audio analysis as not observed.

## 5. Convert observations into an original studio recipe

Write six separate fields: (1) observed facts from the inspected material; (2) interpretation, labelled as interpretation; (3) transferable craft principle; (4) original implementation using a different subject, sequence and assets; (5) acceptance test that can pass or fail; and (6) anti-pattern plus how QA will detect it.

Do not copy a creator's entire prompt or recognizable shot sequence unless reuse is clearly licensed. Attribute sources and keep links. Use original scripts, palettes, assets and transitions.

## 6. Production-ready acceptance checks

- Every factual claim has a credible source or is clearly marked as illustrative.
- The first three seconds establish a specific hook without promising more than the film delivers.
- Each scene has a purpose and an explicit transition into or out of it.
- All text is checked at target playback size and remains visible long enough to read.
- Motion-critical frames are sampled before full rendering; overlaps, clipping, empty frames and off-grid beats are fixed.
- Audio peaks and beat times are measured when synchronization matters.
- Code-based animations can render arbitrary timestamps without hidden state when the engine requires deterministic seeking.
- Final output metadata, audio, captions, attribution and requested format are checked before delivery.

## 7. Prompt to run the workbook

Analyze this reference using the Reference Analysis Workbook. First state exactly what source material is accessible. Build an evidence card, then separate direct observations from interpretations. If the video itself is accessible, inspect it directly and create timestamped rows for significant shot or state changes. If only a page, prompt, transcript or thumbnail is available, do not pretend to have watched the video. Extract transferable craft principles and write an original recipe with story beats, composition, motion grammar, typography, color, sound, anti-patterns and acceptance tests. Respect attribution, source terms and asset licensing. Do not reproduce long creator-authored prompt text. End with the evidence level and unresolved unknowns.
