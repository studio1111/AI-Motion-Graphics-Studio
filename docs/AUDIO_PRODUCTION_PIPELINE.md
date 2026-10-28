# Professional Audio Production Pipeline

This pipeline keeps narration and music local by default and adds a measurable mastering pass to every rendered MP4.

## Included in the production CLI

- **Persian narration cleanup:** Unicode and Persian keyboard variants are normalized before the TTS engine receives the script. The normalized text is also used by the captions and production records, so the displayed words match what was synthesized.
- **Two Persian narration paths:** `--voice auto` keeps the privacy-preserving local Mana-Persian-Piper route, while explicitly selecting `--voice edge-tts` uses a more natural online neural voice such as `fa-IR-FaridNeural`. The dedicated public AI explainer workflow uses Edge TTS with a slightly slower narration rate and keeps the local Persian engine available as a separate option. Edge TTS sends narration text to Microsoft's online voice service, so use it only when that data flow is acceptable; it is not an offline model or a guaranteed service-level SLA.
- **Per-scene voice restoration:** each generated narration clip is converted to 24 kHz mono PCM, gently high-passed to remove rumble, receives restrained presence EQ and compression, is normalized to a consistent speech target, and gets a peak limiter before its actual duration is measured. If processing fails, the narration gate blocks the render rather than silently shipping raw or missing voice.
- **Narration fades and music ducking:** voice clips get short edge fades. The music bed eases down before speech begins and rises gradually after speech ends, instead of switching level abruptly.
- **Richer deterministic fallback score:** the built-in score includes harmonic layers, an evolving motif, rhythmic high-frequency detail, stereo motion, an arrangement lift and transition-synchronized effects. It is reproducible and works without model weights or a remote service.
- **Two-pass audio mastering:** the final MP4 is analysed and re-encoded with FFmpeg EBU R128 loudness normalization. Targets are -16 LUFS integrated, -1.5 dBTP true peak and 11 LU loudness range, with restrained filtering and compression to reduce rumble and improve speech clarity. Video is stream-copied during this stage. A mastering failure blocks release instead of quietly publishing the unmastered file.
- **Audit trail:** the run manifest and QC report record the music engine, mastering settings, measured loudness values, audio codec and whether creative listening has actually happened. Technical checks still do not replace listening on headphones and phone speakers.

## Optional neural voice: Edge TTS

Upstream: https://github.com/rany2/edge-tts. The client offers a CLI with voice, speaking-rate, pitch, volume and media-output flags. The project is LGPLv3 (with a small MIT-licensed file), while the neural synthesis is delivered by Microsoft's online Edge TTS service. The package's open-source licence does not automatically grant rights to the service or every voice output; confirm the relevant service terms for your publishing and commercial use. The project locks `edge-tts==7.3.1` in the sample build.

For the Persian production workflow, `fa-IR-FaridNeural` is the default voice and the rate is `-6%` for a calmer documentary pace. Configure the voice with `MOTION_STUDIO_EDGE_VOICE`, `MOTION_STUDIO_EDGE_RATE`, `MOTION_STUDIO_EDGE_PITCH` and `MOTION_STUDIO_EDGE_VOLUME`. The implementation calls the executable with an argument array, validates the voice/rate/pitch/volume fields, downloads the result only through the official CLI output path and then normalizes it to WAV before the same speech enhancement chain. The original MP3 is deleted once a validated WAV is available.

To keep narration private and offline, use `--voice auto` for the local route. The project does not automatically upload the script to Edge TTS when `auto` is selected.

## Optional neural soundtrack: ACE-Step 1.5

The adapter in `src/production/ace-step-client.mjs` can request an original instrumental score from a **self-hosted ACE-Step 1.5 REST API**. The production engine requests instrumental music with no lyrics or vocals, polls the asynchronous task, downloads only audio served from the configured API origin, then trims/resamples it to the exact video duration and fades the ending.

Project: https://github.com/ACE-Step/ACE-Step-1.5

ACE-Step's repository declares MIT for its project code. The server supports a REST API; its documentation recommends a CUDA GPU while also documenting CPU and other device backends. Model checkpoints and generated assets should be checked against the terms of the exact model/version selected.

To enable it on a machine or runner that can reach your own server, set these environment variables:

- `ACESTEP_API_URL`: base URL of the self-hosted REST API, for example `http://127.0.0.1:8001`.
- `ACESTEP_API_KEY`: optional bearer token if the server is configured to require one.
- `MOTION_STUDIO_MUSIC_ENGINE=auto`: choose ACE-Step when `ACESTEP_API_URL` exists; otherwise use the built-in score.
- `MOTION_STUDIO_MUSIC_ENGINE=ace-step`: require ACE-Step and fail fast if the endpoint is not configured.
- `MOTION_STUDIO_MUSIC_ENGINE=procedural`: force the offline fallback.

For GitHub Actions, add `ACESTEP_API_URL` and, when needed, `ACESTEP_API_KEY` as repository **Actions secrets**. A service on a developer's `localhost` is not reachable from GitHub-hosted runners; the URL must be reachable from the runner and should be protected by TLS/authentication if exposed beyond a trusted network. Do not publish API keys in workflow YAML or logs. The current workflow does not turn on paid APIs.

## Voice model choices and licence checks

- **Mana Persian Piper**: the selected default is a CPU-friendly Persian voice built on Piper and fine-tuned with Mana-TTS. The published model card states MIT for the model and CC0 for the Mana-TTS corpus. Upstream links: https://huggingface.co/MahtaFetrat/Mana-Persian-Piper and https://github.com/MahtaFetrat/ManaTTS-Persian-Speech-Dataset.
- **Piper with LCA phonemizer**: a promising research direction for Persian ezafe/pronunciation disambiguation. The upstream repository uses GPL-3.0, so it is documented as a possible future adapter rather than copied into this repository: https://github.com/MahtaFetrat/Piper-with-LCA-Phonemizer.
- **Persian Chatterbox fine-tune**: deliberately not a default. The model card for https://huggingface.co/Thomcles/Chatterbox-TTS-Persian-Farsi lists CC BY-NC 4.0 and requires acceptance of access terms, so it is unsuitable for a default production path that may be used commercially.
- **Kokoro**: its open model/repository is useful for supported languages, but this project does not route Persian narration to it because it is not a Persian voice: https://github.com/hexgrad/kokoro.

A repo being open source does not automatically mean every checkpoint, voice, dataset, or output is under the same licence. Re-check model cards and terms before distributing or monetizing a specific voice or score.

## Reproducible checks

The audio-focused tests cover loudness measurement parsing, target settings, Persian text normalization, smooth voice fades, narration-aware music ducking, ACE-Step prompt safety and engine selection. The full project command remains:

```sh
npm run validate
npm run produce -- --topic "A science explainer" --language en --duration 60 --style auto --prompt-recipe cinematic-science-cutaway --music-engine procedural
```

The technical QC report intentionally continues to mark `audioListening` and `creativeReview` as `NOT_RUN` until a real person has listened to the output and reviewed the actual frames.
