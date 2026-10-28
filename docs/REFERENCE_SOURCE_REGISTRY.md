# Reference Source Registry and Research Protocol

Last verified: 2026-10-28. This is a research-routing guide, not a claim that every entry has been exhaustively reviewed or that every service exposes an API.

## Priority order

### Priority 1: Prompt Motion — primary prompt-to-technique reference
- Site: https://prompt-motion.com/
- Why it leads: it presents motion examples together with their published prompts and reusable skills, with categories such as kinetic type, charts, diagrams, product UI, shapes, particles, characters, photos, music and code.
- Primary use: study the relationship between a creative brief, a prompt/skill, the resulting motion, and the production constraints. Search Prompt and Skill separately.
- For each useful example, capture: title, creator attribution, original URL, category, model/tool named by the source, prompt/skill availability, visible technique, evidence level, usage/licence notes, and a short original adaptation for this studio.
- Extract reusable principles, not entire creator-authored prompts. If exact quotation/copying is explicitly permitted by the source, keep it clearly attributed and record the stated terms; otherwise summarize and transform the underlying technique into an original studio prompt.
- Do not infer that the model/tool named by an example is installed or callable in this repository.

### Priority 2: ShotBook — execution and technique breakdown
- Site: https://shotbook.art/
- Use for technique-oriented search, hooks, transitions, VFX/3D/AI, pacing, camera/composition and tutorial leads.
- Verify claims against the linked original source when possible. Record whether a technical breakdown was read or a clip was actually watched.

### Priority 3: Genery — cinematic visual grammar
- Site: https://genery.io/
- Use its cinematic frames, effects library, film/TV/music-video boards and creator moodboards to study framing, lens-like perspective, lighting, palette, camera movement and visual continuity.
- Treat a still as evidence of composition/light/color only, not of how the shot moves or sounds.

### Priority 4: Motion in Design — interaction, physics and polished motion
- Site: https://www.motionin.design/
- Use for interaction concepts, cursor-responsive/physics-based motion, GSAP implementation ideas and carefully polished timing/easing.
- The site sells premium assets/sections. Do not assume an asset or prompt is free, reusable, or included in this repository. Study public previews and techniques; download or adapt proprietary assets only when the applicable licence permits it.

### Priority 5: FilmGrab — cinematography and shot composition
- Site: https://film-grab.com/
- Use as a curated still-frame reference for lighting, blocking, shot scale, negative space, palette, atmosphere and visual storytelling.
- FilmGrab describes its images as being presented for educational/reference purposes and says it does not own the imagery. Do not bulk-scrape, mirror, package, or redistribute frames. Store source links and textual observations; use licensed or original imagery in outputs.

### Priority 6: Pinterest — broad discovery and moodboards
- Site: https://www.pinterest.com/
- Use for manual discovery of style directions, palettes, layouts, typography and cross-domain inspiration. Follow pins back to the original creator/source and verify provenance.
- Do not build an automated scraper or bulk downloader. Pinterest's terms prohibit unauthorized automated collection/access. Use approved APIs only if a future integration is explicitly authorized and complies with current terms.
- A pin is a discovery lead, not proof of ownership or a production licence.

## Required workflow (especially for Prompt Motion)

1. Start with Prompt Motion before broad image search. Search the closest category and inspect both Prompt and Skill entries.
2. Choose references that solve the current brief's specific problem (for example: type reveals, chart storytelling, product UI, particles, camera choreography, character performance, sound rhythm), not merely those that look attractive.
3. Open the source entry and its linked creator/source. Record what was actually inspected.
4. Assign evidence honestly: L0 metadata/thumbnail; L1 source description/article/transcript; L2 complete video watched; L3 timestamped visual breakdown with representative frame evidence.
5. Separate observed facts from interpretations. Never invent an exact font, timing, easing curve, sound cue, model, or tool if the source does not substantiate it.
6. Translate findings into a studio-owned recipe with changed story, layout, palette, typography, timing, transition logic and assets. Do not recreate a reference shot-for-shot.
7. Check access and licensing before copying prompts, downloading assets, using a paid service, or embedding third-party media. No paid action or account creation without explicit user approval.
8. Add a record to `research/references.jsonl`, preserving source attribution and evidence fields. Deduplicate canonical URLs; never upgrade a record's evidence level merely because a site advertises a technical breakdown.
9. Update `docs/REFERENCE_PATTERN_MATRIX.md` only when findings have sufficient evidence. Keep Prompt Motion-specific findings separate from cinematic-still findings.
10. Refresh the status using `npm run research:catalog`. A catalog entry is not equivalent to a completed visual analysis.

## Capture template

- Stable ID:
- Source site / original URL:
- Creator and attribution:
- Entry type: prompt / skill / clip / still / article / moodboard / tutorial:
- Topic/style category:
- Evidence level (L0–L3):
- What was actually inspected:
- Model/tool named by source (not necessarily installed):
- Technique: composition / typography / movement / camera / transitions / sound / pacing / interaction:
- Observation (verifiable):
- Interpretation and confidence:
- Original adaptation for this studio:
- Licence/access restrictions:
- Next action:
