import test from "node:test";
import assert from "node:assert/strict";
import { runCommand } from "../scripts/sokhan-voice.mjs";
import { inspectPcmWav, wavDuration } from "../src/production/wav.mjs";

function wavFixture(seconds = 2) {
  const sampleRate = 24000;
  const channels = 1;
  const bits = 16;
  const dataSize = sampleRate * channels * (bits / 8) * seconds;
  const buffer = Buffer.alloc(44 + dataSize);
  buffer.write("RIFF", 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write("WAVE", 8);
  buffer.write("fmt ", 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(channels, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(sampleRate * channels * (bits / 8), 28);
  buffer.writeUInt16LE(channels * (bits / 8), 32);
  buffer.writeUInt16LE(bits, 34);
  buffer.write("data", 36);
  buffer.writeUInt32LE(dataSize, 40);
  return buffer;
}

test("measures duration from a valid PCM WAV", () => {
  assert.equal(wavDuration(wavFixture(2)), 2);
});

test("rejects truncated or non-WAV data", () => {
  assert.equal(wavDuration(Buffer.from("not audio")), null);
  assert.equal(wavDuration(wavFixture(2).subarray(0, 60)), null);
});

test("rejects a RIFF container without the WAVE signature", () => {
  const buffer = wavFixture(1);
  buffer.write("AVI ", 8);
  assert.equal(wavDuration(buffer), null);
});

test("rejects a data chunk whose declared payload is truncated", () => {
  const buffer = wavFixture(1);
  buffer.writeUInt32LE(48_002, 40);
  assert.equal(wavDuration(buffer), null);
});

test("rejects unsupported sample format, channel count, sample rate and bit depth", () => {
  const pcm = wavFixture(1);
  const float = Buffer.from(pcm);
  float.writeUInt16LE(3, 20);
  assert.equal(inspectPcmWav(float), null);

  const stereo = Buffer.from(pcm);
  stereo.writeUInt16LE(2, 22);
  assert.equal(inspectPcmWav(stereo), null);

  const wrongRate = Buffer.from(pcm);
  wrongRate.writeUInt32LE(16_000, 24);
  wrongRate.writeUInt32LE(32_000, 28);
  assert.equal(inspectPcmWav(wrongRate), null);

  const wrongDepth = Buffer.from(pcm);
  wrongDepth.writeUInt16LE(8, 34);
  wrongDepth.writeUInt32LE(24_000, 28);
  assert.equal(inspectPcmWav(wrongDepth), null);
});

test("runs child processes with bounded output and captures successful results", async () => {
  const result = await runCommand(process.execPath, [
    "-e", "process.stdout.write('ok'); process.stderr.write('warning')"
  ], 5000);
  assert.equal(result.code, 0);
  assert.equal(result.stdout, "ok");
  assert.equal(result.stderr, "warning");
  assert.equal(result.timedOut, false);
});

test("reports non-zero child exit codes", async () => {
  const result = await runCommand(process.execPath, ["-e", "process.exit(7)"], 5000);
  assert.equal(result.code, 7);
  assert.equal(result.timedOut, false);
});

test("terminates timed-out child processes and reports the timeout", async () => {
  const result = await runCommand(process.execPath, ["-e", "setTimeout(() => {}, 10000)"], 50);
  assert.equal(result.timedOut, true);
  assert.equal(result.code, null);
  assert.ok(result.signal === "SIGTERM" || result.signal === "SIGKILL");
});

test("reports missing executables without throwing an unhandled process error", async () => {
  const result = await runCommand("/sokhan/definitely/missing/executable", [], 1000);
  assert.equal(result.code, null);
  assert.match(result.error, /ENOENT/);
});
