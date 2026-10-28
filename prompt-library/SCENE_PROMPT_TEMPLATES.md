# Modular Scene Prompt Templates
Portable modules for text-to-video, image-to-video, image generation, motion design, and code-based compositing.

Use a template per shot. Start from the relevant style recipe and keep a shared continuity block across every prompt in the film. Fields in braces are placeholders.

## 1. Master shot block
**Purpose:** {what the viewer must understand or feel}. **Duration:** {seconds}. **Frame:** {ratio and safe area}. Subject: {specific subject}. Action: {one primary action}. Composition: {shot size, placement, negative space}. Camera: {one movement, direction and speed}. Motion arc: {start state} → {change} → {settle}. Light/material: {quality, direction, surface response}. Visual grammar: {style bible}. Palette: {tokens}. Sound cue: {event and priority}. Continuity locks: {invariants}. End frame: {stable handoff}. Avoid: {likely failure modes}.

## 2. Text-to-video action shot
Generate a single {duration}-second continuous shot. {Subject} performs {one visible action} in {setting}. Frame it as {shot size and composition}. The camera {specific move and direction}. The action progresses from {start} through {middle} to {ending}. Light is {description}; materials respond with {detail}. Keep {identity, object geometry, wardrobe, environment and palette} consistent. Leave {location} clear for typography added in post. End in a stable composition suitable for the next edit.

## 3. Image-to-video motion-only shot
Using the supplied image as the first frame, preserve {subject, framing, identity, lighting and background}. Animate {target object} by {main movement}; {secondary element} reacts with {subtle movement}. The camera {locked / exact move}. Motion starts gently, reaches its peak at {time}, then settles by {time}. Do not change the source composition except for {permitted changes}. End with {specific pose or camera state}.

## 4. Seamless match transition
Connect scene A to scene B through {shared shape, line, direction, scale or action}. At {time}, the outgoing element {transformation}; its {edge, path or motion direction} becomes the incoming element in scene B. Preserve screen direction, anchor point, palette logic and visual momentum. Specify the overlap window and a stable match frame. Do not use a generic crossfade unless it is explicitly chosen as the art direction.

## 5. Kinetic phrase
Exact copy: “{approved phrase}”. Animate it as one semantic unit. Entry: {mask/clip/scale/position}, duration {time}, easing {curve}. Emphasis: {word or syllable}, with {controlled scale/color/weight change}. Exit: {specific direction or transformation}. Keep minimum readable size {size}, safe margin {margin}, and hold the final phrase for {time}. Render the text with a real font in the compositor; preserve spelling, punctuation and line breaks.

## 6. Chart reveal
Data source: {URL / verified dataset}; data version/as-of: {date}; measure and unit: {unit}. First show {baseline and labels}, then reveal {series or bars} from actual values in {order}. Highlight {one finding} and label {sample size, caveat or uncertainty}. Use axis bounds {bounds and rationale}; do not invent missing points. End with a clear chart and a one-sentence takeaway. Animate only to explain sequence or emphasis, never to distort magnitude.

## 7. Product/interface hero
Use only approved product assets and exact interface states. Begin with {initial state}; focus on {one user problem}; then show {real feature interaction}. Camera/motion: {path}. Keep text, controls and product geometry stable unless their change is part of the actual interaction. Use a cursor only when it demonstrates purposeful input. End on a real, legible product state and an accurate value proposition.

## 8. Data-to-world metaphor
Translate {verified fact or mechanism} into {visual metaphor}. Explicitly label the metaphor as illustrative when viewers might mistake it for literal evidence. Keep its relationships faithful: {mapping}. Move from metaphor to the real data/diagram at {beat}, show {source or caveat}, and finish with {accurate takeaway}. Do not invent values, scale, physical behavior or causation for dramatic effect.

## 9. Audio-reactive motion
Audio source: {licensed track}; tempo and beats: {measured data or labeled estimate}. Map {low frequencies} to {slow large-scale change}, {transients} to {small accent}, and {phrase boundary} to {major transition}. Smooth noisy signals and cap motion amplitude. Typography and key information remain stable enough to read. Do not use an audio-reactive parameter for every object; retain hierarchy and intentional stillness.

## 10. Logo / identity reveal
Use the exact approved vector or logo asset. Define its anchor, scale, aspect ratio, clear-space boundary and final frame. Reveal through {brand-derived transformation}; do not distort protected geometry. Specify light, extrusion or texture only if permitted by the identity system. Hold the final mark for {duration}; keep the background quiet and add no unapproved lockup or tagline.

## 11. Documentary evidence card
Claim: {verified statement}. Source: {citation}; publication date: {date}; data period: {period}. Show {licensed evidence/document/chart} with a clear crop. Add {short annotation} that points only to the substantiated detail. Distinguish quote, paraphrase and visual reconstruction. Keep the source note readable. Never present synthetic or illustrative imagery as a genuine document, eyewitness image or archival artifact.

## 12. Scene end and next-scene handoff
At {end time}, resolve the current motion into {end state}. Keep the subject at {position}, movement direction {direction}, palette anchors {tokens}, and camera state {state}. The next shot begins with {shared element or matching state}. Allow {hold duration} for comprehension. Test the first and last frames side by side; if the cut is not motivated, redesign the handoff.

## 13. Prompt-repair micro-iteration
Observed failure: {precise symptom}. Keep unchanged: {locks}. Change only: {one or two variables}. Revised instruction: {minimal concrete change}. Expected visible result: {criterion}. Verify by checking {frame/time/output property}. If the failure persists, test an alternate approach rather than stacking contradictory adjectives.

## 14. Mobile/vertical reframing
Target: {9:16 or 4:5}. Primary subject and text stay inside {platform safe region}. Recompose the scene rather than crop blindly. Keep one dominant focal point, large type, short lines, clear caption area and enough breathing room around UI. Recalculate camera path and animation anchors for the target frame. Review at actual phone size.

## 15. Deterministic code-renderer instruction
Timeline: {frame range/fps}. Every transform must be derived from frame/time or explicit keyframes. Declare assets, fonts, dimensions, z-order, easing, transition, audio start/end and fallback. Avoid ambient browser state, CSS transitions, hidden timers and unseeded randomness. Include a sample-frame test, full-duration smoke render and export validation. Fail if essential requested media or narration is absent.

## Shared continuity block
Repeat or reference this exact block in each related shot: subject identity {details}; object geometry {details}; wardrobe/material {details}; lens/camera language {details}; lighting direction {details}; palette tokens {details}; typography roles {details}; environmental constraints {details}; what may change {list}; what must never change {list}.
