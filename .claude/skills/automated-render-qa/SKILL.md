---
name: automated-render-qa
description: Validate the project, render previews/final video, inspect real output frames and media metadata, repair verified defects, and report honest quality-gate results.
---
# Automated Render and Quality Assurance

## Check order
1. Inspect current source, package scripts, dependencies, instructions and latest CI results.
2. Run the repository validator and available automated tests.
3. Render a low-cost preview using the real composition.
4. Confirm the output exists and is nonempty.
5. Use FFprobe when installed to validate codec, dimensions, frame rate, duration and audio streams; decode/sample frames to detect corruption.
6. Inspect frames from the opening, dense text, transitions, charts and ending. Make a contact sheet when possible.
7. Listen to audio when playback is available; check intelligibility, masking, clipping, sudden level changes and sync.
8. Repair the highest-impact verified problems, rerender and rerun affected checks. Permit at most two automated repair cycles.
9. Repeat QC on the final artifact and package the report.

## Status
PASS means the check ran and passed. FAIL means it ran and failed. BLOCKED means a prerequisite prevented execution. NOT RUN means no evidence was collected. Never claim visual inspection or audio listening that did not happen. A successful render command alone does not prove quality.
