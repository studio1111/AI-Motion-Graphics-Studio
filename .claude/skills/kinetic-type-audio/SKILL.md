---
name: kinetic-type-audio
description: Design kinetic typography and sound as a single timed composition, including type hierarchy, readable animation, narration, music, effects, silence, captions, and multilingual accessibility.
---
# Kinetic Type and Audio

## Typography
Define functional roles before choosing fonts: display, headline, body, data, mono/technical, and optional accent. Prefer two families; a third needs a clear job. Verify font files, license, glyph coverage, numerals, weights and actual renderer output.

For Persian/Arabic, test connected glyph shaping, RTL ordering, mixed Latin runs, punctuation, numerals, line wrapping and fallback fonts in rendered frames. Do not assume RTL is correct just because CSS direction is set.

## Type motion
Animate phrases or words when meaning benefits; do not automatically animate each character. Use masks, tracking, stagger, clipping, scale, type-on-path or shape morph only when tied to narrative meaning. Specify entry, transformation, readable hold and exit. Prevent clipped descenders, layout shifts, tiny text and motion that fights captions.

## Audio timeline
Plan narration first, then music, room tone/ambience, Foley/effects, silence and captions. Measure generated voice duration and validate pronunciation/prosody before timing scenes. Duck the music under actual speech. Use transient effects for meaningful impacts, reveals, mechanics and spatial travel, not every cut. Track music and sound licenses.

## Quality gates
Use captions aligned to final audio. Review speech clarity, masking, abrupt loudness changes, clipping, stereo compatibility and sync when audio inspection is available. Test mobile-size text and RTL captions. If a playback/check did not happen, mark it NOT RUN rather than implying it passed.
