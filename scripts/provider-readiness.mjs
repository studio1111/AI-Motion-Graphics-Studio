#!/usr/bin/env node
import { access } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const providers = [
  { id: "firecrawl", env: "FIRECRAWL_API_KEY", paid: true, role: "source research and page extraction" },
  { id: "anthropic", env: "ANTHROPIC_API_KEY", paid: true, role: "topic-specific script and storyboard planning" },
  { id: "pocket-tts", pythonModule: "pocket_tts", role: "local narration for supported languages", note: "Module presence does not prove model weights or language support are available." },
  { id: "persian-speech", pythonModule: "persian_speech", role: "local Persian narration", note: "Module presence does not prove voice-model weights are downloaded." },
  { id: "whisperx", pythonModule: "whisperx", role: "optional transcription and subtitle alignment", note: "Optional transcription route; not required for rendering." },
  { id: "ace-step", env: "ACESTEP_API_URL", role: "optional self-hosted AI soundtrack generation", note: "The endpoint is checked syntactically only; no network request is made." },
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

function pythonModuleAvailable(moduleName) {
  const result = spawnSync("python3", ["-c", "import importlib.util,sys; sys.exit(0 if importlib.util.find_spec(sys.argv[1]) else 1)", moduleName], {
    encoding: "utf8",
    stdio: "ignore",
    timeout: 5000
  });
  return !result.error && result.status === 0;
}

function validHttpEndpoint(value) {
  try {
    const url = new URL(String(value || "").trim());
    return ["http:", "https:"].includes(url.protocol) &&
      !url.username && !url.password && !url.search && !url.hash;
  } catch {
    return false;
  }
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

    if (provider.env && provider.id === "ace-step") {
      const endpoint = String(env[provider.env] || "").trim();
      configured = validHttpEndpoint(endpoint);
      status = !endpoint
        ? "optional_endpoint_not_configured"
        : configured
          ? "endpoint_configured_not_connectivity_tested"
          : "endpoint_invalid";
    } else if (provider.env) {
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
    } else if (provider.pythonModule) {
      configured = pythonModuleAvailable(provider.pythonModule);
      status = configured ? "python_module_present_not_model_tested" : "python_module_missing_optional";
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
    "command_missing",
    "endpoint_invalid"
  ]);
  const blockers = rows.filter(row => blockingStatuses.has(row.status));

  return {
    schemaVersion: 2,
    generatedAt: new Date().toISOString(),
    paidAiAllowed: paidAllowed,
    summary: blockers.length ? "ACTION_REQUIRED" : "STATIC_READINESS_ONLY",
    providers: rows,
    blockers: blockers.map(({ id, status }) => ({ id, status })),
    security: {
      secretValuesIncluded: false,
      endpointValuesIncluded: false,
      externalConnectivityTested: false,
      providerIntegrationProven: false,
      paidCallsMade: false
    },
    guidance: "This is a local, non-network readiness audit. It never prints credentials or endpoint values. Module, credential, endpoint, or binary presence does not prove service access, model availability, or end-to-end integration."
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
