# Motion Graphics Research and Benchmark Plan

## Current status: 2026-10-28
The 1,000-video study is incomplete. The catalog currently contains 121 unique source records (R001–R100 plus P001–P021): 55 L0 metadata-only entries and 66 L1 source-page/article-reviewed entries. Of these, 114 are eligible for the 1,000-reference style study; 7 are non-style workflow/tooling leads or otherwise excluded. None of the 66 L1-linked videos has been watched as part of this studio’s direct review; no L2 or L3 full-video reviews are claimed. None of the 45 L1-linked videos has been watched as part of this studio’s direct review; no L2 or L3 full-video reviews are claimed. TubeLab and TubeAlfred returned HTTP 402 for insufficient credits, so those specific searches did not execute. Article-level candidate discovery was expanded with [Moonb (updated 24 September 2026)](https://www.moonb.io/blog/animated-explainer-video), [B2W Production (9 October 2026)](https://www.b2w.tv/blog/best-motion-graphics-videos), [What a Story (updated 2 October 2026)](https://www.whatastory.agency/blog/20-exemplary-motion-graphics-videos-to-be-inspired-from-in-2024), and [Yum Yum Videos (updated 21 August 2026)](https://www.yumyumvideos.com/blog/best-motion-graphics-video-examples/). These are L1 candidates only, not evidence that the linked videos were watched.

Firecrawl article scraping reviewed three 2026 reports from the same publisher, summarized in `docs/REFERENCE_PATTERN_MATRIX.md`: a reported 100-video UI animation study, 74 B2B tech demos, and 95 enterprise AI launch videos. These are secondary article-level findings, not this project's own video-by-video reviews. The samples may overlap and must not be summed as unique references. Their CSV/JSON dataset links returned HTTP 410, so row-level data was not imported.

## Target sample: 1,000 unique videos
- 200 educational/science explainers
- 150 documentary/editorial explainers
- 100 data visualization and infographics
- 100 kinetic typography/title sequences
- 100 2D character/shape animation
- 100 3D/2.5D motion design
- 75 maps/timelines/history
- 75 product/technology explainers
- 50 brand/logo motion
- 50 vertical/social explainers

## Evidence levels
- L0: title, search result, thumbnail or metadata only.
- L1: description, article, transcript or captions reviewed.
- L2: complete video watched.
- L3: timestamped scene analysis with selected frames.
Only L2/L3 count as full visual review. Report record totals and evidence levels separately.

## Per-reference schema
Canonical URL/video ID; title; creator; date; duration; language; engagement data and capture date; genre; search query; transcript availability; evidence level; review date/spans; hook; story beats; scene density; visual modes; composition; typography; palette/materials; camera/motion; transitions; voice/music/effects; accessibility; transferable techniques; confidence; notes; duplicate group.

## Collection and sampling
Discover in varied batches, canonicalize URLs and IDs, remove reposts, record metadata honestly, retrieve permitted descriptions/captions where available, and choose a balanced subset for full viewing/frame analysis. Balance creators, genre, language, length, platform, year and popularity bands. Views do not prove craft quality. Respect terms and source rights. Update a pattern matrix after every 100 records and promote a general rule only when diverse evidence supports it.

## Completion criteria
1,000 unique canonical references; quotas met or gaps disclosed; coverage/duplicate summaries; evidence-level totals; source-linked synthesis; and at least three evaluation briefs per major style family. Do not describe an unfinished study as complete.

## Access and budget
TubeLab and TubeAlfred reported insufficient credits. Do not incur paid search or generation costs without a configured budget. This is a tracked research target, not an autonomous background job.

The 100 seed rows are now structured in `research/references.jsonl`; `scripts/reference-catalog.mjs` canonicalizes URLs, reports duplicates, validates evidence claims, excludes tooling-only items from style quotas, and generates `docs/REFERENCE_PROGRESS.json`. Refresh the report with `npm run research:catalog`. Current machine-checked status after reviewing five Prompt Motion entry pages: 105 input rows, 105 canonical URLs, 99 eligible style references, 55 L0 metadata-only records, 50 L1 source-page-reviewed records, 0 L2/L3 full-video reviews, and 901 additional eligible references needed. The five new records do not claim the linked videos were watched. This remains an incomplete study.
