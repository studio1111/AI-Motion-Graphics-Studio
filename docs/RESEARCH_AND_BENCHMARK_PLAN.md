# Motion Graphics Research and Benchmark Plan

## Current status: 2026-10-27
The 1,000-video study is incomplete. The public reference catalog contains 55 video candidates (R001–R055), predominantly L0 search metadata. No full-video L2 or timestamped L3 reviews are claimed for these candidates. TubeLab and TubeAlfred returned HTTP 402 for insufficient credits; the attempted searches did not execute.

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

Start from `research/REFERENCE_SEED_CATALOG.md`; it is a seed, not the completed dataset.
