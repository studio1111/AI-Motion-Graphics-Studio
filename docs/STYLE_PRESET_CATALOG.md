# Motion Graphics Style Preset Catalog

Version 1.0 · Runtime-selectable starting points for the style engine.

This catalog converts visual direction into practical decisions for typography, color, motion, pacing and sound. The listed colors and families are design starting points, not current evidence of popularity and not a requirement to use the same style every time. The engine must select the preset that serves the subject, audience, platform and available assets. It can derive a topic-specific palette rather than use a preset literally.

## Font selection and rendering policy

Use role-based typography, not a single font for every project.

| Role | Latin candidates | Persian/Arabic candidates | Common purpose |
|---|---|---|---|
| Display / headline | Barlow Condensed, Source Serif 4, IBM Plex Sans, Manrope | Vazirmatn, Noto Sans Arabic, IBM Plex Sans Arabic | Hooks, chapter titles, one-line claims |
| Body / captions | Source Sans 3, IBM Plex Sans, Nunito Sans | Vazirmatn, Noto Sans Arabic, IBM Plex Sans Arabic | Explanations, subtitles, labels |
| Data / technical | IBM Plex Mono, IBM Plex Sans | IBM Plex Mono for Latin numerals paired with Vazirmatn or Noto Sans Arabic for Persian labels | Dates, values, units, evidence notes |
| Editorial accent | Source Serif 4, IBM Plex Serif | Use a tested serif only when the actual required script is supported | Cultural/historical contrast |

Official references for review:
- Vazirmatn project and license: https://github.com/rastikerdar/vazirmatn
- IBM Plex repository and font package: https://github.com/IBM/plex
- Google Fonts and font project guidelines: https://developers.google.com/fonts/ and https://googlefonts.github.io/gf-guide/license-file.html
- Barlow Condensed family in Google Fonts source: https://github.com/google/fonts/tree/main/ofl/barlowcondensed

Do not bundle or claim a font is available solely because it is named here. For every build, check the installed font files, exact version, license, weights, language glyph coverage, and fallback behavior. For Persian/Arabic, render real frames and verify connected shaping, RTL ordering, bidirectional punctuation, numbers and mixed Latin/Persian lines. If a font is missing, select an installed licensed fallback and record it in the manifest. Never silently substitute a visually unsuitable font.

## Preset 01: Editorial Kinetic Type

**Use when:** a central argument, discovery, contradiction or emotional statement should lead the film.

- **Palette tokens:** canvas `#111114`; paper `#F2EFE8`; primary accent `#F04D35`; secondary accent `#D9C35B`; muted text `#A8A6A0`.
- **Type roles:** Barlow Condensed or IBM Plex Sans for display; Source Sans 3 or Vazirmatn for body; IBM Plex Mono for evidence notes.
- **Composition:** asymmetric editorial grid, cropped oversized display text, tight focal hierarchy and deliberate negative space.
- **Motion:** mask reveals, phrase stagger, tracking squeeze, directional line wipes, one meaningful type-to-shape morph; overshoot is small and settles promptly.
- **Timing:** short entrances, strong held states on the argument, acceleration only near the payoff.
- **Sound:** intimate narration, tactile paper/impact texture, sparse pulse; intentional silence before the key reveal.
- **Avoid:** constant jitter, illegible crops, per-character karaoke without a linguistic reason.

## Preset 02: Data Journalism

**Use when:** evidence, comparisons, public-interest data or changing values must be understood quickly.

- **Palette:** canvas `#101A2A`; text `#EDF2F8`; data accent `#28C4A5`; contrast accent `#FFB84A`; muted grid `#40516A`.
- **Type:** IBM Plex Sans or Source Sans 3; IBM Plex Mono for values; Vazirmatn/Noto Sans Arabic for Persian labels.
- **Composition:** chart-first hierarchy, visible units and source notes, consistent legends, stable margins.
- **Motion:** true data reveal, line tracing, baseline-correct bar growth, aligned comparisons, callouts attached to the relevant mark.
- **Timing:** slow the reveal for complex comparisons; hold until labels and values are readable.
- **Sound:** discreet ticks or short tonal confirmations; unobtrusive music under speech.
- **Avoid:** misleading axes, decorative values, false precision, or encoding meaning only with color.

