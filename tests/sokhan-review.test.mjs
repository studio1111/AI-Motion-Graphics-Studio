import test from "node:test";
import assert from "node:assert/strict";
import {
  canApproveDraft,
  createApprovedDraft,
  updateDraftTranslation,
  validateDraft
} from "../site/sokhan-review.mjs";

const validDraft = () => ({
  schemaVersion: 1,
  sourceLanguage: "en",
  targetLanguage: "fa",
  model: "qwen3:4b",
  reviewStatus: "needs_human_review",
  segments: [
    { id: "scene-01", sourceText: "The city stores heat.", translation: "شهر گرما را ذخیره می‌کند." },
    { id: "scene-02", sourceText: "Trees cool the street.", translation: "درختان خیابان را خنک می‌کنند." }
  ]
});

test("validates an English-to-Persian Sokhan draft", () => {
  assert.equal(validateDraft(validDraft()).segments.length, 2);
});

test("rejects wrong language directions, duplicate IDs and empty text", () => {
  const wrongDirection = validDraft();
  wrongDirection.sourceLanguage = "de";
  assert.throws(() => validateDraft(wrongDirection), /English-to-Persian/);

  const duplicate = validDraft();
  duplicate.segments[1].id = duplicate.segments[0].id;
  assert.throws(() => validateDraft(duplicate), /duplicate/);

  const empty = validDraft();
  empty.segments[0].translation = "   ";
  assert.throws(() => validateDraft(empty), /non-empty/);
});

test("requires every segment to be reviewed before approval", () => {
  const draft = validDraft();
  assert.equal(canApproveDraft(draft, new Set(["scene-01"])), false);
  assert.equal(canApproveDraft(draft, new Set(["scene-01", "scene-02"])), true);
});

test("creates an approved copy without mutating the original draft", () => {
  const draft = validDraft();
  const approved = createApprovedDraft(draft, new Set(["scene-01", "scene-02"]));
  assert.equal(approved.reviewStatus, "approved");
  assert.equal(draft.reviewStatus, "needs_human_review");
  assert.throws(() => createApprovedDraft(draft, new Set(["scene-01"])), /reviewed/);
});

test("editing a translation resets approval status", () => {
  const draft = validDraft();
  draft.reviewStatus = "approved";
  const updated = updateDraftTranslation(draft, "scene-01", "ترجمهٔ ویرایش‌شده.");
  assert.equal(updated.segments[0].translation, "ترجمهٔ ویرایش‌شده.");
  assert.equal(updated.reviewStatus, "needs_human_review");
  assert.equal(draft.reviewStatus, "approved");
});
