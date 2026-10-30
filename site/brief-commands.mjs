const SUPPORTED_LANGUAGES = new Set(["fa", "en", "de", "es", "fr", "it", "pt", "nl"]);
const SUPPORTED_STYLES = new Set([
  "auto",
  "cinematic-documentary",
  "scientific-2-5d",
  "data-journalism",
  "editorial-kinetic-type",
  "premium-3d-product",
  "tactile-collage",
  "swiss-modernist",
  "procedural-generative",
  "vertical-social"
]);
const SUPPORTED_RATIOS = new Set(["16:9", "9:16", "1:1"]);
const SUPPORTED_VOICES = new Set(["edge-tts", "auto", "off"]);
const SUPPORTED_MUSIC_ENGINES = new Set(["procedural", "auto", "ace-step"]);
const SUPPORTED_RENDER_QUALITIES = new Set(["balanced", "high", "master"]);
const SUPPORTED_RESOLUTIONS = new Set(["1080p", "1440p", "4k"]);
const SUPPORTED_CAPTION_STYLES = new Set(["cinematic", "broadcast", "minimal"]);
const DEFAULT_PROMPT_RECIPE = "cinematic-science-cutaway";


function validateBrief(brief) {
  if (!brief || typeof brief !== "object") throw new TypeError("A video brief is required.");
  const topic = String(brief.topic ?? "").trim();
  if (topic.length < 8 || topic.length > 1200) {
    throw new RangeError("Topic must contain between 8 and 1,200 characters.");
  }
  if (!SUPPORTED_LANGUAGES.has(brief.language)) throw new RangeError("Unsupported video language.");
  if (!Number.isInteger(Number(brief.durationSeconds)) || Number(brief.durationSeconds) < 5 || Number(brief.durationSeconds) > 600) {
    throw new RangeError("Duration must be an integer between 5 and 600 seconds.");
  }
  if (!SUPPORTED_STYLES.has(brief.style)) throw new RangeError("Unsupported visual style.");
  if (!SUPPORTED_RATIOS.has(brief.aspectRatio)) throw new RangeError("Unsupported aspect ratio.");
  if (!SUPPORTED_VOICES.has(brief.voice)) throw new RangeError("Unsupported narration engine.");
  const reference = String(brief.opus55Reference ?? "").trim();
  if (reference && !/^[a-z0-9][a-z0-9-]{1,100}$/.test(reference)) {
    throw new RangeError("Opus 5.5 reference must be a lowercase slug.");
  }
  if (brief.allowPaidAi !== undefined && typeof brief.allowPaidAi !== "boolean") {
    throw new TypeError("allowPaidAi must be a boolean.");
  }
  const musicEngine = brief.musicEngine ?? "procedural";
  if (!SUPPORTED_MUSIC_ENGINES.has(musicEngine)) throw new RangeError("Unsupported music engine.");
  const renderQuality = brief.renderQuality ?? "high";
  if (!SUPPORTED_RENDER_QUALITIES.has(renderQuality)) throw new RangeError("Unsupported render quality.");
  const resolution = brief.resolution ?? "1080p";
  if (!SUPPORTED_RESOLUTIONS.has(resolution)) throw new RangeError("Unsupported output resolution.");
  const captionStyle = brief.captionStyle ?? "cinematic";
  if (!SUPPORTED_CAPTION_STYLES.has(captionStyle)) throw new RangeError("Unsupported caption style.");
  const promptRecipe = brief.promptRecipe ?? DEFAULT_PROMPT_RECIPE;
  if (typeof promptRecipe !== "string" || !/^[a-z0-9][a-z0-9-]{1,119}$/.test(promptRecipe)) {
    throw new RangeError("Prompt recipe must be a lowercase library slug.");
  }
  if (brief.planOnly !== undefined && typeof brief.planOnly !== "boolean") {
    throw new TypeError("planOnly must be a boolean.");
  }
  return {
    topic,
    language: brief.language,
    durationSeconds: Number(brief.durationSeconds),
    style: brief.style,
    aspectRatio: brief.aspectRatio,
    voice: brief.voice,
    musicEngine,
    renderQuality,
    resolution,
    captionStyle,
    promptRecipe,
    planOnly: brief.planOnly === true,
    ...(reference ? { opus55Reference: reference } : {}),
    allowPaidAi: brief.allowPaidAi === true
  };
}

export function shellQuote(value) {
  return "'" + String(value).replace(/'/g, "'\\''") + "'";
}

export function buildLocalCliCommand(inputBrief) {
  const brief = validateBrief(inputBrief);
  const args = [
    "npm run produce -- --topic", shellQuote(brief.topic),
    "--language", brief.language,
    "--duration", String(brief.durationSeconds),
    "--style", brief.style,
    "--aspect-ratio", brief.aspectRatio,
    "--voice", brief.voice,
    "--music-engine", brief.musicEngine,
    "--render-quality", brief.renderQuality,
    "--resolution", brief.resolution,
    "--caption-style", brief.captionStyle,
    "--prompt-recipe", brief.promptRecipe
  ];
  if (brief.opus55Reference) args.push("--opus55-reference", shellQuote(brief.opus55Reference));
  if (brief.planOnly) args.push("--plan-only");
  if (brief.allowPaidAi) args.push("--allow-paid-ai");
  return args.join(" ");
}

export function buildWorkflowDispatchCommand(inputBrief) {
  const brief = validateBrief(inputBrief);
  const fields = [
    ["topic", brief.topic],
    ["language", brief.language],
    ["duration", String(brief.durationSeconds)],
    ["style", brief.style],
    ["aspect_ratio", brief.aspectRatio],
    ["voice", brief.voice],
    ["music_engine", brief.musicEngine],
    ["render_quality", brief.renderQuality],
    ["resolution", brief.resolution],
    ["caption_style", brief.captionStyle],
    ["prompt_recipe", brief.promptRecipe],
    ["plan_only", String(brief.planOnly)],
    ...(brief.opus55Reference ? [["opus55_reference", brief.opus55Reference]] : []),
    ["use_ai", String(brief.allowPaidAi)]
  ];
  return [
    "gh workflow run motion-studio-produce.yml",
    "--repo studio1111/AI-Motion-Graphics-Studio",
    "--ref main",
    ...fields.map(([key, value]) => "-f " + shellQuote(key + "=" + value))
  ].join(" ");
}
