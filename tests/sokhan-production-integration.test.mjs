import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { parseArgs, produce } from "../scripts/produce.mjs";

test("loads a saved English storyboard and renders with its approved Persian narration", async () => {
  const root = await mkdtemp(join(tmpdir(), "sokhan-production-"));
  try {
    const sourceOptions = parseArgs([
      "--topic", "Artificial intelligence and human decisions",
      "--language", "en",
      "--duration", "20",
      "--voice", "off",
      "--plan-only",
      "--no-research",
      "--output-dir", join(root, "source")
    ]);
    const sourceRun = await produce(sourceOptions);
    const storyboardPath = join(sourceRun.runDir, "storyboard.json");
    const sourceStoryboard = JSON.parse(await readFile(storyboardPath, "utf8"));
    const segments = sourceStoryboard.scenes
      .filter(scene => String(scene.narration || "").trim())
      .map(scene => ({
        id: scene.id,
        sourceText: scene.narration,
        translation: "روایت فارسی بررسی‌شده برای این صحنه."
      }));
    const translationPath = join(root, "translation-fa.json");
    await writeFile(translationPath, JSON.stringify({
      schemaVersion: 1,
      sourceLanguage: "en",
      targetLanguage: "fa",
      model: "test-fixture",
      reviewStatus: "approved",
      segments
    }, null, 2));

    const outputOptions = parseArgs([
      "--topic", "Artificial intelligence and human decisions",
      "--language", "en",
      "--duration", "20",
      "--voice", "off",
      "--plan-only",
      "--no-research",
      "--storyboard", storyboardPath,
      "--translation-file", translationPath,
      "--output-dir", join(root, "persian")
    ]);
    const outputRun = await produce(outputOptions);
    assert.equal(outputRun.plan.scenes.length, sourceStoryboard.scenes.length);
    assert.equal(outputRun.plan.scenes[0].narration, "روایت فارسی بررسی‌شده برای این صحنه.");
    assert.equal(outputRun.props.language, "fa");
    const saved = JSON.parse(await readFile(join(outputRun.runDir, "storyboard.json"), "utf8"));
    assert.equal(saved.language, "fa");
    assert.equal(saved.scenes[0].narration, "روایت فارسی بررسی‌شده برای این صحنه.");
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
