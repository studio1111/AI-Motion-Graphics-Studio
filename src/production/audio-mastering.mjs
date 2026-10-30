import { spawn } from "node:child_process";
import { mkdir, rename, rm, stat } from "node:fs/promises";
import { basename, dirname, join } from "node:path";

export const TARGET_LOUDNESS_LUFS = -16;
export const TARGET_TRUE_PEAK_DBTP = -1.5;
export const TARGET_LOUDNESS_RANGE_LU = 11;

const finiteNumber = (value) => {
  const number = typeof value === "number" ? value : Number(String(value ?? "").trim());
  return Number.isFinite(number) ? number : null;
};

export function parseLoudnormMeasurements(logText) {
  const blocks = String(logText || "").match(/\{[^{}]*\}/gs) || [];
  for (let index = blocks.length - 1; index >= 0; index -= 1) {
    let parsed;
    try { parsed = JSON.parse(blocks[index]); } catch { continue; }
    const values = {
      inputI: finiteNumber(parsed.input_i),
      inputTp: finiteNumber(parsed.input_tp),
      inputLra: finiteNumber(parsed.input_lra),
      inputThresh: finiteNumber(parsed.input_thresh),
      targetOffset: finiteNumber(parsed.target_offset)
    };
    if (Object.values(values).every((value) => value !== null)) return values;
  }
  return null;
}

function assertMeasurements(measurements) {
  if (!measurements || !["inputI", "inputTp", "inputLra", "inputThresh", "targetOffset"].every((key) => Number.isFinite(measurements[key]))) {
    throw new TypeError("Audio mastering requires five finite loudness measurements from FFmpeg.");
  }
}

const preFilters = [
  "highpass=f=65:p=2",
  "equalizer=f=280:t=q:w=1:g=-1.5",
  "equalizer=f=2800:t=q:w=1:g=1.2",
  "acompressor=threshold=0.14:ratio=2.4:attack=18:release=180:makeup=1"
].join(",");

export function buildLoudnessProbeFilter() {
  return `loudnorm=I=${TARGET_LOUDNESS_LUFS}:TP=${TARGET_TRUE_PEAK_DBTP}:LRA=${TARGET_LOUDNESS_RANGE_LU}:print_format=json`;
}

export function verifyMasteredOutput(measurements, options = {}) {
  assertMeasurements(measurements);
  const loudnessTolerance = Number.isFinite(options.loudnessTolerance) ? options.loudnessTolerance : 1.5;
  const truePeakTolerance = Number.isFinite(options.truePeakTolerance) ? options.truePeakTolerance : 0.7;
  if (loudnessTolerance < 0 || truePeakTolerance < 0) {
    throw new RangeError("Audio verification tolerances cannot be negative.");
  }
  const issues = [];
  if (Math.abs(measurements.inputI - TARGET_LOUDNESS_LUFS) > loudnessTolerance) {
    issues.push(`Integrated loudness ${measurements.inputI} LUFS is outside the target ${TARGET_LOUDNESS_LUFS} ± ${loudnessTolerance} LU.`);
  }
  const allowedTruePeak = TARGET_TRUE_PEAK_DBTP + truePeakTolerance;
  if (measurements.inputTp > allowedTruePeak) {
    issues.push(`True peak ${measurements.inputTp} dBTP exceeds the allowed ceiling ${allowedTruePeak} dBTP.`);
  }
  return {
    status: issues.length ? "FAIL" : "PASS",
    integratedLufs: measurements.inputI,
    truePeakDbtp: measurements.inputTp,
    loudnessToleranceLu: loudnessTolerance,
    truePeakToleranceDb: truePeakTolerance,
    issues
  };
}

export function buildAudioMasterFilter(measurements = null) {
  const base = `loudnorm=I=${TARGET_LOUDNESS_LUFS}:TP=${TARGET_TRUE_PEAK_DBTP}:LRA=${TARGET_LOUDNESS_RANGE_LU}`;
  if (!measurements) return preFilters + "," + base + ":print_format=json";
  assertMeasurements(measurements);
  return preFilters + "," + base +
    `:measured_I=${measurements.inputI}:measured_TP=${measurements.inputTp}` +
    `:measured_LRA=${measurements.inputLra}:measured_thresh=${measurements.inputThresh}` +
    `:offset=${measurements.targetOffset}:linear=true:print_format=summary`;
}

