#!/usr/bin/env node
import { access, mkdir, readFile, rename, rm, writeFile } from "node:fs/promises";
import { constants as fsConstants } from "node:fs";
import { delimiter, join, resolve, basename } from "node:path";\nimport { pathToFileURL } from "node:url";
import { spawn } from "node:child_process";
import { normalizeNarrationText } from "../src/production/narration.mjs";
import { validateSokhanTranslationDocument } from "../src/production/sokhan-translation.mjs";
import { buildNarrationEnhancementFilter, getEnhancedNarrationPath } from "../src/production/voice-processing.mjs";

const HELP = `Sokhan Persian voice generator

Usage:
  node scripts/sokhan-voice.mjs --input translation.json [--output-dir out/sokhan-voice]

The input must be a reviewed Sokhan v1 English-to-Persian JSON translation document.
Requires the existing Persian Speech / Mana-Persian-Piper 'speech' executable and FFmpeg.
Environment:
  SOKHAN_SPEECH_BIN   Override the speech executable path
  FFMPEG_PATH         Override the FFmpeg executable path
`;

function parseArgs(argv) {
  const options = { input: "", outputDir: "out/sokhan-voice" };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--help" || arg === "-h") return { ...options, help: true };
    const [flag, inline] = arg.split("=", 2);
    if (flag !== "--input" && flag !== "--output-dir") throw new Error("Unknown option: " + arg);
    const value = inline ?? argv[++i];
    if (!value) throw new Error("Missing value for " + flag);
    options[flag === "--input" ? "input" : "outputDir"] = value;
  }
  if (!options.input) throw new Error("--input is required.");
  return options;
}

async function findExecutable(name, override) {
  const candidates = override ? [override] : (process.env.PATH || "").split(delimiter).map(dir => join(dir, name));
  for (const candidate of candidates) {
    try {
      await access(candidate, fsConstants.X_OK);
      return candidate;
    } catch {}
  }
  return null;
}

function run(command, args, timeoutMs = 240000) {
  return new Promise(resolvePromise => {
    let stdout = "", stderr = "", settled = false;
    let child;
    try { child = spawn(command, args, { stdio: ["ignore", "pipe", "pipe"] }); }
    catch (error) { resolvePromise({ code: null, error: String(error) }); return; }
    const append = (current, chunk) => (current + chunk.toString()).slice(-4000);
    child.stdout.on("data", chunk => { stdout = append(stdout, chunk); });
    child.stderr.on("data", chunk => { stderr = append(stderr, chunk); });
    const timer = setTimeout(() => {\n      child.kill("SIGTERM");\n      setTimeout(() => { if (!settled) child.kill("SIGKILL"); }, 3000).unref();\n    }, timeoutMs);
    child.on("error", error => {
      if (settled) return;
      settled = true; clearTimeout(timer);
      resolvePromise({ code: null, stdout, stderr, error: String(error) });
    });
    child.on("close", code => {
      if (settled) return;
      settled = true; clearTimeout(timer);
      resolvePromise({ code, stdout, stderr });
    });
  });
}

export function wavDuration(buffer) {
  if (!Buffer.isBuffer(buffer) || buffer.length < 44 || buffer.toString("ascii", 0, 4) !== "RIFF" || buffer.toString("ascii", 8, 12) !== "WAVE") return null;
  let byteRate = 0, dataSize = null, dataOffset = null;
  for (let offset = 12; offset + 8 <= buffer.length;) {
    const chunk = buffer.toString("ascii", offset, offset + 4);
    const size = buffer.readUInt32LE(offset + 4);
    if (chunk === "fmt " && size >= 16 && offset + 24 <= buffer.length) byteRate = buffer.readUInt32LE(offset + 16);
    if (chunk === "data") { dataSize = size; dataOffset = offset; break; }
    offset += 8 + size + (size % 2);
  }
  return byteRate > 0 && dataSize !== null && dataSize <= buffer.length - dataOffset - 8 ? dataSize / byteRate : null;
}

