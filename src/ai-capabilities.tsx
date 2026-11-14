import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";

const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
const scenes = [
  { kicker: "هوش مصنوعی، فراتر از چت", title: "فقط جواب نمی‌دهد؛\nجهان می‌سازد.", body: "از ایده تا تصویر، از تحلیل تا صدا؛ ابزار تازه‌ای برای ساختن.", color: "#ef5b45", paper: "#f8d8a8", tag: "01 / تصور" },
  { kicker: "زبان و نوشتن", title: "فکرها را\nبه کلمه تبدیل کن.", body: "ایده‌پردازی، بازنویسی، خلاصه‌سازی و یادگیری؛ با هدایت تو.", color: "#f4b942", paper: "#f4e5c8", tag: "02 / کلمه" },
  { kicker: "تصویر، طراحی و ویدیو", title: "چیزی را تصور کن؛\nبعد به آن شکل بده.", body: "از طرح اولیه تا جهان‌های تصویری و روایت‌های متحرک.", color: "#db5e91", paper: "#f7d9e5", tag: "03 / تصویر" },
  { kicker: "تحلیل و حل مسئله", title: "الگوها را پیدا کن.\nراه تازه‌ای بساز.", body: "داده، کد و مسئله‌های پیچیده؛ قدم‌به‌قدم و با بررسی نتیجه.", color: "#31a6a0", paper: "#d3eee2", tag: "04 / کشف" },
  { kicker: "صدا و دسترس‌پذیری", title: "مرز زبان‌ها\nرا کوتاه‌تر کن.", body: "گفتار، ترجمه و زیرنویس می‌توانند محتوا را به آدم‌های بیشتری برسانند.", color: "#6b7de3", paper: "#dfe5fb", tag: "05 / صدا" },
  { kicker: "محدودیت‌ها را بشناس", title: "پاسخ روان،\nهمیشه پاسخ درست نیست.", body: "مدل‌ها ممکن است اشتباه کنند. ادعاهای مهم را با منبع معتبر بسنج.", color: "#df714a", paper: "#f6dfcb", tag: "06 / راستی‌آزمایی" },
  { kicker: "ابزار در دست انسان", title: "هوش مصنوعی پیشنهاد می‌دهد؛\nجهت را تو تعیین کن.", body: "خلاقیت انسانی، پرسش خوب و قضاوت دقیق، هنوز بخش اصلی ماجراست.", color: "#b5d75e", paper: "#eaf2cb", tag: "07 / خلق" },
];
const paper = ["#fff4dc", "#e8e0cc", "#f5d9c6", "#dce9df", "#dce3f5", "#f0d6d5"];
const mix = (a: number, b: number, t: number) => a + (b - a) * t;
const rgb = (hex: string) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
const blend = (a: string, b: string, t: number) => {
  const x = rgb(a), y = rgb(b);
  return `rgb(${x.map((v, i) => Math.round(mix(v, y[i], t))).join(",")})`;
};

