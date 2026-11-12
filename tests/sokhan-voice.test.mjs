import test from "node:test";
import assert from "node:assert/strict";
import { wavDuration } from "../scripts/sokhan-voice.mjs";

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
