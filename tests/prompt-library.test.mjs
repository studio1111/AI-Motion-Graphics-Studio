import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import {spawnSync} from "node:child_process";
import {fileURLToPath} from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const cli = path.join(root, "scripts", "prompt-library.mjs");
const data = JSON.parse(fs.readFileSync(path.join(root, "prompt-library", "prompts.json"), "utf8"));

function run(args) {
  return spawnSync(process.execPath, [cli, ...args], {encoding:"utf8"});
}

test("portable prompt library has many unique, complete recipes", () => {
  assert.equal(data.schemaVersion, 1);
  assert.ok(data.recipes.length >= 75, "expected at least 75 reusable style recipes");
  assert.equal(data.count, data.recipes.length);
  assert.equal(new Set(data.recipes.map((r)=>r.id)).size, data.recipes.length);
  for (const r of data.recipes) {
    for (const key of ["id","title","category","duration","visual_language","motion_grammar","typography","color_system","sound_design","story_beats","avoid","adaptation"]) {
      assert.equal(typeof r[key], "string", `${r.id} missing ${key}`);
      assert.ok(r[key].trim().length > 0, `${r.id} has empty ${key}`);
    }
  }
});

test("CLI lists recipes and searches by style terms", () => {
  const list = run(["list"]);
  assert.equal(list.status, 0, list.stderr);
  assert.match(list.stdout, /kinetic-type/);
  const search = run(["search", "cinematic"]);
  assert.equal(search.status, 0, search.stderr);
  assert.match(search.stdout, /product-launch|space-cosmos|liquid-metal/);
});

test("CLI creates a copy-ready master prompt with selected recipe", () => {
  const result = run(["show", "kinetic-type"]);
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /Universal Motion Graphics Master Prompt/);
  assert.match(result.stdout, /Kinetic Typography Trailer/);
  assert.match(result.stdout, /sound design|Sound design/i);
  assert.match(result.stdout, /{{TOPIC}}/);
});

test("CLI supports machine-readable output and helpful unknown-id errors", () => {
  const json = run(["show", "product-launch", "--format", "json"]);
  assert.equal(json.status, 0, json.stderr);
  const parsed = JSON.parse(json.stdout);
  assert.equal(parsed.recipe.id, "product-launch");
  assert.match(parsed.readyToCopyPrompt, /Cinematic Product Launch/);
  const missing = run(["show", "does-not-exist"]);
  assert.equal(missing.status, 2);
  assert.match(missing.stderr, /Unknown recipe/);
});

test("advanced recipes cover narrative, sound, continuity, localization and factual domains", () => {
  const requiredIds = [
    "multi-shot-storyboard",
    "seamless-motion-loop",
    "kinetic-data-symphony",
    "documentary-archive-collage",
    "cinematic-map-journey",
    "scientific-mechanism-cutaway",
    "cybersecurity-threat-map",
    "climate-transition-visualization",
    "medical-education-visual",
    "multilingual-motion-explainer",
    "motion-identity-guidelines",
    "motion-design-showreel",
    "real-footage-data-overlay",
    "cinematic-transition-library"
  ];
  const ids = new Set(data.recipes.map((r) => r.id));
  for (const id of requiredIds) assert.ok(ids.has(id), `missing advanced recipe: ${id}`);
});

test("portable specialist and scene-template packs are present and actionable", () => {
  const advanced = fs.readFileSync(path.join(root, "prompt-library", "ADVANCED_MASTER_PROMPTS.md"), "utf8");
  const scenes = fs.readFileSync(path.join(root, "prompt-library", "SCENE_PROMPT_TEMPLATES.md"), "utf8");
  const study = fs.readFileSync(path.join(root, "docs", "PROMPT_MOTION_PATTERN_STUDY.md"), "utf8");
  for (const text of [
    "Long-Form Documentary",
    "Kinetic Typography",
    "Text-to-Video Shot Director",
    "Image-to-Video Animator",
    "Sound and Edit-Rhythm",
    "Code-Based Remotion",
    "Creative Prompt Doctor",
    "Final Film Quality-Control"
  ]) assert.ok(advanced.includes(text), `advanced master prompt pack missing ${text}`);
  for (const text of [
    "Image-to-video motion-only shot",
    "Seamless match transition",
    "Chart reveal",
    "Documentary evidence card",
    "Prompt-repair micro-iteration",
    "Shared continuity block"
  ]) assert.ok(scenes.includes(text), `scene template pack missing ${text}`);
  assert.match(study, /Prompt Motion/i);
  assert.match(study, /Evidence limit/i);
  assert.match(study, /not copied into the library/i);
});

test("CLI exposes newly added specialist recipes as copy-ready prompts", () => {
  for (const id of ["motion-design-showreel", "seamless-motion-loop", "multilingual-motion-explainer"]) {
    const result = run(["show", id]);
    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stdout, new RegExp(id));
    assert.match(result.stdout, /Selected style recipe/);
  }
});

test("human-readable catalog remains synchronized with structured recipe IDs", () => {
  const catalog = fs.readFileSync(path.join(root, "prompt-library", "CATALOG.md"), "utf8");
  assert.match(catalog, new RegExp(`# Prompt Catalog: ${data.recipes.length} Ready-to-Use Motion Styles`));
  for (const recipe of data.recipes) {
    assert.ok(catalog.includes("(`" + recipe.id + "`)"), `catalog missing recipe ID ${recipe.id}`);
  }
  assert.match(catalog, /ADVANCED_MASTER_PROMPTS\.md/);
  assert.match(catalog, /SCENE_PROMPT_TEMPLATES\.md/);
});
