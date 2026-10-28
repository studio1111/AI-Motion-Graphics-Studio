# GitHub Pages Studio and secure AI production

## Browser studio

The static Persian UI lives in `site/`. The Pages workflow deploys it from GitHub Actions after changes reach `main` (or on manual dispatch):

`https://studio1111.github.io/AI-Motion-Graphics-Studio/`

Before the first deployment, open **Settings → Pages** in the repository and set **Build and deployment → Source** to **GitHub Actions**. This one-time setting cannot be enabled by the workflow's restricted token in this repository. Then rerun the Pages workflow from **Actions → Deploy Motion Studio Pages → Run workflow** if the automatic deployment already failed.

The site can assemble and download a `brief.json` file and copy a local CLI command. It intentionally does not ask for API keys and does not send the brief to a third-party service. The GitHub Actions page is opened separately because a static Pages site cannot securely read repository secrets or trigger privileged workflow runs without a separate authenticated backend or a user-provided GitHub token.

## Configure AI safely

1. Open **Settings → Secrets and variables → Actions → New repository secret**.
2. Add `ANTHROPIC_API_KEY` with an API key from Anthropic. Never paste it into the Pages UI, source code, an issue, or a workflow input.
3. Optionally add `FIRECRAWL_API_KEY` to enable web research. Research is optional; search results are treated as candidate sources, not automatically verified facts.
4. Open **Actions → Motion Studio Production → Run workflow**.
5. Enter the topic and select language, duration, style, frame ratio, voice and optional Opus reference. Leave **Use AI** enabled to use Anthropic when the secret is present.
6. When the run finishes, open its **Artifacts** section and download `motion-studio-output-<run-id>`. The artifact may include MP4, captions, audio, storyboard/manifests and QC reports depending on the selected production path.

The workflow uses GitHub-hosted runner compute. GitHub Actions usage and AI provider API calls may incur limits or charges according to the account/provider plans. The workflow only uses the Anthropic key for the existing Claude storyboard integration; this does not imply that other AI providers are already wired into the production engine.

## Reliability and security

- The API key is supplied through `secrets.ANTHROPIC_API_KEY` at job runtime and is not written to the site or artifacts.
- The production workflow validates duration (5–600 seconds), uses quoted arguments, pins project dependencies with `npm ci`, runs the repository validation suite, and prepares Remotion's browser before rendering.
- Without the AI secret, the workflow warns and the engine falls back to its local storyboard path. Local fallback is not equivalent to researched, topic-specific AI writing.
- The default voice is `edge-tts`: the workflow installs `edge-tts==7.3.1` and uses its online neural voices. It requires network access to the voice service. `auto` selects the local language-specific engine and may require additional setup; `off` disables narration.
- Artifacts are retained for 14 days. A failed render can still upload diagnostics when available.
- GitHub Pages is a static frontend, not a secure backend. Do not add a PAT or API key to local storage, query strings, JavaScript, or client-side form fields.

## Local use

```sh
npm ci
npm run validate
npm run produce -- --topic "Why do cities get warmer?" --language en --duration 90 --style scientific-2-5d --aspect-ratio 16:9 --voice off --plan-only
```

To use AI locally, export `ANTHROPIC_API_KEY` in your shell and add `--allow-paid-ai`. Keep the key out of shell history where possible and never commit `.env` files.
