import test from "node:test";
import assert from "node:assert/strict";
import { buildReadinessReport } from "../scripts/provider-readiness.mjs";

test("readiness audit never exposes provider secret values", async () => {
  const report = await buildReadinessReport({
    FIRECRAWL_API_KEY: "secret-firecrawl",
    ANTHROPIC_API_KEY: "secret-anthropic"
  }, "/nonexistent-motion-studio");
  const serialized = JSON.stringify(report);
  assert.equal(serialized.includes("secret-firecrawl"), false);
  assert.equal(serialized.includes("secret-anthropic"), false);
  assert.equal(report.security.secretValuesIncluded, false);
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

test("missing credentials are reported without throwing", async () => {
  const report = await buildReadinessReport({}, "/nonexistent-motion-studio");
  assert.equal(report.providers.find(provider => provider.id === "anthropic").status, "missing_credentials");
  assert.ok(["ACTION_REQUIRED", "STATIC_READINESS_ONLY"].includes(report.summary));
});
