const clamp01 = (n) => Math.max(0, Math.min(1, Number.isFinite(n) ? n : 0));
const smoothstep = (n) => {
  const x = clamp01(n);
  return x * x * (3 - 2 * x);
};

const AUDIO_MIX_PROFILES = Object.freeze({
  "voice-forward": Object.freeze({
    musicWithVoice: 0.12,
    musicWithoutVoice: 0.25,
    duckDepth: 0.84,
    leadSeconds: 0.3,
    tailSeconds: 0.38
  }),
  cinematic: Object.freeze({
    musicWithVoice: 0.17,
    musicWithoutVoice: 0.29,
    duckDepth: 0.74,
    leadSeconds: 0.24,
    tailSeconds: 0.3
  }),
  energetic: Object.freeze({
    musicWithVoice: 0.21,
    musicWithoutVoice: 0.34,
    duckDepth: 0.65,
    leadSeconds: 0.18,
    tailSeconds: 0.24
  })
});

export const AUDIO_MIX_PROFILE_IDS = Object.freeze(Object.keys(AUDIO_MIX_PROFILES));

export function resolveAudioMixProfile(profile = "cinematic") {
  const id = String(profile || "cinematic").toLowerCase();
  const settings = AUDIO_MIX_PROFILES[id];
  if (!settings) {
    throw new RangeError("Unknown audio mix profile: " + id + ". Choose " + AUDIO_MIX_PROFILE_IDS.join(", ") + ".");
  }
  return Object.freeze({ id, ...settings });
}

export function getVoiceFadeEnvelope(frame, durationFrames, fps = 30, fadeSeconds = 0.12) {
  const duration = Math.max(1, Math.floor(Number(durationFrames) || 1));
  const position = Math.max(0, Math.min(duration - 1, Number(frame) || 0));
  const rate = Math.max(1, Number(fps) || 30);
  const fadeFrames = Math.max(1, Math.min(Math.round(rate * Math.max(0.02, fadeSeconds)), Math.floor(duration / 3) || 1));
  const fadeIn = smoothstep(position / fadeFrames);
  const fadeOut = smoothstep((duration - 1 - position) / fadeFrames);
  return Math.min(fadeIn, fadeOut);
}

export function getMusicBedGain(frame, totalFrames, fps = 30, voiceRanges = [], profile = "cinematic") {
  const settings = resolveAudioMixProfile(profile);
  const total = Math.max(1, Math.floor(Number(totalFrames) || 1));
  const position = Math.max(0, Math.min(total, Number(frame) || 0));
  const rate = Math.max(1, Number(fps) || 30);
  const hasVoice = Array.isArray(voiceRanges) && voiceRanges.length > 0;
  const baseLevel = hasVoice ? settings.musicWithVoice : settings.musicWithoutVoice;
  const fadeIn = smoothstep(position / (rate * 1.8));
  const fadeOut = smoothstep((total - position) / (rate * 2.6));
  let duck = 0;
  const lead = Math.max(3, rate * settings.leadSeconds);
  const tail = Math.max(4, rate * settings.tailSeconds);

  for (const range of voiceRanges || []) {
    const start = Number(range?.startFrame);
    const end = Number(range?.endFrame);
    if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start) continue;
    const attack = smoothstep((position - (start - lead)) / lead);
    const release = 1 - smoothstep((position - end) / tail);
    duck = Math.max(duck, Math.min(attack, release));
  }

  return clamp01(fadeIn * fadeOut * baseLevel * (1 - settings.duckDepth * duck));
}