function runProcess(command, args, timeoutMs = 900_000) {
  return new Promise((resolvePromise, rejectPromise) => {
    let child;
    let stdout = "";
    let stderr = "";
    let settled = false;
    try { child = spawn(command, args, { stdio: ["ignore", "pipe", "pipe"] }); }
    catch (error) { rejectPromise(error); return; }
    const append = (prior, chunk) => (prior + chunk.toString()).slice(-100_000);
    child.stdout.on("data", (chunk) => { stdout = append(stdout, chunk); });
    child.stderr.on("data", (chunk) => { stderr = append(stderr, chunk); });
    const timer = setTimeout(() => {
      if (settled) return;
      child.kill("SIGTERM");
      setTimeout(() => { if (!settled) child.kill("SIGKILL"); }, 3000).unref();
    }, timeoutMs);
    child.once("error", (error) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      rejectPromise(error);
    });
    child.once("close", (code) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      resolvePromise({ code, stdout, stderr });
    });
  });
}

export async function masterAudioVideo(inputPath, options = {}) {
  const ffmpeg = options.ffmpegPath || process.env.FFMPEG_PATH || "ffmpeg";
  const timeoutMs = options.timeoutMs || 900_000;
  const source = String(inputPath || "");
  if (!source || !/\.mp4$/i.test(source)) throw new TypeError("Audio mastering input must be an MP4 file path.");
  const folder = dirname(source);
  await mkdir(folder, { recursive: true });
  const tempPath = join(folder, basename(source).replace(/\.mp4$/i, ".mastering.tmp.mp4"));
  await rm(tempPath, { force: true });

  try {
    const analysis = await runProcess(ffmpeg, [
      "-hide_banner", "-nostats", "-i", source, "-map", "0:a:0",
      "-af", buildAudioMasterFilter(), "-f", "null", "-"
    ], timeoutMs);
    if (analysis.code !== 0) throw new Error("FFmpeg loudness analysis failed: " + String(analysis.stderr).slice(-1200));
    const measurements = parseLoudnormMeasurements(analysis.stderr);
    if (!measurements) throw new Error("FFmpeg loudness analysis did not return valid measurements; mastered output was not substituted.");

    const render = await runProcess(ffmpeg, [
      "-y", "-hide_banner", "-i", source,
      "-map", "0:v:0", "-map", "0:a:0",
      "-af", buildAudioMasterFilter(measurements),
      "-c:v", "copy", "-c:a", "aac", "-b:a", "256k", "-ar", "48000",
      "-movflags", "+faststart", "-map_metadata", "0", tempPath
    ], timeoutMs);
    if (render.code !== 0) throw new Error("FFmpeg mastering render failed: " + String(render.stderr).slice(-1600));
    const outputStat = await stat(tempPath);
    if (!outputStat.size) throw new Error("FFmpeg returned an empty mastered video.");

    const verification = await runProcess(ffmpeg, [
      "-hide_banner", "-nostats", "-i", tempPath, "-map", "0:a:0",
      "-af", buildLoudnessProbeFilter(), "-f", "null", "-"
    ], timeoutMs);
    if (verification.code !== 0) {
      throw new Error("FFmpeg post-mastering verification failed: " + String(verification.stderr).slice(-1200));
    }
    const verifiedMeasurements = parseLoudnormMeasurements(verification.stderr);
    if (!verifiedMeasurements) {
      throw new Error("Post-mastering verification did not return valid loudness measurements.");
    }
    const outputVerification = verifyMasteredOutput(verifiedMeasurements);
    if (outputVerification.status !== "PASS") {
      throw new Error("Mastered audio did not meet output targets: " + outputVerification.issues.join(" "));
    }

    // Keep the original available until the mastered container has rendered successfully.
    const backup = source + ".unmastered.bak";
    await rm(backup, { force: true });
    await rename(source, backup);
    try {
      await rename(tempPath, source);
      await rm(backup, { force: true });
    } catch (error) {
      await rename(backup, source).catch(() => {});
      throw error;
    }
    return {
      status: "PASS",
      method: "two-pass-eebu-r128",
      targetIntegratedLufs: TARGET_LOUDNESS_LUFS,
      targetTruePeakDbtp: TARGET_TRUE_PEAK_DBTP,
      targetLoudnessRangeLu: TARGET_LOUDNESS_RANGE_LU,
      measurements,
      outputVerification,
      audioCodec: "aac",
      audioBitrate: "256k",
      sampleRate: 48000,
      filters: preFilters.split(",")
    };
  } finally {
    await rm(tempPath, { force: true });
  }
}
