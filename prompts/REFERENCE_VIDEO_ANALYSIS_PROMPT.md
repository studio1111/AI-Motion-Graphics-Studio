# Reference Video Craft Analysis Prompt

Analyze a public motion-graphics video as a production researcher, not merely by summarizing the topic. Extract transferable craft rules. Do not recreate a creator's sequence shot-for-shot.

## 1. Declare evidence before conclusions
Choose one evidence level:
- **L0:** title, thumbnail or metadata only.
- **L1:** description/article/transcript/captions reviewed, but not the visual sequence in full.
- **L2:** complete video watched.
- **L3:** full or sufficiently broad timestamped analysis with representative frame evidence.
List exactly what was inspected and what could not be observed. Do not infer exact fonts, colors, frame rates, transitions or sound mix from a title or transcript. Mark estimated visual properties as estimates.

## 2. Story and structure
- Opening hook, visual contradiction or question; when the viewer promise is made.
- Narrative beats, reveals, complication, emotional shifts, explanatory steps and resolution.
- Timestamped scene/event breakdown, scene durations and overall pacing curve.
- Information density by section, quiet holds, recurring motifs and possible retention devices.
- Distinguish what appears causal in the story from what is only a visual association.

## 3. Typography and text behavior
- Font classification and likely role: display, headline, body, data, mono/technical or expressive accent. State exact family only when verified; otherwise describe visible traits and confidence.
- Weight, width, scale, tracking, line length, alignment, line breaks, hierarchy and negative space.
- Reveal method: word/phrase/glyph stagger, mask, clip, wipe, type-on-path, tracking change, morph, scale, crop or static hold.
- Approximate time to enter, settle and remain readable; describe easing as observed/inferred, not a fabricated numeric curve.
- Language and script support, captions, margins, contrast, and mobile-size legibility.
- How typography relates to narration stress and the intended meaning.

## 4. Color, composition and image materials
- Palette hierarchy and approximate HEX values only when sampled or clearly estimated. Mark them as estimated if not sampled.
- Light/dark ground, accent function, semantic color use and contrast.
- Composition, grid, focal hierarchy, scale changes, negative space, depth planes, camera axis and framing.
- Materials/textures, lighting direction, shadows, blur, grain, photographic footage, archive, vector shapes, UI, maps, 2.5D/3D, procedural imagery or mixed media.
- Continuity anchors: shape, color, light direction, camera axis, scale and object identity.

## 5. Motion, transitions and speed
- Motion vocabulary: anticipation, overlap, stagger, follow-through, overshoot/settle, path draw, rotation, spring, parallax, orbit, camera push/pull, match cut and state transformation.
- For major events, record start state, end state, approximate duration, direction, relative speed, easing impression and semantic purpose.
- Transition family and duration, where the transition begins/ends, and whether the next scene inherits shape, position, color, rhythm or meaning.
- Rhythm changes between fast and slow passages, holds after key data, and the connection between music beats and visual action.
- Separate visible evidence from interpretation. Avoid unsupported precise frame counts if the player/timing data was not inspected.

## 6. Voice and sound
- Presence/absence of narration; perceived delivery style, pacing, pauses, emphasis and intelligibility.
- Music energy arc, instrumentation/timbre, ambience, foley, transition effects, impacts, silence and recurring sound motifs.
- Map significant audio events to timestamps and visual actions where actually observed.
- Note whether voice remains dominant, if music appears ducked, and where the mix may mask words.
- Do not infer actual LUFS, compression settings, sample rate or exact voice model without metadata.

## 7. Output contract
Return:
1. Source URL, title, creator, date, runtime, language, capture date and evidence level.
2. What was actually inspected, including timestamps and selected-frame IDs if available.
3. Timestamped scene table with narrative purpose, screen copy, visual mode, type, palette/material, camera/motion, transition, sound and hold.
4. A compact design-token draft with confidence labels for typography, palette, grid, motion, transitions and audio.
5. Reusable abstract techniques and the narrative reason each is effective.
6. A fresh original treatment for a different topic, using only the transferable principles.
7. Implementation mapping to Remotion/SVG/CSS/GSAP/Three.js/Blender/FFmpeg and any optional AI asset tool that is actually available.
8. Measurable acceptance criteria and QC risks for typography, timing, audio, continuity, accessibility and export.
9. Evidence gaps and contradictory observations.

## Research ethics and accuracy
Respect source terms and copyrights. Do not reproduce a complete sequence, distinctive character, proprietary asset, copyrighted soundtrack or script. Do not claim a trend is universal from one video. Promote a technique to a general preset only when repeated observations across multiple creators and genres support it.