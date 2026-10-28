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
  assert.ok(data.recipes.length >= 90, "expected at least 90 reusable style recipes");
  assert.equal(data.count, data.recipes.length);
  assert.equal(new Set(data.recipes.map((r)=>r.id)).size, data.recipes.length);
  for (const id of ["product-ui-state-morph","beat-driven-showreel","verified-data-burst","seamless-shape-loop","voiceover-first-explainer"]) {
    assert.ok(data.recipes.some((r)=>r.id===id), `missing advanced recipe ${id}`);
  }
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
  const advanced = run(["search", "state morph"]);
  assert.equal(advanced.status, 0, advanced.stderr);
  assert.match(advanced.stdout, /product-ui-state-morph/);
});

test("CLI creates a copy-ready master prompt with selected recipe", () => {
  const result = run(["show", "kinetic-type"]);
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /Universal Motion Graphics Master Prompt/);
  assert.match(result.stdout, /Kinetic Typography Trailer/);
  assert.match(result.stdout, /sound design|Sound design/i);
  assert.match(result.stdout, /{{TOPIC}}/);
  const advanced = run(["show", "product-ui-state-morph"]);
  assert.equal(advanced.status, 0, advanced.stderr);
  assert.match(advanced.stdout, /deterministic, time-based springs/i);
  assert.match(advanced.stdout, /render|loop/i);
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



test("unified catalog covers the additional cross-tool motion domains", () => {
  const required = [
    "multi-shot-storyboard",
    "seamless-motion-loop",
    "kinetic-data-symphony",
    "documentary-archive-collage",
    "cinematic-map-journey",
    "hand-drawn-whiteboard",
    "premium-automotive-reveal",
    "kinetic-type-poetry",
    "chromatic-soundscape",
    "scientific-mechanism-cutaway",
    "quantum-scale-visualization",
    "cybersecurity-threat-map",
    "climate-transition-visualization",
    "financial-market-explainer",
    "medical-education-visual",
    "sports-momentum-story",
    "jewelry-macro-film",
    "abstract-geometry-architecture",
    "typographic-poster-film",
    "vertical-mini-documentary",
    "multilingual-motion-explainer",
    "motion-identity-guidelines",
    "motion-design-showreel",
    "real-footage-data-overlay",
    "product-ui-to-physical-world",
    "cinematic-transition-library"
  ];
  const ids = new Set(data.recipes.map((r) => r.id));
  for (const id of required) assert.ok(ids.has(id), `missing complementary recipe ${id}`);
});

test("specialist master prompts and scene templates are portable and actionable", () => {
  const advanced = fs.readFileSync(path.join(root, "prompt-library", "ADVANCED_MASTER_PROMPTS.md"), "utf8");
  const scenes = fs.readFileSync(path.join(root, "prompt-library", "SCENE_PROMPT_TEMPLATES.md"), "utf8");
  const study = fs.readFileSync(path.join(root, "docs", "PROMPT_MOTION_PATTERN_STUDY.md"), "utf8");
  for (const phrase of [
    "Long-Form Documentary",
    "Kinetic Typography",
    "Text-to-Video Shot Director",
    "Image-to-Video Animator",
    "Sound and Edit-Rhythm",
    "Code-Based Remotion",
    "Creative Prompt Doctor",
    "Final Film Quality-Control"
  ]) assert.ok(advanced.includes(phrase), `missing advanced master prompt section: ${phrase}`);
  for (const phrase of [
    "Image-to-video motion-only shot",
    "Seamless match transition",
    "Chart reveal",
    "Documentary evidence card",
    "Prompt-repair micro-iteration",
    "Shared continuity block"
  ]) assert.ok(scenes.includes(phrase), `missing scene template: ${phrase}`);
  assert.match(study, /Prompt Motion/i);
  assert.match(study, /Evidence limit/i);
  assert.match(study, /not copied into the library/i);
});

test("CLI exports and shows complementary prompt recipes", () => {
  for (const id of ["motion-design-showreel", "seamless-motion-loop", "multilingual-motion-explainer"]) {
    const shown = run(["show", id]);
    assert.equal(shown.status, 0, shown.stderr);
    assert.match(shown.stdout, new RegExp(id));
    assert.match(shown.stdout, /Selected style recipe/);
  }
  const exported = run(["export", "--category", "showreel"]);
  assert.equal(exported.status, 0, exported.stderr);
  assert.match(exported.stdout, /Motion Design Showreel/);
});

test("text catalog stays synchronized with all 96 structured recipes", () => {
  const catalog = fs.readFileSync(path.join(root, "prompt-library", "CATALOG.md"), "utf8");
  assert.match(catalog, new RegExp(`# Prompt Catalog: ${data.recipes.length} Ready-to-Use Motion Styles`));
  for (const recipe of data.recipes) {
    assert.ok(catalog.includes("(`" + recipe.id + "`)"), `catalog missing recipe ID ${recipe.id}`);
  }
  assert.match(catalog, /ADVANCED_MASTER_PROMPTS\.md/);
  assert.match(catalog, /SCENE_PROMPT_TEMPLATES\.md/);
});

test("portable library includes reference-analysis and production workflow packs", () => {
  const workbook = fs.readFileSync(path.join(root, "prompt-library", "REFERENCE_ANALYSIS_WORKBOOK.md"), "utf8");
  const workflows = fs.readFileSync(path.join(root, "prompt-library", "PRODUCTION_WORKFLOW_PACK.md"), "utf8");
  const synthesis = fs.readFileSync(path.join(root, "research", "PROMPT_MOTION_SYNTHESIS_2026-10-28.md"), "utf8");
  assert.match(workbook, /sampled review remains sampled/i);
  assert.match(workbook, /L0.*L1.*L2.*L3/s);
  assert.match(workflows, /timecoded beat sheet/i);
  assert.match(workflows, /Do not claim external tools are installed/i);
  assert.match(synthesis, /not a claim that every video in the gallery was watched/i);
});


test("CLI exports a portable prompt bundle filtered by category", () => {
  const markdown = run(["export", "--category", "product-ui"]);
  assert.equal(markdown.status, 0, markdown.stderr);
  assert.match(markdown.stdout, /Universal Motion Graphics Master Prompt/);
  assert.match(markdown.stdout, /Continuous Product UI State Morph/);
  assert.doesNotMatch(markdown.stdout, /Verified Data Reveal/);

  const json = run(["export", "--category", "product-ui", "--format", "json"]);
  assert.equal(json.status, 0, json.stderr);
  const parsed = JSON.parse(json.stdout);
  assert.equal(parsed.category, "product-ui");
  assert.ok(parsed.recipes.length > 0);
  assert.equal(parsed.readyToCopyPrompts.length, parsed.recipes.length);
  assert.match(parsed.readyToCopyPrompts[0].readyToCopyPrompt, /Universal Motion Graphics Master Prompt/);

  const invalid = run(["export", "--category", "not-a-real-category"]);
  assert.equal(invalid.status, 2);
  assert.match(invalid.stderr, /Unknown prompt category/);
});

test("browser prompt-library page exposes accessible search, composition, copy and download", () => {
  const page = fs.readFileSync(path.join(root, "prompt-library", "index.html"), "utf8");
  assert.match(page, /id="search"/);
  assert.match(page, /id="category"/);
  assert.match(page, /ADVANCED_MASTER_PROMPTS\.md/);
  assert.match(page, /SCENE_PROMPT_TEMPLATES\.md/);
  assert.match(page, /Copy full prompt/);
  assert.match(page, /Download \.md/);
  assert.match(page, /navigator\.clipboard/);
  assert.match(page, /aria-live/);
  assert.match(page, /prefers-reduced-motion/);
  assert.match(page, /fetch\("prompts\.json"\)/);
  assert.doesNotMatch(page, /<script[^>]+src="https?:\/\//i);
});


test("browser prompt composer keeps its client-side script valid and locally portable", () => {
  const html = fs.readFileSync(path.join(root, "prompt-library", "index.html"), "utf8");
  const scriptMatch = html.match(/<script>([\\s\\S]*?)<\\/script>/i);
  assert.ok(scriptMatch, "browser prompt library needs its client-side application script");
  assert.doesNotThrow(() => new Function(scriptMatch[1]), "inline browser script must parse");
  for (const asset of [
    'fetch("prompts.json")',
    'fetch("MASTER_PROMPT.md")',
    'fetch("ADVANCED_MASTER_PROMPTS.md")',
    'fetch("SCENE_PROMPT_TEMPLATES.md")',
    'Copy full prompt',
    'Download .md',
    'prefers-reduced-motion'
  ]) assert.ok(html.includes(asset), `browser prompt library missing expected capability: ${asset}`);
  assert.doesNotMatch(scriptMatch[1], /\\.innerHTML\\s*=/i, "recipe content should be inserted as text, not executable HTML");
});
