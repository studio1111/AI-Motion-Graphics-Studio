import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { buildLocalCliCommand, buildWorkflowDispatchCommand } from "../site/brief-commands.mjs";

const [html, js, workflow, pages] = await Promise.all([
  readFile(new URL("../site/index.html", import.meta.url), "utf8"),
  readFile(new URL("../site/app.js", import.meta.url), "utf8"),
  readFile(new URL("../.github/workflows/motion-studio-produce.yml", import.meta.url), "utf8"),
  readFile(new URL("../.github/workflows/pages.yml", import.meta.url), "utf8")
]);

test("Pages studio provides accessible brief controls and production navigation", () => {
  for (const id of ["topic", "language", "duration", "style", "ratio", "voice", "reference", "allow-paid-ai", "music-engine", "prompt-recipe", "prompt-recipe-search", "prompt-recipe-count", "plan-only", "command-fallback", "download", "copy", "copy-workflow", "status"]) {
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
  assert.match(js, /buildWorkflowDispatchCommand/);
  assert.match(js, /musicEngine/);
  assert.match(js, /promptRecipe/);
  assert.match(js, /planOnly/);
  assert.match(js, /fetch\("\.\/prompt-recipes\.json"/);
  assert.match(js, /renderPromptRecipes/);
  assert.match(js, /command-fallback/);
  assert.doesNotMatch(js, /\.innerHTML\s*=/i);
  assert.doesNotMatch(js, /ANTHROPIC_API_KEY|FIRECRAWL_API_KEY|localStorage|sessionStorage/);
});

test("paid AI is an explicit opt-in in the browser brief and workflow", () => {
  assert.match(html, /type="checkbox"[^>]*id="allow-paid-ai"|id="allow-paid-ai"[^>]*type="checkbox"/);
  assert.match(html, /غیرفعال/);
  assert.match(js, /allowPaidAi/);
  assert.match(workflow, /use_ai:[\s\S]*?default: false/);
  assert.match(workflow, /if \[\[ "\$USE_AI" == "true" \]\]/);
  assert.match(workflow, /--allow-paid-ai/);
  assert.match(workflow, /music_engine:[\s\S]*?default: procedural/);
  const recipeInput = workflow.match(/      prompt_recipe:[\s\S]*?(?=\n      [a-z_]+:|\npermissions:)/)?.[0] || "";
  assert.match(recipeInput, /type: string/);
  assert.match(recipeInput, /default: cinematic-science-cutaway/);
  assert.doesNotMatch(recipeInput, /options:/);
  assert.match(workflow, /plan_only:[\s\S]*?default: false/);
});

test("local CLI command quotes user topics and omits paid AI unless opted in", () => {
  const brief = { topic: `A creator's "quoted" idea`, language: "en", durationSeconds: 60, style: "auto", aspectRatio: "16:9", voice: "off", allowPaidAi: false };
  const command = buildLocalCliCommand(brief);
  assert.match(command, /'A creator'\\''s "quoted" idea'/);
  assert.doesNotMatch(command, /--allow-paid-ai/);
  assert.match(buildLocalCliCommand({ ...brief, allowPaidAi: true }), /--allow-paid-ai$/);
});

test("GitHub Actions command maps every selected option and keeps the cost gate explicit", () => {
  const brief = { topic: "Research a 'complex' idea", language: "fa", durationSeconds: 90, style: "cinematic-documentary", aspectRatio: "9:16", voice: "auto", opus55Reference: "example-reference", allowPaidAi: false };
  const command = buildWorkflowDispatchCommand(brief);
  assert.match(command, /gh workflow run motion-studio-produce\.yml/);
  assert.match(command, /--repo studio1111\/AI-Motion-Graphics-Studio/);
  assert.match(command, /-f 'topic=Research a '\\''complex'\\'' idea'/);
  assert.match(command, /-f 'aspect_ratio=9:16'/);
  assert.match(command, /-f 'opus55_reference=example-reference'/);
  assert.match(command, /-f 'use_ai=false'/);
  assert.doesNotMatch(command, /ANTHROPIC_API_KEY|FIRECRAWL_API_KEY/);
  assert.match(buildWorkflowDispatchCommand({ ...brief, allowPaidAi: true }), /-f 'use_ai=true'/);
});

test("production workflow consumes repository secrets only at runtime and uploads artifacts", () => {
  assert.match(workflow, /secrets\.ANTHROPIC_API_KEY/);
  assert.match(workflow, /secrets\.FIRECRAWL_API_KEY/);
  assert.match(workflow, /--allow-paid-ai/);
  assert.match(workflow, /actions\/upload-artifact@v4/);
  assert.match(workflow, /edge-tts==7\.3\.1/);
  assert.match(pages, /actions\/deploy-pages@v4/);
});
