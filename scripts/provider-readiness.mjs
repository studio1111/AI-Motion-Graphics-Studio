#!/usr/bin/env node
import { access } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const providers = [
  { id: "firecrawl", env: "FIRECRAWL_API_KEY", paid: true, role: "source research and page extraction" },
  { id: "anthropic", env: "ANTHROPIC_API_KEY", paid: true, role: "topic-specific script and storyboard planning" },
  {
    id: "pocket-tts",
    role: "local narration for supported languages",
    note: "Availability depends on the Python environment and downloaded model."
  },
  {
    id: "persian-speech",
    role: "local Persian narration",
    note: "Availability depends on the Python environment and downloaded model."
  },
  { id: "remotion", role: "deterministic composition rendering", binary: "node_modules/.bin/remotion" },
  { id: "ffmpeg", role: "media decode and frame/audio inspection", command: "ffmpeg" },
  { id: "ffprobe", role: "render metadata validation", command: "ffprobe" }
];

function commandAvailable(command) {
  const result = spawnSync(command, ["-version"], {
    encoding: "utf8",
    stdio: "ignore",
    timeout: 5000
  });
  return !result.error && result.status === 0;
}

async function pathAvailable(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

export async function buildReadinessReport(env = process.env, cwd = process.cwd()) {
  const paidAllowed = env.ALLOW_PAID_AI === "true";
  const rows = [];

  for (const provider of providers) {
    let configured = false;
    let status = "not_configured";

    if (provider.env) {
      configured = Boolean(String(env[provider.env] || "").trim());
      status = !configured
        ? "missing_credentials"
        : provider.paid && !paidAllowed
          ? "blocked_paid_gate"
          : "credentials_present_not_connectivity_tested";
    } else if (provider.binary) {
      configured = await pathAvailable(resolve(cwd, provider.binary));
      status = configured ? "binary_present_not_render_tested" : "binary_missing";
    } else if (provider.command) {
      configured = commandAvailable(provider.command);
      status = configured ? "command_present_not_media_tested" : "command_missing";
    } else {
      status = "environment_dependent_not_probed";
    }

    rows.push({
      id: provider.id,
      role: provider.role,
      configured,
      status,
      ...(provider.note ? { note: provider.note } : {})
    });
  }

  const blockingStatuses = new Set([
    "missing_credentials",
    "blocked_paid_gate",
    "binary_missing",
    "command_missing"
  ]);
  const blockers = rows.filter(row => blockingStatuses.has(row.status));

  return {
    schemaVersion: 1,
    generatedAt: new Date().toISOString(),
    paidAiAllowed: paidAllowed,
    summary: blockers.length ? "ACTION_REQUIRED" : "STATIC_READINESS_ONLY",
    providers: rows,
    blockers: blockers.map(({ id, status }) => ({ id, status })),
    security: {
      secretValuesIncluded: false,
      externalConnectivityTested: false,
      providerIntegrationProven: false,
      paidCallsMade: false
    },
    guidance: "This is a local, non-network readiness audit. Presence of credentials or binaries does not prove service access or end-to-end integration."
  };
}

function parseArgs(argv) {
  const args = new Set(argv);
  return { json: args.has("--json"), strict: args.has("--strict") };
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const report = await buildReadinessReport();

  if (options.json) {
    console.log(JSON.stringify(report, null, 2));
  } else {
    console.log(`Provider readiness: ${report.summary}`);
    for (const row of report.providers) {
      console.log(`- ${row.id}: ${row.status} - ${row.role}`);
    }
    console.log(report.guidance);
  }

  if (options.strict && report.blockers.length) process.exitCode = 1;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  await main();
}
