# GitHub Pages Studio and secure AI production

## Browser studio

The static Persian UI lives in `site/`. The Pages workflow deploys it from GitHub Actions after changes reach `main` (or on manual dispatch):

`https://studio1111.github.io/AI-Motion-Graphics-Studio/`

Before the first deployment, open **Settings → Pages** in the repository and set **Build and deployment → Source** to **GitHub Actions**. This one-time setting cannot be enabled by the workflow's restricted token in this repository. Then rerun the Pages workflow from **Actions → Deploy Motion Studio Pages → Run workflow** if the automatic deployment already failed.

The site can assemble and download a `brief.json` file, copy a local CLI command, and generate a ready-to-run GitHub Actions command using GitHub CLI. The command includes the selected topic and options, but never includes API keys. The page intentionally does not ask for credentials or trigger a workflow itself: you decide when to execute the copied command in your authenticated terminal. A static Pages page cannot securely read repository secrets.

The browser also lets you select one of the curated motion-design prompt recipes, choose the procedural local music bed or the optional ACE-Step engine, and request plan-only output. The default music engine is **procedural**, so no external music endpoint is called by default. Selecting `auto` can choose ACE-Step when an endpoint is configured; choosing `ace-step` explicitly requires `ACESTEP_API_URL` and may require `ACESTEP_API_KEY`, depending on the self-hosted service. Plan-only mode creates storyboard/manifests without rendering an MP4 and skips voice setup, but enabling paid AI for research/storyboard generation can still incur charges.

The browser's **Allow paid AI** checkbox is unchecked by default. Unless you explicitly enable it, the local CLI command omits `--allow-paid-ai` and the GitHub Actions command sends `use_ai=false`. If you enable it, the GitHub Actions command sends `use_ai=true`; the workflow still requires the repository secret to be configured. Re-prepare the brief after changing any field so the copied commands reflect the latest selection.

## Configure AI safely

1. Open **Settings → Secrets and variables → Actions → New repository secret**.
2. Add `ANTHROPIC_API_KEY` with an API key from Anthropic. Never paste it into the Pages UI, source code, an issue, or a workflow input.
3. Optionally add `FIRECRAWL_API_KEY` to enable web research. Research is optional; search results are treated as candidate sources, not automatically verified facts. For an ACE-Step music server, add `ACESTEP_API_URL`; add `ACESTEP_API_KEY` only if your self-hosted service requires authentication.
4. Either open **Actions → Motion Studio Production → Run workflow** and enter the form manually, or copy the generated **GitHub Actions command** from the studio and run it in a terminal where `gh auth status` confirms you are authenticated to this repository. The generated command uses `gh workflow run` with the fields selected in the page, so you do not have to retype them. Running it submits the topic text to GitHub Actions and may put that text in your terminal command history; review it before running if the topic is confidential.
5. **Use AI is off by default.** Enable it only when you intentionally authorize possible Anthropic API charges and the secret is configured.
6. When the run finishes, open its **Artifacts** section and download `motion-studio-output-<run-id>`. The artifact may include MP4, captions, audio, storyboard/manifests, `SHA256SUMS.txt` integrity checksums, and QC reports depending on the production path.

The workflow uses GitHub-hosted runner compute. GitHub Actions usage and AI provider API calls may incur limits or charges according to the account/provider plans. The workflow only uses the Anthropic key for the existing Claude storyboard integration; this does not imply that other AI providers are already wired into the production engine.

## Reliability and security

- The API key is supplied through `secrets.ANTHROPIC_API_KEY` at job runtime and is not written to the site or artifacts.
- The production workflow validates duration (5–600 seconds), uses quoted arguments, pins project dependencies with `npm ci`, runs the repository validation suite, and prepares Remotion's browser before rendering.
- With paid AI disabled, the workflow does not pass `--allow-paid-ai`; the engine uses its local storyboard path. Local fallback is not equivalent to researched, topic-specific AI writing.
- The default voice is `edge-tts`: the workflow installs `edge-tts==7.3.1` and uses its online neural voices. It requires network access to the voice service. `auto` selects the local language-specific engine and may require additional setup; `off` disables narration.
- Artifacts are retained for 14 days in the Motion Studio Production workflow and 7 days in the other production workflows. A failed render can still upload diagnostics when available.
- Production artifacts include a `SHA256SUMS.txt` manifest of generated files. Verify the manifest with `sha256sum -c SHA256SUMS.txt` from the root of the downloaded artifact. The manifest records the relative paths of the files included in that artifact; it detects accidental corruption but does not establish creative quality or source licensing.
- GitHub Pages is a static frontend, not a secure backend. Do not add a PAT or API key to local storage, query strings, JavaScript, or client-side form fields.

## Local use

```sh
npm ci
npm run validate
npm run produce -- --topic "Why do cities get warmer?" --language en --duration 90 --style scientific-2-5d --aspect-ratio 16:9 --voice off --plan-only
```

To use AI locally, export `ANTHROPIC_API_KEY` in your shell and add `--allow-paid-ai` only when you explicitly want to permit paid API usage. Keep the key out of shell history where possible and never commit `.env` files.
