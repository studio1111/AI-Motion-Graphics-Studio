# Portable Prompt Library
This directory is a standalone, copy-and-paste prompt kit for use with any AI assistant or creative generation tool. It is not locked to Claude, ChatGPT, Gemini or a particular video model.

## Files
- `MASTER_PROMPT.md`: universal director prompt for end-to-end professional motion-graphics planning.
- `MASTER_PROMPT_PACK.md`: six specialized master prompts for cinematic explainers, product launches, kinetic typography, data stories, documentaries and code-based motion graphics.
- `prompts.json`: 70 structured style recipes for the CLI and other tools.
- `HOW_TO_USE.md`: practical workflow and adaptation instructions.
- `../scripts/prompt-library.mjs`: searchable CLI that prints complete prompts to copy into any AI.

## Fast use
```sh
npm run prompts:list
npm run prompts:search -- typography
npm run prompts:show -- kinetic-type
npm run prompts:show -- product-launch --format json
npm run prompts:export -- --category product-ui
```
If you use a different AI, copy `MASTER_PROMPT.md`, then append a recipe printed by `prompts:show`. Give the AI the brief and the actual available tools. A prompt library improves direction but does not itself grant a model video-rendering, browsing, voice, music or asset-generation capabilities.

## Research integrity
The Prompt Motion and other reference entries in `research/references.jsonl` are evidence-labelled. A source-page review is not a full-video analysis. Never mark a reference as watched unless the video was actually reviewed. Use references to learn high-level principles, then make original work. Respect each site's terms and the assets' licenses. Do not scrape Pinterest, bulk-copy FilmGrab frames or redistribute reference creators' prompts without permission.

## Recipe schema
Every recipe records its stable ID, category, intended duration, visual language, motion grammar, typography, color system, sound design, story beats, anti-patterns and adaptation guidance. These are production directions, not guarantees that every generator can implement every technique.


## Advanced production workflow

- Read REFERENCE_ANALYSIS_WORKBOOK.md before treating an inspiration source as analyzed. It separates page review, sampled video review and timestamped full analysis.
- Use PRODUCTION_WORKFLOW_PACK.md to move from creative brief to beat sheet, storyboard, motion implementation, sound map and quality checks.
- The expanded catalog has 70 original recipes. Use the search command to find a style, then the show command for its full ready-to-copy director prompt.


Use the export command to create a portable category bundle in Markdown, or add --format json for machine-readable recipes and copy-ready composed prompts. This is useful when another AI assistant cannot read the repository directly.