const CutoutIcon: React.FC<{ scene: number; accent: string; frame: number }> = ({ scene, accent, frame }) => {
  const spin = Math.sin(frame / 34) * 5;
  const common = { position: "absolute" as const, filter: "drop-shadow(0 18px 8px rgba(29,24,19,.18))" };
  if (scene === 0) return <div style={{ ...common, left: 170, top: 190, width: 530, height: 460, transform: `rotate(${spin}deg)` }}>
    <div style={{ position: "absolute", left: 70, top: 10, width: 330, height: 330, borderRadius: "50%", background: "#f6b64c", border: "9px solid #fff0cf" }} />
    <div style={{ position: "absolute", left: 150, top: 75, width: 300, height: 240, background: "#f7e9cb", clipPath: "polygon(0 0,100% 8%,92% 100%,8% 92%)", transform: "rotate(9deg)" }} />
    <div style={{ position: "absolute", left: 210, top: 120, width: 250, height: 180, borderRadius: "40% 60% 55% 45%", background: accent, transform: "rotate(-13deg)" }} />
    <div style={{ position: "absolute", left: 270, top: 150, width: 140, height: 120, borderRadius: "50%", background: "#fff4dc", border: "7px solid #2d3038" }} />
    {Array.from({ length: 7 }, (_, i) => <div key={i} style={{ position: "absolute", left: 20 + i * 65, top: 360 + Math.sin(i) * 22, width: 42, height: 42, background: paper[i % paper.length], transform: `rotate(${i * 17}deg)`, border: "3px solid rgba(48,44,38,.12)" }} />)}
  </div>;
  if (scene === 1) return <div style={{ ...common, left: 170, top: 160, width: 520, height: 470, transform: `rotate(${spin}deg)` }}>
    <div style={{ position: "absolute", left: 90, top: 15, width: 310, height: 390, background: "#f8efdc", transform: "rotate(-8deg)", border: "2px solid #d9cdb7" }} />
    {Array.from({ length: 7 }, (_, i) => <div key={i} style={{ position: "absolute", left: 135, top: 80 + i * 39, width: 210 - (i % 3) * 35, height: i === 0 ? 13 : 7, background: i === 0 ? accent : "#b5a891", transform: `rotate(${i % 2 ? 1 : -1}deg)` }} />)}
    <div style={{ position: "absolute", left: 310, top: 225, width: 175, height: 175, background: "#f3c35b", border: "8px solid #fff1d3", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "#39342b", fontSize: 100, fontWeight: 900 }}>؟</div>
  </div>;
  if (scene === 2) return <div style={{ ...common, left: 155, top: 180, width: 560, height: 440, transform: `rotate(${spin}deg)` }}>
    <div style={{ position: "absolute", left: 35, top: 30, width: 290, height: 340, background: "#f4b94b", clipPath: "polygon(10% 0,100% 7%,92% 100%,0 90%)", transform: "rotate(-9deg)" }} />
    <div style={{ position: "absolute", left: 105, top: 70, width: 270, height: 280, background: "#f7e6c7", clipPath: "polygon(0 0,100% 4%,96% 100%,4% 92%)", transform: "rotate(7deg)" }} />
    <div style={{ position: "absolute", left: 180, top: 105, width: 210, height: 210, borderRadius: "50%", background: accent, border: "10px solid #f8e8d0" }} />
    <div style={{ position: "absolute", left: 335, top: 140, width: 150, height: 220, background: "#6c8bce", clipPath: "polygon(50% 0,100% 100%,0 82%)", transform: "rotate(18deg)" }} />
    <div style={{ position: "absolute", left: 230, top: 175, width: 115, height: 115, borderRadius: "50%", background: "#f8e8d0", opacity: .9 }} />
  </div>;
  if (scene === 3) return <div style={{ ...common, left: 170, top: 190, width: 530, height: 420, transform: `rotate(${spin}deg)` }}>
    <div style={{ position: "absolute", left: 30, top: 30, width: 420, height: 320, background: "#f6ecd7", transform: "rotate(-4deg)", border: "3px solid #d2c5ad" }} />
    {Array.from({ length: 5 }, (_, i) => <div key={i} style={{ position: "absolute", left: 85 + i * 67, top: 275 - [70, 125, 100, 185, 235][i], width: 48, height: [70, 125, 100, 185, 235][i], background: [accent, "#f4bd53", "#d96a4d", "#6f87d8", "#b5d75e"][i], transform: `rotate(${i % 2 ? 3 : -2}deg)`, border: "3px solid #fff4dc" }} />)}
    <svg style={{ position: "absolute", left: 65, top: 60 }} width="390" height="240" viewBox="0 0 390 240"><path d="M10 190 C75 140 105 170 150 95 S250 145 290 55 S345 70 380 15" fill="none" stroke="#37362f" strokeWidth="7" strokeLinecap="round" strokeDasharray="7 13" /></svg>
  </div>;
  if (scene === 4) return <div style={{ ...common, left: 185, top: 180, width: 510, height: 430, transform: `rotate(${spin}deg)` }}>
    <div style={{ position: "absolute", left: 65, top: 45, width: 340, height: 300, background: "#e9e4d5", clipPath: "polygon(0 12%,100% 0,94% 100%,7% 91%)", transform: "rotate(6deg)" }} />
    {Array.from({ length: 4 }, (_, i) => <div key={i} style={{ position: "absolute", left: 115 + i * 58, top: 125 + Math.sin(i * 1.4) * 24, width: 42, height: 160 + (i % 2) * 45, borderRadius: "50%", border: `8px solid ${i % 2 ? accent : "#4b5265"}`, transform: `rotate(${i * 18}deg)` }} />)}
    <div style={{ position: "absolute", left: 175, top: 80, width: 150, height: 150, borderRadius: "50%", border: "10px solid #fff4dc", background: accent, opacity: .9 }} />
  </div>;
  if (scene === 5) return <div style={{ ...common, left: 190, top: 190, width: 500, height: 410, transform: `rotate(${spin}deg)` }}>
    <div style={{ position: "absolute", left: 60, top: 20, width: 330, height: 330, background: "#f8ecd5", border: "7px solid #fff8e9", transform: "rotate(-8deg)" }} />
    <div style={{ position: "absolute", left: 155, top: 105, width: 160, height: 160, background: accent, clipPath: "polygon(50% 0,100% 100%,0 100%)", transform: "rotate(2deg)" }} />
    <div style={{ position: "absolute", left: 222, top: 160, width: 22, height: 65, background: "#fff4dc", borderRadius: 20 }} />
    <div style={{ position: "absolute", left: 222, top: 237, width: 22, height: 22, background: "#fff4dc", borderRadius: "50%" }} />
    <div style={{ position: "absolute", left: 10, top: 315, width: 130, height: 18, background: "#d9bca4", transform: "rotate(-12deg)" }} />
  </div>;
  return <div style={{ ...common, left: 165, top: 180, width: 540, height: 440, transform: `rotate(${spin}deg)` }}>
    <div style={{ position: "absolute", left: 60, top: 25, width: 350, height: 340, background: "#f5ecd5", clipPath: "polygon(4% 0,100% 8%,92% 100%,0 92%)", transform: "rotate(-5deg)" }} />
    <div style={{ position: "absolute", left: 145, top: 80, width: 190, height: 230, background: "#d8b08b", clipPath: "polygon(0 0,100% 5%,78% 100%,18% 82%)", transform: "rotate(10deg)" }} />
    <div style={{ position: "absolute", left: 175, top: 120, width: 140, height: 140, borderRadius: "50%", background: accent, border: "8px solid #fff4dc" }} />
    <div style={{ position: "absolute", left: 315, top: 80, width: 110, height: 160, background: "#6b7de3", clipPath: "polygon(50% 0,100% 100%,0 80%)", transform: "rotate(20deg)" }} />
  </div>;
};

