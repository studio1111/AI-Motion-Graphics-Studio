# Sokhan v1 — English to Persian

Sokhan v1 is a local-first translation and Persian narration path. Its only supported language direction is **English → Persian**. Other directions remain out of scope until the Persian workflow is reviewed and approved.

## Components

- **Translation draft:** `scripts/sokhan_translate.py` calls an Ollama server bound to loopback only. The default model is `qwen3:4b`; override with `SOKHAN_OLLAMA_MODEL`.
- **Human review:** the generated JSON is deliberately marked `needs_human_review`. Edit the Persian `translation` strings and set `reviewStatus` to `approved` only after review.
- **Persian speech:** `scripts/sokhan-voice.mjs` uses the repository's existing `persian-speech` / Mana-Persian-Piper `speech` executable, then applies the existing FFmpeg narration enhancement chain and verifies each WAV duration.
- **Provenance:** voice output includes `voice-manifest.json` with segment IDs, source text, normalized Persian narration, output filenames and measured durations.

The translation model and TTS weights are downloaded by their own runtimes and are never committed to this repository. No text is sent to a cloud translation or TTS provider by these scripts.

## Install local dependencies

1. Install [Ollama](https://ollama.com/) and start its local service.
2. Download the default model once:

   ```sh
   ollama pull qwen3:4b
   ```

   Qwen3 model weights are published under Apache-2.0 by the Qwen project. Model capability and translation quality still need evaluation against your actual scripts; an open license is not a quality guarantee.
3. Install the existing Persian speech package:

   ```sh
   python3 -m pip install persian-speech==1.1.3
   ```

4. Install FFmpeg and make sure `ffmpeg` and `speech` are available on `PATH`.

For a lower-memory translation model, set `SOKHAN_OLLAMA_MODEL` to a locally installed smaller Qwen3 tag. Quality may differ; evaluate before adopting it.

## Create and review a translation

Save the English narration in a UTF-8 text file. Blank lines create separate translation segments:

```text
The city stores heat in roads and rooftops.

Trees and shade change how sunlight reaches the street.
```

Create the editable Persian draft:

```sh
npm run sokhan:translate -- --input narration-en.txt --output narration-fa.json
```

Optional settings:

```sh
SOKHAN_OLLAMA_MODEL=qwen3:4b npm run sokhan:translate -- --input narration-en.txt --output narration-fa.json --timeout 240
```

The endpoint defaults to `http://127.0.0.1:11434`. Remote endpoints are rejected intentionally. The script limits input to 1 MB, each segment to 4,000 characters, and the document to 500 segments.

Open `narration-fa.json`, edit every `translation`, and change:

```json
"reviewStatus": "needs_human_review"
```

to:

```json
"reviewStatus": "approved"
```

Do not mark it approved until a fluent Persian reviewer has checked meaning, terminology, names, numbers, punctuation and narration flow.

## Generate Persian narration

```sh
npm run sokhan:voice -- --input narration-fa.json --output-dir out/sokhan-voice
```

The voice command refuses documents not explicitly marked `approved`. It generates one enhanced mono 24 kHz PCM WAV per segment and writes `voice-manifest.json`. A failed segment stops the run; the tool does not silently publish a partial manifest.

Optional executable overrides:

```sh
SOKHAN_SPEECH_BIN=/absolute/path/to/speech FFMPEG_PATH=/absolute/path/to/ffmpeg \\
  npm run sokhan:voice -- --input narration-fa.json --output-dir out/sokhan-voice
```

## Quality and safety boundaries

- Qwen3 is a multilingual general-purpose model, not a Persian-specific translation benchmark. Translation quality is not certified by this implementation.
- Human review is a required gate before TTS. The CLI cannot determine whether a translation is semantically correct.
- Model weights are not stored in GitHub Actions caches or repository artifacts. Install/download locally; do not add large model files to Git.
- The translator connects only to loopback HTTP Ollama. It does not accept arbitrary remote URLs, credentials, or cloud endpoints.
- Input is treated as untrusted source text. Embedded instructions are translated as text and must not change the translation task.
- The existing voice enhancement filter is reused; its technical processing is not a substitute for listening tests.
- This first release produces standalone WAV assets and a timing manifest. It does not yet automatically replace every Remotion scene's narration; production-pipeline wiring and listening/RTL review remain release gates.
- Do not claim parity with HeyGen Voice Turbo. Sokhan is an independent local pipeline.

## Acceptance checklist

- [ ] Ollama runs locally and the selected model is installed.
- [ ] English sample is translated into fluent Persian.
- [ ] Human reviewer approves the edited JSON.
- [ ] Persian speech executable creates every segment.
- [ ] FFmpeg enhancement succeeds and each WAV has a valid duration.
- [ ] Listen to every segment; check pronunciation, pauses, clipping and consistency.
- [ ] Check Persian RTL rendering in the final Remotion composition before publishing.
