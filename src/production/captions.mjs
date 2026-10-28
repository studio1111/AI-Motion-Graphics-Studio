export function splitCaptionSegments(text, maxChars = 44) {
  const limit = Math.max(1, Math.floor(Number(maxChars) || 44));
  const words = String(text || "").trim().split(/\s+/).filter(Boolean).flatMap((word) => {
    const chars = Array.from(word);
    if (chars.length <= limit) return [word];
    const chunks = [];
    for (let index = 0; index < chars.length; index += limit) {
      chunks.push(chars.slice(index, index + limit).join(""));
    }
    return chunks;
  });
  if (!words.length) return [];
  const lines = [];
  let line = "";
  for (const word of words) {
    const next = line ? line + " " + word : word;
    if (line && Array.from(next).length > limit) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  }
  if (line) lines.push(line);
  const segments = [];
  for (let index = 0; index < lines.length; index += 2) {
    segments.push([lines[index], lines[index + 1]].filter(Boolean).join("\n"));
  }
  return segments;
}
