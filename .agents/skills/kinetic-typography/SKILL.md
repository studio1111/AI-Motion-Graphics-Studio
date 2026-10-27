---
name: kinetic-typography
description: Design and implement animated typography, title sequences, word-by-word captions, text reveals, and type-led motion graphics.
---

# Kinetic Typography

## Workflow
- Confirm language, reading direction, exact copy, brand tone, target aspect ratio, and minimum display duration.
- Establish type hierarchy: hero phrase, supporting phrase, labels, and footnotes.
- Choose one primary animation grammar: reveal, stagger, tracking change, mask wipe, scale, position, or shape transformation.
- Animate by phrase and meaning, not by arbitrary character noise.
- Keep important copy readable for long enough to be understood; avoid excessive simultaneous movement.
- Test line breaks, font fallback, glyph coverage, and overflow at final output dimensions.

## Quality rules
- Preserve the supplied copy exactly unless asked to edit it.
- Use font sizes and contrast appropriate for mobile viewing.
- Keep text within title/action safe areas.
- For RTL languages, verify shaping, punctuation, numerals, and mixed-script runs in the actual renderer.
- Do not rely on CSS wall-clock animation for frame-accurate video. Use the selected renderer's frame/time API.
- Respect reduced-motion preferences for interactive previews.
