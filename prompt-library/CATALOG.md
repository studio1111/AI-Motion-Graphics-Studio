# Prompt Catalog: 96 Ready-to-Use Motion Styles

This catalog is generated from `prompts.json` so the browsable index and CLI recipe set stay aligned. Every recipe is an original or source-informed studio adaptation, not a promise that every model can execute every effect. To retrieve a full master prompt paired with one recipe, run:

```sh
npm run prompts:list
npm run prompts:search -- <keyword>
npm run prompts:show -- <recipe-id>
npm run prompts:show -- <recipe-id> --format json
npm run prompts:export -- --category product-ui
```

Select one primary visual grammar and at most two supporting influences. Match it to the story, audience, runtime, asset rights, and tools actually available.

**Recipe count:** 96. **Specialist master prompts:** `ADVANCED_MASTER_PROMPTS.md`. **Scene-level templates:** `SCENE_PROMPT_TEMPLATES.md`. **Sequential production workflows:** `PRODUCTION_WORKFLOW_PACK.md`. **Reference review workbook:** `REFERENCE_ANALYSIS_WORKBOOK.md`.

## Abstract

### Liquid Shape Morph (`liquid-morph`)

- **Duration:** 10-30s
- **Visual language:** A few bold organic forms morph between states while preserving silhouette logic and visual rhythm.
- **Motion:** Metaball merges, elastic deformation, smooth topology changes, easing contrast between fluid and crisp.
- **Typography:** Minimal geometric type appears only during stable holds.
- **Color:** Two dominant hues plus a contrasting highlight.
- **Sound:** Wet synthetic textures, soft impacts, syncopated beat.
- **Story beats:** Single form, merge, split, color inversion, final lockup.
- **Avoid:** Uncontrolled melting, accidental shape collisions, overbusy gradients.
- **Adaptation:** Replace topic, audience, language, platform, runtime, brand assets and factual sources. Preserve the motion grammar, then adapt density to runtime. Keep all claims verifiable and all on-screen text legible.

### Liquid Metal Luxury (`liquid-metal`)

- **Duration:** 10-25s
- **Visual language:** Reflective liquid metal forms a precise abstract sculpture against a minimal environment.
- **Motion:** Slow macro orbit, viscous morph, specular sweep, dramatic but restrained movement.
- **Typography:** Small refined title, wide letter spacing.
- **Color:** Black, silver, one warm metallic accent.
- **Sound:** Deep cinematic drone, tiny metallic foley, sparse hit.
- **Story beats:** Dark reveal, reflective flow, silhouette peak, elegant hold.
- **Avoid:** Overexposed reflections, noisy environment, random camera shake.
- **Adaptation:** Replace topic, audience, language, platform, runtime, brand assets and factual sources. Preserve the motion grammar, then adapt density to runtime. Keep all claims verifiable and all on-screen text legible.

### Abstract Gradient Identity (`abstract-gradient`)

- **Duration:** 10-30s
- **Visual language:** A restrained gradient world provides depth while geometric elements express the brand idea.
- **Motion:** Slow gradient drift, layered masks, shape transitions, precise easing.
- **Typography:** Simple geometric headline with strong contrast.
- **Color:** Three-hue gradient family with neutral anchor.
- **Sound:** Warm synth bed, soft air transitions, single accent hit.
- **Story beats:** Atmosphere, shape entrance, composition shift, title lock.
- **Avoid:** Banding, too many colors, type over low-contrast areas.
- **Adaptation:** Replace topic, audience, language, platform, runtime, brand assets and factual sources. Preserve the motion grammar, then adapt density to runtime. Keep all claims verifiable and all on-screen text legible.

### Seamless Shape Morphing Loop (`seamless-shape-loop`)

- **Duration:** 8-20s
- **Visual language:** One shape or small family of shapes passes through a clearly designed sequence of states. The composition should feel like one continuous thought with a stable visual center.
- **Motion:** Define the loop as a time function, match first and last frame geometry, position and velocity, and derive all motion from explicit time. Use smooth closed-form easing or springs instead of hidden state or browser timers.
- **Typography:** If type appears, keep it stable during the core morph and separate entry/exit timing from the transforming container.
- **Color:** Use two to four coherent colors with one accent that travels through the transformation. Avoid changing the entire palette arbitrarily at every state.
- **Sound:** Build a measured loop with no audible seam. Place transition sounds on the motion grid and keep the final audio tail compatible with the opening.
- **Story beats:** Introduce base form; traverse four to seven designed states; reach a visual peak; return along a meaningful inverse path; match the opening precisely.
- **Avoid:** A single-frame pop at the loop point, accumulated floating-point drift, CSS transitions that cannot be evaluated at arbitrary time, overlapping text and random particle confetti.
- **Adaptation:** Define a seek(t)-style deterministic scene model and test the exact first, middle and final frames. Compare final-frame pixel/position state with the opener before delivery.

### Abstract Geometry to Architecture (`abstract-geometry-architecture`)

- **Duration:** 15-45s
- **Visual language:** Simple geometric primitives become a structured spatial world with a clear visual logic and readable depth.
- **Motion:** Morph edges into structural lines, extrude only at motivated beats, use measured camera parallax and preserve spatial continuity.
- **Typography:** Set a clear hierarchy with short phrases aligned to the geometry grid; do not let perspective distort critical copy.
- **Color:** A limited architectural palette with clear separation between foreground, structure and background.
- **Sound:** Tonal pulses and designed mechanical accents synchronized to major transformations.
- **Story beats:** Primitive → rule revealed → structure assembled → camera discovers depth → final architectural composition.
- **Avoid:** Unmotivated shape morphs, impossible perspective, too many competing materials or depth effects used without hierarchy.
- **Adaptation:** Define a transformation grammar and reuse it across scenes. Make all shape endpoints explicit so the animation can be revised deterministically.

## Architecture

### Architectural Spatial Reveal (`architecture`)

- **Duration:** 15-45s
- **Visual language:** A building or interior is revealed through clean camera movement and animated plan-to-space transitions.
- **Motion:** Plan extrusion, sectional reveal, slow dolly, precise perspective transitions.
- **Typography:** Architectural sans, dimensions only when verified.
- **Color:** Stone, warm white, graphite, material accent.
- **Sound:** Low room tone, precise mechanical transitions, elegant score.
- **Story beats:** Plan, structure rises, material detail, inhabited view, final wide.
- **Avoid:** Impossible geometry, warped verticals, invented dimensions.
- **Adaptation:** Replace topic, audience, language, platform, runtime, brand assets and factual sources. Preserve the motion grammar, then adapt density to runtime. Keep all claims verifiable and all on-screen text legible.

### Real Estate Spatial Walkthrough (`real-estate-spatial`)

- **Duration:** 20-60s
- **Visual language:** Present a space through a coherent camera route, floor-plan context, material details and honest dimensions.
- **Motion:** Plan-to-room transition, slow dolly, measured pans, stable verticals, clear spatial continuity.
- **Typography:** Minimal room labels, dimensions only when supplied and verified.
- **Color:** Material-led neutrals with restrained accent.
- **Sound:** Subtle room tone, soft transitions, premium restrained score.
- **Story beats:** Plan, entry, key spaces, material detail, overall view.
- **Avoid:** Warped geometry, impossible room connections, invented measurements.
- **Adaptation:** Swap in the actual brief, approved assets and verified facts. Keep the recipe's core motion grammar but adapt pacing, contrast and information density to audience, duration and platform. Use original compositions rather than tracing a reference.

## Brand

### Premium Brand Ident (`brand-ident`)

- **Duration:** 5-12s
- **Visual language:** Turn a simple brand mark into a memorable reveal using material, light and restraint.
- **Motion:** Slow build, one signature transition, micro-detail, exact logo lockup and clean hold.
- **Typography:** Use supplied logo geometry exactly; no redrawing brand text.
- **Color:** Brand-approved palette only.
- **Sound:** Distinctive sonic logo, low-frequency punctuation, clean tail.
- **Story beats:** Tension, cue, reveal, settle, readable hold.
- **Avoid:** Logo distortion, invented tagline, illegible end frame.
- **Adaptation:** Replace topic, audience, language, platform, runtime, brand assets and factual sources. Preserve the motion grammar, then adapt density to runtime. Keep all claims verifiable and all on-screen text legible.

### Modular Motion Identity System (`motion-identity-system`)

- **Duration:** 15-45s
- **Visual language:** A brand's core geometry generates a family of repeatable transitions, lower thirds and end cards.
- **Motion:** Reusable shape grammar, consistent easing, grid-based transitions, variants derived from one rule.
- **Typography:** Defined display/body/mono roles and repeatable hierarchy.
- **Color:** Brand palette mapped to semantic roles.
- **Sound:** A sonic motif with variations for transitions and logo.
- **Story beats:** Core shape, 3 applications, transition family, brand lockup.
- **Avoid:** One-off effects that cannot scale into a system.
- **Adaptation:** Replace topic, audience, language, platform, runtime, brand assets and factual sources. Preserve the motion grammar, then adapt density to runtime. Keep all claims verifiable and all on-screen text legible.

### Podcast Motion Identity (`podcast-identity`)

- **Duration:** 8-20s
- **Visual language:** Create a repeatable animated identity from the show's theme, with a flexible system for episode titles.
- **Motion:** Waveform or shape motif, modular reveal, repeatable title transition, loopable outro.
- **Typography:** Stable show title, variable episode title, strong small-screen readability.
- **Color:** Three-color identity with repeatable role mapping.
- **Sound:** Short sonic signature and a controlled audio tail.
- **Story beats:** Motif, show title, episode/topic cue, seamless settle.
- **Avoid:** Random waveforms, changing title spelling, overly long intro.
- **Adaptation:** Swap in the actual brief, approved assets and verified facts. Keep the recipe's core motion grammar but adapt pacing, contrast and information density to audience, duration and platform. Use original compositions rather than tracing a reference.

### Brand-Safe Kinetic Identity Lockup (`brand-kinetic-lockup`)

- **Duration:** 5-15s
- **Visual language:** Build a concise identity sequence from the brand's own geometry, spacing and visual principles. The final logo or wordmark must remain faithful to supplied assets.
- **Motion:** Use a clear reveal mechanism, one signature transition, and a deliberate final lockup. Motion may transform surrounding shapes but must not distort official logo proportions or re-time a wordmark into an unreadable state.
- **Typography:** Use supplied brand fonts when licensed and available. Respect logo clear space, minimum size and capitalization; treat the final lockup as a protected asset.
- **Color:** Use the approved brand palette and contrast requirements. If no palette is supplied, choose a temporary palette and label it as a proposal, not official brand guidance.
- **Sound:** Use one memorable sonic signature, aligned to the logo reveal, with a clean tail and optional silent variant.
- **Story beats:** Build anticipation; establish a recognizable brand motif; reveal the official identity; hold the final lockup; provide a clean cutdown ending.
- **Avoid:** Redrawing logos from memory, invented fonts presented as official, unauthorized color changes, excessive distortion and a final frame too short to identify.
- **Adaptation:** Request or reuse vector logo assets where available. Provide light/dark background variants, safe-area notes and a version without audio.

### Brand Motion Identity Guidelines (`motion-identity-guidelines`)

- **Duration:** 20-60s
- **Visual language:** A repeatable motion identity demonstrates how a brand's shapes, typography, transitions and sound behave across several use cases.
- **Motion:** Derive reveals and transitions from logo geometry or approved brand motifs; define default, fast and reduced-motion variants.
- **Typography:** Use approved typefaces and hierarchy; test minimum sizes, spacing and legibility in square, landscape and vertical formats.
- **Color:** Use exact brand color tokens and accessible contrast combinations; limit decorative colors.
- **Sound:** Create a short sonic signature and define when it appears, how it ends and how it behaves beneath voice.
- **Story beats:** Core mark → geometry principle → type behavior → transition behavior → use-case examples → system lockup.
- **Avoid:** Changing the actual logo, invented brand colors, using the logo as an excuse for effects or ignoring reduced-motion needs.
- **Adaptation:** Read the supplied brand guidelines first and document token values, safe areas, timing ranges and fallback behavior. Do not infer unprovided brand assets.

