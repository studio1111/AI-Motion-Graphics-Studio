export function buildNarrationEnhancementFilter() {
  return [
    "highpass=f=70:p=2",
    "equalizer=f=180:t=q:w=1:g=-1.0",
    "equalizer=f=3200:t=q:w=1:g=1.0",
    "acompressor=threshold=0.11:ratio=2.0:attack=12:release=130:makeup=1.2",
    "loudnorm=I=-20:TP=-3:LRA=7:print_format=summary",
    "alimiter=limit=0.92"
  ].join(",");
}

export function getEnhancedNarrationPath(inputPath) {
  const source = String(inputPath || "");
  if (!/\.(?:wav|mp3)$/i.test(source)) {
    throw new TypeError("Narration enhancement requires a WAV or MP3 file path.");
  }
  return source.replace(/\.(?:wav|mp3)$/i, ".enhanced.wav");
}

export const EDGE_TTS_VOICE_BY_LANGUAGE = Object.freeze({
  fa: "fa-IR-FaridNeural",
  en: "en-US-GuyNeural",
  de: "de-DE-ConradNeural",
  es: "es-ES-AlvaroNeural",
  fr: "fr-FR-HenriNeural",
  it: "it-IT-DiegoNeural",
  pt: "pt-PT-DuarteNeural",
  nl: "nl-NL-MaartenNeural"
});

function boundedSignedValue(value, { label, suffix, minimum, maximum }) {
  const raw = String(value ?? "").trim();
  const pattern = suffix === "%"
    ? /^([+-])(\d{1,3})%$/
    : /^([+-])(\d{1,3})Hz$/;
  const match = raw.match(pattern);
  if (!match) throw new TypeError("Edge TTS " + label + " must be a signed integer followed by " + suffix + ".");
  const magnitude = Number(match[2]);
  const number = match[1] === "-" ? -magnitude : magnitude;
  if (!Number.isInteger(number) || number < minimum || number > maximum) {
    throw new RangeError("Edge TTS " + label + " must be between " + minimum + suffix + " and +" + maximum + suffix + ".");
  }
  return match[1] + magnitude + suffix;
}

/**
 * Build an argv array, never shell text, for the optional Microsoft Edge online neural voice.
 * Text is sent to the online service only when the caller explicitly selects edge-tts.
 */
export function buildEdgeTtsArgs({ text, outputPath, language = "fa", env = process.env } = {}) {
  if (!String(text ?? "").trim()) throw new TypeError("Edge TTS narration text must not be empty.");
  if (!String(outputPath ?? "").trim() || !/\.mp3$/i.test(String(outputPath))) {
    throw new TypeError("Edge TTS output must be an MP3 file path.");
  }
  const locale = String(language || "fa").toLowerCase().split("-")[0];
  const voice = String(env.MOTION_STUDIO_EDGE_VOICE || EDGE_TTS_VOICE_BY_LANGUAGE[locale] || "").trim();
  if (!/^[a-z]{2,3}-[A-Z]{2,4}-[A-Za-z0-9]+Neural$/.test(voice)) {
    throw new TypeError("Edge TTS voice identifier is invalid or unavailable for language " + locale + ".");
  }
  const rate = boundedSignedValue(env.MOTION_STUDIO_EDGE_RATE ?? "-6%", { label: "rate", suffix: "%", minimum: -50, maximum: 100 });
  const pitch = boundedSignedValue(env.MOTION_STUDIO_EDGE_PITCH ?? "+0Hz", { label: "pitch", suffix: "Hz", minimum: -50, maximum: 50 });
  const volume = boundedSignedValue(env.MOTION_STUDIO_EDGE_VOLUME ?? "+0%", { label: "volume", suffix: "%", minimum: -100, maximum: 100 });
  return [
    "--voice", voice,
    "--rate=" + rate,
    "--pitch=" + pitch,
    "--volume=" + volume,
    "--text", String(text),
    "--write-media", String(outputPath),
    "--no-progress"
  ];
}
