const CAPTION_STYLES = Object.freeze({
  cinematic: Object.freeze({
    label: "Cinematic",
    backgroundAlpha: 0.9,
    borderAlpha: 0.16,
    borderWidth: 1,
    borderRadius: 5,
    horizontalFontSize: 24,
    verticalFontSize: 22,
    fontWeight: 600,
    horizontalPadding: "12px 22px",
    verticalPadding: "10px 16px",
    textShadow: "none"
  }),
  broadcast: Object.freeze({
    label: "Broadcast",
    backgroundAlpha: 0.97,
    borderAlpha: 0.34,
    borderWidth: 2,
    borderRadius: 10,
    horizontalFontSize: 30,
    verticalFontSize: 28,
    fontWeight: 800,
    horizontalPadding: "16px 28px",
    verticalPadding: "14px 20px",
    textShadow: "0 1px 2px rgba(0,0,0,0.72)"
  }),
  minimal: Object.freeze({
    label: "Minimal",
    backgroundAlpha: 0.48,
    borderAlpha: 0,
    borderWidth: 0,
    borderRadius: 2,
    horizontalFontSize: 27,
    verticalFontSize: 25,
    fontWeight: 700,
    horizontalPadding: "8px 14px",
    verticalPadding: "8px 12px",
    textShadow: "0 2px 8px rgba(0,0,0,0.96)"
  })
});

export const CAPTION_STYLE_IDS = Object.freeze(Object.keys(CAPTION_STYLES));

export function resolveCaptionStyle(style = "cinematic") {
  const id = String(style || "cinematic").toLowerCase();
  const preset = CAPTION_STYLES[id];
  if (!preset) {
    throw new RangeError("Unknown caption style: " + id + ". Choose " + CAPTION_STYLE_IDS.join(", ") + ".");
  }
  return Object.freeze({ id, ...preset });
}
