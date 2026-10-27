# Motion Design System

## Hierarchy
Each frame gets one primary message and focal point. Establish hierarchy through scale, contrast, position, weight, spacing and timing before effects. Use negative space, stagger semantic groups, and give scenes a readable entry, transformation, hold and exit.

## Typography
Define roles: display, headline, body, data, mono/technical, optional accent. Two families usually suffice. Verify files, licensing, weights, glyph coverage and actual renderer support. Test Persian/Arabic connected glyphs, RTL order, mixed Latin, punctuation, numerals, line wrapping and font fallback in rendered frames. Keep exact text separate from generated footage.

## Color
Define tokens for canvas, surface/paper, primary/secondary text, accent, warning accent, semantic data, shadow and material highlight. A 60/30/10 ratio is a heuristic, not a rule. Preserve contrast and stable meaning; add labels/patterns so color is not the only signal. Avoid unmotivated gradients/glows.

## Motion vocabulary
For important properties specify start/end state, duration, easing, stagger, direction and semantic purpose. Ease-out for entrances; ease-in for departure; ease-in-out for state changes; spring for justified elasticity; linear for data/progress paths; anticipation/follow-through for readable action; overshoot/settle for selective emphasis; parallax only when depth helps; morph/match cuts only when relationships support them.

At 30 fps, starting heuristics: 6–10 frames for micro-motion, 10–20 for a compact entrance, 18–36 for a major transition, and 30–60+ for a dense diagram/title hold. Tune to narration and information load.

## Transition grammar
Choose 3–5 families: spatial push, shape match, mask/wipe, scale match, path travel, camera pass, paper cut, motivated glitch or deliberate hard cut. Maintain spatial/conceptual logic. Avoid random presets, excess blur and unexplained spins.

## Rhythm
Open with a specific question, contradiction, outcome or surprise, then establish a promise. Alternate dense explanations and quieter beats, close and wide, motion and holds. Scene duration follows information load; do not force cuts at fixed intervals.

## Sound
Treat voice, music, ambience, Foley/effects, silence and captions as one timeline. Protect speech clarity/pronunciation, duck music under actual voice, use effects for meaningful events only, preserve room tone/silence when useful, and track audio provenance. Verify TTS duration and pronunciation before timing animation. Caption from final audio.

## Accessibility and QC
Check safe margins, contrast, RTL shaping, bidirectional punctuation, caption speed, mobile readability and flashing risk. Verify dimensions, FPS, duration, codec, audio streams and decodability. Inspect actual frames across opening, transitions, dense scenes and ending; listen when playback is available.

## Anti-generic checklist
1. Is the visual metaphor topic-specific?
2. Does every effect explain, reveal, compare or convey emotion?
3. Are font and palette choices intentional and available?
4. Are multiple visual events used, not only zoomed title cards?
5. Does pacing contrast motion and stillness?
6. Are claims/charts sourced?
7. Was the actual output inspected?
