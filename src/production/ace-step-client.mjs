const STYLE_DIRECTIONS = {
  "scientific-2-5d": "cinematic electronic score, glassy synth arpeggios, warm analog pads, restrained low percussion, spacious science-documentary atmosphere",
  "cinematic-documentary": "orchestral-electronic hybrid, evolving string pads, felt piano, restrained cinematic percussion, emotional but credible documentary tone",
  "premium-3d-product": "premium modern technology brand score, precise percussive pulses, polished synth layers, elegant low-end, spacious stereo",
  "data-journalism": "precise minimal electronic score, soft ticks, clean pulse, warm harmonic bed, analytical but engaging",
  "procedural-generative": "futuristic modular synth score, evolving textures, asymmetric pulses, airy high details, controlled cinematic build",
  "editorial-kinetic-type": "rhythmic editorial electronic score, tight transients, syncopated percussion, bold but uncluttered tonal motif"
};

const cleanTopic = (topic, language) => {
  const value = String(topic || "").trim();
  if (!value) return "a forward-looking science and technology story";
  if (/^(fa|prs)/i.test(String(language || "")) || /[\u0600-\u06ff]/.test(value)) {
    if (/هوش مصنوعی/.test(value)) return "the future of artificial intelligence, neural networks, human creativity, opportunity and responsibility";
    return "a Persian-language science and technology explainer about " + value;
  }
  return value;
};

export function validateAceStepBaseUrl(value) {
  let url;
  try { url = new URL(String(value || "")); }
  catch { throw new TypeError("ACESTEP_API_URL must be a valid HTTP(S) URL."); }
  if (!["http:", "https:"].includes(url.protocol) || url.username || url.password || url.search || url.hash) {
    throw new TypeError("ACESTEP_API_URL must use HTTP(S) without embedded credentials, query parameters, or fragments.");
  }
  return url.origin + url.pathname.replace(/\/+$/, "");
}

export function resolveMusicEngine(requested = "auto", apiUrl = "") {
  const engine = String(requested || "auto").trim().toLowerCase();
  if (!["auto", "procedural", "ace-step"].includes(engine)) {
    throw new TypeError("Music engine must be auto, procedural, or ace-step.");
  }
  if (apiUrl) validateAceStepBaseUrl(apiUrl);
  if (engine === "ace-step" && !apiUrl) {
    throw new Error("The ACE-Step music engine requires ACESTEP_API_URL for a running self-hosted open-source server.");
  }
  if (engine === "ace-step") return "ace-step";
  if (engine === "auto" && apiUrl) return "ace-step";
  return "procedural";
}

