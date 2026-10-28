import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const [html, js, workflow, pages] = await Promise.all([
  readFile(new URL("../site/index.html", import.meta.url), "utf8"),
  readFile(new URL("../site/app.js", import.meta.url), "utf8"),
  readFile(new URL("../.github/workflows/motion-studio-produce.yml", import.meta.url), "utf8"),
  readFile(new URL("../.github/workflows/pages.yml", import.meta.url), "utf8")
]);

test("Pages studio provides accessible brief controls and production navigation", () => {
  for (const id of ["topic", "language", "duration", "style", "ratio", "voice", "reference", "download", "copy", "status"]) {
    assert.match(html, new RegExp('id="' + id + '"'));
  }
  assert.match(html, /actions\/workflows\/motion-studio-produce\.yml/);
  assert.match(html, /ANTHROPIC_API_KEY/);
  assert.match(html, /GitHub Secrets/);
});

test("browser code builds a brief without embedding or persisting credentials", () => {
  assert.match(js, /durationSeconds/);
  assert.match(js, /opus55Reference/);
  assert.match(js, /createObjectURL/);
  assert.doesNotMatch(js, /ANTHROPIC_API_KEY|FIRECRAWL_API_KEY|localStorage|sessionStorage/);
});

test("production workflow consumes repository secrets only at runtime and uploads artifacts", () => {
  assert.match(workflow, /secrets\.ANTHROPIC_API_KEY/);
  assert.match(workflow, /secrets\.FIRECRAWL_API_KEY/);
  assert.match(workflow, /--allow-paid-ai/);
  assert.match(workflow, /actions\/upload-artifact@v4/);
  assert.match(workflow, /edge-tts==7\.3\.1/);
  assert.match(pages, /actions\/deploy-pages@v4/);
});
