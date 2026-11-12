import test from "node:test";
import assert from "node:assert/strict";
import { parseArgs } from "../scripts/produce.mjs";

test("accepts the reviewed Sokhan storyboard-to-Persian production mode", () => {
  const options = parseArgs([
    "--topic", "A short science documentary",
    "--language", "en",
    "--storyboard", "out/source/storyboard.json",
    "--translation-file", "out/translation-fa.json",
    "--voice", "persian-speech",
    "--plan-only"
  ]);
  assert.equal(options.storyboardPath, "out/source/storyboard.json");
  assert.equal(options.translationFile, "out/translation-fa.json");
  assert.equal(options.language, "en");
});

test("requires the storyboard and translation file together", () => {
  assert.throws(() => parseArgs([
    "--topic", "A short science documentary",
    "--language", "en",
    "--translation-file", "out/translation-fa.json",
    "--voice", "off",
    "--plan-only"
  ]), /must be used together/);
});

test("rejects non-English source language for Sokhan v1", () => {
  assert.throws(() => parseArgs([
    "--topic", "A short science documentary",
    "--language", "fa",
    "--storyboard", "out/source/storyboard.json",
    "--translation-file", "out/translation-fa.json",
    "--voice", "off",
    "--plan-only"
  ]), /requires --language en/);
});
