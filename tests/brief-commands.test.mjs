import test from "node:test";
import assert from "node:assert/strict";
import { buildLocalCliCommand, buildWorkflowDispatchCommand } from "../site/brief-commands.mjs";

const validBrief = {
  topic: "A useful explainer topic",
  language: "en",
  durationSeconds: 60,
  style: "auto",
  aspectRatio: "16:9",
  voice: "off",
  allowPaidAi: false
};

test("brief command builders reject invalid duration and unknown option values", () => {
  assert.throws(() => buildLocalCliCommand({ ...validBrief, durationSeconds: 601 }), /between 5 and 600/);
  assert.throws(() => buildWorkflowDispatchCommand({ ...validBrief, language: "xx" }), /Unsupported video language/);
  assert.throws(() => buildWorkflowDispatchCommand({ ...validBrief, style: "untrusted-style" }), /Unsupported visual style/);
});

test("brief command builders reject malformed references and non-boolean cost consent", () => {
  assert.throws(() => buildWorkflowDispatchCommand({ ...validBrief, opus55Reference: "../../secret" }), /lowercase slug/);
  assert.throws(() => buildWorkflowDispatchCommand({ ...validBrief, allowPaidAi: "true" }), /must be a boolean/);
});

test("workflow command sends explicit boolean consent and never asks for an API key", () => {
  const denied = buildWorkflowDispatchCommand(validBrief);
  assert.match(denied, /-f 'use_ai=false'/);
  assert.doesNotMatch(denied, /--allow-paid-ai|API_KEY/);

  const allowed = buildWorkflowDispatchCommand({ ...validBrief, allowPaidAi: true });
  assert.match(allowed, /-f 'use_ai=true'/);
  assert.doesNotMatch(allowed, /ANTHROPIC_API_KEY|FIRECRAWL_API_KEY/);
});
