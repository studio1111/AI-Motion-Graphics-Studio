const SUPPORTED_SOURCE = "en";
const SUPPORTED_TARGET = "fa";

export function validateSokhanTranslationDocument(document) {
  if (!document || typeof document !== "object" || Array.isArray(document)) {
    throw new TypeError("Sokhan translation document must be a JSON object.");
  }
  if (document.schemaVersion !== 1) {
    throw new TypeError("Unsupported Sokhan translation schema version; expected 1.");
  }
  if (document.sourceLanguage !== SUPPORTED_SOURCE || document.targetLanguage !== SUPPORTED_TARGET) {
    throw new TypeError("Sokhan v1 supports English-to-Persian translation only.");
  }
  if (!Array.isArray(document.segments) || document.segments.length === 0) {
    throw new TypeError("Sokhan translation document must contain at least one segment.");
  }

  const seen = new Set();
  const segments = document.segments.map((segment, index) => {
    if (!segment || typeof segment !== "object" || Array.isArray(segment)) {
      throw new TypeError("Translation segment " + index + " must be an object.");
    }
    const id = String(segment.id ?? "").trim();
    const sourceText = String(segment.sourceText ?? "").trim();
    const translation = String(segment.translation ?? "").trim();
    if (!id) throw new TypeError("Translation segment " + index + " requires a scene id.");
    if (seen.has(id)) throw new TypeError("Sokhan translation document contains a duplicate scene id: " + id);
    seen.add(id);
    if (!sourceText) throw new TypeError("Translation segment " + id + " requires non-empty English source text.");
    if (!translation) throw new TypeError("Translation segment " + id + " requires a non-empty Persian translation.");
    return { ...segment, id, sourceText, translation };
  });

  return { ...document, segments };
}

export function applySokhanTranslations(scenes, document) {
  if (!Array.isArray(scenes) || scenes.length === 0) {
    throw new TypeError("At least one storyboard scene is required for Sokhan translation.");
  }
  const validated = validateSokhanTranslationDocument(document);
  if (validated.reviewStatus !== "approved") {
    throw new Error("Sokhan translation requires reviewStatus=approved before production.");
  }
  const byId = new Map(validated.segments.map(segment => [segment.id, segment]));
  const narratedScenes = scenes.filter(scene => String(scene?.narration ?? "").trim());
  const sceneIds = new Set(narratedScenes.map(scene => String(scene.id ?? "")));
  const missing = narratedScenes.filter(scene => !byId.has(String(scene.id ?? "")));
  const unknown = validated.segments.filter(segment => !sceneIds.has(segment.id));
  if (missing.length) {
    throw new Error("Sokhan translation document is missing translation for scene(s): " + missing.map(scene => String(scene.id ?? "(no id)")).join(", "));
  }

  const stale = narratedScenes.filter(scene => {
    const segment = byId.get(String(scene.id ?? ""));
    return segment && String(scene.narration ?? "").trim() !== segment.sourceText;
  });
  if (stale.length) {
    throw new Error("Sokhan translation source text does not match current scene(s): " + stale.map(scene => String(scene.id)).join(", "));
  }

  return scenes.map(scene => {
    const segment = byId.get(String(scene?.id ?? ""));
    if (!segment) return { ...scene };
    return { ...scene, narration: segment.translation };
  });
}