## Character

### Clay Stop-Motion World (`clay-stopmotion`)

- **Duration:** 15-45s
- **Visual language:** A tactile clay miniature tells one simple story with handmade imperfections and consistent character design.
- **Motion:** Stepped 8-12 fps feel, squash-and-stretch, miniature camera moves, deliberate pauses.
- **Typography:** Friendly rounded type on physical-looking cards.
- **Color:** Warm tactile pastels and natural shadows.
- **Sound:** Soft foley, taps, tactile scrapes, playful music.
- **Story beats:** Introduce character, small problem, transformation, satisfying finish.
- **Avoid:** Rubbery digital motion, changing character proportions, over-smooth surfaces.
- **Adaptation:** Replace topic, audience, language, platform, runtime, brand assets and factual sources. Preserve the motion grammar, then adapt density to runtime. Keep all claims verifiable and all on-screen text legible.

## Collage

### Editorial Paper Collage (`paper-collage`)

- **Duration:** 20-60s
- **Visual language:** Layer cut-paper textures, photographs and hand-drawn annotations into a tactile visual essay.
- **Motion:** 2.5D depth, paper flips, torn-edge wipes, stop-motion accents.
- **Typography:** Editorial serif with handwritten annotation sparingly.
- **Color:** Cream paper, ink, archival tones, one bright accent.
- **Sound:** Paper rustle, scissors, analog percussion.
- **Story beats:** Layered opening, collage build, key evidence, final assembled tableau.
- **Avoid:** Fake source documents, flat layer stacking, excessive texture.
- **Adaptation:** Replace topic, audience, language, platform, runtime, brand assets and factual sources. Preserve the motion grammar, then adapt density to runtime. Keep all claims verifiable and all on-screen text legible.

### Bold Cutout and Mixed-Media Collage (`bold-cutout-collage`)

- **Duration:** 15-60s
- **Visual language:** Combine photographed objects, printed textures, cut-paper shapes and graphic type into an intentional editorial composition. Materials should have a clear hierarchy and a consistent tactile identity.
- **Motion:** Use paper-tear reveals, registered layer shifts, pinned rotations, fast scale changes and deliberate stop-motion-like steps. Transition between scenes by passing one recurring cutout or color field across the frame.
- **Typography:** Mix a bold editorial title with short captions. Keep type on a stable paper layer unless the lettering itself is the visual subject.
- **Color:** Select a tight print-inspired palette and let texture vary within it. Maintain strong contrast between foreground cutouts and the background.
- **Sound:** Use paper, scissors, tape, stamps and dry percussion as tactile accents, with a purposeful musical rhythm.
- **Story beats:** Introduce the central object or phrase; layer supporting ideas; create one surprising scale or material switch; gather the pieces into a clear conclusion.
- **Avoid:** Unrelated stock cutouts, excessive grain on every layer, noisy collage edges, illegible text and unlicensed imagery.
- **Adaptation:** Use owned, public-domain or properly licensed source imagery. Keep textures subtle enough to avoid compression artifacts and preserve contrast on mobile.

## Comedy

### Playful Comedy Explainer (`comedy-explainer`)

- **Duration:** 20-60s
- **Visual language:** A clear joke structure uses visual contrast and precise timing to explain a topic lightly.
- **Motion:** Anticipation, delayed reveal, overshoot, reaction pause, visual callback.
- **Typography:** Friendly bold sans, one phrase per beat.
- **Color:** Bright limited palette with neutral background.
- **Sound:** Light percussion, purposeful silence, sound punctuation.
- **Story beats:** Setup, escalation, visual twist, callback, concise takeaway.
- **Avoid:** Constant motion, jokes obscuring facts, random sound effects.
- **Adaptation:** Replace topic, audience, language, platform, runtime, brand assets and factual sources. Preserve the motion grammar, then adapt density to runtime. Keep all claims verifiable and all on-screen text legible.

## Corporate

### Modern Corporate Story Film (`corporate-story`)

- **Duration:** 30-90s
- **Visual language:** Human-centered business storytelling combines real evidence, clear diagrams and restrained brand motion.
- **Motion:** Elegant wipes, scene-to-diagram bridges, subtle depth, purposeful transitions.
- **Typography:** Brand font roles, clear subtitles, restrained data labels.
- **Color:** Brand-approved colors and accessible neutrals.
- **Sound:** Warm modern score, authentic ambience, subtle transition cues.
- **Story beats:** Human problem, approach, proof, outcome, invitation.
- **Avoid:** Stock cliché overload, invented testimonials, unsupported impact claims.
- **Adaptation:** Replace topic, audience, language, platform, runtime, brand assets and factual sources. Preserve the motion grammar, then adapt density to runtime. Keep all claims verifiable and all on-screen text legible.

## Data storytelling

### Data Visualization Explainer (`data-story`)

- **Duration:** 30-90s
- **Visual language:** Numbers become clear spatial objects and reveal one defensible insight at a time.
- **Motion:** Bars grow from baseline, labels track data, camera reframes after each reveal, transitions preserve context.
- **Typography:** Numerals tabular; labels concise; highlight only the current comparison.
- **Color:** Dark ink with 2-3 high-contrast data colors.
- **Sound:** Soft ticks synchronized to reveals; restrained pulse.
- **Story beats:** Question, baseline, comparison, insight, caveat, takeaway.
- **Avoid:** Invented statistics, misleading axes, decorative chart junk, unlabeled units.
- **Adaptation:** Replace topic, audience, language, platform, runtime, brand assets and factual sources. Preserve the motion grammar, then adapt density to runtime. Keep all claims verifiable and all on-screen text legible.

### Explainer Infographic (`infographic`)

- **Duration:** 30-90s
- **Visual language:** Icons, labels and simple diagrams make a complex concept understandable in progressive layers.
- **Motion:** One concept per beat, connected transitions, consistent icon scale and spatial continuity.
- **Typography:** Plain-language labels, large key terms, source note for factual claims.
- **Color:** Functional palette with consistent semantic mapping.
- **Sound:** Subtle ticks and transitions; narration remains primary.
- **Story beats:** Question, model, three steps, implication, recap.
- **Avoid:** Overloaded screens, decorative icons, unexplained acronyms.
- **Adaptation:** Replace topic, audience, language, platform, runtime, brand assets and factual sources. Preserve the motion grammar, then adapt density to runtime. Keep all claims verifiable and all on-screen text legible.

### Kinetic Chart Story (`kinetic-charts`)

- **Duration:** 20-60s
- **Visual language:** Build charts as narrative events: reveal the baseline, animate one comparison, then isolate the insight.
- **Motion:** Draw from a visible origin, preserve axis continuity, use data labels that travel with marks, pause after the reveal.
- **Typography:** Tabular numerals, compact labels, visible units and source note.
- **Color:** Neutral canvas plus semantic colors for each series.
- **Sound:** Ticks on key reveals, gentle pulse, music ducks under explanation.
- **Story beats:** Question, baseline, contrast, insight, implication.
- **Avoid:** Invented numbers, moving axes that mislead, decoration hiding values.
- **Adaptation:** Swap in the actual brief, approved assets and verified facts. Keep the recipe's core motion grammar but adapt pacing, contrast and information density to audience, duration and platform. Use original compositions rather than tracing a reference.

### Verified Data Reveal (`verified-data-burst`)

- **Duration:** 20-75s
- **Visual language:** Turn a small set of source-verified facts into a visual argument. Each chart, number and label earns its place; the viewer should understand what changed, compared with what, and over what period.
- **Motion:** Reveal context before the headline number, establish axes and units before animating data, then use sorting, range highlighting, annotations and one focused comparison. Animate the chart and its labels from the same data model.
- **Typography:** Large figures carry the headline, with readable units and source notes. Keep category labels stable during sorting and never rely on color alone to distinguish series.
- **Color:** Neutral analytical base with a consistent highlight for the key measure. Use separate series colors only where they improve decoding and keep semantic mappings consistent.
- **Sound:** Use quiet ticks or pulses for key changes, a low-key score and silence when a number needs attention. Do not make volume imply statistical significance.
- **Story beats:** Question; source and baseline; reveal the trend; test a meaningful comparison; state the careful takeaway with source attribution.
- **Avoid:** Truncated or deceptive axes, interpolated missing values presented as fact, unlabelled units, unsupported causation, tiny sources and invented data.
- **Adaptation:** Create a claim-to-source ledger before animation. Preserve exact values, denominator, date range and methodology. If data is missing, leave a gap or label an estimate explicitly.

### Kinetic Data Symphony (`kinetic-data-symphony`)

- **Duration:** 30-90s
- **Visual language:** Real data becomes a visual argument through charts, numeric callouts, typographic emphasis and focused transitions.
- **Motion:** Reveal baseline before values; animate marks according to the meaning of the data; use restrained drawing, sorting and focus changes.
- **Typography:** Use tabular numerals for changing values, explicit units, readable labels and a short takeaway per chart.
- **Color:** Use a neutral chart foundation and a consistent semantic palette; do not encode meaning by color alone.
- **Sound:** Use soft ticks for key transitions and subtle accents for the central finding; never imply precision through excessive sonic drama.
- **Story beats:** Question → baseline → strongest contrast → caveat → consequence → take-away.
- **Avoid:** Invented values, truncated axes without disclosure, inconsistent units, unlabeled sources or decorative chart junk.
- **Adaptation:** Start from a verified data table and a claim ledger. Preserve data provenance and show uncertainty or sample limits directly in the composition.

### Financial Market and Economics Explainer (`financial-market-explainer`)

- **Duration:** 30-120s
- **Visual language:** A clear editorial chart language makes economic mechanisms and market movements understandable without financial hype.
- **Motion:** Reveal axes first, animate the time series in the correct direction, highlight meaningful ranges and pause for interpretation.
- **Typography:** Use exact units, time range, currency and source labels; format values consistently.
- **Color:** A restrained neutral palette and consistent positive/negative conventions that do not rely on color alone.
- **Sound:** Quiet editorial bed and concise accents for transitions; avoid casino-style ticks and alarm sounds.
- **Story beats:** Question → data scope → mechanism → notable movement → caveat/context → what can and cannot be concluded.
- **Avoid:** Guarantees, invented prices, misleading baselines, unexplained inflation adjustments or treating correlation as causation.
- **Adaptation:** Record as-of date, source, methodology and caveats for each series. This is educational visualization, not personalized financial advice.

## Diagram

### Isometric World Explainer (`isometric`)

- **Duration:** 20-60s
- **Visual language:** Build a miniature isometric world where systems and routes are easy to understand.
- **Motion:** Modular pieces assemble, camera glides along routes, depth layers enter in logical order.
- **Typography:** Compact sans labels anchored to objects.
- **Color:** Soft architectural neutrals with clear functional color coding.
- **Sound:** Tiny mechanical clicks, gentle rhythmic score.
- **Story beats:** Establish world, reveal components, show flow, isolate bottleneck, resolve.
- **Avoid:** Perspective drift, decorative buildings, labels detached from objects.
- **Adaptation:** Replace topic, audience, language, platform, runtime, brand assets and factual sources. Preserve the motion grammar, then adapt density to runtime. Keep all claims verifiable and all on-screen text legible.

### Line-Art Technical Explainer (`line-drawing`)

