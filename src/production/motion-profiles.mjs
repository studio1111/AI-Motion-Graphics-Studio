const STYLE_INTENSITY = Object.freeze({
  "cinematic-documentary": 1.15,
  "editorial-kinetic-type": 0.45,
  "data-journalism": 0.5,
  "scientific-2-5d": 1,
  "tactile-collage": 0.75,
  "premium-3d-product": 1.2,
  "character-2d": 0.8,
  "swiss-modernist": 0.4,
  "procedural-generative": 1.1,
  "maps-timeline": 0.9,
  "vertical-social": 1.35,
  "hybrid-live-action": 1
});

const LIGHT_SWEEP_STYLES = new Set([
  "cinematic-documentary",
  "scientific-2-5d",
  "premium-3d-product",
  "procedural-generative",
  "hybrid-live-action"
]);

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const round = (value, digits = 3) => Number(value.toFixed(digits));

export function getCameraMotion(styleId, frame, durationInFrames, sceneIndex = 0) {
  const duration = Math.max(1, Math.floor(Number(durationInFrames) || 1));
  const current = clamp(Number(frame) || 0, 0, duration);
  const progress = current / duration;
  const intensity = STYLE_INTENSITY[styleId] || 0.8;
  const xDirection = sceneIndex % 2 === 0 ? 1 : -1;
  const yDirection = sceneIndex % 4 < 2 ? -1 : 1;

  return {
    translateX: round((progress - 0.5) * 28 * intensity * xDirection),
    translateY: round((progress - 0.5) * 16 * intensity * yDirection),
    scale: round(1 + 0.04 * intensity * (1 - progress), 4),
    sweepX: round(-22 + progress * 130, 2),
    lightSweep: LIGHT_SWEEP_STYLES.has(styleId)
  };
}
