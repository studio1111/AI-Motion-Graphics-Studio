import test from "node:test";
import assert from "node:assert/strict";
import { inspectPcmWav, wavDuration } from "../src/production/wav.mjs";

function pcmWav({ seconds = 1, sampleRate = 24000, channels = 1, bits = 16, encoding = 1 } = {}) {
  const blockAlign = channels * (bits / 8);
  const dataSize = sampleRate * blockAlign * seconds;
  const buffer = Buffer.alloc(44 + dataSize);
  buffer.write("RIFF", 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write("WAVE", 8);
  buffer.write("fmt ", 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(encoding, 20);
  buffer.writeUInt16LE(channels, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(sampleRate * blockAlign, 28);
  buffer.writeUInt16LE(blockAlign, 32);
  buffer.writeUInt16LE(bits, 34);
  buffer.write("data", 36);
  buffer.writeUInt32LE(dataSize, 40);
  return buffer;
}

test("accepts the exact mono 24 kHz PCM16 WAV format used by Sokhan", () => {
  assert.equal(wavDuration(pcmWav({ seconds: 2 })), 2);
});

test("rejects RIFF containers that are not WAVE", () => {
  const buffer = pcmWav();
  buffer.write("AVI ", 8);
  assert.equal(wavDuration(buffer), null);
});

test("rejects truncated or inconsistent RIFF/data chunk lengths", () => {
  const buffer = pcmWav();
  buffer.writeUInt32LE(48_002, 40);
  assert.equal(wavDuration(buffer), null);
  const invalidRiff = pcmWav();
  invalidRiff.writeUInt32LE(0xffffffff, 4);
  assert.equal(wavDuration(invalidRiff), null);
});

test("rejects non-PCM, stereo, wrong-rate and wrong-bit-depth audio", () => {
  assert.equal(wavDuration(pcmWav({ encoding: 3 })), null);
  assert.equal(wavDuration(pcmWav({ channels: 2 })), null);
  assert.equal(wavDuration(pcmWav({ sampleRate: 16000 })), null);
  assert.equal(wavDuration(pcmWav({ bits: 8 })), null);
});

function fillSamples(buffer, sampleAt) {
  for (let offset = 44, index = 0; offset + 2 <= buffer.length; offset += 2, index++) {
    buffer.writeInt16LE(sampleAt(index), offset);
  }
  return buffer;
}

test("reports signal level and duration for a valid speech-like PCM signal", () => {
  const buffer = fillSamples(pcmWav({ seconds: 1 }), index =>
    Math.round(Math.sin(index * Math.PI / 24) * 8000)
  );
  const qc = inspectPcmWav(buffer);
  assert.equal(qc.durationSeconds, 1);
  assert.equal(qc.isSilent, false);
  assert.equal(qc.isClipped, false);
  assert.ok(qc.rmsAmplitude > 0.1);
});

test("flags digital silence instead of accepting it as generated narration", () => {
  const qc = inspectPcmWav(pcmWav({ seconds: 1 }));
  assert.equal(qc.isSilent, true);
});

test("flags a heavily clipped signal", () => {
  const buffer = fillSamples(pcmWav({ seconds: 1 }), () => 32767);
  const qc = inspectPcmWav(buffer);
  assert.equal(qc.isClipped, true);
  assert.equal(qc.clippedSamples, 24000);
});
