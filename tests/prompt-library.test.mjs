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
  assert.ok(data.recipes.length >= 30, "expected at least 30 reusable style recipes");
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