- **Duration:** 20-60s
- **Visual language:** A continuous line draws a mechanism, then selected parts fill with color as the logic unfolds.
- **Motion:** Stroke reveal, path-follow camera, node pulses, clean morphs between states.
- **Typography:** Technical sans labels; numbered steps align to drawing.
- **Color:** Warm white background, graphite line, one signal color.
- **Sound:** Pencil-like ticks and precise mechanical cues.
- **Story beats:** Question, schematic draw, mechanism sequence, outcome.
- **Avoid:** Line crossings without hierarchy, vague arrows, too much simultaneous drawing.
- **Adaptation:** Replace topic, audience, language, platform, runtime, brand assets and factual sources. Preserve the motion grammar, then adapt density to runtime. Keep all claims verifiable and all on-screen text legible.

## Documentary

### Editorial Documentary Explainer (`editorial-explainer`)

- **Duration:** 45-120s
- **Visual language:** Layer archival-style imagery, maps, quotes and animated diagrams into a coherent argument.
- **Motion:** 2.5D parallax, slow pushes, purposeful match cuts, diagrams resolve in stages.
- **Typography:** Editorial serif headline paired with clean sans body; citations stay readable.
- **Color:** Paper, charcoal, muted documentary accents.
- **Sound:** Textural ambience, restrained score, authentic location sound when available.
- **Story beats:** Cold open, context, mechanism, consequence, synthesis.
- **Avoid:** Unsupported claims, fake archive presented as real, nonstop motion.
- **Adaptation:** Replace topic, audience, language, platform, runtime, brand assets and factual sources. Preserve the motion grammar, then adapt density to runtime. Keep all claims verifiable and all on-screen text legible.

### Sustainability Impact Explainer (`sustainability-explainer`)

- **Duration:** 30-90s
- **Visual language:** Use verified lifecycle stages, maps and comparisons to explain an environmental claim without overstating impact.
- **Motion:** Progressive system diagram, measured transitions, side-by-side comparisons with consistent units.
- **Typography:** Clear units, dates, boundaries and source notes.
- **Color:** Earth-inspired colors with contrast-tested text.
- **Sound:** Natural ambience sparingly, calm score, narration-first mix.
- **Story beats:** Claim, system boundary, evidence, tradeoff, practical takeaway.
- **Avoid:** Greenwashing, unsupported impact numbers, missing comparison boundaries.
- **Adaptation:** Swap in the actual brief, approved assets and verified facts. Keep the recipe's core motion grammar but adapt pacing, contrast and information density to audience, duration and platform. Use original compositions rather than tracing a reference.

### Editorial Archive and Documentary Collage (`editorial-archive`)

- **Duration:** 30-120s
- **Visual language:** Combine documentary photography, paper textures, maps, marginal notes and carefully chosen typography as a coherent archive. Make source, date and context visible whenever a historic item contributes to a factual claim.
- **Motion:** Use registration shifts, paper reveals, trackable parallax and controlled layer rearrangement. Give archival evidence a stable hold before transitions; distinguish actual documents from visual reconstructions.
- **Typography:** Use one editorial face plus a legible caption face. Keep dates, names, translations and source credits crisp and on screen long enough to read.
- **Color:** Aged paper and ink tones can be balanced with one modern signal color. Preserve contrast and avoid artificially aging evidence in ways that misrepresent its origin.
- **Sound:** Use gentle paper, room tone and a restrained documentary score. Avoid bombastic hits on every factual reveal.
- **Story beats:** Introduce the question; surface a key document or image; connect multiple pieces of evidence; clarify what they show and do not show; close with a grounded takeaway.
- **Avoid:** Unlicensed archive imagery, fabricated documents passed off as real, misleading date treatments, illegible footnotes and a collage that obscures chronology.
- **Adaptation:** Record original sources and rights. Label reconstructed materials and translated text. Use original visual stand-ins when usage rights are unclear.

### Voiceover-First Information-Rich Explainer (`voiceover-first-explainer`)

- **Duration:** 45-180s
- **Visual language:** Design the film around a clear spoken argument, using visual metaphor, evidence, diagrams and purposeful motion to make each idea easier to understand. Avoid showing a new scene merely because the narration continues.
- **Motion:** Create a timecoded narration script, then stage visuals to key phrases, pauses and claim boundaries. Use faster transitions for setup and slower holds for difficult ideas or numbers.
- **Typography:** Show only the phrase or data point that matters at that moment. Keep line length short, use readable captions and protect source notes from competing motion.
- **Color:** Choose a stable palette and assign repeatable colors to concepts, data categories and chapter changes. Avoid changing visual language on every sentence.
- **Sound:** Prioritize clean voice intelligibility, consistent loudness, respectful music ducking and purposeful silence. Place SFX on meaningful actions and transitions.
- **Story beats:** Cold open; define the question; build a chain of evidence or reasoning; address the most important caveat; land one memorable conclusion.
- **Avoid:** Narration that merely reads on-screen text, overscripted density, visual stock montages without causal links, unsupported facts and music masking speech.
- **Adaptation:** Fact-check every factual sentence and map it to a source. Time subtitles from the final voice track, keep pronunciation and names reviewed, and produce a narration-off version if requested.

### Documentary Archive and Evidence Collage (`documentary-archive-collage`)

- **Duration:** 45-180s
- **Visual language:** A tactile editorial composition layers dated documents, maps, photographs and restrained annotations to reveal a story.
- **Motion:** Slow camera drift, purposeful parallax, precise crops, paper reveals and selective holds on evidence.
- **Typography:** Use clear archival captions, dates and source notes; distinguish quotations from narration and never falsify a document.
- **Color:** Paper neutrals, ink tones and one accent to mark the present-day interpretation.
- **Sound:** Subtle room tone, paper texture and measured music; no sound effects that imply events not supported by the record.
- **Story beats:** Present-day question → artifact → context → contradiction → corroboration → interpretation with uncertainty.
- **Avoid:** Passing generated imagery off as genuine archive, fake stamps, fabricated headlines or unlicensed images.
- **Adaptation:** Label illustrative reconstructions; track image rights and source metadata. Keep factual source citations accessible in end cards or accompanying notes.

### Climate and Energy Transition Explainer (`climate-transition-visualization`)

- **Duration:** 45-180s
- **Visual language:** A grounded mix of landscapes, infrastructure, emissions/data visuals and human-scale consequences builds a system-level narrative.
- **Motion:** Transition between scales with geographic or material match cuts; use measured chart reveals and clear temporal progression.
- **Typography:** State units, base years, scenario names and uncertainty; preserve readable labels on mobile.
- **Color:** Natural environmental hues with consistent semantic colors for technologies and scenarios.
- **Sound:** Organic ambience with restrained music; avoid disaster-movie effects that overstate evidence.
- **Story beats:** Visible change → system cause → quantitative baseline → solution pathways → trade-offs → grounded conclusion.
- **Avoid:** Invented statistics, cherry-picked time ranges, unlabeled projections or visual equivalence between scenarios with different assumptions.
- **Adaptation:** Use authoritative datasets and date the evidence. Distinguish historical observations from modeled scenarios and annotate uncertainty.

### Cinematic Footage with Data Overlays (`real-footage-data-overlay`)

- **Duration:** 30-120s
- **Visual language:** Real or licensed footage is annotated by precise labels, diagrams and data callouts that clarify the action rather than cover it.
- **Motion:** Pin overlays to trackable objects when possible; reveal labels on a clear visual event and exit them before the shot gets busy.
- **Typography:** Short annotations, strong size hierarchy and a stable label style; sources and dates must remain readable.
- **Color:** Neutral overlays with one contrast accent and semi-opaque backing when footage reduces legibility.
- **Sound:** Use location sound as texture, voice as the explanatory lead and minimal design sounds for annotation events.
- **Story beats:** Visual hook → establish context → annotate one key feature → show the evidence → interpret → finish with a clear takeaway.
- **Avoid:** Untracked floating callouts, unsupported numbers, unlicensed footage, false causal arrows or decorative HUD clutter.
- **Adaptation:** Map each overlay to its factual source and screen position. If tracking is unavailable, use designed cutaways rather than pretending the overlay is attached to the object.

## Editorial

### Editorial Quote and Insight Film (`editorial-quote`)

- **Duration:** 15-45s
- **Visual language:** Build one verified quote or insight into a typographic composition with supporting imagery and deliberate pauses.
- **Motion:** Phrase-by-phrase reveals, editorial cuts, image parallax, strong stillness before the key line.
- **Typography:** Preserve exact quote and attribution; line breaks designed for reading.
- **Color:** Paper/ink base with one accent.
- **Sound:** Minimal music, page texture, purposeful silence.
- **Story beats:** Context, quote setup, key phrase, source/attribution, takeaway.
- **Avoid:** Misattribution, rewritten quotation, tiny citations.
- **Adaptation:** Swap in the actual brief, approved assets and verified facts. Keep the recipe's core motion grammar but adapt pacing, contrast and information density to audience, duration and platform. Use original compositions rather than tracing a reference.

### Cinematic Before-and-After Comparison (`cinematic-comparison`)

- **Duration:** 15-45s
- **Visual language:** Compare two states using consistent framing, scale and conditions so the difference itself tells the story. Choose a visual motif that lets the viewer track exactly what changed.
- **Motion:** Use split reveals, aligned wipes, synchronized labels, match-cut geometry and a final side-by-side hold. Keep cameras locked or explicitly compensate for framing changes.
- **Typography:** Label each state and the comparison metric. Use concise text and avoid implying a causal relationship through the edit when only correlation is known.
- **Color:** Preserve measurement integrity and neutral baseline colors. Use a highlight only for the relevant difference, not to make one side look artificially better.
- **Sound:** Use a restrained transition cue and clear narration that explains the comparison criteria. Avoid triumphal or alarming sounds that bias interpretation.
- **Story beats:** Define baseline; explain comparison conditions; reveal the change; inspect an important exception or limitation; summarize what the comparison does and does not show.
- **Avoid:** Different scales without disclosure, hidden exclusions, unverified transformations, color manipulation and unsourced claims of causation.
- **Adaptation:** Keep source, period, units and conditions visible. Use the same crop, camera, data scale and layout where a fair comparison requires them.

## Education

### Educational Lesson Opener (`educational-course`)

- **Duration:** 15-40s
- **Visual language:** A concept begins with a visual question, then becomes a clean, memorable model for learners.
- **Motion:** Progressive disclosure, highlight, pause for comprehension, recap animation.
- **Typography:** Large key terms, high legibility, captions and labels.
- **Color:** Calm accessible palette with one learning-focus accent.
- **Sound:** Gentle rhythmic bed, soft cues, narration-first mix.
- **Story beats:** Question, misconception, visual model, learning promise.
- **Avoid:** Too many concepts at once, fast labels, decorative movement.
- **Adaptation:** Replace topic, audience, language, platform, runtime, brand assets and factual sources. Preserve the motion grammar, then adapt density to runtime. Keep all claims verifiable and all on-screen text legible.

### Medical and Health Education Visualization (`medical-education-visual`)

- **Duration:** 30-120s
- **Visual language:** Calm, precise anatomical or process graphics clarify one health concept with clean labeling and appropriate scale.
- **Motion:** Show normal structure before the change, animate causal processes stepwise and avoid distracting camera movement around detailed anatomy.
- **Typography:** Define specialist terms in plain language, maintain label contrast and avoid dense lists of symptoms on screen.
- **Color:** A calm neutral system with consistent component mapping; do not use color as a substitute for precise labeling.
- **Sound:** Low-distraction music under narration and subtle transitions without alarming tones.
- **Story beats:** Question → basic structure → process → what evidence says → limitations → safe summary or next step.
- **Avoid:** Diagnosis from generic imagery, unsupported treatment claims, graphic shock tactics or treating a stylized model as a real scan.
- **Adaptation:** Use current trustworthy clinical sources and state relevant uncertainty. Make educational boundaries clear and seek qualified review for high-impact use.

### Multilingual Motion Explainer (`multilingual-motion-explainer`)

