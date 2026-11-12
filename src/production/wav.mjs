/** Strict WAV duration parser for Sokhan's mono 24 kHz PCM16 narration assets. */
export function wavDuration(buffer) {
  if (!Buffer.isBuffer(buffer) || buffer.length < 44 ||
      buffer.toString("ascii", 0, 4) !== "RIFF" ||
      buffer.toString("ascii", 8, 12) !== "WAVE") return null;

  const riffEnd = buffer.readUInt32LE(4) + 8;
  if (riffEnd < 44 || riffEnd > buffer.length) return null;

  let format = null;
  let dataSize = null;
  for (let offset = 12; offset + 8 <= riffEnd;) {
    const chunk = buffer.toString("ascii", offset, offset + 4);
    const size = buffer.readUInt32LE(offset + 4);
    const payload = offset + 8;
    const chunkEnd = payload + size;
    if (chunkEnd > riffEnd || chunkEnd > buffer.length) return null;

    if (chunk === "fmt ") {
      if (size < 16) return null;
      format = {
        encoding: buffer.readUInt16LE(payload),
        channels: buffer.readUInt16LE(payload + 2),
        sampleRate: buffer.readUInt32LE(payload + 4),
        byteRate: buffer.readUInt32LE(payload + 8),
        blockAlign: buffer.readUInt16LE(payload + 12),
        bitsPerSample: buffer.readUInt16LE(payload + 14)
      };
    } else if (chunk === "data") {
      dataSize = size;
    }

    offset = chunkEnd + (size % 2);
    if (offset > riffEnd) return null;
  }

  if (!format || dataSize === null ||
      format.encoding !== 1 ||
      format.channels !== 1 ||
      format.sampleRate !== 24000 ||
      format.byteRate !== 48000 ||
      format.blockAlign !== 2 ||
      format.bitsPerSample !== 16 ||
      dataSize <= 0 ||
      dataSize % format.blockAlign !== 0) return null;

  return dataSize / format.byteRate;
}