## Preset 03: Scientific 2D / 2.5D

**Use when:** the audience needs to understand a mechanism, process, anatomy, physics or invisible system.

- **Palette:** canvas `#071E2B`; text `#E8F5F6`; process accent `#50D9C8`; secondary system `#5B9CFF`; warning `#FF986E`.
- **Type:** IBM Plex Sans/Manrope for headings; Source Sans 3 or Vazirmatn for explanations; IBM Plex Mono for measurements.
- **Composition:** layered cutaways, transparent planes, diagrammatic callouts and a stable context frame.
- **Motion:** trace the causal path, assemble/disassemble components, reveal cross-sections, use restrained parallax, return from close detail to context.
- **Timing:** order each action to show cause then effect; let the diagram settle before adding the next label.
- **Sound:** precise ticks, soft mechanical movement, low-end only for a meaningful change in scale.
- **Avoid:** fictional mechanism details, decorative particle clouds presented as scientific proof, or camera moves hiding labels.

## Preset 04: Cinematic Documentary

**Use when:** an investigative, historical, biographical or technological story needs atmosphere and controlled reveals.

- **Palette:** canvas `#171916`; warm paper `#E9E0CD`; signal red `#C64B35`; field green `#7B8769`; secondary text `#BEB9AC`.
- **Type:** IBM Plex Sans or Source Sans 3 for editorial labels; Source Serif 4 for selected historical/cultural contrast; Vazirmatn for Persian text.
- **Composition:** close detail into wide context, layered evidence, map/timeline anchors and restrained texture.
- **Motion:** controlled push-in, depth parallax, artifact/map match cut, one decisive reveal per major beat; avoid a push-in on every scene.
- **Timing:** build tension with restraint, reveal the evidence, then let the consequence land.
- **Sound:** atmosphere, grounded Foley, subtle low-frequency motifs, silence when a fact should land.
- **Avoid:** generic black-and-gold prestige styling, meaningless film grain, unverified archival treatment.

## Preset 05: Tactile Collage

**Use when:** memory, culture, identity or historical material benefits from visible layers and physicality.

- **Palette:** paper `#EFE5D1`; ink `#242321`; vermilion `#C84D39`; olive `#788064`; annotation `#446A86`.
- **Type:** Source Serif 4 or IBM Plex Sans for display; IBM Plex Mono for annotations; Vazirmatn for Persian body copy.
- **Composition:** cutouts, scans, photo fragments, notes and tape, with strict layer-depth order.
- **Motion:** paper-plane parallax, cutout pivots, controlled registration slip, masked reveals and visible assembly.
- **Timing:** slightly irregular beats inside a precise overall timeline; keep evidence readable.
- **Sound:** paper movement, subtle mechanical clicks and room tone.
- **Avoid:** fabricated documents, fake archival stamps, excessive scratches, distressed type that damages readability.

## Preset 06: Premium 3D / Product

**Use when:** an object, product or spatial system must feel tangible and explain its form or mechanism.

- **Palette:** canvas `#10151B`; hero text `#F2F5F7`; material accent `#73E0C7`; second accent `#A7B7FF`; shadow `#05080C`.
- **Type:** Manrope or IBM Plex Sans for headlines; IBM Plex Mono for technical callouts; Vazirmatn or Noto Sans Arabic for Persian.
- **Composition:** one hero object, macro detail, deliberate negative space, stable geometry and repeatable lighting.
- **Motion:** slow macro-to-wide reveal, plausible orbit, part separation with consistent axes, motivated light sweep, precise speed ramp and settled hero state.
- **Timing:** fewer shots with longer hero holds; do not spin the camera to create activity.
- **Sound:** material-specific contact, servo or mechanical Foley, low-end only for actual weight.
- **Avoid:** geometry drift, fake logos, random reflections, melted generated text, unsupported product claims.

