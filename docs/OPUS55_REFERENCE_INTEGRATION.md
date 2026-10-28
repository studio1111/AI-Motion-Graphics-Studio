# Opus 5.5 motion-reference integration

This integration connects the studio to the public catalog maintained at [yihui-dev/awesome-opus5-5-videos](https://github.com/yihui-dev/awesome-opus5-5-videos).

## What is integrated

- Fetch and validate the upstream `data/videos.json` catalog, then cache it as `research/opus55-videos.json`.
- Search by category, creator, implementation tags, slug and prompt text.
- Inspect a reference and keep creator, source-post and catalog links with it.
- Select one reference for a storyboard using `--opus55-reference <slug>`.
- Include the reference prompt as untrusted creative direction in the opt-in Claude storyboard request. The prompt is capped, never executed as code, and cannot override system constraints or supported renderer features.
- Record the selected reference and prompt in the run output for traceability.

## Commands

```sh
npm run opus55:sync
npm run opus55:list
npm run opus55:search -- svg motion
npm run opus55:show -- twoclipping-402193
npm run produce -- --topic "How solar cells work" --language en --duration 60 --style scientific-2-5d --opus55-reference <slug> --allow-paid-ai --plan-only
```

Use a real slug returned by `opus55:search`; angle-bracket placeholder text is not a valid slug. A selected reference influences the Claude-generated storyboard only when `--allow-paid-ai` and the required provider key are configured. Without those, the local storyboard fallback remains in place and the reference is recorded for provenance; it does not falsely claim to implement every technique from the example.

## Scope and attribution

The upstream project reports a collection of hundreds of community video prompts and declares the MIT License. The studio fetches the catalog rather than vendoring all prompt text in every source file. The cached catalog retains author, original-post URL and upstream slug. Prompt text is treated as untrusted data: operational instructions, secrets, requests to access APIs, or unsupported render instructions are not executed. The studio adapts techniques into original storyboards rather than copying a finished video verbatim.

This catalog is a creative reference, not a verified benchmark. A listed prompt may be partial, and an original post may include assets or API credentials not included in the catalog. No third-party credentials are imported. Review the upstream license and creator attribution before redistributing cached prompt text.

## License

The upstream repository's license text is available at [its LICENSE file](https://github.com/yihui-dev/awesome-opus5-5-videos/blob/main/LICENSE). The upstream notice identifies the project copyright as yihui-dev, 2026, and grants MIT-licensed permissions subject to preserving the notice.
