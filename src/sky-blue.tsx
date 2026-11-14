import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";

const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
const beats = [
  { start: 0, end: 10, kicker: "یک پرسش ساده", title: "چرا آسمان\nآبی است؟", sub: "داستانی کوتاه دربارهٔ سفر نور" },
  { start: 10, end: 25, kicker: "قدم اول · نور خورشید", title: "نور سفید،\nرنگ‌های بسیار", sub: "نور خورشید ترکیبی از طول‌موج‌های گوناگون است." },
  { start: 25, end: 40, kicker: "قدم دوم · برخورد با هوا", title: "آبی بیشتر\nپراکنده می‌شود", sub: "مولکول‌های هوا نور آبی را بیشتر از نور قرمز پراکنده می‌کنند." },
  { start: 40, end: 55, kicker: "از نگاه ما", title: "آبی از هر سو\nبه چشم می‌رسد", sub: "نور پراکنده‌شده از بخش‌های مختلف آسمان وارد چشم ما می‌شود." },
  { start: 55, end: 70, kicker: "غروب خورشید", title: "راه طولانی‌تر،\nرنگی گرم‌تر", sub: "نور در مسیر طولانی‌تر، بخش بیشتری از آبی را از مسیر مستقیم از دست می‌دهد." },
  { start: 70, end: 82, kicker: "هر غروب، متفاوت", title: "ابرها و هوا،\nرنگ را تغییر می‌دهند", sub: "ذرات هوا و ابرها هم در رنگ‌های غروب نقش دارند." },
  { start: 82, end: 90, kicker: "حالا می‌دانیم", title: "آسمان، داستانِ\nسفر نور است", sub: "یک جهان رنگارنگ، در برخورد نور با جو زمین." },
];

const palettes = [
  ["#07132d", "#0b5b9d", "#53d9ff"],
  ["#101b3d", "#235ed1", "#e8fbff"],
  ["#07152c", "#007fca", "#6fffe9"],
  ["#071c3e", "#126ee8", "#7bdfff"],
  ["#301746", "#f06b45", "#ffd56c"],
  ["#281b52", "#e35b8c", "#ffbf72"],
  ["#07132d", "#174f9e", "#7ee7ff"],
];

const mix = (a: number, b: number, t: number) => a + (b - a) * t;
const hexRgb = (hex: string) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
const blend = (a: string, b: string, t: number) => {
  const x = hexRgb(a); const y = hexRgb(b);
  return `rgb(${x.map((v, i) => Math.round(mix(v, y[i], t))).join(",")})`;
};