- **Duration:** 30-120s
- **Visual language:** A stable visual argument adapts naturally to multiple languages, preserving meaning while allowing different line lengths and reading rhythms.
- **Motion:** Keep scene timing and visual logic consistent, but reflow type and adjust holds for each language instead of forcing literal line-by-line timing.
- **Typography:** Select fonts with full script coverage, correct shaping and direction; validate right-to-left layout, diacritics and line breaks.
- **Color:** Use the same palette and semantic color mapping in every localized version.
- **Sound:** Use native-language pronunciation, measured narration pacing and matching captions; do not stretch the mix unnaturally to force identical runtimes.
- **Story beats:** Preserve the same narrative beats, adjusting local examples, units and phrasing where necessary.
- **Avoid:** Broken glyph shaping, mixed-direction punctuation errors, tiny fonts caused by long translations or cultural references that do not transfer.
- **Adaptation:** Keep the master script and translation glossary. Run language-specific typography and caption checks, especially for Arabic-derived scripts and mixed numerals.

## Educational

### Hand-Drawn Whiteboard Explainer (`hand-drawn-whiteboard`)

- **Duration:** 30-120s
- **Visual language:** A hand-drawn visual vocabulary turns one complex mechanism into sequential, connected sketches.
- **Motion:** Strokes draw in dependency order, diagrams assemble from parts and camera reframes only when the narrative changes focus.
- **Typography:** Use a highly legible handwritten-inspired headline with a clean supporting sans; hand-render labels carefully and keep them short.
- **Color:** Warm paper, near-black linework and two semantic accent colors.
- **Sound:** Soft pencil or marker sounds only when appropriate; warm minimal music and clean narration.
- **Story beats:** Problem sketch → key parts → arrows and relationships → worked example → compact summary diagram.
- **Avoid:** Random doodles, decorative underlining, unreadable pseudo-handwriting or visual metaphors that replace necessary explanation.
- **Adaptation:** Write the spoken explanation first, then make every drawing correspond to one clause. Provide a clean final diagram that can be understood without narration.

## Event brand

### Conference/Event Opener (`event-opener`)

- **Duration:** 10-30s
- **Visual language:** Turn the event theme into a large-scale motion identity with a powerful opening, modular chapter cards and a clear title.
- **Motion:** Macro-to-wide reveal, shape-driven transitions, synchronized title hits, clean end lockup.
- **Typography:** Huge headline, concise date/location line, safe lower-third hierarchy.
- **Color:** Event brand palette, one neutral anchor.
- **Sound:** Sonic logo, crowd ambience only if appropriate, impactful but short music arc.
- **Story beats:** Signal, visual build, event promise, title/date hold.
- **Avoid:** Tiny event details, unlicensed crowd audio, effects competing with the title.
- **Adaptation:** Swap in the actual brief, approved assets and verified facts. Keep the recipe's core motion grammar but adapt pacing, contrast and information density to audience, duration and platform. Use original compositions rather than tracing a reference.

### High-Contrast Event Opener (`high-contrast-event-opener`)

- **Duration:** 10-30s
- **Visual language:** Create a strong stage-scale opening built around a short message, a memorable material or graphic motif and a precise final event lockup. Use large-scale framing that remains readable from a distance.
- **Motion:** Move from a minimal hook to a controlled escalation, use typography as the main spatial element and reserve the largest scale change for the payoff. End with a stable title card that can also serve as a stage hold.
- **Typography:** Use a bold display face with generous spacing and a strong safe area. Limit each frame to one primary message plus essential event details.
- **Color:** Use the event's approved brand palette or one proposed high-contrast scheme. Test projection contrast, black levels and visibility on large LED screens.
- **Sound:** Build a clear audio arc with a deliberate drop before the reveal, strong but non-clipping impacts and a clean end for a live host transition.
- **Story beats:** Visual hook; event theme; three escalating motifs or keywords; climax; event title/date/logo hold.
- **Avoid:** Constant strobing, illegible tiny text, overlong preamble, unsafe flash rates, excessive camera shake and an abrupt audio cutoff.
- **Adaptation:** Make a screen-safe master plus social cutdowns. Confirm event name, date and logos before final render and provide a no-audio variant.

## Fashion

### Fashion Editorial Motion (`fashion-editorial`)

- **Duration:** 15-45s
- **Visual language:** Silhouette, fabric, light and deliberate negative space create a magazine-grade moving editorial.
- **Motion:** Slow tracking, match cuts on pose, fabric trails, controlled shutter accents.
- **Typography:** Editorial serif with clean sans microcopy.
- **Color:** Monochrome base with one seasonal accent.
- **Sound:** Fashion-forward beat, fabric movement, sparse impacts.
- **Story beats:** Silhouette, detail, movement, full look, brand frame.
- **Avoid:** Face/body distortion, overprocessed skin, random typography.
- **Adaptation:** Replace topic, audience, language, platform, runtime, brand assets and factual sources. Preserve the motion grammar, then adapt density to runtime. Keep all claims verifiable and all on-screen text legible.

## Food

### Cinematic Food Commercial (`food-commercial`)

- **Duration:** 15-30s
- **Visual language:** A dish is presented through tactile macro textures, steam, ingredient motion and appetizing light.
- **Motion:** Macro slider, slow motion pour, ingredient orbit, quick cuts followed by hero hold.
- **Typography:** Minimal premium title; ingredient labels only when useful.
- **Color:** Warm food tones, deep shadows, fresh accent color.
- **Sound:** Sizzle, crisp cuts, pour foley, light rhythmic score.
- **Story beats:** Texture hook, preparation detail, sensory peak, plated hero, CTA.
- **Avoid:** Unrealistic food deformation, excessive steam, cluttered props.
- **Adaptation:** Replace topic, audience, language, platform, runtime, brand assets and factual sources. Preserve the motion grammar, then adapt density to runtime. Keep all claims verifiable and all on-screen text legible.

## Gaming

### Game UI Cinematic Reveal (`game-ui`)

- **Duration:** 15-45s
- **Visual language:** A game interface reveal uses spatial depth, responsive panels and controlled energy while keeping gameplay information legible.
- **Motion:** Layered parallax, HUD lock-on, deliberate camera push, short impact transitions, stable info zones.
- **Typography:** Display face for hero title, clean UI face for stats and objectives.
- **Color:** World-inspired palette with one high-visibility gameplay accent.
- **Sound:** Designed UI ticks, low-end impact, layered ambience.
- **Story beats:** World cue, HUD activation, feature reveal, gameplay payoff, title.
- **Avoid:** HUD clutter, unreadable stats, random glitches, false gameplay claims.
- **Adaptation:** Swap in the actual brief, approved assets and verified facts. Keep the recipe's core motion grammar but adapt pacing, contrast and information density to audience, duration and platform. Use original compositions rather than tracing a reference.

## History

### Historical Timeline Documentary (`history-timeline`)

- **Duration:** 45-120s
- **Visual language:** A verified timeline connects dates, maps, artifacts and consequences without pretending reconstructions are original evidence.
- **Motion:** Timeline travels, dates pin in place, map transitions, archival-image parallax.
- **Typography:** Dates highly legible; sources in quiet but readable end matter.
- **Color:** Archival neutrals with period-specific accent.
- **Sound:** Measured documentary score, subtle paper/room textures.
- **Story beats:** Hook, context, chronological turns, consequence, sourced conclusion.
- **Avoid:** Invented dates, unlabelled AI reconstruction, false archival provenance.
- **Adaptation:** Replace topic, audience, language, platform, runtime, brand assets and factual sources. Preserve the motion grammar, then adapt density to runtime. Keep all claims verifiable and all on-screen text legible.

## Looping motion

### Seamless Motion Design Loop (`seamless-motion-loop`)

- **Duration:** 6-20s
- **Visual language:** A small family of shapes or letters transforms through a designed cycle with a legible start/end composition.
- **Motion:** Use time-based deterministic motion, controlled spring response and a final state that matches the opening in position, scale, velocity and direction.
- **Typography:** Keep the main phrase short and legible; any changing copy must have explicit enter and exit timing.
- **Color:** One dominant field, one foreground color and one accent; prevent palette drift during the cycle.
- **Sound:** Create a rhythm that can loop without a click or unresolved reverb tail; place accents on repeatable beat positions.
- **Story beats:** Introduce motif → transform through 2-4 states → return through a meaningful visual path to the exact opening state.
- **Avoid:** Almost-matching endpoints, cursor teleportation, motion discontinuity, abrupt audio tails or random particles used to hide a bad loop.
- **Adaptation:** Specify the loop period in seconds and derive every animated property from normalized time. Render first, middle and final frame comparisons before approving.

## Maps

### Animated Travel Map (`travel-map`)

- **Duration:** 20-60s
- **Visual language:** A route across a map is explained with accurate geography, landmarks and clear labels.
- **Motion:** Route draw, camera travel, location pin reveal, transitions from map to real footage.
- **Typography:** Readable place labels; distinguish route from borders.
- **Color:** Map neutrals with one route color.
- **Sound:** Soft travel rhythm, location-specific ambience if verified.
- **Story beats:** Origin, route, 2-4 stops, destination, summary.
- **Avoid:** Incorrect borders, fake route distances, labels covering key locations.
- **Adaptation:** Replace topic, audience, language, platform, runtime, brand assets and factual sources. Preserve the motion grammar, then adapt density to runtime. Keep all claims verifiable and all on-screen text legible.

### Geographic Journey Sequence (`map-journey`)

- **Duration:** 20-60s
- **Visual language:** A route moves from regional context to a precise destination, with accurate map geometry and meaningful landmarks.
- **Motion:** Camera scale transitions, route draw, pin drops, map-to-footage match cuts.
- **Typography:** Legible place labels, clear route hierarchy, scale-aware typography.
- **Color:** Quiet cartographic base with one route accent.
- **Sound:** Soft location cues and restrained travel rhythm.
- **Story beats:** Where, route, stops, arrival, summary.
- **Avoid:** Incorrect borders, fake distances, unlabeled geography.
- **Adaptation:** Swap in the actual brief, approved assets and verified facts. Keep the recipe's core motion grammar but adapt pacing, contrast and information density to audience, duration and platform. Use original compositions rather than tracing a reference.

### Human-Scale Map and Geographic Journey (`human-scale-map`)

- **Duration:** 20-90s
- **Visual language:** Move from a broad geographic context to a human-scale route, neighborhood or historical connection. Keep geography oriented and labels tied to real locations.
- **Motion:** Use deliberate zoom stages, route drawing, locational callouts and transitions along a stable north/orientation convention. Give the audience enough time to establish where each place is.
- **Typography:** Label places with accurate spelling and consistent hierarchy. Use concise dates, distances and time zones where needed; avoid dense labels at world scale.
- **Color:** Use base-map neutrals, one route or featured-region color and a restrained terrain/water distinction. Do not let palette changes imply political boundaries or categories that are not in the data.
- **Sound:** Use gentle travel motion, location ambience and focused emphasis at key stops. Avoid literal whooshes on every zoom.
- **Story beats:** Establish the wider map; locate the start; trace the journey or relationship; pause at key points; return to the overview for the takeaway.
- **Avoid:** Misplaced coastlines, false borders, unexplained map projections, excessive map labels and exposing sensitive personal locations.
- **Adaptation:** Use reliable geographic data and appropriate attribution. Validate map projection, route coordinates and labels; blur or generalize sensitive locations.

### Cinematic Map and Geographic Journey (`cinematic-map-journey`)

- **Duration:** 20-90s
- **Visual language:** A camera travels across a clean geographic canvas from global context to a small, clearly identified location.
- **Motion:** Scale changes follow geography; routes draw in sequence; markers appear when relevant; transitions respect map orientation.
- **Typography:** Keep place names stable, spell them from verified data and avoid labels colliding at local zoom levels.
- **Color:** Muted terrain, strong route contrast and distinct but color-accessible markers.
- **Sound:** Light percussive cues at stops and restrained low-frequency transitions as the camera changes scale.
- **Story beats:** Global orientation → region → route → significant stops → arrival → geographic takeaway.
- **Avoid:** False borders, inaccurate route geometry, floating labels, impossible travel distances or confusing north/orientation changes.
- **Adaptation:** Use authoritative coordinates and a documented projection. Separate stylized geography from factual boundaries and provide sources for routes and borders.

