import React from "react";
import {
  AbsoluteFill,
  Audio,
  interpolate,
  Sequence,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig
} from "remotion";
import type { CSSProperties } from "react";
import type { MotionPalette, MotionScene, MotionVideoProps } from "./types";

const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

const rgba = (hex: string, alpha: number) => {
  const value = hex.replace("#", "");
  const normalized = value.length === 3
    ? value.split("").map((ch) => ch + ch).join("")
    : value;
  const number = Number.parseInt(normalized, 16);
  const red = (number >> 16) & 255;
  const green = (number >> 8) & 255;
  const blue = number & 255;
  return "rgba(" + red + ", " + green + ", " + blue + ", " + alpha + ")";
};

const isRtlLanguage = (language: string) => /^(fa|ar|ur|he)(-|$)/i.test(language);
const clamp01 = (value: number) => Math.max(0, Math.min(1, value));
const splitCaptionSegments = (text: string, maxChars = 44) => {
  const words = String(text || "").trim().split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    const next = line ? line + " " + word : word;
    if (line && next.length > maxChars) { lines.push(line); line = word; }
    else line = next;
  }
  if (line) lines.push(line);
  const segments: string[] = [];
  for (let index = 0; index < lines.length; index += 2) {
    segments.push([lines[index], lines[index + 1]].filter(Boolean).join("\n"));
  }
  return segments;
};

const captionForFrame = (text: string, frame: number, spokenFrames: number) => {
  const segments = splitCaptionSegments(text);
  if (!segments.length || frame < 0 || frame >= Math.max(1, spokenFrames)) return "";
  const weights = segments.map((segment) => segment.split(/\s+/).filter(Boolean).length);
  const total = weights.reduce((sum, value) => sum + value, 0) || 1;
  const position = frame / Math.max(1, spokenFrames) * total;
  let accumulated = 0;
  for (let index = 0; index < segments.length; index += 1) {
    accumulated += weights[index];
    if (position < accumulated || index === segments.length - 1) return segments[index];
  }
  return segments[segments.length - 1];
};

const SceneBackdrop: React.FC<{ palette: MotionPalette; frame: number; index: number }> = ({ palette, frame, index }) => {
  const drift = interpolate(frame, [0, 150], [-2, 3], clamp);
  const spin = interpolate(frame, [0, 180], [0, index % 2 ? -16 : 19], clamp);
  const isLight = ["#F3F3EF", "#F7F1E4", "#EFE5D1", "#E9E3D4"].includes(palette.background.toUpperCase());
  return (
    <AbsoluteFill
      style={{
        background: "radial-gradient(ellipse at " + (68 + drift) + "% " + (16 + index % 3 * 11) + "%, " +
          rgba(palette.accent, isLight ? 0.11 : 0.18) + " 0%, transparent 43%), linear-gradient(128deg, " +
          palette.background + " 0%, " + palette.background + " 58%, " + rgba(palette.accent2, isLight ? 0.05 : 0.08) + " 100%)"
      }}
    >
      <AbsoluteFill
        style={{
          backgroundImage:
            "linear-gradient(" + spin + "deg, transparent 49.7%, " + rgba(palette.line, 0.22) +
            " 49.9%, transparent 50.1%), linear-gradient(90deg, " + rgba(palette.line, 0.11) +
            " 1px, transparent 1px), linear-gradient(" + rgba(palette.line, 0.11) +
            " 1px, transparent 1px)",
          backgroundSize: "100% 100%, 84px 84px, 84px 84px",
          maskImage: "linear-gradient(to bottom, rgba(0,0,0,0.7), transparent 92%)",
          opacity: 0.62
        }}
      />
      <div
        style={{
          position: "absolute",
          width: "52vw",
          height: "52vw",
          maxWidth: 1100,
          maxHeight: 1100,
          right: "-17%",
          bottom: "-55%",
          borderRadius: "50%",
          border: "1px solid " + rgba(palette.accent, 0.24),
          transform: "rotateX(64deg) rotateZ(" + spin + "deg)",
          boxShadow: "0 0 90px " + rgba(palette.accent, 0.05)
        }}
      />
      <div
        style={{
          position: "absolute",
          width: "37vw",
          height: "37vw",
          maxWidth: 820,
          maxHeight: 820,
          right: "-8%",
          bottom: "-43%",
          borderRadius: "50%",
          border: "1px solid " + rgba(palette.foreground, 0.11),
          transform: "rotateX(64deg) rotateZ(" + -spin * 0.7 + "deg)"
        }}
      />
    </AbsoluteFill>
  );
};