export const SkyBlueFilm: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const seconds = frame / fps;
  const beatIndex = Math.min(beats.length - 1, beats.findIndex((b) => seconds >= b.start && seconds < b.end) < 0 ? beats.length - 1 : beats.findIndex((b) => seconds >= b.start && seconds < b.end));
  const beat = beats[beatIndex];
  const local = (seconds - beat.start) / (beat.end - beat.start);
  const next = palettes[Math.min(beatIndex + 1, palettes.length - 1)];
  const current = palettes[beatIndex];
  const fade = interpolate(local, [0, 0.35, 1], [0, 1, 1], clamp);
  const enter = interpolate(local, [0, 0.2], [48, 0], clamp);
  const scale = interpolate(local, [0, 1], [0.9, 1.12], clamp);
  const outro = interpolate(frame, [durationInFrames - 18, durationInFrames], [1, 0], clamp);
  const colorA = blend(current[0], next[0], fade * 0.32);
  const colorB = blend(current[1], next[1], fade * 0.32);
  const accent = blend(current[2], next[2], fade * 0.32);
  const sunX = interpolate(seconds, [0, 25, 55, 72, 90], [1420, 1280, 1140, 960, 820], clamp);
  const sunY = interpolate(seconds, [0, 25, 55, 72, 90], [230, 300, 450, 640, 500], clamp);
  const sunGlow = interpolate(seconds, [0, 10, 25, 55, 70, 82, 90], [0.7, 1, 0.9, 0.7, 1.2, 0.95, 0.7], clamp);

  return (
    <AbsoluteFill style={{ overflow: "hidden", color: "#fffaf2", fontFamily: "Montserrat, 'Noto Sans Arabic', Arial, sans-serif", background: `radial-gradient(ellipse at 72% 32%, ${colorB} 0%, ${colorA} 48%, #040813 100%)`, opacity: outro }}>
      <AbsoluteFill style={{ background: "linear-gradient(105deg, rgba(2,7,18,.78) 0%, rgba(2,7,18,.3) 52%, rgba(2,7,18,.05) 100%)" }} />
      <div style={{ position: "absolute", inset: -100, opacity: 0.16, backgroundImage: "radial-gradient(rgba(255,255,255,.8) .7px, transparent .7px)", backgroundSize: "30px 30px", transform: `translate(${Math.sin(frame / 70) * 22}px, ${frame * 0.13}px)` }} />
      <div style={{ position: "absolute", left: sunX - 130, top: sunY - 130, width: 260, height: 260, borderRadius: "50%", background: `radial-gradient(circle, #fffef0 0%, ${accent} 28%, rgba(255,255,255,.02) 70%)`, boxShadow: `0 0 ${110 * sunGlow}px ${accent}`, transform: `scale(${interpolate(local, [0, .5, 1], [.7, 1.08, .92], clamp)})` }} />
      {Array.from({ length: 9 }, (_, i) => {
        const rotation = i * 20 + frame * (i % 2 ? -0.11 : 0.08);
        const width = 620 + i * 64;
        return <div key={i} style={{ position: "absolute", left: sunX - width / 2, top: sunY - 3 - i * 2, width, height: 2 + (i % 3), borderRadius: 8, background: `linear-gradient(90deg, transparent, ${accent}, rgba(255,255,255,.7), transparent)`, opacity: 0.13 + (i % 4) * .045, transform: `rotate(${rotation}deg)`, transformOrigin: "center", filter: "blur(1px)" }} />;
      })}
      {Array.from({ length: 24 }, (_, i) => {
        const x = (i * 173 + frame * (i % 3 + 1) * 0.6) % 2100 - 80;
        const y = (i * 97 + Math.sin(frame / 28 + i) * 44) % 1150 - 30;
        const size = 2 + i % 4;
        return <div key={i} style={{ position: "absolute", left: x, top: y, width: size, height: size, borderRadius: "50%", background: i % 3 ? accent : "#ffffff", opacity: .25 + (i % 4) * .12, boxShadow: `0 0 12px ${accent}` }} />;
      })}
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: "30%", background: "linear-gradient(180deg, transparent, rgba(1,5,14,.88))" }} />
      <div style={{ position: "absolute", left: 112, top: 88, display: "flex", alignItems: "center", gap: 14, fontSize: 18, letterSpacing: 4, color: accent, opacity: .95 }}>
        <div style={{ width: 34, height: 2, background: accent }} /> علمِ نور <span style={{ color: "rgba(255,255,255,.55)", letterSpacing: 2 }}> / 90 SEC</span>
      </div>
      <div style={{ position: "absolute", left: 112, top: "28%", width: 920, transform: `translateY(${enter}px) scale(${scale})`, transformOrigin: "left center", opacity: fade }}>
        <div style={{ fontSize: 21, letterSpacing: 5, color: accent, marginBottom: 26, fontWeight: 700 }}>{beat.kicker}</div>
        <div dir="rtl" style={{ whiteSpace: "pre-line", textAlign: "left", fontSize: beatIndex === 0 ? 108 : 88, lineHeight: 1.22, fontWeight: 800, letterSpacing: -2, textShadow: "0 8px 36px rgba(0,0,0,.22)" }}>{beat.title}</div>
        <div dir="rtl" style={{ textAlign: "left", marginTop: 32, fontSize: 29, lineHeight: 1.8, maxWidth: 820, color: "rgba(255,250,242,.86)", fontWeight: 400 }}>{beat.sub}</div>
      </div>
      <div style={{ position: "absolute", right: 112, bottom: 86, width: 250, textAlign: "right", color: "rgba(255,255,255,.68)", fontSize: 16, letterSpacing: 2 }}>
        <div style={{ height: 2, background: "rgba(255,255,255,.22)", marginBottom: 14 }}><div style={{ width: `${seconds / 90 * 100}%`, height: "100%", background: accent }} /></div>
        <div style={{ display: "flex", justifyContent: "space-between" }}><span>ATMOSPHERE</span><span>0{Math.floor(seconds / 10)}:{String(Math.floor(seconds % 60)).padStart(2, "0")}</span></div>
      </div>
      <div style={{ position: "absolute", left: 112, bottom: 88, fontSize: 15, letterSpacing: 3, color: "rgba(255,255,255,.45)" }}>LIGHT · AIR · COLOR</div>
    </AbsoluteFill>
  );
};
