---
name: reference-research
description: Discover, deduplicate and analyze public motion-graphics references while tracking sources, evidence levels, inspection coverage, confidence, and reusable craft observations.
---
# Reference Research

Read `docs/RESEARCH_AND_BENCHMARK_PLAN.md` and `research/REFERENCE_SEED_CATALOG.md`.

## Evidence levels
- L0: search result, metadata, source listing or thumbnail only.
- L1: description, article, transcript or captions reviewed.
- L2: complete video watched.
- L3: timestamped visual breakdown with selected-frame evidence.

Never count L0/L1 as full visual analysis. Never infer exact colors, transition behavior, font, timing curve or sound design without evidence.

## Dataset integrity
Deduplicate by canonical URL/video ID and obvious reposts. Balance creators, language, genre, duration, platform, date and popularity. Track the query, capture date, evidence level, reviewed fields and uncertainty. Public metadata does not make a full video review.

## Observation schema
Record URL, title, creator, date, duration, language, engagement data/date if available, genre, hook, narrative beats, scene density, visual modes, composition, type roles, palette/material, camera/motion, transitions, voice/music/effects, accessibility, transferable techniques, evidence, confidence, reviewer notes and duplicate group.

## Synthesis
After each 100 records, refresh the pattern matrix. Promote a method into a general rule only when it recurs across creators and genres. Translate evidence into original style recipes and regression tests. Respect source terms and never redistribute other creators' footage.

## Catalog workflow
- Use `research/references.jsonl` as the structured source of truth; `research/REFERENCE_SEED_CATALOG.md` is the human-readable seed list.
- Refresh the integrity and quota report with `npm run research:catalog`; the generated report is `docs/REFERENCE_PROGRESS.json`.
- Keep related-article evidence separate from evidence about the linked video. A related article must not upgrade a video to L1 unless it actually describes that reference.
- Never mark a reference L2/L3 unless the review fields required by the catalog validator are true.