const Eyebrow: React.FC<{ text: string; palette: MotionPalette; typography: MotionVideoProps["typography"]; rtl: boolean }> = ({ text, palette, typography, rtl }) => (
  <div
    dir={rtl ? "rtl" : "ltr"}
    style={{
      fontFamily: typography.mono,
      fontSize: 18,
      letterSpacing: rtl ? 0 : 4,
      color: palette.accent,
      fontWeight: 700,
      lineHeight: 1.3,
      textTransform: rtl ? "none" : "uppercase"
    }}
  >
    {text}
  </div>
);

const SceneText: React.FC<{
  scene: MotionScene;
  palette: MotionPalette;
  typography: MotionVideoProps["typography"];
  rtl: boolean;
  vertical: boolean;
  frame: number;
  fps: number;
}> = ({ scene, palette, typography, rtl, vertical, frame, fps }) => {
  const rise = spring({ frame, fps, config: { damping: 18, stiffness: 105, mass: 0.9 } });
  const opacity = interpolate(frame, [0, 8, 20], [0, 0.35, 1], clamp);
  const titleY = interpolate(rise, [0, 1], [58, 0], clamp);
  const titleSize = vertical ? 76 : 92;
  const titleAlign = vertical ? "center" : rtl ? "right" : "left";
  const titleWidth = vertical ? "100%" : "78%";
  const bodySize = vertical ? 30 : 28;

  return (
    <div
      style={{
        width: titleWidth,
        textAlign: titleAlign as CSSProperties["textAlign"],
        direction: rtl ? "rtl" : "ltr",
        display: "flex",
        flexDirection: "column",
        alignItems: vertical ? "center" : rtl ? "flex-end" : "flex-start",
        opacity,
        transform: "translateY(" + titleY + "px)"
      }}
    >
      <Eyebrow text={scene.kicker} palette={palette} typography={typography} rtl={rtl} />
      <div
        style={{
          marginTop: 26,
          maxWidth: vertical ? "100%" : 1130,
          fontFamily: typography.display,
          fontSize: titleSize,
          lineHeight: 0.99,
          fontWeight: 800,
          letterSpacing: rtl ? 0 : -2.6,
          color: palette.foreground,
          textWrap: "balance" as CSSProperties["textWrap"],
          overflowWrap: "anywhere"
        }}
      >
        {scene.title}
      </div>
      {scene.body ? (
        <div
          dir={rtl ? "rtl" : "auto"}
          style={{
            marginTop: 26,
            maxWidth: vertical ? "96%" : 880,
            fontFamily: typography.body,
            fontSize: bodySize,
            lineHeight: 1.45,
            color: palette.muted,
            textWrap: "pretty" as CSSProperties["textWrap"],
            whiteSpace: "pre-wrap"
          }}
        >
          {scene.body}
        </div>
      ) : null}
      {scene.bullets && scene.bullets.length > 0 ? (
        <div
          style={{
            marginTop: 30,
            display: "flex",
            justifyContent: vertical ? "center" : rtl ? "flex-end" : "flex-start",
            flexWrap: "wrap",
            gap: 10
          }}
        >
          {scene.bullets.slice(0, 4).map((bullet, idx) => (
            <div
              key={bullet + idx}
              dir={rtl ? "rtl" : "auto"}
              style={{
                border: "1px solid " + rgba(palette.foreground, 0.21),
                background: rgba(palette.panel, 0.8),
                borderRadius: 999,
                padding: "10px 16px",
                fontFamily: typography.body,
                fontSize: 18,
                color: idx === 0 ? palette.accent2 : palette.foreground
              }}
            >
              {bullet}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
};

const DiagramGraphic: React.FC<{ scene: MotionScene; palette: MotionPalette; frame: number; vertical: boolean; typography: MotionVideoProps["typography"] }> = ({ scene, palette, frame, vertical, typography }) => {
  const labels = (scene.bullets && scene.bullets.length ? scene.bullets : ["INPUT", "PROCESS", "OUTCOME"]).slice(0, 4);
  const progress = interpolate(frame, [2, 46], [0, labels.length], clamp);
  const positions = labels.map((_, index) => ({
    x: vertical ? 500 : 115 + (index * (770 / Math.max(1, labels.length - 1))),
    y: vertical ? 95 + index * 125 : 180 + (index % 2) * 210
  }));
  return (
    <svg viewBox="0 0 1000 560" style={{ width: "100%", height: "100%", overflow: "visible" }}>
      {positions.slice(0, -1).map((p, idx) => {
        const next = positions[idx + 1];
        return (
          <line
            key={"link-" + idx}
            x1={p.x}
            y1={p.y}
            x2={next.x}
            y2={next.y}
            stroke={rgba(palette.accent, 0.8)}
            strokeWidth="2"
            strokeDasharray="9 9"
            strokeDashoffset={Math.max(0, 100 - (frame - idx * 8) * 3)}
          />
        );
      })}
      {positions.map((p, idx) => {
        const active = progress >= idx + 0.5;
        const scale = spring({ frame: Math.max(0, frame - idx * 8), fps: 30, config: { damping: 13, stiffness: 120 } });
        return (
          <g key={labels[idx]} transform={"translate(" + p.x + " " + p.y + ") scale(" + scale + ")"}>
            <circle r="66" fill={rgba(palette.accent, active ? 0.18 : 0.05)} stroke={active ? palette.accent : palette.line} strokeWidth="2" />
            <circle r="9" fill={active ? palette.accent2 : palette.muted} />
            <text
              y="102"
              textAnchor="middle"
              fill={palette.foreground}
              fontFamily={typography.mono}
              fontSize="21"
            >
              {labels[idx].length > 15 ? labels[idx].slice(0, 14) + "…" : labels[idx]}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

const TimelineGraphic: React.FC<{ scene: MotionScene; palette: MotionPalette; frame: number; vertical: boolean; typography: MotionVideoProps["typography"] }> = ({ scene, palette, frame, vertical, typography }) => {
  const labels = (scene.bullets && scene.bullets.length ? scene.bullets : ["BEGIN", "SHIFT", "NEXT"]).slice(0, 4);
  const progress = interpolate(frame, [0, 56], [0, 1], clamp);
  return (
    <div style={{ position: "relative", width: "100%", height: "100%", display: "flex", flexDirection: vertical ? "column" : "row", alignItems: "center", justifyContent: "space-around", padding: vertical ? "20px 6%" : "8% 2%" }}>
      <div style={{ position: "absolute", left: vertical ? "49%" : "8%", right: vertical ? "auto" : "8%", top: vertical ? "8%" : "49%", bottom: vertical ? "8%" : "auto", width: vertical ? 2 : "auto", height: vertical ? "84%" : 2, background: palette.line }}>
        <div style={{ position: "absolute", inset: 0, width: vertical ? 2 : String(progress * 100) + "%", height: vertical ? String(progress * 100) + "%" : 2, background: palette.accent }} />
      </div>
      {labels.map((label, idx) => {
        const active = progress >= (idx + 0.25) / labels.length;
        return (
          <div key={label + idx} style={{ position: "relative", display: "flex", flexDirection: vertical ? "row" : "column", alignItems: "center", justifyContent: "center", gap: 14, width: vertical ? "100%" : 160, minHeight: vertical ? 95 : undefined, margin: vertical ? "0" : undefined }}>
            <div style={{ width: 18, height: 18, borderRadius: "50%", background: active ? palette.accent : palette.background, border: "2px solid " + (active ? palette.accent2 : palette.line), boxShadow: active ? "0 0 24px " + rgba(palette.accent, 0.5) : "none", zIndex: 1 }} />
            <div dir="auto" style={{ color: active ? palette.foreground : palette.muted, fontFamily: typography.body, fontSize: vertical ? 24 : 20, fontWeight: active ? 700 : 500, textAlign: vertical ? "left" : "center", minWidth: vertical ? 180 : undefined, flex: vertical ? 1 : undefined }}>{label}</div>
          </div>
        );
      })}
    </div>
  );
};

const CompareGraphic: React.FC<{ scene: MotionScene; palette: MotionPalette; frame: number; typography: MotionVideoProps["typography"] }> = ({ scene, palette, frame, typography }) => {
  const labels = (scene.bullets && scene.bullets.length ? scene.bullets : ["STRUCTURE", "BEHAVIOR", "IMPACT"]).slice(0, 3);
  return (
    <div style={{ height: "100%", width: "100%", display: "flex", alignItems: "stretch", gap: 18, padding: "7% 2%" }}>
      {labels.map((label, idx) => {
        const h = interpolate(frame, [5 + idx * 7, 48 + idx * 7], [12, 90], clamp);
        return (
          <div key={label} style={{ flex: 1, borderTop: "1px solid " + palette.line, display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "22px 18px", background: "linear-gradient(180deg, " + rgba(palette.accent, 0.10 + idx * 0.03) + ", transparent 78%)" }}>
            <div style={{ color: palette.muted, fontFamily: typography.mono, fontSize: 17 }}>0{idx + 1} / DIMENSION</div>
            <div style={{ height: "62%", display: "flex", alignItems: "flex-end", gap: 5 }}>
              {Array.from({ length: 5 }).map((_, bar) => (
                <div key={bar} style={{ flex: 1, height: String(Math.max(12, Math.min(96, h - bar * 7 + ((idx + bar) % 3) * 5))) + "%", background: bar === 4 ? palette.accent2 : palette.accent, opacity: 0.25 + bar * 0.15 }} />
              ))}
            </div>
            <div dir="auto" style={{ color: palette.foreground, fontFamily: typography.display, fontSize: 31, fontWeight: 700 }}>{label}</div>
          </div>
        );
      })}
    </div>
  );
};

const ParticleGraphic: React.FC<{ scene: MotionScene; palette: MotionPalette; frame: number; typography: MotionVideoProps["typography"] }> = ({ scene, palette, frame, typography }) => {
  const points = Array.from({ length: 38 }, (_, i) => {
    const x0 = (i * 173 + 31) % 980;
    const y0 = (i * 97 + 53) % 550;
    const x = x0 + Math.sin(frame / (13 + i % 11) + i) * (14 + (i % 7) * 4);
    const y = y0 + Math.cos(frame / (19 + i % 9) + i * 1.7) * (10 + (i % 5) * 5);
    return { x, y, radius: 2 + (i % 4), alpha: 0.2 + (i % 5) * 0.14 };
  });
  return (
    <svg viewBox="0 0 1000 560" style={{ width: "100%", height: "100%" }}>
      {points.map((point, idx) => {
        const other = points[(idx + 7) % points.length];
        return idx % 2 === 0 ? <line key={"l" + idx} x1={point.x} y1={point.y} x2={other.x} y2={other.y} stroke={rgba(palette.accent, 0.15)} strokeWidth="1" /> : null;
      })}
      {points.map((point, idx) => <circle key={"p" + idx} cx={point.x} cy={point.y} r={point.radius} fill={idx % 6 === 0 ? palette.accent2 : palette.accent} opacity={point.alpha} />)}
      <circle cx="500" cy="280" r={100 + Math.sin(frame / 20) * 12} fill="none" stroke={rgba(palette.accent2, 0.6)} strokeWidth="2" />
      <circle cx="500" cy="280" r={145 + Math.cos(frame / 27) * 8} fill="none" stroke={rgba(palette.foreground, 0.18)} strokeWidth="1" strokeDasharray="4 12" />
      <text x="500" y="288" textAnchor="middle" fontSize="25" fill={palette.foreground} fontFamily={typography.mono}>SYSTEM</text>
    </svg>
  );
};

const MapGraphic: React.FC<{ scene: MotionScene; palette: MotionPalette; frame: number; typography: MotionVideoProps["typography"] }> = ({ scene, palette, frame, typography }) => {
  const labels = (scene.bullets && scene.bullets.length ? scene.bullets : ["ORIGIN", "SHIFT", "OUTCOME"]).slice(0, 3);
  const reveal = interpolate(frame, [0, 52], [0, 1], clamp);
  return (
    <svg viewBox="0 0 1000 560" style={{ width: "100%", height: "100%" }}>
      <path d="M 60 400 C 210 160, 300 450, 470 240 S 770 180, 930 320" fill="none" stroke={rgba(palette.foreground, 0.14)} strokeWidth="80" strokeLinecap="round" />
      <path d="M 60 400 C 210 160, 300 450, 470 240 S 770 180, 930 320" fill="none" stroke={palette.accent} strokeWidth="3" strokeDasharray="1400" strokeDashoffset={1400 * (1 - reveal)} />
      {[[90, 360], [340, 338], [590, 213], [910, 300]].map((point, idx) => (
        <g key={idx}>
          <circle cx={point[0]} cy={point[1]} r={12 + ((frame + idx * 9) % 20) / 4} fill={palette.accent2} opacity={0.7} />
          <circle cx={point[0]} cy={point[1]} r="29" fill="none" stroke={rgba(palette.accent2, 0.48)} strokeWidth="1" />
          <text x={point[0]} y={point[1] + 58} textAnchor="middle" fill={palette.foreground} fontSize="19" fontFamily={typography.mono}>{labels[Math.min(idx, labels.length - 1)].slice(0, 13)}</text>
        </g>
      ))}
    </svg>
  );
};

const InterfaceGraphic: React.FC<{ scene: MotionScene; palette: MotionPalette; frame: number; typography: MotionVideoProps["typography"] }> = ({ scene, palette, frame, typography }) => {
  const reveal = interpolate(frame, [4, 36], [0, 1], clamp);
  const labels = (scene.bullets && scene.bullets.length ? scene.bullets : ["OVERVIEW", "DETAIL", "NEXT STEP"]).slice(0, 3);
  return (
    <div style={{ height: "100%", width: "100%", padding: "5%", display: "grid", gridTemplateColumns: "0.8fr 1.5fr", gap: 15, transform: "translateY(" + (1 - reveal) * 35 + "px)", opacity: reveal }}>
      <div style={{ border: "1px solid " + palette.line, background: rgba(palette.panel, 0.78), padding: 20, display: "flex", flexDirection: "column", gap: 16 }}>
        {labels.map((label, idx) => <div key={label} dir="auto" style={{ borderLeft: idx === 0 ? "3px solid " + palette.accent : "3px solid transparent", background: idx === 0 ? rgba(palette.accent, 0.12) : "transparent", padding: 12, color: idx === 0 ? palette.foreground : palette.muted, fontSize: 20, fontFamily: typography.body }}>{label}</div>)}
      </div>
      <div style={{ border: "1px solid " + palette.line, background: rgba(palette.panel, 0.46), padding: 22, display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ width: "58%", height: 12, background: palette.muted, opacity: 0.5 }} />
        <div style={{ width: "82%", height: 32, background: palette.accent, opacity: 0.72 }} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, flex: 1 }}>
          {[0, 1, 2].map((idx) => <div key={idx} style={{ border: "1px solid " + palette.line, background: rgba(palette.accent2, 0.09), position: "relative", overflow: "hidden" }}><div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: (22 + idx * 20 + Math.sin(frame / 13 + idx) * 6) + "%", background: rgba(palette.accent, 0.4) }} /></div>)}
        </div>
      </div>
    </div>
  );
};

const DataGraphic: React.FC<{ scene: MotionScene; palette: MotionPalette; frame: number; typography: MotionVideoProps["typography"] }> = ({ scene, palette, frame, typography }) => {
  const labels = (scene.bullets && scene.bullets.length ? scene.bullets : ["SIGNAL", "CONTEXT", "CHANGE"]).slice(0, 3);
  const heights = [0.48, 0.79, 0.61];
  const progress = interpolate(frame, [0, 44], [0, 1], clamp);
  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", padding: "8% 5%" }}>
      <div style={{ height: 1, background: palette.line, marginBottom: 32 }} />
      <div style={{ flex: 1, display: "flex", alignItems: "flex-end", justifyContent: "space-around", gap: 22, borderBottom: "2px solid " + palette.foreground, padding: "0 3%" }}>
        {labels.map((label, idx) => {
          const h = Math.max(8, heights[idx] * 100 * progress);
          return (
            <div key={label} style={{ flex: 1, height: "100%", display: "flex", flexDirection: "column", justifyContent: "flex-end", alignItems: "stretch" }}>
              <div style={{ height: h + "%", background: idx === 1 ? palette.accent2 : palette.accent, transformOrigin: "bottom", minHeight: 8, opacity: 0.88 }} />
              <div dir="auto" style={{ color: palette.foreground, fontSize: 19, fontFamily: typography.mono, marginTop: 16, marginBottom: 13, textAlign: "center" }}>{label}</div>
            </div>
          );
        })}
      </div>
      <div style={{ marginTop: 17, fontSize: 14, color: palette.muted, fontFamily: typography.mono, letterSpacing: 2 }}>CONCEPTUAL RELATIONSHIP · NOT MEASURED DATA</div>
    </div>
  );
};

const QuoteGraphic: React.FC<{ scene: MotionScene; palette: MotionPalette; frame: number; typography: MotionVideoProps["typography"]; rtl: boolean }> = ({ scene, palette, frame, typography, rtl }) => {
  const x = interpolate(frame, [0, 28], [60, 0], clamp);
  return (
    <div style={{ position: "relative", padding: "9% 7%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", borderLeft: "3px solid " + palette.accent, transform: "translateX(" + (rtl ? -x : x) + "px)" }}>
      <div style={{ fontSize: 118, lineHeight: 0.7, color: palette.accent, fontFamily: typography.display }}>“</div>
      <div dir={rtl ? "rtl" : "auto"} style={{ color: palette.foreground, fontFamily: typography.display, fontSize: 54, lineHeight: 1.08, fontWeight: 700, textWrap: "balance" as CSSProperties["textWrap"] }}>{scene.title}</div>
      {scene.body ? <div dir={rtl ? "rtl" : "auto"} style={{ marginTop: 25, color: palette.muted, fontFamily: typography.body, fontSize: 24, lineHeight: 1.5 }}>{scene.body}</div> : null}
    </div>
  );
};

const LayoutGraphic: React.FC<{ scene: MotionScene; palette: MotionPalette; frame: number; vertical: boolean; typography: MotionVideoProps["typography"]; rtl: boolean }> = ({ scene, palette, frame, vertical, typography, rtl }) => {
  switch (scene.layout) {
    case "hero":
      return (
        <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", position: "relative" }}>
          <div style={{ position: "absolute", width: vertical ? "76vw" : "28vw", height: vertical ? "76vw" : "28vw", maxWidth: 650, maxHeight: 650, border: "1px solid " + rgba(palette.accent, 0.62), borderRadius: "50%", transform: "rotateX(60deg) rotateZ(" + interpolate(frame, [0, 90], [-24, 32], clamp) + "deg) scale(" + interpolate(frame, [0, 30], [0.76, 1], clamp) + ")" }} />
          <div style={{ fontFamily: typography.mono, color: palette.accent2, letterSpacing: 4, fontSize: 19 }}>THE CORE IDEA</div>
          <div style={{ position: "relative", marginTop: 24, width: "100%", height: "56%", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: 1, height: "100%", background: rgba(palette.foreground, 0.12), position: "absolute", left: "50%" }} />
            <div style={{ position: "absolute", bottom: "15%", width: "64%", height: 3, background: palette.accent, transform: "scaleX(" + interpolate(frame, [0, 30], [0, 1], clamp) + ")" }} />
          </div>
        </div>
      );
    case "diagram":
      return <DiagramGraphic scene={scene} palette={palette} frame={frame} vertical={vertical} typography={typography} />;
    case "timeline":
      return <TimelineGraphic scene={scene} palette={palette} frame={frame} vertical={vertical} typography={typography} />;
    case "compare":
      return <CompareGraphic scene={scene} palette={palette} frame={frame} typography={typography} />;
    case "data":
      return <DataGraphic scene={scene} palette={palette} frame={frame} typography={typography} />;
    case "particles":
      return <ParticleGraphic scene={scene} palette={palette} frame={frame} typography={typography} />;
    case "map":
      return <MapGraphic scene={scene} palette={palette} frame={frame} typography={typography} />;
    case "interface":
      return <InterfaceGraphic scene={scene} palette={palette} frame={frame} typography={typography} />;
    case "quote":
      return <QuoteGraphic scene={scene} palette={palette} frame={frame} typography={typography} rtl={rtl} />;
    case "outro":
      return (
        <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center", position: "relative", padding: "5%" }}>
          <div style={{ fontFamily: typography.mono, color: palette.accent, fontSize: 19, letterSpacing: 4 }}>TAKE THE IDEA WITH YOU</div>
          <div dir={rtl ? "rtl" : "auto"} style={{ fontFamily: typography.display, color: palette.foreground, fontSize: vertical ? 68 : 84, fontWeight: 800, lineHeight: 1.02, marginTop: 26, textWrap: "balance" as CSSProperties["textWrap"] }}>{scene.title}</div>
          {scene.body ? <div dir={rtl ? "rtl" : "auto"} style={{ maxWidth: 720, marginTop: 24, color: palette.muted, fontFamily: typography.body, fontSize: 25, lineHeight: 1.45 }}>{scene.body}</div> : null}
          <div style={{ marginTop: 34, width: 90, height: 3, background: palette.accent2, transform: "scaleX(" + interpolate(frame, [0, 24], [0, 1], clamp) + ")" }} />
        </div>
      );
    case "editorial":
    default:
      return (
        <div style={{ height: "100%", width: "100%", padding: "6%", display: "flex", flexDirection: "column", justifyContent: "center", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: "9%", right: "3%", fontFamily: typography.display, fontSize: vertical ? 100 : 180, color: rgba(palette.accent, 0.12), fontWeight: 900, transform: "translateX(" + interpolate(frame, [0, 80], [50, -40], clamp) + "px)" }}>MOTION</div>
          <div dir={rtl ? "rtl" : "auto"} style={{ position: "relative", fontFamily: typography.display, fontWeight: 800, fontSize: vertical ? 72 : 104, lineHeight: 0.97, color: palette.foreground, maxWidth: "94%", textWrap: "balance" as CSSProperties["textWrap"] }}>{scene.title}</div>
          <div style={{ width: "36%", minWidth: 100, height: 4, marginTop: 26, background: palette.accent, transform: "scaleX(" + interpolate(frame, [0, 22], [0, 1], clamp) + ")", transformOrigin: rtl ? "right" : "left" }} />
          {scene.body ? <div dir={rtl ? "rtl" : "auto"} style={{ fontFamily: typography.body, color: palette.muted, fontSize: vertical ? 25 : 28, lineHeight: 1.45, marginTop: 24, maxWidth: 840 }}>{scene.body}</div> : null}
        </div>
      );
  }
};

const SceneView: React.FC<{
  scene: MotionScene;
  palette: MotionPalette;
  typography: MotionVideoProps["typography"];
  props: MotionVideoProps;
  index: number;
  sceneCount: number;
  offset: number;
}> = ({ scene, palette, typography, props, index, sceneCount, offset }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const vertical = height > width;
  const rtl = isRtlLanguage(props.language);
  const entrance = interpolate(frame, [0, 18], [0, 1], clamp);
  const exit = interpolate(frame, [scene.durationInFrames - 12, scene.durationInFrames], [1, 0], clamp);
  const opacity = clamp01(Math.min(entrance, exit));
  const sceneProgress = (offset + frame) / Math.max(1, props.durationInFrames);
  const transition = scene.transition || (index % 4 === 0 ? "wipe" : index % 4 === 1 ? "scale" : index % 4 === 2 ? "split" : "fade");
  const wipe = interpolate(frame, [0, 18], [0, 100], clamp);
  const zoom = interpolate(frame, [0, 22], [0.95, 1], clamp);
  const clipPath = transition === "wipe" ? "inset(0 " + (100 - wipe) + "% 0 0)" : transition === "split" ? "inset(0 0 0 " + (50 * (1 - entrance)) + "%)" : "none";
  const margin = vertical ? "6%" : "7.5%";
  const mainGraphicWidth = vertical ? "92%" : "53%";
  const textWidth = vertical ? "100%" : "43%";
  const horizontalTextAlign = rtl ? "flex-end" : "flex-start";

  return (
    <AbsoluteFill style={{ opacity }}>
      <SceneBackdrop palette={palette} frame={frame} index={index} />
      <AbsoluteFill style={{ clipPath, transform: transition === "scale" ? "scale(" + zoom + ")" : "none" }}>
        <div style={{ position: "absolute", top: 34, left: margin, right: margin, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 34, height: 3, background: palette.accent }} />
            <div style={{ fontFamily: typography.mono, fontSize: 15, color: palette.muted, letterSpacing: rtl ? 0 : 3 }}>MOTION STUDIO / ORIGINAL FILM</div>
          </div>
          <div style={{ fontFamily: typography.mono, fontSize: 15, color: palette.muted }}>{String(index + 1).padStart(2, "0")} / {String(sceneCount).padStart(2, "0")}</div>
        </div>

        <div
          style={{
            position: "absolute",
            top: vertical ? "13%" : "16%",
            bottom: vertical ? "12%" : "13%",
            left: margin,
            right: margin,
            display: "flex",
            flexDirection: vertical ? "column" : "row",
            alignItems: "center",
            justifyContent: "space-between",
            gap: vertical ? 20 : 48
          }}
        >
          <div style={{ width: textWidth, height: vertical ? "42%" : "100%", display: "flex", alignItems: "center", justifyContent: horizontalTextAlign, zIndex: 3 }}>
            <SceneText scene={scene} palette={palette} typography={typography} rtl={rtl} vertical={vertical} frame={frame} fps={fps} />
          </div>
          <div style={{ width: mainGraphicWidth, height: vertical ? "47%" : "100%", minHeight: vertical ? 250 : undefined, position: "relative", zIndex: 2 }}>
            <LayoutGraphic scene={scene} palette={palette} frame={frame} vertical={vertical} typography={typography} rtl={rtl} />
          </div>
        </div>

        {props.captionsEnabled && scene.audioSrc && scene.narration ? (
          <div
            dir={rtl ? "rtl" : "auto"}
            style={{
              position: "absolute",
              left: margin,
              right: margin,
              bottom: 76,
              display: "flex",
              justifyContent: "center",
              zIndex: 5,
              pointerEvents: "none"
            }}
          >
            <div
              style={{
                maxWidth: vertical ? "96%" : "78%",
                minWidth: vertical ? "56%" : "38%",
                minHeight: vertical ? 54 : 58,
                padding: vertical ? "10px 16px" : "12px 22px",
                background: rgba(palette.background, 0.9),
                border: "1px solid " + rgba(palette.foreground, 0.16),
                borderRadius: 5,
                color: palette.foreground,
                fontFamily: typography.body,
                fontSize: vertical ? 22 : 24,
                lineHeight: 1.32,
                textAlign: "center",
                whiteSpace: "pre-wrap",
                boxShadow: "0 8px 30px " + rgba(palette.background, 0.22)
              }}
            >
              {captionForFrame(scene.narration, frame, scene.audioDurationInFrames || scene.durationInFrames)}
            </div>
          </div>
        ) : null}

        <div style={{ position: "absolute", left: margin, right: margin, bottom: 34, display: "flex", alignItems: "center", gap: 18 }}>
          <div style={{ height: 2, flex: 1, background: rgba(palette.foreground, 0.14), overflow: "hidden" }}>
            <div style={{ width: String(sceneProgress * 100) + "%", height: "100%", background: palette.accent }} />
          </div>
          <div style={{ fontFamily: typography.mono, fontSize: 13, color: palette.muted, letterSpacing: 2 }}>{props.styleId.replaceAll("-", " ").toUpperCase()}</div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const MotionVideo: React.FC<MotionVideoProps> = (props) => {
  const { fps } = useVideoConfig();
  const totalFrames = props.scenes.reduce((sum, scene) => sum + Math.max(1, scene.durationInFrames), 0);
  let offset = 0;
  const voiceRanges: Array<{ startFrame: number; endFrame: number }> = [];
  const sceneSequences = props.scenes.map((scene, index) => {
    const startFrame = offset;
    offset += Math.max(1, scene.durationInFrames);
    if (scene.audioSrc) {
      voiceRanges.push({ startFrame, endFrame: startFrame + Math.min(scene.durationInFrames, scene.audioDurationInFrames || scene.durationInFrames) });
    }
    return (
      <Sequence key={scene.id} from={startFrame} durationInFrames={scene.durationInFrames} name={scene.title}>
        <SceneView scene={scene} palette={props.palette} typography={props.typography} props={{ ...props, durationInFrames: totalFrames }} index={index} sceneCount={props.scenes.length} offset={startFrame} />
        {scene.audioSrc ? <Audio src={staticFile(scene.audioSrc)} volume={0.96} /> : null}
      </Sequence>
    );
  });
  return (
    <AbsoluteFill>
      {sceneSequences}
      {props.audioBedSrc ? (
        <Audio
          src={staticFile(props.audioBedSrc)}
          volume={(frame) => {
            const envelope = interpolate(frame, [0, fps * 2, Math.max(fps * 2, totalFrames - fps * 3), totalFrames], [0, 0.075, 0.075, 0], clamp);
            const narrationIsActive = voiceRanges.some((range) => frame >= range.startFrame && frame < range.endFrame);
            return narrationIsActive ? Math.min(envelope, 0.025) : envelope;
          }}
        />
      ) : null}
    </AbsoluteFill>
  );
};
