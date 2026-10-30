import test from "node:test";
import assert from "node:assert/strict";
import { resolveRenderSettings } from "../src/production/render-quality.mjs";
import { resolveCaptionStyle } from "../src/production/caption-styles.mjs";
import { parseArgs, produce } from "../scripts/produce.mjs";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";

test("render quality profiles trade encoding time and bitrate predictably", () => {
  assert.deepEqual(
    ["balanced", "high", "master"].map((quality) => {
      const { crf, x264Preset } = resolveRenderSettings({ quality });
      return { crf, x264Preset };
    }),
    [
      { crf: 20, x264Preset: "fast" },
      { crf: 17, x264Preset: "slow" },
      { crf: 15, x264Preset: "slower" }
    ]
  );
  assert.throws(() => resolveRenderSettings({ quality: "lossless-magic" }), /Unknown render quality/);
});

test("output resolutions preserve each aspect ratio and produce deterministic dimensions", () => {
  assert.equal(resolveRenderSettings({ aspectRatio: "16 : 9" }).aspectRatio, "16:9");
  assert.deepEqual(
    ["1080p", "1440p", "4k"].map((resolution) => {
      const { width, height, scale } = resolveRenderSettings({ resolution, aspectRatio: "16:9" });
      return { width, height, scale };
    }),
    [
      { width: 1920, height: 1080, scale: 1 },
      { width: 2560, height: 1440, scale: 4 / 3 },
      { width: 3840, height: 2160, scale: 2 }
    ]
  );
  assert.deepEqual(
    resolveRenderSettings({ resolution: "4k", aspectRatio: "9:16" }).width,
    2160
  );
  assert.deepEqual(
    resolveRenderSettings({ resolution: "4k", aspectRatio: "9:16" }).height,
    3840
  );
  assert.throws(() => resolveRenderSettings({ resolution: "8k" }), /Unknown output resolution/);
});

test("caption themes expose readable, distinct contrast and sizing settings", () => {
  const cinematic = resolveCaptionStyle("cinematic");
  const broadcast = resolveCaptionStyle("broadcast");
  const minimal = resolveCaptionStyle("minimal");
  assert.ok(broadcast.backgroundAlpha > cinematic.backgroundAlpha);
  assert.ok(broadcast.fontWeight >= cinematic.fontWeight);
  assert.ok(minimal.backgroundAlpha < cinematic.backgroundAlpha);
  assert.ok(broadcast.verticalFontSize > 0 && broadcast.horizontalFontSize > 0);
  assert.throws(() => resolveCaptionStyle("neon-chaos"), /Unknown caption style/);
});

test("CLI validates and normalizes production quality, resolution and caption settings", () => {
  const options = parseArgs([
    "--render-quality", "master",
    "--resolution", "4k",
    "--caption-style", "broadcast"
  ], {});
  assert.equal(options.renderQuality, "master");
  assert.equal(options.resolution, "4k");
  assert.equal(options.captionStyle, "broadcast");
  assert.throws(() => parseArgs(["--render-quality", "invalid"], {}), /Unknown render quality/);
  assert.throws(() => parseArgs(["--resolution", "8k"], {}), /Unknown output resolution/);
  assert.throws(() => parseArgs(["--caption-style", "invalid"], {}), /Unknown caption style/);
});

test("plan-only manifests retain the exact selected output and caption profiles", async () => {
  const tempRoot = await mkdtemp(join(tmpdir(), "motion-render-profile-"));
  try {
    const options = parseArgs([
      "--topic", "A production profile regression test",
      "--language", "en",
      "--duration", "30",
      "--style", "scientific-2-5d",
      "--aspect-ratio", "16:9",
      "--voice", "off",
      "--music-engine", "procedural",
      "--render-quality", "master",
      "--resolution", "4k",
      "--caption-style", "broadcast",
      "--audio-mix-profile", "voice-forward",
      "--plan-only",
      "--no-research",
      "--output-dir", tempRoot
    ], {});
    const result = await produce(options, {});
    assert.equal(result.manifest.render.quality, "master");
    assert.equal(result.manifest.render.resolution, "4k");
    assert.equal(result.manifest.render.width, 3840);
    assert.equal(result.manifest.render.height, 2160);
    assert.equal(result.props.captionStyle, "broadcast");
    assert.equal(result.props.audioMixProfile, "voice-forward");
    assert.equal(result.manifest.render.audioMixProfile, "voice-forward");
    const brief = JSON.parse(await readFile(join(result.runDir, "brief.json"), "utf8"));
    assert.equal(brief.renderQuality, "master");
    assert.equal(brief.resolution, "4k");
    assert.equal(brief.captionStyle, "broadcast");
    assert.equal(brief.audioMixProfile, "voice-forward");
  } finally {
    await rm(tempRoot, { recursive: true, force: true });
  }
});
