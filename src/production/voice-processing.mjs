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
