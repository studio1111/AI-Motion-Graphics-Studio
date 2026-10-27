# Motion Design System

The style bible establishes a visual personality. This system maintains craft quality across all styles.

## Hierarchy and composition
- Every frame has one primary message, one focal point, and a supporting layer.
- Use scale, contrast, position, weight, spacing, and timing before adding effects.
- Treat negative space as an active component.
- Stagger semantic groups; do not move every element simultaneously.
- Each scene has an entry, transformation, readable hold, and exit.
- Establish foreground, subject plane and background only when depth improves comprehension.

## Typography system
Define roles first: display, headline, body, data, mono/technical, and optional expressive accent. Prefer two font families, with a third only when it has a distinct purpose. Do not pick fonts only because they are fashionable. Choose by subject, tone, legibility, license, installed availability and language coverage.

Test the actual renderer for:
- all required glyphs, weights, diacritics and numerals;
- line wrapping, punctuation, fallback substitution and font loading;
- Persian/Arabic shaping, connected glyphs, RTL ordering, mixed Latin runs and bidirectional punctuation;
- safe margins, contrast, caption speed and mobile-size readability.

Use expressive display type for short statements, not long paragraphs. Keep exact copy in the deterministic renderer instead of generated video frames.

## Color architecture
Create named tokens for canvas, surface/paper, primary text, secondary text, primary accent, optional alert accent, semantic data colors, shadow and highlight/material. A 60/30/10 distribution can be a starting heuristic, never a rule. Maintain contrast and stable semantic meanings. Use labels or shape patterns in addition to color. Gradients, glows and grain require a topic-specific reason.

## Movement specification
For every important animated property define start/end state, duration, easing, stagger, direction and semantic purpose.
- Ease-out: entrances and settling.
- Ease-in: departures and acceleration into cuts.
- Ease-in-out: controlled state transitions.
- Spring: elastic energy when the material and tone justify it.
- Linear: data progress, continuous paths and deliberate mechanical movement.
- Anticipation/follow-through: makes action readable and credible.
- Overshoot/settle: selective emphasis or material weight.
- Parallax: only when the depth relation supports understanding.
- Shape morph/match cut: only when the relationship between ideas or forms is meaningful.

At 30 fps, starting heuristics are 6–10 frames for micro-movement, 10–20 for a compact entrance, 18–36 for a major transition, and 30–60+ for a dense diagram or important title hold. These are tunable ranges, not fixed prescriptions. Narration, information load and audience determine timing.

## Transition grammar
Choose 3–5 families per film and establish when they apply: spatial push, shape match, wipe/mask, scale match, line/path travel, camera pass, paper cut, motivated glitch, or a deliberate hard cut. Maintain spatial and conceptual continuity. Avoid random preset stacking, constant blur, inexplicable spins and transitions that obscure meaning.

## Rhythm and scene pacing
Begin with a specific question, contradiction, consequence or surprising result. State the viewer promise early. Alternate dense explanations with quiet emotional beats, wide views with close details, and motion bursts with holds. Resolve the central question; do not finish with an unrelated inspirational sentence.
- Short beats suit one signal or transition.
- Longer holds suit data, maps and complex relationships.
- Important statements need breathing room.
- Faster cuts need a reason in stakes, action or music.
- Do not force a cut every fixed number of seconds; one scene can change internally.

## Sound architecture
Treat voice, music, ambience, Foley/effects, silence and captions as one timeline.
- Narration anchors information; protect intelligibility and pronunciation.
- Music supports emotional arc rather than filling every gap.
- Duck music under speech using automation tuned to the actual voice and track.
- Use effects for significant impacts, reveals, mechanics, scale changes and motivated transitions, not every cut.
- Silence or room tone can create useful contrast.
- Track provenance and licenses for music and effects.
- For TTS, check duration, prosody, pronunciation, artifacts and language support before timing the animation.
- Caption from final voice audio timing, not estimates from an early script.

## Accessibility and final checks
Check safe zones, contrast, caption timing, RTL shaping, bidirectional punctuation and reading speed. Avoid strobe effects and rapid luminance changes. Verify output dimensions, FPS, duration, codec, audio streams and decodability. Review the real rendered frames at the beginning, transitions, dense information and ending, plus audio when playback is available.

## Anti-generic review
1. Could these visuals belong to any random topic? Make the metaphor and materials more specific.
2. Does each effect clarify, reveal, compare or carry emotion?
3. Are type and palette choices intentional and available in the runtime?
4. Are at least three genuinely different visual events used?
5. Is there contrast between motion and stillness?
6. Are facts, charts and quotations sourced?
7. Was the real output inspected rather than just the prompt?