## Preset 07: Character-led 2D / Shape Animation

**Use when:** an abstract idea becomes clearer through a character or metaphor with visible actions.

- **Palette:** canvas `#F7F1E4`; ink `#203449`; coral `#ED6B5C`; yellow `#E6B94C`; teal `#368B83`.
- **Type:** Nunito Sans or IBM Plex Sans; Source Sans 3 for long explanatory text; Vazirmatn for Persian.
- **Composition:** clear silhouettes, consistent rig/prop scale, strong posing and uncluttered staging.
- **Motion:** anticipation, pose-to-pose action, controlled squash/stretch, follow-through and secondary motion that clarifies weight.
- **Timing:** action beats, not narration word count alone; hold a pose when it carries an explanation.
- **Sound:** expressive Foley and tonal accents tied to gestures, dialogue/narration gets priority.
- **Avoid:** stock-looking characters, inconsistent proportions, busy backgrounds or jokes undermining a serious topic.

## Preset 08: Swiss / Modernist Information Design

**Use when:** a precise, structured explanation should feel editorial and highly organized.

- **Palette:** paper `#F3F3EF`; ink `#171717`; red `#E34234`; blue `#275DDB`; grid `#C8CBCB`.
- **Type:** IBM Plex Sans or Source Sans 3; IBM Plex Mono for dates and data; Vazirmatn for Persian labels.
- **Composition:** strict grid, intentional asymmetry, modular relationships, careful baseline and edge alignment.
- **Motion:** modules align, split, connect and reconfigure; lines trace the relationship between elements.
- **Timing:** crisp movement with stable holds; movement should not compromise the grid.
- **Sound:** clean, quiet clicks and short tonal cues.
- **Avoid:** static slide-deck feel, identical card repetition, random flying panels.

## Preset 09: Generative / Procedural Abstraction

**Use when:** a pattern or evolving system is itself the subject.

- **Palette:** canvas `#080B17`; primary `#DCE7FF`; cyan `#7EE7F5`; violet `#B6A0FF`; muted blue `#53617C`.
- **Type:** IBM Plex Sans for short titles, IBM Plex Mono for parameters, Persian labels rendered separately.
- **Composition:** stable focal anchor, mathematically coherent repetition, controlled density and legible margins.
- **Motion:** seeded particles, vector fields, parametric paths and deterministic state changes; build complexity then collapse into a clear insight.
- **Timing:** motion may be continuous, but major state changes follow narrative beats.
- **Sound:** synthesized pulse and granular texture linked to meaningful state changes.
- **Avoid:** unseeded randomness, flashing density changes, abstraction without a readable takeaway.

## Preset 10: Maps / Timeline

**Use when:** place, movement, chronology, migration or historical change is central.

- **Palette:** map paper `#E9E3D4`; land `#B9B69F`; label ink `#293B36`; route `#D95136`; event `#D9A441`.
- **Type:** Source Sans 3 or IBM Plex Sans for names; IBM Plex Mono for dates; Vazirmatn for Persian place names.
- **Composition:** persistent map/timeline anchor, clear scale and orientation, labels in safe areas.
- **Motion:** route draw, event markers, timeline scrubs, controlled camera travel and map-to-artifact match cuts.
- **Timing:** do not cross several regions before place labels can be read.
- **Sound:** small geographic movement cues, restrained atmosphere, strong narration clarity.
- **Avoid:** unsourced borders, anachronistic map features, unreadable labels or motion implying unsupported causality.

## Preset 11: Vertical / Social-native Explainer

**Use when:** the target is mobile-first 9:16 or a short, self-contained explanation.

