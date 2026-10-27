---
name: motion-render-quality-gates
description: Check visual, audio, subtitle, content, rendering, and artifact integrity so defects are repaired before video delivery.
---
# Motion Render Quality Gates

## Gate A: project integrity
Dependencies resolve; lockfile is consistent; skill index matches actual skill folders; build checks pass; local assets exist; no secrets or generated media are committed.

## Gate B: narrative and design
Every scene has a purpose and a narration/visual relationship. Exact copy is preserved. Visual modes vary without breaking art direction. No placeholders or unintended sample content remain. Factual graphics point to source records.

## Gate C: render integrity
Render exits successfully. Probe codec, resolution, frame rate, duration, audio streams, and pixel format. Check expected duration tolerance, decode errors, black/frozen frames, missing scenes, unintended silence, peaks, and audio-video sync.

## Gate D: frame inspection
Sample scene boundaries, midpoints, and high-motion transitions. Build a contact sheet where possible. Inspect clipping, RTL shaping, font fallback, overlap, contrast, safe zones, continuity, image drift, repeated frames, and abrupt cuts. Metadata probing alone is not visual QC.

## Gate E: accessibility and platform
Captions exist when required and match audio. Meaning is not color-only. Text is mobile-readable. Aspect ratio and safe areas match the platform. No unexpected watermark or missing attribution.

## Gate F: final artifact
Output exists, is non-empty and decodable, and has expected metadata. Include source, manifest, and provenance record as requested. Record commands, runtime versions, render time, checksum, and pass/fail status.

## Repair loop
Prioritize high-severity defects. Re-render affected scope when safe, then rerender the final artifact and rerun checks. Never claim a check passed unless it ran. Distinguish unit tests, metadata probes, and actual visual inspection.
## Status
Original checklist. Actual automation must be implemented in the repository before claiming these gates run in CI.
