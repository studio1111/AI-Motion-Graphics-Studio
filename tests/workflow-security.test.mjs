import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

test("manual production workflow keeps paid APIs opt-in and repository permissions minimal", async () => {
  const workflow = await readFile(new URL("../.github/workflows/produce-video.yml", import.meta.url), "utf8");
  assert.match(workflow, /^permissions:\n  contents: read\s/m);
  assert.match(workflow, /allow_paid_ai:[\s\S]*?default:\s*["']?false["']?/);
  assert.match(workflow, /MOTION_STUDIO_ALLOW_PAID_API:\s*\$\{\{\s*inputs\.allow_paid_ai\s*\}\}/);
  assert.match(workflow, /timeout-minutes:\s*120/);
});

test("manual production artifacts have bounded retention and an explicit missing-output policy", async () => {
  const workflow = await readFile(new URL("../.github/workflows/produce-video.yml", import.meta.url), "utf8");
  assert.match(workflow, /uses:\s*actions\/upload-artifact@v4/);
  assert.match(workflow, /if-no-files-found:\s*warn/);
  assert.match(workflow, /retention-days:\s*7/);
});

test("every production workflow packages SHA-256 checksums with its artifacts", async () => {
  const paths = [
    "../.github/workflows/produce-video.yml",
    "../.github/workflows/motion-studio-produce.yml",
    "../.github/workflows/build-ai-future-fa.yml"
  ];
  const workflows = await Promise.all(paths.map(path => readFile(new URL(path, import.meta.url), "utf8")));
  for (const workflow of workflows) {
    assert.match(workflow, /Generate artifact integrity checksums/);
    assert.match(workflow, /sha256sum/);
    assert.match(workflow, /SHA256SUMS\.txt/);
    assert.match(workflow, /if: always\(\)/);
  }
  assert.match(workflows[0], /SHA256SUMS\.txt/);
  assert.match(workflows[2], /path: \|[\s\S]*?SHA256SUMS\.txt/);
});

test("interactive production installs the selected local narration engine", async () => {
  const workflow = await readFile(new URL("../.github/workflows/motion-studio-produce.yml", import.meta.url), "utf8");
  assert.match(workflow, /if: inputs\.voice == 'edge-tts'/);
  assert.match(workflow, /edge-tts==7\.3\.1/);
  assert.match(workflow, /if: inputs\.voice == 'auto' && inputs\.language == 'fa'/);
  assert.match(workflow, /persian-speech==1\.1\.3/);
  assert.match(workflow, /if: inputs\.voice == 'auto' && inputs\.language != 'fa'/);
  assert.match(workflow, /pocket-tts/);
});

test("primary production workflow wires soundtrack, prompt recipe and plan-only inputs", async () => {
  const workflow = await readFile(new URL("../.github/workflows/motion-studio-produce.yml", import.meta.url), "utf8");
  assert.match(workflow, /music_engine:[\s\S]*?default: procedural/);
  assert.match(workflow, /prompt_recipe:[\s\S]*?default: cinematic-science-cutaway/);
  assert.match(workflow, /plan_only:[\s\S]*?default: false/);
  assert.match(workflow, /ACESTEP_API_URL:\s*\$\{\{\s*secrets\.ACESTEP_API_URL\s*\}\}/);
  assert.match(workflow, /ACESTEP_API_KEY:\s*\$\{\{\s*secrets\.ACESTEP_API_KEY\s*\}\}/);
  assert.match(workflow, /--prompt-recipe "\$PROMPT_RECIPE"/);
  assert.match(workflow, /--music-engine "\$MUSIC_ENGINE"/);
  assert.match(workflow, /if: \\$\\{\\{\\s*!inputs\\.plan_only\\s*\\}\\}/);\n  assert.match(workflow, /if \\\[\\[ "\\$PLAN_ONLY" == "true" \\\]\\]/);\n  assert.match(workflow, /effective_voice="off"/);
});