## Music

### Music-Responsive Visualizer (`music-visualizer`)

- **Duration:** 15-60s
- **Visual language:** Abstract forms respond to musical structure rather than reacting to every transient.
- **Motion:** Bass drives scale, mids drive rotation, highs drive particles; modulation changes by section.
- **Typography:** Lyrics only if provided and cleared; title remains stable through motion.
- **Color:** Palette evolves across intro, drop and outro.
- **Sound:** Use beat grid, downbeat accents, dynamic intensity envelope.
- **Story beats:** Intro, anticipation, drop, variation, outro.
- **Avoid:** Uniform pulsing, constant maximum energy, random waveform decoration.
- **Adaptation:** Replace topic, audience, language, platform, runtime, brand assets and factual sources. Preserve the motion grammar, then adapt density to runtime. Keep all claims verifiable and all on-screen text legible.

### Lyric Typography Visual (`lyric-kinetic`)

- **Duration:** 15-45s
- **Visual language:** A short provided lyric excerpt is staged as visual performance with legible phrase timing.
- **Motion:** Phrase wipes, baseline shifts, held emotional words, cuts on musical phrasing.
- **Typography:** Preserve exact supplied lyric, line breaks, and language.
- **Color:** Mood-led palette with high contrast.
- **Sound:** Music leads; type impacts land on phrase accents.
- **Story beats:** Establish mood, lyric hook, emotional turn, final phrase.
- **Avoid:** Invented lyrics, excessive word-per-word jitter, unreadable contrast.
- **Adaptation:** Replace topic, audience, language, platform, runtime, brand assets and factual sources. Preserve the motion grammar, then adapt density to runtime. Keep all claims verifiable and all on-screen text legible.

### Music-Led Shape and Sound Grammar (`music-led-shape-grammar`)

- **Duration:** 15-60s
- **Visual language:** Give a small set of graphic elements an explicit musical identity: kick drives scale, hi-hats drive small detail, bass controls mass or depth, and melody drives path or color. The visual language should be repeatable, not just audio-reactive noise.
- **Motion:** Analyze transients and tempo first, then map each visual parameter to a limited audio feature. Use smoothing and thresholding so the scene responds musically rather than jittering at every sample.
- **Typography:** Use sparse titles or lyric lines with predictable entry windows. Never sacrifice text legibility to uncontrolled waveform animation.
- **Color:** Assign color to musical roles and preserve a coherent palette across sections. Reserve one accent for a major musical change.
- **Sound:** Use the supplied licensed track or generated audio with documented rights. Keep peak levels controlled and check the final mix on headphones and phone speakers.
- **Story beats:** Establish the visual beat; introduce the main motif; add one layer per musical section; build to the strongest musical change; resolve into a clear ending or loop.
- **Avoid:** Unsmoothed frequency spikes, random scale flicker, audio clipping, syncopation without intentionality and a waveform that hides the main composition.
- **Adaptation:** Document the mapping between audio features and visual properties. Use measured beat/transient times, not guessed sync points, and allow a manual override for expressive beats.

### Chromatic Sound-Reactive Abstract Film (`chromatic-soundscape`)

- **Duration:** 15-60s
- **Visual language:** A minimal system of geometry, color and surface responds to the evolving structure of a music track.
- **Motion:** Map selected rhythmic or spectral events to controlled transformations; differentiate pulse, swell and transient instead of reacting everything equally.
- **Typography:** Use sparse labels or one title; keep type motion intentional and do not make it vibrate continuously.
- **Color:** Assign stable color roles to musical layers and reserve major palette shifts for structural changes.
- **Sound:** Treat the source track as the timing master; avoid adding redundant synthetic hits over strong transients.
- **Story beats:** Introduce motif → build layers with the track → peak at the musical climax → simplify → purposeful ending.
- **Avoid:** Random audio-reactive jitter, uncontrolled flashing, arbitrary color cycling or assuming a loudness peak is always a musical beat.
- **Adaptation:** Analyze tempo and phrase boundaries when tools permit. If no audio analysis is available, use an explicitly labeled manual beat map.

## Nature

### Nature Macro Documentary (`nature-macro`)

- **Duration:** 20-60s
- **Visual language:** Tiny natural details reveal a system through macro textures, measured labels and observational pacing.
- **Motion:** Slow focus pulls, organic motion, match cuts, soft reveals.
- **Typography:** Naturalist annotation, concise and factual.
- **Color:** Earth neutrals, moss, sky accents.
- **Sound:** Field ambience, subtle low score, no artificial impact overload.
- **Story beats:** Texture hook, organism/context, mechanism, wider reveal, takeaway.
- **Avoid:** Fake species claims, oversaturated greens, overanimated labels.
- **Adaptation:** Replace topic, audience, language, platform, runtime, brand assets and factual sources. Preserve the motion grammar, then adapt density to runtime. Keep all claims verifiable and all on-screen text legible.

## Particles

### Particle Field Reveal (`particle`)

- **Duration:** 10-30s
- **Visual language:** Particles form a symbol or object, disperse, then reconverge with intentional negative space.
- **Motion:** Attractor fields, turbulent drift, depth-of-field sweeps, controlled burst and settle.
- **Typography:** One short headline with generous tracking.
- **Color:** Deep navy/black with luminous spectral accents.
- **Sound:** Airy granular texture, bass swell, crisp convergence hit.
- **Story beats:** Sparse field, gathering, form reveal, controlled dissolution, logo hold.
- **Avoid:** Visual noise, constant explosion, unreadable glowing text.
- **Adaptation:** Replace topic, audience, language, platform, runtime, brand assets and factual sources. Preserve the motion grammar, then adapt density to runtime. Keep all claims verifiable and all on-screen text legible.

## Photo essay

### Cinematic Photo Journey (`cinematic-photo-journey`)

- **Duration:** 20-90s
- **Visual language:** Treat still photographs as windows into a coherent place, person or idea. Build depth using foreground, subject and background layers, careful crop changes, directional light and a consistent photographic mood.
- **Motion:** Use slow parallax, deliberate push-ins, lateral camera moves, masking and occasional match cuts. Every camera move should reveal new information; let emotionally important images breathe instead of moving every layer continuously.
- **Typography:** Use restrained editorial titles, photo credits when required, and minimal captions in high-contrast safe areas. Avoid covering faces or the focal point.
- **Color:** Derive a restrained palette from the selected photography. Maintain consistent contrast and skin tones while allowing one intentional chapter shift.
- **Sound:** Pair a modest musical arc with location ambience, cloth or paper textures and occasional deliberate silence. Do not add faux camera sounds to every move.
- **Story beats:** Establish place and mood; introduce human or thematic detail; increase proximity or contrast; reveal the central image; end with a quiet visual echo.
- **Avoid:** Random Ken Burns moves, repeated zooms, parallax that breaks anatomy, invented documentary context, unlicensed photography and text competing with the image.
- **Adaptation:** Use original or properly licensed images. Record credits and provenance. If only a still is available, make no claims about the motion or sound of its source video.

## Product film

### Cinematic Product Launch (`product-launch`)

- **Duration:** 20-60s
- **Visual language:** One hero product emerges from darkness with premium macro details and controlled reflections.
- **Motion:** Slow orbit, macro rack focus, precise slider moves, one high-energy reveal, elegant end orbit.
- **Typography:** Minimal sans, sparse labels, confident typographic hierarchy.
- **Color:** Obsidian, titanium, one luminous brand color.
- **Sound:** Deep restrained pulses, tactile clicks, designed whooshes; no generic trailer overload.
- **Story beats:** Mystery silhouette, material reveal, feature detail, hero shot, clean end card.
- **Avoid:** Fake features, impossible interfaces, clutter, cheap lens flares.
- **Adaptation:** Replace topic, audience, language, platform, runtime, brand assets and factual sources. Preserve the motion grammar, then adapt density to runtime. Keep all claims verifiable and all on-screen text legible.

### Luxury Craft Macro Film (`luxury-watch`)

- **Duration:** 15-45s
- **Visual language:** Precision craftsmanship is shown through material, micro-detail and slow controlled movement.
- **Motion:** Extreme macro, rack focus, turntable orbit, exact specular highlights.
- **Typography:** Sparse refined serif or sans; no unnecessary copy.
- **Color:** Graphite, ivory, restrained gold or steel.
- **Sound:** Mechanical micro-foley, low cinematic bed, deliberate silence.
- **Story beats:** Material, mechanism, craftsmanship detail, complete object, end frame.
- **Avoid:** Fake mechanism, excessive glow, overdone transitions.
- **Adaptation:** Replace topic, audience, language, platform, runtime, brand assets and factual sources. Preserve the motion grammar, then adapt density to runtime. Keep all claims verifiable and all on-screen text legible.

### Precision Mechanical Macro Film (`precision-mechanical-macro`)

- **Duration:** 10-45s
- **Visual language:** Explore a precision object through macro details, machining texture, controlled reflections and interlocking geometry. Make each close-up reveal a meaningful craft or functional detail.
- **Motion:** Use slow macro tracks, rack-focus-like transitions, rotation around a consistent axis and match cuts between related circular or linear forms. Movement should communicate tolerance, weight and assembly.
- **Typography:** Use minimal technical labels, material names or dimensions only when verified. Pair a compact mono face with a refined display face for brand messaging.
- **Color:** Use deep shadow, brushed metal, warm specular highlights and a controlled brand accent. Keep materials distinct through roughness and highlight behavior.
- **Sound:** Layer precise mechanical ticks, metal resonance and low-frequency movement with restrained music. Avoid exaggerated impacts that make a delicate object feel heavy.
- **Story beats:** Reveal silhouette; move into signature mechanism; show craft/detail; connect the mechanism to the user benefit; close with product and brand.
- **Avoid:** Impossible reflections, surface detail that changes between shots, fake macro depth, label clutter and a camera move that hides the product.
- **Adaptation:** Use approved product imagery or geometry; validate the exact model, mechanism and dimensions before presenting them as factual.

### Premium Automotive Reveal (`premium-automotive-reveal`)

- **Duration:** 15-45s
- **Visual language:** A vehicle is revealed through controlled silhouettes, detailed materials, designed reflections and confident negative space.
- **Motion:** Low tracking shots, measured orbit, precise headlight reveal, one decisive hero move and stable end frame.
- **Typography:** Use compact editorial headlines and technical labels only when they add real product information.
- **Color:** Deep neutral environment with a limited paint-highlight palette; maintain coherent reflective light sources.
- **Sound:** Original or licensed mechanical texture, restrained low-end accents and carefully timed transitions; do not fake engine characteristics.
- **Story beats:** Silhouette → material detail → design feature → motion moment → hero profile → brand end card.
- **Avoid:** Changing body geometry, fake badges, impossible reflections, unapproved logos or invented performance claims.
- **Adaptation:** Treat supplied product images and specifications as ground truth. Keep identity and geometry stable across shots and add exact copy in post.

### Jewelry and Material Macro Film (`jewelry-macro-film`)

- **Duration:** 10-30s
- **Visual language:** A single crafted object is revealed through macro detail, tactile surfaces and disciplined specular highlights.
- **Motion:** Slow orbital moves, focus pulls across one material feature and a decisive reveal; every movement should preserve product geometry.
- **Typography:** Minimal elegant headlines with generous breathing room and no unverified purity, provenance or performance claims.
- **Color:** Dark, warm or neutral field selected to support the real material; maintain coherent reflections.
- **Sound:** Close tactile foley and subtle musical tension, with a clean ending and no misleading luxury sound clichés.
- **Story beats:** Abstract material → craft detail → signature feature → complete object → quiet brand end frame.
- **Avoid:** Deformed stones, changing product dimensions, impossible reflections, invented hallmarks or exaggerated sparkle effects.
- **Adaptation:** Use approved product photography and factual material specifications. Let lighting sell texture, not unsupported claims.

