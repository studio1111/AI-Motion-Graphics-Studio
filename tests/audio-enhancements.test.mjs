import test from "node:test";
import assert from "node:assert/strict";
import {
  buildAudioMasterFilter,
  buildLoudnessProbeFilter,
  verifyMasteredOutput,
  parseLoudnormMeasurements,
  TARGET_LOUDNESS_LUFS,
  TARGET_TRUE_PEAK_DBTP
} from "../src/production/audio-mastering.mjs";
import { normalizeNarrationText } from "../src/production/narration.mjs";
import { buildMusicPrompt, resolveMusicEngine } from "../src/production/ace-step-client.mjs";
import { getMusicBedGain, getVoiceFadeEnvelope } from "../src/production/audio-mix.mjs";
import { buildNarrationEnhancementFilter, getEnhancedNarrationPath, buildEdgeTtsArgs, EDGE_TTS_VOICE_BY_LANGUAGE } from "../src/production/voice-processing.mjs";
import { extendFinalSceneToTarget } from "../src/production/narration-timing.mjs";
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

test("post-mastering verification measures the output without applying another processing pass", () => {
  assert.equal(buildLoudnessProbeFilter(), "loudnorm=I=-16:TP=-1.5:LRA=11:print_format=json");
  const good = {
    inputI: -16.3,
    inputTp: -1.2,
    inputLra: 5,
    inputThresh: -27,
    targetOffset: 0
  };
  assert.deepEqual(verifyMasteredOutput(good), {
    status: "PASS",
    integratedLufs: -16.3,
    truePeakDbtp: -1.2,
    loudnessToleranceLu: 1.5,
    truePeakToleranceDb: 0.7,
    issues: []
  });
  const bad = verifyMasteredOutput({ ...good, inputI: -13.8, inputTp: -0.2 });
  assert.equal(bad.status, "FAIL");
  assert.equal(bad.issues.length, 2);
  assert.throws(() => verifyMasteredOutput(good, { loudnessTolerance: -1 }), /cannot be negative/);
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

test("enhanced narration output accepts local WAV or neural MP3 input and always emits WAV", () => {
  assert.equal(getEnhancedNarrationPath("voice-01.wav"), "voice-01.enhanced.wav");
  assert.equal(getEnhancedNarrationPath("/tmp/generated/voice-02.WAV"), "/tmp/generated/voice-02.enhanced.wav");
  assert.equal(getEnhancedNarrationPath("/tmp/generated/voice-03.mp3"), "/tmp/generated/voice-03.enhanced.wav");
  assert.throws(() => getEnhancedNarrationPath("voice-04.mp4"), /WAV or MP3/i);
});

test("Edge TTS creates safe argument arrays with a Persian neural narration profile", () => {
  assert.equal(EDGE_TTS_VOICE_BY_LANGUAGE.fa, "fa-IR-FaridNeural");
  const args = buildEdgeTtsArgs({ text: "سلام، این یک آزمون است.", outputPath: "/tmp/voice 01.mp3", language: "fa", env: {} });
  assert.deepEqual(args, [
    "--voice", "fa-IR-FaridNeural",
    "--rate=-6%", "--pitch=+0Hz", "--volume=+0%",
    "--text", "سلام، این یک آزمون است.",
    "--write-media", "/tmp/voice 01.mp3", "--no-progress"
  ]);
  assert.throws(() => buildEdgeTtsArgs({ text: "x", outputPath: "x.mp3", language: "fa", env: { MOTION_STUDIO_EDGE_VOICE: "malicious;voice" } }), /voice identifier/i);
  assert.throws(() => buildEdgeTtsArgs({ text: "x", outputPath: "x.mp3", language: "fa", env: { MOTION_STUDIO_EDGE_RATE: "+250%" } }), /rate/i);
  assert.throws(() => buildEdgeTtsArgs({ text: "x", outputPath: "x.mp3", language: "fa", env: { MOTION_STUDIO_EDGE_PITCH: "+500Hz" } }), /pitch/i);
});

test("short narrated renders extend the final scene to the requested runtime without slowing voice", () => {
  const scenes = [
    { id: "scene-1", durationInFrames: 500, audioDurationInFrames: 467 },
    { id: "outro", durationInFrames: 1100, audioDurationInFrames: 1067 }
  ];
  const result = extendFinalSceneToTarget(scenes, 1800);
  assert.equal(result.totalFrames, 1800);
  assert.equal(result.addedFrames, 200);
  assert.equal(result.scenes[1].durationInFrames, 1300);
  assert.equal(result.scenes[1].audioDurationInFrames, 1067);
  assert.equal(result.scenes[1].outroHoldFrames, 200);
  assert.equal(scenes[1].durationInFrames, 1100, "The helper must not mutate the caller's storyboard.");
});

test("runtime helper never trims narration when spoken scenes exceed the target", () => {
  const scenes = [
    { id: "scene-1", durationInFrames: 1200, audioDurationInFrames: 1167 },
    { id: "outro", durationInFrames: 700, audioDurationInFrames: 667 }
  ];
  const result = extendFinalSceneToTarget(scenes, 1800);
  assert.equal(result.totalFrames, 1900);
  assert.equal(result.addedFrames, 0);
  assert.equal(result.scenes[1].durationInFrames, 700);
});

test("CLI exposes the optional neural edge voice without changing private local auto mode", () => {
  assert.equal(parseArgs([], {}).voice, "auto");
  assert.equal(parseArgs(["--voice", "edge-tts"], {}).voice, "edge-tts");
  assert.throws(() => parseArgs(["--voice", "unknown-engine"], {}), /Voice must be/);
});


test("music mix profiles make narration priority explicit and preserve smooth ducking", async () => {
  const { resolveAudioMixProfile, getMusicBedGain } = await import("../src/production/audio-mix.mjs");
  const ranges = [{ startFrame: 300, endFrame: 600 }];
  const voiceForward = resolveAudioMixProfile("voice-forward");
  const cinematic = resolveAudioMixProfile("cinematic");
  const energetic = resolveAudioMixProfile("energetic");
  assert.ok(voiceForward.musicWithVoice < cinematic.musicWithVoice);
  assert.ok(energetic.musicWithVoice > cinematic.musicWithVoice);
  assert.ok(getMusicBedGain(350, 900, 30, ranges, "voice-forward") < getMusicBedGain(350, 900, 30, ranges, "cinematic"));
  assert.ok(getMusicBedGain(350, 900, 30, ranges, "energetic") > getMusicBedGain(350, 900, 30, ranges, "cinematic"));
  assert.throws(() => resolveAudioMixProfile("unbounded"), /Unknown audio mix profile/);
  assert.equal(parseArgs(["--audio-mix-profile", "voice-forward"], {}).audioMixProfile, "voice-forward");
  assert.throws(() => parseArgs(["--audio-mix-profile", "unbounded"], {}), /Unknown audio mix profile/);
});