function safeId(value, index) {
  const id = String(value || "segment-" + index).normalize("NFKD")
    .replace(/[^a-zA-Z0-9_-]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 48);
  return id || "segment-" + index;
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  if (options.help) { console.log(HELP); return; }
  const inputPath = resolve(options.input);
  const outputDir = resolve(options.outputDir);
  if (inputPath === outputDir || outputDir.startsWith(inputPath + "/")) {
    throw new Error("Output directory must not be inside the translation document path.");
  }
  const raw = await readFile(inputPath, "utf8");
  if (Buffer.byteLength(raw, "utf8") > 2_000_000) throw new Error("Translation document exceeds the 2 MB safety limit.");
  const document = validateSokhanTranslationDocument(JSON.parse(raw));
  if (document.reviewStatus === "needs_human_review") {
    throw new Error("Translation is still marked needs_human_review. Review it, then set reviewStatus to approved before synthesis.");
  }
  if (document.reviewStatus !== "approved") {
    throw new Error("Set reviewStatus to approved only after reviewing the Persian translation.");
  }

  const speech = await findExecutable("speech", process.env.SOKHAN_SPEECH_BIN);
  const ffmpeg = await findExecutable("ffmpeg", process.env.FFMPEG_PATH);
  if (!speech) throw new Error("Persian Speech executable 'speech' was not found. Install the existing persian-speech package first.");
  if (!ffmpeg) throw new Error("FFmpeg was not found. Install FFmpeg or set FFMPEG_PATH.");

  await mkdir(outputDir, { recursive: true });
  const manifest = {
    schemaVersion: 1,
    sourceLanguage: "en",
    targetLanguage: "fa",
    engine: "Persian Speech / Mana-Persian-Piper",
    model: "runtime-managed; weights are not bundled",
    sourceDocument: basename(inputPath),
    createdAt: new Date().toISOString(),
    status: "generating",
    segments: []
  };

  for (let index = 0; index < document.segments.length; index++) {
    const segment = document.segments[index];
    const id = safeId(segment.id, index + 1);
    const base = String(index + 1).padStart(4, "0") + "-" + id;
    const rawPath = join(outputDir, base + ".source.wav");
    const finalPath = join(outputDir, base + ".wav");
    const text = normalizeNarrationText(segment.translation, "fa");
    const generated = await run(speech, [text, rawPath]);
    if (generated.code !== 0) {
      await rm(rawPath, { force: true });
      throw new Error("Persian speech generation failed for " + segment.id + ": " + String(generated.stderr || generated.error || "unknown error").slice(-500));
    }
    const enhancedPath = getEnhancedNarrationPath(rawPath);
    const enhanced = await run(ffmpeg, [
      "-y", "-hide_banner", "-loglevel", "error", "-i", rawPath,
      "-af", buildNarrationEnhancementFilter(), "-ac", "1", "-ar", "24000",
      "-c:a", "pcm_s16le", enhancedPath
    ]);
    await rm(rawPath, { force: true });
    if (enhanced.code !== 0) {
      await rm(enhancedPath, { force: true });
      throw new Error("FFmpeg audio enhancement failed for " + segment.id + ": " + String(enhanced.stderr || enhanced.error || "unknown error").slice(-500));
    }
    const audio = await readFile(enhancedPath);
    const durationSeconds = wavDuration(audio);
    if (!durationSeconds || !Number.isFinite(durationSeconds) || durationSeconds <= 0) {
      await rm(enhancedPath, { force: true });
      throw new Error("Generated audio for " + segment.id + " is not a valid non-empty WAV file.");
    }
    await rename(enhancedPath, finalPath);
    manifest.segments.push({
      id: segment.id,
      sourceText: segment.sourceText,
      narration: text,
      audioFile: base + ".wav",
      durationSeconds: Number(durationSeconds.toFixed(3))
    });
    console.log("Generated " + segment.id + " (" + durationSeconds.toFixed(2) + " s)");
  }

  manifest.status = "generated";
  const target = join(outputDir, "voice-manifest.json");
  const temporary = target + ".tmp";
  await writeFile(temporary, JSON.stringify(manifest, null, 2) + "\n", "utf8");
  await rename(temporary, target);
  console.log("Persian voice assets: " + outputDir);
  console.log("Manifest: " + target);
}

main().catch(error => {
  console.error("Sokhan voice: " + String(error?.message || error));
  process.exitCode = 1;
});