export const AiCapabilitiesFilm: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const seconds = frame / fps;
  const sceneDuration = 65;
  const sceneIndex = Math.min(scenes.length - 1, Math.floor(seconds / (sceneDuration / scenes.length)));
  const scene = scenes[sceneIndex];
  const localFrame = frame - sceneIndex * Math.floor((sceneDuration / scenes.length) * fps);
  const progress = (seconds % (sceneDuration / scenes.length)) / (sceneDuration / scenes.length);
  const next = scenes[Math.min(sceneIndex + 1, scenes.length - 1)];
  const blendT = interpolate(progress, [0.82, 1], [0, 1], clamp);
  const bg = blend("#282b38", scene.paper, 0.16);
  const accent = blend(scene.color, next.color, blendT * 0.45);
  const enter = interpolate(localFrame, [0, 16, 32], [70, 20, 0], clamp);
  const scale = interpolate(localFrame, [0, 24, 130, 240], [0.94, 1.02, 1, 1.03], clamp);
  const titleOpacity = interpolate(localFrame, [0, 12, 25], [0, 0.65, 1], clamp);
  const exit = interpolate(progress, [0.88, 1], [1, 0], clamp);
  const paperShift = Math.sin(frame / 37) * 13;
  const reveal = interpolate(localFrame, [0, 24], [0, 1], clamp);

  return <AbsoluteFill style={{ overflow: "hidden", background: bg, color: "#272a32", fontFamily: "'Noto Sans Arabic', 'Noto Sans', Arial, sans-serif" }}>
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at 28% 40%, ${scene.paper} 0%, ${blend(scene.paper, "#e9dfca", .4)} 45%, #c9c1b2 100%)` }} />
    <AbsoluteFill style={{ opacity: .16, backgroundImage: "repeating-linear-gradient(8deg, transparent 0 4px, rgba(60,48,35,.12) 5px, transparent 6px 11px)", mixBlendMode: "multiply" }} />
    <div style={{ position: "absolute", left: -120, top: -120, width: 820, height: 1300, background: "#fff7e7", clipPath: "polygon(0 0,100% 8%,87% 100%,0 88%)", transform: `rotate(${-4 + paperShift * .05}deg)`, boxShadow: "22px 24px 0 rgba(50,43,34,.12)" }} />
    <div style={{ position: "absolute", right: -170, top: -100, width: 750, height: 1300, background: scene.paper, clipPath: "polygon(14% 0,100% 0,100% 100%,0 89%)", transform: `rotate(${2 + paperShift * .04}deg)`, boxShadow: "-20px 18px 0 rgba(50,43,34,.12)" }} />
    <div style={{ position: "absolute", right: 105, top: 92, width: 590, height: 740, background: "#fff8e8", clipPath: "polygon(3% 0,100% 5%,96% 100%,0 93%)", transform: `rotate(${-2 + paperShift * .025}deg)`, boxShadow: "0 22px 20px rgba(40,32,25,.16)" }} />
    <div style={{ position: "absolute", left: 105, top: 90, color: "#51483c", fontSize: 20, fontWeight: 800, letterSpacing: 3, opacity: .8 }}>قابِ نو / AI FIELD NOTES</div>
    <div style={{ position: "absolute", left: 105, top: 155, width: 105, height: 9, background: accent, transform: `rotate(-2deg) scaleX(${reveal})`, transformOrigin: "left" }} />
    <CutoutIcon scene={sceneIndex} accent={accent} frame={frame} />
    <div style={{ position: "absolute", left: 780, right: 155, top: 210, opacity: titleOpacity * exit, transform: `translateY(${enter}px) scale(${scale})`, transformOrigin: "right top" }}>
      <div dir="rtl" style={{ textAlign: "right", color: accent, fontSize: 25, fontWeight: 800, marginBottom: 30, letterSpacing: 1 }}>{scene.kicker}</div>
      <div dir="rtl" style={{ textAlign: "right", whiteSpace: "pre-line", fontSize: sceneIndex === 0 ? 66 : 59, lineHeight: 1.45, fontWeight: 900, letterSpacing: -1, color: "#252831", textShadow: "0 2px 0 rgba(255,255,255,.45)" }}>{scene.title}</div>
      <div style={{ width: 105, height: 7, margin: "26px 0 22px auto", background: accent, transform: `scaleX(${interpolate(localFrame, [15, 45], [0, 1], clamp)})`, transformOrigin: "right" }} />
      <div dir="rtl" style={{ textAlign: "right", fontSize: 25, lineHeight: 1.9, color: "#4a4b50", fontWeight: 500 }}>{scene.body}</div>
    </div>
    <div style={{ position: "absolute", left: 105, right: 105, bottom: 82, display: "flex", justifyContent: "space-between", alignItems: "center", color: "#4a473f", fontSize: 17, fontWeight: 800, letterSpacing: 2 }}>
      <span>{scene.tag}</span>
      <div style={{ width: 380, height: 5, background: "rgba(58,52,43,.18)", overflow: "hidden" }}><div style={{ width: `${seconds / 65 * 100}%`, height: "100%", background: accent }} /></div>
      <span>ایده ← ابزار ← انسان</span>
    </div>
    {Array.from({ length: 8 }, (_, i) => <div key={i} style={{ position: "absolute", left: (i * 247 + frame * (i % 2 ? .7 : -.35) + 1900) % 1900, top: 100 + (i * 113) % 850, width: 18 + (i % 3) * 8, height: 7 + (i % 3) * 4, background: i % 2 ? "#fff9e8" : accent, opacity: .65, transform: `rotate(${i * 31 + frame * .12}deg)`, boxShadow: "2px 3px 0 rgba(48,38,26,.12)" }} />)}
    <div style={{ position: "absolute", inset: 22, border: "1px solid rgba(54,46,36,.18)", pointerEvents: "none" }} />
    <AbsoluteFill style={{ pointerEvents: "none", opacity: .12, background: "linear-gradient(120deg, transparent 0%, rgba(255,255,255,.5) 45%, transparent 70%)", transform: `translateX(${interpolate(frame % 180, [0, 180], [-500, 2200])}px)` }} />
  </AbsoluteFill>;
};
