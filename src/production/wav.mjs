function parsePcmWav(buffer) {
  if (!Buffer.isBuffer(buffer) || buffer.length < 44 ||
      buffer.toString("ascii", 0, 4) !== "RIFF" ||
      buffer.toString("ascii", 8, 12) !== "WAVE") return null;

  const riffEnd = buffer.readUInt32LE(4) + 8;
  if (riffEnd < 44 || riffEnd > buffer.length) return null;

  let format = null;
  let data = null;
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
      data = { offset: payload, size };
    }

    offset = chunkEnd + (size % 2);
    if (offset > riffEnd) return null;
  }

  if (!format || !data ||
      format.encoding !== 1 ||
      !Number.isInteger(format.channels) || format.channels < 1 || format.channels > 8 ||
      !Number.isInteger(format.sampleRate) || format.sampleRate < 8000 || format.sampleRate > 384000 ||
      ![8, 16, 24, 32].includes(format.bitsPerSample)) return null;

  const expectedBlockAlign = format.channels * (format.bitsPerSample / 8);
  const expectedByteRate = format.sampleRate * expectedBlockAlign;
  if (format.blockAlign !== expectedBlockAlign ||
      format.byteRate !== expectedByteRate ||
      data.size <= 0 ||
      data.size % format.blockAlign !== 0) return null;

  return {
    ...format,
    dataOffset: data.offset,
    dataSize: data.size,
    durationSeconds: data.size / format.byteRate
  };
}

export function wavDuration(buffer) {
  return parsePcmWav(buffer)?.durationSeconds ?? null;
}

/** Inspects the exact mono 24 kHz PCM16 format used by Sokhan narration. */
export function inspectPcmWav(buffer) {
  const wav = parsePcmWav(buffer);
  if (!wav || wav.channels !== 1 || wav.sampleRate !== 24000 || wav.bitsPerSample !== 16) return null;

  const sampleCount = wav.dataSize / 2;
  let sumSquares = 0;
  let peak = 0;
  let clippedSamples = 0;
  for (let index = 0, offset = wav.dataOffset; index < sampleCount; index++, offset += 2) {
    const sample = buffer.readInt16LE(offset);
    const absolute = Math.abs(sample);
    peak = Math.max(peak, absolute);
    if (absolute >= 32760) clippedSamples++;
    const normalized = sample / 32768;
    sumSquares += normalized * normalized;
  }

  const rmsAmplitude = Math.sqrt(sumSquares / sampleCount);
  const peakAmplitude = peak / 32768;
  const clippingRatio = clippedSamples / sampleCount;
  return {
    durationSeconds: wav.durationSeconds,
    sampleRate: wav.sampleRate,
    channels: wav.channels,
    bitsPerSample: wav.bitsPerSample,
    peakAmplitude,
    rmsAmplitude,
    clippedSamples,
    clippingRatio,
    isSilent: rmsAmplitude < 0.0001,
    isClipped: clippingRatio > 0.001
  };
}
