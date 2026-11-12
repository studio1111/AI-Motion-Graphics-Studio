import test from "node:test";
import assert from "node:assert/strict";
import { getCameraMotion, resolveMotionProfile } from "../src/production/motion-profiles.mjs";
import { resolveRenderSettings } from "../src/production/render-quality.mjs";
import { parseArgs, produce } from "../scripts/produce.mjs";
import { mkdtemp, rm } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";

test("turbo motion profile creates a stronger but bounded camera move", () => {
  const cinematic = getCameraMotion("cinematic-documentary", 30, 120, 0, "cinematic");
  const turbo = getCameraMotion("cinematic-documentary", 30, 120, 0, "turbo");
  assert.ok(Math.abs(turbo.translateX) > Math.abs(cinematic.translateX));
  assert.ok(Math.abs(turbo.translateY) > Math.abs(cinematic.translateY));
  assert.ok(turbo.scale > cinematic.scale);
  assert.ok(Math.abs(turbo.rotate) <= 2);
  assert.ok(turbo.sweepX >= -40 && turbo.sweepX <= 180);
  assert.equal(turbo.profile, "turbo");
});

test("motion profile selection is strict and defaults to cinematic", () => {
  assert.equal(resolveMotionProfile().id, "cinematic");
  assert.equal(resolveMotionProfile("turbo").id, "turbo");
  assert.throws(() => resolveMotionProfile("unbounded"), /Unknown motion profile/);
});

test("turbo render preset uses a fast encoder while retaining an explicit quality target", () => {
  const turbo = resolveRenderSettings({ quality: "turbo" });
  assert.equal(turbo.x264Preset, "veryfast");
  assert.equal(turbo.crf, 19);
  assert.equal(turbo.quality, "turbo");
  assert.throws(() => resolveRenderSettings({ quality: "unknown" }), /Unknown render quality/);
});

test("CLI and plan manifest preserve turbo motion and render profile choices", async () => {
  const options = parseArgs([
    "--topic", "A turbo motion profile regression test",
    "--language", "en",
    "--duration", "30",
    "--style", "cinematic-documentary",
    "--aspect-ratio", "16:9",
    "--voice", "off",
    "--music-engine", "procedural",
    "--render-quality", "turbo",
    "--motion-profile", "turbo",
    "--plan-only",
    "--no-research",
    "--output-dir", await mkdtemp(join(tmpdir(), "motion-turbo-"))
  ], {});
  assert.equal(options.renderQuality, "turbo");
  assert.equal(options.motionProfile, "turbo");
  const result = await produce(options, {});
  assert.equal(result.props.motionProfile, "turbo");
  assert.equal(result.manifest.render.quality, "turbo");
  assert.equal(result.manifest.render.motionProfile, "turbo");
  assert.equal(result.manifest.brief.motionProfile, "turbo");
  await rm(result.runDir, { recursive: true, force: true });
});
