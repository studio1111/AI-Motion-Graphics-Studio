# Sokhan v1 — English to Persian

Sokhan v1 is a local-first translation and Persian narration path. Its only supported language direction is **English → Persian**. Other directions remain out of scope until the Persian workflow is reviewed and approved.

## Components

- **Translation draft:** `scripts/sokhan_translate.py` supports local Ollama and a loopback-only llama.cpp OpenAI-compatible server. The default Ollama model is `qwen3:4b`; override with `SOKHAN_OLLAMA_MODEL`.
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

## Android / Termux with llama.cpp

The translator also supports local llama.cpp, so Android users do not need to run Ollama. The official Qwen GGUF repository provides Qwen3-4B Q4_K_M at approximately 2.5 GB under Apache-2.0. This is a large download and may be memory-intensive on a phone with 6 GB RAM; keep context modest and close other applications if Android terminates the process.

Build llama.cpp in Termux using the upstream Android instructions:

```bash
pkg update && pkg upgrade
pkg install git cmake clang libandroid-spawn
git clone https://github.com/ggml-org/llama.cpp
cd llama.cpp
cmake -B build
cmake --build build --config Release -j 4
```

Start the local server. The Hugging Face selector downloads the official Q4_K_M quantization; the server binds only to loopback and disables Qwen3 thinking for concise translation:

```bash
termux-wake-lock
./build/bin/llama-server -hf Qwen/Qwen3-4B-GGUF:Q4_K_M \
  --host 127.0.0.1 --port 8080 --ctx-size 4096 --reasoning off
```

In another Termux session, run:

```bash
npm run sokhan:translate -- --backend llama.cpp \
  --endpoint http://127.0.0.1:8080 --model local-model \
  --input narration-en.txt --output narration-fa.json \
  --glossary docs/sokhan-glossary.example.json
```

For reproducibility, pass `--model-revision sha256:<GGUF-file-hash>` after recording the local model file hash. The selected backend, model name and optional revision are stored in the translation draft. Model weights are not committed or downloaded in CI.

## Create and review a translation

For a standalone script, save the English narration in a UTF-8 text file. Blank lines create separate translation segments. For a Remotion production, first create an English storyboard with `--plan-only`, then pass its `storyboard.json` to the translator; this preserves exact scene IDs so reviewed translations can be reattached safely:

```text
The city stores heat in roads and rooftops.

Trees and shade change how sunlight reaches the street.
```

Create the editable Persian draft:

```sh
npm run sokhan:translate -- --input narration-en.txt --output narration-fa.json
# Or translate an existing English storyboard and preserve scene IDs:
npm run sokhan:translate -- --input out/source/<run-id>/storyboard.json --output narration-fa.json
```

Optional settings:

```sh
SOKHAN_OLLAMA_MODEL=qwen3:4b npm run sokhan:translate -- --input narration-en.txt --output narration-fa.json --timeout 240
# Optional terminology consistency across videos:
SOKHAN_OLLAMA_MODEL=qwen3:4b npm run sokhan:translate -- --input narration-en.txt --output narration-fa.json --glossary docs/sokhan-glossary.example.json
```

The Ollama endpoint defaults to `http://127.0.0.1:11434`; the llama.cpp endpoint defaults to `http://127.0.0.1:8080`. Both are loopback-only; remote endpoints are rejected intentionally. The script limits input to 1 MB, each segment to 4,000 characters, and the document to 500 segments. Translations are cached locally by source hash, backend, model revision and glossary hash under `~/.cache/sokhan`; cache entries store only the translated text, use restrictive file permissions and atomic writes, and never store the original source text. Use `--no-cache` to disable caching or `--cache-dir` to choose another local directory. Set `--model-revision` to a model digest when the model tag may change. An optional JSON glossary maps English terminology to exact Persian terms, is included in the translation prompt, applies deterministic replacements for English terms left untranslated, and is recorded by SHA-256 in the draft metadata. Glossaries are limited to 500 entries and 100 KB.

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

The voice command refuses documents not explicitly marked `approved`. It generates one enhanced mono 24 kHz PCM16 WAV per segment and writes `voice-manifest.json`. The shared WAV validator checks RIFF/WAVE chunk bounds, PCM format, sample rate, channel count, duration, RMS signal level and clipping ratio; digital silence and excessive clipping are hard failures. The manifest records per-segment peak/RMS and clipped-sample counts. Subprocess output is bounded, timeouts are reported, and timed-out processes receive SIGTERM followed by SIGKILL if necessary. A failed segment stops the run; the tool does not publish a successful partial manifest.

