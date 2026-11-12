import test from "node:test";
import assert from "node:assert/strict";
import { applySokhanTranslations, validateSokhanTranslationDocument } from "../src/production/sokhan-translation.mjs";

const scenes = [
  { id: "scene-1", narration: "The source sentence.", title: "Title" },
  { id: "scene-2", narration: "A second source sentence." }
];
const document = {
  schemaVersion: 1,
  sourceLanguage: "en",
  targetLanguage: "fa",
  model: "qwen3:4b",
  reviewStatus: "approved",
  segments: [
    { id: "scene-1", sourceText: "The source sentence.", translation: "جملهٔ مبدأ." },
    { id: "scene-2", sourceText: "A second source sentence.", translation: "جملهٔ دوم." }
  ]
};

test("validates an English-to-Persian translation document", () => {
  assert.equal(validateSokhanTranslationDocument(document).segments.length, 2);
});

test("applies edited Persian text without changing visual scene metadata", () => {
  const result = applySokhanTranslations(scenes, document);
  assert.equal(result[0].narration, "جملهٔ مبدأ.");
  assert.equal(result[0].title, "Title");
  assert.equal(result[1].narration, "جملهٔ دوم.");
});

test("rejects unsupported language directions", () => {
  assert.throws(() => validateSokhanTranslationDocument({
    ...document, targetLanguage: "de"
  }), /English-to-Persian/);
});

test("rejects duplicate segment identifiers", () => {
  assert.throws(() => validateSokhanTranslationDocument({
    ...document, segments: [document.segments[0], document.segments[0]]
  }), /duplicate/);
});

test("rejects missing scene translations instead of silently producing partial narration", () => {
  assert.throws(() => applySokhanTranslations(scenes, {
    ...document, segments: [document.segments[0]]
  }), /missing translation/);
});

test("rejects empty translations", () => {
  assert.throws(() => validateSokhanTranslationDocument({
    ...document, segments: [{ ...document.segments[0], translation: " " }]
  }), /non-empty/);
});

test("rejects stale source text so an old translation cannot attach to a changed script", () => {
  assert.throws(() => applySokhanTranslations(
    [{ id: "scene-1", narration: "A changed source sentence." }],
    { ...document, segments: [document.segments[0]] }
  ), /source text does not match/);
});

test("refuses production before explicit human approval", () => {
  assert.throws(() => applySokhanTranslations(scenes, {
    ...document, reviewStatus: "needs_human_review"
  }), /reviewStatus=approved/);
});

test("rejects translation segments for unknown scene IDs", () => {
  assert.throws(() => applySokhanTranslations(scenes, {
    ...document,
    segments: [...document.segments, {
      id: "old-scene", sourceText: "Old source.", translation: "متن قدیمی."
    }]
  }), /unknown scene id/);
});
