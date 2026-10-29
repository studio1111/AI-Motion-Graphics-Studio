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
  }
});