For the integrated Remotion path, use the exact English storyboard from the first step and its reviewed translation document:

```sh
npm run produce -- --topic "Your topic" --language en --storyboard out/source/<run-id>/storyboard.json --translation-file narration-fa.json --voice persian-speech --output-dir out/sokhan-final
```

The production CLI verifies every translated segment ID and its original English source text before replacing scene narration. It then generates Persian voice, validates signal quality before attaching audio to a scene, derives timing from measured WAV duration, and builds captions, Remotion props, video and the usual technical QC. The source storyboard must match the translated source exactly; stale or incomplete translations are rejected. This v1 integration translates narration, not the visual title/body/bullet copy.

Optional executable overrides:

```sh
SOKHAN_SPEECH_BIN=/absolute/path/to/speech FFMPEG_PATH=/absolute/path/to/ffmpeg \\
  npm run sokhan:voice -- --input narration-fa.json --output-dir out/sokhan-voice
```

## Model and dependency provenance

The current Persian speech baseline is the MIT-licensed `persian-speech==1.1.3` wrapper, which documents Mana-Persian-Piper (MIT) and Mana-TTS (CC0-1.0). The upstream model card currently identifies the model as MIT and the dataset card identifies the corpus as CC0-1.0. The inspected model repository revision containing the uploaded model files is `ad9dd8518bedf517bd7cbc9f63b8e5c844bf5bc0`; the MIT license is declared in the model card.

- Package wheel SHA-256 published by PyPI for `persian-speech-1.1.3-py3-none-any.whl`: `066d6749ca7505bda0f750fb0017a4ff8806f70556ec6c30abe48cea55328597`.
- Package source archive SHA-256: `817de08998be9ca8ed03058bc0d2447ac1e97454de7136716d2a5fd1c6ab3cb6`.
- PyPI reported no provenance attestation for this release when checked. A published hash is an integrity check, not proof that the package has been security-audited.
- The current `speech` CLI uses runtime-managed model downloads. The wrapper does not yet enforce the inspected Hugging Face commit at runtime; exact model-weight revision pinning remains a reproducibility task before calling this backend fully locked.

Sources: [PyPI release 1.1.3](https://pypi.org/project/persian-speech/1.1.3/), [Mana-Persian-Piper model card at inspected revision](https://huggingface.co/MahtaFetrat/Mana-Persian-Piper/tree/ad9dd8518bedf517bd7cbc9f63b8e5c844bf5bc0), [Mana-TTS dataset card](https://huggingface.co/datasets/MahtaFetrat/Mana-TTS).

## Quality and safety boundaries

- Qwen3 is a multilingual general-purpose model, not a Persian-specific translation benchmark. Translation quality is not certified by this implementation.
- Human review is a required gate before TTS. The CLI cannot determine whether a translation is semantically correct.
- Model weights are not stored in GitHub Actions caches or repository artifacts. Install/download locally; do not add large model files to Git.
- The translator connects only to loopback HTTP Ollama. It does not accept arbitrary remote URLs, credentials, or cloud endpoints.
- Input is treated as untrusted source text. Embedded instructions are translated as text and must not change the translation task.
- The existing voice enhancement filter is reused; its technical processing is not a substitute for listening tests.
- The production CLI can now attach reviewed Persian narration to an exact English storyboard and render the video. Visual title/body/bullet copy remains in its source language in v1; full visual-copy translation and human RTL review remain follow-up gates.
- Do not claim parity with HeyGen Voice Turbo. Sokhan is an independent local pipeline.

## Acceptance checklist

- [ ] Ollama runs locally and the selected model is installed.
- [ ] English sample is translated into fluent Persian.
- [ ] Human reviewer approves the edited JSON.
- [ ] Persian speech executable creates every segment.
- [ ] FFmpeg enhancement succeeds and each WAV has a valid duration.
- [ ] Listen to every segment; check pronunciation, pauses, clipping and consistency.
- [ ] Check Persian RTL rendering in the final Remotion composition before publishing.
