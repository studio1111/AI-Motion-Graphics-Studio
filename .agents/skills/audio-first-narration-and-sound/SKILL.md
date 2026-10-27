---
name: audio-first-narration-and-sound
description: Create narration-led motion graphics with precise voice timing, music, sound effects, mix control, captions, and multilingual accessibility.
---
# Audio-First Narration and Sound

## Sequence
1. Write narration for speaking, not essay prose.
2. Verify pronunciation of names, acronyms, and numbers.
3. Generate or record voice using a configured local or remote provider; do not assume a provider is free or available.
4. Measure actual duration and phrase boundaries.
5. Time scenes to the real voice track, allowing breathing room.
6. Compose music and effects around speech.
7. Generate captions from final audio timing and inspect synchronization.

## Voice direction
Specify language/accent only as requested or reasonably inferred, energy, pace, warmth, articulation, and emotional arc. Keep factual narration clear and credible. Maintain pronunciation notes for technical terms. If voice generation fails, preserve the script and use a documented fallback instead of silently dropping narration.

## Music and effects
Create a cue sheet with time, cue, purpose, intensity, and fade. Use motifs to connect sections and silence or reduced music for important reveals. Use impacts only when they clarify a real beat. Avoid constant whooshes and unlicensed commercial music.

## Mix checks
Prioritize intelligibility; duck music beneath speech; avoid clipping and sudden loudness jumps; measure integrated loudness and true peak using available tools; document chosen platform targets; check mono compatibility when relevant.

## Captions
Keep lines readable and clear of essential graphics. For RTL languages, test shaping, directionality, punctuation, numerals, and mixed-language text in the encoded render.

## Automation
Treat narration, music, effects, and captions as explicit artifacts with checksums and duration metadata. Store API credentials only in secrets. Use bounded retries.
## Status
Original workflow guide. Audio services remain optional external dependencies.
