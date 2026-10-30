const QUALITY_PROFILES = Object.freeze({
  balanced: Object.freeze({ crf: 20, x264Preset: "fast", description: "Fast, compact review and everyday publishing." }),
  high: Object.freeze({ crf: 17, x264Preset: "slow", description: "High-quality creator delivery with a slower encode." }),
  master: Object.freeze({ crf: 15, x264Preset: "slower", description: "High-detail master encode; larger files and longer render time." })
});

const RESOLUTION_PROFILES = Object.freeze({
  "1080p": Object.freeze({ scale: 1, label: "Full HD" }),
  "1440p": Object.freeze({ scale: 4 / 3, label: "QHD" }),
  "4k": Object.freeze({ scale: 2, label: "4K UHD" })
});

const BASE_DIMENSIONS = Object.freeze({
  "16:9": Object.freeze({ width: 1920, height: 1080 }),
  "9:16": Object.freeze({ width: 1080, height: 1920 }),
  "1:1": Object.freeze({ width: 1080, height: 1080 })
});

export const RENDER_QUALITY_IDS = Object.freeze(Object.keys(QUALITY_PROFILES));
export const OUTPUT_RESOLUTION_IDS = Object.freeze(Object.keys(RESOLUTION_PROFILES));

export function resolveRenderSettings({
  quality = "high",
  resolution = "1080p",
  aspectRatio = "16:9"
} = {}) {
  const selectedQuality = String(quality || "high").toLowerCase();
  const selectedResolution = String(resolution || "1080p").toLowerCase();
  const selectedRatio = String(aspectRatio || "16:9").trim().replace(/\s+/g, "");

  const qualityProfile = QUALITY_PROFILES[selectedQuality];
  if (!qualityProfile) {
    throw new RangeError("Unknown render quality: " + selectedQuality + ". Choose " + RENDER_QUALITY_IDS.join(", ") + ".");
  }

  const resolutionProfile = RESOLUTION_PROFILES[selectedResolution];
  if (!resolutionProfile) {
    throw new RangeError("Unknown output resolution: " + selectedResolution + ". Choose " + OUTPUT_RESOLUTION_IDS.join(", ") + ".");
  }

  const base = BASE_DIMENSIONS[selectedRatio];
  if (!base) {
    throw new RangeError("Unsupported aspect ratio for render settings: " + selectedRatio + ".");
  }

  const { scale } = resolutionProfile;
  return Object.freeze({
    quality: selectedQuality,
    qualityDescription: qualityProfile.description,
    resolution: selectedResolution,
    resolutionLabel: resolutionProfile.label,
    aspectRatio: selectedRatio,
    codec: "h264",
    crf: qualityProfile.crf,
    x264Preset: qualityProfile.x264Preset,
    scale,
    baseWidth: base.width,
    baseHeight: base.height,
    width: Math.round(base.width * scale),
    height: Math.round(base.height * scale)
  });
}