## Product ui

### SaaS UI Showcase (`saas-ui`)

- **Duration:** 20-45s
- **Visual language:** A real interface is the hero, with crisp product states and purposeful cursor choreography.
- **Motion:** Card lifts, smooth camera push, focus transitions, restrained spring easing, cursor path with intent.
- **Typography:** UI typography stays legible; callouts use short labels and leader lines.
- **Color:** Neutral interface palette plus one accessible accent.
- **Sound:** Soft UI clicks, subtle transitions, low music bed.
- **Story beats:** Problem state, key workflow, 3 benefits, result state, CTA.
- **Avoid:** Unreadable UI, invented metrics, cursor teleporting, excessive parallax.
- **Adaptation:** Replace topic, audience, language, platform, runtime, brand assets and factual sources. Preserve the motion grammar, then adapt density to runtime. Keep all claims verifiable and all on-screen text legible.

### Mobile App Feature Story (`app-phone`)

- **Duration:** 15-40s
- **Visual language:** Phone mockups show one user journey with close crops and believable handoffs.
- **Motion:** Device parallax, swipe-driven cuts, matched motion, focus pull between screen and context.
- **Typography:** UI text at readable scale, short floating annotations.
- **Color:** Bright neutral surfaces, gradient accent, deep text contrast.
- **Sound:** Touch taps, swipe air, gentle rhythmic bed.
- **Story beats:** Need, first interaction, feature sequence, payoff, end card.
- **Avoid:** Warped phone edges, tiny text, fake notifications, inconsistent screen state.
- **Adaptation:** Replace topic, audience, language, platform, runtime, brand assets and factual sources. Preserve the motion grammar, then adapt density to runtime. Keep all claims verifiable and all on-screen text legible.

### App Onboarding Motion Flow (`app-onboarding`)

- **Duration:** 15-45s
- **Visual language:** Show a user reaching one meaningful outcome through three or four crisp interface states.
- **Motion:** Screen-to-screen match moves, cursor/touch choreography, modal reveal, intentional UI settling.
- **Typography:** Real UI copy, clear focus order, readable phone-safe labels.
- **Color:** Product palette with accessible contrast.
- **Sound:** Touch foley and light rhythmic cues.
- **Story beats:** Need, first step, key action, success state, CTA.
- **Avoid:** Invented UI controls, teleporting cursor, tiny text.
- **Adaptation:** Swap in the actual brief, approved assets and verified facts. Keep the recipe's core motion grammar but adapt pacing, contrast and information density to audience, duration and platform. Use original compositions rather than tracing a reference.

### Continuous Product UI State Morph (`product-ui-state-morph`)

- **Duration:** 15-45s
- **Visual language:** One recognizable UI component transforms through a deliberate sequence of useful states on a calm, high-contrast canvas. Keep its identity, geometry and interaction logic legible while surrounding context changes only when needed.
- **Motion:** Use deterministic, time-based springs with controlled overshoot. Morph one component at a time, animate leading and trailing edges separately for elastic indicators, and make clicks, drags and state changes causally visible. Close the loop only when the opening state can be matched exactly.
- **Typography:** Use one contemporary UI typeface with clear hierarchy for labels, values and controls. Keep text inside stable containers and give outgoing and incoming labels separate timing windows.
- **Color:** Warm neutral canvas, near-black components, off-white surfaces and at most one accent color. Reserve state colors for meaning, not decoration.
- **Sound:** Use quiet click, confirm, drag and transition cues. Analyze or measure transient peaks before placing sounds; lower music under labels.
- **Story beats:** Introduce the component; transform it through 6-10 states; show one meaningful interaction; resolve the final state into the opening state for a seamless loop.
- **Avoid:** Random transitions, ornamental glow, excessive bounce, overlapping labels, fake interaction, hidden state changes and an unverified claim that the UI is functional.
- **Adaptation:** Replace states with real features from the supplied product. Ask for or infer the actual state sequence, palette and interaction constraints. Prefer a small functional prototype over decorative lookalike UI; test representative frames.

### Liquid Glass Interface Showcase (`liquid-glass-interface`)

- **Duration:** 10-30s
- **Visual language:** Use glass-like surfaces as a selective material language around one useful interface. Transparency, refraction and highlight should clarify hierarchy instead of turning the UI into a vague decorative surface.
- **Motion:** Reveal a small set of controls through clean depth shifts, selective refraction and controlled elastic response. Keep text and key controls in crisp planes; use stable lighting directions and avoid changing material properties randomly.
- **Typography:** Use a clear UI face with strong luminance contrast behind or beside glass layers. Important instructions and values must stay readable without depending on blur-heavy panes.
- **Color:** Use a quiet dark or light base, neutral translucent surfaces and one controlled accent. Check contrast on the most transparent part of each panel.
- **Sound:** Use restrained glass taps and soft interface tones, distinct from ordinary button clicks. Leave space for narration or product copy.
- **Story beats:** Show the core task; introduce the glass layer as a functional control; demonstrate one interaction; reveal the practical benefit; settle on a clean product view.
- **Avoid:** Glass everywhere, invisible controls, glitter reflections, distorted text, physically inconsistent refraction and effects that conceal functionality.
- **Adaptation:** Treat liquid glass as a material, not the whole concept. Preserve the real hierarchy and use opacity/backplate fallback where legibility fails.

### Narrative Dashboard Product Story (`narrative-dashboard`)

- **Duration:** 20-60s
- **Visual language:** Tell one product story through a realistic workflow: starting problem, key data or task, meaningful interaction, resulting state and benefit. The UI should behave consistently like a coherent product, not a gallery of unrelated screens.
- **Motion:** Keep a stable cursor path, use scroll or camera movement only when it reveals information, and animate values only when the underlying event explains the change. Hold the user-relevant result after the transition.
- **Typography:** Use realistic sizes and spacing. Prioritize labels, figures, status states and empty/error states. Avoid decorative microcopy that cannot be read.
- **Color:** Honor the actual product palette when available. Use state colors consistently and provide shape, icon or text cues in addition to color.
- **Sound:** Use authentic interaction cues sparingly and lower music during important information. Avoid adding a click for every cursor movement.
- **Story beats:** State the user's problem; show the initial dashboard; perform the key action; reveal a truthful outcome; close with the product value proposition.
- **Avoid:** Invented analytics, inconsistent navigation, impossible interactions, cursor teleportation and rapid zooms that make the workflow hard to follow.
- **Adaptation:** Prefer real screenshots or source UI components and verified data. Mark mock data as illustrative. Test transitions at phone-sized scale.

### UI-to-Physical-World Match Transition (`product-ui-to-physical-world`)

- **Duration:** 15-45s
- **Visual language:** A real interface element transforms into a physical-world form through a motivated match in shape, motion or function.
- **Motion:** Establish shared geometry, align the transformation axis, preserve motion direction and use a brief settled frame after the reveal.
- **Typography:** Use exact UI copy and short transition labels; add typography in post for precision.
- **Color:** Carry one UI accent into the physical scene to bind the two visual worlds.
- **Sound:** Bridge a UI click into a tactile real-world sound; preserve spatial plausibility and narration clarity.
- **Story beats:** Interface action → geometric match → physical reveal → product/context evidence → final message.
- **Avoid:** Magic transformations unrelated to function, distorted product shapes, inconsistent light direction or copying another brand's distinctive transition.
- **Adaptation:** Choose an original UI element and a physically meaningful counterpart. State exactly which edge, movement and timing connect the two scenes.

## Retro futurism

### Retro-Futurist Tech Promo (`retro-futurism`)

- **Duration:** 15-45s
- **Visual language:** Analog-era futurism meets precise modern motion, using grids, scan textures and bold shapes.
- **Motion:** Vector sweeps, stepped timing, CRT-inspired transitions used sparingly, geometric wipes.
- **Typography:** Wide display face with mono labels.
- **Color:** Amber, cobalt, cream, deep charcoal.
- **Sound:** Analog bleeps, tape texture, punchy synth bass.
- **Story beats:** Signal boot, system reveal, escalating modules, hero title.
- **Avoid:** Fake VHS damage everywhere, nostalgia clutter, illegible microcopy.
- **Adaptation:** Replace topic, audience, language, platform, runtime, brand assets and factual sources. Preserve the motion grammar, then adapt density to runtime. Keep all claims verifiable and all on-screen text legible.

## Retro game

### Pixel-Art Motion Sequence (`retro-game-pixel`)

- **Duration:** 10-30s
- **Visual language:** A limited pixel-art scene animates with consistent grid logic and deliberate frame timing.
- **Motion:** Stepped animation, sprite entrances, pixel-perfect wipes, parallax layers on integer movement.
- **Typography:** Pixel font for titles, clean labels outside the pixel grid if needed.
- **Color:** Limited 8-16 color palette with controlled contrast.
- **Sound:** Chiptune accents and precise retro UI bleeps.
- **Story beats:** Scene boot, character/object reveal, action beat, title hold.
- **Avoid:** Subpixel blur, inconsistent pixel size, excessive palette drift.
- **Adaptation:** Swap in the actual brief, approved assets and verified facts. Keep the recipe's core motion grammar but adapt pacing, contrast and information density to audience, duration and platform. Use original compositions rather than tracing a reference.

## Sci fi

### Neon Cyberpunk Interface (`neon-cyber`)

- **Duration:** 15-45s
- **Visual language:** A fictional future interface communicates one clear idea through layered holographic panels.
- **Motion:** Depth parallax, scan reveals, controlled glitch on transitions, focus handoff.
- **Typography:** Monospace data labels with a clear display headline.
- **Color:** Midnight blue, magenta, cyan, readable neutral text.
- **Sound:** Synth pulses, digital clicks, restrained glitch bursts.
- **Story beats:** Signal acquisition, interface build, critical alert, system resolution.
- **Avoid:** Unreadable fake code, constant glitch, flashing that risks photosensitivity.
- **Adaptation:** Replace topic, audience, language, platform, runtime, brand assets and factual sources. Preserve the motion grammar, then adapt density to runtime. Keep all claims verifiable and all on-screen text legible.

## Science

### Cosmic Scale Journey (`space-cosmos`)

- **Duration:** 30-90s
- **Visual language:** Move from intimate object to vast cosmic scale using credible spatial transitions and scale cues.
- **Motion:** Slow drift, parallax star layers, measured zooms, scale labels and match cuts.
- **Typography:** Elegant scientific labels, units and scale clearly visible.
- **Color:** Near-black, deep blues, restrained spectral color.
- **Sound:** Wide airy ambience, slow orchestral/synth rise.
- **Story beats:** Human-scale hook, planetary context, scale leap, insight, quiet ending.
- **Avoid:** Unexplained scale jumps, false astronomical facts, excessive lens flares.
- **Adaptation:** Replace topic, audience, language, platform, runtime, brand assets and factual sources. Preserve the motion grammar, then adapt density to runtime. Keep all claims verifiable and all on-screen text legible.

### Scientific Mechanism Animation (`science-lab`)

- **Duration:** 30-90s
- **Visual language:** A scientific process is visualized in stages, separating established mechanisms from simplified models.
- **Motion:** Cutaway, particle/flow animation, isolate one mechanism, label transitions.
- **Typography:** Accurate terms, readable units, uncertainty notes when needed.
- **Color:** Clean lab neutrals plus distinct process colors.
- **Sound:** Precise clicks, gentle tonal bed, no dramatic misinformation cues.
- **Story beats:** Question, system overview, close-up mechanism, evidence, summary.
- **Avoid:** Presenting metaphor as literal, fake data, cluttered labels.
- **Adaptation:** Replace topic, audience, language, platform, runtime, brand assets and factual sources. Preserve the motion grammar, then adapt density to runtime. Keep all claims verifiable and all on-screen text legible.

