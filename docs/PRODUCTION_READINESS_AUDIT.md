# Production Readiness Audit

## Run it

```sh
npm run readiness
npm run readiness -- --json
npm run readiness -- --strict
```

The audit is deliberately offline and safe: it never prints secret values or endpoint URLs, calls a provider, downloads a model, or spends money. It checks credential presence, the syntax of the optional ACE-Step endpoint, local media executables, and whether optional Python modules can be discovered by `python3`. A detected module does not prove model weights, language coverage, or synthesis quality are available.

## Paid API safety defaults

The GitHub Actions production workflow keeps **Use AI disabled by default**. Enable it only when you intentionally authorize possible Anthropic API charges. The local CLI also requires an explicit `--allow-paid-ai` flag. The readiness command's `ALLOW_PAID_AI=true` environment variable only changes its static report; it does not authorize or perform a provider request.

## Interpreting results

- `credentials_present_not_connectivity_tested`: a non-empty paid-provider environment variable exists. Authentication, quota, endpoint access and output quality remain unverified.
- `blocked_paid_gate`: a paid-provider key exists but `ALLOW_PAID_AI=true` was not explicitly set. The audit itself still makes no paid request.
- `endpoint_configured_not_connectivity_tested`: ACE-Step has a syntactically valid HTTP(S) base URL. No request was sent and the server is not confirmed reachable.
- `endpoint_invalid`: ACE-Step URL is malformed or contains embedded credentials, query parameters, or fragments.
- `python_module_present_not_model_tested`: Python can discover the optional module, but model downloads, weights, language coverage and real inference are not tested.
- `python_module_missing_optional`: Pocket TTS, Persian Speech or WhisperX is not importable in the current `python3` environment; these optional paths do not block the base renderer.
- `binary_present_not_render_tested` / `command_present_not_media_tested`: a local executable exists; run the production and media QC workflow to validate behavior.
- `missing_credentials` / `binary_missing` / `command_missing`: this environment cannot yet run that path.

## Release gates that remain separate

1. **Configuration**: required inputs and explicit cost permission are present.
2. **Connectivity**: provider authentication and a minimal request succeed, with cost recorded.
3. **Content**: topic-specific script, sources, claims and scene plan are reviewed.
4. **Render**: Remotion exits successfully and emits the requested dimensions, frame rate and duration.
5. **Media QC**: FFprobe, full decode, frame extraction and audio signal checks pass.
6. **Creative QC**: inspect actual frames, typography/RTL, scene continuity, voice pronunciation, caption timing, music mix and transitions.
7. **Delivery**: final artifact, manifest, sources/asset provenance and QC report are packaged together.

Passing the offline readiness audit does not imply that any later gate passed. The production pipeline intentionally records human creative review as pending unless a reviewer actually performed it. WhisperX is an optional future transcription/alignment path, not a required dependency.