export function buildMusicPrompt({ topic, styleId = "cinematic-documentary", durationSeconds = 60, language = "en" } = {}) {
  const duration = Math.max(10, Math.min(600, Math.round(Number(durationSeconds) || 60)));
  const topicDescription = cleanTopic(topic, language);
  const direction = STYLE_DIRECTIONS[styleId] || STYLE_DIRECTIONS["cinematic-documentary"];
  const intro = Math.max(2, Math.round(duration * 0.1));
  const build = Math.max(intro + 1, Math.round(duration * 0.35));
  const climax = Math.max(build + 1, Math.round(duration * 0.78));
  return `Create an original ${duration}-second INSTRUMENTAL underscore for a premium ${language === "fa" ? "Persian-language" : language + "-language"} science/technology motion-graphics film about ${topicDescription}. Musical direction: ${direction}. Narrative arc: atmospheric cold-open during the first ${intro} seconds; introduce a memorable 3-5 note motif; add rhythmic motion and harmonic layers through ${build} seconds; reach a controlled emotional/cinematic lift near ${climax} seconds; resolve into a confident, spacious finale with a clean fadeable ending. Keep a consistent musical identity, clear low-end, detailed but restrained percussion, stereo depth and dynamic headroom for narration. Target professional documentary soundtrack, not a generic corporate loop. No vocals, no lyrics, no spoken words, no sound-alike of any named artist, no copyrighted melody, no abrupt cut-off.`;
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function requestJson(url, options, fetchImpl, label) {
  const response = await fetchImpl(url, { ...options, signal: options?.signal || AbortSignal.timeout(30_000) });
  const body = await response.json().catch(() => null);
  if (!response.ok) throw new Error("ACE-Step " + label + " failed with HTTP " + response.status + ".");
  if (!body || typeof body !== "object") throw new Error("ACE-Step " + label + " returned invalid JSON.");
  if (body.error) throw new Error("ACE-Step " + label + " error: " + String(body.error).slice(0, 300));
  return body;
}

function unwrapData(payload) {
  return payload?.data ?? payload;
}

export async function generateAceStepMusic({
  baseUrl, apiKey = "", topic, styleId, durationSeconds, language = "en",
  outputPath, fetchImpl = fetch, timeoutMs = 600_000, pollIntervalMs = 2500
} = {}) {
  if (!outputPath) throw new TypeError("An outputPath is required for generated music.");
  const root = validateAceStepBaseUrl(baseUrl);
  const headers = { "content-type": "application/json", ...(apiKey ? { authorization: "Bearer " + apiKey } : {}) };
  const prompt = buildMusicPrompt({ topic, styleId, durationSeconds, language });
  const request = await requestJson(root + "/release_task", {
    method: "POST",
    headers,
    body: JSON.stringify({
      task_type: "text2music", prompt, lyrics: "", thinking: true, audio_format: "wav",
      audio_duration: Math.max(10, Math.min(600, Math.round(Number(durationSeconds) || 60)))
    })
  }, fetchImpl, "task submission");
  const data = unwrapData(request);
  const taskId = data?.task_id || data?.taskId || data?.id;
  if (!taskId) throw new Error("ACE-Step did not return a task ID.");
  const deadline = Date.now() + timeoutMs;
  let item = null;

  while (Date.now() < deadline) {
    await sleep(Math.min(pollIntervalMs, Math.max(50, deadline - Date.now())));
    const statusPayload = await requestJson(root + "/query_result", {
      method: "POST", headers, body: JSON.stringify({ task_id_list: [String(taskId)] })
    }, fetchImpl, "status polling");
    const statusData = unwrapData(statusPayload);
    const rows = Array.isArray(statusData) ? statusData : Array.isArray(statusData?.data) ? statusData.data : [statusData];
    const row = rows.find((candidate) => String(candidate?.task_id || candidate?.taskId || taskId) === String(taskId)) || rows[0];
    if (!row) continue;
    const status = Number(row.status ?? row.task_status);
    if (status === 2 || row.error) throw new Error("ACE-Step music generation failed: " + String(row.error || row.message || "task status 2").slice(0, 300));
    if (status !== 1) continue;
    let results = row.result;
    if (typeof results === "string") {
      try { results = JSON.parse(results); } catch { throw new Error("ACE-Step succeeded but its result JSON was malformed."); }
    }
    item = Array.isArray(results) ? results[0] : results;
    if (item) break;
  }

  if (!item) throw new Error("ACE-Step music generation timed out before returning an audio file.");
  const fileRef = item.url || item.file || item.audio_url;
  if (!fileRef || typeof fileRef !== "string") throw new Error("ACE-Step completed without an audio-file reference.");

  let audioUrl;
  if (/^https?:\/\//i.test(fileRef)) {
    audioUrl = new URL(fileRef);
    if (audioUrl.origin !== new URL(root).origin) throw new Error("ACE-Step returned an audio URL on an unexpected origin.");
  } else if (fileRef.startsWith("/v1/audio")) {
    audioUrl = new URL(fileRef, root);
  } else {
    audioUrl = new URL("/v1/audio?path=" + encodeURIComponent(fileRef), root);
  }
  const download = await fetchImpl(audioUrl.toString(), {
    headers: apiKey ? { authorization: "Bearer " + apiKey } : {},
    signal: AbortSignal.timeout(120_000)
  });
  if (!download.ok) throw new Error("ACE-Step audio download failed with HTTP " + download.status + ".");
  const bytes = Buffer.from(await download.arrayBuffer());
  if (bytes.length < 4096) throw new Error("ACE-Step returned an empty or implausibly small audio file.");
  const { mkdir, writeFile } = await import("node:fs/promises");
  const { dirname } = await import("node:path");
  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, bytes);
  return {
    status: "generated",
    engine: "ACE-Step 1.5 REST API",
    taskId: String(taskId),
    prompt,
    sourceRef: fileRef.startsWith("http") ? new URL(fileRef).pathname : fileRef,
    outputPath,
    bytes: bytes.length,
    requestedDurationSeconds: Number(durationSeconds) || 60,
    generationMetadata: item.metas || item.metadata || null
  };
}