### Molecular Science Visualization (`molecular-world`)

- **Duration:** 20-60s
- **Visual language:** A simplified molecular process makes one scientific mechanism visible while labeling the model as a model.
- **Motion:** Orbit and cutaway, highlight one interaction, pause before changing scale, keep object identity stable.
- **Typography:** Scientific names and units remain readable; distinguish schematic from scale-accurate view.
- **Color:** Lab neutrals with stable color mapping per component.
- **Sound:** Fine clicks, low tonal bed, no overdramatic impacts.
- **Story beats:** System, close-up, interaction, consequence, caveat.
- **Avoid:** Presenting a schematic as literal scale, unverified chemistry, random particles.
- **Adaptation:** Swap in the actual brief, approved assets and verified facts. Keep the recipe's core motion grammar but adapt pacing, contrast and information density to audience, duration and platform. Use original compositions rather than tracing a reference.

### Cinematic Science Cutaway (`cinematic-science-cutaway`)

- **Duration:** 30-90s
- **Visual language:** Move between an intuitive macro metaphor and a carefully labelled mechanism view. Use cinematic atmosphere to invite curiosity, but keep explanatory structures scientifically defensible.
- **Motion:** Use controlled scale changes, sectional cutaways, highlighted pathways and staged reveals. Make each zoom establish a meaningful change in scale rather than imply a literal camera journey when none exists.
- **Typography:** Use simple labels, units and direction cues. Distinguish measured facts from explanatory metaphors and keep qualifiers next to the claim they qualify.
- **Color:** Use a calm dark or neutral base and a small functional palette for structures, flows and boundaries. Maintain the same semantic color for the same entity.
- **Sound:** Mix subtle environmental tones with precise reveal accents. Keep narration intelligible and avoid using cinematic booms to suggest unsupported danger.
- **Story beats:** Pose a question; offer a familiar-scale analogy; reveal the mechanism; identify a key interaction; summarize the supported conclusion and uncertainty.
- **Avoid:** Pseudo-scientific labels, inconsistent scale, unsupported molecular detail, misleading arrows and metaphors presented as direct observation.
- **Adaptation:** Research claims with primary or authoritative sources. Add an explicit visual-metaphor label when necessary and do not imply that an illustrative cutaway is an actual photograph.

### Careful Medical and Biological Mechanism Explainer (`medical-mechanism`)

- **Duration:** 30-120s
- **Visual language:** Explain a body system or biological mechanism with simplified but defensible diagrams, clear scale cues and careful separation between established evidence and illustrative metaphor.
- **Motion:** Use staged cutaways, highlighted pathways and controlled zooms between scales. Keep anatomical relationships stable and show direction only when supported by the source.
- **Typography:** Use plain-language labels, define technical terms and keep caveats next to relevant claims. Source notes must be readable and never buried in a final one-frame card.
- **Color:** Choose an accessible, consistent semantic palette for structures and flows. Do not depend on red/blue conventions alone to imply a diagnosis or severity.
- **Sound:** Keep narration calm and intelligible. Use quiet motion accents instead of alarms or dramatic sounds that suggest unwarranted danger.
- **Story beats:** Ask the question; define the system; show the supported mechanism; clarify what is known and what varies; end with a source-backed summary.
- **Avoid:** Personal diagnosis, treatment promises, fabricated tissue details, false certainty, fear-based effects and visual metaphors presented as direct observation.
- **Adaptation:** Use authoritative sources and explicitly scope the explanation. This recipe is for general education, not individual medical advice. Label diagrams as illustrative when appropriate.

### Scientific Mechanism Cutaway (`scientific-mechanism-cutaway`)

- **Duration:** 30-120s
- **Visual language:** A complex physical or biological mechanism is explained through a layered cutaway and carefully staged close-ups.
- **Motion:** Reveal outer structure before internal motion, animate causal steps in correct order and hold on equilibrium or outcome.
- **Typography:** Use concise labels with units and a stable legend; separate actual measured quantities from illustrative values.
- **Color:** Use consistent color coding for components and avoid suggesting false material or temperature differences.
- **Sound:** Restrained pulses and delicate mechanical textures; narration remains the primary explanation channel.
- **Story beats:** Observable effect → outer structure → internal mechanism → cause-and-effect sequence → evidence → summary.
- **Avoid:** Scientifically impossible anatomy, unexplained arrows, fake measurements or cinematic spectacle that misrepresents scale.
- **Adaptation:** Build from a trusted reference diagram and expert-reviewed descriptions when possible. Mark visual simplifications and avoid presenting metaphor as literal anatomy.

### Quantum and Invisible-Scale Visualization (`quantum-scale-visualization`)

- **Duration:** 30-90s
- **Visual language:** Abstract particles and probability fields communicate scale changes while maintaining a clear distinction between model and reality.
- **Motion:** Use scale transitions, probability fades and linked visual states; do not depict abstract entities as tiny planets unless clearly metaphorical.
- **Typography:** Define technical terms on first use and maintain a visible scale or model legend.
- **Color:** Two or three semantic colors against a quiet deep or light field; keep color meaning stable.
- **Sound:** Sparse tonal motifs that support wonder without making unsupported causal cues.
- **Story beats:** Everyday scale → question → model reveal → interaction or uncertainty → limitation → concise takeaway.
- **Avoid:** False certainty, fake particle trajectories represented as observed paths, unsupported claims or mathematical notation used only as decoration.
- **Adaptation:** Have a source ledger distinguish established findings, theoretical models and visual metaphors. Keep citations close to the relevant claim or in a visible source card.

## Showreel

### Beat-Driven Motion Designer Showreel (`beat-driven-showreel`)

- **Duration:** 15-30s
- **Visual language:** Build the entire reel around one visual thesis, such as a dot becoming a glyph, a chart, a material and a final wordmark. Every technique should advance that idea instead of appearing as an unrelated effects demo.
- **Motion:** Choose a tempo that fits the brand, map scene changes to a beat grid, give each bar one signature move and use match-movement transitions. Reserve the strongest transformation for the last full bar, then hold the end title long enough to read.
- **Typography:** One display face plus a restrained mono or sans-serif metadata face. Keep every word deliberate, aligned to the scene grid, and away from the action during dense movement.
- **Color:** One primary palette with no more than three main hues plus neutrals. Reuse the same accent as a visual thread through every technique.
- **Sound:** Build a kick/snare or pulse framework, restrained risers and a distinctive sound for the core transformation. Make sound design support motion rather than mask it.
- **Story beats:** Hook; establish thesis; demonstrate three to five techniques that transform into each other; deliver one payoff; end on a clear title or logo.
- **Avoid:** Random motion sampler, unrelated stock transitions, constant maximum intensity, flash frames, gratuitous camera shake and a finale that has no relationship to the opening.
- **Adaptation:** Tune the beat grid to the actual track rather than assuming a fixed BPM. Produce a beat-by-beat storyboard before animation and review one frame per beat for hierarchy and continuity.

### Concept-Led Motion Design Showreel (`motion-design-showreel`)

- **Duration:** 15-30s
- **Visual language:** A single memorable concept evolves through typography, shape, spatial depth and one meaningful data or UI moment.
- **Motion:** Make every shot grow from the previous one; use a beat grid as structure, one technique per phrase and a purposeful loop or end card.
- **Typography:** Limit type families and palette; make the main concept legible and use supporting labels only when they reinforce the visual idea.
- **Color:** No more than three primary colors plus neutral tones; keep hue roles consistent through transformations.
- **Sound:** Align key changes to the musical phrase structure, use accents sparingly and create a clean landing at the final title.
- **Story beats:** Name the concept → hook → technique progression → strongest transformation → final reveal or loop.
- **Avoid:** Unrelated effect demonstrations, default glows, particles and lens flares, random camera shake, generic crossfades or style changes without connective logic.
- **Adaptation:** Treat the public Prompt Motion showreel pattern as a design hypothesis, not a template to copy. Write an original concept, generate a beat-by-beat storyboard, and validate beat alignment and frame continuity.

## Social

### Vertical Social Hook (`social-hook`)

- **Duration:** 15-45s
- **Visual language:** A vertical-first story communicates one compelling idea in the first second and changes visual scale every few beats.
- **Motion:** 9:16 safe zones, punch-in, caption-led transitions, quick pattern interrupts followed by holds.
- **Typography:** Large captions, short lines, high contrast, platform-safe margins.
- **Color:** High contrast with 2-3 consistent colors.
- **Sound:** Immediate audio cue, tight edits, controlled music ducking.
- **Story beats:** Hook, context, 2-3 escalating beats, payoff, loopable ending.
- **Avoid:** Tiny subtitles, clickbait unsupported by content, incessant zoom.
- **Adaptation:** Replace topic, audience, language, platform, runtime, brand assets and factual sources. Preserve the motion grammar, then adapt density to runtime. Keep all claims verifiable and all on-screen text legible.

### Vertical Mini-Documentary (`vertical-mini-documentary`)

- **Duration:** 30-90s
- **Visual language:** A mobile-first narrative pairs strong footage or original imagery with clear editorial type and purposeful motion overlays.
- **Motion:** Open with an immediate visual question; alternate tight details and context; use vertical-safe reframing and concise motion beats.
- **Typography:** Use large headline text, short caption lines, high contrast and safe zones around platform UI.
- **Color:** A coherent three-color system that remains readable over varied footage, using scrims or panels where needed.
- **Sound:** Voice leads, captions mirror approved narration and music ducks under every key phrase.
- **Story beats:** Hook → one fact or scene → explanation → surprising turn → takeaway → clear ending.
- **Avoid:** Tiny text, rapid cuts without story, claims without sources, important content beneath UI overlays or constant zooming.
- **Adaptation:** Write for spoken cadence and phone viewing. Test at actual mobile size and provide captions plus a source note for factual work.

## Sports

### Sports Highlight Motion Package (`sports-hype`)

- **Duration:** 10-30s
- **Visual language:** A real supplied athlete or team moment gets a high-energy editorial package without inventing stats.
- **Motion:** Speed ramps, freeze frames, kinetic stat callouts, directional wipes.
- **Typography:** Bold condensed display; stats only from supplied verified data.
- **Color:** Team colors only if provided, high-contrast neutrals.
- **Sound:** Punchy impacts, crowd texture, beat-synced cuts.
- **Story beats:** Setup, decisive moment, stat or quote, hero freeze, end card.
- **Avoid:** Fabricated stats, face distortion, too many flashes, random zooms.
- **Adaptation:** Replace topic, audience, language, platform, runtime, brand assets and factual sources. Preserve the motion grammar, then adapt density to runtime. Keep all claims verifiable and all on-screen text legible.

### Sports Data Moment (`sports-data`)

- **Duration:** 10-30s
- **Visual language:** One verified sports stat or tactical insight becomes a concise visual sequence with context and clear units.
- **Motion:** Freeze frame, path overlay, one highlighted metric, directional move and final comparison.
- **Typography:** Bold headline with verified number, units, season/date and source.
- **Color:** Team palette only when provided; otherwise neutral plus one accent.
- **Sound:** Crowd texture sparingly, beat accents on verified reveal.
- **Story beats:** Context, key moment, stat, interpretation, clean close.
- **Avoid:** Fabricated stats, misleading sample size, excessive flashing.
- **Adaptation:** Swap in the actual brief, approved assets and verified facts. Keep the recipe's core motion grammar but adapt pacing, contrast and information density to audience, duration and platform. Use original compositions rather than tracing a reference.

### Sports Momentum and Tactics Breakdown (`sports-momentum-story`)

