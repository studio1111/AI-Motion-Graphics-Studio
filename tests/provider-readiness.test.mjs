import test from "node:test";
import assert from "node:assert/strict";
import { buildReadinessReport } from "../scripts/provider-readiness.mjs";

test("readiness audit never exposes provider secrets or endpoint values", async () => {
  const report = await buildReadinessReport({
    FIRECRAWL_API_KEY: "secret-firecrawl",
    ANTHROPIC_API_KEY: "secret-anthropic",
    ACESTEP_API_URL: "https://music.example.test/private/path"
  }, "/nonexistent-motion-studio");
  const serialized = JSON.stringify(report);
  for (const secret of ["secret-firecrawl", "secret-anthropic", "music.example.test", "/private/path"]) {
    assert.equal(serialized.includes(secret), false);
  }
  assert.equal(report.security.secretValuesIncluded, false);
  assert.equal(report.security.endpointValuesIncluded, false);
  assert.equal(report.security.paidCallsMade, false);
});

test("paid provider keys remain gated unless explicitly enabled", async () => {
  const report = await buildReadinessReport({
    FIRECRAWL_API_KEY: "present",
    ANTHROPIC_API_KEY: "present"
  }, "/nonexistent-motion-studio");
  assert.equal(report.paidAiAllowed, false);
  assert.equal(report.providers.find(provider => provider.id === "firecrawl").status, "blocked_paid_gate");
  assert.equal(report.providers.find(provider => provider.id === "anthropic").status, "blocked_paid_gate");
});

test("explicit paid permission changes only the static readiness status", async () => {
  const report = await buildReadinessReport({
    FIRECRAWL_API_KEY: "present",
    ALLOW_PAID_AI: "true"
  }, "/nonexistent-motion-studio");
  assert.equal(report.providers.find(provider => provider.id === "firecrawl").status, "credentials_present_not_connectivity_tested");
  assert.equal(report.security.externalConnectivityTested, false);
  assert.equal(report.security.providerIntegrationProven, false);
});

test("optional local media integrations are visible without blocking basic rendering", async () => {
  const report = await buildReadinessReport({}, "/nonexistent-motion-studio");
  for (const id of ["pocket-tts", "persian-speech", "whisperx", "ace-step"]) {
    assert.ok(report.providers.some(provider => provider.id === id), `missing provider row: ${id}`);
  }
  assert.equal(report.providers.find(provider => provider.id === "ace-step").status, "optional_endpoint_not_configured");
  assert.ok(!report.blockers.some(blocker => ["pocket-tts", "persian-speech", "whisperx", "ace-step"].includes(blocker.id)));
});

test("ACE-Step endpoint validation is syntactic and never leaks the endpoint", async () => {
  const valid = await buildReadinessReport({ ACESTEP_API_URL: "http://127.0.0.1:8000/api" }, "/nonexistent-motion-studio");
  assert.equal(valid.providers.find(provider => provider.id === "ace-step").status, "endpoint_configured_not_connectivity_tested");
  const invalid = await buildReadinessReport({ ACESTEP_API_URL: "javascript:alert(1)" }, "/nonexistent-motion-studio");
  assert.equal(invalid.providers.find(provider => provider.id === "ace-step").status, "endpoint_invalid");
  assert.ok(invalid.blockers.some(blocker => blocker.id === "ace-step"));
  assert.equal(JSON.stringify(valid).includes("127.0.0.1"), false);
});

test("missing paid credentials are reported without throwing", async () => {
  const report = await buildReadinessReport({}, "/nonexistent-motion-studio");
  assert.equal(report.providers.find(provider => provider.id === "anthropic").status, "missing_credentials");
  assert.ok(["ACTION_REQUIRED", "STATIC_READINESS_ONLY"].includes(report.summary));
});