- **Palette:** canvas `#08090B`; type `#FFFFFF`; lead accent `#FF4E73`; second accent `#B8F49A`; muted `#A4ABB5`.
- **Type:** Barlow Condensed or Manrope for display; Source Sans 3/Nunito Sans for body; Vazirmatn for Persian.
- **Composition:** one key element, platform UI safe zones, large captions and strong subject/background separation.
- **Motion:** immediate visual hook, dynamic crop, short speed ramp and contrast-led reveals; use pauses for comprehension.
- **Timing:** compress setup, not the meaning. Keep on-screen words readable on a phone.
- **Sound:** voice first, compact signature motif, purposeful hits; captions still work muted.
- **Avoid:** tiny detail, UI collisions, overly fast subtitles and random zooms.

## Preset 12: Live-action + Graphic Annotation

**Use when:** real footage is the evidence anchor but the viewer needs measurements, labels or unseen mechanisms clarified.

- **Palette:** footage-derived base; information text `#F4F7FA`; cyan `#00A6D8`; signal yellow `#FFBE0B`; dark panel `#10212D`.
- **Type:** IBM Plex Sans or Source Sans 3, IBM Plex Mono for units, tested Persian/Arabic family for localized text.
- **Composition:** preserve the real subject and original action; overlays use negative space and clear attachment points.
- **Motion:** tracked callouts, shape masks, route/measurement reveals, freeze-and-annotate moments, match cut into diagram.
- **Timing:** allow context before annotation; do not place labels before the relevant object is visible.
- **Sound:** preserve useful room tone; avoid making real footage feel synthetic.
- **Avoid:** invented tracking positions, ungrounded measurement lines, overlays that hide important action.

## Style assembly prompt block

For each generated scene, add a style lock similar to:

```text
STYLE LOCK
Lead preset: [preset]
Supporting influence(s): [0-2 only]
Palette tokens: [exact hex values chosen for this project]
Display/body/data fonts: [families, weights, availability checks]
Composition rule: [grid, focal hierarchy, negative space]
Material/depth rule: [what is flat, tactile, photographic or 3D]
Motion grammar: [2-4 motion behaviors and easing]
Transition grammar: [3-5 total transition families and when they apply]
Sound grammar: [voice priority, music arc, sound motifs, silence]
Continuity anchors: [subject shape, key colors, light direction, camera axis]
Do not use: [topic-specific anti-patterns]
```

## Runtime selection rules

1. Choose style only after the topic, audience, platform, content evidence and source assets are understood.
2. A style preset is not a requirement to use every named effect. Choose the minimum techniques that communicate the story.
3. If no user-specific style is named, score topic fit, audience clarity, narrative emotion, asset feasibility, distinctiveness and cost. Choose the highest scoring lead preset; add no more than two accents.
4. Choose a new scene mode when meaning changes, not just because a timer expires.
5. Use the final narration waveform/duration to refine pacing. Do not speed up narration unnaturally to fit the storyboard.
6. Keep generated text out of AI video plates; use deterministic composition for exact text, especially Persian/Arabic.
7. Evaluate actual output. If unreadable, generic or incoherent, revise the shot/component instead of adding more effects.
8. Record the chosen preset, palette, font files/versions, model, prompt version, render environment and fallbacks in the production manifest.

## Validation checklist

- [ ] Chosen font files exist, licenses are acceptable and requested glyphs render correctly.
- [ ] Persian/Arabic shaping, RTL order, punctuation and mixed-script lines checked in output frames.
- [ ] Every important animation has explicit start/end states, duration and easing.
- [ ] Palette has legible contrast and consistent semantic meanings.
- [ ] The film contains several distinct kinds of visual event, not just animated title cards.
- [ ] Sound motifs are tied to meaningful events; narration remains clear.
- [ ] The scene transitions support conceptual or spatial continuity.
- [ ] Final output has been inspected, not only the prompt/storyboard.