- **Duration:** 15-60s
- **Visual language:** A precise freeze-frame, tactical overlay and dynamic replay reveal one decisive sports moment or spatial idea.
- **Motion:** Freeze the key instant, trace only the relevant player/ball path, replay at controlled speed and return to real pace.
- **Typography:** Use short labels, direction arrows and score/time only when verified from the source footage.
- **Color:** Use the team or field palette only when rights and identity are appropriate; ensure overlays contrast with live footage.
- **Sound:** Keep crowd ambience under narration; time accents to a genuine moment rather than inventing a hit.
- **Story beats:** Hook frame → spatial context → path/decision → consequence → replay at normal speed → takeaway.
- **Avoid:** Invented statistics, changed player identities, incorrect rules, impossible trajectories or obscuring action with graphics.
- **Adaptation:** Verify footage rights and all game facts. Keep the diagram aligned to the correct frame and label speculative tactical interpretation as analysis.

## Storyboard

### Multi-Shot Storyboard with Continuity Locks (`multi-shot-storyboard`)

- **Duration:** 30-180s
- **Visual language:** A clear narrative told through distinct shot sizes and compositions with a stable visual identity across cuts.
- **Motion:** One primary action per shot; deliberate shot-to-shot match cuts, motivated camera moves, controlled speed ramps, clear settling frames.
- **Typography:** Reserve fixed lower-third and title-safe zones; use a consistent type scale and never place critical copy over busy action.
- **Color:** Three shared palette anchors plus neutral shadows and highlights; keep white balance consistent between adjacent shots.
- **Sound:** Create a sound bridge across scene transitions; use accents only for meaningful story beats and preserve narration headroom.
- **Story beats:** Hook → context → escalation → reveal → consequence → visual resolution; every beat has a purpose and estimated duration.
- **Avoid:** Changing character details, wardrobe, screen layout, lighting direction or camera axis without narrative reason.
- **Adaptation:** Build a continuity sheet before shot generation. Reuse exact subject descriptions and references where supported; each shot should be individually renderable and editable.

## Technical explainer

### Exploded Process and Assembly Explainer (`process-explainer`)

- **Duration:** 30-120s
- **Visual language:** Make an invisible or complicated process understandable by showing its parts, order and relationships. Use a consistent exploded-view diagram with clear spatial anchors, numbered stages and restrained material detail.
- **Motion:** Move parts along readable paths, pause at important assemblies, use highlight sweeps only to point at meaningful connections, and keep camera orientation stable until a new viewpoint is explained.
- **Typography:** Use concise numbered steps, labels with leader lines and units where necessary. Maintain hierarchy between part names, functions and the current process stage.
- **Color:** Neutral technical base, separate functional components with a small semantic palette, and reserve a bright accent for the active part.
- **Sound:** Use precise clicks, fasteners, airflow or material-specific textures sparingly. Narration should identify purpose before each complex movement.
- **Story beats:** Show the final object or outcome; disassemble into understandable groups; explain each stage in causal order; reassemble; restate the benefit or core mechanism.
- **Avoid:** Parts moving without causal explanation, impossible connections, labels detaching from objects, overlong technical lists and visual complexity that hides the mechanism.
- **Adaptation:** Verify the real sequence and component names with a reliable source or product owner. Label a conceptual visualization as illustrative when geometry is not to scale.

## Technology

### Cybersecurity Threat and Defense Explainer (`cybersecurity-threat-map`)

- **Duration:** 30-90s
- **Visual language:** A clean system diagram shows data flow, attack surface and defenses without turning security into a generic neon hacker montage.
- **Motion:** Trace one path through the system, isolate the failure point, then animate the defense and verified outcome.
- **Typography:** Use monospace for technical identifiers and a strong sans for the core message; define acronyms on first use.
- **Color:** Neutral system canvas with restrained warning, neutral and protected-state colors that remain accessible.
- **Sound:** Minimal UI alerts and low-level tension; use a clear sonic resolution only when the remediation has been explained.
- **Story beats:** Asset → exposure → attack path at a high level → control → verification → practical lesson.
- **Avoid:** Giving actionable exploitation steps, fake terminal output, random code rain or claims that one control eliminates all risk.
- **Adaptation:** Use defensive, authorized framing and accurate architecture. Label simulated interfaces as illustrative and verify every security claim against current sources.

## Title sequence

### Atmospheric Horror Title Sequence (`horror-title`)

- **Duration:** 10-30s
- **Visual language:** Negative space, shadow and restrained texture create unease before a precise title reveal.
- **Motion:** Slow creeping push, occlusion, delayed focus, one abrupt cut used intentionally.
- **Typography:** Narrow display type, sparse words, stable readable title.
- **Color:** Near-black, bone, desaturated red accent.
- **Sound:** Low drones, breath-like texture without fake dialogue, silence before impact.
- **Story beats:** Texture, suggestion, tension, title, lingering hold.
- **Avoid:** Cheap jump-scare spam, gore, illegible title, constant shake.
- **Adaptation:** Replace topic, audience, language, platform, runtime, brand assets and factual sources. Preserve the motion grammar, then adapt density to runtime. Keep all claims verifiable and all on-screen text legible.

## Transitions

### Signature Transition Study (`cinematic-transition-library`)

- **Duration:** 10-40s
- **Visual language:** A limited family of transitions emerges from one visual motif and carries the viewer between distinct content beats.
- **Motion:** Define wipe direction, duration, acceleration and the outgoing/incoming geometry; use match cuts, occlusions or shape continuity only when motivated.
- **Typography:** Keep transition overlays subordinate to the core message and ensure titles do not clip across the frame edge unexpectedly.
- **Color:** Use a shared accent or texture to make transition logic recognizable without imposing identical colors on every scene.
- **Sound:** Each transition gets a restrained, consistent sonic family with variation for major beats.
- **Story beats:** Introduce transition motif → apply it in contrasting contexts → build complexity once → end on a clean resolved frame.
- **Avoid:** Using transitions to disguise weak story structure, repeating the same wipe on every cut or combining conflicting camera directions.
- **Adaptation:** Create a transition spec with start/end frames and timing. Test each transition against both a quiet and a visually busy shot.

## Typography

### Kinetic Typography Trailer (`kinetic-type`)

- **Duration:** 15-45s
- **Visual language:** Oversized words become architecture, crop into the frame, split on syllables, and lock to beats.
- **Motion:** Fast scale punches, masked reveals, 2-frame overshoots, staggered glyph entrances, intentional holds.
- **Typography:** Condensed grotesk for impact, mono for metadata; animate word groups, never random letters.
- **Color:** Ink black, warm white, one electric accent.
- **Sound:** Percussive hits, paper snaps, sub drops; duck music under key phrases.
- **Story beats:** Hook in 1s, build through 3 escalating phrases, final title held 1.5s.
- **Avoid:** Unreadable speed, random bounce, more than two typefaces, decorative text.
- **Adaptation:** Replace topic, audience, language, platform, runtime, brand assets and factual sources. Preserve the motion grammar, then adapt density to runtime. Keep all claims verifiable and all on-screen text legible.

### Swiss Grid Typography Film (`swiss-grid`)

- **Duration:** 15-40s
- **Visual language:** A strict grid creates tension through asymmetry, oversized type and precise alignment.
- **Motion:** Hard cuts, linear slides, measured scale changes, grid snapping.
- **Typography:** Neutral grotesk, disciplined hierarchy, strong whitespace.
- **Color:** Black, white, one red or blue accent.
- **Sound:** Dry clicks, restrained metronomic score.
- **Story beats:** Statement, contradiction, grid expansion, resolved composition.
- **Avoid:** Random alignment, unnecessary decoration, inconsistent margins.
- **Adaptation:** Replace topic, audience, language, platform, runtime, brand assets and factual sources. Preserve the motion grammar, then adapt density to runtime. Keep all claims verifiable and all on-screen text legible.

### Sculptural 3D Typography (`3d-typography`)

- **Duration:** 10-30s
- **Visual language:** Words become physical objects with material, lighting and depth that reinforce meaning.
- **Motion:** Macro orbit, extrusion reveals, light sweeps, collision with controlled settle.
- **Typography:** One hero phrase; secondary labels remain flat and clear.
- **Color:** Material-led monochrome with accent reflections.
- **Sound:** Low impacts, metallic ticks, airy transitions.
- **Story beats:** Fragment, assembly, material reveal, hero phrase hold.
- **Avoid:** Unreadable perspective, excessive bevels, text changing spelling.
- **Adaptation:** Replace topic, audience, language, platform, runtime, brand assets and factual sources. Preserve the motion grammar, then adapt density to runtime. Keep all claims verifiable and all on-screen text legible.

### Typography Transforms into Architecture (`type-to-architecture`)

- **Duration:** 12-35s
- **Visual language:** Begin with a bold typographic statement, then let its stems, counters and baselines become beams, walls, streets or a spatial diagram. The 3D world must retain a visible relationship to the original word.
- **Motion:** Use a controlled camera push, extrusion, split-depth planes and perspective reveal. Transition through shared edges and silhouettes; keep the word readable before it becomes structure and reassemble it for the closing mark.
- **Typography:** Choose a robust display face with simple geometry. Set deliberate line breaks and avoid complex letterforms if their contours must become architectural components.
- **Color:** Use a dark or paper-like base, a single material accent and controlled lighting. Separate the typographic silhouette from the environment by value contrast.
- **Sound:** Use low mechanical resonance, paper-like typography snaps and restrained spatial ambience. Place the main materialization on a clear musical accent.
- **Story beats:** Readable word; first edge extrudes; letters form a navigable structure; camera reveals the larger pattern; structure resolves back to a final word or message.
- **Avoid:** Arbitrary letter deformation, unreadable perspective text, random flying blocks, physically inconsistent lighting and geometry unrelated to the message.
- **Adaptation:** Map each major letterform or typographic axis to one meaningful component. Ensure the source word is readable before and after the transformation.

### Kinetic Typography Poetry Film (`kinetic-type-poetry`)

- **Duration:** 20-75s
- **Visual language:** Words carry emotional meaning through scale, rhythm, spacing and negative space rather than decorative effects.
- **Motion:** Animate phrases as semantic units, use punctuation as a timing cue, transition from tension to stillness and let key words settle.
- **Typography:** Choose one expressive display face and one supporting text face; preserve phrase-level readability and line breaks.
- **Color:** A restrained palette with one meaningful accent used at emotional pivots.
- **Sound:** Voice or spoken word leads; synchronize impacts to stressed syllables, leaving deliberate quiet between phrases.
- **Story beats:** Opening line → image-word tension → repetition with variation → emotional turn → final line held in stillness.
- **Avoid:** Animating random letters without meaning, constant motion, hiding text in blur or drowning voice with music.
- **Adaptation:** Mark the script with pauses, stress, and phrase groups. Design the motion from spoken cadence rather than forcing every word onto equal beats.

### Animated Typographic Poster Film (`typographic-poster-film`)

- **Duration:** 10-30s
- **Visual language:** A poster composition comes alive through controlled type, grid, texture and one or two striking spatial transformations.
- **Motion:** Start from a legible poster; animate hierarchy in a deliberate sequence, use crop and masks, then settle into a strong still.
- **Typography:** Preserve exact wording, punctuation and hierarchy; critical copy should be typeset by the renderer, not hallucinated by a generative video model.
- **Color:** One dominant ground, one type color and a small accent; maintain consistent contrast throughout motion.
- **Sound:** Two or three purposeful accent sounds with a short musical bed; leave a clean final hold.
- **Story beats:** Graphic hook → headline transform → supporting detail → composition expands → final poster hold.
- **Avoid:** Unreadable warping, excessive distortion, accidental misspellings, random grain or effects that weaken hierarchy.
- **Adaptation:** Create a static design first, then specify what moves and what remains locked. Verify every final glyph in a rendered still.

## General production rule

A prompt is not a substitute for source evidence, a licensed asset, functioning software, or a reviewed render. Keep factual claims source-linked, apply exact text in a deterministic compositor where possible, and label whether each reference was sampled, fully watched, or only described on its page.
