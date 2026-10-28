# Portable Production Workflow Pack

These copy-ready prompts are designed to be used in sequence by any capable AI assistant. Supply the available files and tools rather than assuming access to a particular model. Parallelize independent research, asset provenance checks and recipe drafting, but serialize operations that edit the same file or depend on each other's output.

## Workflow 1: Creative brief and style lock

Act as a senior creative director. Turn the brief into one clear audience promise, one narrative thesis and one primary motion grammar. Search the portable recipe catalog and compare three candidates against topic fit, audience clarity, distinctiveness, asset feasibility, accessibility and implementation effort. Choose one primary recipe and at most one supporting influence. Define runtime, aspect ratio, language, audience, tone, factual constraints, brand assets, rights, output target and known tool limits. If a noncritical detail is missing, state a reasonable assumption and continue. Return the locked brief, rationale and risks that must be resolved.

## Workflow 2: Evidence and script architecture

Research the factual claims. Build a claim-to-source ledger with source URL, publisher, publication date, claim, evidence strength and exact script section. Separate verified facts, interpretation, illustrative metaphor and uncertainty. Draft a spoken script with hook, setup, progressive explanation, midpoint reframe, payoff and ending. Check narrative causality and remove repetition. Do not invent numbers, quotes, dates, people or sources. Write a one-line visual thesis and identify claims that need on-screen citations.

## Workflow 3: Beat sheet and storyboard

Convert the approved script into a timecoded beat sheet. For each scene include start/end time, narrative purpose, narration, on-screen words, main subject, composition, camera plan, motion path, transition-in, transition-out, palette/materials, sound cues, assets and fact/source dependencies. Pacing must follow the topic and voice delivery, not a fixed number of cuts per second. Leave enough holds for dense information. Establish one visual continuity thread across scenes. Return machine-readable JSON and a readable human version. Validate that scene durations sum exactly to the requested runtime.

## Workflow 4: Motion grammar and implementation plan

Translate the storyboard into implementable instructions for the actual rendering engine. Specify timing curves, delays, spring parameters, path geometry, layering, camera positions, masks and responsive text boundaries. For code-based rendering, make animation a deterministic function of time and avoid hidden state, timers and unsynchronized CSS transitions. Reuse components and tokens; do not add dependencies when existing project primitives suffice. Explain which features are native to the current tool and which require additional services. Do not claim external tools are installed or callable without verification.

## Workflow 5: Typography and readability pass

Inspect every text-bearing scene. Define font roles, weight, scale, line length, line breaks, alignment, safe areas and exact entrance/exit intervals. Keep each message short enough to scan and hold it long enough to read. Prevent text from moving at the same time as the background when that impairs comprehension. Check the target language and direction, punctuation, diacritics and glyph fallback. Report text collisions, clipped lines, small sources, low contrast and unreadable motion blur before the final render.

## Workflow 6: Audio, voice and music map

Create a timecoded audio plan with narration text, estimated/actual voice duration, breath gaps, music sections, ducking levels, ambience and sound effects. Verify pronunciation of names and technical terms. Sync important motions to measured beats or transient peaks when relevant; do not guess audio timestamps. Check peak headroom, loudness continuity, voice intelligibility and phone-speaker translation. Use only supplied, licensed or properly generated assets with clear usage rights. If requested voice or music generation fails, report the failure honestly and do not silently substitute an unrelated track.

## Workflow 7: Frame sampling and preflight QC

Before the full render, inspect a contact sheet or sampled frame set covering the opening hook, each transition family, the densest text, the main payoff, the final frame and any loop boundary. If beat-based, include a frame on each major beat or scene entrance. Evaluate story clarity, continuity, visual hierarchy, typography, contrast, clipping, overlapping shapes, temporal jitter, false data, factual citation, safe areas and audio transitions. Return a defect list ordered by severity with exact timestamps and concrete fixes. Apply fixes and rerun relevant tests before claiming completion.

## Workflow 8: Render, verify and deliver

Render only using tools actually available. Verify the output file exists, duration matches target tolerance, frame rate, dimensions, codec, audio streams and caption behavior. Watch or sample the rendered artifact rather than trusting a zero exit code alone. Check the first and last frame when looping, and replay any repaired transition. Report output paths, tests, measured metadata, known limitations and assets that require user licensing approval. Do not claim a video was delivered if only a storyboard or render instructions exist.

## Workflow 9: Repair loop

Diagnose the smallest failure that explains the observed defect. Keep good scenes unchanged. Write or update a regression check for recurring defects such as text collisions, broken time seeking, missing narration, bad aspect ratio, off-grid transitions or unavailable media. Re-render only the affected range first, then the full output when appropriate. Compare the repaired result against the exact acceptance criterion, not against a vague impression of polish. Stop only when all critical issues pass or state precisely what remains blocked.

## Global quality gate

A prompt is not a substitute for source evidence, a licensed asset, functioning software or a reviewed final render. Label every result as one of: concept, script, storyboard, implementation, rendered draft, or verified final. Keep the distinction visible in status reports.
