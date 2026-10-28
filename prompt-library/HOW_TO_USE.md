# How to use this library with any AI

## Workflow
1. Copy the universal master prompt and fill the brief. If a field is unknown, use a sensible default and label it as an assumption.
2. Pick a recipe with `npm run prompts:list` or search by keyword.
3. Append the complete recipe from `npm run prompts:show -- <id>`.
4. Ask for a timed storyboard before generating shots. For factual explainers, provide trustworthy sources and require claim-by-claim verification.
5. Generate shots individually when the model struggles with long sequences. Reuse the same subject description, style bible, palette, lens language and seed/reference image when supported.
6. Add exact text, subtitles, logos, charts and citations in a deterministic editor/compositor whenever possible. Do not trust image models to render critical copy.
7. Edit to rhythm, mix voice/music/SFX, review accessibility and render a short proof before the full export.
8. Review the result and revise the weakest 1-2 dimensions rather than adding effects everywhere.

## Prompt adaptation by tool class
- Text/chat AI: request concept, script, storyboard, shot prompts, edit decision list and QC plan.
- Image model: request a single keyframe or asset per prompt; specify subject, composition, lighting, material, lens, palette, negative space and continuity.
- Text-to-video model: specify one shot, duration, subject action, camera movement, temporal progression, lighting, style consistency and unwanted changes.
- Image-to-video model: state what must remain fixed and exactly what should move. Prefer one main movement and a subtle secondary motion.
- Code-based renderer: translate each beat into explicit layers, frame ranges, easing curves, typography, transitions and audio timing.
- Voice/music model: supply the approved script or musical brief separately; specify pronunciation, pace, emotional arc, loudness hierarchy and clean ending.

## Shot prompt template
Create one {{SHOT_DURATION}} shot for {{PROJECT_TOPIC}}. Subject and action: {{SUBJECT_ACTION}}. Composition: {{COMPOSITION}}. Camera: {{CAMERA_PATH_AND_LENS}}. Motion over time: {{START_STATE}} -> {{MIDDLE_CHANGE}} -> {{END_STATE}}. Lighting/material: {{LIGHTING_AND_MATERIAL}}. Art direction: {{STYLE_BIBLE}}. Color: {{PALETTE}}. Keep {{CONTINUITY_LOCKS}} unchanged. Leave clean space at {{TEXT_SAFE_AREA}} for text added in post. End with a stable frame suitable for the next cut. Avoid {{NEGATIVE_CONSTRAINTS}}. No invented logos, text, facts or object changes.

## Quality gates
- First 2 seconds communicate a compelling question, image or promise.
- Each scene contributes new information or emotional progression.
- Every key text element is readable on a phone and held long enough.
- Camera and object motion have clear intent, acceleration and settle.
- Sound supports the edit without masking narration.
- Captions, contrast, flashing and safe areas meet platform/accessibility needs.
- Claims, metrics, quotes, logos, likenesses and source assets are verified and appropriately cleared.
- The final export is watched end-to-end before delivery.
