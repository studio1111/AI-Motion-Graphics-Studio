import test from "node:test";
import assert from "node:assert/strict";
import {
  buildAudioMasterFilter,
  parseLoudnormMeasurements,
  TARGET_LOUDNESS_LUFS,
  TARGET_TRUE_PEAK_DBTP
} from "../src/production/audio-mastering.mjs";
import { normalizeNarrationText } from "../src/production/narration.mjs";
import { buildMusicPrompt, resolveMusicEngine } from "../src/production/ace-step-client.mjs";
import { getMusicBedGain, getVoiceFadeEnvelope } from "../src/production/audio-mix.mjs";
import { buildNarrationEnhancementFilter } from "../src/production/voice-processing.mjs";
import { parseArgs } from "../scripts/produce.mjs";

test("audio master targets creator-friendly loudness and includes restrained voice clarity processing", () => {
  assert.equal(TARGET_LOUDNESS_LUFS, -16);
  assert.equal(TARGET_TRUE_PEAK_DBTP, -1.5);
  const filter = buildAudioMasterFilter();
  assert.match(filter, /highpass=f=65/);
  assert.match(filter, /equalizer=f=280/);
  assert.match(filter, /equalizer=f=2800/);
  assert.match(filter, /acompressor=/);
  assert.match(filter, /loudnorm=I=-16:TP=-1\.5:LRA=11/);
});

test("loudness analysis is parsed only when all required measurements are finite", () => {
  const log = `frame=100
[Parsed_loudnorm_0] {
  "input_i" : "-18.2",
  "input_tp" : "-2.4",
  "input_lra" : "4.1",
  "input_thresh" : "-29.0",
  "target_offset" : "1.3"
}`;
  assert.deepEqual(parseLoudnormMeasurements(log), {
    inputI: -18.2,
    inputTp: -2.4,
    inputLra: 4.1,
    inputThresh: -29,
    targetOffset: 1.3
  });
  assert.equal(parseLoudnormMeasurements("invalid ffmpeg log"), null);
  assert.equal(parseLoudnormMeasurements(log.replace('"input_lra" : "4.1"', '"input_lra" : "-inf"')), null);
});

test("second-pass mastering filter applies measured values without losing the standard target", () => {
  const measurements = { inputI: -18.2, inputTp: -2.4, inputLra: 4.1, inputThresh: -29, targetOffset: 1.3 };
  const filter = buildAudioMasterFilter(measurements);
  assert.match(filter, /measured_I=-18\.2/);
  assert.match(filter, /measured_TP=-2\.4/);
  assert.match(filter, /measured_LRA=4\.1/);
  assert.match(filter, /measured_thresh=-29/);
  assert.match(filter, /offset=1\.3/);
  assert.match(filter, /linear=true/);
});

test("Persian narration normalization improves spelling and punctuation for TTS", () => {
  assert.equal(
    normalizeNarrationText("  اين كتاب، براي هوش مصنوعي  ؟  ", "fa"),
    "این کتاب، برای هوش مصنوعی؟"
  );
  assert.equal(normalizeNarrationText("سلام   دنیا", "fa"), "سلام دنیا.");
  assert.equal(normalizeNarrationText("Hello   world", "en"), "Hello world.");
});

test("ACE-Step music direction is instrumental, scene-aware and bounded", () => {
  const prompt = buildMusicPrompt({
    topic: "آینده هوش مصنوعی",
    styleId: "scientific-2-5d",
    durationSeconds: 60,
    language: "fa"
  });
  assert.match(prompt, /instrumental/i);
  assert.match(prompt, /no vocals/i);
  assert.match(prompt, /60-second|60 seconds/i);
  assert.match(prompt, /AI|artificial intelligence/i);
  assert.match(prompt, /intro/i);
  assert.match(prompt, /finale/i);
});

test("music engine selection uses ACE-Step only when explicitly requested or configured", () => {
  assert.equal(resolveMusicEngine("auto", ""), "procedural");
  assert.equal(resolveMusicEngine("auto", "http://127.0.0.1:8001"), "ace-step");
  assert.equal(resolveMusicEngine("procedural", "http://127.0.0.1:8001"), "procedural");
  assert.throws(() => resolveMusicEngine("ace-step", ""), /ACESTEP_API_URL/);
  assert.throws(() => resolveMusicEngine("unknown", ""), /music engine/i);
});

test("voice fades are brief and music ducks smoothly around narration", () => {
  const fade = getVoiceFadeEnvelope;
  assert.equal(fade(0, 900, 30), 0);
  assert.ok(fade(2, 900, 30) > 0 && fade(2, 900, 30) < 1);
  assert.equal(fade(30, 900, 30), 1);
  assert.equal(fade(899, 900, 30), 0);
  const ranges = [{ startFrame: 300, endFrame: 600 }];
  const before = getMusicBedGain(285, 900, 30, ranges);
  const during = getMusicBedGain(350, 900, 30, ranges);
  const after = getMusicBedGain(615, 900, 30, ranges);
  assert.ok(during < before);
  assert.ok(during < after);
  assert.ok(before > 0 && after > 0);
});

test("narration enhancement chain controls rumble, intelligibility, dynamics and peaks", () => {
  const filter = buildNarrationEnhancementFilter();
  assert.match(filter, /highpass=f=70/);
  assert.match(filter, /equalizer=f=180/);
  assert.match(filter, /equalizer=f=3200/);
  assert.match(filter, /acompressor=/);
  assert.match(filter, /loudnorm=I=-20:TP=-3:LRA=7/);
  assert.match(filter, /alimiter=limit=0\.92/);
});

test("CLI selects music engines explicitly and supports workflow configuration", () => {
  assert.equal(parseArgs([], {}).musicEngine, "auto");
  assert.equal(parseArgs([], { MOTION_STUDIO_MUSIC_ENGINE: "procedural" }).musicEngine, "procedural");
  assert.equal(parseArgs(["--music-engine", "ace-step"], { ACESTEP_API_URL: "http://127.0.0.1:8001" }).musicEngine, "ace-step");
  assert.throws(() => parseArgs(["--music-engine", "ace-step"], {}), /ACESTEP_API_URL/);
  assert.throws(() => parseArgs(["--music-engine", "arbitrary"], {}), /Music engine/);
});
