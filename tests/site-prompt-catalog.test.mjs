import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const [sourceText, siteText, html, app, workflow] = await Promise.all([
  readFile(new URL("../prompt-library/prompts.json", import.meta.url), "utf8"),
  readFile(new URL("../site/prompt-recipes.json", import.meta.url), "utf8"),
  readFile(new URL("../site/index.html", import.meta.url), "utf8"),
  readFile(new URL("../site/app.js", import.meta.url), "utf8"),
  readFile(new URL("../.github/workflows/motion-studio-produce.yml", import.meta.url), "utf8")
]);

test("Pages catalog stays synchronized with the canonical prompt library", () => {
  const source = JSON.parse(sourceText);
  const published = JSON.parse(siteText);
  assert.deepEqual(published, source, "run npm run prompts:sync-site after changing the canonical prompt library");
  assert.equal(published.count, source.count);
  assert.equal(published.recipes.length, source.recipes.length);
  const ids = published.recipes.map(recipe => recipe.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.ok(ids.every(id => /^[a-z0-9][a-z0-9-]{1,119}$/.test(id)));
  assert.ok(ids.includes("cinematic-science-cutaway"));
  assert.ok(ids.includes("saas-ui"), "recipes beyond the original 12-item UI list must be available");
});

test("site catalog is loaded as data, rendered with text-safe DOM APIs and passed as a recipe ID", () => {
  assert.match(html, /id="prompt-recipe-search"/);
  assert.match(html, /id="prompt-recipe-count"[^>]*aria-live="polite"/);
  assert.match(html, /id="prompt-recipe-preview"/);
  assert.match(html, /id="prompt-recipe-details"/);
  assert.match(html, /id="copy-recipe"/);
  assert.match(app, /fetch\("\.\/prompt-recipes\.json"/);
  assert.match(app, /new Option\(/);
  assert.match(app, /renderPromptRecipes/);
  assert.match(app, /renderPromptPreview/);
  assert.match(app, /recipeAsMarkdown/);
  assert.match(app, /textContent = value/);
  assert.doesNotMatch(app, /\.innerHTML\s*=/i);
  const recipeInput = workflow.match(/      prompt_recipe:[\s\S]*?(?=\n      [a-z_]+:|\npermissions:)/)?.[0] || "";
  assert.match(recipeInput, /type: string/);
  assert.doesNotMatch(recipeInput, /options:/);
  assert.match(workflow, /--prompt-recipe "\$PROMPT_RECIPE"/);
});
