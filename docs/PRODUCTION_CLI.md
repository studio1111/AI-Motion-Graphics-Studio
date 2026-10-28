# Motion Graphics Studio Production CLI

The executable entry point is scripts/produce.mjs. It builds a storyboard and a Remotion prop manifest, optionally generates local voice, writes audio/captions, renders MP4, then runs technical checks.

## Quick start

    npm install
    npx remotion browser ensure
    npm run validate
    npm run produce -- --topic "Why do cities get warmer?" --language en --duration 90 --style auto --aspect-ratio 16:9

When the `speech` executable from `persian-speech` is installed, `--voice auto` uses a local Persian (Farsi) voice for `fa`. The package documents an MIT-licensed runtime/model distribution and a Mana-TTS corpus listed as CC0. The model downloads on first use, so initial synthesis needs network access. For supported non-Persian languages, the pipeline uses Pocket TTS. The GitHub workflow installs the appropriate local TTS package only when narration is enabled.

## Arguments

- --topic: required topic or question unless supplied in a brief JSON file.
- --language: fa, en, de, es, fr, it, pt, nl. Unsupported language codes are rejected instead of generating mislabeled output.
- --duration: target seconds, 5 to 600.
- --style: auto or a preset such as cinematic-documentary, scientific-2-5d, data-journalism, or vertical-social.
- --aspect-ratio: 16:9, 9:16, or 1:1.
- --brief: optional JSON brief with topic, language, durationSeconds, aspectRatio, style and sources.
- --sources: optional JSON array of source URLs or source objects.
- --voice: auto, off, pocket-tts, or persian-speech. In GitHub Actions, the narration toggle now maps to `off` when disabled, Pocket TTS for requested supported non-Persian languages, and Persian Speech for requested Farsi narration.
- --allow-paid-ai: explicitly permits Firecrawl/Claude API use, if corresponding keys exist.
- --no-research: skip optional Firecrawl search.
- --plan-only: write storyboard and manifests without audio generation or rendering.
- --output-dir: root output directory, default out.

## What runs automatically

1. Validates the brief and chooses a style using the topic, format and style catalog.
2. If paid AI is explicitly enabled, Firecrawl may search for sources and Claude may generate a topic-specific scene plan. The API is not called without opt-in and credentials.
3. Without available AI access, generates an eight-scene conceptual plan localized for `fa`, `en`, `de`, `es`, `fr`, `it`, `pt` or `nl`, with varied visual layouts and explicit warnings that factual research has not been performed. These local translations are template copy, not a topic-specific researched script.
4. Allocates exact scene frames; if local TTS succeeds, scene durations respect measured speech and may extend beyond the target instead of truncating narration.
5. Creates voice WAVs using Persian Speech / Mana-Persian-Piper for Farsi, or Pocket TTS for its supported languages when narration is requested. Requested narration is a release gate: if the engine is missing, the language is unsupported, or any scene fails synthesis, the run writes `voice-status.json` and a `VOICE_GENERATION_FAILED` QC report and stops before rendering. Use `--voice off` only when a music-only result is intentional.
6. Creates an original procedural stereo score with style-sensitive tempo, chord movement and transition-synchronized sound cues, Remotion props, storyboard timing, voiceover text and SRT captions.
7. Renders MP4, probes codec/dimensions/frame rate/duration/audio streams, decodes with FFmpeg and extracts frame samples.

## Outputs

Each run has its own folder under out. It contains brief.json, storyboard.json, storyboard-timed.json, props.json, voiceover.txt, captions.srt, research.json, manifest.json, qc-report.json, and video.mp4 when rendering succeeds. Audio assets are under public/generated for Remotion to load and for the output artifact to retain.

## Honest quality boundary

Technical PASS means the file exists, matches expected metadata, passes a full decode and has a measurable audio peak above the silence threshold. Extracting frame samples is not the same as visually reviewing them, and an audio peak check is not a listening or mix-quality review. The QC report leaves creativeReview and audioListening as NOT_RUN. The conceptual fallback is not a sourced factual documentary. Fonts, models and paid APIs are not assumed installed or free.


### Topic-specific local fallback
For city-heat, artificial-intelligence and solar-energy topics, the local fallback provides a dedicated eight-scene narrative in English and Persian. The output remains `conceptual_topic_template` until research and factual review are completed. The other supported languages continue to use localized general conceptual copy when no dedicated topic-language storyline exists.
